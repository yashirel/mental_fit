import React from 'react';

export const GlowingBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 -z-50 w-full h-full overflow-hidden bg-[#f8fafc]">
      {/* Dynamic Aurora Glow */}
      <div className="absolute inset-0 bg-gradient-to-tr from-purple-100/30 via-slate-50 to-emerald-100/30 opacity-90" />
      
      {/* Floating Blurred Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-purple-500/5 blur-[120px] animate-float-slow" />
      
      <div className="absolute bottom-[-10%] right-[-10%] w-[60vw] h-[60vw] rounded-full bg-emerald-500/5 blur-[140px] animate-float-reverse" />
      
      <div className="absolute top-[30%] left-[60%] w-[35vw] h-[35vw] rounded-full bg-blue-500/5 blur-[100px] animate-float" />
      
      {/* Overlay Mesh Pattern */}
      <div 
        className="absolute inset-0 opacity-[0.015] pointer-events-none" 
        style={{
          backgroundImage: `radial-gradient(circle, #0f172a 1px, transparent 1px)`,
          backgroundSize: '24px 24px',
        }}
      />
    </div>
  );
};
