/**
 * Pure Web Audio API Generative Ambient Soundscape Engine.
 * 
 * 100% Procedural & Algorithmic: Zero audio files or external assets (0 MB footprint).
 * Generates continuous, non-repeating psychoacoustic soundscapes designed for
 * deep software engineering focus, flow state, and sensory immersion.
 * 
 * Presets:
 * 1. Deep Space Drone (Cosmic Warmth & Sub-Bass Resonant Frequencies)
 * 2. Lo-Fi Vinyl Rain (Procedural Filtered Rain & Warm Chord Pad)
 * 3. Cybernetic Deck (40Hz Gamma Binaural Beats for High-Focus Engineering)
 */

export const AMBIENT_PRESETS = {
  deep_space: {
    id: 'deep_space',
    name: 'Cosmic Drone',
    subtitle: 'Deep Space Sub-Harmonics & Void Drift',
    color: '#8b5cf6', // Violet
    tag: '55Hz · SUB-BASS',
    description: 'Analog-modeled warm sub-oscillators with slow-evolving LFO filter sweeps.',
  },
  lofi_rain: {
    id: 'lofi_rain',
    name: 'Zen Rain Pad',
    subtitle: 'Procedural Atmospheric Rain & Warm Keys',
    color: '#06b6d4', // Cyan
    tag: 'ATMOSPHERE · RELAX',
    description: 'Algorithmic pink noise rain texture layered with velvet minor chords.',
  },
  cyber_deck: {
    id: 'cyber_deck',
    name: 'Cyber Deck 40Hz',
    subtitle: 'Gamma Binaural Beats for Flow State',
    color: '#10b981', // Emerald
    tag: '40Hz · FOCUS WAVE',
    description: 'Neuroacoustic 40Hz gamma frequency difference to stimulate cognitive clarity.',
  },
};

class AmbientSoundscapeEngine {
  constructor() {
    this.ctx = null;
    this.masterGain = null;
    this.analyser = null;
    this.isPlaying = false;
    this.currentPreset = 'deep_space';
    this.volume = 0.55; // Default comfortable ambient listening level
    this.activeNodes = [];
    this.listeners = new Set();
    this.scrollModulation = 0; // 0 (top) to 1 (bottom)

    // Load persisted settings
    if (typeof window !== 'undefined') {
      try {
        const savedVolume = localStorage.getItem('mf_ambient_volume');
        if (savedVolume !== null) {
          this.volume = Math.max(0, Math.min(1, parseFloat(savedVolume)));
        }
        const savedPreset = localStorage.getItem('mf_ambient_preset');
        if (savedPreset && AMBIENT_PRESETS[savedPreset]) {
          this.currentPreset = savedPreset;
        }
      } catch {
        // Storage unavailable
      }
    }
  }

  init() {
    if (typeof window === 'undefined') return false;
    try {
      if (!this.ctx) {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (!AudioCtx) return false;
        this.ctx = new AudioCtx();
      }

      if (this.ctx.state === 'suspended') {
        this.ctx.resume();
      }

      if (!this.masterGain) {
        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.setValueAtTime(0, this.ctx.currentTime);

        // Analyser for real-time oscilloscope / waveform ribbon
        this.analyser = this.ctx.createAnalyser();
        this.analyser.fftSize = 64;
        this.analyser.smoothingTimeConstant = 0.85;

        this.masterGain.connect(this.analyser);
        this.analyser.connect(this.ctx.destination);
      }

      return true;
    } catch {
      return false;
    }
  }

  subscribe(listener) {
    this.listeners.add(listener);
    // Initial emit
    listener(this.getState());
    return () => this.listeners.delete(listener);
  }

  notify() {
    const state = this.getState();
    this.listeners.forEach((fn) => {
      try {
        fn(state);
      } catch {
        // Safe fallback
      }
    });
  }

  getState() {
    return {
      isPlaying: this.isPlaying,
      currentPreset: this.currentPreset,
      volume: this.volume,
      analyser: this.analyser,
    };
  }

