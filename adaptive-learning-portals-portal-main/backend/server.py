from fastapi import FastAPI, APIRouter, HTTPException, Depends
from fastapi.security import HTTPBearer
from fastapi.security.http import HTTPAuthorizationCredentials
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
import os
import logging
import json
import uuid
import random
from pathlib import Path
from pydantic import BaseModel, EmailStr
from typing import List, Optional, Dict, Any
from datetime import datetime, timezone, timedelta
import bcrypt
import jwt
import httpx
from supabase import create_client, Client

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

SUPABASE_URL = os.environ['SUPABASE_URL']
SUPABASE_SERVICE_KEY = os.environ['SUPABASE_SERVICE_KEY']
supabase: Client = create_client(SUPABASE_URL, SUPABASE_SERVICE_KEY)

app = FastAPI(title="LearnSmart AI")
api_router = APIRouter(prefix="/api")
security = HTTPBearer()

JWT_SECRET = os.environ.get('JWT_SECRET', 'learnsmart_ai_secret_change_me')
GEMINI_API_KEY = os.environ.get('GEMINI_API_KEY')

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# ── Models (pydantic v1 syntax) ───────────────────────────────────────────────

class UserSignup(BaseModel):
    name: str
    email: str
    password: str
    role: str = "student"

class UserLogin(BaseModel):
    email: str
    password: str

class TopicCreate(BaseModel):
    title: str
    description: str
    content: str
    icon: str

class QuestionCreate(BaseModel):
    topic_id: str
    question: str
    options: List[str]
    correct_answer: int
    difficulty: str
    explanation: Optional[str] = None

class AnswerSubmission(BaseModel):
    question_id: str
    selected_answer: int
    time_taken: float

class ExamSubmission(BaseModel):
    topic_id: str
    answers: List[AnswerSubmission]

# ── Auth helpers ──────────────────────────────────────────────────────────────

def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode(), bcrypt.gensalt()).decode()

def verify_password(password: str, hashed: str) -> bool:
    return bcrypt.checkpw(password.encode(), hashed.encode())

def create_token(user_id: str, email: str, role: str) -> str:
    payload = {
        "user_id": user_id,
        "email": email,
        "role": role,
        "exp": datetime.now(timezone.utc) + timedelta(days=7)
    }
    return jwt.encode(payload, JWT_SECRET, algorithm="HS256")

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    try:
        payload = jwt.decode(credentials.credentials, JWT_SECRET, algorithms=["HS256"])
        return payload
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")

# ── Gemini helper ─────────────────────────────────────────────────────────────

async def call_gemini(prompt: str) -> str:
    url = (
        f"https://generativelanguage.googleapis.com/v1beta/models/"
        f"gemini-1.5-flash:generateContent?key={GEMINI_API_KEY}"
    )
    payload = {
        "contents": [{"parts": [{"text": prompt}]}],
        "generationConfig": {"temperature": 0.7, "maxOutputTokens": 2048}
    }
    async with httpx.AsyncClient(timeout=30.0) as client:
        response = await client.post(url, json=payload)
        response.raise_for_status()
        data = response.json()
        return data["candidates"][0]["content"]["parts"][0]["text"]

# ── Routes ────────────────────────────────────────────────────────────────────

@api_router.get("/")
async def root():
    return {"message": "LearnSmart AI API is running"}

