import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
import os
from dotenv import load_dotenv
from pathlib import Path
import uuid

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

async def seed_data():
    # Clear existing data
    await db.topics.delete_many({})
    await db.questions.delete_many({})
    
    # Topics
    topics = [
        {
            "id": "math-101",
            "title": "Mathematics",
            "description": "Algebra, Geometry, Calculus, and Mathematical Reasoning",
            "icon": "Calculator",
            "content": """# Mathematics Study Guide

## Core Concepts

### Algebra
Algebra is the study of mathematical symbols and the rules for manipulating these symbols. Key concepts include:
- Variables and expressions
- Linear equations and inequalities
- Quadratic equations
- Systems of equations
- Functions and graphs

### Geometry
Geometry deals with shapes, sizes, and properties of space:
- Points, lines, and angles
- Triangles and their properties
- Circles and their equations
- Area and perimeter calculations
- Volume and surface area

### Key Formulas
- Pythagorean Theorem: a² + b² = c²
- Quadratic Formula: x = (-b ± √(b² - 4ac)) / 2a
- Area of Circle: A = πr²
- Volume of Sphere: V = (4/3)πr³

### Practice Tips
1. Master basic arithmetic operations first
2. Practice word problems regularly
3. Understand the concepts before memorizing formulas
4. Draw diagrams for geometry problems
5. Check your work by substituting answers back
"""
        },
        {
            "id": "physics-101",
            "title": "Physics",
            "description": "Mechanics, Thermodynamics, Electromagnetism, and Modern Physics",
            "icon": "Atom",
            "content": """# Physics Study Guide

## Core Concepts

### Mechanics
The study of motion and forces:
- Newton's Laws of Motion
- Kinematics equations
- Work, Energy, and Power
- Momentum and collisions
- Circular motion

### Electricity and Magnetism
Understanding electrical phenomena:
- Ohm's Law: V = IR
- Electrical circuits
- Magnetic fields
- Electromagnetic induction

### Key Formulas
- Force: F = ma
- Kinetic Energy: KE = ½mv²
- Potential Energy: PE = mgh
- Power: P = W/t
- Ohm's Law: V = IR

### Important Concepts
1. **Conservation Laws**: Energy, momentum, and charge are conserved
2. **Vector vs Scalar**: Direction matters in physics
3. **Units**: Always include proper SI units
4. **Free Body Diagrams**: Essential for solving force problems

### Study Strategies
- Understand the physical meaning behind equations
- Practice dimensional analysis
- Draw diagrams for every problem
- Memorize key constants (g = 9.8 m/s²)
"""
        },
        {
            "id": "cs-101",
            "title": "Computer Science",
            "description": "Algorithms, Data Structures, Programming Concepts, and Problem Solving",
            "icon": "Code",
            "content": """# Computer Science Study Guide

## Core Concepts

### Programming Fundamentals
Basic building blocks of programming:
- Variables and data types
- Control structures (if, loops)
- Functions and methods
- Arrays and lists
- Object-oriented programming

### Data Structures
Ways to organize and store data:
- Arrays and Lists
- Stacks and Queues
- Linked Lists
- Trees and Graphs
- Hash Tables

### Algorithms
Common problem-solving approaches:
- Sorting (Bubble, Merge, Quick)
- Searching (Linear, Binary)
- Recursion
- Dynamic Programming
- Greedy Algorithms

### Complexity Analysis
- Time Complexity: O(1), O(n), O(log n), O(n²)
- Space Complexity
- Big-O notation

### Best Practices
1. Write clean, readable code
2. Comment your code appropriately
3. Test edge cases
4. Optimize after correctness
5. Use meaningful variable names

### Study Tips
- Practice coding daily
- Solve problems on coding platforms
- Understand algorithms before implementing
- Draw diagrams for data structures
"""
        },
        {
            "id": "aptitude-101",
            "title": "Aptitude",
            "description": "Logical Reasoning, Quantitative Aptitude, and Analytical Skills",
            "icon": "Brain",
            "content": """# Aptitude Study Guide

## Core Areas

### Quantitative Aptitude
Numerical problem-solving skills:
- Number systems
- Percentages and ratios
- Profit and loss
- Time and work
- Speed, distance, and time
- Probability and permutations

### Logical Reasoning
Pattern recognition and logical thinking:
- Series completion
- Analogies
- Blood relations
- Direction sense
- Coding-decoding
- Syllogisms

### Analytical Skills
Data interpretation and analysis:
- Tables and charts
- Graphs (bar, pie, line)
- Data sufficiency
- Venn diagrams

### Key Formulas
- Percentage: (Part/Whole) × 100
- Simple Interest: SI = (P × R × T) / 100
- Compound Interest: CI = P(1 + R/100)^T - P
- Speed = Distance / Time
- Probability = Favorable outcomes / Total outcomes

### Problem-Solving Strategy
1. Read the problem carefully
2. Identify what is given and what needs to be found
3. Choose the appropriate formula or method
4. Perform calculations step by step
5. Verify the answer makes logical sense

### Practice Tips
- Time yourself when solving problems
- Learn mental math shortcuts
- Practice regularly to improve speed
- Understand the logic behind formulas
"""
        }
    ]
    
    await db.topics.insert_many(topics)
    print("Topics seeded successfully")
    
    # Questions for Mathematics
    math_questions = [
        # Easy
        {
            "id": str(uuid.uuid4()),
            "topic_id": "math-101",
            "question": "What is 15% of 200?",
            "options": ["25", "30", "35", "40"],
            "correct_answer": 1,
            "difficulty": "easy",
            "explanation": "15% of 200 = (15/100) × 200 = 30"
        },
        {
            "id": str(uuid.uuid4()),
            "topic_id": "math-101",
            "question": "If x + 5 = 12, what is x?",
            "options": ["5", "6", "7", "8"],
            "correct_answer": 2,
            "difficulty": "easy",
            "explanation": "x = 12 - 5 = 7"
        },
        {
            "id": str(uuid.uuid4()),
            "topic_id": "math-101",
            "question": "What is the area of a square with side length 5?",
            "options": ["20", "25", "30", "35"],
            "correct_answer": 1,
            "difficulty": "easy",
            "explanation": "Area = side² = 5² = 25"
        },
        {
            "id": str(uuid.uuid4()),
            "topic_id": "math-101",
            "question": "What is 3/4 as a decimal?",
            "options": ["0.5", "0.6", "0.75", "0.8"],
            "correct_answer": 2,
            "difficulty": "easy",
            "explanation": "3 ÷ 4 = 0.75"
        },
        {
            "id": str(uuid.uuid4()),
            "topic_id": "math-101",
            "question": "What is 8 × 7?",
            "options": ["54", "56", "58", "60"],
            "correct_answer": 1,
            "difficulty": "easy",
            "explanation": "8 × 7 = 56"
        },
        # Medium
        {
            "id": str(uuid.uuid4()),
            "topic_id": "math-101",
            "question": "If 2x + 3 = 15, what is x?",
            "options": ["4", "5", "6", "7"],
            "correct_answer": 2,
            "difficulty": "medium",
            "explanation": "2x = 15 - 3 = 12, x = 6"
        },
        {
            "id": str(uuid.uuid4()),
            "topic_id": "math-101",
            "question": "What is the circumference of a circle with radius 7? (Use π = 22/7)",
            "options": ["42", "44", "46", "48"],
            "correct_answer": 1,
            "difficulty": "medium",
            "explanation": "Circumference = 2πr = 2 × (22/7) × 7 = 44"
        },
        {
            "id": str(uuid.uuid4()),
            "topic_id": "math-101",
            "question": "Simplify: (x² - 4) / (x - 2)",
            "options": ["x + 2", "x - 2", "x² + 2", "x² - 2"],
            "correct_answer": 0,
            "difficulty": "medium",
            "explanation": "(x² - 4) = (x + 2)(x - 2), so dividing by (x - 2) gives x + 2"
        },
        {
            "id": str(uuid.uuid4()),
            "topic_id": "math-101",
            "question": "If a:b = 2:3 and b:c = 4:5, what is a:c?",
            "options": ["8:15", "6:10", "2:5", "4:9"],
            "correct_answer": 0,
            "difficulty": "medium",
            "explanation": "a:b:c = 8:12:15, so a:c = 8:15"
        },
        {
            "id": str(uuid.uuid4()),
            "topic_id": "math-101",
            "question": "What is the value of √(144 + 25)?",
            "options": ["11", "12", "13", "14"],
            "correct_answer": 2,
            "difficulty": "medium",
            "explanation": "√(144 + 25) = √169 = 13"
        },
        # Hard
        {
            "id": str(uuid.uuid4()),
            "topic_id": "math-101",
            "question": "Solve: x² - 5x + 6 = 0",
            "options": ["x = 1, 6", "x = 2, 3", "x = -2, -3", "x = 1, 5"],
            "correct_answer": 1,
            "difficulty": "hard",
            "explanation": "(x - 2)(x - 3) = 0, so x = 2 or x = 3"
        },
        {
            "id": str(uuid.uuid4()),
            "topic_id": "math-101",
            "question": "If log₂(x) = 5, what is x?",
            "options": ["10", "25", "32", "64"],
            "correct_answer": 2,
            "difficulty": "hard",
            "explanation": "log₂(x) = 5 means 2⁵ = x, so x = 32"
        },
        {
            "id": str(uuid.uuid4()),
            "topic_id": "math-101",
            "question": "What is the derivative of x³ + 2x²?",
            "options": ["3x² + 2x", "3x² + 4x", "x² + 4x", "3x + 4"],
            "correct_answer": 1,
            "difficulty": "hard",
            "explanation": "d/dx(x³) = 3x², d/dx(2x²) = 4x, so total = 3x² + 4x"
        },
        {
            "id": str(uuid.uuid4()),
            "topic_id": "math-101",
            "question": "Find the sum of the arithmetic series: 2 + 5 + 8 + ... (20 terms)",
            "options": ["590", "610", "630", "650"],
            "correct_answer": 1,
            "difficulty": "hard",
            "explanation": "Sum = n/2 × (2a + (n-1)d) = 20/2 × (4 + 19×3) = 10 × 61 = 610"
        },
        {
            "id": str(uuid.uuid4()),
            "topic_id": "math-101",
            "question": "If sin(θ) = 3/5 and θ is acute, what is cos(θ)?",
            "options": ["3/5", "4/5", "5/3", "5/4"],
            "correct_answer": 1,
            "difficulty": "hard",
            "explanation": "Using Pythagorean identity: sin²(θ) + cos²(θ) = 1, cos(θ) = √(1 - 9/25) = 4/5"
        }
    ]
    
    # Questions for Physics
    physics_questions = [
        # Easy
        {
            "id": str(uuid.uuid4()),
            "topic_id": "physics-101",
            "question": "What is the SI unit of force?",
            "options": ["Joule", "Newton", "Watt", "Pascal"],
            "correct_answer": 1,
            "difficulty": "easy"
        },
        {
            "id": str(uuid.uuid4()),
            "topic_id": "physics-101",
            "question": "If a car travels 100 km in 2 hours, what is its average speed?",
            "options": ["40 km/h", "50 km/h", "60 km/h", "70 km/h"],
            "correct_answer": 1,
            "difficulty": "easy"
        },
        {
            "id": str(uuid.uuid4()),
            "topic_id": "physics-101",
            "question": "What is the acceleration due to gravity on Earth (approximately)?",
            "options": ["8.8 m/s²", "9.8 m/s²", "10.8 m/s²", "11.8 m/s²"],
            "correct_answer": 1,
            "difficulty": "easy"
        },
        {
            "id": str(uuid.uuid4()),
            "topic_id": "physics-101",
            "question": "Which of these is a vector quantity?",
            "options": ["Speed", "Distance", "Velocity", "Mass"],
            "correct_answer": 2,
            "difficulty": "easy"
        },
        {
            "id": str(uuid.uuid4()),
            "topic_id": "physics-101",
            "question": "What type of energy does a moving car possess?",
            "options": ["Potential", "Kinetic", "Thermal", "Chemical"],
            "correct_answer": 1,
            "difficulty": "easy"
        },
        # Medium
        {
            "id": str(uuid.uuid4()),
            "topic_id": "physics-101",
            "question": "A 10 kg object is accelerating at 5 m/s². What is the force applied?",
            "options": ["40 N", "50 N", "60 N", "70 N"],
            "correct_answer": 1,
            "difficulty": "medium"
        },
        {
            "id": str(uuid.uuid4()),
            "topic_id": "physics-101",
            "question": "What is the kinetic energy of a 2 kg object moving at 10 m/s?",
            "options": ["50 J", "100 J", "150 J", "200 J"],
            "correct_answer": 1,
            "difficulty": "medium"
        },
        {
            "id": str(uuid.uuid4()),
            "topic_id": "physics-101",
            "question": "If voltage is 12V and resistance is 4Ω, what is the current?",
            "options": ["2 A", "3 A", "4 A", "6 A"],
            "correct_answer": 1,
            "difficulty": "medium"
        },
        {
            "id": str(uuid.uuid4()),
            "topic_id": "physics-101",
            "question": "What is the momentum of a 5 kg object moving at 20 m/s?",
            "options": ["80 kg⋅m/s", "100 kg⋅m/s", "120 kg⋅m/s", "140 kg⋅m/s"],
            "correct_answer": 1,
            "difficulty": "medium"
        },
        {
            "id": str(uuid.uuid4()),
            "topic_id": "physics-101",
            "question": "A ball is thrown upward with velocity 30 m/s. What is maximum height? (g = 10 m/s²)",
            "options": ["35 m", "40 m", "45 m", "50 m"],
            "correct_answer": 2,
            "difficulty": "medium"
        },
        # Hard
        {
            "id": str(uuid.uuid4()),
            "topic_id": "physics-101",
            "question": "A 1000 kg car accelerates from rest to 20 m/s in 5 seconds. What is the average power?",
            "options": ["30 kW", "35 kW", "40 kW", "45 kW"],
            "correct_answer": 2,
            "difficulty": "hard"
        },
        {
            "id": str(uuid.uuid4()),
            "topic_id": "physics-101",
            "question": "Two resistors of 6Ω and 3Ω are connected in parallel. What is the equivalent resistance?",
            "options": ["1.5 Ω", "2 Ω", "2.5 Ω", "3 Ω"],
            "correct_answer": 1,
            "difficulty": "hard"
        },
        {
            "id": str(uuid.uuid4()),
            "topic_id": "physics-101",
            "question": "What is the time period of a simple pendulum of length 1 m? (g = 10 m/s²)",
            "options": ["1.8 s", "2.0 s", "2.2 s", "2.4 s"],
            "correct_answer": 1,
            "difficulty": "hard"
        },
        {
            "id": str(uuid.uuid4()),
            "topic_id": "physics-101",
            "question": "An object of mass 2 kg moves in a circle of radius 5 m at 10 m/s. What is the centripetal force?",
            "options": ["30 N", "40 N", "50 N", "60 N"],
            "correct_answer": 1,
            "difficulty": "hard"
        },
        {
            "id": str(uuid.uuid4()),
            "topic_id": "physics-101",
            "question": "What is the de Broglie wavelength of an electron moving at 10⁶ m/s? (h = 6.6×10⁻³⁴, m = 9.1×10⁻³¹)",
            "options": ["0.7 nm", "0.8 nm", "0.9 nm", "1.0 nm"],
            "correct_answer": 0,
            "difficulty": "hard"
        }
    ]
    
    # Questions for Computer Science
    cs_questions = [
        # Easy
        {
            "id": str(uuid.uuid4()),
            "topic_id": "cs-101",
            "question": "Which data structure uses LIFO (Last In First Out)?",
            "options": ["Queue", "Stack", "Array", "Tree"],
            "correct_answer": 1,
            "difficulty": "easy"
        },
        {
            "id": str(uuid.uuid4()),
            "topic_id": "cs-101",
            "question": "What is the time complexity of accessing an element in an array by index?",
            "options": ["O(1)", "O(n)", "O(log n)", "O(n²)"],
            "correct_answer": 0,
            "difficulty": "easy"
        },
        {
            "id": str(uuid.uuid4()),
            "topic_id": "cs-101",
            "question": "Which sorting algorithm has the best average time complexity?",
            "options": ["Bubble Sort", "Selection Sort", "Quick Sort", "Insertion Sort"],
            "correct_answer": 2,
            "difficulty": "easy"
        },
        {
            "id": str(uuid.uuid4()),
            "topic_id": "cs-101",
            "question": "What is a binary tree?",
            "options": ["Tree with 2 nodes", "Tree where each node has at most 2 children", "Tree with 2 levels", "Tree with binary values"],
            "correct_answer": 1,
            "difficulty": "easy"
        },
        {
            "id": str(uuid.uuid4()),
            "topic_id": "cs-101",
            "question": "Which keyword is used to define a function in Python?",
            "options": ["function", "def", "func", "define"],
            "correct_answer": 1,
            "difficulty": "easy"
        },
        # Medium
        {
            "id": str(uuid.uuid4()),
            "topic_id": "cs-101",
            "question": "What is the worst-case time complexity of binary search?",
            "options": ["O(1)", "O(log n)", "O(n)", "O(n log n)"],
            "correct_answer": 1,
            "difficulty": "medium"
        },
        {
            "id": str(uuid.uuid4()),
            "topic_id": "cs-101",
            "question": "In a graph, what is the degree of a vertex?",
            "options": ["Number of edges", "Number of vertices", "Number of edges connected to it", "Number of paths"],
            "correct_answer": 2,
            "difficulty": "medium"
        },
        {
            "id": str(uuid.uuid4()),
            "topic_id": "cs-101",
            "question": "Which algorithm is used to find the shortest path in a weighted graph?",
            "options": ["BFS", "DFS", "Dijkstra", "Binary Search"],
            "correct_answer": 2,
            "difficulty": "medium"
        },
        {
            "id": str(uuid.uuid4()),
            "topic_id": "cs-101",
            "question": "What is the space complexity of merge sort?",
            "options": ["O(1)", "O(log n)", "O(n)", "O(n²)"],
            "correct_answer": 2,
            "difficulty": "medium"
        },
        {
            "id": str(uuid.uuid4()),
            "topic_id": "cs-101",
            "question": "Which data structure is best for implementing a priority queue?",
            "options": ["Array", "Linked List", "Heap", "Stack"],
            "correct_answer": 2,
            "difficulty": "medium"
        },
        # Hard
        {
            "id": str(uuid.uuid4()),
            "topic_id": "cs-101",
            "question": "What is the time complexity of building a max heap from an unsorted array?",
            "options": ["O(n)", "O(n log n)", "O(log n)", "O(n²)"],
            "correct_answer": 0,
            "difficulty": "hard"
        },
        {
            "id": str(uuid.uuid4()),
            "topic_id": "cs-101",
            "question": "Which technique is used in dynamic programming?",
            "options": ["Divide and conquer", "Greedy approach", "Memoization", "Backtracking"],
            "correct_answer": 2,
            "difficulty": "hard"
        },
        {
            "id": str(uuid.uuid4()),
            "topic_id": "cs-101",
            "question": "What is the worst-case time complexity of AVL tree insertion?",
            "options": ["O(1)", "O(log n)", "O(n)", "O(n log n)"],
            "correct_answer": 1,
            "difficulty": "hard"
        },
        {
            "id": str(uuid.uuid4()),
            "topic_id": "cs-101",
            "question": "Which algorithm solves the 0/1 Knapsack problem optimally?",
            "options": ["Greedy", "Divide and Conquer", "Dynamic Programming", "Backtracking"],
            "correct_answer": 2,
            "difficulty": "hard"
        },
        {
            "id": str(uuid.uuid4()),
            "topic_id": "cs-101",
            "question": "What is the chromatic number of a complete graph with n vertices?",
            "options": ["1", "2", "n-1", "n"],
            "correct_answer": 3,
            "difficulty": "hard"
        }
    ]
    
    # Questions for Aptitude
    aptitude_questions = [
        # Easy
        {
            "id": str(uuid.uuid4()),
            "topic_id": "aptitude-101",
            "question": "If a book costs $20 and is on sale for 25% off, what is the sale price?",
            "options": ["$12", "$15", "$17", "$18"],
            "correct_answer": 1,
            "difficulty": "easy"
        },
        {
            "id": str(uuid.uuid4()),
            "topic_id": "aptitude-101",
            "question": "Complete the series: 2, 4, 6, 8, __",
            "options": ["9", "10", "11", "12"],
            "correct_answer": 1,
            "difficulty": "easy"
        },
        {
            "id": str(uuid.uuid4()),
            "topic_id": "aptitude-101",
            "question": "If 5 workers can complete a job in 10 days, how many days will 10 workers take?",
            "options": ["3 days", "5 days", "7 days", "8 days"],
            "correct_answer": 1,
            "difficulty": "easy"
        },
        {
            "id": str(uuid.uuid4()),
            "topic_id": "aptitude-101",
            "question": "What is 40% of 250?",
            "options": ["80", "90", "100", "110"],
            "correct_answer": 2,
            "difficulty": "easy"
        },
        {
            "id": str(uuid.uuid4()),
            "topic_id": "aptitude-101",
            "question": "A train travels 120 km in 3 hours. What is its speed?",
            "options": ["30 km/h", "35 km/h", "40 km/h", "45 km/h"],
            "correct_answer": 2,
            "difficulty": "easy"
        },
        # Medium
        {
            "id": str(uuid.uuid4()),
            "topic_id": "aptitude-101",
            "question": "If the ratio of boys to girls is 3:2 and there are 15 boys, how many girls are there?",
            "options": ["8", "10", "12", "15"],
            "correct_answer": 1,
            "difficulty": "medium"
        },
        {
            "id": str(uuid.uuid4()),
            "topic_id": "aptitude-101",
            "question": "A shopkeeper sells an item at $120 making a 20% profit. What was the cost price?",
            "options": ["$90", "$95", "$100", "$105"],
            "correct_answer": 2,
            "difficulty": "medium"
        },
        {
            "id": str(uuid.uuid4()),
            "topic_id": "aptitude-101",
            "question": "Find the next number: 3, 9, 27, 81, __",
            "options": ["162", "216", "243", "324"],
            "correct_answer": 2,
            "difficulty": "medium"
        },
        {
            "id": str(uuid.uuid4()),
            "topic_id": "aptitude-101",
            "question": "If A can do a work in 12 days and B in 15 days, how long will they take together?",
            "options": ["5.5 days", "6 days", "6.67 days", "7 days"],
            "correct_answer": 2,
            "difficulty": "medium"
        },
        {
            "id": str(uuid.uuid4()),
            "topic_id": "aptitude-101",
            "question": "What is the probability of getting a sum of 7 when rolling two dice?",
            "options": ["1/6", "1/5", "1/4", "1/3"],
            "correct_answer": 0,
            "difficulty": "medium"
        },
        # Hard
        {
            "id": str(uuid.uuid4()),
            "topic_id": "aptitude-101",
            "question": "A sum becomes $1560 in 2 years at 12% simple interest per annum. What is the principal?",
            "options": ["$1200", "$1250", "$1258", "$1300"],
            "correct_answer": 1,
            "difficulty": "hard"
        },
        {
            "id": str(uuid.uuid4()),
            "topic_id": "aptitude-101",
            "question": "Two trains 100m and 150m long, running at 40 km/h and 50 km/h cross each other in how many seconds?",
            "options": ["8 sec", "9 sec", "10 sec", "11 sec"],
            "correct_answer": 2,
            "difficulty": "hard"
        },
        {
            "id": str(uuid.uuid4()),
            "topic_id": "aptitude-101",
            "question": "How many ways can 5 people be arranged in a row?",
            "options": ["60", "100", "120", "150"],
            "correct_answer": 2,
            "difficulty": "hard"
        },
        {
            "id": str(uuid.uuid4()),
            "topic_id": "aptitude-101",
            "question": "A mixture contains milk and water in ratio 5:3. If 16 liters of water is added, ratio becomes 5:7. Find original quantity of milk.",
            "options": ["20 L", "25 L", "30 L", "35 L"],
            "correct_answer": 0,
            "difficulty": "hard"
        },
        {
            "id": str(uuid.uuid4()),
            "topic_id": "aptitude-101",
            "question": "The compound interest on $8000 at 15% per annum for 2 years is?",
            "options": ["$2480", "$2520", "$2580", "$2640"],
            "correct_answer": 2,
            "difficulty": "hard"
        }
    ]
    
    all_questions = math_questions + physics_questions + cs_questions + aptitude_questions
    await db.questions.insert_many(all_questions)
    print(f"Inserted {len(all_questions)} questions successfully")
    
    print("Database seeded successfully!")

if __name__ == "__main__":
    asyncio.run(seed_data())
