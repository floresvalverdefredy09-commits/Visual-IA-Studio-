import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Pause, SkipForward, RefreshCw, Flame, Award, Zap, Heart, ShieldAlert, Timer } from 'lucide-react';
import { Exercise } from '../types';
import { playWhistle, playTick, playSuccessChime } from '../utils/audio';

interface HIITWorkoutProps {
  onComplete: (minutes: number) => void;
  onCancel: () => void;
}

const hiitExercises: Exercise[] = [
  { id: 'h1', name: 'Cardio Explosivo (Rodillas Arriba)', duration: 45, description: 'Sube las rodillas al pecho con ritmo acelerado y brazos energéticos.', category: 'cardio', animationType: 'pulse' },
  { id: 'h2', name: 'Sentadillas de Poder (Piernas)', duration: 45, description: 'Baja cadera con espalda recta, sube explosivamente impulsando con talones.', category: 'legs', animationType: 'bounce' },
  { id: 'h3', name: 'Escaladores Dinámicos (Abdomen)', duration: 45, description: 'Posición de plancha, lleva rodillas al pecho alternadamente a máxima velocidad.', category: 'abs', animationType: 'wave' },
  { id: 'h4', name: 'Flexiones Diamante (Brazos)', duration: 45, description: 'Flexiona codos manteniendo las manos juntas bajo el pecho de forma controlada.', category: 'arms', animationType: 'slide' },
  { id: 'h5', name: 'Burpees Militares (Resistencia)', duration: 60, description: 'Haz una flexión completa, recoge piernas y salta con las manos arriba.', category: 'stamina', animationType: 'pulse' },
];

