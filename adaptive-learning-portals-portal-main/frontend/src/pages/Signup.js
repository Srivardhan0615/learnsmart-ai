import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import AuroraBackground from '@/components/AuroraBackground';
import GlassCard from '@/components/GlassCard';
import { UserPlus, Mail, Lock, User, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

const Signup = () => {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await signup(name, email, password);
    setLoading(false);

    if (result.success) {
      toast.success('Account created successfully!');
      navigate('/dashboard');
    } else {
      setError(result.error);
      toast.error(result.error);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4">
      <AuroraBackground />
      
      <GlassCard className="w-full max-w-md p-8 relative z-10" data-testid="signup-card">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-full bg-gradient-to-r from-violet-600 to-blue-600 flex items-center justify-center mx-auto mb-4">
            <UserPlus className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold mb-2" data-testid="signup-title">Create Account</h1>
          <p className="text-slate-400">Start your AI-powered learning journey</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6" data-testid="signup-form">
          {error && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400" data-testid="signup-error">
              <AlertCircle className="w-4 h-4" />
              <span className="text-sm">{error}</span>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium mb-2" htmlFor="name">
              Full Name
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-slate-900/50 border border-slate-800 focus:border-violet-500 focus:ring-1 focus:ring-violet-500 rounded-xl outline-none transition-all"
                placeholder="John Doe"
                required
                data-testid="name-input"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2" htmlFor="email">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-slate-900/50 border border-slate-800 focus:border-violet-500 focus:ring-1 focus:ring-violet-500 rounded-xl outline-none transition-all"
                placeholder="your@email.com"
                required
                data-testid="email-input"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2" htmlFor="password">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-slate-900/50 border border-slate-800 focus:border-violet-500 focus:ring-1 focus:ring-violet-500 rounded-xl outline-none transition-all"
                placeholder="••••••••"
                required
                minLength={6}
                data-testid="password-input"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full btn-primary"
            data-testid="signup-submit-btn"
          >
            {loading ? 'Creating account...' : 'Sign Up'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-slate-400 text-sm">
            Already have an account?{' '}
            <Link to="/login" className="text-violet-400 hover:text-violet-300 font-medium" data-testid="login-link">
              Login
            </Link>
          </p>
        </div>
      </GlassCard>
    </div>
  );
};

export default Signup;
