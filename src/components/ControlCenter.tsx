import React from 'react';
import { motion } from 'motion/react';
import { VisualMode } from '../types';
import { 
  X, Moon, Sun, Volume2, Sparkles, Zap, Flame, 
  Gamepad, Feather, Activity, Shield, Bluetooth, 
  Wifi, Sliders, RefreshCw 
} from 'lucide-react';
import { playTap } from '../utils/audio';

interface ControlCenterProps {
  onClose: () => void;
  visualMode: VisualMode;
  setVisualMode: (mode: VisualMode) => void;
  soundVolume: number;
  setSoundVolume: (vol: number) => void;
  wallpaperSpeed: number;
  setWallpaperSpeed: (s: number) => void;
  brightness: number;
  setBrightness: (b: number) => void;
  isDarkMode: boolean;
  setIsDarkMode: (dm: boolean) => void;
  batteryEco: boolean;
  setBatteryEco: (eco: boolean) => void;
}

export default function ControlCenter({
  onClose,
  visualMode,
  setVisualMode,
  soundVolume,
  setSoundVolume,
  wallpaperSpeed,
  setWallpaperSpeed,
  brightness,
  setBrightness,
  isDarkMode,
  setIsDarkMode,
  batteryEco,
  setBatteryEco,
}: ControlCenterProps) {

  const handleModeChange = (mode: VisualMode) => {
    playTap();
    setVisualMode(mode);
    if (mode === 'eco') {
      setBatteryEco(true);
      setWallpaperSpeed(0.2);
    } else if (mode === 'extreme') {
      setBatteryEco(false);
      setWallpaperSpeed(1.8);
      setSoundVolume(0.9);
    } else {
      setBatteryEco(false);
      setWallpaperSpeed(1.0);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSoundVolume(parseFloat(e.target.value));
  };

  const handleSpeedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setWallpaperSpeed(parseFloat(e.target.value));
  };

  const handleBrightnessChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBrightness(parseFloat(e.target.value));
  };

  const toggleDarkMode = () => {
    playTap();
    setIsDarkMode(!isDarkMode);
  };

  return (
    <motion.div
      id="ios-control-center"
      initial={{ y: '-100%' }}
      animate={{ y: 0 }}
      exit={{ y: '-100%' }}
      transition={{ type: 'spring', damping: 25, stiffness: 220 }}
      className="absolute inset-0 z-50 bg-[#070913]/93 text-white flex flex-col p-6 font-sans backdrop-blur-2xl overflow-y-auto"
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-6 pt-3">
        <div className="flex items-center gap-1.5">
          <Sliders className="w-5 h-5 text-indigo-400" />
          <h2 className="text-lg font-bold tracking-tight uppercase">Centro de Control</h2>
        </div>
        <button
          onClick={onClose}
          className="p-2 bg-white/10 hover:bg-white/20 active:bg-white/30 rounded-full transition-transform active:scale-95"
        >
          <X className="w-4 h-4 text-white" />
        </button>
      </div>

      {/* Main Grid: iOS 18 Bento style */}
      <div className="grid grid-cols-2 gap-4 pb-4">
        
        {/* Connection Widget (Fixed in most environments) */}
        <div className="bg-white/5 border border-white/10 p-3.5 rounded-2xl flex flex-col gap-3">
          <div className="grid grid-cols-2 gap-2">
            <div className="p-2 bg-blue-500 rounded-full flex items-center justify-center cursor-pointer">
              <Wifi className="w-4 h-4 text-white" />
            </div>
            <div className="p-2 bg-indigo-500 rounded-full flex items-center justify-center cursor-pointer">
              <Bluetooth className="w-4 h-4 text-white" />
            </div>
          </div>
          <div className="bg-white/5 p-1.5 rounded-xl text-center text-[10px] text-gray-300 font-bold">
            Honor X8b Direct Link
          </div>
        </div>

        {/* Display Dark Mode Widget */}
        <button
          onClick={toggleDarkMode}
          className="bg-white/5 hover:bg-white/10 active:bg-white/15 border border-white/10 p-3.5 rounded-2xl flex flex-col justify-between text-left transition-colors"
        >
          <div className="p-2 bg-amber-500/10 rounded-full w-fit">
            {isDarkMode ? <Moon className="w-4 h-4 text-amber-400" /> : <Sun className="w-4 h-4 text-orange-400" />}
          </div>
          <div>
            <span className="text-[10px] uppercase tracking-wider text-gray-400 font-bold block">Aspecto</span>
            <span className="text-xs font-bold text-white">{isDarkMode ? "Oscuro" : "Claro"}</span>
          </div>
        </button>

        {/* Apple Premium Range Sliders (Sliders for Volume and Wallpaper particles speed) */}
        <div className="col-span-2 bg-white/5 border border-white/10 p-4 rounded-2xl flex flex-col gap-4">
          <h3 className="text-[11px] font-extrabold uppercase text-indigo-300 tracking-wider">Ajustes del Dispositivo</h3>
          
          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between items-center text-xs">
              <span className="text-gray-400 font-medium">Volumen del Sistema</span>
              <span className="text-white font-mono font-bold">{Math.round(soundVolume * 100)}%</span>
            </div>
            <input 
              type="range" 
              min="0" 
              max="1" 
              step="0.1" 
              value={soundVolume}
              onChange={handleVolumeChange}
              className="w-full accent-indigo-500 h-2 bg-white/10 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between items-center text-xs">
              <span className="text-gray-400 font-medium">Fondo Animado (Velocidad)</span>
              <span className="text-white font-mono font-bold">{Math.round(wallpaperSpeed * 100)}%</span>
            </div>
            <input 
              type="range" 
              min="0.1" 
              max="2" 
              step="0.1" 
              value={wallpaperSpeed}
              onChange={handleSpeedChange}
              className="w-full accent-emerald-500 h-2 bg-white/10 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between items-center text-xs">
              <span className="text-gray-400 font-medium">Brillo de Pantalla</span>
              <span className="text-white font-mono font-bold">{Math.round(brightness * 100)}%</span>
            </div>
            <input 
              type="range" 
              min="0.3" 
              max="1" 
              step="0.1" 
              value={brightness}
              onChange={handleBrightnessChange}
              className="w-full accent-amber-500 h-2 bg-white/10 rounded-lg appearance-none cursor-pointer"
            />
          </div>
        </div>

        {/* MODOS ESPECIALES SELECTOR */}
        <div className="col-span-2 bg-gradient-to-r from-indigo-950/40 via-purple-950/40 to-indigo-950/40 border border-white/10 p-4 rounded-3xl flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-black uppercase text-amber-400 tracking-wider">Modos Especiales de Lanzamiento</h3>
            <span className="text-[9px] bg-amber-500/20 text-yellow-300 font-extrabold px-1.5 py-0.5 rounded-full uppercase">120Fps</span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            {/* Modo Minimalista Apple */}
            <button
              onClick={() => handleModeChange('apple')}
              className={`p-3 rounded-xl flex items-center gap-2 text-left font-semibold transition-all ${
                visualMode === 'apple' 
                  ? 'bg-white text-black shadow-md shadow-white/10' 
                  : 'bg-white/10 hover:bg-white/15 text-white'
              }`}
            >
              <Feather className="w-4 h-4 shrink-0" />
              <div>
                <p className="font-extrabold text-[10px] leading-tight uppercase">Modo Apple</p>
                <p className="text-[8px] opacity-80">Minimalista Premium</p>
              </div>
            </button>

            {/* Modo Gamer */}
            <button
              onClick={() => handleModeChange('gamer')}
              className={`p-3 rounded-xl flex items-center gap-2 text-left font-semibold transition-all ${
                visualMode === 'gamer' 
                  ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/30' 
                  : 'bg-white/10 hover:bg-white/15 text-white'
              }`}
            >
              <Gamepad className="w-4 h-4 shrink-0 animate-pulse" />
              <div>
                <p className="font-extrabold text-[10px] leading-tight uppercase">Modo Gamer</p>
                <p className="text-[8px] opacity-80">Reflejos y Partículas</p>
              </div>
            </button>

            {/* Modo Neon */}
            <button
              onClick={() => handleModeChange('neon')}
              className={`p-3 rounded-xl flex items-center gap-2 text-left font-semibold transition-all ${
                visualMode === 'neon' 
                  ? 'bg-cyan-500 text-black font-black shadow-lg shadow-cyan-500/30' 
                  : 'bg-white/10 hover:bg-white/15 text-white'
              }`}
            >
              <Sparkles className="w-4 h-4 shrink-0" />
              <div>
                <p className="font-extrabold text-[10px] leading-tight uppercase">Modo Neón</p>
                <p className="text-[8px] opacity-80">Brillo Holográfico</p>
              </div>
            </button>

            {/* Modo Energía Baja */}
            <button
              onClick={() => handleModeChange('eco')}
              className={`p-3 rounded-xl flex items-center gap-2 text-left font-semibold transition-all ${
                visualMode === 'eco' 
                  ? 'bg-emerald-600 text-white shadow-md' 
                  : 'bg-white/10 hover:bg-white/15 text-white'
              }`}
            >
              <Zap className="w-4 h-4 shrink-0" />
              <div>
                <p className="font-extrabold text-[10px] leading-tight uppercase">Ahorro Energía</p>
                <p className="text-[8px] opacity-80">Max Batería X8b</p>
              </div>
            </button>

            {/* Modo Enfoque */}
            <button
              onClick={() => handleModeChange('focus')}
              className={`p-3 rounded-xl flex items-center gap-2 text-left font-semibold transition-all ${
                visualMode === 'focus' 
                  ? 'bg-indigo-600 text-white shadow-md' 
                  : 'bg-white/10 hover:bg-white/15 text-white'
              }`}
            >
              <Activity className="w-4 h-4 shrink-0" />
              <div>
                <p className="font-extrabold text-[10px] leading-tight uppercase">Modo Enfoque</p>
                <p className="text-[8px] opacity-80">Zero Distracción</p>
              </div>
            </button>

            {/* Modo Entrenamiento Extremo */}
            <button
              onClick={() => handleModeChange('extreme')}
              className={`p-3 rounded-xl flex items-center gap-2 text-left font-semibold transition-all ${
                visualMode === 'extreme' 
                  ? 'bg-gradient-to-r from-orange-600 to-red-650 text-white font-black shadow-lg shadow-orange-600/30' 
                  : 'bg-white/10 hover:bg-white/15 text-white'
              }`}
            >
              <Flame className="w-4 h-4 shrink-0 animate-bounce" />
              <div>
                <p className="font-extrabold text-[10px] leading-tight uppercase">Extremo</p>
                <p className="text-[8px] opacity-80">Máximo Esfuerzo</p>
              </div>
            </button>
          </div>
        </div>
      </div>

      <div className="mt-auto pt-6 text-center text-xs text-gray-500 font-semibold uppercase tracking-wider">
        Honor X8b OS • 50MP Dual Selfie Guard
      </div>
    </motion.div>
  );
}
