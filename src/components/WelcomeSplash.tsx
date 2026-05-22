import { motion } from 'motion/react';
import { Sparkles, Shield, Cpu, Flame, Target } from 'lucide-react';
import { playiOSChime } from '../utils/audio';

interface WelcomeSplashProps {
  onDismiss: () => void;
}

export default function WelcomeSplash({ onDismiss }: WelcomeSplashProps) {
  const handleLaunch = () => {
    playiOSChime();
    onDismiss();
  };

  return (
    <div className="absolute inset-0 z-55 bg-[#0A0B10] flex flex-col justify-between p-6 select-none overflow-hidden text-center font-sans">
      
      {/* Decorative ambient Apple/Neon blur loops */}
      <div className="absolute top-[-10%] left-[-10%] w-[70%] h-[50%] bg-blue-600/20 rounded-full blur-[80px] pointer-events-none animate-pulse" style={{ animationDuration: '6s' }} />
      <div className="absolute bottom-[-10%] right-[-10%] w-[70%] h-[50%] bg-[#ff2d55]/15 rounded-full blur-[80px] pointer-events-none animate-pulse" style={{ animationDuration: '8s' }} />

      {/* Grid pattern back overlay */}
      <div className="absolute inset-0 bg-space-ambient opacity-5 pointer-events-none bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px]" />

      {/* Top Brand Logo Row */}
      <div className="pt-8 flex items-center justify-center gap-1 text-[11px] text-gray-500 font-black uppercase tracking-[0.25em]">
        <Cpu className="w-4 h-4 text-rose-500" />
        <span>HONOR X8b Smart Launcher</span>
      </div>

      {/* Central Epic Animated Hero */}
      <div className="flex-1 flex flex-col items-center justify-center relative">
        
        {/* Animated Particles orbiting wrapper */}
        <div className="relative w-48 h-48 flex items-center justify-center">
          
          {/* Futuristic Ring rotating */}
          <motion.div
            className="absolute inset-0 rounded-full border border-dashed border-white/20"
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 15, ease: 'linear' }}
          />

          {/* Secondary rotating ring */}
          <motion.div
            className="absolute inset-2 rounded-full border border-double border-indigo-500/10"
            animate={{ rotate: -360 }}
            transition={{ repeat: Infinity, duration: 25, ease: 'linear' }}
          />

          {/* Central Logo Core (Glow Orb) */}
          <motion.div
            id="glowing-neon-logo"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: [1, 1.05, 1], opacity: 1 }}
            transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut' }}
            className="w-28 h-28 rounded-full bg-gradient-to-tr from-[#0e172e] via-[#1f122f] to-[#ff2d55]/30 flex items-center justify-center border-2 border-white/20 shadow-[0_0_35px_rgba(255,45,85,0.25)] relative"
          >
            {/* Soft pulsing inner white eye */}
            <div className="w-16 h-16 rounded-full bg-black/80 flex items-center justify-center">
              <Shield className="w-9 h-9 text-[#ff9500] animate-bounce" style={{ animationDuration: '3.5s' }} />
            </div>
          </motion.div>

          {/* Little Floating custom Particle dots */}
          <motion.span 
            className="absolute top-2 left-6 w-1.5 h-1.5 bg-rose-500 rounded-full shadow-lg"
            animate={{ x: [0, 8, -5, 0], y: [0, -12, 10, 0] }}
            transition={{ repeat: Infinity, duration: 4.5 }}
          />
          <motion.span 
            className="absolute bottom-4 right-10 w-2 h-2 bg-indigo-400 rounded-full shadow-lg"
            animate={{ x: [0, -10, 7, 0], y: [0, 8, -8, 0] }}
            transition={{ repeat: Infinity, duration: 6 }}
          />
          <motion.span 
            className="absolute top-1/2 right-1 w-1 h-1 bg-[#ff9500] rounded-full"
            animate={{ y: [-15, 20, -15] }}
            transition={{ repeat: Infinity, duration: 5 }}
          />
        </div>

        {/* Title */}
        <motion.h1 
          className="text-3xl sm:text-4xl font-extrabold tracking-tighter text-white mt-8 leading-none"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          OS 18 <span className="bg-clip-text text-transparent bg-gradient-to-r from-orange-400 via-pink-500 to-rose-500">Live Wallpaper</span>
        </motion.h1>

        {/* Sub-Brand summary */}
        <motion.p
          className="text-xs text-gray-300 mt-3 max-w-sm px-6 leading-relaxed"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          Bienvenido al simulador fitness interactivo elite de arqueros y HIIT. Inspirado en iOS 18 para el Honor X8b.
        </motion.p>
      </div>

      {/* Start Button & Footer */}
      <div className="w-full flex flex-col items-center gap-6 pb-6 select-none">
        
        {/* Launch Trigger button */}
        <motion.button
          id="btn-splash-launch"
          onClick={handleLaunch}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="w-full max-w-xs py-4 bg-gradient-to-r from-[#ff3b30] via-[#ff9500] to-indigo-600 hover:brightness-110 text-white font-extrabold rounded-2xl text-xs uppercase tracking-[0.2em] transition-all shadow-lg shadow-rose-600/25 cursor-pointer"
        >
          Inicializar Sistema
        </motion.button>

        {/* Honor specifications */}
        <div className="flex flex-col gap-0.5 text-[9px] text-gray-500 font-bold uppercase tracking-wider">
          <span>Soporta Android 14 • Honor RAM Turbo</span>
          <span className="opacity-60 text-[8px]">Renderizado optimizado por GPU a 120 FPS</span>
        </div>
      </div>
    </div>
  );
}
