
import React from 'react';

interface PauseOverlayProps {
  onResume: () => void;
  onMenu: () => void;
}

const PauseOverlay: React.FC<PauseOverlayProps> = ({ onResume, onMenu }) => {
  return (
    <div className="absolute inset-0 bg-black/80 z-[60] flex flex-col items-center justify-center p-8">
      <div className="text-center mb-12">
        <h2 className="text-3xl text-white font-bold mb-4 italic tracking-widest drop-shadow-[4px_4px_0px_#ef4444]">PAUSED</h2>
        <div className="h-1 w-24 bg-white mx-auto"></div>
      </div>

      <div className="w-full space-y-4">
        <button 
          onClick={onResume}
          className="w-full py-5 text-[10px] border-4 border-white bg-white text-black font-bold uppercase tracking-widest hover:bg-black hover:text-white transition-colors pixel-border"
        >
          RESUME
        </button>
        <button 
          onClick={onMenu}
          className="w-full py-4 text-[8px] border-4 border-white bg-black text-white font-bold uppercase tracking-widest hover:bg-stone-800 transition-colors pixel-border"
        >
          QUIT TO MENU
        </button>
      </div>
    </div>
  );
};

export default PauseOverlay;
