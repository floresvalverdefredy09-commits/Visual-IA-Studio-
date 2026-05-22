import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Lock, Sparkles, Battery, Calendar, Shield, Cpu, RefreshCw, Trophy, Zap } from 'lucide-react';
import { playiOSChime, playTap } from '../utils/audio';

interface LockScreenProps {
  onUnlock: () => void;
  streak: number;
  energy: number;
  batteryEco: boolean;
  onGetAICoachMotivation: () => void;
  aiNotification: string | null;
}

export default function LockScreen({
  onUnlock,
  streak,
  energy,
  batteryEco,
  onGetAICoachMotivation,
  aiNotification,
}: LockScreenProps) {
  const [time, setTime] = useState('');
  const [date, setDate] = useState('');
  const [touchUnlockStart, setTouchUnlockStart] = useState<number | null>(null);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString('es-ES', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
        })
      );
      setDate(
        now.toLocaleDateString('es-ES', {
          weekday: 'long',
          day: 'numeric',
          month: 'long',
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleUnlockClick = () => {
    playiOSChime();
    onUnlock();
  };

  const triggerAICoachOnLock = (e: React.MouseEvent) => {
    e.stopPropagation();
    onGetAICoachMotivation();
  };

  return (
    <div className="absolute inset-0 z-40 bg-[#0A0B10] text-white flex flex-col justify-between p-6 select-none overflow-hidden font-sans">
      
      {/* Dynamic Background Gradients from Professional Polish */}
      <div className="absolute top-[-10%] left-[-10%] w-[70%] h-[50%] bg-blue-600/20 rounded-full blur-[80px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[70%] h-[50%] bg-purple-600/20 rounded-full blur-[80px] pointer-events-none" />
      
      {/* Top Status Bar Sim (iOS 18 + Honor X8b) */}
      <div className="w-full flex justify-between items-center text-xs text-white/70 pt-2 px-1 font-sans font-medium relative z-10">
        <div className="flex items-center gap-1">
          <span>Claro / Honor 5G</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Cpu className="w-3.5 h-3.5 text-blue-400 animate-spin" style={{ animationDuration: '4s' }} />
          <span className="text-[10px] bg-blue-500/10 text-blue-300 border border-blue-500/20 px-1.5 py-0.5 rounded-full font-bold uppercase tracking-wide">X8b 120Hz</span>
          <div className="flex items-center gap-0.5 ml-1">
            <Battery className="w-4 h-4 text-emerald-400 font-bold" />
            <span className="font-semibold text-[10px]">89%</span>
          </div>
        </div>
      </div>

      {/* Main Lock Container */}
      <div className="flex-1 flex flex-col items-center justify-start pt-10 relative z-10">
        {/* iOS Padlock Icon */}
        <motion.div
          id="ios-lock-indicator"
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="flex flex-col items-center mb-1 text-white/50"
        >
          <Lock className="w-4 h-4 text-white/70" />
          <p className="text-[9px] uppercase tracking-[0.25em] mt-1 font-bold text-white/40">Honor Secure</p>
        </motion.div>

        {/* Date */}
        <motion.p
          id="date-display"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-base font-semibold tracking-wide text-white/60 capitalize mt-2"
        >
          {date}
        </motion.p>

        {/* Custom iOS 18 Clock styled beautifully (Professional Polish: ultra-light typography) */}
        <motion.h1
          id="clock-display"
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', duration: 0.8 }}
          className="text-7xl sm:text-8xl font-extralight tracking-tighter text-white drop-shadow-2xl mt-1 select-none leading-none"
          style={{ fontFamily: 'var(--font-sans)' }}
        >
          {time || "08:18"}
        </motion.h1>

        {/* iOS 18 Smart Lock Widgets Row */}
        <motion.div
          id="lock-screen-widgets"
          initial={{ y: 15, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.15 }}
          className="grid grid-cols-3 gap-3 w-full max-w-sm mt-5"
        >
          {/* Streak Widget */}
          <div className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-[1.5rem] p-3 flex flex-col items-center justify-center text-center shadow-lg">
            <Calendar className="w-4 h-4 text-orange-400 mb-0.5 animate-pulse" />
            <span className="text-[9px] uppercase tracking-wider text-white/40 font-bold">Racha</span>
            <span className="text-sm font-bold text-white">{streak} Días</span>
          </div>

          {/* Energy Widget */}
          <div className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-[1.5rem] p-3 flex flex-col items-center justify-center text-center shadow-lg">
            <Zap className="w-4 h-4 text-yellow-400 mb-0.5 animate-bounce" />
            <span className="text-[9px] uppercase tracking-wider text-white/40 font-bold">Energía</span>
            <span className="text-sm font-bold text-white">{energy}%</span>
          </div>

          {/* Battery Eco Widget */}
          <div className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-[1.5rem] p-3 flex flex-col items-center justify-center text-center shadow-lg">
            <Shield className="w-4 h-4 text-emerald-400 mb-0.5" />
            <span className="text-[9px] uppercase tracking-wider text-white/40 font-bold">Modo</span>
            <span className="text-[10px] font-bold text-white truncate max-w-full">
              {batteryEco ? "Ultra Eco" : "Alto Rend."}
            </span>
          </div>
        </motion.div>

        {/* Coach AI Notification Block */}
        <motion.div
          id="lock-notification"
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="w-full max-w-sm mt-8 p-5 bg-white/10 border border-white/10 rounded-[2rem] backdrop-blur-2xl flex flex-col gap-2 relative overflow-hidden shadow-2xl"
        >
          <div className="absolute top-0 left-0 bottom-0 w-1 bg-gradient-to-b from-blue-500 to-indigo-600" />
          <div className="flex items-center justify-between text-[11px] text-white/40 px-1">
            <span className="flex items-center gap-1 font-bold text-white/70 uppercase tracking-widest">
              <Sparkles className="w-3.5 h-3.5 text-blue-400 animate-pulse" />
              AI MOTIVATION
            </span>
            <span className="font-semibold text-white/30">Ahora mismo</span>
          </div>
          <div className="text-left px-1 mt-1">
            <p className="text-base font-semibold text-white leading-snug">
              {aiNotification ? "Estás listo para dar el salto" : "Tu Virtual Coach te espera"}
            </p>
            <p className="text-xs text-white/70 italic leading-relaxed mt-1.5">
              "{aiNotification || "Supera tu récord de reacción hoy. Un guardameta de élite no descansa."}"
            </p>
          </div>
          <button
            id="btn-get-motivation"
            onClick={triggerAICoachOnLock}
            className="w-full mt-3 py-2.5 px-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:brightness-110 active:scale-95 rounded-xl text-xs font-extrabold uppercase tracking-widest transition-all shadow-md cursor-pointer"
          >
            Cargar IA de Motivación
          </button>
        </motion.div>
      </div>

      {/* Swipe/Click to unlock footer */}
      <div className="w-full flex flex-col items-center gap-4 pb-4 select-none relative z-10">
        <motion.button
          id="slide-to-unlock-button"
          onClick={handleUnlockClick}
          className="w-full max-w-sm bg-white/10 hover:bg-white/15 active:bg-white/20 border border-white/10 py-3.5 rounded-2xl text-center backdrop-blur-xl relative flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-xl"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="absolute left-1.5 top-1.5 bottom-1.5 w-11 bg-white hover:bg-gray-100 rounded-xl flex items-center justify-center text-black shadow-md">
            <Zap className="w-4 h-4 text-blue-600" />
          </div>
          <span className="text-xs font-extrabold uppercase tracking-[0.25em] bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-white/40 animate-pulse pl-8">
            Pulsar para Desbloquear
          </span>
        </motion.button>

        {/* Device branding */}
        <p className="text-[10px] text-white/40 font-bold tracking-widest uppercase">
          Optimizado para HONOR X8b • IPS 120Hz+
        </p>
      </div>

      {/* Bottom Indicator Bar */}
      <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-32 h-1 bg-white/20 rounded-full"></div>
    </div>
  );
}
