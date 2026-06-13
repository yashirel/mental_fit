import React, { useState, useEffect } from 'react';
import { Wind, Play, Square, Brain, Target, Compass } from 'lucide-react';
import confetti from 'canvas-confetti';
import { motion } from 'framer-motion';

type BreathPhase = 'Inhale' | 'Hold In' | 'Exhale' | 'Hold Out';

export const CopingExercises: React.FC = () => {
  const [isBreathing, setIsBreathing] = useState(false);
  const [phase, setPhase] = useState<BreathPhase>('Hold Out');
  const [secondsLeft, setSecondsLeft] = useState(120); // 2 minutes
  const [phaseTimer, setPhaseTimer] = useState(4); // 4 seconds per phase

  useEffect(() => {
    let interval: any;
    
    if (isBreathing) {
      interval = setInterval(() => {
        // Overal session timer
        setSecondsLeft((prev) => {
          if (prev <= 1) {
            setIsBreathing(false);
            confetti({
              particleCount: 80,
              spread: 60,
              colors: ['#2563eb', '#10b981']
            });
            return 120;
          }
          return prev - 1;
        });

        // Phase timer
        setPhaseTimer((prev) => {
          if (prev <= 1) {
            // Cycle phases
            setPhase((currPhase) => {
              switch (currPhase) {
                case 'Hold Out': return 'Inhale';
                case 'Inhale': return 'Hold In';
                case 'Hold In': return 'Exhale';
                case 'Exhale': return 'Hold Out';
                default: return 'Hold Out';
              }
            });
            return 4;
          }
          return prev - 1;
        });

      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isBreathing]);

  // Reset exercise
  const startBreathing = () => {
    setIsBreathing(true);
    setPhase('Inhale');
    setPhaseTimer(4);
    setSecondsLeft(120);
  };

  const stopBreathing = () => {
    setIsBreathing(false);
    setPhase('Hold Out');
    setPhaseTimer(4);
    setSecondsLeft(120);
  };

  // UI styling based on breathing phase
  const getOrbStyle = (currentPhase: BreathPhase) => {
    switch (currentPhase) {
      case 'Inhale':
        return {
          scale: 1.8,
          shadow: 'shadow-[0_0_30px_rgba(139,92,246,0.2)] bg-purple-100/80 border-purple-400',
          text: 'Inhale...',
          color: 'text-purple-600'
        };
      case 'Hold In':
        return {
          scale: 1.8,
          shadow: 'shadow-[0_0_35px_rgba(16,185,129,0.2)] bg-emerald-100/80 border-emerald-400',
          text: 'Hold Breath',
          color: 'text-emerald-600'
        };
      case 'Exhale':
        return {
          scale: 1.0,
          shadow: 'shadow-[0_0_20px_rgba(6,182,212,0.15)] bg-cyan-100/80 border-cyan-400',
          text: 'Exhale...',
          color: 'text-cyan-600'
        };
      case 'Hold Out':
        return {
          scale: 1.0,
          shadow: 'shadow-none bg-slate-100 border-slate-300',
          text: 'Hold Out',
          color: 'text-slate-500'
        };
    }
  };

  const orb = getOrbStyle(phase);

  const copingStrategies = [
    {
      title: "Focus Recovery Routine",
      desc: "For rapid grounding after an exhausting study stretch.",
      steps: ["Close all books and laptops.", "List 5 green items in your room.", "Touch 3 items with distinct textures.", "Drink one glass of cold water slowly."],
      icon: <Brain className="w-5 h-5 text-purple-600" />
    },
    {
      title: "Confidence Reset Exercise",
      desc: "Perfect after a disappointing mock exam score.",
      steps: ["Sit upright. Breathe out thoroughly.", "Remind yourself: 'Scores are data, not my final capability.'", "Write down 3 challenging topics you successfully learned this month.", "Identify just ONE error from today to study tomorrow."],
      icon: <Target className="w-5 h-5 text-emerald-600" />
    },
    {
      title: "Exam-Day Calming Ritual",
      desc: "A quick mental routine for the minutes before entering the test hall.",
      steps: ["Avoid talking to peers about syllabus or mock targets.", "Unclench jaw, drop shoulders, roll neck.", "Do three cycles of 4s- inhale / 6s- exhale.", "Remind yourself of the hard hours you invested."],
      icon: <Compass className="w-5 h-5 text-cyan-600" />
    }
  ];

  return (
    <motion.section
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '-50px' }}
      variants={{
        hidden: { opacity: 0 },
        show: {
          opacity: 1,
          transition: {
            staggerChildren: 0.1
          }
        }
      }}
      className="grid grid-cols-1 lg:grid-cols-12 gap-6"
      aria-label="Breathing & Grounding Exercises"
    >
      
      {/* Box Breathing Visualizer */}
      <motion.div
        variants={{
          hidden: { opacity: 0, scale: 0.95, y: 15 },
          show: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.5 } }
        }}
        className="glass-panel rounded-2xl p-6 lg:col-span-7 border-slate-200/80 flex flex-col items-center justify-between min-h-[420px] relative overflow-hidden"
      >
        <div className="w-full flex justify-between items-center mb-4">
          <div className="flex items-center space-x-2">
            <Wind className="w-5 h-5 text-blue-600" />
            <h2 className="text-lg font-display font-semibold text-slate-800">Box Breathing Guide (4-4-4-4)</h2>
          </div>
          {isBreathing && (
            <span className="text-xs font-mono bg-slate-100 border border-slate-200 text-slate-600 px-2.5 py-1 rounded-md" aria-live="off" aria-label={`Time remaining: ${Math.floor(secondsLeft / 60)} minutes and ${secondsLeft % 60} seconds`}>
              Session: {Math.floor(secondsLeft / 60)}:{(secondsLeft % 60).toString().padStart(2, '0')}
            </span>
          )}
        </div>

        {/* Breathing Orb Area */}
        <div className="h-64 flex items-center justify-center relative w-full" aria-live="polite">
          {!isBreathing ? (
            <div className="text-center space-y-3 px-4">
              <div className="w-20 h-20 rounded-full border border-dashed border-slate-300 flex items-center justify-center mx-auto opacity-75 animate-pulse">
                <Wind className="w-8 h-8 text-slate-400" />
              </div>
              <p className="text-xs text-slate-500 max-w-sm">
                Box breathing is a proven parasympathetic nervous system trigger that shuts down fight-or-flight exam panic.
              </p>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center" aria-label={`Current breathing phase: ${orb.text}. Phase timer: ${phaseTimer} seconds remaining.`}>
              {/* Dynamic Scaling Orb */}
              <div 
                className={`w-24 h-24 rounded-full border-2 flex flex-col items-center justify-center text-center transition-all duration-[4000ms] ease-linear transform ${orb.shadow}`}
                style={{ transform: `scale(${orb.scale})` }}
              >
                <div className="flex flex-col items-center justify-center transition-all duration-300">
                  <span className={`text-[9px] font-bold tracking-widest uppercase opacity-85 ${orb.color}`}>
                    {orb.text}
                  </span>
                  <span className="text-base font-bold text-slate-800 font-mono mt-0.5">
                    {phaseTimer}s
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Action Controls */}
        <div className="w-full pt-4 flex gap-3">
          {!isBreathing ? (
            <motion.button
              onClick={startBreathing}
              whileHover={{ scale: 1.015, boxShadow: '0 4px 15px rgba(37, 99, 235, 0.2)' }}
              whileTap={{ scale: 0.99 }}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold py-3 px-4 rounded-xl text-sm flex items-center justify-center space-x-2 shadow-sm transition-all duration-200 cursor-pointer"
              aria-label="Start two minute box breathing reset exercise"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>Start 2-Minute Resettling</span>
            </motion.button>
          ) : (
            <motion.button
              onClick={stopBreathing}
              whileHover={{ scale: 1.015, borderColor: '#fca5a5', color: '#ef4444' }}
              whileTap={{ scale: 0.99 }}
              className="w-full bg-white hover:bg-slate-50 border border-slate-200 text-slate-600 font-semibold py-3 px-4 rounded-xl text-sm flex items-center justify-center space-x-2 transition-all duration-200 cursor-pointer"
              aria-label="Abort box breathing exercise"
            >
              <Square className="w-4 h-4 fill-slate-600" />
              <span>Abort Exercise</span>
            </motion.button>
          )}
        </div>
      </motion.div>

      {/* Other Adaptive Routines */}
      <div className="lg:col-span-5 flex flex-col space-y-4">
        <motion.h3
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="text-xs font-semibold text-slate-500 uppercase tracking-wider pl-1"
        >
          Adaptive Coping Protocols
        </motion.h3>
        
        {copingStrategies.map((strat, idx) => (
          <motion.div 
            key={idx} 
            variants={{
              hidden: { opacity: 0, scale: 0.95, y: 15 },
              show: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.5 } }
            }}
            whileHover={{ scale: 1.02, borderColor: 'rgba(37, 99, 235, 0.2)', boxShadow: '0 8px 20px -5px rgba(15, 23, 42, 0.05)' }}
            className="glass-panel rounded-2xl p-4 border-slate-200/60 flex items-start space-x-3 transition-all duration-300"
          >
            <div className="p-2 bg-slate-50 border border-slate-100 rounded-xl shrink-0">
              {strat.icon}
            </div>
            <div className="space-y-1.5">
              <h4 className="text-xs font-bold text-slate-800">{strat.title}</h4>
              <p className="text-[11px] text-slate-505 leading-relaxed">{strat.desc}</p>
              
              <ul className="text-[10px] text-slate-550 space-y-1 pl-1" role="list">
                {strat.steps.map((step, sIdx) => (
                  <li key={sIdx} className="flex items-start gap-1" role="listitem">
                    <span className="text-emerald-600 font-bold">•</span>
                    <span className="text-slate-600">{step}</span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        ))}
      </div>

    </motion.section>
  );
};
