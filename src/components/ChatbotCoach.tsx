import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, MessageCircle, AlertCircle, Trash2 } from 'lucide-react';
import type { JournalEntry, ChatMessage, ExamType } from '../types';
import { motion } from 'framer-motion';

interface ChatbotCoachProps {
  currentEntry: JournalEntry | null;
  selectedExam: ExamType;
}

export const ChatbotCoach: React.FC<ChatbotCoachProps> = ({
  currentEntry,
  selectedExam,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'bot',
      text: `Hi! I'm MindMirror, your empathetic AI wellness coach. I'm loaded with context about your ${selectedExam} prep. Feel free to talk to me about mock scores, time pressure, or any burnout issues you're feeling. I'm right here with you!`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const chatContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // Adjust starting chat message when Exam Companion changes
  useEffect(() => {
    setMessages([
      {
        id: 'welcome',
        sender: 'bot',
        text: `Hi! I'm MindMirror. I've activated ${selectedExam} Companion Mode. How are you holding up with your study schedules or stress levels today? Let's work together to conquer this syllabus.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  }, [selectedExam]);

  const quickPrompts = [
    `I'm stressed about mock scores.`,
    `How do I deal with peer pressure?`,
    `Give me a study pacing tip.`,
    `I feel exhausted and cannot study.`
  ];

  const handleSend = async (textToSend: string) => {
    if (!textToSend.trim()) return;

    setErrorMsg('');
    const userMsg: ChatMessage = {
      id: Math.random().toString(),
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      // Assemble context from current entry
      const analysisContext = currentEntry?.analysis ? {
        exam: selectedExam,
        mindStabilityIndex: currentEntry.analysis.mindStabilityIndex,
        stressLevel: currentEntry.analysis.stressLevel,
        hiddenTriggers: currentEntry.analysis.hiddenTriggers,
        emotionalPatterns: currentEntry.analysis.emotionalPatterns,
        journalText: currentEntry.text,
      } : {
        exam: selectedExam,
        journalText: "No current journal submitted yet.",
      };

      // Compile message history format for the backend Express chat API
      const history = messages
        .filter(m => m.id !== 'welcome')
        .map(m => ({
          role: m.sender,
          content: m.text
        }));
      history.push({ role: 'user', content: textToSend });

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: history,
          context: analysisContext,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to reach AI coaching server.');
      }

      const data = await response.json();
      
      const botMsg: ChatMessage = {
        id: Math.random().toString(),
        sender: 'bot',
        text: data.reply || "I'm reflecting on your thoughts. Let's practice a brief breathing break.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err: any) {
      console.error(err);
      setErrorMsg('Could not send message to MindMirror coach. Verify the backend is running.');
    } finally {
      setIsTyping(false);
    }
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: 'welcome',
        sender: 'bot',
        text: `Chat reset. I'm ready to support your ${selectedExam} wellness goals. What's on your mind?`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 20 }}
      whileInView={{ opacity: 1, scale: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="glass-panel rounded-2xl border-slate-200/80 flex flex-col h-[520px] overflow-hidden relative shadow-sm"
      role="region"
      aria-label="AI Wellness Coach Chat"
    >
      {/* Chat Header */}
      <div className="px-6 py-4 bg-slate-50 border-b border-slate-200/60 flex justify-between items-center shrink-0">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-xl border border-blue-100">
              <MessageCircle className="w-5 h-5" />
            </div>
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-white shadow-[0_2px_8px_rgba(16,185,129,0.3)]" />
          </div>
          <div>
            <h2 className="text-sm font-semibold font-display text-slate-800 flex items-center gap-1">
              MindMirror Coach
              <Sparkles className="w-3 h-3 text-purple-500" />
            </h2>
            <p className="text-[10px] text-slate-505 font-mono">
              Exam Companion: <span className="text-purple-600 font-semibold">{selectedExam}</span>
            </p>
          </div>
        </div>

        <motion.button 
          onClick={handleClearChat}
          whileHover={{ scale: 1.1, color: '#ef4444', backgroundColor: 'rgba(239, 68, 68, 0.05)' }}
          whileTap={{ scale: 0.95 }}
          className="p-1.5 hover:bg-slate-100 text-slate-400 rounded-lg transition-all cursor-pointer"
          title="Reset chat"
          aria-label="Reset chat messages history"
        >
          <Trash2 className="w-4 h-4" />
        </motion.button>
      </div>

      {/* Messages Feed */}
      <div
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto p-6 space-y-4 bg-white/40"
        role="log"
        aria-live="polite"
      >
        {messages.map((m) => (
          <motion.div
            key={m.id}
            initial={{ opacity: 0, scale: 0.92, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] rounded-2xl px-4 py-3 text-xs leading-relaxed transition-all duration-300 ${
                m.sender === 'user'
                  ? 'bg-blue-50 border border-blue-100 text-blue-900 rounded-tr-none shadow-sm'
                  : 'bg-slate-50 border border-slate-200/60 text-slate-800 rounded-tl-none'
              }`}
            >
              <p className="whitespace-pre-wrap">{m.text}</p>
              <div className="text-[9px] text-slate-400 text-right mt-1.5 font-mono">
                {m.timestamp}
              </div>
            </div>
          </motion.div>
        ))}

        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-slate-50 border border-slate-100 text-slate-650 rounded-2xl rounded-tl-none px-4 py-3">
              <div className="flex items-center space-x-1">
                <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}

        {errorMsg && (
          <div role="alert" className="flex items-center space-x-2 text-red-600 text-[11px] bg-red-50 border border-red-205/50 p-2.5 rounded-xl">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}
        
      </div>

      {/* Suggested Prompt Chips */}
      <div className="px-6 py-2 bg-slate-50/50 border-t border-slate-200/60 flex gap-2 overflow-x-auto shrink-0 scrollbar-none" role="group" aria-label="Suggested chatbot prompt guides">
        {quickPrompts.map((p, idx) => (
          <motion.button
            key={idx}
            onClick={() => handleSend(p)}
            whileHover={{ scale: 1.05, backgroundColor: 'rgba(241, 245, 249, 0.8)', borderColor: 'rgba(37, 99, 235, 0.3)' }}
            whileTap={{ scale: 0.95 }}
            className="text-[10px] bg-white text-slate-605 hover:text-slate-800 border border-slate-200 px-2.5 py-1.5 rounded-full whitespace-nowrap transition-all cursor-pointer shadow-sm"
            aria-label={`Send suggested chat query: ${p}`}
          >
            {p}
          </motion.button>
        ))}
      </div>

      {/* Input Form */}
      <div className="p-4 bg-slate-50 border-t border-slate-200/60 shrink-0">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend(input);
          }}
          className="flex space-x-2"
        >
          <label htmlFor="chat-message-input" className="sr-only">Type message to AI wellness coach</label>
          <input
            id="chat-message-input"
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isTyping}
            placeholder={`Ask MindMirror about ${selectedExam} anxiety...`}
            className="flex-1 px-4 py-2.5 rounded-xl bg-white border border-slate-250 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500/20 text-xs placeholder-slate-400 text-slate-800 disabled:opacity-50"
            aria-label="Chat input field to speak with AI coach"
          />
          <motion.button
            type="submit"
            disabled={isTyping || !input.trim()}
            whileHover={isTyping || !input.trim() ? {} : { scale: 1.05, boxShadow: '0 4px 15px rgba(37, 99, 235, 0.2)' }}
            whileTap={isTyping || !input.trim() ? {} : { scale: 0.95 }}
            className="px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl flex items-center justify-center transition-all disabled:opacity-50 disabled:cursor-not-allowed shrink-0 cursor-pointer shadow-sm"
            aria-label="Send message button"
          >
            <Send className="w-4 h-4" />
          </motion.button>
        </form>
      </div>

    </motion.div>
  );
};
