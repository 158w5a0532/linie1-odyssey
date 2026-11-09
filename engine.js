/**
 * GRAMMAR DEFENDER ENGINE
 * 60 FPS Vector Arcade Engine with Web Audio Synth & Adaptive Dynamic Queue.
 */

// --- 1. WEB AUDIO 8-BIT SYNTHESIZER ---
class RetroAudioEngine {
  constructor() {
    this.ctx = null;
    this.enabled = true;
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  playLaser() {
    if (!this.enabled || !this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(880, now);
    osc.frequency.exponentialRampToValueAtTime(180, now + 0.1);
    gain.gain.setValueAtTime(0.18, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.1);
  }

  playHitCorrect() {
    if (!this.enabled || !this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(440, now);
    osc.frequency.exponentialRampToValueAtTime(880, now + 0.16);
    gain.gain.setValueAtTime(0.25, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.16);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.16);
  }

  playHitWrong() {
    if (!this.enabled || !this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(160, now);
    osc.frequency.exponentialRampToValueAtTime(55, now + 0.28);
    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.28);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.28);
  }

  playStageClear() {
    if (!this.enabled || !this.ctx) return;
    const notes = [523.25, 659.25, 783.99, 1046.50];
    notes.forEach((freq, i) => {
      const now = this.ctx.currentTime + (i * 0.1);
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.18);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.18);
    });
  }
}

// --- 2. GAME ENGINE CORE ---
class GameApp {
  constructor() {
    this.canvas = document.getElementById('gameCanvas');
    this.ctx = this.canvas.getContext('2d');
    this.audio = new RetroAudioEngine();

    // Logical Coordinate Space
    this.width = 900;
    this.height = 700;

    // Entities
    this.ship = { x: 450, y: 620, vx: 0, width: 44, height: 34, speed: 8.5 };
    this.lasers = [];
    this.drones = [];
    this.particles = [];
    this.stars = [];

    // State Machine
    this.STATE_TITLE = 'TITLE';
    this.STATE_LEVEL_SELECT = 'SELECT';
    this.STATE_PLAYING = 'PLAYING';
    this.STATE_VICTORY = 'VICTORY';
    this.STATE_GAMEOVER = 'GAMEOVER';
    this.state = this.STATE_TITLE;

    // Level & Adaptive Queue
    this.currentStageKey = 'A1';
    this.currentLevelIndex = 0;
    this.activeLevelData = null;
    this.activeQueue = [];
    this.activeSeedPool = [];
    this.currentQuestion = null;
    this.initialQuota = 20;
    this.completedCount = 0;

    // Player Combat Metrics
    this.shield = 100;
    this.score = 0;
    this.streak = 0;
    this.mistakesCount = 0;

    // Toast Diagnostics
    this.toast = { text: '', color: '#fff', timer: 0 };

    // Input States
    this.keys = {};
    this.touchSlideActive = false;
    this.touchStartX = 0;
    this.shipStartX = 0;

    this.initStars();
    this.setupResize();
    this.setupEventListeners();
    this.loadProgress();

    // Launch RAF Loop
    requestAnimationFrame((t) => this.loop(t));
  }

