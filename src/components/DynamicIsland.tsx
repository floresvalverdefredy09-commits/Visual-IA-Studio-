import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Timer, Activity, Bell, Award, Music } from 'lucide-react';
import { playTap } from '../utils/audio';

interface DynamicIslandProps {
  currentNotification: string | null;
  workoutActive: boolean;
  activeExerciseName: string;
  timeRemaining: number;
  batteryEco: boolean;
  activeMusic: string | null;
  onTapIsland: () => void;
}

export default function DynamicIsland({
  currentNotification,
  workoutActive,
  activeExerciseName,
  timeRemaining,
  batteryEco,
  activeMusic,
  onTapIsland,
}: DynamicIslandProps) {
  const [islandState, setIslandState] = useState<'compact' | 'expanded-notification' | 'expanded-workout' | 'expanded-music'>('compact');

  useEffect(() => {
    if (currentNotification) {
      setIslandState('expanded-notification');
      playTap();
      // Auto dismiss notification state back to default or workout after 5 seconds
      const t = setTimeout(() => {
        if (workoutActive) {
          setIslandState('expanded-workout');
        } else if (activeMusic) {
          setIslandState('expanded-music');
        } else {
          setIslandState('compact');
        }
      }, 5500);
      return () => clearTimeout(t);
    } else if (workoutActive) {
      setIslandState('expanded-workout');
    } else if (activeMusic) {
      setIslandState('expanded-music');
    } else {
      setIslandState('compact');
    }
  }, [currentNotification, workoutActive, activeMusic]);

  const handleIslandClick = () => {
    playTap();
    onTapIsland();
  };

  // Render content based on current island state
  return (
    <div className="absolute top-2 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none">
      <motion.div
        id="ios-dynamic-island"
        layout
        onClick={handleIslandClick}
        className="pointer-events-auto bg-black/92 text-white rounded-full flex items-center justify-between px-4 py-2 cursor-pointer shadow-lg border border-white/10 select-none overflow-hidden"
        initial={{ width: 110, height: 28 }}
        animate={
          islandState === 'expanded-notification'
            ? { width: '92%', height: 72, borderRadius: 24 }
            : islandState === 'expanded-workout'
            ? { width: 240, height: 42, borderRadius: 20 }
            : islandState === 'expanded-music'
            ? { width: 210, height: 40, borderRadius: 20 }
            : { width: 120, height: 32, borderRadius: 16 }
        }
        transition={{ type: 'spring', stiffness: 220, damping: 22 }}
      >
        <AnimatePresence mode="wait">
          {islandState === 'expanded-notification' && (
            <motion.div
              key="notification"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="w-full flex items-center gap-3 px-1 text-left"
            >
              <div className="p-2 bg-gradient-to-tr from-amber-500 to-orange-400 rounded-lg shrink-0">
                <Sparkles className="w-5 h-5 text-white animate-pulse" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold uppercase tracking-wider text-amber-300 flex items-center gap-1">
                  <Bell className="w-3 h-3 text-amber-300" />
                  Coach AI Honor
                </p>
                <p id="island-notif-text" className="text-[11px] text-gray-200 font-medium leading-relaxed truncate-2-lines line-clamp-2">
                  {currentNotification}
                </p>
              </div>
            </motion.div>
          )}

          {islandState === 'expanded-workout' && (
            <motion.div
              key="workout"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full flex items-center justify-between gap-2 px-1 py-1"
            >
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-emerald-400 animate-spin" style={{ animationDuration: '3s' }} />
                <span className="text-[10px] sm:text-xs font-semibold text-gray-200 truncate max-w-[110px]">
                  {activeExerciseName}
                </span>
              </div>
              <div className="flex items-center gap-1 bg-white/10 px-2 py-0.5 rounded-full text-[10px] font-mono text-emerald-300 font-bold">
                <Timer className="w-3 h-3" />
                {Math.floor(timeRemaining / 60)}:{(timeRemaining % 60).toString().padStart(2, '0')}
              </div>
            </motion.div>
          )}

          {islandState === 'expanded-music' && (
            <motion.div
              key="music"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full flex items-center justify-between gap-2 px-1"
            >
              <div className="flex items-center gap-2 min-w-0">
                <Music className="w-3.5 h-3.5 text-pink-400 animate-pulse" />
                <span className="text-[10px] font-medium text-pink-300 truncate max-w-[90px]">
                  {activeMusic}
                </span>
              </div>
              {/* iOS Live Visualizer Sim */}
              <div className="flex items-end gap-0.5 h-3 shrink-0">
                <span className="w-0.5 b-1 bg-pink-400 rounded-full animate-bounce" style={{ height: '100%', animationDelay: '0.1s' }} />
                <span className="w-0.5 b-1 bg-pink-400 rounded-full animate-bounce" style={{ height: '60%', animationDelay: '0.3s' }} />
                <span className="w-0.5 b-1 bg-pink-400 rounded-full animate-bounce" style={{ height: '80%', animationDelay: '0.5s' }} />
              </div>
            </motion.div>
          )}

          {islandState === 'compact' && (
            <motion.div
              key="compact"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full flex items-center justify-between px-1"
            >
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <Award className="w-3 h-3 text-amber-400 animate-bounce" style={{ animationDuration: '4s' }} />
              <div className="text-[9px] font-mono font-medium tracking-wide text-gray-300">
                HONOR
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
