type AudioContextCtor = typeof AudioContext;

interface AudioWindow {
  AudioContext?: AudioContextCtor;
  webkitAudioContext?: AudioContextCtor;
}

let audioContext: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    if (!audioContext) {
      const audioWindow = window as unknown as AudioWindow;
      const Ctor = audioWindow.AudioContext ?? audioWindow.webkitAudioContext;

      if (!Ctor) {
        return null;
      }

      audioContext = new Ctor();
    }

    return audioContext;
  } catch {
    return null;
  }
}

/** Soft two-tone "ding" synthesized via Web Audio — no asset needed. */
export function playNotificationSound(): void {
  const ctx = getAudioContext();

  if (!ctx) {
    return;
  }

  try {
    if (ctx.state === "suspended") {
      void ctx.resume();
    }

    const now = ctx.currentTime;
    const gain = ctx.createGain();
    gain.connect(ctx.destination);
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.12, now + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.4);

    const oscillator = ctx.createOscillator();
    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(880, now);
    oscillator.frequency.setValueAtTime(1174.66, now + 0.13);
    oscillator.connect(gain);
    oscillator.start(now);
    oscillator.stop(now + 0.42);
  } catch {
    // Autoplay may be blocked before the first gesture; ignore silently.
  }
}
