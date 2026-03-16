import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { analysisAPI } from '@/services/api';
import AuroraBackground from '@/components/AuroraBackground';
import GlassCard from '@/components/GlassCard';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { Award, TrendingUp, AlertTriangle, Lightbulb, BookOpen, Home, CheckCircle, XCircle } from 'lucide-react';
import { toast } from 'sonner';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const Results = () => {
  const { attemptId } = useParams();
  const navigate = useNavigate();
  const [results, setResults] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [analysisLoading, setAnalysisLoading] = useState(true);

  useEffect(() => {
    fetchResults();
  }, [attemptId]);

  const fetchResults = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API}/attempts/${attemptId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setResults(response.data);
    } catch (error) {
      console.error('Failed to fetch results', error);
      toast.error('Failed to load exam results');
    } finally {
      setLoading(false);
      fetchAnalysis();
    }
  };

  const fetchAnalysis = async () => {
    try {
      const response = await analysisAPI.get(attemptId);
      setAnalysis(response.data);
      toast.success('AI analysis complete!');
    } catch (error) {
      console.error('Failed to fetch analysis', error);
      toast.error('Failed to generate AI analysis');
    } finally {
      setAnalysisLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen relative flex items-center justify-center">
        <AuroraBackground />
        <div className="text-xl text-slate-300">Loading results...</div>
      </div>
    );
  }

  const COLORS = ['#10b981', '#f59e0b', '#ef4444'];
  const difficultyData = results?.difficulty_stats ? [
    { name: 'Easy', value: results.difficulty_stats.easy, color: '#10b981' },
    { name: 'Medium', value: results.difficulty_stats.medium, color: '#f59e0b' },
    { name: 'Hard', value: results.difficulty_stats.hard, color: '#ef4444' }
  ] : [];

  const accuracyData = [
    { name: 'Correct', value: results?.correct_count || 0 },
    { name: 'Incorrect', value: (results?.total_questions || 0) - (results?.correct_count || 0) }
  ];

  return (
    <div className="min-h-screen relative">
      <AuroraBackground />
      
      <div className="relative z-10">
        {/* Header */}
        <div className="border-b border-white/10 bg-slate-950/40 backdrop-blur-md">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <h1 className="text-2xl font-bold gradient-text" data-testid="results-title">Exam Results & AI Analysis</h1>
            <button
              onClick={() => navigate('/dashboard')}
              className="btn-secondary flex items-center gap-2"
              data-testid="home-btn"
            >
              <Home className="w-4 h-4" />
              Dashboard
            </button>
          </div>
        </div>

        <div className="container mx-auto px-4 py-12">
          {/* Score Summary */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <GlassCard className="p-6 text-center" data-testid="score-card">
              <Award className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
              <p className="text-sm text-slate-400 mb-2">Total Score</p>
              <p className="text-4xl font-bold gradient-text">{results?.score || 0}</p>
            </GlassCard>

            <GlassCard className="p-6 text-center" data-testid="accuracy-card">
              <TrendingUp className="w-12 h-12 text-green-400 mx-auto mb-4" />
              <p className="text-sm text-slate-400 mb-2">Accuracy</p>
              <p className="text-4xl font-bold text-green-400">{results?.accuracy?.toFixed(1) || 0}%</p>
            </GlassCard>

            <GlassCard className="p-6 text-center" data-testid="correct-card">
              <CheckCircle className="w-12 h-12 text-blue-400 mx-auto mb-4" />
              <p className="text-sm text-slate-400 mb-2">Correct</p>
              <p className="text-4xl font-bold text-blue-400">{results?.correct_count || 0}</p>
            </GlassCard>

            <GlassCard className="p-6 text-center" data-testid="incorrect-card">
              <XCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
              <p className="text-sm text-slate-400 mb-2">Incorrect</p>
              <p className="text-4xl font-bold text-red-400">{(results?.total_questions || 0) - (results?.correct_count || 0)}</p>
            </GlassCard>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <GlassCard className="p-6" data-testid="difficulty-chart">
              <h2 className="text-xl font-semibold mb-4">Difficulty Distribution</h2>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={difficultyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="name" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
                    labelStyle={{ color: '#f8fafc' }}
                  />
                  <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                    {difficultyData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </GlassCard>

            <GlassCard className="p-6" data-testid="accuracy-pie-chart">
              <h2 className="text-xl font-semibold mb-4">Answer Distribution</h2>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={accuracyData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    <Cell fill="#10b981" />
                    <Cell fill="#ef4444" />
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </GlassCard>
          </div>

          {/* AI Analysis */}
          {analysisLoading ? (
            <GlassCard className="p-12 text-center" data-testid="analysis-loading">
              <div className="animate-pulse">
                <Lightbulb className="w-16 h-16 text-violet-400 mx-auto mb-4" />
                <p className="text-xl text-slate-300">AI is analyzing your performance...</p>
              </div>
            </GlassCard>
          ) : analysis ? (
            <div className="space-y-6">
              {/* Strengths */}
              <GlassCard className="p-6" data-testid="strengths-card">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-green-400" />
                  </div>
                  <h2 className="text-2xl font-semibold">Strengths</h2>
                </div>
                <ul className="space-y-2">
                  {analysis.strengths?.map((strength, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-slate-300">
                      <span className="text-green-400 mt-1">✓</span>
                      <span>{strength}</span>
                    </li>
                  ))}
                </ul>
              </GlassCard>

              {/* Weak Areas */}
              <GlassCard className="p-6" data-testid="weak-areas-card">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-orange-500/20 flex items-center justify-center">
                    <AlertTriangle className="w-6 h-6 text-orange-400" />
                  </div>
                  <h2 className="text-2xl font-semibold">Areas to Improve</h2>
                </div>
                <ul className="space-y-2">
                  {analysis.weak_areas?.map((area, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-slate-300">
                      <span className="text-orange-400 mt-1">⚠</span>
                      <span>{area}</span>
                    </li>
                  ))}
                </ul>
              </GlassCard>

              {/* Concept Gaps */}
              <GlassCard className="p-6" data-testid="concept-gaps-card">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center">
                    <XCircle className="w-6 h-6 text-red-400" />
                  </div>
                  <h2 className="text-2xl font-semibold">Concept Gaps</h2>
                </div>
                <ul className="space-y-2">
                  {analysis.concept_gaps?.map((gap, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-slate-300">
                      <span className="text-red-400 mt-1">•</span>
                      <span>{gap}</span>
                    </li>
                  ))}
                </ul>
              </GlassCard>

              {/* Mistake Analysis */}
              <GlassCard className="p-6" data-testid="mistake-analysis-card">
                <h2 className="text-2xl font-semibold mb-4">Mistake Analysis</h2>
                <p className="text-slate-300 leading-relaxed">{analysis.mistake_analysis}</p>
              </GlassCard>

              {/* Learning Insights */}
              <GlassCard className="p-6" data-testid="learning-insights-card">
                <h2 className="text-2xl font-semibold mb-4">Learning Insights</h2>
                <p className="text-slate-300 leading-relaxed">{analysis.learning_insights}</p>
              </GlassCard>

              {/* Recommendations */}
              <GlassCard className="p-6" data-testid="recommendations-card">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                    <Lightbulb className="w-6 h-6 text-blue-400" />
                  </div>
                  <h2 className="text-2xl font-semibold">Recommendations</h2>
                </div>
                <ul className="space-y-3">
                  {analysis.recommendations?.map((rec, idx) => (
                    <li key={idx} className="flex items-start gap-3 p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
                      <span className="text-blue-400 mt-1 font-bold">{idx + 1}.</span>
                      <span className="text-slate-300">{rec}</span>
                    </li>
                  ))}
                </ul>
              </GlassCard>

              {/* Personalized Content */}
              {analysis.personalized_content && (
                <GlassCard className="p-6" data-testid="personalized-content-card">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-violet-500/20 flex items-center justify-center">
                      <BookOpen className="w-6 h-6 text-violet-400" />
                    </div>
                    <h2 className="text-2xl font-semibold">Personalized Study Guide</h2>
                  </div>
                  <div className="prose prose-invert max-w-none">
                    <p className="text-slate-300 leading-relaxed whitespace-pre-line">{analysis.personalized_content}</p>
                  </div>
                </GlassCard>
              )}
            </div>
          ) : (
            <GlassCard className="p-12 text-center">
              <AlertTriangle className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
              <p className="text-xl text-slate-300">Failed to load AI analysis</p>
            </GlassCard>
          )}

          {/* CTA */}
          <div className="mt-8 flex flex-wrap gap-4 justify-center">
            <button
              onClick={() => navigate('/topics')}
              className="btn-primary"
              data-testid="take-another-test-btn"
            >
              Take Another Test
            </button>
            <button
              onClick={() => navigate('/dashboard')}
              className="btn-secondary"
              data-testid="back-to-dashboard-btn"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Results;
