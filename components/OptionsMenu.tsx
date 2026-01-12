
import React from 'react';
import { GameSettings } from '../types';

interface OptionsMenuProps {
  settings: GameSettings;
  onUpdate: (s: GameSettings) => void;
  onBack: () => void;
}

const OptionsMenu: React.FC<OptionsMenuProps> = ({ settings, onUpdate, onBack }) => {
  return (
    <div className="h-full flex flex-col p-8 items-center bg-stone-900 border-4 border-white">
      <h2 className="text-xl mb-12 text-white font-bold italic tracking-widest uppercase underline underline-offset-8">OPTIONS</h2>
      
      <div className="flex-1 w-full space-y-8">
        <div className="flex justify-between items-center group">
          <div className="flex flex-col">
            <span className="text-[10px] text-white uppercase">SOUND</span>
            <span className="text-[6px] text-stone-500 uppercase mt-1">TOGGLE FX</span>
          </div>
          <button 
            onClick={() => onUpdate({ ...settings, soundEnabled: !settings.soundEnabled })}
            className={`w-14 h-8 border-4 flex items-center px-1 transition-colors ${settings.soundEnabled ? 'border-green-500 bg-green-950/30' : 'border-stone-700 bg-black'}`}
          >
            <div className={`w-4 h-4 transition-all ${settings.soundEnabled ? 'translate-x-6 bg-green-500' : 'bg-stone-700'}`} />
          </button>
        </div>

        <div className="flex justify-between items-center">
          <div className="flex flex-col">
            <span className="text-[10px] text-white uppercase">LOW FPS</span>
            <span className="text-[6px] text-stone-500 uppercase mt-1">30FPS LIMIT</span>
          </div>
          <button 
            onClick={() => onUpdate({ ...settings, lowFPS: !settings.lowFPS })}
            className={`w-14 h-8 border-4 flex items-center px-1 transition-colors ${settings.lowFPS ? 'border-yellow-500 bg-yellow-950/30' : 'border-stone-700 bg-black'}`}
          >
            <div className={`w-4 h-4 transition-all ${settings.lowFPS ? 'translate-x-6 bg-yellow-500' : 'bg-stone-700'}`} />
          </button>
        </div>
      </div>

      <button 
        onClick={onBack}
        className="w-full py-4 text-[8px] border-4 border-white bg-black text-white hover:bg-white hover:text-black transition-colors font-bold uppercase"
      >
        BACK TO MENU
      </button>
    </div>
  );
};

export default OptionsMenu;
