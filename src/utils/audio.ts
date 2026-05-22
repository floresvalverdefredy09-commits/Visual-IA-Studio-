// Sound generator utilizing Web Audio API for iOS-style and futuristic fitness feedback
let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

export function playTap() {
  const ctx = getAudioContext();
  if (!ctx) return;
  try {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(120, ctx.currentTime + 0.08);
    
    gain.gain.setValueAtTime(0.08, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    osc.start();
    osc.stop(ctx.currentTime + 0.08);
  } catch (e) {
    console.warn("Audio play failed:", e);
  }
}

export function playiOSChime() {
  const ctx = getAudioContext();
  if (!ctx) return;
  try {
    const now = ctx.currentTime;
    
    // Low frequency ambient base chime
    const playTone = (freq: number, start: number, duration: number, vol: number) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, start);
      
      gain.gain.setValueAtTime(0, start);
      gain.gain.linearRampToValueAtTime(vol, start + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.001, start + duration);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.start(start);
      osc.stop(start + duration);
    };

    playTone(523.25, now, 0.4, 0.06); // C5
    playTone(659.25, now + 0.08, 0.5, 0.06); // E5
    playTone(783.99, now + 0.16, 0.6, 0.07); // G5
    playTone(1046.50, now + 0.24, 0.8, 0.05); // C6
  } catch (e) {
    console.warn("Audio play failed:", e);
  }
}

export function playNotificationChime() {
  const ctx = getAudioContext();
  if (!ctx) return;
  try {
    const now = ctx.currentTime;
    // Elegant dual bell tone
    const playBell = (freq: number, delay: number, vol: number) => {
      const osc = ctx.createOscillator();
      const filter = ctx.createBiquadFilter();
      const gain = ctx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + delay);
      
      filter.type = 'lowpass';
      filter.Q.setValueAtTime(1, now + delay);
      filter.frequency.setValueAtTime(2000, now + delay);
      
      gain.gain.setValueAtTime(vol, now + delay);
      gain.gain.exponentialRampToValueAtTime(0.001, now + delay + 0.5);
      
      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      
      osc.start(now + delay);
      osc.stop(now + delay + 0.6);
    };

    playBell(880, 0, 0.06);  // A5
    playBell(1318.51, 0.07, 0.05); // E6
  } catch (e) {
    console.warn(e);
  }
}

export function playWhistle() {
  const ctx = getAudioContext();
  if (!ctx) return;
  try {
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(1100, now);
    osc.frequency.exponentialRampToValueAtTime(1400, now + 0.15);
    osc.frequency.exponentialRampToValueAtTime(1000, now + 0.3);
    
    // Add rapid volume modulation for whistle effect
    const mod = ctx.createOscillator();
    const modGain = ctx.createGain();
    mod.frequency.value = 35; // Vibrato / whistle flutter
    modGain.gain.value = 15;
    
    mod.connect(modGain);
    modGain.connect(osc.frequency);
    
    gain.gain.setValueAtTime(0.01, now);
    gain.gain.linearRampToValueAtTime(0.08, now + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    mod.start();
    osc.start();
    osc.stop(now + 0.35);
    mod.stop(now + 0.35);
  } catch (e) {
    console.warn(e);
  }
}

export function playTick() {
  const ctx = getAudioContext();
  if (!ctx) return;
  try {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(1500, ctx.currentTime);
    
    gain.gain.setValueAtTime(0.05, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.02);
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    osc.start();
    osc.stop(ctx.currentTime + 0.02);
  } catch (e) {
    // ignore
  }
}

export function playSuccessChime() {
  const ctx = getAudioContext();
  if (!ctx) return;
  try {
    const now = ctx.currentTime;
    const playNote = (freq: number, start: number, type: OscillatorType = 'sine') => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, start);
      gain.gain.setValueAtTime(0.05, start);
      gain.gain.exponentialRampToValueAtTime(0.001, start + 0.35);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(start);
      osc.stop(start + 0.4);
    };

    playNote(523.25, now, 'triangle'); // C5
    playNote(659.25, now + 0.08); // E5
    playNote(783.99, now + 0.16); // G5
    playNote(987.77, now + 0.24); // B5 (Major 7th energy)
    playNote(1046.50, now + 0.32, 'triangle'); // C6
  } catch (e) {
    // ignore
  }
}
