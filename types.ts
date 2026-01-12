
export enum GameState {
  MENU = 'MENU',
  TUTORIAL = 'TUTORIAL',
  PLAYING = 'PLAYING',
  PAUSED = 'PAUSED',
  GAMEOVER = 'GAMEOVER',
  OPTIONS = 'OPTIONS',
  QUESTS = 'QUESTS'
}

export enum Difficulty {
  EASY = 'EASY',
  MEDIUM = 'MEDIUM',
  HARD = 'HARD',
  INSANE = 'INSANE',
  IMPOSSIBLE = 'IMPOSSIBLE',
  VOID = 'ULTRAVOID'
}

export interface Quest {
  id: string;
  title: string;
  description: string;
  target: number;
  current: number;
  type: 'score' | 'survival' | 'games_played';
  reward: number;
  completed: boolean;
}

export interface GameSettings {
  soundEnabled: boolean;
  lowFPS: boolean;
}

export interface PlayerStats {
  totalQuestsCompleted: number;
  highScore: number;
}
