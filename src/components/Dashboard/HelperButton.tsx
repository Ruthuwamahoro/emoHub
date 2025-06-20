import React from 'react';
import { HelpCircle } from 'lucide-react';

interface VibratingHelpButtonProps {
  onClick: () => void;
  className?: string;
}

const VibratingHelpButton: React.FC<VibratingHelpButtonProps> = ({ 
  onClick, 
  className = "" 
}) => {
  return (
    <div className={`relative ${className}`}>
      <button
        onClick={onClick}
        data-tour="take-tour"
        className="group relative w-7 h-7 bg-[#fb923c] rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-4 focus:ring-rose-300 focus:ring-opacity-50"
        title="Take a tour of the dashboard"
        style={{
          animation: 'vibratePhone 0.8s ease-in-out infinite'
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-rose-300 to-rose-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm" />
        
        <div className="relative z-10 flex items-center justify-center w-full h-full">
          <HelpCircle 
            className="w-3 h-3 text-white drop-shadow-sm" 
            fill="currentColor" 
          />
        </div>
        
        <div 
          className="absolute inset-0 rounded-full border-2 border-rose-300 opacity-75"
          style={{
            animation: 'pulseRing 2s cubic-bezier(0.455, 0.03, 0.515, 0.955) infinite'
          }}
        />
        <div 
          className="absolute inset-0 rounded-full border-2 border-rose-400 opacity-50"
          style={{
            animation: 'pulseRing 2s cubic-bezier(0.455, 0.03, 0.515, 0.955) infinite 1s'
          }}
        />
        
        <div 
          className="absolute -top-1 -right-1 w-2 h-2 bg-rose-300 rounded-full opacity-80"
          style={{
            animation: 'floatParticle 3s ease-in-out infinite'
          }}
        />
        <div 
          className="absolute -bottom-1 -left-1 w-1.5 h-1.5 bg-rose-400 rounded-full opacity-60"
          style={{
            animation: 'floatParticle 3s ease-in-out infinite 1.5s'
          }}
        />
        <div 
          className="absolute top-0 left-0 w-1 h-1 bg-rose-200 rounded-full opacity-70"
          style={{
            animation: 'floatParticle 3s ease-in-out infinite 0.5s'
          }}
        />
      </button>
      
      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap">
        Take Dashboard Tour
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900" />
      </div>
      
      <style jsx>{`
        @keyframes vibratePhone {
          0%, 100% { transform: translateX(0) rotate(0deg); }
          10% { transform: translateX(-1px) rotate(-0.5deg); }
          20% { transform: translateX(1px) rotate(0.5deg); }
          30% { transform: translateX(-1px) rotate(-0.5deg); }
          40% { transform: translateX(1px) rotate(0.5deg); }
          50% { transform: translateX(-0.5px) rotate(-0.25deg); }
          60% { transform: translateX(0.5px) rotate(0.25deg); }
          70% { transform: translateX(-0.5px) rotate(-0.25deg); }
          80% { transform: translateX(0.5px) rotate(0.25deg); }
          90% { transform: translateX(0) rotate(0deg); }
        }
        
        @keyframes pulseRing {
          0% {
            transform: scale(1);
            opacity: 0.8;
          }
          50% {
            opacity: 0.4;
          }
          100% {
            transform: scale(1.5);
            opacity: 0;
          }
        }
        
        @keyframes floatParticle {
          0%, 100% {
            transform: translateY(0px) scale(1);
            opacity: 0.8;
          }
          25% {
            transform: translateY(-8px) scale(1.1);
            opacity: 1;
          }
          50% {
            transform: translateY(-12px) scale(0.9);
            opacity: 0.6;
          }
          75% {
            transform: translateY(-6px) scale(1.05);
            opacity: 0.9;
          }
        }
      `}</style>
    </div>
  );
};

export default VibratingHelpButton;