import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { topicsAPI } from '@/services/api';
import AuroraBackground from '@/components/AuroraBackground';
import GlassCard from '@/components/GlassCard';
import { ArrowLeft, BookOpen, Calculator, Atom, Code, Brain } from 'lucide-react';
import { toast } from 'sonner';

const iconMap = {
  'Calculator': Calculator,
  'Atom': Atom,
  'Code': Code,
  'Brain': Brain
};

const Topics = () => {
  const navigate = useNavigate();
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTopics();
  }, []);

  const fetchTopics = async () => {
    try {
      const response = await topicsAPI.getAll();
      setTopics(response.data);
    } catch (error) {
      console.error('Failed to fetch topics', error);
      toast.error('Failed to load topics');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen relative flex items-center justify-center">
        <AuroraBackground />
        <div className="text-xl text-slate-300">Loading topics...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative">
      <AuroraBackground />
      
      <div className="relative z-10">
        {/* Header */}
        <div className="border-b border-white/10 bg-slate-950/40 backdrop-blur-md">
          <div className="container mx-auto px-4 py-4 flex items-center gap-4">
            <button
              onClick={() => navigate('/dashboard')}
              className="btn-secondary flex items-center gap-2"
              data-testid="back-to-dashboard-btn"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>
            <h1 className="text-2xl font-bold gradient-text" data-testid="topics-title">Choose Your Subject</h1>
          </div>
        </div>

        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {topics.map((topic) => {
              const Icon = iconMap[topic.icon] || BookOpen;
              return (
                <GlassCard
                  key={topic.id}
                  className="p-8 text-center cursor-pointer"
                  hover
                  onClick={() => navigate(`/study/${topic.id}`)}
                  data-testid={`topic-card-${topic.id}`}
                >
                  <div className="w-20 h-20 rounded-full bg-gradient-to-r from-violet-600 to-blue-600 flex items-center justify-center mx-auto mb-6">
                    <Icon className="w-10 h-10 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold mb-3">{topic.title}</h2>
                  <p className="text-slate-400 mb-6">{topic.description}</p>
                  <button className="btn-primary w-full" data-testid={`start-learning-${topic.id}`}>
                    Start Learning
                  </button>
                </GlassCard>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Topics;
