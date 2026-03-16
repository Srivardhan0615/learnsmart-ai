import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { topicsAPI } from '@/services/api';
import AuroraBackground from '@/components/AuroraBackground';
import GlassCard from '@/components/GlassCard';
import { ArrowLeft, PlayCircle } from 'lucide-react';
import { toast } from 'sonner';

const Study = () => {
  const { topicId } = useParams();
  const navigate = useNavigate();
  const [topic, setTopic] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTopic();
  }, [topicId]);

  const fetchTopic = async () => {
    try {
      const response = await topicsAPI.getById(topicId);
      setTopic(response.data);
    } catch (error) {
      console.error('Failed to fetch topic', error);
      toast.error('Failed to load topic');
      navigate('/topics');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen relative flex items-center justify-center">
        <AuroraBackground />
        <div className="text-xl text-slate-300">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative">
      <AuroraBackground />
      
      <div className="relative z-10">
        {/* Header */}
        <div className="border-b border-white/10 bg-slate-950/40 backdrop-blur-md sticky top-0 z-20">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/topics')}
                className="btn-secondary flex items-center gap-2"
                data-testid="back-to-topics-btn"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </button>
              <h1 className="text-2xl font-bold gradient-text" data-testid="study-title">{topic?.title}</h1>
            </div>
            <button
              onClick={() => navigate(`/exam/${topicId}`)}
              className="btn-primary flex items-center gap-2"
              data-testid="start-test-btn"
            >
              <PlayCircle className="w-5 h-5" />
              Start Adaptive Test
            </button>
          </div>
        </div>

        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto">
            <GlassCard className="p-8 md:p-12" data-testid="study-content">
              <div className="prose prose-invert prose-slate max-w-none">
                <div className="study-content text-slate-300 leading-relaxed space-y-6">
                  {topic?.content.split('\n').map((line, idx) => {
                    if (line.startsWith('# ')) {
                      return <h1 key={idx} className="text-4xl font-bold mb-6 mt-8 gradient-text">{line.replace('# ', '')}</h1>;
                    }
                    if (line.startsWith('## ')) {
                      return <h2 key={idx} className="text-3xl font-semibold mb-4 mt-6 text-slate-100">{line.replace('## ', '')}</h2>;
                    }
                    if (line.startsWith('### ')) {
                      return <h3 key={idx} className="text-2xl font-semibold mb-3 mt-4 text-slate-200">{line.replace('### ', '')}</h3>;
                    }
                    if (line.startsWith('- ')) {
                      return <li key={idx} className="ml-6 mb-2 text-slate-300">{line.replace('- ', '')}</li>;
                    }
                    if (line.trim() === '') {
                      return <div key={idx} className="h-4" />;
                    }
                    return <p key={idx} className="text-slate-300 leading-relaxed mb-4">{line}</p>;
                  })}
                </div>
              </div>

              <div className="mt-12 pt-8 border-t border-white/10 text-center">
                <h3 className="text-2xl font-bold mb-4">Ready to Test Your Knowledge?</h3>
                <p className="text-slate-400 mb-6">Take an adaptive test that adjusts to your skill level</p>
                <button
                  onClick={() => navigate(`/exam/${topicId}`)}
                  className="btn-primary inline-flex items-center gap-2"
                  data-testid="start-test-bottom-btn"
                >
                  <PlayCircle className="w-5 h-5" />
                  Start Adaptive Test
                </button>
              </div>
            </GlassCard>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Study;
