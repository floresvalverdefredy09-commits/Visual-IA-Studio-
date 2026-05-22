export type VisualMode = 'apple' | 'gamer' | 'neon' | 'eco' | 'focus' | 'extreme';

export interface Exercise {
  id: string;
  name: string;
  duration: number; // in seconds
  description: string;
  category: 'cardio' | 'legs' | 'abs' | 'arms' | 'stamina' | 'reflex' | 'speed' | 'reaction' | 'coordination' | 'jumps' | 'saves' | 'mobility';
  animationType: 'pulse' | 'wave' | 'bounce' | 'slide' | 'rotate' | 'targets';
}

export interface WorkoutSession {
  id: string;
  name: string;
  type: 'hiit' | 'goalkeeper';
  totalDuration: number; // minutes
  days: string[]; // ["Lunes", "Miércoles", "Viernes", "Domingo"]
  color: string;
  exercises: Exercise[];
}

export interface AIResponse {
  notification: string;
  advice: string;
  challenge: string;
}

export interface UserStats {
  streak: number;
  energy: number; // 0-100
  totalMinutes: number;
  completedWorkouts: number;
  reactionsCaptured: number;
  averageReactionTime: number; // ms
}
