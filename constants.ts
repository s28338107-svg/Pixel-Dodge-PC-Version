
import { Difficulty } from './types';

export const CANVAS_WIDTH = 400;
export const CANVAS_HEIGHT = 600;

export const DIFFICULTY_CONFIG = {
  [Difficulty.EASY]: {
    spawnRate: 1500,
    spikeSpeed: 2,
    scoreMultiplier: 1,
    color: '#4ade80',
    animation: 'scale-105'
  },
  [Difficulty.MEDIUM]: {
    spawnRate: 1000,
    spikeSpeed: 3.5,
    scoreMultiplier: 2,
    color: '#60a5fa',
    animation: 'translate-y-[-4px]'
  },
  [Difficulty.HARD]: {
    spawnRate: 600,
    spikeSpeed: 5,
    scoreMultiplier: 4,
    color: '#fbbf24',
    animation: 'rotate-2'
  },
  [Difficulty.INSANE]: {
    spawnRate: 350,
    spikeSpeed: 7,
    scoreMultiplier: 8,
    color: '#f87171',
    animation: 'animate-bounce'
  },
  [Difficulty.IMPOSSIBLE]: {
    spawnRate: 200,
    spikeSpeed: 9.5,
    scoreMultiplier: 15,
    color: '#a78bfa',
    animation: 'animate-pulse'
  },
  [Difficulty.VOID]: {
    spawnRate: 120,
    spikeSpeed: 12,
    scoreMultiplier: 50,
    color: '#f472b6',
    animation: 'animate-shake'
  }
};
