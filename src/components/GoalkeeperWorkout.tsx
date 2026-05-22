import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Target, Zap, Shield, Trophy, Activity, Play, RefreshCw, Star, Sparkles } from 'lucide-react';
import { playTap, playSuccessChime, playWhistle, playiOSChime } from '../utils/audio';

interface GoalkeeperWorkoutProps {
  onComplete: (minutes: number, captures: number, avgTime: number) => void;
  onCancel: () => void;
}

interface SoccerBallTarget {
  id: number;
  x: number; // percentage width
  y: number; // percentage height
  size: number;
  score: number;
  startTime: number;
  color: string;
}

export default function GoalkeeperWorkout({ onComplete, onCancel }: GoalkeeperWorkoutProps) {
  const [activeLevel, setActiveLevel] = useState<'reflejos' | 'coordinacion' | 'atajadas'>('reflejos');
  const [isPlaying, setIsPlaying] = useState(false);
  const [gameTime, setGameTime] = useState(25); // 25 seconds interactive workout
  const [balls, setBalls] = useState<SoccerBallTarget[]>([]);
  const [score, setScore] = useState(0);
  const [reactionTimes, setReactionTimes] = useState<number[]>([]);
  const [isCompleted, setIsCompleted] = useState(false);
  const [lastFeedback, setLastFeedback] = useState<string | null>(null);

  const arenaRef = useRef<HTMLDivElement>(null);
  const ballIdCounter = useRef(0);
  const gameIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const ballSpawnIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Sound feedback text array
  const savesFeedbacks = [
    "¡ATAJADA ESPECTACULAR!",
    "¡Vuelo de Antología!",
    "¡Reflejos de Honor X8b!",
    "¡Tapadón al ángulo!",
    "¡Arquerazo elite!",
    "¡Tenaza segura!",
    "¡Desvío felino!"
  ];

  // Handle Target Clicks
  const handleBallHit = (ball: SoccerBallTarget, e: React.MouseEvent) => {
    e.stopPropagation();
    const hitTime = Date.now();
    const reaction = hitTime - ball.startTime;
    
    playTap();
    setScore(prev => prev + ball.score);
    setReactionTimes(prev => [...prev, reaction]);
    
    // Choose a funny soccer goalie phrase
    const randomPhrase = savesFeedbacks[Math.floor(Math.random() * savesFeedbacks.length)];
    setLastFeedback(randomPhrase);
    
    // Remove target immediately
    setBalls(prev => prev.filter(b => b.id !== ball.id));
  };

  // Logic to spawn soccer balls
  const spawnBallTarget = () => {
    if (!isPlaying || isCompleted) return;
    
    // Config coordinates safely within container bounds
    const x = Math.floor(Math.random() * 75) + 12; // 12% to 87%
    const y = Math.floor(Math.random() * 60) + 15; // 15% to 75%
    
    let size = 52;
    let scoreVal = 100;
    let color = 'from-emerald-400 to-teal-500 shadow-teal-500/30';
    
    if (activeLevel === 'coordinacion') {
      size = 44;
      scoreVal = 150;
      color = 'from-violet-500 to-indigo-600 shadow-indigo-500/30';
    } else if (activeLevel === 'atajadas') {
      size = 36;
      scoreVal = 250;
      color = 'from-rose-500 to-pink-600 shadow-rose-500/30';
    }

    const newBall: SoccerBallTarget = {
      id: ballIdCounter.current++,
      x,
      y,
      size,
      score: scoreVal,
      startTime: Date.now(),
      color
    };

    setBalls(prev => [...prev, newBall]);

    // Auto-remove ball after a window if user missed it
    const lifetime = activeLevel === 'reflejos' ? 2200 : activeLevel === 'coordinacion' ? 1600 : 1000;
    setTimeout(() => {
      setBalls(prev => prev.filter(b => b.id !== newBall.id));
    }, lifetime);
  };

  // Launch the game sessions
  const startAgilityTraining = () => {
    setIsPlaying(true);
    setScore(0);
    setReactionTimes([]);
    setGameTime(25);
    setIsCompleted(false);
    setLastFeedback("¡MANTÉN TUS OJOS EN LOS BALONES!");
    playWhistle();

    // Game Timer ticking down
    gameIntervalRef.current = setInterval(() => {
      setGameTime(prev => {
        if (prev <= 1) {
          endAgilityTraining();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Ball Spawns according to levels
    const spawnSpeed = activeLevel === 'reflejos' ? 1400 : activeLevel === 'coordinacion' ? 950 : 650;
    ballSpawnIntervalRef.current = setInterval(spawnBallTarget, spawnSpeed);
  };

  const endAgilityTraining = () => {
    setIsPlaying(false);
    setIsCompleted(true);
    playSuccessChime();

    if (gameIntervalRef.current) clearInterval(gameIntervalRef.current);
    if (ballSpawnIntervalRef.current) clearInterval(ballSpawnIntervalRef.current);
  };

  useEffect(() => {
    return () => {
      if (gameIntervalRef.current) clearInterval(gameIntervalRef.current);
      if (ballSpawnIntervalRef.current) clearInterval(ballSpawnIntervalRef.current);
    };
  }, []);

  const handleFinishSession = () => {
    const avg = reactionTimes.length > 0 
      ? Math.round(reactionTimes.reduce((a, b) => a + b, 0) / reactionTimes.length) 
      : 350;
    
    onComplete(30, reactionTimes.length, avg); // Claimed goalkeeper session
  };

  return (
    <div className="flex-1 flex flex-col p-4 overflow-y-auto select-none bg-gradient-to-b from-[#061019] to-[#01060c]">
      {/* Header */}
      <div className="flex justify-between items-center mb-3">
        <div>
          <span className="text-[10px] uppercase font-black tracking-widest text-[#2f80ed] bg-[#2f80ed]/10 px-2.5 py-0.5 rounded-full">
            GK Reflex Simulator
          </span>
          <h2 className="text-xl font-black text-white mt-1">Reflejos de Arquero</h2>
        </div>
        <button
          onClick={onCancel}
          className="text-xs font-bold text-gray-450 hover:text-white bg-white/5 border border-white/10 px-3 py-1.5 rounded-xl transition-all"
        >
          Salir
        </button>
      </div>

      {/* Mode / Phase Selection Indicators */}
      <div className="mb-3 grid grid-cols-3 gap-1 bg-white/5 border border-white/15 p-1 rounded-xl">
        <button
          disabled={isPlaying}
          onClick={() => { playTap(); setActiveLevel('reflejos'); }}
          className={`py-1.5 text-[10px] font-bold rounded-lg uppercase tracking-wider transition-all ${
            activeLevel === 'reflejos'
              ? 'bg-[#2f80ed] text-white shadow-sm'
              : 'text-gray-400 hover:text-white disabled:opacity-50'
          }`}
        >
          1. Reflejos
        </button>
        <button
          disabled={isPlaying}
          onClick={() => { playTap(); setActiveLevel('coordinacion'); }}
          className={`py-1.5 text-[10px] font-bold rounded-lg uppercase tracking-wider transition-all ${
            activeLevel === 'coordinacion'
              ? 'bg-[#bb6bd9] text-white shadow-sm'
              : 'text-gray-400 hover:text-white disabled:opacity-50'
          }`}
        >
          2. Coord.
        </button>
        <button
          disabled={isPlaying}
          onClick={() => { playTap(); setActiveLevel('atajadas'); }}
          className={`py-1.5 text-[10px] font-bold rounded-lg uppercase tracking-wider transition-all ${
            activeLevel === 'atajadas'
              ? 'bg-rose-500 text-white shadow-sm'
              : 'text-gray-400 hover:text-white disabled:opacity-50'
          }`}
        >
          3. Atajadas
        </button>
      </div>

      {!isPlaying && !isCompleted ? (
        <motion.div
          key="lobby"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex-1 flex flex-col justify-center items-center text-center p-4 bg-white/5 border border-white/10 rounded-3xl"
        >
          <div className="p-4 bg-blue-500/10 rounded-full mb-3 border border-blue-500/20">
            <Target className="w-10 h-10 text-blue-400 animate-pulse" />
          </div>
          <h3 className="text-lg font-bold text-white capitalize">Fase: Entrenar {activeLevel}</h3>
          
          <p className="text-xs text-gray-300 mt-2 max-w-sm leading-relaxed px-2">
            Mejora tus capacidades cognitivas, velocidad y coordinación motriz de arquero sin salir de casa. El juego disparará estímulos rápidos en pantalla.
          </p>

          <div className="bg-[#0b1424] border border-blue-900/45 p-3 rounded-2xl w-full max-w-xs mt-4 text-left flex gap-3 text-xs">
            <Shield className="w-6 h-6 text-[#2f80ed] shrink-0" />
            <div>
              <p className="font-extrabold text-blue-300 uppercase text-[9px] tracking-wider">Reglas de Atajada</p>
              <p className="text-gray-300 mt-0.5 text-[10px] leading-relaxed">
                Toca las esferas de fútbol ni bien brillen en pantalla. Cuanto más veloz respondas, menor será tu tiempo de reacción (ms).
              </p>
            </div>
          </div>

          <button
            id="gk-btn-start"
            onClick={startAgilityTraining}
            className="mt-6 w-full max-w-xs py-3.5 bg-gradient-to-r from-blue-500 to-[#2f80ed] hover:brightness-110 active:scale-95 text-white font-extrabold rounded-2xl text-xs uppercase tracking-widest shadow-lg shadow-blue-500/20 transition-all flex items-center justify-center gap-2"
          >
            <Play className="w-4 h-4 fill-white" />
            Iniciar Campo de Entrenamiento
          </button>
        </motion.div>
      ) : isPlaying ? (
        <motion.div
          key="arena"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex-1 flex flex-col relative"
        >
          {/* Stats Bar */}
          <div className="flex justify-between items-center bg-white/5 border border-white/10 px-4 py-2.5 rounded-2xl text-xs font-semibold">
            <span className="text-gray-300 font-mono">
              Tiempo: <span className="text-white font-bold">{gameTime}s</span>
            </span>
            <span className="text-[#2f80ed] font-bold">
              Atajadas: {reactionTimes.length}
            </span>
            <span className="text-yellow-405 font-mono font-bold text-yellow-300">
              Puntos: {score}
            </span>
          </div>

          {/* Interactive 2D Screen Canvas Target Area */}
          <div 
            ref={arenaRef}
            id="goalkeeper-arena"
            className="flex-1 mt-3 bg-slate-950/80 border border-white/15 rounded-3xl relative overflow-hidden min-h-[300px]"
          >
            {/* Soccer goal net design pattern backdrop */}
            <div className="absolute inset-0 bg-goal-pattern bg-[linear-gradient(rgba(255,255,255,0.02)_1px,_transparent_1px),_linear-gradient(90deg,_rgba(255,255,255,0.02)_1px,_transparent_1px)] bg-[size:20px_20px] pointer-events-none" />

            {/* Simulated goal post bars overlay */}
            <div className="absolute top-0 left-4 right-4 h-2 bg-gradient-to-r from-transparent via-white/15 to-transparent rounded-full" />
            <div className="absolute top-0 bottom-0 left-4 w-1 bg-gradient-to-b from-white/15 to-transparent" />
            <div className="absolute top-0 bottom-0 right-4 w-1 bg-gradient-to-b from-white/15 to-transparent" />

            {/* Dynamic UI feedback message */}
            <AnimatePresence>
              {lastFeedback && (
                <motion.div
                  key={lastFeedback}
                  initial={{ scale: 0.7, opacity: 0, y: 10 }}
                  animate={{ scale: 1, opacity: 1, y: 0 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  className="absolute bottom-4 left-0 right-0 text-center z-20 pointer-events-none"
                >
                  <span className="bg-blue-500/10 text-blue-300 font-black border border-blue-500/20 px-3.5 py-1 rounded-full text-[10px] sm:text-xs uppercase tracking-wide">
                    {lastFeedback}
                  </span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Soccer Ball Targets */}
            <AnimatePresence>
              {balls.map(ball => (
                <motion.div
                  key={ball.id}
                  onClick={(e) => handleBallHit(ball, e)}
                  initial={{ scale: 0.1, opacity: 0, rotate: 180 }}
                  animate={{ scale: 1, opacity: 1, rotate: 0 }}
                  exit={{ scale: 1.3, opacity: 0 }}
                  style={{
                    position: 'absolute',
                    left: `${ball.x}%`,
                    top: `${ball.y}%`,
                    width: `${ball.size}px`,
                    height: `${ball.size}px`,
                  }}
                  className={`cursor-pointer rounded-full bg-gradient-to-br ${ball.color} flex items-center justify-center border-2 border-white text-white font-extrabold text-[10px] shadow-lg select-none`}
                >
                  {/* Soccer ball graphic layers */}
                  <div className="absolute inset-0 rounded-full border border-black/30 border-dashed" />
                  <Target className="w-5 h-5 text-white/90 animate-spin" style={{ animationDuration: '6s' }} />
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Instructions helper overlay */}
            {balls.length === 0 && (
              <div className="absolute inset-0 flex items-center justify-center text-center pointer-events-none">
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest select-none">
                  Esperando Balón...
                </p>
              </div>
            )}
          </div>
        </motion.div>
      ) : (
        <motion.div
          key="completed"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex-1 flex flex-col justify-center items-center text-center p-4 bg-[#091522]/40 rounded-3xl border border-blue-500/20 my-auto"
        >
          <div className="p-4 bg-blue-500/10 rounded-full mb-3 border border-blue-500/25">
            <Trophy className="w-10 h-10 text-yellow-405 text-yellow-400 animate-bounce" />
          </div>
          <h3 className="text-lg font-black text-white">¡Sesión de Reflejos Finalizada!</h3>
          <p className="text-xs text-gray-300 mt-2 max-w-sm leading-relaxed px-1">
            Impresionante rendimiento para tu Honor X8b. Tus coordinaciones neuro-motoras estimulan reflejos de guardameta profesional.
          </p>

          <dl className="grid grid-cols-3 gap-2 w-full max-w-sm mt-5">
            <div className="bg-white/5 border border-white/10 p-2.5 rounded-xl text-center">
              <span className="text-[9px] uppercase font-bold text-gray-400 block leading-tight">Puntuación</span>
              <span className="text-md font-black text-white">{score}</span>
            </div>
            <div className="bg-white/5 border border-white/10 p-2.5 rounded-xl text-center">
              <span className="text-[9px] uppercase font-bold text-gray-400 block leading-tight">Atajadas</span>
              <span className="text-md font-black text-white">{reactionTimes.length}</span>
            </div>
            <div className="bg-white/5 border border-white/10 p-2.5 rounded-xl text-center">
              <span className="text-[9px] uppercase font-bold text-gray-400 block leading-tight">Milisegundos</span>
              <span className="text-md font-black text-blue-400 font-mono">
                {reactionTimes.length > 0 ? Math.round(reactionTimes.reduce((a, b) => a + b) / reactionTimes.length) : '---'}
              </span>
            </div>
          </dl>

          <button
            id="gk-btn-finish"
            onClick={handleFinishSession}
            className="mt-6 w-full max-w-xs py-3.5 bg-gradient-to-r from-blue-500 to-[#2f80ed] hover:brightness-110 active:scale-95 text-white font-extrabold rounded-2xl text-xs uppercase tracking-wider shadow-lg shadow-blue-500/20 transition-all"
          >
            Acreditar Entrenamiento (30 Min)
          </button>
        </motion.div>
      )}
    </div>
  );
}
