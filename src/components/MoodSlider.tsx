import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface MoodSliderProps {
  value: number;
  onChange: (value: number) => void;
}

interface MoodConfig {
  label: string;
  emoji: string;
  color: string;
  bgColor: string;
  glow: string;
}

export const MoodSlider: React.FC<MoodSliderProps> = ({ value, onChange }) => {
  const getMoodConfig = (val: number): MoodConfig => {
    if (val <= 3) {
      return {
        label: 'Overwhelmed',
        emoji: '😫',
        color: 'text-red-600',
        bgColor: 'bg-red-50',
        glow: 'border-red-200 shadow-sm'
      };
    } else if (val <= 6) {
      return {
        label: 'Managing',
        emoji: '😐',
        color: 'text-amber-600',
        bgColor: 'bg-amber-50',
        glow: 'border-amber-200 shadow-sm'
      };
    } else if (val <= 8) {
      return {
        label: 'Positive',
        emoji: '🙂',
        color: 'text-emerald-600',
        bgColor: 'bg-emerald-50',
        glow: 'border-emerald-200 shadow-sm'
      };
    } else {
      return {
        label: 'Excellent',
        emoji: '🤩',
        color: 'text-blue-600',
        bgColor: 'bg-blue-50',
        glow: 'border-blue-200 shadow-sm'
      };
    }
  };

  const config = getMoodConfig(value);

  return (
    <div className="flex flex-col space-y-4">
      <div className="flex justify-between items-center">
        <label htmlFor="mood-slider-input" className="text-sm font-medium text-slate-505 uppercase tracking-wider">
          How is your mental state? (1-10)
        </label>
        
        {/* Animated Mood Badge */}
        <AnimatePresence mode="wait">
          <motion.div
            key={config.label}
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className={`flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-semibold border ${config.bgColor} ${config.color} ${config.glow}`}
          >
            <span className="text-sm">{config.emoji}</span>
            <span>{config.label} ({value})</span>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="relative flex items-center py-2">
        {/* Slider Input */}
        <input
          id="mood-slider-input"
          type="range"
          min="1"
          max="10"
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full h-2 rounded-lg appearance-none cursor-pointer bg-slate-200 accent-blue-600 focus:outline-none transition-all duration-300"
          style={{
            background: `linear-gradient(to right, #2563eb 0%, #10b981 ${(value - 1) * 11.1}%, #e2e8f0 ${(value - 1) * 11.1}%, #e2e8f0 100%)`
          }}
          aria-label="Mental State Score from 1 to 10"
        />
      </div>

      {/* Axis Guide */}
      <div className="flex justify-between text-[10px] text-slate-400 font-mono px-1">
        <span>1: CRITICAL</span>
        <span>5: STABLE</span>
        <span>10: OPTIMAL</span>
      </div>
    </div>
  );
};