# Auth
@api_router.post("/auth/signup")
async def signup(user_data: UserSignup):
    existing = supabase.table("users").select("id").eq("email", user_data.email).execute()
    if existing.data:
        raise HTTPException(status_code=400, detail="Email already registered")
    uid = str(uuid.uuid4())
    doc = {
        "id": uid,
        "name": user_data.name,
        "email": user_data.email,
        "role": user_data.role,
        "password": hash_password(user_data.password),
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    supabase.table("users").insert(doc).execute()
    token = create_token(uid, user_data.email, user_data.role)
    return {"token": token, "user": {"id": uid, "name": user_data.name, "email": user_data.email, "role": user_data.role}}

@api_router.post("/auth/login")
async def login(credentials: UserLogin):
    result = supabase.table("users").select("*").eq("email", credentials.email).execute()
    if not result.data:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    user = result.data[0]
    if not verify_password(credentials.password, user["password"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    token = create_token(user["id"], user["email"], user["role"])
    return {"token": token, "user": {"id": user["id"], "name": user["name"], "email": user["email"], "role": user["role"]}}

@api_router.get("/auth/me")
async def get_me(current_user: dict = Depends(get_current_user)):
    result = supabase.table("users").select("id,name,email,role,created_at").eq("id", current_user["user_id"]).execute()
    if not result.data:
        raise HTTPException(status_code=404, detail="User not found")
    return result.data[0]

# Topics
@api_router.get("/topics")
async def get_topics():
    return supabase.table("topics").select("*").execute().data

@api_router.get("/topics/{topic_id}")
async def get_topic(topic_id: str):
    result = supabase.table("topics").select("*").eq("id", topic_id).execute()
    if not result.data:
        raise HTTPException(status_code=404, detail="Topic not found")
    return result.data[0]

@api_router.post("/topics")
async def create_topic(topic: TopicCreate, current_user: dict = Depends(get_current_user)):
    if current_user["role"] != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    doc = {**topic.dict(), "id": str(uuid.uuid4())}
    supabase.table("topics").insert(doc).execute()
    return doc

# Questions
@api_router.get("/questions/{topic_id}")
async def get_questions_by_topic(topic_id: str, difficulty: Optional[str] = None):
    q = supabase.table("questions").select("*").eq("topic_id", topic_id)
    if difficulty:
        q = q.eq("difficulty", difficulty)
    return q.execute().data

@api_router.post("/questions")
async def create_question(question: QuestionCreate, current_user: dict = Depends(get_current_user)):
    if current_user["role"] != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    doc = {**question.dict(), "id": str(uuid.uuid4())}
    supabase.table("questions").insert(doc).execute()
    return doc

@api_router.get("/questions/adaptive/{topic_id}/{difficulty}")
async def get_adaptive_question(topic_id: str, difficulty: str):
    result = supabase.table("questions").select("*").eq("topic_id", topic_id).eq("difficulty", difficulty).execute()
    if not result.data:
        raise HTTPException(status_code=404, detail="No questions found")
    return random.choice(result.data)

# Exam
@api_router.post("/exam/submit")
async def submit_exam(submission: ExamSubmission, current_user: dict = Depends(get_current_user)):
    user_id = current_user["user_id"]
    score = 0
    correct_count = 0
    difficulty_stats = {"easy": 0, "medium": 0, "hard": 0}
    responses = []

    for answer in submission.answers:
        result = supabase.table("questions").select("*").eq("id", answer.question_id).execute()
        if not result.data:
            continue
        q = result.data[0]
        is_correct = answer.selected_answer == q["correct_answer"]
        if is_correct:
            correct_count += 1
            score += {"easy": 1, "medium": 2, "hard": 3}.get(q["difficulty"], 1)
        difficulty_stats[q["difficulty"]] = difficulty_stats.get(q["difficulty"], 0) + 1
        responses.append({
            "id": str(uuid.uuid4()),
            "question_id": answer.question_id,
            "selected_answer": answer.selected_answer,
            "correct_answer": q["correct_answer"],
            "is_correct": is_correct,
            "time_taken": answer.time_taken,
            "difficulty": q["difficulty"],
            "question_text": q["question"]
        })

    total = len(submission.answers)
    accuracy = (correct_count / total * 100) if total > 0 else 0
    attempt = {
        "id": str(uuid.uuid4()),
        "user_id": user_id,
        "topic_id": submission.topic_id,
        "score": score,
        "total_questions": total,
        "correct_count": correct_count,
        "accuracy": accuracy,
        "difficulty_stats": difficulty_stats,
        "responses": responses,
        "completed_at": datetime.now(timezone.utc).isoformat()
    }
    supabase.table("attempts").insert(attempt).execute()
    return {"attempt_id": attempt["id"], "score": score, "total_questions": total,
            "correct_count": correct_count, "accuracy": accuracy, "difficulty_stats": difficulty_stats}

@api_router.get("/attempts/{attempt_id}")
async def get_attempt(attempt_id: str, current_user: dict = Depends(get_current_user)):
    result = supabase.table("attempts").select("*").eq("id", attempt_id).execute()
    if not result.data:
        raise HTTPException(status_code=404, detail="Attempt not found")
    attempt = result.data[0]
    if attempt["user_id"] != current_user["user_id"]:
        raise HTTPException(status_code=403, detail="Access denied")
    return attempt

# AI Analysis
@api_router.get("/analysis/{attempt_id}")
async def get_ai_analysis(attempt_id: str, current_user: dict = Depends(get_current_user)):
    attempt_res = supabase.table("attempts").select("*").eq("id", attempt_id).execute()
    if not attempt_res.data:
        raise HTTPException(status_code=404, detail="Attempt not found")
    attempt = attempt_res.data[0]

    existing = supabase.table("analyses").select("*").eq("attempt_id", attempt_id).execute()
    if existing.data:
        return existing.data[0]

    topic_res = supabase.table("topics").select("*").eq("id", attempt["topic_id"]).execute()
    topic = topic_res.data[0] if topic_res.data else None
    responses = attempt.get("responses", [])
    incorrect = [r for r in responses if not r["is_correct"]]

    prompt = f"""You are an expert educational AI analyzing a student's exam performance.

Exam Details:
- Topic: {topic['title'] if topic else 'Unknown'}
- Total Questions: {attempt['total_questions']}
- Score: {attempt['score']}
- Accuracy: {attempt['accuracy']:.1f}%
- Correct Answers: {attempt['correct_count']}
- Incorrect Answers: {len(incorrect)}
- Difficulty Distribution: {attempt['difficulty_stats']}

Incorrect Questions:
{chr(10).join([f"- {q['question_text']} (Difficulty: {q['difficulty']})" for q in incorrect[:5]])}

Respond ONLY with this exact JSON structure, no markdown or extra text:
{{
  "strengths": ["strength 1", "strength 2"],
  "weak_areas": ["weak area 1", "weak area 2"],
  "concept_gaps": ["gap 1", "gap 2"],
  "mistake_analysis": "detailed analysis here",
  "learning_insights": "personalized insights here",
  "recommendations": ["recommendation 1", "recommendation 2", "recommendation 3"],
  "personalized_content": "200 word study guide here"
}}"""

    try:
        raw = await call_gemini(prompt)
        clean = raw.strip()
        if "```" in clean:
            clean = clean.split("```")[1]
            if clean.startswith("json"):
                clean = clean[4:]
        analysis_data = json.loads(clean.strip())
        analysis = {"id": str(uuid.uuid4()), "attempt_id": attempt_id,
                    "user_id": current_user["user_id"], **analysis_data,
                    "created_at": datetime.now(timezone.utc).isoformat()}
        supabase.table("analyses").insert(analysis).execute()
        return analysis
    except Exception as e:
        logger.error(f"AI Analysis error: {e}")
        fallback = {
            "id": str(uuid.uuid4()), "attempt_id": attempt_id,
            "user_id": current_user["user_id"],
            "strengths": ["Completed the exam", "Showed persistence"],
            "weak_areas": list(attempt["difficulty_stats"].keys()),
            "concept_gaps": ["Review incorrect questions"],
            "mistake_analysis": f"You got {len(incorrect)} questions wrong.",
            "learning_insights": "Continue practicing to improve.",
            "recommendations": ["Review study material", "Practice more", "Focus on weak areas"],
            "personalized_content": "Keep practicing to improve.",
            "created_at": datetime.now(timezone.utc).isoformat()
        }
        supabase.table("analyses").insert(fallback).execute()
        return fallback

# Dashboard
@api_router.get("/dashboard/stats")
async def get_dashboard_stats(current_user: dict = Depends(get_current_user)):
    user_id = current_user["user_id"]
    attempts = supabase.table("attempts").select("*").eq("user_id", user_id).execute().data or []
    if not attempts:
        return {"total_attempts": 0, "average_accuracy": 0, "total_score": 0,
                "strong_topics": [], "weak_topics": [], "recent_attempts": []}

    total_attempts = len(attempts)
    average_accuracy = sum(a["accuracy"] for a in attempts) / total_attempts
    total_score = sum(a["score"] for a in attempts)

    topic_perf = {}
    for a in attempts:
        tid = a["topic_id"]
        topic_perf.setdefault(tid, {"accuracy": [], "scores": []})
        topic_perf[tid]["accuracy"].append(a["accuracy"])
        topic_perf[tid]["scores"].append(a["score"])

    topic_stats = []
    for tid, data in topic_perf.items():
        t_res = supabase.table("topics").select("title").eq("id", tid).execute()
        title = t_res.data[0]["title"] if t_res.data else "Unknown"
        topic_stats.append({
            "topic_id": tid, "topic_name": title,
            "avg_accuracy": sum(data["accuracy"]) / len(data["accuracy"]),
            "attempts": len(data["accuracy"])
        })
    topic_stats.sort(key=lambda x: x["avg_accuracy"], reverse=True)

    recent = sorted(attempts, key=lambda x: x["completed_at"], reverse=True)[:5]
    for r in recent:
        t_res = supabase.table("topics").select("title").eq("id", r["topic_id"]).execute()
        r["topic_name"] = t_res.data[0]["title"] if t_res.data else "Unknown"

    return {"total_attempts": total_attempts, "average_accuracy": round(average_accuracy, 2),
            "total_score": total_score, "strong_topics": topic_stats[:3],
            "weak_topics": list(reversed(topic_stats))[:3], "recent_attempts": recent}

# Admin
@api_router.get("/admin/analytics")
async def get_admin_analytics(current_user: dict = Depends(get_current_user)):
    if current_user["role"] != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    return {
        "total_users": len(supabase.table("users").select("id").eq("role", "student").execute().data),
        "total_attempts": len(supabase.table("attempts").select("id").execute().data),
        "total_questions": len(supabase.table("questions").select("id").execute().data)
    }

app.include_router(api_router)
app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)
