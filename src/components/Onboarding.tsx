import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, Shield, Mail, LogIn, AlertCircle } from 'lucide-react';
import type { ExamType } from '../types';

interface OnboardingProps {
  isLoggedIn: boolean;
  onLogin: () => void;
  onComplete: (exam: ExamType) => void;
}

export const Onboarding: React.FC<OnboardingProps> = ({ isLoggedIn, onLogin, onComplete }) => {
  const [step, setStep] = useState<'welcome' | 'exam'>('welcome');
  const [isSignUp, setIsSignUp] = useState(false);
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const [authError, setAuthError] = useState('');
  const [isAuthLoading, setIsAuthLoading] = useState(false);
  const [authLoadingMessage, setAuthLoadingMessage] = useState('');

  // Automatically switch step to exam selection if user signs in
  useEffect(() => {
    if (isLoggedIn) {
      setStep('exam');
    } else {
      setStep('welcome');
    }
  }, [isLoggedIn]);

  const exams: { value: ExamType; label: string; desc: string; syllabus: string; color: string }[] = [
    { 
      value: 'JEE', 
      label: 'JEE Companion', 
      desc: 'Engineering aspirants', 
      syllabus: 'Physics, Chemistry, Mathematics',
      color: 'from-purple-50 to-indigo-50 border-purple-200/80 text-purple-700 hover:border-purple-300' 
    },
    { 
      value: 'NEET', 
      label: 'NEET Companion', 
      desc: 'Medical aspirants', 
      syllabus: 'Biology, Physics, Chemistry',
      color: 'from-emerald-50 to-teal-50 border-emerald-200/80 text-emerald-700 hover:border-emerald-300' 
    },
    { 
      value: 'UPSC', 
      label: 'UPSC Companion', 
      desc: 'Civil Services aspirants', 
      syllabus: 'General Studies, Essay, Optional',
      color: 'from-amber-50 to-orange-50 border-amber-200/80 text-amber-700 hover:border-amber-300' 
    },
    { 
      value: 'GATE', 
      label: 'GATE Companion', 
      desc: 'Engineering graduates', 
      syllabus: 'Engineering Core, Math, Aptitude',
      color: 'from-cyan-50 to-blue-50 border-cyan-200/80 text-cyan-700 hover:border-cyan-300' 
    },
    { 
      value: 'CAT', 
      label: 'CAT Companion', 
      desc: 'Management aspirants', 
      syllabus: 'Quantitative, Data Interpretation, Verbal',
      color: 'from-red-50 to-pink-50 border-red-200/80 text-red-700 hover:border-red-300' 
    },
    { 
      value: 'CUET', 
      label: 'CUET Companion', 
      desc: 'Central Universities Entry', 
      syllabus: 'Domain Subjects, General Test, Language',
      color: 'from-indigo-50 to-blue-50 border-indigo-200/80 text-indigo-700 hover:border-indigo-300' 
    },
  ];

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    
    if (!email.trim() || !password.trim()) {
      setAuthError('Please fill out all fields.');
      return;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setAuthError('Please enter a valid email address.');
      return;
    }

    if (password.length < 6) {
      setAuthError('Password must be at least 6 characters long.');
      return;
    }

    setIsAuthLoading(true);
    setAuthLoadingMessage(isSignUp ? 'Creating secure profile...' : 'Authenticating user node...');
    
    setTimeout(() => {
      setIsAuthLoading(false);
      localStorage.setItem('MINDMIRROR_LOGGED_IN', 'true');
      onLogin();
    }, 1000);
  };

  const handleGoogleSignIn = () => {
    setAuthError('');
    setIsAuthLoading(true);
    setAuthLoadingMessage('Connecting Google secure provider...');
    
    setTimeout(() => {
      setIsAuthLoading(false);
      localStorage.setItem('MINDMIRROR_LOGGED_IN', 'true');
      onLogin();
    }, 800);
  };

  const startDemoMode = () => {
    setAuthError('');
    setIsAuthLoading(true);
    setAuthLoadingMessage('Spinning up offline demo container...');
    
    setTimeout(() => {
      setIsAuthLoading(false);
      localStorage.setItem('MINDMIRROR_LOGGED_IN', 'true');
      onLogin();
    }, 500);
  };

  const handleSelectExam = (exam: ExamType) => {
    localStorage.setItem('MINDMIRROR_ONBOARDED', 'true');
    localStorage.setItem('MINDMIRROR_EXAM', exam);
    onComplete(exam);
  };

  return (
    <main aria-label="MindMirror Onboarding" className="min-h-screen w-full flex items-center justify-center relative overflow-hidden bg-[#f8fafc] px-4 py-8">
      {/* Background radial gradients */}
      <div className="absolute inset-0 bg-gradient-to-tr from-purple-100/30 via-slate-50 to-emerald-100/30 opacity-90" />
      <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-purple-500/5 blur-[120px] animate-float-slow" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[60vw] h-[60vw] rounded-full bg-emerald-500/5 blur-[140px] animate-float-reverse" />

      {step === 'welcome' ? (
        <motion.div
          key="welcome"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="w-full max-w-md text-center space-y-6 relative z-10"
        >
          {/* Header */}
          <div className="space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center font-display font-black text-white text-2xl mx-auto shadow-[0_4px_20px_rgba(37,99,235,0.15)] border border-blue-500/20">
              M
            </div>
            <h1 className="text-3xl font-display font-extrabold tracking-tight text-slate-900 leading-none">
              MindMirror <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">AI</span>
            </h1>
            <p className="text-xs text-slate-500 font-medium max-w-xs mx-auto">
              Understand Your Mind. Conquer Your Exams.
            </p>
          </div>

          {/* Authentication Panel */}
          <div className="glass-panel rounded-2xl p-6 border-slate-200/80 text-left space-y-5 shadow-xl">
            <h2 className="text-base font-bold text-slate-800">
              {isSignUp ? 'Create Your Account' : 'Sign In to MindMirror'}
            </h2>
            
            <form onSubmit={handleEmailSubmit} className="space-y-4">
              <div>
                <label htmlFor="email-input" className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">
                  Email Address
                </label>
                <input
                  id="email-input"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isAuthLoading}
                  placeholder="student@exam.com"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 text-xs text-slate-800 placeholder-slate-400 focus:outline-none transition-all duration-200"
                  aria-label="Email Address Field"
                />
              </div>

              <div>
                <label htmlFor="password-input" className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">
                  Password
                </label>
                <input
                  id="password-input"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isAuthLoading}
                  placeholder="••••••••"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 text-xs text-slate-800 placeholder-slate-400 focus:outline-none transition-all duration-200"
                  aria-label="Password Field"
                />
              </div>

              {authError && (
                <div role="alert" className="flex items-center space-x-2 text-red-600 text-[11px] bg-red-50 border border-red-200 p-2.5 rounded-xl">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{authError}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={isAuthLoading}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold text-xs tracking-wider transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-1.5 cursor-pointer shadow-md shadow-blue-500/10"
                aria-label={isSignUp ? "Submit simulated registration" : "Submit simulated email login"}
              >
                <Mail className="w-3.5 h-3.5 animate-pulse" />
                <span>
                  {isAuthLoading && authLoadingMessage.includes('email') 
                    ? authLoadingMessage 
                    : (isSignUp ? 'Continue with Email (Simulated)' : 'Continue with Email (Simulated)')}
                </span>
              </button>
            </form>

            <div className="relative flex py-1 items-center">
              <div className="flex-grow border-t border-slate-100" />
              <span className="flex-shrink mx-3 text-[9px] text-slate-400 font-mono tracking-widest uppercase">Or</span>
              <div className="flex-grow border-t border-slate-100" />
            </div>

            {/* Google Sign In */}
            <button
              onClick={handleGoogleSignIn}
              disabled={isAuthLoading}
              className="w-full py-2.5 border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs rounded-xl flex items-center justify-center space-x-2 transition-all duration-200 disabled:opacity-50 cursor-pointer shadow-sm"
              aria-label="Continue with Google account (simulated)"
            >
              <LogIn className="w-3.5 h-3.5 text-slate-400" />
              <span>
                {isAuthLoading && authLoadingMessage.includes('Google') 
                  ? authLoadingMessage 
                  : 'Continue with Google (Simulated)'}
              </span>
            </button>

            {/* Start Demo */}
            <button
              onClick={startDemoMode}
              disabled={isAuthLoading}
              className="w-full py-2.5 border border-slate-200 hover:border-slate-300 bg-slate-100 hover:bg-slate-200/50 text-slate-700 font-semibold text-xs rounded-xl flex items-center justify-center space-x-2 transition-all duration-200 disabled:opacity-50 cursor-pointer shadow-sm"
              aria-label="Launch application in offline demo mode"
            >
              <Sparkles className="w-3.5 h-3.5 text-blue-500 animate-pulse" />
              <span>
                {isAuthLoading && authLoadingMessage.includes('demo') 
                  ? authLoadingMessage 
                  : 'Start Demo Mode'}
              </span>
            </button>

            <div className="text-center pt-2">
              <button
                onClick={() => {
                  setIsSignUp(!isSignUp);
                  setAuthError('');
                }}
                className="text-[11px] text-blue-600 hover:text-blue-500 font-medium transition-colors cursor-pointer"
                aria-label={isSignUp ? "Switch to user login screen" : "Switch to user signup screen"}
              >
                {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Create one"}
              </button>
            </div>
          </div>

          {/* Footer tags */}
          <div className="flex items-center justify-center space-x-1.5 text-[9px] text-slate-400 font-mono">
            <Shield className="w-3.5 h-3.5" />
            <span>AI companion • Local data privacy secured</span>
          </div>
        </motion.div>
      ) : (
        /* Step: Exam Selection */
        <motion.div
          key="exam"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="w-full max-w-4xl text-center space-y-8 relative z-10"
        >
          <div className="space-y-2 max-w-md mx-auto">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 border border-blue-100 text-blue-700 animate-pulse">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Exam Companion Mode</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-display font-bold text-slate-900">
              Select Your Exam Companion
            </h2>
            <p className="text-xs text-slate-500 leading-normal">
              Choose the exam you are preparing for. MindMirror AI will tailor its mental checkers and motivation style accordingly.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4" role="list">
            {exams.map((exam) => (
              <button
                key={exam.value}
                onClick={() => handleSelectExam(exam.value)}
                className={`glass-panel border text-left rounded-2xl p-5 hover:scale-[1.02] cursor-pointer transition-all duration-300 group bg-gradient-to-tr ${exam.color} shadow-sm`}
                aria-label={`Select ${exam.label} - ${exam.desc}`}
                role="listitem"
              >
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-bold tracking-wider">{exam.label}</span>
                    <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-200" />
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">{exam.desc}</p>
                    <p className="text-xs text-slate-600 mt-1 font-medium">{exam.syllabus}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </motion.div>
      )}
    </main>
  );
};
