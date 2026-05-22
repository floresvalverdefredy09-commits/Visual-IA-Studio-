import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { VisualMode, UserStats } from './types';
import WelcomeSplash from './components/WelcomeSplash';
import LockScreen from './components/LockScreen';
import HomeScreen from './components/HomeScreen';
import ControlCenter from './components/ControlCenter';
import DynamicIsland from './components/DynamicIsland';
import HIITWorkout from './components/HIITWorkout';
import GoalkeeperWorkout from './components/GoalkeeperWorkout';
import AIPanel from './components/AIPanel';
import { playiOSChime, playNotificationChime, playWhistle, playTap } from './utils/audio';

export default function App() {
  // Screens state: 'splash' | 'lock' | 'home' | 'hiit' | 'goalkeeper' | 'ai-panel'
  const [currentScreen, setCurrentScreen] = useState<'splash' | 'lock' | 'home' | 'hiit' | 'goalkeeper' | 'ai-panel'>('splash');
  const [isControlCenterOpen, setIsControlCenterOpen] = useState(false);
  const [visualMode, setVisualMode] = useState<VisualMode>('apple');
  
  // Custom device parameters
  const [soundVolume, setSoundVolume] = useState(0.8);
  const [wallpaperSpeed, setWallpaperSpeed] = useState(1.0);
  const [brightness, setBrightness] = useState(1.0);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [batteryEco, setBatteryEco] = useState(false);

  // Dynamic Island notification state
  const [currentNotification, setCurrentNotification] = useState<string | null>(null);
  const [activeMusic, setActiveMusic] = useState<string | null>(null);

  // Default User profile stats
  const [userStats, setUserStats] = useState<UserStats>({
    streak: 4,
    energy: 75,
    totalMinutes: 120,
    completedWorkouts: 6,
    reactionsCaptured: 15,
    averageReactionTime: 380, // initial milliseconds
  });

  // Current AI Notification Tip
  const [aiAdvice, setAiAdvice] = useState<string>(
    "¡Arriba arquero! Tu arco hoy se mantendrá en cero. Mantén centro de gravedad bajo."
  );

  // Handle HIIT workout session finish
  const handleHIITSessionCompleted = (minutes: number) => {
    setUserStats(prev => ({
      ...prev,
      completedWorkouts: prev.completedWorkouts + 1,
      totalMinutes: prev.totalMinutes + minutes,
      energy: Math.min(100, prev.energy + 25),
      streak: prev.streak + 1,
    }));
    triggerCustomNotification("¡HIIT completado! +25% de energía y +1 racha.");
  };

  // Handle goalkeeper reaction session finish
  const handleGoalkeeperCompleted = (minutes: number, captures: number, avgTime: number) => {
    setUserStats(prev => ({
      ...prev,
      reactionsCaptured: prev.reactionsCaptured + captures,
      completedWorkouts: prev.completedWorkouts + 1,
      totalMinutes: prev.totalMinutes + minutes,
      averageReactionTime: prev.averageReactionTime > 0 
        ? Math.round((prev.averageReactionTime + avgTime) / 2) 
        : avgTime,
      energy: Math.min(100, prev.energy + 20),
      streak: prev.streak + 1,
    }));
    triggerCustomNotification(`¡Atajadas sumadas! Reacción promedio: ${avgTime}ms`);
  };

  // Triggers dynamic notification at top Dynamic Island
  const triggerCustomNotification = (message: string) => {
    setCurrentNotification(message);
    playNotificationChime();
  };

  // Fetch quick motivation on LockScreen
  const handleFetchQuickLockMotivation = async () => {
    try {
      const response = await fetch('/api/motivation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ workoutType: 'Quick Lock Screen Hint', streak: userStats.streak, currentMood: 'enfocado' }),
      });
      const data = await response.json();
      if (data && data.notification) {
        setAiAdvice(data.notification);
        triggerCustomNotification(data.notification);
      }
    } catch (err) {
      const fb = "¡Supérate a ti mismo hoy! ¡El arco de Honor X8b te espera!";
      setAiAdvice(fb);
      triggerCustomNotification(fb);
    }
  };

  // Determine outer background styling for simulated iOS container
  const getOuterThemeClass = () => {
    if (visualMode === 'gamer') return 'bg-[#140018] shadow-[0_0_50px_rgba(244,63,94,0.3)]';
    if (visualMode === 'neon') return 'bg-[#001c24] shadow-[0_0_50px_rgba(6,182,212,0.35)]';
    if (visualMode === 'eco') return 'bg-[#000d05] shadow-[0_0_35px_rgba(16,185,129,0.15)]';
    if (visualMode === 'extreme') return 'bg-[#1b0308] border-red-500/20';
    return 'bg-[#090b16] shadow-[0_0_60px_rgba(99,102,241,0.2)]';
  };

  return (
    <div 
      className="w-full min-h-screen bg-[#030612] flex items-center justify-center p-0 sm:p-4 text-white font-sans transition-colors duration-700 relative overflow-hidden"
      style={{ filter: `brightness(${brightness})` }}
    >
      
      {/* Dynamic Background subtle interactive particle dots */}
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
        {Array.from({ length: 15 }).map((_, i) => (
          <motion.div
            key={i}
            className={`absolute rounded-full filter blur-sm ${
              visualMode === 'gamer' ? 'bg-rose-500' : visualMode === 'neon' ? 'bg-cyan-400' : 'bg-indigo-500'
            }`}
            style={{
              width: Math.random() * 8 + 4,
              height: Math.random() * 8 + 4,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -40, 0],
              x: [0, Math.random() * 30 - 15, 0],
              opacity: [0.3, 0.8, 0.3],
            }}
            transition={{
              repeat: Infinity,
              duration: (Math.random() * 6 + 4) / wallpaperSpeed,
              delay: Math.random() * 3,
            }}
          />
        ))}
      </div>

      {/* Main Honor X8b Device viewport simulator chassis */}
      <div 
        id="honor-phone-frame"
        className={`w-full max-w-[420px] h-[100vh] sm:h-[860px] rounded-0 sm:rounded-[48px] border-0 sm:border-[12px] border-[#15192c] flex flex-col justify-between relative overflow-hidden z-10 transition-all ${getOuterThemeClass()}`}
      >
        
        {/* iOS Front Facing camera pill / punch hole simulator */}
        <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-32 h-6 bg-black rounded-full z-60 border border-white/5 pointer-events-none" />

        {/* Floating iOS Dynamic Island Container */}
        <DynamicIsland 
          currentNotification={currentNotification}
          workoutActive={currentScreen === 'hiit'}
          activeExerciseName="Circuito HIIT de Honor"
          timeRemaining={1800} // minutes
          batteryEco={batteryEco}
          activeMusic={activeMusic}
          onTapIsland={() => {
            if (currentScreen === 'home') {
              setCurrentScreen('ai-panel');
            } else {
              setCurrentScreen('home');
            }
          }}
        />

        {/* Content Screens */}
        <div className="flex-1 flex flex-col relative pt-10 h-full">
          <AnimatePresence mode="wait">
            {currentScreen === 'splash' && (
              <WelcomeSplash 
                onDismiss={() => {
                  playiOSChime();
                  setCurrentScreen('lock');
                }}
              />
            )}

            {currentScreen === 'lock' && (
              <LockScreen 
                onUnlock={() => setCurrentScreen('home')}
                streak={userStats.streak}
                energy={userStats.energy}
                batteryEco={batteryEco}
                onGetAICoachMotivation={handleFetchQuickLockMotivation}
                aiNotification={aiAdvice}
              />
            )}

            {currentScreen === 'home' && (
              <HomeScreen 
                stats={userStats}
                visualMode={visualMode}
                onLaunchHIIT={() => { playWhistle(); setCurrentScreen('hiit'); }}
                onLaunchGoalkeeper={() => { playWhistle(); setCurrentScreen('goalkeeper'); }}
                onOpenControlCenter={() => { playTap(); setIsControlCenterOpen(true); }}
                onOpenAIPanel={() => setCurrentScreen('ai-panel')}
                onGetAICoachMotivation={handleFetchQuickLockMotivation}
                aiAdvice={aiAdvice}
                activeMusic={activeMusic}
                setActiveMusic={setActiveMusic}
              />
            )}

            {currentScreen === 'hiit' && (
              <HIITWorkout 
                onComplete={handleHIITSessionCompleted}
                onCancel={() => setCurrentScreen('home')}
              />
            )}

            {currentScreen === 'goalkeeper' && (
              <GoalkeeperWorkout 
                onComplete={handleGoalkeeperCompleted}
                onCancel={() => setCurrentScreen('home')}
              />
            )}

            {currentScreen === 'ai-panel' && (
              <AIPanel 
                streak={userStats.streak}
                onSetNotification={(msg) => {
                  setAiAdvice(msg);
                  triggerCustomNotification(msg);
                }}
              />
            )}
          </AnimatePresence>

          {/* Persistent iOS 18 bottom navigation bar simulator (when unlocked) */}
          {currentScreen !== 'splash' && currentScreen !== 'lock' && (
            <div className="absolute bottom-2 left-0 right-0 z-30 flex justify-center items-center gap-6 bg-black/40 border border-white/10 p-2 mx-6 rounded-2xl backdrop-blur-md">
              <button 
                id="tab-btn-home"
                onClick={() => { playTap(); setCurrentScreen('home'); }} 
                className={`text-xs font-black uppercase tracking-wider py-1.5 px-4 rounded-xl transition-colors ${
                  currentScreen === 'home' ? 'bg-[#ff2d55] text-white shadow-md' : 'text-gray-400 hover:text-white'
                }`}
              >
                Inicio
              </button>
              <button 
                id="tab-btn-instructor"
                onClick={() => { playTap(); setCurrentScreen('ai-panel'); }} 
                className={`text-xs font-black uppercase tracking-wider py-1.5 px-4 rounded-xl transition-colors ${
                  currentScreen === 'ai-panel' ? 'bg-amber-500 text-black shadow-md' : 'text-gray-400 hover:text-white'
                }`}
              >
                Virtual Coach
              </button>
            </div>
          )}
        </div>

        {/* Sliding Apple translucent Control Center drawer */}
        <AnimatePresence>
          {isControlCenterOpen && (
            <ControlCenter 
              onClose={() => setIsControlCenterOpen(false)}
              visualMode={visualMode}
              setVisualMode={setVisualMode}
              soundVolume={soundVolume}
              setSoundVolume={setSoundVolume}
              wallpaperSpeed={wallpaperSpeed}
              setWallpaperSpeed={setWallpaperSpeed}
              brightness={brightness}
              setBrightness={setBrightness}
              isDarkMode={isDarkMode}
              setIsDarkMode={setIsDarkMode}
              batteryEco={batteryEco}
              setBatteryEco={setBatteryEco}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
