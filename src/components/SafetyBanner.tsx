import React from 'react';
import { ShieldAlert, HeartHandshake, PhoneCall } from 'lucide-react';
import { motion } from 'framer-motion';

interface SafetyBannerProps {
  showHelplines: boolean;
}

export const SafetyBanner: React.FC<SafetyBannerProps> = ({ showHelplines }) => {
  return (
    <div className="space-y-4">
      {showHelplines && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          className="glass-panel border-red-500/25 bg-red-950/10 rounded-2xl p-5 md:p-6"
        >
          <div className="flex items-start space-x-3.5">
            <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl shrink-0">
              <HeartHandshake className="w-6 h-6" />
            </div>
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-red-300 font-display">Empathetic Care Checkpoint</h3>
              
              <p className="text-xs text-red-100/80 leading-relaxed max-w-2xl">
                We've detected high stress levels in your recent updates. MindMirror is an AI wellness companion, not a clinical tool. **Consider reaching out to a trusted friend, family member, counselor, or mental health professional.** Talking to someone can bring massive clarity.
              </p>
              
              <div className="flex flex-wrap gap-4 pt-1 text-[11px] text-red-200">
                <div className="flex items-center gap-1.5 font-mono">
                  <PhoneCall className="w-3.5 h-3.5" />
                  <span>National Student Helpline: 91-xxxx-xxxx (India) / 988 (US)</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Global Base Disclaimer */}
      <div className="text-center text-[10px] text-zinc-600 max-w-md mx-auto leading-relaxed border-t border-zinc-900 pt-4">
        <div className="flex items-center justify-center gap-1 mb-1 font-semibold text-zinc-500">
          <ShieldAlert className="w-3.5 h-3.5" />
          <span>MindMirror AI Safety Disclaimer</span>
        </div>
        MindMirror provides mental wellness support and mindfulness tools for exams. It does not provide medical diagnoses, clinical therapy, or psychiatric evaluations. If you are experiencing high or chronic emotional distress, please consult a qualified mental health specialist.
      </div>
    </div>
  );
};