  setVolume(vol) {
    this.volume = Math.max(0, Math.min(1, vol));
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('mf_ambient_volume', String(this.volume));
      } catch {
        // Ignore
      }
    }

    if (this.masterGain && this.ctx && this.isPlaying) {
      const now = this.ctx.currentTime;
      this.masterGain.gain.cancelScheduledValues(now);
      this.masterGain.gain.linearRampToValueAtTime(this.volume * 0.45, now + 0.1);
    }
    this.notify();
  }

  setPreset(presetId) {
    if (!AMBIENT_PRESETS[presetId] || presetId === this.currentPreset) return;
    this.currentPreset = presetId;
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('mf_ambient_preset', presetId);
      } catch {
        // Ignore
      }
    }

    if (this.isPlaying) {
      // Cross-fade seamlessly to new preset
      this.stopActiveNodes(0.4);
      setTimeout(() => {
        if (this.isPlaying) {
          this.buildPresetNodes(this.currentPreset);
        }
      }, 420);
    }
    this.notify();
  }

  toggle() {
    if (this.isPlaying) {
      this.pause();
    } else {
      this.play();
    }
  }

  play() {
    if (!this.init()) return;
    if (this.isPlaying) return;

    this.isPlaying = true;
    this.buildPresetNodes(this.currentPreset);

    // Smooth cinematic fade-in over 1.4 seconds (click-free)
    const now = this.ctx.currentTime;
    this.masterGain.gain.cancelScheduledValues(now);
    this.masterGain.gain.setValueAtTime(0.0001, now);
    this.masterGain.gain.linearRampToValueAtTime(this.volume * 0.45, now + 1.4);

    this.notify();
  }

  pause() {
    if (!this.isPlaying) return;
    this.isPlaying = false;

    if (this.masterGain && this.ctx) {
      const now = this.ctx.currentTime;
      this.masterGain.gain.cancelScheduledValues(now);
      this.masterGain.gain.linearRampToValueAtTime(0.0001, now + 0.8);

      setTimeout(() => {
        this.stopActiveNodes();
      }, 850);
    } else {
      this.stopActiveNodes();
    }

    this.notify();
  }

  stopActiveNodes(fadeDuration = 0.2) {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;

    this.activeNodes.forEach(({ osc, gain, lfo, timerId }) => {
      if (timerId) clearInterval(timerId);
      try {
        if (gain) {
          gain.gain.cancelScheduledValues(now);
          gain.gain.linearRampToValueAtTime(0.0001, now + fadeDuration);
        }
        if (osc) {
          setTimeout(() => {
            try {
              osc.stop();
              osc.disconnect();
            } catch {
              // Node already stopped
            }
          }, fadeDuration * 1000 + 50);
        }
        if (lfo) {
          try {
            lfo.stop();
            lfo.disconnect();
          } catch {
            // Safe fallback
          }
        }
      } catch {
        // Safe cleanup
      }
    });

    this.activeNodes = [];
  }

  // Adaptive Modulation reacting to site scroll depth
  setScrollDepth(ratio) {
    this.scrollModulation = Math.max(0, Math.min(1, ratio));
    if (!this.ctx || !this.isPlaying) return;

    const now = this.ctx.currentTime;
    // Modulate filter cutoff of primary nodes based on scroll
    this.activeNodes.forEach(({ filter, baseCutoff }) => {
      if (filter && baseCutoff) {
        const modulated = baseCutoff + this.scrollModulation * 220;
        filter.frequency.setTargetAtTime(modulated, now, 0.25);
      }
    });
  }

  // ==========================================
  // PROCEDURAL PRESET SYNTHESIS ENGINES
  // ==========================================

  buildPresetNodes(presetId) {
    if (!this.ctx || !this.masterGain) return;

    switch (presetId) {
      case 'deep_space':
        this.buildDeepSpacePreset();
        break;
      case 'lofi_rain':
        this.buildLofiRainPreset();
        break;
      case 'cyber_deck':
        this.buildCyberDeckPreset();
        break;
      default:
        this.buildDeepSpacePreset();
    }
  }

  /**
   * 1. Cosmic Deep Space Drone
   * Layered detuned sub-bass sine & triangle waves passing through warm resonant lowpass.
   */
  buildDeepSpacePreset() {
    const now = this.ctx.currentTime;

    // Sub-bass root (A1 = 55Hz) with subtle analog phase drift
    const freqs = [54.8, 55.2, 110.0, 164.81]; // Root, detune, octave, fifth
    const gains = [0.24, 0.22, 0.12, 0.05];

    freqs.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      osc.type = idx === 0 ? 'sine' : (idx === 2 ? 'triangle' : 'sine');
      osc.frequency.setValueAtTime(freq, now);

      // Warm analog lowpass filter
      const baseCutoff = 190 + idx * 45;
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(baseCutoff, now);
      filter.Q.setValueAtTime(2.2, now);

      // Ultra-slow breathing LFO on filter cutoff
      const lfo = this.ctx.createOscillator();
      const lfoGain = this.ctx.createGain();
      lfo.frequency.setValueAtTime(0.04 + idx * 0.015, now); // ~20 second cycle
      lfoGain.gain.setValueAtTime(60, now);

      lfo.connect(lfoGain);
      lfoGain.connect(filter.frequency);
      lfo.start(now);

      gain.gain.setValueAtTime(gains[idx], now);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain);

      osc.start(now);

      this.activeNodes.push({ osc, gain, filter, baseCutoff, lfo });
    });
  }

  /**
   * 2. Zen Lo-Fi Rain & Velvet Chord Pad
   * Algorithmic pink noise buffer for soft raindrops + warm suspended chord.
   */
  buildLofiRainPreset() {
    const now = this.ctx.currentTime;

    // A. Procedural Atmospheric Rain Texture (Filtered Pink Noise)
    const bufferSize = this.ctx.sampleRate * 2.5;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;

    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      output[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.08;
      b6 = white * 0.115926;
    }

    const noiseSource = this.ctx.createBufferSource();
    noiseSource.buffer = noiseBuffer;
    noiseSource.loop = true;

    const rainFilter = this.ctx.createBiquadFilter();
    rainFilter.type = 'bandpass';
    rainFilter.frequency.setValueAtTime(1150, now);
    rainFilter.Q.setValueAtTime(0.85, now);

    const rainGain = this.ctx.createGain();
    rainGain.gain.setValueAtTime(0.09, now);

    noiseSource.connect(rainFilter);
    rainFilter.connect(rainGain);
    rainGain.connect(this.masterGain);
    noiseSource.start(now);

    this.activeNodes.push({ osc: noiseSource, gain: rainGain, filter: rainFilter, baseCutoff: 1150 });

    // B. Velvet Minor 9th Ambient Chord Pad (Fmaj7 / Am9 feel)
    const chord = [130.81, 164.81, 196.00, 246.94]; // C3, E3, G3, B3
    chord.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now);

      filter.type = 'lowpass';
      const baseCutoff = 360 + idx * 30;
      filter.frequency.setValueAtTime(baseCutoff, now);

      gain.gain.setValueAtTime(0.045, now);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain);
      osc.start(now);

      this.activeNodes.push({ osc, gain, filter, baseCutoff });
    });
  }

  /**
   * 3. Cybernetic Deck 40Hz Gamma Focus
   * Neuroacoustic 40Hz beat difference between channels to stimulate working memory and problem solving.
   */
  buildCyberDeckPreset() {
    const now = this.ctx.currentTime;

    // Carrier frequency: 196Hz (G3)
    // Left ear: 176Hz | Right ear: 216Hz -> Difference = 40Hz Gamma Wave
    const carrier = 180;
    const diff = 40; // 40 Hz Gamma Focus

    // Left Channel
    const oscLeft = this.ctx.createOscillator();
    const gainLeft = this.ctx.createGain();
    const pannerLeft = this.ctx.createStereoPanner ? this.ctx.createStereoPanner() : null;

    oscLeft.type = 'sine';
    oscLeft.frequency.setValueAtTime(carrier, now);
    gainLeft.gain.setValueAtTime(0.18, now);

    if (pannerLeft) {
      pannerLeft.pan.setValueAtTime(-0.85, now);
      oscLeft.connect(gainLeft);
      gainLeft.connect(pannerLeft);
      pannerLeft.connect(this.masterGain);
    } else {
      oscLeft.connect(gainLeft);
      gainLeft.connect(this.masterGain);
    }
    oscLeft.start(now);
    this.activeNodes.push({ osc: oscLeft, gain: gainLeft });

    // Right Channel
    const oscRight = this.ctx.createOscillator();
    const gainRight = this.ctx.createGain();
    const pannerRight = this.ctx.createStereoPanner ? this.ctx.createStereoPanner() : null;

    oscRight.type = 'sine';
    oscRight.frequency.setValueAtTime(carrier + diff, now);
    gainRight.gain.setValueAtTime(0.18, now);

    if (pannerRight) {
      pannerRight.pan.setValueAtTime(0.85, now);
      oscRight.connect(gainRight);
      gainRight.connect(pannerRight);
      pannerRight.connect(this.masterGain);
    } else {
      oscRight.connect(gainRight);
      gainRight.connect(this.masterGain);
    }
    oscRight.start(now);
    this.activeNodes.push({ osc: oscRight, gain: gainRight });

    // Deep server-room quantum crystal hum (60Hz ground hum)
    const humOsc = this.ctx.createOscillator();
    const humGain = this.ctx.createGain();
    const humFilter = this.ctx.createBiquadFilter();

    humOsc.type = 'sawtooth';
    humOsc.frequency.setValueAtTime(60, now);

    humFilter.type = 'lowpass';
    humFilter.frequency.setValueAtTime(140, now);

    humGain.gain.setValueAtTime(0.04, now);

    humOsc.connect(humFilter);
    humFilter.connect(humGain);
    humGain.connect(this.masterGain);
    humOsc.start(now);

    this.activeNodes.push({ osc: humOsc, gain: humGain, filter: humFilter, baseCutoff: 140 });
  }
}

export const ambientSoundscape = new AmbientSoundscapeEngine();
