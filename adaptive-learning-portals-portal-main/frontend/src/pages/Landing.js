import React from 'react';
import { useNavigate } from 'react-router-dom';
import AuroraBackground from '@/components/AuroraBackground';
import GlassCard from '@/components/GlassCard';
import { Brain, Zap, Target, TrendingUp, ArrowRight, Sparkles } from 'lucide-react';

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen relative overflow-hidden">
      <AuroraBackground />
      
      <div className="relative z-10">
        {/* Hero Section */}
        <div className="container mx-auto px-4 pt-20 pb-32">
          <div className="text-center max-w-5xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-500/10 border border-violet-500/20 mb-8" data-testid="hero-badge">
              <Sparkles className="w-4 h-4 text-violet-400" />
              <span className="text-sm text-violet-300">AI-Powered Adaptive Learning</span>
            </div>
            
            <h1 className="text-6xl md:text-7xl font-bold tracking-tight mb-6" data-testid="hero-title">
              <span className="gradient-text">LearnSmart AI</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-slate-300 mb-12 leading-relaxed max-w-3xl mx-auto" data-testid="hero-subtitle">
              AI-Driven Adaptive Learning & Smart Examination Platform
            </p>
            
            <div className="flex flex-wrap gap-4 justify-center" data-testid="hero-cta-buttons">
              <button
                onClick={() => navigate('/signup')}
                className="btn-primary flex items-center gap-2 text-lg"
                data-testid="get-started-btn"
              >
                Get Started
                <ArrowRight className="w-5 h-5" />
              </button>
              <button
                onClick={() => navigate('/login')}
                className="btn-secondary text-lg"
                data-testid="login-btn"
              >
                Login
              </button>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="container mx-auto px-4 pb-20">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <GlassCard className="p-6" hover data-testid="feature-adaptive">
              <div className="w-12 h-12 rounded-full bg-violet-500/20 flex items-center justify-center mb-4">
                <Brain className="w-6 h-6 text-violet-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Adaptive Testing</h3>
              <p className="text-slate-400 text-sm">
                Questions adjust to your skill level in real-time for optimal learning
              </p>
            </GlassCard>

            <GlassCard className="p-6" hover data-testid="feature-ai-analysis">
              <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2">AI Analysis</h3>
              <p className="text-slate-400 text-sm">
                Get detailed performance insights and personalized recommendations
              </p>
            </GlassCard>

            <GlassCard className="p-6" hover data-testid="feature-personalized">
              <div className="w-12 h-12 rounded-full bg-cyan-500/20 flex items-center justify-center mb-4">
                <Target className="w-6 h-6 text-cyan-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Personalized Learning</h3>
              <p className="text-slate-400 text-sm">
                AI-generated study materials targeting your weak areas
              </p>
            </GlassCard>

            <GlassCard className="p-6" hover data-testid="feature-progress">
              <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center mb-4">
                <TrendingUp className="w-6 h-6 text-emerald-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Track Progress</h3>
              <p className="text-slate-400 text-sm">
                Comprehensive analytics to monitor your learning journey
              </p>
            </GlassCard>
          </div>
        </div>

        {/* Subjects Preview */}
        <div className="container mx-auto px-4 pb-32">
          <h2 className="text-4xl font-bold text-center mb-12" data-testid="subjects-heading">
            Master Multiple <span className="gradient-text">Subjects</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {[
              { name: 'Mathematics', color: 'violet', icon: '🔢' },
              { name: 'Physics', color: 'blue', icon: '⚛️' },
              { name: 'Computer Science', color: 'cyan', icon: '💻' },
              { name: 'Aptitude', color: 'emerald', icon: '🧠' }
            ].map((subject, idx) => (
              <GlassCard key={idx} className="p-8 text-center" hover data-testid={`subject-${subject.name.toLowerCase().replace(' ', '-')}`}>
                <div className="text-5xl mb-4">{subject.icon}</div>
                <h3 className="text-lg font-semibold">{subject.name}</h3>
              </GlassCard>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;