  initStars() {
    this.stars = [];
    for (let i = 0; i < 90; i++) {
      this.stars.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        speed: 0.4 + Math.random() * 1.8,
        size: 1 + Math.random() * 2
      });
    }
  }

  setupResize() {
    const resize = () => {
      const containerW = window.innerWidth;
      const containerH = window.innerHeight;
      const scale = Math.min(containerW / this.width, containerH / this.height);
      this.canvas.width = this.width;
      this.canvas.height = this.height;
      this.canvas.style.width = `${Math.floor(this.width * scale)}px`;
      this.canvas.style.height = `${Math.floor(this.height * scale)}px`;
    };
    window.addEventListener('resize', resize);
    resize();
  }

  setupEventListeners() {
    // Keyboard handlers
    window.addEventListener('keydown', (e) => {
      this.audio.init();
      this.keys[e.key] = true;
      if (e.key === ' ' && this.state === this.STATE_PLAYING) {
        this.fireLaser();
        e.preventDefault();
      }
      if ((e.key === 'Tab' || e.key === 'Escape') && this.state === this.STATE_PLAYING) {
        this.toggleCodex();
        e.preventDefault();
      }
    });

    window.addEventListener('keyup', (e) => {
      this.keys[e.key] = false;
    });

    // Mobile Virtual Touch
    const trackZone = document.getElementById('touch-track-zone');
    trackZone.addEventListener('touchstart', (e) => {
      this.audio.init();
      this.touchSlideActive = true;
      this.touchStartX = e.touches[0].clientX;
      this.shipStartX = this.ship.x;
      e.preventDefault();
    }, { passive: false });

    trackZone.addEventListener('touchmove', (e) => {
      if (!this.touchSlideActive) return;
      const deltaX = e.touches[0].clientX - this.touchStartX;
      this.ship.x = Math.max(30, Math.min(this.width - 30, this.shipStartX + deltaX * 1.6));
      e.preventDefault();
    }, { passive: false });

    trackZone.addEventListener('touchend', () => {
      this.touchSlideActive = false;
    });

    document.getElementById('btn-fire').addEventListener('touchstart', (e) => {
      this.audio.init();
      if (this.state === this.STATE_PLAYING) this.fireLaser();
      e.preventDefault();
    });

    document.getElementById('btn-codex').addEventListener('click', () => {
      this.audio.init();
      this.toggleCodex();
    });

    document.getElementById('codex-close').addEventListener('click', () => {
      this.toggleCodex(false);
    });

    document.getElementById('btn-resume-mission').addEventListener('click', () => {
      this.toggleCodex(false);
    });

    // Canvas Tap/Click Interface
    this.canvas.addEventListener('pointerdown', (e) => {
      this.audio.init();
      const rect = this.canvas.getBoundingClientRect();
      const scaleX = this.width / rect.width;
      const scaleY = this.height / rect.height;
      const clickX = (e.clientX - rect.left) * scaleX;
      const clickY = (e.clientY - rect.top) * scaleY;

      if (this.state === this.STATE_TITLE) {
        this.state = this.STATE_LEVEL_SELECT;
      } else if (this.state === this.STATE_LEVEL_SELECT) {
        this.handleLevelSelectClick(clickX, clickY);
      } else if (this.state === this.STATE_PLAYING) {
        // Direct tap-to-target drone locking
        this.drones.forEach(d => {
          if (Math.abs(d.x - clickX) < 45 && Math.abs(d.y - clickY) < 30) {
            this.ship.x = d.x;
            this.fireLaser();
          }
        });
      } else if (this.state === this.STATE_VICTORY || this.state === this.STATE_GAMEOVER) {
        this.state = this.STATE_LEVEL_SELECT;
      }
    });
  }

  // --- 3. ADAPTIVE QUEUE LOGIC ---
  startLevel(stageKey, levelIdx) {
    this.currentStageKey = stageKey;
    this.currentLevelIndex = levelIdx;
    const stageData = window.STAGE_A1_DATA; // Plugged into dataset
    this.activeLevelData = stageData.levels[levelIdx];

    // Seed pool clone & initial 20 selection
    this.activeSeedPool = [...this.activeLevelData.questions];
    this.shuffle(this.activeSeedPool);

    this.initialQuota = Math.min(20, this.activeSeedPool.length);
    this.activeQueue = this.activeSeedPool.splice(0, this.initialQuota);

    this.completedCount = 0;
    this.shield = 100;
    this.streak = 0;
    this.mistakesCount = 0;
    this.lasers = [];
    this.drones = [];
    this.particles = [];
    this.ship.x = this.width / 2;

    this.state = this.STATE_PLAYING;
    document.getElementById('touch-controls').classList.remove('hidden');

    this.spawnNextWave();
  }

  spawnNextWave() {
    this.drones = [];
    this.lasers = [];

    if (this.activeQueue.length === 0) {
      this.handleLevelWin();
      return;
    }

    this.currentQuestion = this.activeQueue[0];
    const opts = this.shuffle([...this.currentQuestion.options]);
    const numOpts = opts.length;
    const spacing = this.width / (numOpts + 1);

    opts.forEach((opt, i) => {
      this.drones.push({
        x: spacing * (i + 1),
        y: 130 + (i % 2) * 20,
        text: opt,
        isCorrect: (opt === this.currentQuestion.correct),
        rule: this.currentQuestion.rule,
        tag: this.currentQuestion.tag,
        speed: 1.1,
        width: 100,
        height: 38
      });
    });
  }

  fireLaser() {
    this.lasers.push({
      x: this.ship.x,
      y: this.ship.y - 18,
      speed: 14,
      active: true
    });
    this.audio.playLaser();
  }

  handleAnswerHit(drone) {
    if (drone.isCorrect) {
      // Correct Impact
      this.audio.playHitCorrect();
      this.triggerExplosion(drone.x, drone.y, '#2ecc71', 28);
      this.streak++;
      this.score += 100 * Math.min(this.streak, 5);
      this.completedCount++;
      this.activeQueue.shift();

      this.showToast('PERFECT! +KOMBO x' + this.streak, '#2ecc71', 45);
      setTimeout(() => this.spawnNextWave(), 400);
    } else {
      // Mistake: Apply Hit & Activate Dynamic Extension
      this.audio.playHitWrong();
      this.triggerExplosion(drone.x, drone.y, '#e74c3c', 35);
      this.shield = Math.max(0, this.shield - 15);
      this.streak = 0;
      this.mistakesCount++;

      this.showToast('ACHTUNG: ' + drone.rule, '#f39c12', 120);

      // Dynamically re-queue: Pull a matching reinforcement question from seed bank
      let reinforcement = this.activeSeedPool.find(q => q.tag === drone.tag);
      if (!reinforcement && this.activeSeedPool.length > 0) {
        reinforcement = this.activeSeedPool.pop();
      }
      if (reinforcement) {
        this.activeQueue.push(reinforcement);
      }

      // Check Shield Collapse
      if (this.shield <= 0) {
        this.state = this.STATE_GAMEOVER;
        document.getElementById('touch-controls').classList.add('hidden');
      } else {
        setTimeout(() => this.spawnNextWave(), 1200);
      }
    }
  }

  handleLevelWin() {
    this.audio.playStageClear();
    this.state = this.STATE_VICTORY;
    document.getElementById('touch-controls').classList.add('hidden');

    // Star calculation
    let stars = 1;
    if (this.mistakesCount === 0 && this.shield === 100) stars = 3;
    else if (this.shield >= 50) stars = 2;

    this.saveProgress(this.currentStageKey, this.currentLevelIndex, stars);
  }

  // --- 4. PERSISTENCE & STORAGE ---
  saveProgress(stageKey, levelIdx, stars) {
    const key = `grammar_odyssey_${stageKey}`;
    let data = JSON.parse(localStorage.getItem(key) || '{}');
    const prevStars = data[levelIdx] || 0;
    data[levelIdx] = Math.max(prevStars, stars);
    localStorage.setItem(key, JSON.stringify(data));
  }

  loadProgress() {
    const key = `grammar_odyssey_${this.currentStageKey}`;
    return JSON.parse(localStorage.getItem(key) || '{}');
  }

  // --- 5. RENDER & SIMULATION LOOP ---
  loop() {
    this.update();
    this.render();
    requestAnimationFrame(() => this.loop());
  }

  update() {
    // Parallax Starfield
    this.stars.forEach(s => {
      s.y += s.speed;
      if (s.y > this.height) {
        s.y = 0;
        s.x = Math.random() * this.width;
      }
    });

    // Particle FX
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.life--;
      if (p.life <= 0) this.particles.splice(i, 1);
    }

    if (this.toast.timer > 0) this.toast.timer--;

    if (this.state !== this.STATE_PLAYING) return;

    // Ship Movement (Keyboard)
    if (this.keys['ArrowLeft'] || this.keys['a']) this.ship.x -= this.ship.speed;
    if (this.keys['ArrowRight'] || this.keys['d']) this.ship.x += this.ship.speed;
    this.ship.x = Math.max(30, Math.min(this.width - 30, this.ship.x));

    // Lasers
    for (let i = this.lasers.length - 1; i >= 0; i--) {
      const l = this.lasers[i];
      l.y -= l.speed;

      // Drone Hit Testing
      for (let j = 0; j < this.drones.length; j++) {
        const d = this.drones[j];
        if (Math.abs(l.x - d.x) < d.width / 2 && Math.abs(l.y - d.y) < d.height / 2) {
          this.lasers.splice(i, 1);
          this.handleAnswerHit(d);
          return;
        }
      }

      if (l.y < 80) this.lasers.splice(i, 1);
    }

    // Drones Descend
    this.drones.forEach(d => {
      d.y += d.speed;
      if (d.y > this.height - 110) {
        // Drone reached bottom line
        this.shield = Math.max(0, this.shield - 10);
        this.spawnNextWave();
      }
    });
  }

  render() {
    const ctx = this.ctx;
    ctx.clearRect(0, 0, this.width, this.height);

    // Stars
    ctx.fillStyle = '#64748b';
    this.stars.forEach(s => {
      ctx.fillRect(s.x, s.y, s.size, s.size);
    });

    // Particles
    this.particles.forEach(p => {
      ctx.fillStyle = p.color;
      ctx.fillRect(p.x, p.y, p.size, p.size);
    });

    if (this.state === this.STATE_TITLE) {
      this.renderTitle(ctx);
    } else if (this.state === this.STATE_LEVEL_SELECT) {
      this.renderLevelSelect(ctx);
    } else if (this.state === this.STATE_PLAYING) {
      this.renderCombat(ctx);
    } else if (this.state === this.STATE_VICTORY) {
      this.renderVictory(ctx);
    } else if (this.state === this.STATE_GAMEOVER) {
      this.renderGameOver(ctx);
    }
  }

  renderTitle(ctx) {
    ctx.textAlign = 'center';
    ctx.fillStyle = '#38bdf8';
    ctx.font = 'bold 36px Consolas, monospace';
    ctx.fillText('GRAMMAR DEFENDER', this.width / 2, 230);

    ctx.fillStyle = '#94a3b8';
    ctx.font = '18px Consolas, monospace';
    ctx.fillText('LINIE 1: ARCADE ODYSSEY (A1 - B2)', this.width / 2, 275);

    ctx.fillStyle = '#22c55e';
    ctx.font = 'bold 20px Consolas, monospace';
    ctx.fillText('[ TAP OR CLICK TO START MISSION ]', this.width / 2, 440);
  }

  renderLevelSelect(ctx) {
    const saved = this.loadProgress();
    const levels = window.STAGE_A1_DATA.levels;

    ctx.textAlign = 'center';
    ctx.fillStyle = '#38bdf8';
    ctx.font = 'bold 26px Consolas, monospace';
    ctx.fillText('SELECT A1 GRAMMAR SECTOR', this.width / 2, 60);

    ctx.textAlign = 'left';
    const startY = 110;
    const itemHeight = 56;
    const visibleCount = 9;

    for (let i = 0; i < Math.min(levels.length, visibleCount); i++) {
      const lvl = levels[i];
      const y = startY + i * itemHeight;
      const stars = saved[i] || 0;

      // Card Backing
      ctx.fillStyle = '#111827';
      ctx.strokeStyle = '#1e293b';
      ctx.fillRect(80, y, this.width - 160, 48);
      ctx.strokeRect(80, y, this.width - 160, 48);

      // Labels
      ctx.fillStyle = '#f8fafc';
      ctx.font = 'bold 15px Consolas, monospace';
      ctx.fillText(`${lvl.id} : ${lvl.title} (${lvl.chapter})`, 100, y + 29);

      // Star Badges
      let starText = '☆☆☆';
      if (stars === 3) starText = '★★★';
      else if (stars === 2) starText = '★★☆';
      else if (stars === 1) starText = '★☆☆';

      ctx.fillStyle = stars > 0 ? '#facc15' : '#475569';
      ctx.font = '16px Consolas, monospace';
      ctx.fillText(starText, this.width - 180, y + 29);
    }
  }

  renderCombat(ctx) {
    // HUD Header
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, this.width, 95);
    ctx.strokeStyle = '#1e293b';
    ctx.strokeRect(0, 0, this.width, 95);

    // Level Tag & Streak
    ctx.fillStyle = '#38bdf8';
    ctx.font = 'bold 14px Consolas, monospace';
    ctx.textAlign = 'left';
    ctx.fillText(`${this.activeLevelData.id}: ${this.activeLevelData.title}`, 20, 30);

    ctx.fillStyle = '#facc15';
    ctx.fillText(`KOMBO: x${this.streak} 🔥  SCORE: ${this.score}`, 20, 52);

    // Shields Meter
    ctx.fillStyle = '#94a3b8';
    ctx.fillText('SHIELDS', this.width - 240, 30);
    ctx.fillStyle = '#334155';
    ctx.fillRect(this.width - 160, 18, 140, 14);
    ctx.fillStyle = this.shield > 40 ? '#22c55e' : '#ef4444';
    ctx.fillRect(this.width - 160, 18, (this.shield / 100) * 140, 14);

    // Active Mission Sentence
    ctx.textAlign = 'center';
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 20px Consolas, monospace';
    ctx.fillText(this.currentQuestion.sentence, this.width / 2, 80);

    // Render Drones
    this.drones.forEach(d => {
      ctx.fillStyle = '#1e293b';
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 2;
      ctx.fillRect(d.x - d.width / 2, d.y - d.height / 2, d.width, d.height);
      ctx.strokeRect(d.x - d.width / 2, d.y - d.height / 2, d.width, d.height);

      ctx.fillStyle = '#f8fafc';
      ctx.font = 'bold 16px Consolas, monospace';
      ctx.fillText(d.text, d.x, d.y + 6);
    });

    // Render Lasers
    ctx.fillStyle = '#38bdf8';
    this.lasers.forEach(l => {
      ctx.fillRect(l.x - 2, l.y, 4, 16);
    });

    // Render Defender Ship
    ctx.fillStyle = '#38bdf8';
    ctx.beginPath();
    ctx.moveTo(this.ship.x, this.ship.y - 18);
    ctx.lineTo(this.ship.x + 22, this.ship.y + 14);
    ctx.lineTo(this.ship.x, this.ship.y + 6);
    ctx.lineTo(this.ship.x - 22, this.ship.y + 14);
    ctx.closePath();
    ctx.fill();

    // Diagnostics Toast
    if (this.toast.timer > 0) {
      ctx.fillStyle = this.toast.color;
      ctx.font = 'bold 15px Consolas, monospace';
      ctx.fillText(this.toast.text, this.width / 2, 580);
    }
  }

  renderVictory(ctx) {
    ctx.textAlign = 'center';
    ctx.fillStyle = '#22c55e';
    ctx.font = 'bold 32px Consolas, monospace';
    ctx.fillText('SECTOR CLEARED!', this.width / 2, 260);

    ctx.fillStyle = '#f8fafc';
    ctx.font = '18px Consolas, monospace';
    ctx.fillText(`TOTAL SCORE: ${this.score}`, this.width / 2, 310);
    ctx.fillText('[ TAP TO RETURN TO SECTOR MAP ]', this.width / 2, 420);
  }

  renderGameOver(ctx) {
    ctx.textAlign = 'center';
    ctx.fillStyle = '#ef4444';
    ctx.font = 'bold 32px Consolas, monospace';
    ctx.fillText('SHIELDS COLLAPSED', this.width / 2, 260);

    ctx.fillStyle = '#94a3b8';
    ctx.font = '18px Consolas, monospace';
    ctx.fillText('SECTOR DEFENSE FAILED', this.width / 2, 310);
    ctx.fillText('[ TAP TO REATTEMPT LEVEL ]', this.width / 2, 420);
  }

  handleLevelSelectClick(clickX, clickY) {
    const startY = 110;
    const itemHeight = 56;
    for (let i = 0; i < 9; i++) {
      const y = startY + i * itemHeight;
      if (clickX >= 80 && clickX <= this.width - 80 && clickY >= y && clickY <= y + 48) {
        this.startLevel('A1', i);
        break;
      }
    }
  }

  toggleCodex(forceOpen) {
    const modal = document.getElementById('codex-modal');
    const isClosed = modal.classList.contains('hidden');
    const open = forceOpen !== undefined ? forceOpen : isClosed;

    if (open && this.activeLevelData) {
      document.getElementById('codex-level-tag').innerText = this.activeLevelData.id;
      document.getElementById('codex-title').innerText = this.activeLevelData.title;
      document.getElementById('codex-rule-box').innerText = this.activeLevelData.ruleSummary;
      document.getElementById('codex-example-box').innerText = 'Beispiel: ' + this.activeLevelData.example;
      modal.classList.remove('hidden');
    } else {
      modal.classList.add('hidden');
    }
  }

  triggerExplosion(x, y, color, count) {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 1.5 + Math.random() * 4.5;
      this.particles.push({
        x: x, y: y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 20 + Math.random() * 20,
        size: 2 + Math.random() * 3,
        color: color
      });
    }
  }

  showToast(text, color, duration) {
    this.toast.text = text;
    this.toast.color = color;
    this.toast.timer = duration;
  }

  shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }
}

// Instantiate on Load
window.addEventListener('load', () => {
  new GameApp();
});
