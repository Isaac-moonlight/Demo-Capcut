/**
 * Web Audio API synthesized culinary bell sounds (Cloche de service, Commande prête)
 * Runs reliably without requiring external audio files that could 404.
 */

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    audioCtx = new AudioContextClass();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

/**
 * Service Bell ("Ding!" haute cuisine)
 */
export function playServiceBell(frequency = 1760) {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;

    // Fundamental and harmonics
    const freqs = [frequency, frequency * 2.05, frequency * 3.12, frequency * 4.2];
    const gains = [0.4, 0.25, 0.12, 0.05];

    freqs.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);

      gainNode.gain.setValueAtTime(gains[i], now);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, now + (i === 0 ? 1.8 : 0.8));

      osc.connect(gainNode);
      gainNode.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 2.0);
    });
  } catch (err) {
    console.warn('Audio bell could not play:', err);
  }
}

/**
 * New Order Kitchen Chime (Double bell chime)
 */
export function playNewOrderChime() {
  playServiceBell(1567.98); // G6
  setTimeout(() => {
    playServiceBell(2093.0); // C7
  }, 140);
}

/**
 * Order Ready Alert (Triple fanfare chime)
 */
export function playOrderReadyChime() {
  playServiceBell(1318.51); // E6
  setTimeout(() => playServiceBell(1567.98), 120); // G6
  setTimeout(() => playServiceBell(2093.0), 240); // C7
}
