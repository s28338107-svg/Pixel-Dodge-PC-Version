
import React from 'react';

interface TutorialOverlayProps {
  onClose: () => void;
}

const TutorialOverlay: React.FC<TutorialOverlayProps> = ({ onClose }) => {
  return (
    <div className="h-full flex flex-col p-8 bg-stone-900 border-8 border-white">
      <h2 className="text-xl mb-12 text-white text-center font-bold italic uppercase tracking-widest underline underline-offset-8">HOW TO PLAY</h2>
      
      <div className="flex-1 space-y-8">
        <div className="flex gap-4 items-start p-4 bg-black border-4 border-stone-700">
          <div className="flex gap-1">
            <div className="w-8 h-8 border-2 border-white bg-stone-800 flex items-center justify-center text-white text-[10px] font-bold">A</div>
            <div className="w-8 h-8 border-2 border-white bg-stone-800 flex items-center justify-center text-white text-[10px] font-bold">D</div>
          </div>
          <p className="text-[8px] leading-relaxed text-stone-300 font-bold uppercase mt-1">MOVE LEFT AND RIGHT!</p>
        </div>

        <div className="flex gap-4 items-center p-4 bg-black border-4 border-stone-700">
          <div className="w-8 h-8 flex-shrink-0 bg-red-600 border-2 border-white"></div>
          <p className="text-[8px] leading-relaxed text-stone-300 font-bold uppercase">DODGE THE FALLING SPIKES!</p>
        </div>

        <div className="flex gap-4 items-center p-4 bg-black border-4 border-stone-700">
          <div className="w-8 h-8 flex-shrink-0 bg-yellow-500 border-2 border-white flex items-center justify-center text-[10px] text-black font-bold">x2</div>
          <p className="text-[8px] leading-relaxed text-stone-300 font-bold uppercase">STAY ALIVE TO MULTIPLY SCORE!</p>
        </div>

        <div className="p-4 bg-stone-800 border-4 border-white">
          <p className="text-[6px] text-stone-400 text-center uppercase font-bold leading-normal">
            SECRET: UNLOCK ULTRAVOID BY FINISHING 15 QUESTS!
          </p>
        </div>
      </div>

      <button 
        onClick={onClose}
        className="w-full py-5 mt-8 text-[10px] border-4 border-white bg-white text-black font-bold hover:bg-black hover:text-white uppercase tracking-widest transition-colors"
      >
        I GET IT!
      </button>
    </div>
  );
};

export default TutorialOverlay;
