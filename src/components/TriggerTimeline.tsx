import React from 'react';
import type { JournalEntry } from '../types';
import { Calendar, AlertOctagon, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';

interface TriggerTimelineProps {
  entries: JournalEntry[];
}

export const TriggerTimeline: React.FC<TriggerTimelineProps> = ({ entries }) => {
  // Filter entries that have analysis and hiddenTriggers
  const analyzedEntries = entries.filter(e => e.analysis && e.analysis.hiddenTriggers.length > 0);

  if (analyzedEntries.length === 0) {
    return (
      <motion.section
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="glass-panel rounded-2xl p-6 border-slate-200/80 flex flex-col items-center justify-center text-center py-12"
        aria-label="Hidden Stress Drivers & Trigger Timeline"
      >
        <div className="p-3 bg-slate-100 rounded-full text-slate-400 mb-3 border border-slate-200/50">
          <AlertOctagon className="w-6 h-6" />
        </div>
        <h3 className="text-slate-700 font-semibold mb-1 text-sm">No Stress Timeline Yet</h3>
        <p className="text-xs text-slate-500 max-w-xs">
          Submit your first daily journal. MindMirror will decode your stress sources to map your triggers here.
        </p>
      </motion.section>
    );
  }

  // Calculate triggers frequency
  const triggerCounts: { [key: string]: number } = {};
  analyzedEntries.forEach(entry => {
    entry.analysis?.hiddenTriggers.forEach(t => {
      triggerCounts[t] = (triggerCounts[t] || 0) + 1;
    });
  });

  // Find the primary stress driver
  let primaryStressDriver = "";
  let maxCount = 0;
  Object.entries(triggerCounts).forEach(([trigger, count]) => {
    if (count > maxCount) {
      maxCount = count;
      primaryStressDriver = trigger;
    }
  });

  // Get driver descriptions for visual wow-factor
  const getDriverDetails = (driver: string) => {
    switch (driver) {
      case "Mock Test Anxiety":
        return {
          color: "border-red-200 bg-red-50/50 text-red-700",
          advice: "Mock scores reflect study gaps, not your potential. Limit score reviews; focus entirely on concept corrections."
        };
      case "Parental Expectations":
        return {
          color: "border-amber-200 bg-amber-50/50 text-amber-700",
          advice: "Family pressure often stems from care. Try having a candid talk, or set small boundaries. Your worth isn't tied to an exam score."
        };
      case "Peer Comparison":
        return {
          color: "border-purple-200 bg-purple-50/50 text-purple-700",
          advice: "Comparison is the thief of joy. Run your own race. Filter out group chats where ranks are discussed relentlessly."
        };
      case "Fear of Failure":
        return {
          color: "border-blue-200 bg-blue-50/50 text-blue-700",
          advice: "Acknowledge the fear, but break tasks into micro-steps. Action cures fear. Focus on the next 30 minutes only."
        };
      case "Syllabus / Time Pressure":
        return {
          color: "border-cyan-200 bg-cyan-50/50 text-cyan-700",
          advice: "Massive syllabi can feel crushing. Prioritize high-weightage topics. A completed 70% analyzed is better than a rushed 100%."
        };
      case "Sleep Deprivation":
        return {
          color: "border-indigo-200 bg-indigo-50/50 text-indigo-700",
          advice: "Sleep is cognitive currency. Reclaim at least 7 hours. A fatigued brain loses 30% retention speed."
        };
      default:
        return {
          color: "border-emerald-200 bg-emerald-50/50 text-emerald-700",
          advice: "Practice micro-breaks and focus recovery routines. Maintain consistency in self-care."
        };
    }
  };

  const driverDetails = getDriverDetails(primaryStressDriver);

  // Take the last 5 entries for the timeline
  const timelineEntries = [...analyzedEntries].reverse().slice(0, 5);

  return (
    <motion.section
      initial={{ opacity: 0, scale: 0.95, y: 20 }}
      whileInView={{ opacity: 1, scale: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="glass-panel rounded-2xl p-6 border-slate-200/80 space-y-6"
      aria-label="Stress Trigger Timeline & Frequencies"
    >
      
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="flex items-center space-x-2"
      >
        <TrendingUp className="w-5 h-5 text-emerald-600" />
        <h2 className="text-lg font-display font-semibold text-slate-800">Hidden Trigger Timeline</h2>
      </motion.div>

      {/* Primary Stress Driver Highlight */}
      {primaryStressDriver && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.015 }}
          className={`border rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all duration-300 ${driverDetails.color}`}
          role="alert"
          aria-label={`Warning: Primary stress driver is ${primaryStressDriver}`}
        >
          <div className="space-y-1">
            <span className="text-[10px] tracking-widest font-bold uppercase text-slate-400">
              Primary Stress Driver
            </span>
            <h3 className="text-base font-bold flex items-center gap-1.5">
              <AlertOctagon className="w-4 h-4 shrink-0" />
              {primaryStressDriver}
            </h3>
            <p className="text-xs opacity-90 max-w-xl leading-relaxed">
              {driverDetails.advice}
            </p>
          </div>
          <div className="shrink-0 flex items-center justify-center bg-white border border-slate-250 rounded-lg px-3 py-2 text-center shadow-sm">
            <div>
              <div className="text-xl font-bold text-slate-800">{maxCount}x</div>
              <div className="text-[9px] text-slate-400 uppercase tracking-wider">Detected Source</div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Frequency Distribution */}
      <div className="bg-slate-50 border border-slate-200/60 rounded-xl p-4" aria-label="Trigger Frequency distribution metrics">
        <h4 className="text-xs font-semibold text-slate-505 uppercase tracking-wider mb-3">
          Trigger Frequency
        </h4>
        <div className="space-y-2" role="list">
          {Object.entries(triggerCounts)
            .sort((a, b) => b[1] - a[1])
            .map(([trigger, count]) => {
              const percentage = Math.round((count / analyzedEntries.length) * 100);
              return (
                <div key={trigger} className="space-y-1" role="listitem" aria-label={`${trigger} stress source detected in ${count} entries, representing ${percentage} percent of overall logs`}>
                  <div className="flex justify-between text-xs text-slate-700">
                    <span>{trigger}</span>
                    <span className="font-mono text-[10px] text-slate-400">{count} entries ({percentage}%)</span>
                  </div>
                  <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      whileInView={{ width: `${percentage}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.8, ease: 'easeOut' }}
                      className="bg-gradient-to-r from-blue-500 to-indigo-500 h-full rounded-full"
                    />
                  </div>
                </div>
              );
            })}
        </div>
      </div>

      {/* Cron Timeline (Last 5 analyzed entries) */}
      <div className="space-y-4">
        <h4 className="text-xs font-semibold text-slate-505 uppercase tracking-wider">
          Timeline Log
        </h4>
        <div className="relative border-l border-slate-200 pl-4 ml-2 space-y-5 py-1" role="list" aria-label="Timeline log of recent reflections">
          {timelineEntries.map((entry, idx) => (
            <motion.div 
              key={entry.id}
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.08 }}
              className="relative"
              role="listitem"
              aria-label={`Timeline log entry on ${entry.date} for ${entry.exam} Companion. Stability index: ${entry.analysis?.mindStabilityIndex} percent.`}
            >
              {/* Timeline node */}
              <div className="absolute -left-[21px] top-1.5 w-2.5 h-2.5 rounded-full bg-purple-500 border border-white shadow-[0_2px_8px_rgba(139,92,246,0.3)]" />
              
              <div className="space-y-1">
                <div className="flex items-center space-x-2 text-[10px] text-slate-400 font-mono">
                  <Calendar className="w-3 h-3" />
                  <span>{entry.date}</span>
                  <span>•</span>
                  <span>{entry.exam} Companion</span>
                  <span>•</span>
                  <span className="text-slate-500">MSI: {entry.analysis?.mindStabilityIndex}%</span>
                </div>
                
                <p className="text-xs text-slate-700 line-clamp-1 italic font-light">
                  "{entry.text}"
                </p>
                
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {entry.analysis?.hiddenTriggers.map((trig, tIdx) => (
                    <motion.span 
                      key={tIdx}
                      whileHover={{ scale: 1.05 }}
                      className="text-[9px] px-2 py-0.5 rounded-md bg-slate-100 border border-slate-200/50 text-slate-605 cursor-default"
                    >
                      {trig}
                    </motion.span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
      
    </motion.section>
  );
};
