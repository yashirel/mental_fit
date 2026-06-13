import React from 'react';
import type { AnalysisResult, ExamType } from '../types';
import { motion } from 'framer-motion';
import { Sparkles, Brain, Flame, Activity, Compass, CheckCircle2 } from 'lucide-react';

interface LandingDashboardProps {
  latestAnalysis: AnalysisResult | null;
  selectedExam: ExamType;
}

export const LandingDashboard: React.FC<LandingDashboardProps> = ({
  latestAnalysis,
  selectedExam,
}) => {
  // SVG values for circular progress
  const radius = 50;
  const stroke = 8;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  
  const msi = latestAnalysis?.mindStabilityIndex ?? 72; // Default starting index if none
  const strokeDashoffset = circumference - (msi / 100) * circumference;

  const getStressColor = (level: string) => {
    switch (level?.toLowerCase()) {
      case 'severe': return 'text-red-600 border-red-200 bg-red-50';
      case 'high': return 'text-amber-600 border-amber-200 bg-amber-50';
      case 'moderate': return 'text-yellow-600 border-yellow-200 bg-yellow-50';
      default: return 'text-emerald-600 border-emerald-200 bg-emerald-50';
    }
  };

  const getBurnoutColor = (level: string) => {
    switch (level?.toLowerCase()) {
      case 'high': return 'text-red-600 border-red-200 bg-red-50';
      case 'medium': return 'text-amber-600 border-amber-200 bg-amber-50';
      default: return 'text-emerald-600 border-emerald-200 bg-emerald-50';
    }
  };

  // Mock initial insights in case user hasn't uploaded journal yet
  const defaultTriggers = ["Mock Test Anxiety", "Time Pressure", "Fear of Failure"];
  const defaultPatterns = ["Anxiety correlates with mock exam dates", "Study stamina decreases past 9:00 PM"];
  const defaultPositives = ["Consistent daily journaling habit", "Active awareness of study limitations"];
  const defaultRecommendations = [
    `Divide your ${selectedExam} syllabus into micro-sections. Complete one section before moving forward.`,
    "Practice 4-4-4-4 breathing during your study block breaks.",
    "Limit discussion of syllabus goals with peers right before mock exams."
  ];

  const triggers = latestAnalysis?.hiddenTriggers ?? defaultTriggers;
  const patterns = latestAnalysis?.emotionalPatterns ?? defaultPatterns;
  const positives = latestAnalysis?.positiveIndicators ?? defaultPositives;
  const recommendations = latestAnalysis?.recommendations ?? defaultRecommendations;
  const confidence = latestAnalysis?.confidence ?? 0.96;

  // Animation variants (typed as any to bypass strict TS checks in node modules)
  const heroContainerVariants: any = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      }
    }
  };

  const heroChildVariants: any = {
    hidden: { opacity: 0, y: 15 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.16, 1, 0.3, 1] // Custom premium ease-out
      }
    }
  };

  const sectionTitleVariants: any = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: 'easeOut'
      }
    }
  };

  const cardContainerVariants: any = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
      }
    }
  };

  const cardVariants: any = {
    hidden: { opacity: 0, scale: 0.95, y: 15 },
    show: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: 'easeOut'
      }
    }
  };

  return (
    <div className="space-y-8">
      {/* Hero Header */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={heroContainerVariants}
        className="text-center md:text-left space-y-3 md:max-w-xl"
      >
        <motion.div
          variants={heroChildVariants}
          className="inline-flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 border border-blue-100 text-blue-700"
        >
          <Sparkles className="w-3.5 h-3.5 animate-pulse" />
          <span>Hackathon Build v1.1</span>
        </motion.div>
        
        <motion.div variants={heroChildVariants}>
          <motion.h1
            animate={{ y: [0, -5, 0] }}
            transition={{
              duration: 5,
              repeat: Infinity,
              repeatType: 'reverse',
              ease: 'easeInOut'
            }}
            className="text-4xl md:text-5xl font-display font-extrabold tracking-tight text-slate-900 leading-none select-none"
          >
            MindMirror <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">AI</span>
          </motion.h1>
        </motion.div>

        <motion.p
          variants={heroChildVariants}
          className="text-sm md:text-base text-slate-500 font-medium"
        >
          Understand Your Mind. Conquer Your Exams.
        </motion.p>
      </motion.div>

      {/* Metrics Section */}
      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: '-40px' }}
        variants={cardContainerVariants}
        className="grid grid-cols-2 md:grid-cols-5 gap-4"
      >
        {/* Metric 1: Mind Stability Index (Progress Ring) */}
        <motion.div
          variants={cardVariants}
          whileHover={{ scale: 1.02, boxShadow: '0 10px 30px rgba(37, 99, 235, 0.06)', borderColor: 'rgba(37, 99, 235, 0.2)' }}
          className="glass-panel rounded-2xl p-4 border-slate-200/80 flex flex-col items-center justify-center text-center col-span-2 md:col-span-1 min-h-[140px] shadow-sm transition-colors duration-300"
        >
          <div className="relative w-18 h-18">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                className="text-slate-100"
                strokeWidth={stroke}
                stroke="currentColor"
                fill="transparent"
                r={normalizedRadius}
                cx={radius - 10}
                cy={radius - 10}
              />
              <motion.circle
                className="text-blue-600"
                strokeWidth={stroke}
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                stroke="currentColor"
                fill="transparent"
                r={normalizedRadius}
                cx={radius - 10}
                cy={radius - 10}
                initial={{ strokeDashoffset: circumference }}
                animate={{ strokeDashoffset }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center font-display font-bold text-sm text-slate-800">
              {msi}%
            </div>
          </div>
          <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mt-2">Mind Stability Index</span>
        </motion.div>

        {/* Metric 2: Mood Badge */}
        <motion.div
          variants={cardVariants}
          whileHover={{ scale: 1.02, boxShadow: '0 10px 30px rgba(16, 185, 129, 0.05)', borderColor: 'rgba(16, 185, 129, 0.2)' }}
          className="glass-panel rounded-2xl p-4 border-slate-200/80 flex flex-col items-center justify-center text-center min-h-[140px] transition-colors duration-300"
        >
          <div className="text-3xl filter drop-shadow-[0_4px_8px_rgba(0,0,0,0.06)]">
            {msi <= 35 ? '😫' : msi <= 65 ? '😐' : msi <= 80 ? '🙂' : '🤩'}
          </div>
          <div className="text-xs font-bold text-slate-800 mt-2">
            {msi <= 35 ? 'Overwhelmed' : msi <= 65 ? 'Managing' : msi <= 80 ? 'Positive' : 'Excellent'}
          </div>
          <span className="text-[9px] text-slate-400 uppercase tracking-widest font-mono mt-1">Current Mood</span>
        </motion.div>

        {/* Metric 3: Stress level */}
        <motion.div
          variants={cardVariants}
          whileHover={{ scale: 1.02 }}
          className="glass-panel rounded-2xl p-4 border-slate-200/80 flex flex-col items-center justify-center text-center min-h-[140px]"
        >
          <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl mb-1.5 border border-emerald-100">
            <Activity className="w-5 h-5" />
          </div>
          <div className={`text-xs font-bold px-2 py-0.5 rounded-full border ${getStressColor(latestAnalysis?.stressLevel ?? 'Moderate')}`}>
            {latestAnalysis?.stressLevel ?? 'Moderate'}
          </div>
          <span className="text-[9px] text-slate-400 uppercase tracking-widest font-mono mt-2">Stress Level</span>
        </motion.div>

        {/* Metric 4: Burnout Risk */}
        <motion.div
          variants={cardVariants}
          whileHover={{ scale: 1.02 }}
          className="glass-panel rounded-2xl p-4 border-slate-200/80 flex flex-col items-center justify-center text-center min-h-[140px]"
        >
          <div className="p-2 bg-purple-50 text-purple-600 rounded-xl mb-1.5 border border-purple-100">
            <Flame className="w-5 h-5" />
          </div>
          <div className={`text-xs font-bold px-2 py-0.5 rounded-full border ${getBurnoutColor(latestAnalysis?.burnoutRisk ?? 'Low')}`}>
            {latestAnalysis?.burnoutRisk ?? 'Low'}
          </div>
          <span className="text-[9px] text-slate-400 uppercase tracking-widest font-mono mt-2">Burnout Risk</span>
        </motion.div>

        {/* Metric 5: AI Confidence */}
        <motion.div
          variants={cardVariants}
          whileHover={{ scale: 1.02 }}
          className="glass-panel rounded-2xl p-4 border-slate-200/80 flex flex-col items-center justify-center text-center min-h-[140px]"
        >
          <div className="p-2 bg-blue-50 text-blue-600 rounded-xl mb-1.5 border border-blue-100">
            <Brain className="w-5 h-5" />
          </div>
          <div className="text-xs font-bold text-slate-800 font-mono">
            {Math.round(confidence * 100)}%
          </div>
          <span className="text-[9px] text-slate-400 uppercase tracking-widest font-mono mt-2">AI Confidence</span>
        </motion.div>
      </motion.div>

      {/* Insights Layout Grid */}
      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: '-40px' }}
        variants={cardContainerVariants}
        className="grid grid-cols-1 md:grid-cols-12 gap-6"
      >
        {/* Left column: Triggers & Patterns (6 cols) */}
        <div className="md:col-span-6 space-y-6">
          {/* Stress Triggers */}
          <motion.div
            variants={cardVariants}
            whileHover={{ borderColor: 'rgba(226, 232, 240, 0.9)' }}
            className="glass-panel rounded-2xl p-5 border-slate-200/80 space-y-4"
          >
            <motion.h3
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-10px' }}
              variants={sectionTitleVariants}
              className="text-xs font-semibold text-slate-500 uppercase tracking-wider"
            >
              Hidden Stress Drivers
            </motion.h3>
            <div className="flex flex-wrap gap-2">
              {triggers.map((trigger, idx) => (
                <motion.span
                  key={idx}
                  whileHover={{ scale: 1.05 }}
                  className="px-3 py-1.5 rounded-xl text-xs font-medium bg-red-50 border border-red-100 text-red-700"
                >
                  ⚠ {trigger}
                </motion.span>
              ))}
            </div>
            <p className="text-[10px] text-slate-400 leading-relaxed font-mono">
              * Drivers parsed by Gemini based on semantic stressors in journal context.
            </p>
          </motion.div>

          {/* Emotional Patterns */}
          <motion.div
            variants={cardVariants}
            whileHover={{ borderColor: 'rgba(226, 232, 240, 0.9)' }}
            className="glass-panel rounded-2xl p-5 border-slate-200/80 space-y-3"
          >
            <motion.h3
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-10px' }}
              variants={sectionTitleVariants}
              className="text-xs font-semibold text-slate-500 uppercase tracking-wider"
            >
              Emotional Habits & Trends
            </motion.h3>
            <div className="space-y-2">
              {patterns.map((pattern, idx) => (
                <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-700 leading-normal">
                  <span className="text-purple-600 mt-0.5 shrink-0">•</span>
                  <span>{pattern}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Positive Indicators */}
          <motion.div
            variants={cardVariants}
            whileHover={{ borderColor: 'rgba(226, 232, 240, 0.9)' }}
            className="glass-panel rounded-2xl p-5 border-slate-200/80 space-y-3"
          >
            <motion.h3
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-10px' }}
              variants={sectionTitleVariants}
              className="text-xs font-semibold text-emerald-600 uppercase tracking-wider"
            >
              Resilience & Strengths
            </motion.h3>
            <div className="space-y-2">
              {positives.map((positive, idx) => (
                <div key={idx} className="flex items-center gap-2 text-xs text-slate-700 leading-normal">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{positive}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Right column: Personalized Recommendations (6 cols) */}
        <motion.div variants={cardVariants} className="md:col-span-6">
          <div className="glass-panel rounded-2xl p-5 border-slate-200/80 space-y-4 h-full flex flex-col justify-between shadow-sm">
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Compass className="w-5 h-5 text-emerald-600" />
                <motion.h3
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: '-10px' }}
                  variants={sectionTitleVariants}
                  className="text-xs font-semibold text-slate-500 uppercase tracking-wider"
                >
                  Adaptive AI Guidance
                </motion.h3>
              </div>
              
              <div className="space-y-3">
                {recommendations.map((rec, idx) => (
                  <motion.div
                    key={idx}
                    whileHover={{ scale: 1.01, borderColor: 'rgba(37, 99, 235, 0.2)', backgroundColor: '#ffffff', boxShadow: '0 4px 12px rgba(15, 23, 42, 0.03)' }}
                    className="p-3 bg-slate-50 border border-slate-100/60 rounded-xl transition-all duration-300"
                  >
                    <div className="flex items-start gap-2 text-xs text-slate-700 leading-relaxed">
                      <span className="text-[10px] bg-purple-50 border border-purple-100 text-purple-700 px-1.5 py-0.5 rounded font-mono shrink-0">
                        {idx + 1}
                      </span>
                      <span>{rec}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Mindful Exercise Highlight */}
            {latestAnalysis?.mindfulnessExercise && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mt-4 p-3.5 bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-100/80 rounded-xl"
              >
                <span className="text-[9px] font-bold tracking-widest uppercase text-purple-600 block mb-1">
                  Active Mindfulness Routine
                </span>
                <p className="text-xs text-slate-700 font-medium">
                  {latestAnalysis.mindfulnessExercise}
                </p>
              </motion.div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};
