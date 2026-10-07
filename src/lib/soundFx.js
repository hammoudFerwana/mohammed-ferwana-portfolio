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

  isMuted() {
    return this.muted;
  }

  setMuted(muted) {
    this.muted = Boolean(muted);
    if (!this.muted && !this.ctx) {
      this.init();
    }
  }

  toggleMute() {
    this.setMuted(!this.muted);
    return this.muted;
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
      osc.frequency.setValueAtTime(480, now);
      osc.frequency.exponentialRampToValueAtTime(160, now + 0.035);

      gain.gain.setValueAtTime(0.04, now);
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
}

export const soundFx = new SoundSynthesizer();
export const soundManager = soundFx;
