import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpen, Clock, Trophy, ArrowRight } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';

const Index = () => {
  const { t } = useLanguage();
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      navigate('/exams');
    }
  }, [isAuthenticated, isLoading, navigate]);

  const features = [
    { icon: BookOpen, title: 'Interactive Exams', desc: 'MCQ, essays, and passage questions' },
    { icon: Clock, title: 'Timed Sessions', desc: 'Auto-save progress with countdown timer' },
    { icon: Trophy, title: 'Instant Results', desc: 'View scores and explanations' },
  ];

  return (
    <Layout>
      <div className="min-h-[80vh] flex flex-col items-center justify-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-primary flex items-center justify-center shadow-lg">
            <span className="text-4xl font-bold text-white">Z</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="text-gradient">Zakerai</span> Exam Platform
          </h1>
          <p className="text-xl text-muted-foreground max-w-lg mx-auto mb-8">
            A modern exam management system with interactive questions, real-time progress tracking, and instant feedback.
          </p>
          <Button
            size="lg"
            onClick={() => navigate('/exams')}
            className="gap-2 bg-gradient-primary hover:opacity-90 text-lg px-8"
          >
            {t('nav.exams')}
            <ArrowRight className="w-5 h-5" />
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid md:grid-cols-3 gap-6 mt-16 w-full max-w-3xl"
        >
          {features.map((f, i) => (
            <div key={i} className="glass-card rounded-xl p-6 text-center">
              <f.icon className="w-10 h-10 mx-auto mb-3 text-primary" />
              <h3 className="font-semibold mb-1">{f.title}</h3>
              <p className="text-sm text-muted-foreground">{f.desc}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </Layout>
  );
};

export default Index;
