
import React from 'react';
import { Quest } from '../types';

interface QuestsMenuProps {
  quests: Quest[];
  onBack: () => void;
}

const QuestsMenu: React.FC<QuestsMenuProps> = ({ quests, onBack }) => {
  return (
    <div className="h-full flex flex-col p-8 bg-stone-900 border-4 border-white">
      <div className="flex justify-between items-center mb-12">
        <h2 className="text-xl text-white font-bold italic uppercase tracking-widest underline underline-offset-8">QUESTS</h2>
        <span className="text-[6px] text-stone-500 animate-pulse uppercase">AUTO-REFRESH</span>
      </div>
      
      <div className="flex-1 w-full space-y-4 overflow-y-auto pr-2 custom-scrollbar">
        {quests.length === 0 ? (
          <div className="text-[8px] text-stone-500 text-center mt-20">FETCHING...</div>
        ) : (
          quests.map(quest => (
            <div 
              key={quest.id} 
              className={`p-4 border-4 transition-all ${quest.completed ? 'border-green-500 bg-green-950/20' : 'border-stone-700 bg-black'}`}
            >
              <div className="flex justify-between items-start mb-2">
                <span className={`text-[10px] ${quest.completed ? 'text-green-500' : 'text-white'} font-bold`}>{quest.title}</span>
                {quest.completed && <span className="text-[6px] text-green-500 uppercase">DONE</span>}
              </div>
              <p className="text-[6px] text-stone-400 mb-4 leading-relaxed uppercase">{quest.description}</p>
              
              <div className="w-full h-2 bg-stone-800 border-2 border-stone-700 overflow-hidden">
                <div 
                  className={`h-full transition-all duration-1000 ${quest.completed ? 'bg-green-500' : 'bg-yellow-500'}`}
                  style={{ width: `${Math.min(100, (quest.current / quest.target) * 100)}%` }}
                />
              </div>
              <div className="text-[5px] text-right mt-1 text-stone-500 font-bold">
                {Math.floor(quest.current)} / {quest.target}
              </div>
            </div>
          ))
        )}
      </div>

      <button 
        onClick={onBack}
        className="w-full mt-8 py-4 text-[8px] border-4 border-white bg-black text-white hover:bg-white hover:text-black transition-colors font-bold uppercase"
      >
        EXIT
      </button>
    </div>
  );
};

export default QuestsMenu;