export default function HIITWorkout({ onComplete, onCancel }: HIITWorkoutProps) {
  const [selectedDay, setSelectedDay] = useState<string>('Lunes');
  const [currentIdx, setCurrentIdx] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(hiitExercises[0].duration);
  const [isPlaying, setIsPlaying] = useState(false);
  const [caloriesBurned, setCaloriesBurned] = useState(0);
  const [heartRate, setHeartRate] = useState(110);
  const [isCompleted, setIsCompleted] = useState(false);

  const activeExercise = hiitExercises[currentIdx];
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Monitor heart rate simulation
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying && !isCompleted) {
      interval = setInterval(() => {
        setHeartRate(prev => {
          const delta = Math.floor(Math.random() * 7) - 3;
          const targetLimit = activeExercise.id === 'h5' ? 165 : 145;
          return Math.min(180, Math.max(110, prev + delta + (prev < targetLimit ? 1 : 0)));
        });
        setCaloriesBurned(prev => prev + 0.25);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, isCompleted, currentIdx]);

  // Timer loop
  useEffect(() => {
    if (isPlaying && !isCompleted) {
      timerRef.current = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            playWhistle();
            handleNextExercise();
            return 0;
          }
          if (prev <= 4) {
            playTick();
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, currentIdx, isCompleted]);

  const handleStartPause = () => {
    setIsPlaying(!isPlaying);
    playWhistle();
  };

  const handleNextExercise = () => {
    if (currentIdx < hiitExercises.length - 1) {
      setCurrentIdx(prev => prev + 1);
      setTimeRemaining(hiitExercises[currentIdx + 1].duration);
    } else {
      setIsPlaying(false);
      setIsCompleted(true);
      playSuccessChime();
      onComplete(30); // Claimed 30 mins session
    }
  };

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentIdx(0);
    setTimeRemaining(hiitExercises[0].duration);
    setCaloriesBurned(0);
    setHeartRate(110);
    setIsCompleted(false);
  };

  return (
    <div className="flex-1 flex flex-col p-4 overflow-y-auto select-none bg-gradient-to-b from-[#120718] to-[#04020c]">
      
      {/* HIIT Header */}
      <div className="flex justify-between items-center mb-4">
        <div>
          <span className="text-[10px] uppercase font-black tracking-widest text-[#ff2d55] bg-[#ff2d55]/10 px-2.5 py-0.5 rounded-full">
            Apple Fitness Lite
          </span>
          <h2 className="text-xl font-black text-white mt-1">Simulador HIIT Elite</h2>
        </div>
        <button
          onClick={onCancel}
          className="text-xs font-bold text-gray-450 hover:text-white bg-white/5 border border-white/10 px-3 py-1.5 rounded-xl transition-all"
        >
          Salir
        </button>
      </div>

      {/* Week Plan Days Slider (ONLY 4 DAYS REQUESTED) */}
      <div className="mb-4">
        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-2">Mi Calendario Semanal</p>
        <div className="grid grid-cols-4 gap-2">
          {['Lunes', 'Miércoles', 'Viernes', 'Domingo'].map(day => (
            <button
              key={day}
              onClick={() => setSelectedDay(day)}
              className={`py-2 rounded-xl text-xs font-bold transition-all relative overflow-hidden ${
                selectedDay === day
                  ? 'bg-gradient-to-r from-pink-600 to-rose-500 text-white shadow-md shadow-rose-600/20 scale-102 border border-rose-400/20'
                  : 'bg-white/5 hover:bg-white/10 text-gray-400'
              }`}
            >
              {selectedDay === day && (
                <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-white rounded-full" />
              )}
              {day}
            </button>
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {!isCompleted ? (
          <motion.div
            key="workout-active"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 flex flex-col justify-between"
          >
            {/* Visualizer and Live stats banner */}
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div className="bg-white/5 border border-white/10 rounded-2xl p-3 flex items-center gap-2.5">
                <Heart className="w-5 h-5 text-rose-500 animate-pulse shrink-0" />
                <div className="text-left">
                  <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider block">Pulso</span>
                  <span className="text-sm font-black text-white font-mono">{heartRate} <span className="text-[9px] text-gray-400">PPM</span></span>
                </div>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-2xl p-3 flex items-center gap-2.5">
                <Flame className="w-5 h-5 text-orange-500 shrink-0" />
                <div className="text-left">
                  <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider block">Energía Quemada</span>
                  <span className="text-sm font-black text-white font-mono">{caloriesBurned.toFixed(1)} <span className="text-[9px] text-gray-400">KCal</span></span>
                </div>
              </div>
            </div>

            {/* Simulated Animated Exercise Canvas */}
            <div className="bg-[#191122]/60 border border-white/10 p-5 rounded-3xl flex flex-col items-center justify-center relative min-h-[170px] overflow-hidden">
              {/* Dynamic decorative backdrop particles */}
              <div className="absolute inset-0 bg-radial-gradient from-rose-500/10 to-transparent pointer-events-none" />
              
              {/* Dynamic representation based on active animation type */}
              <div className="relative z-10 w-24 h-24 rounded-full border-4 border-rose-500/20 flex items-center justify-center mb-3">
                <motion.div
                  className="absolute inset-1 rounded-full bg-gradient-to-tr from-rose-600/20 to-red-500/30 text-white flex items-center justify-center"
                  animate={
                    isPlaying && activeExercise.animationType === 'pulse'
                      ? { scale: [1, 1.15, 1], rotate: [0, 5, -5, 0] }
                      : isPlaying && activeExercise.animationType === 'bounce'
                      ? { y: [0, -18, 0] }
                      : isPlaying && activeExercise.animationType === 'wave'
                      ? { scaleX: [1, 1.2, 0.9, 1] }
                      : isPlaying && activeExercise.animationType === 'slide'
                      ? { x: [-15, 15, -15] }
                      : { scale: 1 }
                  }
                  transition={{
                    repeat: Infinity,
                    duration: activeExercise.id === 'h5' ? 1.2 : 0.85,
                    ease: "easeInOut"
                  }}
                >
                  <Zap className="w-10 h-10 text-rose-400" />
                </motion.div>
                
                {/* Countdown overlay surrounding circle */}
                <svg className="w-full h-full -rotate-90 absolute">
                  <circle
                    cx="48"
                    cy="48"
                    r="44"
                    stroke="#f43f5e"
                    strokeWidth="3.5"
                    fill="transparent"
                    strokeDasharray={2 * Math.PI * 44}
                    strokeDashoffset={2 * Math.PI * 44 * (1 - timeRemaining / activeExercise.duration)}
                    className="transition-all duration-1000"
                  />
                </svg>
              </div>

              <div className="text-center z-10">
                <h3 className="text-md font-extrabold text-white">{activeExercise.name}</h3>
                <p className="text-[11px] text-gray-300 px-4 mt-1 leading-relaxed max-w-sm">
                  {activeExercise.description}
                </p>
                <div className="flex gap-1.5 items-center justify-center mt-2.5">
                  <span className="text-[9px] bg-white/10 text-rose-300 font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider">
                    Fase {currentIdx + 1} de 5
                  </span>
                  <span className="text-[9px] bg-white/10 text-gray-300 font-bold px-2 py-0.5 rounded-full capitalize">
                    {activeExercise.category}
                  </span>
                </div>
              </div>
            </div>

            {/* Smart Timer Counter and Controls */}
            <div className="mt-4 flex flex-col items-center">
              <div className="text-4xl font-black font-mono text-white tracking-widest drop-shadow-md mb-4 uppercase">
                {Math.floor(timeRemaining / 60)}:{(timeRemaining % 60).toString().padStart(2, '0')}
              </div>

              <div className="flex items-center gap-4">
                {/* Reset button */}
                <button
                  id="hiit-btn-reset"
                  onClick={handleReset}
                  className="p-3.5 bg-white/5 border border-white/10 text-gray-305 rounded-full transition-all active:scale-90 hover:bg-white/10"
                >
                  <RefreshCw className="w-5 h-5 text-white" />
                </button>

                {/* Main Play/Pause */}
                <button
                  id="hiit-btn-play"
                  onClick={handleStartPause}
                  className={`p-5 rounded-full transition-transform active:scale-90 flex items-center justify-center shadow-lg ${
                    isPlaying 
                      ? 'bg-amber-500 text-black shadow-amber-500/20' 
                      : 'bg-rose-600 text-white shadow-rose-600/30'
                  }`}
                >
                  {isPlaying ? <Pause className="w-6 h-6 fill-black" /> : <Play className="w-6 h-6 fill-white ml-0.5" />}
                </button>

                {/* Skip Exercise */}
                <button
                  id="hiit-btn-skip"
                  onClick={handleNextExercise}
                  className="p-3.5 bg-white/5 border border-white/10 text-gray-305 rounded-full transition-all active:scale-90 hover:bg-white/10"
                >
                  <SkipForward className="w-5 h-5 text-white" />
                </button>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="workout-completed"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex-1 flex flex-col items-center justify-center text-center p-4 bg-[#0a110d]/40 rounded-3xl border border-emerald-500/20 my-auto"
          >
            <div className="p-4 bg-emerald-500/10 rounded-full mb-4 border border-emerald-500/30">
              <Award className="w-12 h-12 text-emerald-400" />
            </div>
            <h3 className="text-xl font-black text-white">¡Entrenamiento Completado!</h3>
            <p className="text-xs text-gray-300 mt-2 max-w-xs leading-relaxed">
              Has entrenado con perseverancia durante 30 minutos simulados. ¡Tu racha se ha incrementado y la barra de energía se ha sobrealimentado con éxito!
            </p>

            <div className="grid grid-cols-2 gap-3 w-full max-w-xs mt-5">
              <div className="bg-white/5 border border-white/10 p-2.5 rounded-2xl">
                <span className="text-[9px] uppercase font-bold text-gray-400 block">Tiempo acreditado</span>
                <span className="text-sm font-semibold text-white">30 Minutos</span>
              </div>
              <div className="bg-white/5 border border-white/10 p-2.5 rounded-2xl">
                <span className="text-[9px] uppercase font-bold text-gray-400 block">Calorías Totales</span>
                <span className="text-sm font-semibold text-white">~350 KCal</span>
              </div>
            </div>

            <button
              id="hiit-btn-close-completed"
              onClick={onCancel}
              className="mt-6 w-full max-w-xs py-3 bg-emerald-500 hover:bg-emerald-600 active:scale-95 text-[#030a06] font-bold rounded-2xl text-xs uppercase tracking-wider transition-all shadow-lg shadow-emerald-500/20"
            >
              Listo • Volver al Inicio
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
