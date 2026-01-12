
import React, { useState } from 'react';
import { Difficulty, PlayerStats } from '../types';
import { DIFFICULTY_CONFIG } from '../constants';

interface MainMenuProps {
  onStart: (diff: Difficulty) => void;
  onTutorial: () => void;
  onOptions: () => void;
  onQuests: () => void;
  stats: PlayerStats;
}

const MainMenu: React.FC<MainMenuProps> = ({ onStart, onTutorial, onOptions, onQuests, stats }) => {
  const [hoveredDiff, setHoveredDiff] = useState<Difficulty | null>(null);

  const difficulties = [
    Difficulty.EASY,
    Difficulty.MEDIUM,
    Difficulty.HARD,
    Difficulty.INSANE,
    Difficulty.IMPOSSIBLE,
  ];

  if (stats.totalQuestsCompleted >= 15) {
    difficulties.push(Difficulty.VOID);
  }

  return (
    <div className="h-full flex flex-col p-6 items-center bg-stone-900 relative overflow-hidden">
      <div className="mt-12 mb-8 text-center z-10">
        <h1 className="text-4xl font-bold leading-tight tracking-tighter italic text-white drop-shadow-[6px_6px_0px_#ef4444] uppercase">
          PIXEL<br/>
          DODGER
        </h1>
      </div>

      <div className="text-[8px] mb-8 text-white z-10 font-bold bg-black border-2 border-white px-4 py-2 uppercase tracking-widest">
        HI-SCORE: {stats.highScore.toLocaleString()}
      </div>

      <div className="flex-1 w-full flex flex-col gap-3 overflow-y-auto pr-2 custom-scrollbar z-10">
        {difficulties.map((diff) => (
          <button
            key={diff}
            onClick={() => onStart(diff)}
            onMouseEnter={() => setHoveredDiff(diff)}
            onMouseLeave={() => setHoveredDiff(null)}
            className={`
              w-full py-4 px-5 text-left border-4 transition-all duration-100 transform relative group overflow-hidden
              ${hoveredDiff === diff ? `translate-x-1 border-white bg-white text-black` : 'border-stone-700 bg-black text-white'}
            `}
          >
            <div className="flex justify-between items-center relative z-20">
              <span className="text-[10px] tracking-widest font-bold uppercase">{diff}</span>
              <span className="text-[8px] font-bold opacity-60">x{DIFFICULTY_CONFIG[diff].scoreMultiplier}</span>
            </div>
          </button>
        ))}
      </div>

      <div className="mt-8 w-full flex flex-col gap-3 z-10">
        <div className="grid grid-cols-2 gap-3">
          <button 
            onClick={onQuests}
            className="text-[8px] py-5 border-4 border-white bg-black hover:bg-stone-800 text-white uppercase flex flex-col items-center gap-2 transition-all font-bold"
          >
            Quests
            <span className="text-[6px] opacity-70">[{stats.totalQuestsCompleted}/15]</span>
          </button>
          <button 
            onClick={onTutorial}
            className="text-[8px] py-5 border-4 border-white bg-black hover:bg-stone-800 text-white uppercase transition-all font-bold"
          >
            How2Play
          </button>
        </div>
        <button 
          onClick={onOptions}
          className="text-[8px] py-4 border-4 border-stone-700 bg-black hover:border-white text-stone-400 hover:text-white uppercase transition-all font-bold"
        >
          Options
        </button>
      </div>
    </div>
  );
};

export default MainMenu;
