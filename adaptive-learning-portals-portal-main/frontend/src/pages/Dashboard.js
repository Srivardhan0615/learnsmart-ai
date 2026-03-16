import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { dashboardAPI } from '@/services/api';
import AuroraBackground from '@/components/AuroraBackground';
import GlassCard from '@/components/GlassCard';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Target, Award, BookOpen, LogOut, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await dashboardAPI.getStats();
      setStats(response.data);
    } catch (error) {
      console.error('Failed to fetch stats', error);
      toast.error('Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    toast.success('Logged out successfully');
  };

  if (loading) {
    return (
      <div className="min-h-screen relative flex items-center justify-center">
        <AuroraBackground />
        <div className="text-xl text-slate-300">Loading...</div>
      </div>
    );
  }

  const COLORS = ['#7c3aed', '#3b82f6', '#06b6d4', '#10b981'];

  return (
    <div className="min-h-screen relative">
      <AuroraBackground />
      
      <div className="relative z-10">
        {/* Header */}
        <div className="border-b border-white/10 bg-slate-950/40 backdrop-blur-md">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <h1 className="text-2xl font-bold gradient-text" data-testid="dashboard-title">LearnSmart AI</h1>
            <div className="flex items-center gap-4">
              <span className="text-slate-300" data-testid="user-name">Welcome, {user?.name}</span>
              <button
                onClick={handleLogout}
                className="btn-secondary flex items-center gap-2"
                data-testid="logout-btn"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <GlassCard className="p-6" data-testid="stat-attempts">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-violet-500/20 flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-violet-400" />
                </div>
                <div>
                  <p className="text-sm text-slate-400">Total Tests</p>
                  <p className="text-2xl font-bold">{stats?.total_attempts || 0}</p>
                </div>
              </div>
            </GlassCard>

            <GlassCard className="p-6" data-testid="stat-accuracy">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center">
                  <Target className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                  <p className="text-sm text-slate-400">Avg Accuracy</p>
                  <p className="text-2xl font-bold">{stats?.average_accuracy?.toFixed(1) || 0}%</p>
                </div>
              </div>
            </GlassCard>

            <GlassCard className="p-6" data-testid="stat-score">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-cyan-500/20 flex items-center justify-center">
                  <Award className="w-6 h-6 text-cyan-400" />
                </div>
                <div>
                  <p className="text-sm text-slate-400">Total Score</p>
                  <p className="text-2xl font-bold">{stats?.total_score || 0}</p>
                </div>
              </div>
            </GlassCard>

            <GlassCard className="p-6" data-testid="stat-progress">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-emerald-400" />
                </div>
                <div>
                  <p className="text-sm text-slate-400">Progress</p>
                  <p className="text-2xl font-bold">Growing</p>
                </div>
              </div>
            </GlassCard>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Strong Topics */}
            <GlassCard className="p-6" data-testid="strong-topics-card">
              <h2 className="text-xl font-semibold mb-4">Strong Topics</h2>
              {stats?.strong_topics?.length > 0 ? (
                <div className="space-y-3">
                  {stats.strong_topics.map((topic, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                      <div>
                        <p className="font-medium">{topic.topic_name}</p>
                        <p className="text-sm text-slate-400">{topic.attempts} attempts</p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-emerald-400">{topic.avg_accuracy.toFixed(1)}%</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-slate-400 text-center py-8">No data yet. Start taking tests!</p>
              )}
            </GlassCard>

            {/* Weak Topics */}
            <GlassCard className="p-6" data-testid="weak-topics-card">
              <h2 className="text-xl font-semibold mb-4">Areas to Improve</h2>
              {stats?.weak_topics?.length > 0 ? (
                <div className="space-y-3">
                  {stats.weak_topics.map((topic, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 rounded-lg bg-orange-500/10 border border-orange-500/20">
                      <div>
                        <p className="font-medium">{topic.topic_name}</p>
                        <p className="text-sm text-slate-400">{topic.attempts} attempts</p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-orange-400">{topic.avg_accuracy.toFixed(1)}%</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-slate-400 text-center py-8">No data yet. Start taking tests!</p>
              )}
            </GlassCard>
          </div>

          {/* Recent Attempts */}
          <GlassCard className="p-6 mb-8" data-testid="recent-attempts-card">
            <h2 className="text-xl font-semibold mb-4">Recent Attempts</h2>
            {stats?.recent_attempts?.length > 0 ? (
              <div className="space-y-3">
                {stats.recent_attempts.map((attempt, idx) => (
                  <div key={idx} className="flex items-center justify-between p-4 rounded-lg bg-slate-900/50 border border-slate-800 hover:border-violet-500/50 transition-all">
                    <div>
                      <p className="font-medium">{attempt.topic_name}</p>
                      <p className="text-sm text-slate-400">
                        {new Date(attempt.completed_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-center">
                        <p className="text-sm text-slate-400">Score</p>
                        <p className="text-lg font-bold">{attempt.score}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm text-slate-400">Accuracy</p>
                        <p className="text-lg font-bold text-violet-400">{attempt.accuracy.toFixed(1)}%</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-slate-400 text-center py-8">No attempts yet. Start learning!</p>
            )}
          </GlassCard>

          {/* CTA */}
          <GlassCard className="p-8 text-center" hover onClick={() => navigate('/topics')} data-testid="start-learning-cta">
            <h3 className="text-2xl font-bold mb-2">Ready to Learn More?</h3>
            <p className="text-slate-400 mb-4">Explore topics and take adaptive tests</p>
            <button className="btn-primary inline-flex items-center gap-2" data-testid="explore-topics-btn">
              Explore Topics
              <ChevronRight className="w-5 h-5" />
            </button>
          </GlassCard>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
