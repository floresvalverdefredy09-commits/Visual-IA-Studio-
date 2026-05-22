import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Dumbbell, Target, Cpu, MessageSquare, Play, 
  Pause, SkipForward, Flame, Trophy, Award, 
  Lightbulb, Calendar, Battery, Disc, Sliders, ChevronRight
} from 'lucide-react';
import { VisualMode, UserStats } from '../types';
import { playTap } from '../utils/audio';

interface HomeScreenProps {
  stats: UserStats;
  visualMode: VisualMode;
  onLaunchHIIT: () => void;
  onLaunchGoalkeeper: () => void;
  onOpenControlCenter: () => void;
  onOpenAIPanel: () => void;
  onGetAICoachMotivation: () => void;
  aiAdvice: string;
  activeMusic: string | null;
  setActiveMusic: (track: string | null) => void;
}

const customMusicTracks = [
  "Neon Sprint (Hi-NRG)",
  "Goal Keeper Stadium Beat",
  "Apple Chill Out (Relax)",
  "Samba Goal Beats"
];

export default function HomeScreen({
  stats,
  visualMode,
  onLaunchHIIT,
  onLaunchGoalkeeper,
  onOpenControlCenter,
  onOpenAIPanel,
  onGetAICoachMotivation,
  aiAdvice,
  activeMusic,
  setActiveMusic,
}: HomeScreenProps) {
  const [currentTrackIdx, setCurrentTrackIdx] = useState(0);
  const [isPlayingMusic, setIsPlayingMusic] = useState(false);
  const [simulatedTime, setSimulatedTime] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setSimulatedTime(
        now.toLocaleTimeString('es-ES', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
        })
      );
    };
    updateTime();
    const t = setInterval(updateTime, 10000);
    return () => clearInterval(t);
  }, []);

  const handleToggleMusic = () => {
    playTap();
    if (isPlayingMusic) {
      setIsPlayingMusic(false);
      setActiveMusic(null);
    } else {
      setIsPlayingMusic(true);
      setActiveMusic(customMusicTracks[currentTrackIdx]);
    }
  };

  const handleNextTrack = () => {
    playTap();
    const nextIdx = (currentTrackIdx + 1) % customMusicTracks.length;
    setCurrentTrackIdx(nextIdx);
    if (isPlayingMusic) {
      setActiveMusic(customMusicTracks[nextIdx]);
    }
  };

  // Determine gradient styled based on active iOS 18 launcher visual style
  const getWallpaperGradient = () => {
    switch (visualMode) {
      case 'gamer':
        return 'from-[#19030c] via-[#04010b] to-[#0c0411]';
      case 'neon':
        return 'from-[#02181d] via-[#02050b] to-[#0d0413]';
      case 'eco':
        return 'from-[#03130a] via-[#010502] to-[#07130b]';
      case 'focus':
        return 'from-[#0b0c16] via-[#040407] to-[#080c1b]';
      case 'extreme':
        return 'from-[#1a0505] via-[#020101] to-[#14000d]';
      case 'apple':
      default:
        return 'from-[#0e1628]/95 via-[#180a22]/95 to-[#0b0c16]/98';
    }
  };

  return (
    <div className="flex-1 flex flex-col p-4 overflow-y-auto select-none relative pb-10">
      
      {/* Top Banner Row (Time & Quick Control Center Slide overlay) */}
      <div className="flex justify-between items-center mb-6 pl-1 pr-1">
        <div className="text-left">
          <p className="text-[10px] text-gray-400 font-bold tracking-widest uppercase mb-0.5">HONOR X8b iOS 18</p>
          <div className="text-2xl font-black text-white font-mono tracking-tight">
            {simulatedTime || "12:00"}
          </div>
        </div>

        {/* Dynamic Launch Controls Indicator */}
        <button
          onClick={onOpenControlCenter}
          className="bg-white/10 hover:bg-white/15 active:scale-95 border border-white/10 px-3.5 py-1.5 rounded-xl text-xs font-black text-white flex items-center gap-1.5 transition-all shadow-md"
        >
          <Sliders className="w-3.5 h-3.5 text-orange-400 animate-spin" style={{ animationDuration: '6s' }} />
          <span>Controles</span>
        </button>
      </div>

      {/* Main Grid Widgets Container */}
      <div className="grid grid-cols-2 gap-4">
        
        {/* Dynamic Energy battery and health Widget */}
        <div className="bg-white/5 border border-white/10 p-3.5 rounded-3xl text-left relative overflow-hidden flex flex-col justify-between min-h-[110px]">
          <div className="absolute top-1 right-2 w-16 h-16 bg-gradient-to-br from-yellow-500/10 to-orange-500/10 rounded-full filter blur-md pointer-events-none" />
          <div className="flex items-center gap-1.5 text-yellow-405 font-bold text-[10px] text-yellow-300 uppercase tracking-wider">
            <Flame className="w-4 h-4 animate-bounce" />
            <span>Energía Vital</span>
          </div>
          <div>
            <div className="text-2xl font-black text-white font-mono mt-1">{stats.energy}%</div>
            {/* Battery / Energy bar scale */}
            <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden mt-1.5">
              <div 
                className="bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500 h-full rounded-full transition-all duration-1000"
                style={{ width: `${stats.energy}%` }}
              />
            </div>
            <p className="text-[9px] text-gray-400 font-semibold mt-1">Carga de entrenamiento Honor</p>
          </div>
        </div>

        {/* Goalkeeper Stats & Streak Widget */}
        <div className="bg-white/5 border border-white/10 p-3.5 rounded-3xl text-left relative overflow-hidden flex flex-col justify-between min-h-[110px]">
          <div className="absolute top-1 right-2 w-16 h-16 bg-gradient-to-br from-[#2f80ed]/10 to-blue-500/10 rounded-full filter blur-md pointer-events-none" />
          <div className="flex items-center gap-1.5 text-blue-400 font-bold text-[10px] uppercase tracking-wider">
            <Trophy className="w-4 h-4 text-[#2f80ed]" />
            <span>Reflejos GK</span>
          </div>
          <div>
            <div className="text-lg font-black text-white leading-tight">
              {stats.reactionsCaptured} <span className="text-[10px] font-bold text-gray-400 font-semibold lowercase">atajadas</span>
            </div>
            <div className="text-xs font-black text-[#2f80ed] font-mono mt-0.5">
              ⚡ {stats.averageReactionTime > 0 ? `${stats.averageReactionTime}ms` : '---'} <span className="text-[9px] text-gray-400 text-xs">prom.</span>
            </div>
            <p className="text-[9px] text-gray-400 font-semibold mt-1">Nivel: Guardameta Progresivo</p>
          </div>
        </div>

        {/* LAUNCHERS: Entrenamiento HIIT (Emerald Glass style from Professional Polish Theme) */}
        <button
          onClick={onLaunchHIIT}
          className="col-span-1 bg-emerald-500/10 backdrop-blur-2xl border border-emerald-500/20 hover:bg-emerald-500/20 hover:border-emerald-500/40 active:scale-95 text-white p-5 rounded-[2rem] text-left flex flex-col justify-between transition-all shadow-xl"
        >
          <div className="flex justify-between items-start w-full">
            <div className="p-2.5 bg-emerald-500/20 rounded-xl text-emerald-400">
              <Dumbbell className="w-5 h-5 animate-bounce" style={{ animationDuration: '3.5s' }} />
            </div>
            <span className="text-[9px] bg-emerald-500/25 text-emerald-300 px-2.5 py-0.5 rounded-full font-extrabold uppercase select-none tracking-wider">30 Mins</span>
          </div>
          <div className="mt-4">
            <span className="text-[9px] uppercase font-bold tracking-widest text-emerald-400 block mb-1">Simulador Elite</span>
            <span className="text-[15px] font-black tracking-tight leading-none text-white">Full Body HIIT</span>
          </div>
        </button>

        {/* LAUNCHERS: Reflejos de Arquero (Blue Glass style from Professional Polish Theme) */}
        <button
          onClick={onLaunchGoalkeeper}
          className="col-span-1 bg-blue-500/10 backdrop-blur-2xl border border-blue-500/20 hover:bg-blue-500/20 hover:border-blue-500/40 active:scale-95 text-white p-5 rounded-[2rem] text-left flex flex-col justify-between transition-all shadow-xl"
        >
          <div className="flex justify-between items-start w-full">
            <div className="p-2.5 bg-blue-500/20 rounded-xl text-blue-400">
              <Target className="w-5 h-5 animate-spin-slow" />
            </div>
            <span className="text-[9px] bg-blue-500/25 text-blue-300 px-2.5 py-0.5 rounded-full font-extrabold uppercase select-none tracking-wider">En Vivo</span>
          </div>
          <div className="mt-4">
            <span className="text-[9px] uppercase font-bold tracking-widest text-blue-400 block mb-1">Entrenamiento GK</span>
            <span className="text-[15px] font-black tracking-tight leading-none text-white">Reflejos de Arco</span>
          </div>
        </button>

        {/* Weekly Schedule Widget from design theme */}
        <div className="col-span-2 bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2rem] p-5 shadow-2xl">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xs font-bold uppercase tracking-widest text-white/40">Weekly Schedule / Rutinas</h3>
            <div className="flex gap-1">
              <div className="w-2 h-2 rounded-full bg-blue-500"></div>
              <div className="w-2 h-2 rounded-full bg-white/20"></div>
              <div className="w-2 h-2 rounded-full bg-white/20"></div>
            </div>
          </div>
          <div className="grid grid-cols-4 gap-2">
            <div className="bg-white/5 p-3 rounded-2xl text-center border border-white/5">
              <div className="text-[9px] text-white/40 font-bold mb-1">MON</div>
              <div className="text-xs font-bold text-emerald-400">HIIT</div>
            </div>
            <div className="bg-blue-600/80 p-3 rounded-2xl text-center shadow-lg shadow-blue-600/20 scale-105 border border-blue-400/35">
              <div className="text-[9px] text-white/80 font-bold mb-1">WED</div>
              <div className="text-xs font-black text-white">GK</div>
            </div>
            <div className="bg-white/5 p-3 rounded-2xl text-center border border-white/5 opacity-50">
              <div className="text-[9px] text-white/40 font-bold mb-1">FRI</div>
              <div className="text-xs font-bold text-emerald-400">HIIT</div>
            </div>
            <div className="bg-white/5 p-3 rounded-2xl text-center border border-white/5 opacity-50">
              <div className="text-[9px] text-white/40 font-bold mb-1">SUN</div>
              <div className="text-xs font-bold text-blue-400">GK</div>
            </div>
          </div>
        </div>

        {/* iOS 18 Music Integration Apple Fitness style widget */}
        <div className="col-span-2 bg-white/5 border border-white/10 p-4 rounded-3xl text-left relative overflow-hidden flex flex-col justify-between h-[120px]">
          <div className="flex justify-between items-start">
            <div className="flex gap-2.5 items-center">
              <div className="relative">
                <motion.div
                  animate={isPlayingMusic ? { rotate: 360 } : {}}
                  transition={{ repeat: Infinity, duration: 6, ease: 'linear' }}
                  className="p-2.5 bg-gradient-to-tr from-pink-600 to-rose-500 rounded-full flex items-center justify-center text-white shrink-0"
                >
                  <Disc className="w-5 h-5" />
                </motion.div>
                {/* Visualizer dot */}
                {isPlayingMusic && (
                  <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-green-500 rounded-full animate-ping" />
                )}
              </div>
              <div>
                <span className="text-[9px] uppercase font-extrabold text-pink-400 tracking-wider">Apple Fitness+ Sound</span>
                <p className="text-xs font-black text-white tracking-tight mt-0.5 truncate max-w-[170px]">
                  {customMusicTracks[currentTrackIdx]}
                </p>
              </div>
            </div>
            
            {/* Week Streak counter badge */}
            <div className="bg-white/10 hover:bg-white/15 px-2.5 py-1 rounded-full text-[10px] font-bold text-gray-200 uppercase flex items-center gap-1">
              <Calendar className="w-3 h-3 text-orange-400" />
              <span>{stats.streak} D Racha</span>
            </div>
          </div>

          <div className="flex items-center justify-between mt-3 bg-black/20 p-2 rounded-2xl">
            <p className="text-[10px] text-gray-400 font-bold ml-1 uppercase">Entrenamiento Audio Rítmico</p>
            <div className="flex items-center gap-3">
              <button
                _id="music-prev"
                onClick={handleNextTrack}
                className="p-1.5 hover:bg-white/10 active:scale-90 text-white rounded-lg transition-transform"
              >
                <SkipForward className="w-4 h-4 rotate-180 text-white" />
              </button>
              <button
                _id="music-play"
                onClick={handleToggleMusic}
                className="p-2 bg-white/10 hover:bg-white/20 active:scale-90 rounded-full text-white transition-all shadow-md"
              >
                {isPlayingMusic ? <Pause className="w-4 h-4 fill-white" /> : <Play className="w-4 h-4 fill-white ml-0.5" />}
              </button>
              <button
                _id="music-next"
                onClick={handleNextTrack}
                className="p-1.5 hover:bg-white/10 active:scale-90 text-white rounded-lg transition-transform"
              >
                <SkipForward className="w-4 h-4 text-white" />
              </button>
            </div>
          </div>
        </div>

        {/* Virtual Coach Quick Selector Widget */}
        <button
          onClick={onOpenAIPanel}
          className="col-span-2 bg-gradient-to-r from-indigo-950/20 via-purple-950/20 to-indigo-950/20 hover:brightness-110 border border-white/10 p-3.5 rounded-3xl text-left flex items-center justify-between transition-all"
        >
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-gradient-to-tr from-amber-500 to-orange-400 rounded-2xl">
              <MessageSquare className="w-4 h-4 text-white animate-pulse" />
            </div>
            <div>
              <span className="text-[9px] uppercase font-black tracking-wider text-amber-400">Coach AI Honor Promoción</span>
              <p className="text-[11px] font-semibold text-gray-200 leading-snug max-w-[210px] mt-0.5 line-clamp-1">
                "{aiAdvice}"
              </p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-gray-400 animate-bounce" style={{ animationDuration: '3s' }} />
        </button>
      </div>

      <div className="mt-8 text-center text-[10px] text-gray-500 font-bold uppercase tracking-widest pl-2 pr-2">
        Dispositivo Honor X8b • Pantalla Amoled 90Hz+
      </div>
    </div>
  );
}
