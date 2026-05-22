import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, MessageSquare, Flame, Trophy, Volume2, Shield, Activity, RefreshCw } from 'lucide-react';
import { AIResponse } from '../types';
import { playTap, playNotificationChime } from '../utils/audio';

interface AIPanelProps {
  streak: number;
  onSetNotification: (msg: string) => void;
}

export default function AIPanel({ streak, onSetNotification }: AIPanelProps) {
  const [coachStyle, setCoachStyle] = useState<string>('Enérgico y Exigente');
  const [currentMood, setCurrentMood] = useState<string>('cansado');
  const [workoutType, setWorkoutType] = useState<string>('Goalkeeper Agility');
  const [loading, setLoading] = useState(false);
  const [motivationData, setMotivationData] = useState<AIResponse | null>({
    notification: "¡Arriba arquero, tu arco hoy se queda en cero!",
    advice: "Para reflejos rápidos, dobla rodillas levemente y mantén tu peso sobre la punta de los pies.",
    challenge: "Completa 10 atajadas seguidas con promedio menor a 380 milisegundos."
  });

  const fetchAIQuotes = async () => {
    playTap();
    setLoading(true);
    try {
      const response = await fetch('/api/motivation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          workoutType,
          streak,
          currentMood,
          coachStyle,
        }),
      });
      const data = await response.json();
      if (data && data.notification) {
        setMotivationData(data);
        onSetNotification(data.notification);
        playNotificationChime();
      }
    } catch (e) {
      console.warn("AI generation error:", e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col p-4 bg-gradient-to-b from-[#090b16] to-[#04040a] select-none text-white overflow-y-auto">
      {/* Selector Title */}
      <div className="mb-4">
        <span className="text-[10px] bg-amber-500/10 text-amber-400 font-extrabold uppercase px-2.5 py-0.5 rounded-full border border-amber-500/15">
          Gemini 3.5 AI Engine
        </span>
        <h2 className="text-xl font-black mt-1">Mentor Deportivo Honor</h2>
        <p className="text-xs text-gray-400 mt-0.5 leading-relaxed">
          Sincroniza con tu Coach Virtual para programar indicaciones tácticas y frases epicas de reacción.
        </p>
      </div>

      {/* Inputs controls */}
      <div className="bg-white/5 border border-white/10 p-3.5 rounded-2xl flex flex-col gap-3.5 mb-4 text-xs">
        {/* Coach Lineup */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] text-gray-400 uppercase font-bold">Estilo de Coach</label>
          <div className="grid grid-cols-3 gap-1.5">
            {['Directo', 'Filosófico', 'Aplastador'].map(style => (
              <button
                key={style}
                onClick={() => { playTap(); setCoachStyle(style); }}
                className={`py-1.5 rounded-lg font-bold transition-all ${
                  coachStyle === style
                    ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md'
                    : 'bg-white/5 hover:bg-white/10 text-gray-450'
                }`}
              >
                {style}
              </button>
            ))}
          </div>
        </div>

        {/* Current Mood State */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] text-gray-400 uppercase font-bold">Tu estado actual</label>
          <div className="grid grid-cols-3 gap-1.5">
            {['cansado', 'motivado', 'enfocado'].map(mood => (
              <button
                key={mood}
                onClick={() => { playTap(); setCurrentMood(mood); }}
                className={`py-1.5 rounded-lg font-bold transition-all capitalize ${
                  currentMood === mood
                    ? 'bg-indigo-650 bg-indigo-600 text-white shadow-md'
                    : 'bg-white/5 hover:bg-white/10 text-gray-450'
                }`}
              >
                {mood}
              </button>
            ))}
          </div>
        </div>

        {/* Workout selection */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] text-gray-400 uppercase font-bold">Enfoque de Entrenamiento</label>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => { playTap(); setWorkoutType('Goalkeeper Agility'); }}
              className={`py-2 rounded-xl font-bold transition-all uppercase tracking-wider text-[10px] ${
                workoutType === 'Goalkeeper Agility'
                  ? 'bg-[#2f80ed] text-white shadow-md'
                  : 'bg-white/5 hover:bg-white/10 text-gray-450'
              }`}
            >
              Arquero / Agilidad
            </button>
            <button
              onClick={() => { playTap(); setWorkoutType('Hiit Explosive'); }}
              className={`py-2 rounded-xl font-bold transition-all uppercase tracking-wider text-[10px] ${
                workoutType === 'Hiit Explosive'
                  ? 'bg-[#ff2d55] text-white shadow-md'
                  : 'bg-white/5 hover:bg-white/10 text-gray-450'
              }`}
            >
              HIit / Cardio
            </button>
          </div>
        </div>

        {/* Execute Button */}
        <button
          id="btn-fetch-companion"
          disabled={loading}
          onClick={fetchAIQuotes}
          className="w-full mt-1.5 py-3 bg-gradient-to-r from-orange-500 via-[#ff3b30] to-pink-500 hover:opacity-90 active:scale-97 text-white font-black rounded-xl uppercase tracking-wider transition-all shadow-lg flex items-center justify-center gap-2 text-xs"
        >
          {loading ? (
            <RefreshCw className="w-4 h-4 animate-spin text-white" />
          ) : (
            <Sparkles className="w-4 h-4 text-white animate-pulse" />
          )}
          {loading ? "Analizando tu juego..." : "Generar Consejo de Honor"}
        </button>
      </div>

      {/* AI Response Display Card */}
      <AnimatePresence mode="wait">
        {motivationData && !loading && (
          <motion.div
            key="ai-output"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex-1 bg-white/5 border border-white/10 rounded-3xl p-4 text-left flex flex-col gap-4 relative overflow-hidden"
          >
            {/* Visual Glassmorphism indicator circles */}
            <div className="absolute top-2 right-2 w-20 h-20 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 rounded-full filter blur-xl pointer-events-none" />

            {/* Notification bubble style block */}
            <div className="bg-black/35 border border-white/10 rounded-2xl p-3 relative flex gap-3 z-10">
              <div className="p-2.5 bg-gradient-to-tr from-[#ff9500] to-amber-500 rounded-xl max-h-[36px] flex items-center justify-center shrink-0">
                <Flame className="w-4 h-4 text-white animate-pulse" />
              </div>
              <div>
                <span className="text-[9px] font-black uppercase text-amber-400 tracking-wider">Llamada Motivacional</span>
                <p className="text-xs font-bold text-white mt-0.5 leading-relaxed">
                  "{motivationData.notification}"
                </p>
              </div>
            </div>

            {/* Technical advice block */}
            <div className="flex gap-3 px-1.5">
              <div className="p-2 bg-blue-500/10 rounded-lg max-h-[30px] flex items-center justify-center border border-blue-500/15 shrink-0">
                <Shield className="w-4 h-4 text-[#2f80ed]" />
              </div>
              <div>
                <span className="text-[9px] font-black uppercase text-blue-400 tracking-wider">Consejo Táctico de Honor</span>
                <p className="text-xs font-semibold text-gray-200 mt-0.5 leading-relaxed">
                  {motivationData.advice}
                </p>
              </div>
            </div>

            {/* Challenge of the day block */}
            <div className="flex gap-3 px-1.5 mt-1">
              <div className="p-2 bg-emerald-500/10 rounded-lg max-h-[30px] flex items-center justify-center border border-emerald-500/15 shrink-0">
                <Trophy className="w-4 h-4 text-emerald-400" />
              </div>
              <div>
                <span className="text-[9px] font-black uppercase text-emerald-400 tracking-wider">Reto Diario Exclusivo</span>
                <p className="text-xs text-gray-300 font-semibold mt-0.5 leading-relaxed">
                  {motivationData.challenge}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
