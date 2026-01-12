
import React, { useState, useEffect, useCallback } from 'react';
import { GameState, Difficulty, GameSettings, PlayerStats, Quest } from './types';
import { fetchHourlyQuests } from './services/geminiService';
import MainMenu from './components/MainMenu';
import GameCanvas from './components/GameCanvas';
import OptionsMenu from './components/OptionsMenu';
import QuestsMenu from './components/QuestsMenu';
import TutorialOverlay from './components/TutorialOverlay';
import GameOverOverlay from './components/GameOverOverlay';
import PauseOverlay from './components/PauseOverlay';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>(GameState.MENU);
  const [difficulty, setDifficulty] = useState<Difficulty>(Difficulty.EASY);
  const [settings, setSettings] = useState<GameSettings>(() => {
    const saved = localStorage.getItem('pd_settings');
    return saved ? JSON.parse(saved) : { soundEnabled: true, lowFPS: false };
  });
  const [stats, setStats] = useState<PlayerStats>(() => {
    const saved = localStorage.getItem('pd_stats');
    return saved ? JSON.parse(saved) : { totalQuestsCompleted: 0, highScore: 0 };
  });
  
  // Persistence for Quests to handle rate limiting (429) across refreshes
  const [quests, setQuests] = useState<Quest[]>(() => {
    const savedQuests = localStorage.getItem('pd_quests');
    const lastRefresh = localStorage.getItem('pd_last_refresh');
    if (savedQuests && lastRefresh) {
      const lastHour = new Date(parseInt(lastRefresh)).getHours();
      const currentHour = new Date().getHours();
      // If the cached quests are from the same hour, reuse them
      if (lastHour === currentHour) {
        return JSON.parse(savedQuests);
      }
    }
    return [];
  });

  const [lastQuestRefresh, setLastQuestRefresh] = useState<number>(() => {
    const saved = localStorage.getItem('pd_last_refresh');
    return saved ? parseInt(saved) : 0;
  });

  const [lastGameData, setLastGameData] = useState<{ score: number, time: number } | null>(null);

  const refreshQuests = useCallback(async () => {
    const now = new Date();
    const currentHour = now.getHours();
    const lastRefreshHour = lastQuestRefresh === 0 ? -1 : new Date(lastQuestRefresh).getHours();

    // Only fetch if we have no quests OR the hour has changed
    if (quests.length === 0 || currentHour !== lastRefreshHour) {
      const newQuests = await fetchHourlyQuests();
      setQuests(newQuests);
      const timestamp = Date.now();
      setLastQuestRefresh(timestamp);
      localStorage.setItem('pd_quests', JSON.stringify(newQuests));
      localStorage.setItem('pd_last_refresh', timestamp.toString());
    }
  }, [lastQuestRefresh, quests.length]);

  useEffect(() => {
    refreshQuests();
    const interval = setInterval(refreshQuests, 60000); // Check every minute
    return () => clearInterval(interval);
  }, [refreshQuests]);

  useEffect(() => {
    localStorage.setItem('pd_settings', JSON.stringify(settings));
    localStorage.setItem('pd_stats', JSON.stringify(stats));
    localStorage.setItem('pd_quests', JSON.stringify(quests));
  }, [settings, stats, quests]);

  const updateQuestProgress = (score: number, survivalTime: number) => {
    setQuests(prev => prev.map(q => {
      if (q.completed) return q;
      let newCurrent = q.current;
      if (q.type === 'score' && score > q.current) newCurrent = Math.max(q.current, score);
      if (q.type === 'survival' && survivalTime > q.current) newCurrent = Math.max(q.current, survivalTime);
      if (q.type === 'games_played') newCurrent += 1;
      
      const isNewlyCompleted = newCurrent >= q.target;
      if (isNewlyCompleted) {
        setStats(s => ({ ...s, totalQuestsCompleted: s.totalQuestsCompleted + 1 }));
      }
      return { ...q, current: newCurrent, completed: isNewlyCompleted };
    }));
  };

  const handleGameOver = (finalScore: number, survivalTime: number) => {
    setLastGameData({ score: finalScore, time: survivalTime });
    if (finalScore > stats.highScore) {
      setStats(s => ({ ...s, highScore: finalScore }));
    }
    updateQuestProgress(finalScore, survivalTime);
    setGameState(GameState.GAMEOVER);
  };

  const startGame = (diff: Difficulty) => {
    setDifficulty(diff);
    setGameState(GameState.PLAYING);
  };

  const togglePause = () => {
    setGameState(prev => prev === GameState.PLAYING ? GameState.PAUSED : GameState.PLAYING);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-black overflow-hidden relative">
      <div className="relative z-10 w-full max-w-[400px] aspect-[2/3] bg-stone-900 border-4 border-white shadow-[10px_10px_0px_#000] flex flex-col overflow-hidden retro-screen">
        <div className="absolute inset-0 flicker-overlay"></div>
        
        {gameState === GameState.MENU && (
          <MainMenu 
            onStart={startGame} 
            onTutorial={() => setGameState(GameState.TUTORIAL)}
            onOptions={() => setGameState(GameState.OPTIONS)}
            onQuests={() => setGameState(GameState.QUESTS)}
            stats={stats}
          />
        )}

        {(gameState === GameState.PLAYING || gameState === GameState.PAUSED) && (
          <>
            <GameCanvas 
              difficulty={difficulty} 
              settings={settings}
              onGameOver={handleGameOver}
              onScoreUpdate={() => {}}
              isPaused={gameState === GameState.PAUSED}
              onPause={togglePause}
            />
            {gameState === GameState.PAUSED && (
              <PauseOverlay 
                onResume={togglePause}
                onMenu={() => setGameState(GameState.MENU)}
              />
            )}
          </>
        )}

        {gameState === GameState.TUTORIAL && (
          <TutorialOverlay onClose={() => setGameState(GameState.MENU)} />
        )}

        {gameState === GameState.OPTIONS && (
          <OptionsMenu 
            settings={settings} 
            onUpdate={setSettings} 
            onBack={() => setGameState(GameState.MENU)} 
          />
        )}

        {gameState === GameState.QUESTS && (
          <QuestsMenu 
            quests={quests} 
            onBack={() => setGameState(GameState.MENU)} 
          />
        )}

        {gameState === GameState.GAMEOVER && (
          <GameOverOverlay 
            score={lastGameData?.score || 0}
            time={lastGameData?.time || 0}
            difficulty={difficulty}
            onRestart={() => startGame(difficulty)}
            onMenu={() => setGameState(GameState.MENU)}
          />
        )}
      </div>
    </div>
  );
};

export default App;
