
import React from 'react';
import { Difficulty } from '../types';

interface GameOverOverlayProps {
  score: number;
  time: number;
  difficulty: Difficulty;
  onRestart: () => void;
  onMenu: () => void;
}

const GameOverOverlay: React.FC<GameOverOverlayProps> = ({ score, time, difficulty, onRestart, onMenu }) => {
  return (
    <div className="h-full flex flex-col p-8 bg-black/95 relative overflow-hidden border-8 border-white">
      <div className="mt-16 mb-8 text-center z-10">
        <h2 className="text-4xl text-red-600 font-bold mb-3 italic uppercase drop-shadow-[4px_4px_0px_#fff]">DEAD!</h2>
        <div className="h-2 w-32 bg-white mx-auto mb-4"></div>
        <p className="text-[8px] text-stone-500 font-bold tracking-widest uppercase">END OF SESSION</p>
      </div>

      <div className="flex-1 space-y-8 z-10">
        <div className="text-center bg-stone-900 p-6 border-4 border-white shadow-[8px_8px_0px_#000]">
          <p className="text-[10px] text-stone-500 mb-4 font-bold uppercase tracking-widest">SCORE</p>
          <p className="text-3xl text-white font-bold">{score.toLocaleString()}</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 border-4 border-white bg-black text-center shadow-[4px_4px_0px_#000]">
            <p className="text-[6px] text-stone-500 mb-2 font-bold uppercase">TIME</p>
            <p className="text-[10px] text-white font-bold">{time}s</p>
          </div>
          <div className="p-4 border-4 border-white bg-black text-center shadow-[4px_4px_0px_#000]">
            <p className="text-[6px] text-stone-500 mb-2 font-bold uppercase">LEVEL</p>
            <p className="text-[10px] text-white truncate font-bold uppercase">{difficulty}</p>
          </div>
        </div>
      </div>

      <div className="space-y-4 z-10 mb-8">
        <button 
          onClick={onRestart}
          className="w-full py-5 text-[10px] border-4 border-white bg-white text-black hover:bg-black hover:text-white transition-all font-bold uppercase tracking-widest"
        >
          RETRY
        </button>
        <button 
          onClick={onMenu}
          className="w-full py-4 text-[8px] border-4 border-stone-700 bg-black text-stone-400 hover:text-white transition-all font-bold uppercase tracking-widest"
        >
          MENU
        </button>
      </div>
    </div>
  );
};

export default GameOverOverlay;
