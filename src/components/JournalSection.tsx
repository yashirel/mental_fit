import React, { useState } from 'react';
import { BookOpen, AlertCircle, RefreshCw } from 'lucide-react';
import type { ExamType } from '../types';
import { MoodSlider } from './MoodSlider';
import confetti from 'canvas-confetti';
import { motion } from 'framer-motion';

interface JournalSectionProps {
  onAnalyze: (text: string, mood: number, exam: ExamType) => Promise<void>;
  isAnalyzing: boolean;
  selectedExam: ExamType;
  onExamChange: (exam: ExamType) => void;
}

export const JournalSection: React.FC<JournalSectionProps> = ({
  onAnalyze,
  isAnalyzing,
  selectedExam,
  onExamChange,
}) => {
  const [journalText, setJournalText] = useState('');
  const [moodScore, setMoodScore] = useState(5);
  const [errorMsg, setErrorMsg] = useState('');

  const exams: { value: ExamType; label: string; desc: string }[] = [
    { value: 'JEE', label: 'JEE', desc: 'Engineering (Physics, Chemistry, Maths)' },
    { value: 'NEET', label: 'NEET', desc: 'Medical (Biology, Physics, Chemistry)' },
    { value: 'UPSC', label: 'UPSC', desc: 'Civil Services (General Studies, Optional)' },
    { value: 'CAT', label: 'CAT', desc: 'Management (Aptitude, Logic, English)' },
    { value: 'GATE', label: 'GATE', desc: 'Graduate Aptitude (Engineering Core)' },
    { value: 'CUET', label: 'CUET', desc: 'Central Universities Entry Test' },
  ];

  const prompts = [
    "How was your study schedule and focus level today?",
    "What specific topic or mock score stressed you?",
    "What went well? Any concept you cracked?",
    "What are you most worried about regarding the exam day?",
  ];

  const handleSuggestClick = (prompt: string) => {
    setJournalText((prev) => {
      const spacing = prev.trim() ? '\n\n' : '';
      return `${prev}${spacing}• ${prompt} `;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    
    if (journalText.trim().length < 20) {
      setErrorMsg('Please write a slightly more detailed journal (at least 20 characters) for a meaningful AI analysis.');
      return;
    }

    try {
      await onAnalyze(journalText, moodScore, selectedExam);
      
      // Celebrate with confetti!
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#2563eb', '#8b5cf6', '#10b981']
      });
      
      // Clear journal input after successful analysis to allow next entries
      setJournalText('');
    } catch (err: any) {
      setErrorMsg(err.message || 'An error occurred while running the AI analysis.');
    }
  };

  return (
    <motion.section
      initial={{ opacity: 0, scale: 0.95, y: 20 }}
      whileInView={{ opacity: 1, scale: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="glass-panel rounded-2xl p-6 md:p-8 border-slate-200/80 relative overflow-hidden"
      aria-label="Daily Journal Reflection"
    >
      {/* Visual Accent */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 rounded-full blur-2xl pointer-events-none" />
      
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="flex items-center space-x-3 mb-6"
      >
        <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600 border border-blue-100">
          <BookOpen className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-xl font-display font-semibold text-slate-900">Daily Mirror Journal</h2>
          <p className="text-xs text-slate-500">Reflect on your preparation to decode stress patterns</p>
        </div>
      </motion.div>

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Exam Companion Mode Selection */}
        <div>
          <label className="text-sm font-medium text-slate-500 uppercase tracking-wider block mb-3">
            Exam Companion Mode
          </label>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-2" role="group" aria-label="Exam companion selection toggle bar">
            {exams.map((exam) => (
              <motion.button
                key={exam.value}
                type="button"
                onClick={() => onExamChange(exam.value)}
                whileHover={{ scale: 1.05, boxShadow: '0 4px 12px rgba(37, 99, 235, 0.08)' }}
                whileTap={{ scale: 0.98 }}
                className={`py-2 px-3 rounded-xl border text-xs font-semibold tracking-wider transition-all duration-300 cursor-pointer ${
                  selectedExam === exam.value
                    ? 'bg-blue-50 border-blue-500 text-blue-700 shadow-sm'
                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-700'
                }`}
                title={exam.desc}
                aria-label={`Toggle companion mode to ${exam.label}`}
                aria-pressed={selectedExam === exam.value}
              >
                {exam.label}
              </motion.button>
            ))}
          </div>
          <p className="text-[11px] text-slate-400 mt-2 italic">
            * MindMirror AI will tailor its advice and mental health checkpoints for the {selectedExam} syllabus.
          </p>
        </div>

        {/* Mood Slider */}
        <div className="bg-slate-50 border border-slate-200/60 rounded-xl p-4">
          <MoodSlider value={moodScore} onChange={setMoodScore} />
        </div>

        {/* Journal Textarea */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label htmlFor="journal-entry-input" className="text-sm font-medium text-slate-505 uppercase tracking-wider">
              Write your journal entry
            </label>
            <span className="text-[11px] text-slate-400 font-mono">
              {journalText.length} chars
            </span>
          </div>

          <textarea
            id="journal-entry-input"
            value={journalText}
            onChange={(e) => setJournalText(e.target.value)}
            disabled={isAnalyzing}
            placeholder="Write about your studies today. Mention mock tests, study hours, what is causing you stress, sleep patterns, or any parental/peer worries..."
            rows={6}
            className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 text-sm text-slate-800 placeholder-slate-400 focus:outline-none transition-all duration-300 resize-none disabled:opacity-50"
            aria-label="Write daily study and emotional reflection details"
          />

          {/* Quick Guide Suggestion Chips */}
          <div className="flex flex-wrap gap-2 mt-2" role="group" aria-label="Journal suggestion guides prompt list">
            <span className="text-xs text-slate-400 flex items-center mr-1">Guides:</span>
            {prompts.map((p, idx) => (
              <motion.button
                key={idx}
                type="button"
                onClick={() => handleSuggestClick(p)}
                whileHover={{ scale: 1.05, backgroundColor: 'rgba(241, 245, 249, 0.8)', borderColor: 'rgba(37, 99, 235, 0.3)' }}
                whileTap={{ scale: 0.95 }}
                className="text-[11px] bg-slate-50 text-slate-505 hover:text-slate-700 border border-slate-200 px-2.5 py-1 rounded-full transition-all duration-200 cursor-pointer"
                aria-label={`Insert suggestion guide: ${p}`}
              >
                + {p.split(' ')[0]} {p.split(' ')[1]}...
              </motion.button>
            ))}
          </div>
        </div>

        {errorMsg && (
          <div role="alert" className="flex items-center space-x-2 text-red-600 text-xs bg-red-50 border border-red-200 p-3 rounded-xl">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Submit Button */}
        <motion.button
          type="submit"
          disabled={isAnalyzing}
          whileHover={isAnalyzing ? {} : { scale: 1.015, boxShadow: '0 4px 20px rgba(37, 99, 235, 0.2)' }}
          whileTap={isAnalyzing ? {} : { scale: 0.99 }}
          className="w-full relative group overflow-hidden py-3.5 px-6 rounded-xl font-semibold text-sm tracking-wider transition-all duration-300 disabled:cursor-not-allowed bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md cursor-pointer"
          aria-label="Submit journal reflection for AI analysis"
        >
          {isAnalyzing ? (
            <div className="flex items-center justify-center space-x-2">
              <RefreshCw className="w-4 h-4 animate-spin text-blue-200" />
              <span>Decoding Stress Waves...</span>
            </div>
          ) : (
            <div className="flex items-center justify-center space-x-2">
              <span>Submit for AI Wellness Analysis</span>
            </div>
          )}
        </motion.button>

      </form>
    </motion.section>
  );
};
