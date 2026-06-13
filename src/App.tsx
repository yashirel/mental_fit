import { useState, useEffect } from 'react';
import { GlowingBackground } from './components/GlowingBackground';
import { LandingDashboard } from './components/LandingDashboard';
import { JournalSection } from './components/JournalSection';
import { TriggerTimeline } from './components/TriggerTimeline';
import { CopingExercises } from './components/CopingExercises';
import { ChatbotCoach } from './components/ChatbotCoach';
import { SafetyBanner } from './components/SafetyBanner';
import { Onboarding } from './components/Onboarding';
import type { JournalEntry, ExamType, AnalysisResult } from './types';
import { Activity, LogOut } from 'lucide-react';
import { motion } from 'framer-motion';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    return localStorage.getItem('MINDMIRROR_LOGGED_IN') === 'true';
  });

  const [isOnboarded, setIsOnboarded] = useState<boolean>(() => {
    return localStorage.getItem('MINDMIRROR_ONBOARDED') === 'true';
  });

  const [selectedExam, setSelectedExam] = useState<ExamType>(() => {
    return (localStorage.getItem('MINDMIRROR_EXAM') as ExamType) || 'JEE';
  });

  const [entries, setEntries] = useState<JournalEntry[]>(() => {
    const journalsCached = localStorage.getItem('MINDMIRROR_JOURNAL_ENTRIES');
    return journalsCached ? JSON.parse(journalsCached) : [];
  });

  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Sync state parameters dynamically based on logged in / onboarded status
  useEffect(() => {
    localStorage.setItem('MINDMIRROR_LOGGED_IN', isLoggedIn ? 'true' : 'false');
    localStorage.setItem('MINDMIRROR_ONBOARDED', isOnboarded ? 'true' : 'false');
    localStorage.setItem('MINDMIRROR_EXAM', selectedExam);
  }, [isLoggedIn, isOnboarded, selectedExam]);

  // Initial page scroll restoration on application load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Page scroll restoration on route/screen transitions
  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'instant'
    });
  }, [isLoggedIn, isOnboarded]);

  // Sync journal entries to localstorage
  useEffect(() => {
    localStorage.setItem('MINDMIRROR_JOURNAL_ENTRIES', JSON.stringify(entries));
  }, [entries]);

  const handleAnalyze = async (text: string, mood: number, exam: ExamType) => {
    setIsAnalyzing(true);
    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          journalText: text,
          moodScore: mood,
          exam: exam,
        }),
      });

      if (!response.ok) {
        throw new Error('Server returned an error status.');
      }

      const data = await response.json();

      const newEntry: JournalEntry = {
        id: Math.random().toString(),
        date: new Date().toLocaleDateString(undefined, {
          month: 'short',
          day: 'numeric',
          year: 'numeric'
        }),
        text,
        moodScore: mood,
        exam,
        analysis: {
          mindStabilityIndex: data.mindStabilityIndex,
          stressLevel: data.stressLevel,
          burnoutRisk: data.burnoutRisk,
          hiddenTriggers: data.hiddenTriggers,
          emotionalPatterns: data.emotionalPatterns,
          positiveIndicators: data.positiveIndicators,
          recommendations: data.recommendations,
          confidence: data.confidence,
          mindfulnessExercise: data.mindfulnessExercise,
        }
      };

      setEntries((prev) => [...prev, newEntry]);
    } catch (err: any) {
      console.error(err);
      throw new Error('Analysis failed. Check your connection or backend console.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('MINDMIRROR_LOGGED_IN');
    localStorage.removeItem('MINDMIRROR_ONBOARDED');
    localStorage.removeItem('MINDMIRROR_EXAM');
    localStorage.removeItem('MINDMIRROR_JOURNAL_ENTRIES');
    setIsLoggedIn(false);
    setIsOnboarded(false);
    setSelectedExam('JEE');
    setEntries([]);
  };

  const getLatestAnalysis = (): AnalysisResult | null => {
    if (entries.length === 0) return null;
    return entries[entries.length - 1].analysis || null;
  };

  const checkSevereStress = (): boolean => {
    if (entries.length === 0) return false;
    const latest = getLatestAnalysis();
    return latest?.stressLevel?.toLowerCase() === 'severe';
  };

  // 1. Auth State branch
  if (!isLoggedIn) {
    return (
      <Onboarding
        isLoggedIn={isLoggedIn}
        onLogin={() => setIsLoggedIn(true)}
        onComplete={(exam) => {
          setSelectedExam(exam);
          setIsOnboarded(true);
        }}
      />
    );
  }

  // 2. Exam Selection branch
  if (!isOnboarded) {
    return (
      <Onboarding
        isLoggedIn={isLoggedIn}
        onLogin={() => setIsLoggedIn(true)}
        onComplete={(exam) => {
          setSelectedExam(exam);
          setIsOnboarded(true);
        }}
      />
    );
  }

  const latestAnalysis = getLatestAnalysis();
  const showHelplines = checkSevereStress();

  return (
    <div className="relative min-h-screen px-4 md:px-8 py-6 max-w-7xl mx-auto space-y-8">
      {/* Aurora Background */}
      <GlowingBackground />

      {/* Navigation Header */}
      <header className="flex justify-between items-center py-4 border-b border-slate-200/60 shrink-0" role="banner">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center font-display font-black text-white text-base shadow-md">
            M
          </div>
          <span className="font-display font-bold text-sm tracking-wide text-slate-800 hidden sm:inline-block">
            MINDMIRROR AI
          </span>
        </div>

        <div className="flex items-center space-x-3" role="navigation" aria-label="Quick Account Actions">
          <div className="flex items-center space-x-1.5 px-3 py-1 rounded-full text-[10px] font-bold bg-blue-50 border border-blue-100 text-blue-700">
            <Activity className="w-3.5 h-3.5" />
            <span>{selectedExam} Companion</span>
          </div>

          <motion.button
            onClick={() => setIsOnboarded(false)}
            whileHover={{ scale: 1.05, borderColor: '#cbd5e1', boxShadow: '0 4px 12px rgba(15, 23, 42, 0.05)' }}
            whileTap={{ scale: 0.95 }}
            className="text-[10px] font-bold bg-white text-slate-600 px-3 py-1 rounded-full border border-slate-200 transition-all cursor-pointer"
            aria-label="Switch companion mode to another exam companion"
          >
            Switch Companion
          </motion.button>

          <motion.button
            onClick={handleLogout}
            whileHover={{ scale: 1.05, borderColor: 'rgba(239, 68, 68, 0.2)', color: '#ef4444', backgroundColor: 'rgba(239, 68, 68, 0.05)' }}
            whileTap={{ scale: 0.95 }}
            className="text-[10px] font-bold bg-white text-slate-505 px-3 py-1 rounded-full border border-slate-200 transition-all cursor-pointer flex items-center gap-1"
            aria-label="Sign out of local account session"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </motion.button>
        </div>
      </header>

      {/* Metrics & Dashboard sections */}
      <motion.main
        initial="hidden"
        animate="show"
        variants={{
          hidden: { opacity: 0 },
          show: {
            opacity: 1,
            transition: {
              staggerChildren: 0.12,
            }
          }
        }}
        className="grid grid-cols-1 lg:grid-cols-12 gap-8"
        role="main"
      >
        <motion.section
          variants={{
            hidden: { opacity: 0, y: 20 },
            show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } }
          }}
          className="lg:col-span-7 space-y-8"
          aria-label="Dashboard metrics and exercises"
        >
          <LandingDashboard 
            latestAnalysis={latestAnalysis} 
            selectedExam={selectedExam}
          />

          <JournalSection 
            onAnalyze={handleAnalyze} 
            isAnalyzing={isAnalyzing}
            selectedExam={selectedExam}
            onExamChange={setSelectedExam}
          />

          <CopingExercises />

          <TriggerTimeline entries={entries} />
        </motion.section>

        <motion.aside
          variants={{
            hidden: { opacity: 0, y: 20 },
            show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut', delay: 0.15 } }
          }}
          className="lg:col-span-5 space-y-8 lg:sticky lg:top-6 self-start"
          aria-label="Interactive AI chatbot"
        >
          <ChatbotCoach 
            currentEntry={entries.length > 0 ? entries[entries.length - 1] : null}
            selectedExam={selectedExam}
          />
        </motion.aside>
      </motion.main>

      <footer className="pt-8 pb-4" role="contentinfo">
        <SafetyBanner showHelplines={showHelplines} />
      </footer>
    </div>
  );
}
