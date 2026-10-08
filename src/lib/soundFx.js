/**
 * Native Web Audio API Sound Effects Synthesizer.
 * Zero external dependencies. Generates soft, high-fidelity micro-acoustic
 * feedback designed for premium engineering command centers.
 * All sound triggers are gracefully guarded against SSR and browser autoplay policies.
 */

class SoundSynthesizer {
  constructor() {
    this.ctx = null;
    this.muted = true; // Muted by default to respect visitor preference
    this.listeners = new Set();
    this.lastHoverTime = 0;

    // Load persisted state if in browser
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('mf_portfolio_audio_muted');
        if (saved !== null) {
          this.muted = saved === 'true';
        }
      } catch {
        // localStorage unavailable
      }
    }
  }

  init() {
    if (typeof window === 'undefined') return false;
    try {
      if (!this.ctx) {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (AudioCtx) {
          this.ctx = new AudioCtx();
        }
      }
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
      return !!this.ctx;
    } catch {
      return false;
    }
  }

  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  notify() {
    this.listeners.forEach((fn) => {
      try {
        fn(this.muted);
      } catch {
        // Ignore subscriber errors
      }
    });
  }

  isMuted() {
    return this.muted;
  }

  setMuted(muted) {
    this.muted = Boolean(muted);
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('mf_portfolio_audio_muted', String(this.muted));
      } catch {
        // Ignore storage error
      }
    }
    if (!this.muted && !this.ctx) {
      this.init();
    }
    this.notify();
  }

  toggleMute() {
    const nextState = !this.muted;
    this.setMuted(nextState);
    if (!nextState) {
      this.playSwitch(true);
    }
    return nextState;
  }

  /**
   * Ultra-subtle micro-haptic tick on hover. Rate-limited to 50ms to prevent chatter.
   */
  playHover() {
    if (this.muted || !this.init()) return;
    const nowMs = performance.now();
    if (nowMs - this.lastHoverTime < 50) return;
    this.lastHoverTime = nowMs;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(1200, now);
      osc.frequency.exponentialRampToValueAtTime(700, now + 0.018);

      gain.gain.setValueAtTime(0.012, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.018);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.02);
    } catch {
      // Graceful fallback
    }
  }

  /**
   * Tactile micro-click for node selection and tab switching.
   */
  playClick() {
    if (this.muted || !this.init()) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(540, now);
      osc.frequency.exponentialRampToValueAtTime(180, now + 0.035);

      gain.gain.setValueAtTime(0.035, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.035);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.04);
    } catch {
      // Graceful fallback
    }
  }

  /**
   * Switch toggle sound (turn on / off).
   */
  playSwitch(isOn = true) {
    if (this.muted || !this.init()) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      if (isOn) {
        osc.frequency.setValueAtTime(440, now);
        osc.frequency.exponentialRampToValueAtTime(880, now + 0.06);
      } else {
        osc.frequency.setValueAtTime(720, now);
        osc.frequency.exponentialRampToValueAtTime(360, now + 0.06);
      }

      gain.gain.setValueAtTime(0.035, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.07);
    } catch {
      // Graceful fallback
    }
  }

  /**
   * Modal or command palette opening sweep.
   */
  playModalOpen() {
    if (this.muted || !this.init()) return;
    try {
      const now = this.ctx.currentTime;
      const chord = [440, 554.37, 659.25]; // A major triad
      chord.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq * 0.9, now + idx * 0.02);
        osc.frequency.exponentialRampToValueAtTime(freq, now + idx * 0.02 + 0.08);

        gain.gain.setValueAtTime(0.025, now + idx * 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.02 + 0.12);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now + idx * 0.02);
        osc.stop(now + idx * 0.02 + 0.13);
      });
    } catch {
      // Graceful fallback
    }
  }

  /**
   * Modal closing sound.
   */
  playModalClose() {
    if (this.muted || !this.init()) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(520, now);
      osc.frequency.exponentialRampToValueAtTime(260, now + 0.07);

      gain.gain.setValueAtTime(0.025, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.07);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.08);
    } catch {
      // Graceful fallback
    }
  }

  /**
   * Keystroke mechanical clack for MiniTerminal and CommandPalette.
   */
  playTerminalKey() {
    if (this.muted || !this.init()) return;
    try {
      const now = this.ctx.currentTime;
      // Slight pitch variance for natural feel
      const jitter = (Math.random() - 0.5) * 80;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(680 + jitter, now);
      osc.frequency.exponentialRampToValueAtTime(220 + jitter, now + 0.028);

      gain.gain.setValueAtTime(0.03, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.028);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.032);
    } catch {
      // Graceful fallback
    }
  }

  /**
   * Terminal Enter / Command Executed sound.
   */
  playTerminalEnter() {
    if (this.muted || !this.init()) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.exponentialRampToValueAtTime(640, now + 0.05);

      gain.gain.setValueAtTime(0.04, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.06);
    } catch {
      // Graceful fallback
    }
  }

  /**
   * Aerodynamic card flip whoosh for 3D Portrait flip.
   */
  playFlip() {
    if (this.muted || !this.init()) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(280, now);
      osc.frequency.exponentialRampToValueAtTime(140, now + 0.12);

      gain.gain.setValueAtTime(0.04, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.12);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.13);
    } catch {
      // Graceful fallback
    }
  }

  /**
   * High-frequency packet hop ping when request travels across nodes.
   */
  playPacketHop(step = 0) {
    if (this.muted || !this.init()) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      // Pentatonic pitch scale for harmonic multi-step progression
      const baseFreqs = [523.25, 587.33, 659.25, 783.99, 880.0, 1046.5];
      const freq = baseFreqs[step % baseFreqs.length] || 660;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);
      osc.frequency.exponentialRampToValueAtTime(freq * 0.85, now + 0.045);

      gain.gain.setValueAtTime(0.035, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.055);
    } catch {
      // Graceful fallback
    }
  }

  /**
   * Harmonic completion chime when request finishes with 200 OK.
   */
  playSuccess() {
    if (this.muted || !this.init()) return;
    try {
      const now = this.ctx.currentTime;
      const notes = [659.25, 830.61, 987.77]; // E major triad
      notes.forEach((freq, i) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + i * 0.04);

        gain.gain.setValueAtTime(0.03, now + i * 0.04);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.04 + 0.14);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now + i * 0.04);
        osc.stop(now + i * 0.04 + 0.15);
      });
    } catch {
      // Graceful fallback
    }
  }

  /**
   * Subdued low-pass warning pulse for 403 / 409 rejection scenarios.
   */
  playWarning() {
    if (this.muted || !this.init()) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.exponentialRampToValueAtTime(110, now + 0.09);

      gain.gain.setValueAtTime(0.05, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.1);
    } catch {
      // Graceful fallback
    }
  }

  /**
   * Crystalline resonant glass chime for zero-gravity crystal collisions.
   * Uses high-register harmonic partials to emulate delicate acoustic crystal.
   */
  playCrystalChime(pitchMultiplier = 1) {
    if (this.muted || !this.init()) return;
    try {
      const now = this.ctx.currentTime;
      // High-register crystalline bell frequencies (Hz)
      const baseFreq = Math.min(1800, Math.max(380, 880 * pitchMultiplier));
      const partials = [1, 2.76, 5.4, 8.1];
      const gains = [0.032, 0.014, 0.007, 0.003];

      partials.forEach((mult, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(baseFreq * mult, now);

        const decay = 0.35 + idx * 0.08;
        gain.gain.setValueAtTime(gains[idx], now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + decay);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + decay + 0.02);
      });
    } catch {
      // Graceful fallback
    }
  }
}

export const soundFx = new SoundSynthesizer();
export const soundManager = soundFx;
