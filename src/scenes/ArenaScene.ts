import Phaser from 'phaser';

type Vec2 = { x: number; y: number };
type EnemyType = 'walker' | 'runner' | 'brute' | 'gunner' | 'bossTitan' | 'bossGunner';
type WavePhase = 'countdown' | 'bossWarning' | 'active' | 'complete' | 'upgrade';
type BossMode = 'none' | 'chargeWindup' | 'charge' | 'slam' | 'ring';
type SpecialWaveType = 'none' | 'toxic' | 'night' | 'elite' | 'gunnerRaid' | 'burning' | 'fog';
type WeaponId = 'pistol' | 'rapidPistol' | 'heavyPistol' | 'burstPistol' | 'shotgun' | 'smg' | 'burstRifle' | 'flamethrower' | 'dualPistols' | 'launcher' | 'railgun' | 'plasma' | 'lightningCannon' | 'minigun';
type UpgradeId =
  | 'damage'
  | 'damageBig'
  | 'fireRate'
  | 'critChance'
  | 'critDamage'
  | 'bulletSpeed'
  | 'projectileSize'
  | 'pierce'
  | 'doubleShot'
  | 'ricochet'
  | 'spread'
  | 'fire'
  | 'poison'
  | 'freeze'
  | 'maxHp'
  | 'shield'
  | 'lifesteal'
  | 'damageReduction'
  | 'invuln'
  | 'dodge'
  | 'orbit'
  | 'drone'
  | 'turret'
  | 'lightningAura'
  | 'fireAura'
  | 'magnet'
  | 'chain'
  | 'explosive'
  | 'speed'
  | 'regen'
  | 'pellets'
  | 'knockback'
  | 'sprayControl'
  | 'droneFireRate'
  | 'orbitSpeed'
  | 'lightningChain'
  | 'poisonSpread'
  | 'critBurn'
  | 'deathBurst'
  | 'orbitSize'
  | 'unlockShotgun'
  | 'unlockSmg'
  | 'unlockBurstRifle'
  | 'unlockFlamethrower'
  | 'unlockDualPistols'
  | 'unlockLauncher'
  | 'unlockRailgun'
  | 'unlockPlasma'
  | 'unlockLightningCannon'
  | 'unlockMinigun'
  | 'evolvePistol'
  | 'evolveShotgun'
  | 'evolveSmg'
  | 'evolveFlamethrower'
  | 'evolveRailgun'
  | 'evolveLightningCannon';

type UpgradeRarity = 'Common' | 'Rare' | 'Epic' | 'Legendary';

type Enemy = {
  id: number;
  type: EnemyType;
  pos: Vec2;
  vel: Vec2;
  hp: number;
  maxHp: number;
  speed: number;
  damage: number;
  radius: number;
  hitFlash: number;
  burn: number;
  poison: number;
  freeze: number;
  attackCooldown: number;
  aimTimer: number;
  burstShots: number;
  burstTimer: number;
  strafeDir: number;
  bossMode: BossMode;
  rage: boolean;
  bossTier: number;
  chargeAngle: number;
  chargeHit: boolean;
  ringCooldown: number;
  body: Phaser.GameObjects.Container;
};

type XpGem = {
  pos: Vec2;
  value: number;
  age: number;
  body: Phaser.GameObjects.Container;
};

type CoinDrop = {
  pos: Vec2;
  value: number;
  age: number;
  body: Phaser.GameObjects.Container;
};

type Bullet = {
  pos: Vec2;
  vel: Vec2;
  damage: number;
  radius: number;
  life: number;
  fire: number;
  poison: number;
  freeze: number;
  pierce: number;
  ricochet: number;
  explosive: boolean;
  chain: boolean;
  knockback: number;
  owner: 'player' | 'secondary';
  body: Phaser.GameObjects.Container;
};

type EnemyProjectile = {
  pos: Vec2;
  vel: Vec2;
  damage: number;
  radius: number;
  life: number;
  body: Phaser.GameObjects.Container;
};

type GroundHazard = {
  type: 'toxic' | 'fire';
  pos: Vec2;
  radius: number;
  damage: number;
  life: number;
  tick: number;
  body: Phaser.GameObjects.Container;
};

type FogPatch = {
  body: Phaser.GameObjects.Container;
  origin: Vec2;
  drift: Vec2;
  phase: number;
  pulse: number;
  baseAlpha: number;
  density: number;
};

type Upgrade = {
  id: UpgradeId;
  title: string;
  desc: string;
  icon: string;
  rarity: UpgradeRarity;
};

type WeaponProfile = {
  id: WeaponId;
  title: string;
  tagline: string;
  desc: string;
  icon: string;
  damage: number;
  fireRate: number;
  bulletSpeed: number;
  pellets: number;
  spreadAngle: number;
  inaccuracy: number;
  projectileSize: number;
  knockback: number;
  shake: number;
  color: number;
  tier: 'Early' | 'Mid' | 'Late';
};

type EquippedWeapon = {
  id: WeaponId;
  cooldown: number;
  evolved: boolean;
  level: number;
};

const WEAPONS: Record<WeaponId, WeaponProfile> = {
  pistol: {
    id: 'pistol',
    title: 'Balanced Pistol',
    tagline: 'Balanced precision',
    desc: 'Accurate medium-rate shots with strong scaling into crits, ricochet, and elemental rounds.',
    icon: 'PST',
    damage: 22,
    fireRate: 4.8,
    bulletSpeed: 1.08,
    pellets: 1,
    spreadAngle: 0,
    inaccuracy: 0.015,
    projectileSize: 1,
    knockback: 1,
    shake: 0.002,
    color: 0xfff4a3,
    tier: 'Early',
  },
  rapidPistol: {
    id: 'rapidPistol',
    title: 'Rapid Pistol',
    tagline: 'Fast light shots',
    desc: 'Lower damage with a quick rhythm for early kiting and on-hit builds.',
    icon: 'RPD',
    damage: 15,
    fireRate: 4.25,
    bulletSpeed: 1.05,
    pellets: 1,
    spreadAngle: 0,
    inaccuracy: 0.04,
    projectileSize: 0.86,
    knockback: 0.72,
    shake: 0.0015,
    color: 0xb8f7ff,
    tier: 'Early',
  },
  heavyPistol: {
    id: 'heavyPistol',
    title: 'Heavy Pistol',
    tagline: 'Slow strong shots',
    desc: 'Slower, heavier rounds with better knockback and punchy single-target damage.',
    icon: 'HVY',
    damage: 34,
    fireRate: 2.65,
    bulletSpeed: 1.16,
    pellets: 1,
    spreadAngle: 0,
    inaccuracy: 0.018,
    projectileSize: 1.15,
    knockback: 1.45,
    shake: 0.0035,
    color: 0xffc45c,
    tier: 'Early',
  },
  burstPistol: {
    id: 'burstPistol',
    title: 'Burst Pistol',
    tagline: 'Small triple burst',
    desc: 'Fires compact three-shot bursts with modest damage and good upgrade scaling.',
    icon: 'BST',
    damage: 11,
    fireRate: 3.7,
    bulletSpeed: 1.08,
    pellets: 3,
    spreadAngle: 0.07,
    inaccuracy: 0.025,
    projectileSize: 0.78,
    knockback: 0.62,
    shake: 0.0018,
    color: 0xfff4a3,
    tier: 'Early',
  },
  shotgun: {
    id: 'shotgun',
    title: 'Shotgun',
    tagline: 'Close-range crowd shove',
    desc: 'Slow blasts fire pellet spread, hit hard, and push enemies back to open breathing room.',
    icon: 'SHG',
    damage: 13,
    fireRate: 1.55,
    bulletSpeed: 0.92,
    pellets: 6,
    spreadAngle: 0.52,
    inaccuracy: 0.06,
    projectileSize: 0.92,
    knockback: 1.9,
    shake: 0.006,
    color: 0xffc45c,
    tier: 'Early',
  },
  smg: {
    id: 'smg',
    title: 'SMG',
    tagline: 'Rapid chaotic spray',
    desc: 'Very fast low-damage fire with messy recoil, perfect for poison, freeze, and proc builds.',
    icon: 'SMG',
    damage: 8.5,
    fireRate: 11.5,
    bulletSpeed: 1,
    pellets: 1,
    spreadAngle: 0,
    inaccuracy: 0.19,
    projectileSize: 0.78,
    knockback: 0.68,
    shake: 0.0015,
    color: 0xb8f7ff,
    tier: 'Early',
  },
  burstRifle: {
    id: 'burstRifle',
    title: 'Burst Rifle',
    tagline: 'Controlled triple bursts',
    desc: 'Fires tight bursts that reward aim and stack on-hit upgrades quickly.',
    icon: 'BR',
    damage: 14,
    fireRate: 3.1,
    bulletSpeed: 1.22,
    pellets: 3,
    spreadAngle: 0.08,
    inaccuracy: 0.025,
    projectileSize: 0.88,
    knockback: 0.8,
    shake: 0.002,
    color: 0xd8e3ef,
    tier: 'Mid',
  },
  flamethrower: {
    id: 'flamethrower',
    title: 'Flamethrower',
    tagline: 'Short range fire cone',
    desc: 'Sprays burning projectiles that melt clustered enemies up close.',
    icon: 'FLM',
    damage: 5.5,
    fireRate: 8.5,
    bulletSpeed: 0.62,
    pellets: 4,
    spreadAngle: 0.42,
    inaccuracy: 0.08,
    projectileSize: 1.05,
    knockback: 0.28,
    shake: 0.001,
    color: 0xff7b32,
    tier: 'Mid',
  },
  dualPistols: {
    id: 'dualPistols',
    title: 'Dual Pistols',
    tagline: 'Reliable paired shots',
    desc: 'Two accurate side-by-side shots with excellent crit and ricochet scaling.',
    icon: 'DUO',
    damage: 16,
    fireRate: 5.8,
    bulletSpeed: 1.12,
    pellets: 2,
    spreadAngle: 0.1,
    inaccuracy: 0.025,
    projectileSize: 0.88,
    knockback: 0.85,
    shake: 0.002,
    color: 0xfff4a3,
    tier: 'Mid',
  },
  launcher: {
    id: 'launcher',
    title: 'Explosive Launcher',
    tagline: 'Slow heavy blasts',
    desc: 'Lobs heavy explosive rounds that turn dense packs into openings.',
    icon: 'RPG',
    damage: 30,
    fireRate: 0.86,
    bulletSpeed: 0.78,
    pellets: 1,
    spreadAngle: 0,
    inaccuracy: 0.04,
    projectileSize: 1.25,
    knockback: 1.45,
    shake: 0.006,
    color: 0xff6b45,
    tier: 'Mid',
  },
  railgun: {
    id: 'railgun',
    title: 'Railgun',
    tagline: 'Piercing late-game beam',
    desc: 'Huge piercing shots that punch through lanes of enemies.',
    icon: 'RAIL',
    damage: 52,
    fireRate: 0.72,
    bulletSpeed: 1.85,
    pellets: 1,
    spreadAngle: 0,
    inaccuracy: 0,
    projectileSize: 1.15,
    knockback: 2.1,
    shake: 0.007,
    color: 0x96f7ff,
    tier: 'Late',
  },
  plasma: {
    id: 'plasma',
    title: 'Plasma Weapon',
    tagline: 'Growing energy shots',
    desc: 'Fires large energy bolts that hit hard and splash through crowds.',
    icon: 'PLS',
    damage: 25,
    fireRate: 2.4,
    bulletSpeed: 0.9,
    pellets: 1,
    spreadAngle: 0,
    inaccuracy: 0.05,
    projectileSize: 1.65,
    knockback: 1.05,
    shake: 0.004,
    color: 0xb36bff,
    tier: 'Late',
  },
  lightningCannon: {
    id: 'lightningCannon',
    title: 'Lightning Cannon',
    tagline: 'Chaining burst damage',
    desc: 'Fires electric shots that jump through nearby enemies.',
    icon: 'LCN',
    damage: 20,
    fireRate: 2.6,
    bulletSpeed: 1.32,
    pellets: 1,
    spreadAngle: 0,
    inaccuracy: 0.035,
    projectileSize: 1,
    knockback: 0.8,
    shake: 0.003,
    color: 0x96f7ff,
    tier: 'Late',
  },
  minigun: {
    id: 'minigun',
    title: 'Minigun',
    tagline: 'Overwhelming bullet storm',
    desc: 'Very high fire rate with enough spread to paint the arena.',
    icon: 'MINI',
    damage: 7.5,
    fireRate: 15,
    bulletSpeed: 1,
    pellets: 1,
    spreadAngle: 0,
    inaccuracy: 0.13,
    projectileSize: 0.72,
    knockback: 0.48,
    shake: 0.0015,
    color: 0xd8e3ef,
    tier: 'Late',
  },
};

const STARTING_WEAPONS: WeaponId[] = ['pistol', 'rapidPistol', 'heavyPistol'];
const SPECIAL_WAVE_META: Record<SpecialWaveType, { title: string; label: string; color: string; bonus: number }> = {
  none: { title: '', label: '', color: '#ffd166', bonus: 0 },
  toxic: { title: 'TOXIC WAVE', label: 'CONTAMINATED', color: '#8aff6a', bonus: 14 },
  night: { title: 'NIGHT SWARM', label: 'DARK HORDE', color: '#9aa7ff', bonus: 12 },
  elite: { title: 'ELITE HUNT', label: 'ELITES', color: '#ffd166', bonus: 22 },
  gunnerRaid: { title: 'GUNNER RAID', label: 'RANGED RAID', color: '#ff9f6a', bonus: 18 },
  burning: { title: 'BURNING HORDE', label: 'FIRESTORM', color: '#ff6b45', bonus: 16 },
  fog: { title: 'FOG EVENT', label: 'LOW VISIBILITY', color: '#c9d1d3', bonus: 12 },
};
const SHOP_WEAPONS: WeaponId[] = ['shotgun', 'smg', 'burstRifle', 'flamethrower', 'dualPistols', 'launcher', 'railgun', 'plasma', 'lightningCannon', 'minigun'];

class DynamicSoundtrack {
  private ctx: AudioContext | null = null;
  private master!: GainNode;
  private drone!: GainNode;
  private bass!: GainNode;
  private drums!: GainNode;
  private lead!: GainNode;
  private droneOsc: OscillatorNode[] = [];
  private scheduler?: number;
  private step = 0;
  private started = false;
  private intensity = 0;
  private readonly hookNotes = [293.66, 329.63, 392, 329.63, 440, 392, 329.63, 293.66, 261.63, 293.66, 329.63, 392, 493.88, 440, 392, 329.63];
  private readonly chordRoots = [293.66, 349.23, 392, 329.63];

  start(masterVolume: number, musicVolume: number) {
    if (this.started) {
      this.setVolume(masterVolume, musicVolume);
      this.ctx?.resume();
      return;
    }
    const AudioCtor = window.AudioContext || (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtor) return;
    this.ctx = new AudioCtor();
    this.master = this.ctx.createGain();
    this.drone = this.ctx.createGain();
    this.bass = this.ctx.createGain();
    this.drums = this.ctx.createGain();
    this.lead = this.ctx.createGain();
    this.master.connect(this.ctx.destination);
    [this.drone, this.bass, this.drums, this.lead].forEach((layer) => layer.connect(this.master));
    this.setVolume(masterVolume, musicVolume);
    this.scheduler = window.setInterval(() => this.tick(), 135);
    this.started = true;
  }

  update(nextIntensity: number, nearDeath: boolean) {
    if (!this.ctx || !this.started) return;
    this.intensity = Phaser.Math.Clamp(nextIntensity + (nearDeath ? 0.35 : 0), 0, 1);
    const now = this.ctx.currentTime;
    this.ramp(this.drone.gain, 0, now);
    this.ramp(this.bass.gain, this.intensity > 0.55 ? (this.intensity - 0.55) * 0.035 : 0, now);
    this.ramp(this.drums.gain, 0.035 + this.intensity * 0.09, now);
    this.ramp(this.lead.gain, 0.06 + this.intensity * 0.11, now);
  }

  setVolume(masterVolume: number, musicVolume: number) {
    if (!this.ctx || !this.master) return;
    this.ramp(this.master.gain, Phaser.Math.Clamp(masterVolume * musicVolume * 0.34, 0, 0.48), this.ctx.currentTime);
  }

  levelUpStinger() {
    if (!this.ctx || !this.started) return;
    const now = this.ctx.currentTime;
    [196, 246.94, 293.66, 329.63].forEach((freq, index) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();
      osc.type = index === 3 ? 'square' : 'triangle';
      osc.frequency.setValueAtTime(freq, now + index * 0.045);
      gain.gain.setValueAtTime(0, now + index * 0.045);
      gain.gain.linearRampToValueAtTime(0.075, now + index * 0.045 + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.001, now + index * 0.045 + 0.42);
      osc.connect(gain);
      gain.connect(this.master);
      osc.start(now + index * 0.045);
      osc.stop(now + index * 0.045 + 0.45);
    });
  }

  gameOverTone() {
    if (!this.ctx || !this.started) return;
    const now = this.ctx.currentTime;
    this.ramp(this.bass.gain, 0, now);
    this.ramp(this.drums.gain, 0, now);
    this.ramp(this.lead.gain, 0, now);
    this.ramp(this.drone.gain, 0.1, now);
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(82.41, now);
    osc.frequency.exponentialRampToValueAtTime(49, now + 2.2);
    gain.gain.setValueAtTime(0.08, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 2.4);
    osc.connect(gain);
    gain.connect(this.master);
    osc.start(now);
    osc.stop(now + 2.5);
    this.ramp(this.master.gain, 0.02, now + 1.1, 1.6);
  }

  destroy() {
    if (this.scheduler) window.clearInterval(this.scheduler);
    this.scheduler = undefined;
    this.droneOsc.forEach((osc) => osc.stop());
    this.droneOsc = [];
    this.ctx?.close();
    this.ctx = null;
    this.started = false;
  }

  private createDroneLayer() {
    if (!this.ctx) return;
    [293.66, 392, 493.88].forEach((freq, index) => {
      const osc = this.ctx!.createOscillator();
      const filter = this.ctx!.createBiquadFilter();
      osc.type = index === 1 ? 'triangle' : 'sine';
      osc.frequency.value = freq;
      filter.type = 'lowpass';
      filter.frequency.value = 760 + index * 120;
      osc.connect(filter);
      filter.connect(this.drone);
      osc.start();
      this.droneOsc.push(osc);
    });
  }

  private tick() {
    if (!this.ctx || !this.started) return;
    const now = this.ctx.currentTime;
    const bpm = 104 + this.intensity * 22;
    const beat = 60 / bpm;
    const note = this.hookNotes[this.step % this.hookNotes.length];
    const root = this.chordRoots[Math.floor(this.step / 8) % this.chordRoots.length];
    if (this.intensity > 0.7 && this.step % 16 === 8) this.playChord(root, now, beat * 0.9);
    if (this.step % 2 === 0 || this.intensity > 0.38) this.playMelody(note, now, beat * 0.72);
    if (this.intensity > 0.55 && this.step % 4 === 2) this.playMelody(note * 1.5, now + 0.03, beat * 0.42, true);
    if (this.step % 4 === 0) this.playKick(now);
    if (this.step % 2 === 1) this.playHat(now);
    if (this.intensity > 0.72 && this.step % 8 === 6) this.playSnare(now);
    this.step += 1;
  }

  private playSoftPulse(freq: number, time: number, length: number) {
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const filter = this.ctx.createBiquadFilter();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, time);
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(170 + this.intensity * 140, time);
    gain.gain.setValueAtTime(0.0001, time);
    gain.gain.exponentialRampToValueAtTime(0.04, time + 0.035);
    gain.gain.exponentialRampToValueAtTime(0.001, time + length);
    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.bass);
    osc.start(time);
    osc.stop(time + length + 0.04);
  }

  private playKick(time: number) {
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(82, time);
    osc.frequency.exponentialRampToValueAtTime(54, time + 0.12);
    gain.gain.setValueAtTime(0.055, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.16);
    osc.connect(gain);
    gain.connect(this.drums);
    osc.start(time);
    osc.stop(time + 0.2);
    this.playNoise(time, 0.04, 0.012 + this.intensity * 0.012, 900);
  }

  private playHat(time: number) {
    this.playNoise(time, 0.022, 0.012 + this.intensity * 0.018, 5200);
  }

  private playSnare(time: number) {
    this.playNoise(time, 0.055, 0.026 + this.intensity * 0.025, 1800);
  }

  private playChord(root: number, time: number, length: number) {
    [root, root * 1.25, root * 1.5].forEach((freq, index) => {
      this.playPadTone(freq, time + index * 0.012, length);
    });
  }

  private playPadTone(freq: number, time: number, length: number) {
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const filter = this.ctx.createBiquadFilter();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, time);
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(860, time);
    gain.gain.setValueAtTime(0.001, time);
    gain.gain.exponentialRampToValueAtTime(0.018, time + 0.08);
    gain.gain.exponentialRampToValueAtTime(0.001, time + length);
    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.drone);
    osc.start(time);
    osc.stop(time + length + 0.05);
  }

  private playMelody(freq: number, time: number, length: number, accent = false) {
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const filter = this.ctx.createBiquadFilter();
    const gain = this.ctx.createGain();
    osc.type = accent ? 'triangle' : 'sine';
    osc.frequency.setValueAtTime(freq, time);
    osc.frequency.linearRampToValueAtTime(freq * 1.004, time + 0.08);
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(accent ? 1350 : 1050, time);
    filter.Q.setValueAtTime(0.35, time);
    gain.gain.setValueAtTime(0.001, time);
    gain.gain.exponentialRampToValueAtTime((accent ? 0.045 : 0.06) + this.intensity * 0.018, time + 0.025);
    gain.gain.exponentialRampToValueAtTime(0.001, time + length);
    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.lead);
    osc.start(time);
    osc.stop(time + length + 0.04);
  }

  private playNoise(time: number, length: number, volume: number, cutoff: number) {
    if (!this.ctx) return;
    const buffer = this.ctx.createBuffer(1, this.ctx.sampleRate * length, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < data.length; i += 1) data[i] = Math.random() * 2 - 1;
    const noise = this.ctx.createBufferSource();
    const filter = this.ctx.createBiquadFilter();
    const gain = this.ctx.createGain();
    noise.buffer = buffer;
    filter.type = 'highpass';
    filter.frequency.value = cutoff;
    gain.gain.setValueAtTime(volume, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + length);
    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.drums);
    noise.start(time);
  }

  private ramp(param: AudioParam, value: number, time: number, duration = 0.55) {
    param.cancelScheduledValues(time);
    param.setTargetAtTime(value, time, duration);
  }
}

class ArcadeSfx {
  private ctx: AudioContext | null = null;
  private master!: GainNode;
  private started = false;

  start(masterVolume: number, sfxVolume: number) {
    if (this.started) {
      this.setVolume(masterVolume, sfxVolume);
      this.ctx?.resume();
      return;
    }
    const AudioCtor = window.AudioContext || (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtor) return;
    this.ctx = new AudioCtor();
    this.master = this.ctx.createGain();
    this.master.connect(this.ctx.destination);
    this.setVolume(masterVolume, sfxVolume);
    this.started = true;
  }

  setVolume(masterVolume: number, sfxVolume: number) {
    if (!this.ctx || !this.master) return;
    this.master.gain.setTargetAtTime(Phaser.Math.Clamp(masterVolume * sfxVolume * 0.55, 0, 0.8), this.ctx.currentTime, 0.04);
  }

  playWeaponShot(id: WeaponId, secondary = false) {
    if (!this.ctx || !this.started) return;
    if (id === 'shotgun') return this.playShotgun(secondary);
    if (id === 'launcher') return this.playLauncher(secondary);
    if (id === 'railgun' || id === 'plasma' || id === 'lightningCannon') return this.playEnergyShot(secondary);
    if (id === 'smg' || id === 'minigun' || id === 'rapidPistol') return this.playLightShot(secondary);
    if (id === 'heavyPistol') return this.playHeavyPistol(secondary);
    this.playPistol(secondary);
  }

  playLevelUp() {
    if (!this.ctx || !this.started) return;
    const now = this.ctx.currentTime;
    [392, 587.33, 783.99].forEach((freq, index) => {
      this.toneBurst(freq, freq * 1.22, 0.16 + index * 0.025, 0.045 - index * 0.006, index === 2 ? 'triangle' : 'sine', now + index * 0.045);
    });
    this.noiseBurst(0.06, 0.018, 4200);
  }

  playUpgradeHover(rarity: UpgradeRarity) {
    if (!this.ctx || !this.started) return;
    const freq = { Common: 360, Rare: 460, Epic: 560, Legendary: 700 }[rarity];
    const volume = rarity === 'Legendary' ? 0.032 : 0.018;
    this.toneBurst(freq, freq * 1.08, 0.045, volume, 'triangle');
  }

  playUpgradeSelect(rarity: UpgradeRarity) {
    if (!this.ctx || !this.started) return;
    const base = { Common: 420, Rare: 520, Epic: 640, Legendary: 760 }[rarity];
    this.toneBurst(base, base * 0.72, 0.11, 0.052, 'square');
    this.toneBurst(base * 1.5, base * 1.85, 0.18, rarity === 'Legendary' ? 0.05 : 0.032, 'triangle', this.ctx.currentTime + 0.035);
    if (rarity === 'Legendary') this.noiseBurst(0.12, 0.026, 5200);
  }

  destroy() {
    this.ctx?.close();
    this.ctx = null;
    this.started = false;
  }

  private playPistol(secondary: boolean) {
    this.toneBurst(520, 190, 0.055, secondary ? 0.035 : 0.075, 'square');
    this.noiseBurst(0.025, secondary ? 0.012 : 0.025, 1800);
  }

  private playHeavyPistol(secondary: boolean) {
    this.toneBurst(360, 145, 0.075, secondary ? 0.045 : 0.095, 'square');
    this.noiseBurst(0.04, secondary ? 0.018 : 0.04, 1200);
  }

  private playLightShot(secondary: boolean) {
    this.toneBurst(680, 280, 0.035, secondary ? 0.018 : 0.045, 'triangle');
    this.noiseBurst(0.018, secondary ? 0.006 : 0.014, 2600);
  }

  private playShotgun(secondary: boolean) {
    this.toneBurst(210, 95, 0.11, secondary ? 0.05 : 0.12, 'sawtooth');
    this.noiseBurst(0.075, secondary ? 0.025 : 0.065, 850);
  }

  private playLauncher(secondary: boolean) {
    this.toneBurst(170, 62, 0.16, secondary ? 0.05 : 0.11, 'sawtooth');
    this.noiseBurst(0.1, secondary ? 0.025 : 0.055, 650);
  }

  private playEnergyShot(secondary: boolean) {
    this.toneBurst(740, 420, 0.09, secondary ? 0.028 : 0.065, 'triangle');
    this.toneBurst(370, 520, 0.07, secondary ? 0.018 : 0.04, 'sine');
  }

  private toneBurst(startFreq: number, endFreq: number, length: number, volume: number, type: OscillatorType, startAt?: number) {
    if (!this.ctx) return;
    const now = startAt ?? this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const filter = this.ctx.createBiquadFilter();
    const gain = this.ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(startFreq, now);
    osc.frequency.exponentialRampToValueAtTime(Math.max(30, endFreq), now + length);
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(2400, now);
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(volume, now + 0.004);
    gain.gain.exponentialRampToValueAtTime(0.001, now + length);
    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.master);
    osc.start(now);
    osc.stop(now + length + 0.015);
  }

  private noiseBurst(length: number, volume: number, cutoff: number) {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const buffer = this.ctx.createBuffer(1, Math.max(1, Math.floor(this.ctx.sampleRate * length)), this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < data.length; i += 1) data[i] = (Math.random() * 2 - 1) * (1 - i / data.length);
    const noise = this.ctx.createBufferSource();
    const filter = this.ctx.createBiquadFilter();
    const gain = this.ctx.createGain();
    noise.buffer = buffer;
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(cutoff, now);
    filter.Q.setValueAtTime(0.8, now);
    gain.gain.setValueAtTime(volume, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + length);
    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.master);
    noise.start(now);
  }
}

type GameSettings = {
  masterVolume: number;
  musicVolume: number;
  sfxVolume: number;
  fullscreen: boolean;
  screenshake: boolean;
};

type RunStats = {
  bestWave: number;
  bestTime: number;
  totalKills: number;
};

type SaveData = {
  bestWave: number;
  bestTime: number;
  settings: GameSettings;
};

const SAVE_KEY = 'zombie_survival_save_v1';

class SaveManager {
  private data: SaveData;

  constructor() {
    this.data = this.loadSave();
  }

  get save() {
    return this.data;
  }

  loadSave(): SaveData {
    const fallback = this.defaultSave();
    try {
      const raw = localStorage.getItem(SAVE_KEY);
      if (!raw) {
        const migrated = this.migrateOldSave(fallback);
        this.data = migrated;
        this.saveGame();
        return migrated;
      }
      const parsed = JSON.parse(raw) as Partial<SaveData>;
      this.data = this.normalizeSave(parsed, fallback);
      return this.data;
    } catch {
      this.data = fallback;
      return this.data;
    }
  }

  saveGame(next?: Partial<SaveData>) {
    this.data = this.normalizeSave({ ...this.data, ...next }, this.defaultSave());
    localStorage.setItem(SAVE_KEY, JSON.stringify(this.data));
  }

  resetSave() {
    localStorage.removeItem(SAVE_KEY);
    this.data = this.defaultSave();
    this.saveGame();
    return this.data;
  }

  updateStats(stats: RunStats) {
    this.saveGame({
      bestWave: Math.max(this.data.bestWave, stats.bestWave),
      bestTime: Math.max(this.data.bestTime, stats.bestTime),
    });
  }

  saveSettings(settings: GameSettings) {
    this.saveGame({ settings: { ...settings } });
  }

  loadSettings() {
    return { ...this.defaultSave().settings, ...this.data.settings };
  }

  private defaultSave(): SaveData {
    return {
      bestWave: 0,
      bestTime: 0,
      settings: {
        masterVolume: 1,
        musicVolume: 0.8,
        sfxVolume: 1,
        fullscreen: false,
        screenshake: true,
      },
    };
  }

  private migrateOldSave(fallback: SaveData) {
    try {
      const oldSettings = JSON.parse(localStorage.getItem('zombieSurvivalSettings') || '{}') as Partial<GameSettings>;
      const oldStats = JSON.parse(localStorage.getItem('zombieRunStats') || '{}') as Partial<RunStats>;
      return this.normalizeSave({
        ...fallback,
        settings: { ...fallback.settings, ...oldSettings },
        bestWave: oldStats.bestWave ?? fallback.bestWave,
        bestTime: oldStats.bestTime ?? fallback.bestTime,
      }, fallback);
    } catch {
      return fallback;
    }
  }

  private normalizeSave(input: Partial<SaveData>, fallback: SaveData): SaveData {
    const settings = { ...fallback.settings, ...(input.settings ?? {}) };
    return {
      bestWave: Math.max(0, Math.floor(Number(input.bestWave ?? fallback.bestWave) || 0)),
      bestTime: Math.max(0, Math.floor(Number(input.bestTime ?? fallback.bestTime) || 0)),
      settings: {
        masterVolume: Phaser.Math.Clamp(Number(settings.masterVolume) || fallback.settings.masterVolume, 0, 1),
        musicVolume: Phaser.Math.Clamp(Number(settings.musicVolume) || fallback.settings.musicVolume, 0, 1),
        sfxVolume: Phaser.Math.Clamp(Number(settings.sfxVolume) || fallback.settings.sfxVolume, 0, 1),
        fullscreen: Boolean(settings.fullscreen),
        screenshake: settings.screenshake !== false,
      },
    };
  }
}

const UPGRADES: Upgrade[] = [
  { id: 'damage', title: 'Sharpened Rounds', desc: '+14% bullet damage.', icon: 'DMG', rarity: 'Common' },
  { id: 'damageBig', title: 'Heavy Caliber', desc: '+28% bullet damage.', icon: 'HIT', rarity: 'Rare' },
  { id: 'fireRate', title: 'Trigger Rhythm', desc: '+22% fire rate.', icon: 'RPM', rarity: 'Common' },
  { id: 'critChance', title: 'Lucky Shots', desc: '+8% critical chance.', icon: 'CRT', rarity: 'Rare' },
  { id: 'critDamage', title: 'Weak Point', desc: '+55% critical damage.', icon: 'X2', rarity: 'Rare' },
  { id: 'bulletSpeed', title: 'Hot Powder', desc: 'Faster bullets and longer range.', icon: 'SPD', rarity: 'Common' },
  { id: 'projectileSize', title: 'Big Slugs', desc: 'Larger, easier-hitting bullets.', icon: 'BIG', rarity: 'Common' },
  { id: 'pierce', title: 'Piercing Rounds', desc: 'Bullets pass through +1 enemy.', icon: 'PIR', rarity: 'Epic' },
  { id: 'doubleShot', title: 'Double Tap', desc: 'Fire an extra parallel shot.', icon: 'x2', rarity: 'Epic' },
  { id: 'ricochet', title: 'Ricochet Rounds', desc: 'Bullets bounce once off screen edge.', icon: 'RICO', rarity: 'Rare' },
  { id: 'spread', title: 'Shotgun Spread', desc: 'Fire two extra side shots.', icon: '3WAY', rarity: 'Rare' },
  { id: 'fire', title: 'Fire Bullets', desc: 'Ignite enemies over time.', icon: 'FIRE', rarity: 'Rare' },
  { id: 'poison', title: 'Poison Bullets', desc: 'Stack toxic damage.', icon: 'TOX', rarity: 'Rare' },
  { id: 'freeze', title: 'Cryo Rounds', desc: 'Slow enemies on hit.', icon: 'ICE', rarity: 'Epic' },
  { id: 'maxHp', title: 'Thicker Jacket', desc: '+25 max HP and heal 25.', icon: 'HP', rarity: 'Common' },
  { id: 'shield', title: 'Scrap Shield', desc: 'Gain a regenerating shield.', icon: 'SHD', rarity: 'Epic' },
  { id: 'regen', title: 'Health Regen', desc: 'Slowly recover health.', icon: 'REG', rarity: 'Common' },
  { id: 'lifesteal', title: 'Vamp Rounds', desc: 'Kills restore health.', icon: 'LEECH', rarity: 'Epic' },
  { id: 'damageReduction', title: 'Armor Plates', desc: 'Take 12% less damage.', icon: 'ARM', rarity: 'Rare' },
  { id: 'invuln', title: 'Panic Roll', desc: 'Longer invulnerability after hit.', icon: 'IFR', rarity: 'Rare' },
  { id: 'dodge', title: 'Side Step', desc: '+8% chance to dodge hits.', icon: 'DGE', rarity: 'Rare' },
  { id: 'speed', title: 'Road Runner', desc: '+16% movement speed.', icon: 'RUN', rarity: 'Common' },
  { id: 'orbit', title: 'Orbiting Blades', desc: 'Spinning blades slice nearby zombies.', icon: 'ORB', rarity: 'Epic' },
  { id: 'drone', title: 'Drone Buddy', desc: 'A drone auto-shoots nearby enemies.', icon: 'DRN', rarity: 'Epic' },
  { id: 'turret', title: 'Pocket Turret', desc: 'Deploys an auto-firing turret.', icon: 'TUR', rarity: 'Legendary' },
  { id: 'lightningAura', title: 'Storm Coil', desc: 'Periodic lightning aura zap.', icon: 'ZAP', rarity: 'Legendary' },
  { id: 'fireAura', title: 'Burning Engine', desc: 'Nearby enemies burn constantly.', icon: 'AURA', rarity: 'Epic' },
  { id: 'magnet', title: 'XP Magnet', desc: '+20% XP gained.', icon: 'MAG', rarity: 'Common' },
  { id: 'chain', title: 'Chain Lightning', desc: 'Hits jump to nearby targets.', icon: 'CHN', rarity: 'Epic' },
  { id: 'explosive', title: 'Explosive Bullets', desc: 'Kills pop in a blast.', icon: 'BOOM', rarity: 'Legendary' },
  { id: 'pellets', title: 'Extra Pellets', desc: 'Shotgun blasts fire +2 pellets.', icon: '+PEL', rarity: 'Rare' },
  { id: 'knockback', title: 'Breach Load', desc: 'Shotgun knockback and damage improve.', icon: 'KB', rarity: 'Rare' },
  { id: 'sprayControl', title: 'Grip Tape', desc: 'SMG spray tightens and fire rate climbs.', icon: 'GRIP', rarity: 'Rare' },
  { id: 'droneFireRate', title: 'Drone Overclock', desc: 'Drone fires faster.', icon: 'DRN+', rarity: 'Rare' },
  { id: 'orbitSpeed', title: 'Tuned Orbitals', desc: 'Orbiting blades rotate faster.', icon: 'ORB+', rarity: 'Rare' },
  { id: 'lightningChain', title: 'Forked Lightning', desc: 'Lightning jumps to more enemies.', icon: 'ZAP+', rarity: 'Epic' },
  { id: 'poisonSpread', title: 'Toxic Cloud', desc: 'Poisoned enemies spread poison on death.', icon: 'TOX+', rarity: 'Epic' },
  { id: 'critBurn', title: 'Searing Crits', desc: 'Critical hits ignite enemies.', icon: 'CRIT+', rarity: 'Epic' },
  { id: 'deathBurst', title: 'Death Burst', desc: 'Kills can pop into a small blast.', icon: 'POP', rarity: 'Epic' },
  { id: 'orbitSize', title: 'Wide Orbit', desc: 'Orbiting blades grow wider and stronger.', icon: 'ORB*', rarity: 'Rare' },
  { id: 'unlockShotgun', title: 'Shotgun', desc: 'Equip a close-range pellet spread weapon. Max 3 weapons.', icon: 'SHG', rarity: 'Rare' },
  { id: 'unlockSmg', title: 'SMG', desc: 'Equip a rapid spray weapon for on-hit builds. Max 3 weapons.', icon: 'SMG', rarity: 'Rare' },
  { id: 'unlockBurstRifle', title: 'Burst Rifle', desc: 'Equip a mid-game burst weapon. Max 3 weapons.', icon: 'BR', rarity: 'Rare' },
  { id: 'unlockFlamethrower', title: 'Flamethrower', desc: 'Equip a short-range fire cone. Max 3 weapons.', icon: 'FLM', rarity: 'Rare' },
  { id: 'unlockDualPistols', title: 'Dual Pistols', desc: 'Equip paired accurate sidearms. Max 3 weapons.', icon: 'DUO', rarity: 'Rare' },
  { id: 'unlockLauncher', title: 'Explosive Launcher', desc: 'Equip slow explosive blasts. Max 3 weapons.', icon: 'RPG', rarity: 'Epic' },
  { id: 'unlockRailgun', title: 'Railgun', desc: 'Equip a late-game piercing cannon. Max 3 weapons.', icon: 'RAIL', rarity: 'Legendary' },
  { id: 'unlockPlasma', title: 'Plasma Weapon', desc: 'Equip large energy bolts. Max 3 weapons.', icon: 'PLS', rarity: 'Legendary' },
  { id: 'unlockLightningCannon', title: 'Lightning Cannon', desc: 'Equip electric chain shots. Max 3 weapons.', icon: 'LCN', rarity: 'Legendary' },
  { id: 'unlockMinigun', title: 'Minigun', desc: 'Equip a late-game bullet storm. Max 3 weapons.', icon: 'MINI', rarity: 'Legendary' },
  { id: 'evolvePistol', title: 'Evolve Pistol', desc: 'Pistol becomes a ricochet sidearm.', icon: 'EVO', rarity: 'Epic' },
  { id: 'evolveShotgun', title: 'Evolve Shotgun', desc: 'Shotgun shells explode on impact.', icon: 'EVO', rarity: 'Epic' },
  { id: 'evolveSmg', title: 'Evolve SMG', desc: 'SMG gains stronger poison rounds.', icon: 'EVO', rarity: 'Epic' },
  { id: 'evolveFlamethrower', title: 'Evolve Flamethrower', desc: 'Burning enemies spread fire on death.', icon: 'EVO', rarity: 'Epic' },
  { id: 'evolveRailgun', title: 'Evolve Railgun', desc: 'Railgun shots chain lightning.', icon: 'EVO', rarity: 'Legendary' },
  { id: 'evolveLightningCannon', title: 'Evolve Lightning Cannon', desc: 'Lightning chains farther and harder.', icon: 'EVO', rarity: 'Legendary' },
];

const UPGRADE_LIMITS: Partial<Record<UpgradeId, number>> = {
  maxHp: 3,
  damage: 4,
  damageBig: 2,
  fireRate: 4,
  critChance: 3,
  speed: 3,
  damageReduction: 4,
  invuln: 3,
  dodge: 4,
  regen: 3,
  lifesteal: 3,
  magnet: 3,
  shield: 3,
  bulletSpeed: 3,
  projectileSize: 3,
  pierce: 3,
  ricochet: 3,
  doubleShot: 2,
  spread: 2,
  pellets: 3,
  knockback: 3,
  sprayControl: 3,
  droneFireRate: 4,
  orbitSpeed: 4,
  orbitSize: 3,
  lightningChain: 3,
  poisonSpread: 1,
  critBurn: 1,
  deathBurst: 1,
  explosive: 1,
  chain: 2,
  fire: 2,
  poison: 2,
  freeze: 2,
};

const STAT_UPGRADES = new Set<UpgradeId>(['maxHp', 'damage', 'damageBig', 'fireRate', 'critChance', 'critDamage', 'speed', 'bulletSpeed', 'projectileSize']);
const WORLD_HALF_SIZE = 3200;
const PLAYABLE_HALF_SIZE = 2180;
const ICON_URLS: Record<string, string> = {
  boots: new URL('../assets/icons/boots.png', import.meta.url).href,
  bulletSpeed: new URL('../assets/icons/bulletSpeed.png', import.meta.url).href,
  chain: new URL('../assets/icons/chain.png', import.meta.url).href,
  critBurn: new URL('../assets/icons/critBurn.png', import.meta.url).href,
  critChance: new URL('../assets/icons/critChance.png', import.meta.url).href,
  critDamage: new URL('../assets/icons/critDamage.png', import.meta.url).href,
  damage: new URL('../assets/icons/damage.png', import.meta.url).href,
  damageBig: new URL('../assets/icons/damageBig.png', import.meta.url).href,
  damageReduction: new URL('../assets/icons/damageReduction.png', import.meta.url).href,
  deathBurst: new URL('../assets/icons/deathBurst.png', import.meta.url).href,
  dodge: new URL('../assets/icons/dodge.png', import.meta.url).href,
  doubleShot: new URL('../assets/icons/doubleShot.png', import.meta.url).href,
  drone: new URL('../assets/icons/drone.png', import.meta.url).href,
  droneFireRate: new URL('../assets/icons/droneFireRate.png', import.meta.url).href,
  evolveFlamethrower: new URL('../assets/icons/evolveFlamethrower.png', import.meta.url).href,
  evolveLightningCannon: new URL('../assets/icons/evolveLightningCannon.png', import.meta.url).href,
  evolvePistol: new URL('../assets/icons/evolvePistol.png', import.meta.url).href,
  evolveRailgun: new URL('../assets/icons/evolveRailgun.png', import.meta.url).href,
  evolveShotgun: new URL('../assets/icons/evolveShotgun.png', import.meta.url).href,
  evolveSmg: new URL('../assets/icons/evolveSmg.png', import.meta.url).href,
  explosive: new URL('../assets/icons/explosive.png', import.meta.url).href,
  fire: new URL('../assets/icons/fire.png', import.meta.url).href,
  fireAura: new URL('../assets/icons/fireAura.png', import.meta.url).href,
  fireRate: new URL('../assets/icons/fireRate.png', import.meta.url).href,
  freeze: new URL('../assets/icons/freeze.png', import.meta.url).href,
  helmet: new URL('../assets/icons/helmet.png', import.meta.url).href,
  invuln: new URL('../assets/icons/invuln.png', import.meta.url).href,
  knockback: new URL('../assets/icons/knockback.png', import.meta.url).href,
  lifesteal: new URL('../assets/icons/lifesteal.png', import.meta.url).href,
  lightningAura: new URL('../assets/icons/lightningAura.png', import.meta.url).href,
  lightningChain: new URL('../assets/icons/lightningChain.png', import.meta.url).href,
  magnet: new URL('../assets/icons/magnet.png', import.meta.url).href,
  maxHp: new URL('../assets/icons/maxHp.png', import.meta.url).href,
  orbit: new URL('../assets/icons/orbit.png', import.meta.url).href,
  orbitSize: new URL('../assets/icons/orbitSize.png', import.meta.url).href,
  orbitSpeed: new URL('../assets/icons/orbitSpeed.png', import.meta.url).href,
  pellets: new URL('../assets/icons/pellets.png', import.meta.url).href,
  pierce: new URL('../assets/icons/pierce.png', import.meta.url).href,
  poison: new URL('../assets/icons/poison.png', import.meta.url).href,
  poisonSpread: new URL('../assets/icons/poisonSpread.png', import.meta.url).href,
  projectileSize: new URL('../assets/icons/projectileSize.png', import.meta.url).href,
  regen: new URL('../assets/icons/regen.png', import.meta.url).href,
  ricochet: new URL('../assets/icons/ricochet.png', import.meta.url).href,
  shield: new URL('../assets/icons/shield.png', import.meta.url).href,
  speed: new URL('../assets/icons/speed.png', import.meta.url).href,
  sprayControl: new URL('../assets/icons/sprayControl.png', import.meta.url).href,
  spread: new URL('../assets/icons/spread.png', import.meta.url).href,
  turret: new URL('../assets/icons/turret.png', import.meta.url).href,
  unlockBurstRifle: new URL('../assets/icons/unlockBurstRifle.png', import.meta.url).href,
  unlockDualPistols: new URL('../assets/icons/unlockDualPistols.png', import.meta.url).href,
  unlockFlamethrower: new URL('../assets/icons/unlockFlamethrower.png', import.meta.url).href,
  unlockLauncher: new URL('../assets/icons/unlockLauncher.png', import.meta.url).href,
  unlockLightningCannon: new URL('../assets/icons/unlockLightningCannon.png', import.meta.url).href,
  unlockMinigun: new URL('../assets/icons/unlockMinigun.png', import.meta.url).href,
  unlockPlasma: new URL('../assets/icons/unlockPlasma.png', import.meta.url).href,
  unlockRailgun: new URL('../assets/icons/unlockRailgun.png', import.meta.url).href,
  unlockShotgun: new URL('../assets/icons/unlockShotgun.png', import.meta.url).href,
  unlockSmg: new URL('../assets/icons/unlockSmg.png', import.meta.url).href,
  vest: new URL('../assets/icons/vest.png', import.meta.url).href,
};
export class ArenaScene extends Phaser.Scene {
  private player!: Phaser.GameObjects.Container;
  private playerGun!: Phaser.GameObjects.Container;
  private playerLegs: Phaser.GameObjects.Rectangle[] = [];
  private playerHitTimer = 0;
  private playerDead = false;
  private playerPos: Vec2 = { x: 0, y: 0 };
  private playerVel: Vec2 = { x: 0, y: 0 };
  private hp = 100;
  private maxHp = 100;
  private level = 1;
  private xp = 0;
  private xpNeed = 25;
  private elapsed = 0;
  private score = 0;
  private enemyId = 0;
  private enemies: Enemy[] = [];
  private bullets: Bullet[] = [];
  private enemyProjectiles: EnemyProjectile[] = [];
  private groundHazards: GroundHazard[] = [];
  private gems: XpGem[] = [];
  private coinDrops: CoinDrop[] = [];
  private coins = 0;
  private keys!: Record<'W' | 'A' | 'S' | 'D', Phaser.Input.Keyboard.Key>;
  private aim: Vec2 = { x: 1, y: 0 };
  private firing = false;
  private fireCooldown = 0;
  private spawnCooldown = 0;
  private droneCooldown = 0;
  private turretCooldown = 0;
  private auraCooldown = 0;
  private shield = 0;
  private invulnTimer = 0;
  private wave = 0;
  private wavePhase: WavePhase = 'countdown';
  private waveTimer = 3;
  private waveTarget = 0;
  private waveSpawned = 0;
  private waveUpgradePending = false;
  private specialWave: SpecialWaveType = 'none';
  private nextSpecialWave: SpecialWaveType = 'none';
  private lastSpecialWave = -99;
  private specialRewardPending = false;
  private hitStop = 0;
  private gunRecoil = 0;
  private paused = false;
  private gameOver = false;
  private leveling = false;
  private worldLayer!: Phaser.GameObjects.Container;
  private fogLayer!: Phaser.GameObjects.Container;
  private fxLayer!: Phaser.GameObjects.Container;
  private fogPatches: FogPatch[] = [];
  private hud!: HTMLDivElement;
  private upgradeOverlay!: HTMLDivElement;
  private gameOverOverlay!: HTMLDivElement;
  private campOverlay!: HTMLDivElement;
  private pauseOverlay!: HTMLDivElement;
  private weaponOverlay!: HTMLDivElement;
  private lobbyOverlay!: HTMLDivElement;
  private damageFlashOverlay!: HTMLDivElement;
  private crosshair!: HTMLDivElement;
  private inLobby = true;
  private selectingWeapon = true;
  private selectedWeapon: WeaponId = 'pistol';
  private equippedWeapons: EquippedWeapon[] = [];
  private shopOffers: WeaponId[] = [];
  private upgradeStacks: Partial<Record<UpgradeId, number>> = {};
  private recentUpgrades: UpgradeId[] = [];
  private saveManager = new SaveManager();
  private soundtrack = new DynamicSoundtrack();
  private sfx = new ArcadeSfx();
  private settings: GameSettings = {
    masterVolume: 1,
    musicVolume: 0.8,
    sfxVolume: 1,
    fullscreen: false,
    screenshake: true,
  };
  private runStats: RunStats = {
    bestWave: 0,
    bestTime: 0,
    totalKills: 0,
  };
  private stats = {
    damage: 20,
    fireRate: 5,
    critChance: 0,
    critDamage: 1.8,
    bulletSpeed: 1,
    projectileSize: 1,
    pierce: 0,
    ricochet: 0,
    speed: 245,
    spread: 0,
    doubleShot: 0,
    fire: 0,
    poison: 0,
    freeze: 0,
    shield: 0,
    orbit: 0,
    drone: 0,
    turret: 0,
    lightningAura: 0,
    fireAura: 0,
    magnet: 1,
    chain: 0,
    explosive: 0,
    regen: 0,
    lifesteal: 0,
    damageReduction: 0,
    invuln: 0,
    dodge: 0,
    pellets: 0,
    knockback: 0,
    sprayControl: 0,
    droneFireRate: 0,
    orbitSpeed: 0,
    lightningChain: 0,
    poisonSpread: 0,
    critBurn: 0,
    deathBurst: 0,
    orbitSize: 0,
  };

  constructor() {
    super('arena');
  }

  private handleBeforeUnload = () => {
    this.persistProgress();
  };

  create() {
    this.cleanupDom();
    this.saveManager = new SaveManager();
    this.loadPersistentProgress();
    this.resetRunState();
    this.worldLayer = this.add.container(0, 0);
    this.fogLayer = this.add.container(0, 0);
    this.fxLayer = this.add.container(0, 0);
    this.worldLayer.setDepth(1);
    this.fogLayer.setDepth(4);
    this.fxLayer.setDepth(5);
    this.keys = this.input.keyboard!.addKeys('W,A,S,D') as Record<'W' | 'A' | 'S' | 'D', Phaser.Input.Keyboard.Key>;
    this.input.on('pointermove', (p: Phaser.Input.Pointer) => {
      const world = this.cameras.main.getWorldPoint(p.x, p.y);
      this.aim = { x: world.x, y: world.y };
      this.updateCrosshair(p.x, p.y);
    });
    this.input.on('pointerdown', () => (this.firing = true));
    this.input.on('pointerup', () => (this.firing = false));
    this.input.keyboard!.on('keydown-R', () => {
      if (this.gameOver) this.scene.restart();
    });
    this.input.keyboard!.on('keydown-ESC', () => this.togglePause());
    window.addEventListener('beforeunload', this.handleBeforeUnload);
    this.createArena();
    this.player = this.createPlayer();
    this.createHud();
    this.showLobbyMenu();
    this.cameras.main.setZoom(1);
    this.cameras.main.centerOn(0, 0);
  }

  private resetRunState() {
    this.playerPos = { x: 0, y: 0 };
    this.playerVel = { x: 0, y: 0 };
    this.hp = 100;
    this.maxHp = 100;
    this.level = 1;
    this.xp = 0;
    this.xpNeed = 25;
    this.elapsed = 0;
    this.score = 0;
    this.enemyId = 0;
    this.enemies = [];
    this.bullets = [];
    this.enemyProjectiles = [];
    this.groundHazards = [];
    this.gems = [];
    this.coinDrops = [];
    this.coins = 0;
    this.aim = { x: 1, y: 0 };
    this.firing = false;
    this.fireCooldown = 0;
    this.spawnCooldown = 0;
    this.droneCooldown = 0;
    this.turretCooldown = 0;
    this.auraCooldown = 0;
    this.shield = 0;
    this.invulnTimer = 0;
    this.wave = 0;
    this.wavePhase = 'countdown';
    this.waveTimer = 3;
    this.waveTarget = 0;
    this.waveSpawned = 0;
    this.waveUpgradePending = false;
    this.specialWave = 'none';
    this.nextSpecialWave = 'none';
    this.lastSpecialWave = -99;
    this.specialRewardPending = false;
    this.hitStop = 0;
    this.gunRecoil = 0;
    this.gameOver = false;
    this.leveling = false;
    this.paused = false;
    this.inLobby = true;
    this.selectingWeapon = true;
    this.selectedWeapon = 'pistol';
    this.equippedWeapons = [];
    this.shopOffers = [];
    this.upgradeStacks = {};
    this.recentUpgrades = [];
    this.playerHitTimer = 0;
    this.playerDead = false;
    this.stats = {
      damage: 20,
      fireRate: 5,
      critChance: 0,
      critDamage: 1.8,
      bulletSpeed: 1,
      projectileSize: 1,
      pierce: 0,
      ricochet: 0,
      speed: 245,
      spread: 0,
      doubleShot: 0,
      fire: 0,
      poison: 0,
      freeze: 0,
      shield: 0,
      orbit: 0,
      drone: 0,
      turret: 0,
      lightningAura: 0,
      fireAura: 0,
      magnet: 1,
      chain: 0,
      explosive: 0,
      regen: 0,
      lifesteal: 0,
      damageReduction: 0,
      invuln: 0,
      dodge: 0,
      pellets: 0,
      knockback: 0,
      sprayControl: 0,
      droneFireRate: 0,
      orbitSpeed: 0,
      lightningChain: 0,
      poisonSpread: 0,
      critBurn: 0,
      deathBurst: 0,
      orbitSize: 0,
    };
  }

  update(_time: number, deltaMs: number) {
    if (this.gameOver || this.leveling || this.paused || this.selectingWeapon || this.inLobby) return;
    const rawDt = Math.min(deltaMs / 1000, 0.033);
    this.hitStop = Math.max(0, this.hitStop - rawDt);
    const dt = this.hitStop > 0 ? rawDt * 0.16 : rawDt;
    this.elapsed += dt;
    this.updatePlayer(dt);
    this.updateShooting(dt);
    this.updateWave(dt);
    this.updateEnemies(dt);
    this.updateBullets(dt);
    this.updateEnemyProjectiles(dt);
    this.updateGroundHazards(dt);
    this.updateFog(dt);
    this.updateGems(dt);
    this.updateCoins(dt);
    this.updateOrbitals(dt);
    this.updateDrone(dt);
    this.updateSpecials(dt);
    this.updateSoundtrack();
    this.updateHud();
    this.cameras.main.centerOn(this.playerPos.x, this.playerPos.y);
  }

  private createArena() {
    const bg = this.add.rectangle(0, 0, WORLD_HALF_SIZE * 2, WORLD_HALF_SIZE * 2, 0x101922);
    this.worldLayer.add(bg);
    const forestFloor = this.add.rectangle(0, 0, WORLD_HALF_SIZE * 2, WORLD_HALF_SIZE * 2, 0x101b22, 0.72);
    forestFloor.setStrokeStyle(0);
    this.worldLayer.add(forestFloor);
    const arenaFloor = this.add.rectangle(0, 0, PLAYABLE_HALF_SIZE * 2 + 250, PLAYABLE_HALF_SIZE * 2 + 250, 0x1d2a36, 0.92);
    this.worldLayer.add(arenaFloor);
    for (let x = -2240; x <= 2240; x += 160) {
      for (let y = -2240; y <= 2240; y += 160) {
        const tile = this.add.rectangle(x, y, 148, 148, Phaser.Display.Color.GetColor(22 + Phaser.Math.Between(-3, 6), 38 + Phaser.Math.Between(-6, 7), 47 + Phaser.Math.Between(-5, 9)), 0.68);
        tile.setStrokeStyle(2, 0x172433, 0.2);
        this.worldLayer.add(tile);
      }
    }
    this.createArenaBoundary();
    this.createAtmosphericFog();
    for (let i = 0; i < 160; i += 1) {
      const rock = this.add.rectangle(Phaser.Math.Between(-2050, 2050), Phaser.Math.Between(-2050, 2050), Phaser.Math.Between(16, 54), Phaser.Math.Between(10, 30), 0x304252, 0.75);
      rock.setRotation(Phaser.Math.FloatBetween(-0.7, 0.7));
      this.worldLayer.add(rock);
    }
  }

  private createArenaBoundary() {
    const sides: Array<'top' | 'right' | 'bottom' | 'left'> = ['top', 'right', 'bottom', 'left'];
    sides.forEach((side) => {
      const horizontal = side === 'top' || side === 'bottom';
      const sign = side === 'right' || side === 'bottom' ? 1 : -1;
      for (let lane = 0; lane < 3; lane += 1) {
        for (let step = -2050; step <= 2050; step += Phaser.Math.Between(125, 185)) {
          const drift = Phaser.Math.Between(-46, 46);
          const depth = 2440 + lane * 185 + Phaser.Math.Between(-42, 58);
          const x = horizontal ? step + drift : sign * depth;
          const y = horizontal ? sign * depth : step + drift;
          const far = lane > 0;
          const dead = Math.random() < (far ? 0.3 : 0.46);
          this.createForestTree(x, y, Phaser.Math.FloatBetween(far ? 0.78 : 0.58, far ? 1.24 : 0.95), dead, far ? 0.42 : 0.72);
        }
      }
      for (let step = -2020; step <= 2020; step += Phaser.Math.Between(170, 245)) {
        const x = horizontal ? step + Phaser.Math.Between(-38, 38) : sign * Phaser.Math.Between(2165, 2265);
        const y = horizontal ? sign * Phaser.Math.Between(2165, 2265) : step + Phaser.Math.Between(-38, 38);
        this.createBoundaryRemnant(x, y, horizontal ? 0 : Math.PI / 2);
      }
    });
    for (let i = 0; i < 52; i += 1) {
      const horizontal = Math.random() < 0.5;
      const sign = Math.random() < 0.5 ? -1 : 1;
      const x = horizontal ? Phaser.Math.Between(-2140, 2140) : sign * Phaser.Math.Between(2070, 2240);
      const y = horizontal ? sign * Phaser.Math.Between(2070, 2240) : Phaser.Math.Between(-2140, 2140);
      this.createBoundaryDebris(x, y);
    }
  }

  private createForestTree(x: number, y: number, scale: number, dead: boolean, alpha: number) {
    const c = this.add.container(x, y);
    const trunk = this.add.rectangle(0, 18 * scale, 10 * scale, 58 * scale, dead ? 0x2b2928 : 0x2f2b25, alpha).setOrigin(0.5);
    trunk.setStrokeStyle(2, 0x0b1114, alpha * 0.75);
    c.add(trunk);
    if (dead) {
      const snag = this.add.rectangle(0, -24 * scale, 8 * scale, 62 * scale, 0x3b352f, alpha).setOrigin(0.5);
      snag.setRotation(Phaser.Math.FloatBetween(-0.16, 0.16));
      snag.setStrokeStyle(2, 0x0b1114, alpha * 0.7);
      c.add(snag);
      [-1, 1].forEach((dir) => {
        const branch = this.add.rectangle(dir * 15 * scale, -38 * scale, 34 * scale, 5 * scale, 0x302c29, alpha).setOrigin(0.5);
        branch.setRotation(dir * Phaser.Math.FloatBetween(0.42, 0.72));
        c.add(branch);
      });
    } else {
      const colors = [0x101f1b, 0x172c24, 0x1e392e];
      for (let i = 0; i < 4; i += 1) {
        const foliage = this.add.triangle(0, -18 * scale - i * 20 * scale, 0, 42 * scale, 34 * scale, 0, 68 * scale, 42 * scale, colors[i % colors.length], alpha).setOrigin(0.5);
        foliage.setStrokeStyle(2, 0x081011, alpha * 0.68);
        c.add(foliage);
      }
    }
    this.worldLayer.add(c);
  }

  private createBoundaryRemnant(x: number, y: number, rotation: number) {
    const roll = Math.random();
    if (roll < 0.24) this.createHedgehogBarrier(x, y, rotation + Phaser.Math.FloatBetween(-0.22, 0.22));
    else if (roll < 0.46) this.createBrokenRoadBarrier(x, y, rotation + Phaser.Math.FloatBetween(-0.16, 0.16));
    else if (roll < 0.64) this.createMilitaryBarricade(x, y, rotation + Phaser.Math.FloatBetween(-0.12, 0.12));
    else if (roll < 0.84) this.createFenceSegment(x, y, rotation + Phaser.Math.FloatBetween(-0.1, 0.1), Math.random() < 0.55);
    else this.createWarningSign(x, y, rotation + Phaser.Math.FloatBetween(-0.2, 0.2));
  }

  private createHedgehogBarrier(x: number, y: number, rotation: number) {
    const c = this.add.container(x, y);
    [0, Math.PI / 3, -Math.PI / 3].forEach((r) => {
      const beam = this.add.rectangle(0, 0, 82, 10, 0x5f6464, 0.9).setOrigin(0.5).setStrokeStyle(2, 0x151a1c, 0.85);
      beam.setRotation(r);
      c.add(beam);
    });
    c.setRotation(rotation);
    this.worldLayer.add(c);
  }

  private createBrokenRoadBarrier(x: number, y: number, rotation: number) {
    const c = this.add.container(x, y);
    const rail = this.add.rectangle(0, 0, 110, 16, 0xb6a56c, 0.82).setOrigin(0.5).setStrokeStyle(2, 0x26231d, 0.9);
    c.add(rail);
    [-36, 4, 42].forEach((sx, i) => c.add(this.add.rectangle(sx, 0, 18, 14, i === 1 ? 0x9c2f2e : 0x323840, 0.9).setOrigin(0.5)));
    c.add(this.add.rectangle(-28, 23, 10, 42, 0x33383d, 0.85).setOrigin(0.5));
    c.add(this.add.rectangle(34, 24, 10, 38, 0x33383d, 0.8).setOrigin(0.5));
    c.setRotation(rotation);
    this.worldLayer.add(c);
  }

  private createMilitaryBarricade(x: number, y: number, rotation: number) {
    const c = this.add.container(x, y);
    c.add(this.add.rectangle(0, 9, 126, 24, 0x33392f, 0.9).setOrigin(0.5).setStrokeStyle(2, 0x0f1411, 0.9));
    c.add(this.add.rectangle(-34, -6, 48, 18, 0x48513f, 0.86).setOrigin(0.5).setStrokeStyle(2, 0x141915, 0.82));
    c.add(this.add.rectangle(30, -8, 54, 19, 0x5d4f36, 0.82).setOrigin(0.5).setStrokeStyle(2, 0x181510, 0.82));
    c.add(this.add.rectangle(0, -22, 86, 7, 0x252b2f, 0.86).setOrigin(0.5));
    c.setRotation(rotation);
    this.worldLayer.add(c);
  }

  private createFenceSegment(x: number, y: number, rotation: number, barbed: boolean) {
    const c = this.add.container(x, y);
    [-48, 0, 48].forEach((sx) => c.add(this.add.rectangle(sx, 0, 8, 58, 0x3c463f, 0.82).setOrigin(0.5).setStrokeStyle(1, 0x101514, 0.8)));
    [-18, 7].forEach((sy) => c.add(this.add.rectangle(0, sy, 120, 5, 0x59605a, 0.7).setOrigin(0.5)));
    if (barbed) {
      for (let sx = -54; sx <= 54; sx += 18) {
        const barb = this.add.rectangle(sx, -31, 16, 3, 0x9ca095, 0.7).setOrigin(0.5);
        barb.setRotation(Phaser.Math.DegToRad(28));
        c.add(barb);
      }
    }
    c.setRotation(rotation);
    this.worldLayer.add(c);
  }

  private createWarningSign(x: number, y: number, rotation: number) {
    const c = this.add.container(x, y);
    c.add(this.add.rectangle(0, 16, 7, 54, 0x3c3328, 0.9).setOrigin(0.5));
    c.add(this.add.rectangle(0, -18, 48, 32, 0xc59b44, 0.86).setOrigin(0.5).setStrokeStyle(2, 0x2b2114, 0.9));
    c.add(this.add.rectangle(0, -18, 28, 5, 0x6e2024, 0.78).setOrigin(0.5));
    c.add(this.add.rectangle(0, -7, 32, 4, 0x27251e, 0.64).setOrigin(0.5));
    c.setRotation(rotation);
    this.worldLayer.add(c);
  }

  private createBoundaryDebris(x: number, y: number) {
    const debris = this.add.rectangle(x, y, Phaser.Math.Between(18, 62), Phaser.Math.Between(8, 24), Phaser.Display.Color.GetColor(38 + Phaser.Math.Between(0, 28), 43 + Phaser.Math.Between(0, 22), 42 + Phaser.Math.Between(0, 18)), 0.72);
    debris.setRotation(Phaser.Math.FloatBetween(-1.2, 1.2));
    debris.setStrokeStyle(1, 0x101417, 0.55);
    this.worldLayer.add(debris);
  }

  private createAtmosphericFog() {
    this.fogPatches = [];
    const edgeBands = [
      { horizontal: true, sign: -1, count: 32 },
      { horizontal: true, sign: 1, count: 32 },
      { horizontal: false, sign: -1, count: 26 },
      { horizontal: false, sign: 1, count: 26 },
    ];
    edgeBands.forEach((band) => {
      for (let i = 0; i < band.count; i += 1) {
        const along = Phaser.Math.Between(-2550, 2550);
        const depth = Phaser.Math.Between(2140, 3020);
        const x = band.horizontal ? along : band.sign * depth;
        const y = band.horizontal ? band.sign * depth : along;
        const distanceAlpha = Phaser.Math.Clamp((Math.abs(depth) - 2050) / 900, 0.25, 1);
        this.createFogPatch(
          { x, y },
          Phaser.Math.Between(150, 360),
          0.06 + distanceAlpha * 0.09,
          Phaser.Math.FloatBetween(0.72, 1.35),
          band.horizontal ? Phaser.Math.FloatBetween(-3.8, 4.8) : Phaser.Math.FloatBetween(-1.6, 1.8),
          band.horizontal ? Phaser.Math.FloatBetween(-1.2, 1.4) : Phaser.Math.FloatBetween(-3.4, 4.2),
        );
      }
    });
    for (let i = 0; i < 42; i += 1) {
      this.createFogPatch(
        { x: Phaser.Math.Between(-2100, 2100), y: Phaser.Math.Between(-2100, 2100) },
        Phaser.Math.Between(80, 210),
        Phaser.Math.FloatBetween(0.025, 0.06),
        Phaser.Math.FloatBetween(0.45, 0.9),
        Phaser.Math.FloatBetween(-5.5, 5.5),
        Phaser.Math.FloatBetween(-2.2, 2.2),
      );
    }
  }

  private createFogPatch(pos: Vec2, radius: number, alpha: number, density: number, driftX: number, driftY: number) {
    const body = this.add.container(pos.x, pos.y);
    const fogColors = [0x9ca9a7, 0x7f9290, 0x647b78, 0x8d9c9d];
    const lobes = Phaser.Math.Between(5, 9);
    for (let i = 0; i < lobes; i += 1) {
      const angle = (i / lobes) * Math.PI * 2 + Phaser.Math.FloatBetween(-0.48, 0.48);
      const dist = Phaser.Math.FloatBetween(0, radius * 0.38);
      const lobeRadius = radius * Phaser.Math.FloatBetween(0.34, 0.78);
      const puff = this.add.circle(
        Math.cos(angle) * dist,
        Math.sin(angle) * dist * 0.62,
        lobeRadius,
        Phaser.Utils.Array.GetRandom(fogColors),
        alpha * Phaser.Math.FloatBetween(0.16, 0.36),
      );
      puff.setScale(Phaser.Math.FloatBetween(1.45, 2.8), Phaser.Math.FloatBetween(0.28, 0.62));
      puff.setRotation(Phaser.Math.FloatBetween(-0.28, 0.28));
      body.add(puff);
    }
    const veil = this.add.circle(0, 0, radius * 1.24, 0x6f8584, alpha * 0.05);
    veil.setScale(Phaser.Math.FloatBetween(1.9, 3.4), Phaser.Math.FloatBetween(0.32, 0.7));
    veil.setRotation(Phaser.Math.FloatBetween(-0.18, 0.18));
    body.add(veil);
    body.setAlpha(0.65);
    this.fogLayer.add(body);
    this.fogPatches.push({
      body,
      origin: pos,
      drift: { x: driftX, y: driftY },
      phase: Phaser.Math.FloatBetween(0, Math.PI * 2),
      pulse: Phaser.Math.FloatBetween(0.12, 0.32),
      baseAlpha: alpha,
      density,
    });
  }

  private createPlayer() {
    const c = this.add.container(this.playerPos.x, this.playerPos.y);
    const px = (x: number, y: number, w: number, h: number, color: number) =>
      this.add.rectangle(x, y, w, h, color).setOrigin(0.5).setStrokeStyle(2, 0x17111c);

    c.add(this.add.rectangle(0, 21, 43, 13, 0x000000, 0.26));
    const backpack = px(-16, 7, 12, 22, 0xb94738);
    const backStrap = px(-11, 3, 4, 28, 0x5b2730);
    const body = px(0, 8, 22, 25, 0x252033);
    const jacket = px(-6, 8, 10, 23, 0xcc4635);
    const belt = px(0, 19, 25, 5, 0x3a2430);
    const scarf = px(6, 0, 18, 9, 0xe95a3f);
    const neck = px(0, -5, 18, 8, 0x3d2631);
    const head = px(0, -16, 24, 22, 0x2a2534);
    const face = px(3, -14, 15, 8, 0xffd8a6);
    const visor = px(7, -16, 11, 4, 0xfff2a3);
    const hatTop = px(-2, -31, 27, 11, 0x31213c);
    const hatCrown = px(-4, -24, 31, 12, 0x31213c);
    const hatBrim = px(13, -23, 20, 7, 0x211827);
    const leftArm = px(-14, 8, 7, 20, 0x2f2a40);
    const rightArm = px(14, 8, 7, 20, 0x2f2a40);
    const leftLeg = px(-7, 27, 7, 15, 0x211b2a);
    const rightLeg = px(8, 27, 7, 15, 0x211b2a);
    const gun = this.add.container(20, 7);
    gun.add(px(6, 0, 23, 7, 0x343545));
    gun.add(px(20, 0, 12, 4, 0x111722));
    gun.add(px(-2, 5, 7, 9, 0x1b202b));

    c.add([backpack, backStrap, leftLeg, rightLeg, body, jacket, belt, neck, head, face, visor, hatTop, hatCrown, hatBrim, scarf, leftArm, rightArm, gun]);
    this.worldLayer.add(c);
    this.playerGun = gun;
    this.playerLegs = [leftLeg, rightLeg];
    return c;
  }

  private createEnemy(type: EnemyType, pos: Vec2): Enemy {
    const late = Math.max(0, this.wave - 6);
    const scale = 1 + Math.min(3.4, this.wave * 0.12 + late * 0.055);
    const speedBonus = Math.min(74, this.wave * 3.4 + late * 1.7);
    const bossTier = this.getBossTier();
    const bossPower = type === 'bossTitan' || type === 'bossGunner' ? 1 + Math.max(0, bossTier - 1) * 0.42 : 1;
    const bossTempo = type === 'bossTitan' || type === 'bossGunner' ? 1 + Math.max(0, bossTier - 1) * 0.2 : 1;
    const config = {
      walker: { hp: 34 * scale, speed: 78 + speedBonus, damage: 9, radius: 20, color: 0x88906f },
      runner: { hp: 24 * scale, speed: 132 + speedBonus * 1.1, damage: 7, radius: 18, color: 0x8d9674 },
      brute: { hp: 135 * scale, speed: 54 + speedBonus * 0.65, damage: 20, radius: 34, color: 0x7f8f69 },
      gunner: { hp: 92 * scale, speed: 82 + speedBonus * 0.78, damage: 10, radius: 23, color: 0x8a806b },
      bossTitan: { hp: 1500 * (1 + this.wave * 0.24) * bossPower, speed: (86 + speedBonus * 0.46) * bossTempo, damage: 42 * bossPower, radius: 70, color: bossTier >= 3 ? 0x8f5d52 : 0x788761 },
      bossGunner: { hp: 1120 * (1 + this.wave * 0.22) * bossPower, speed: (128 + speedBonus * 0.62) * bossTempo, damage: 22 * bossPower, radius: 42, color: bossTier >= 3 ? 0xb9685c : 0x9b8167 },
    }[type];
    const body = this.drawEnemy(type, config.color);
    if (type === 'bossTitan' || type === 'bossGunner') {
      const visualScale = 1 + Math.min(0.38, Math.max(0, bossTier - 1) * 0.1);
      body.setScale(body.scaleX * visualScale, body.scaleY * visualScale);
    }
    body.setPosition(pos.x, pos.y);
    this.worldLayer.add(body);
    const enemy: Enemy = {
      id: this.enemyId++,
      type,
      pos,
      vel: { x: 0, y: 0 },
      hp: config.hp,
      maxHp: config.hp,
      speed: config.speed,
      damage: config.damage,
      radius: config.radius,
      hitFlash: 0,
      burn: 0,
      poison: 0,
      freeze: 0,
      attackCooldown: Phaser.Math.FloatBetween(0, 0.25),
      aimTimer: 0,
      burstShots: 0,
      burstTimer: 0,
      strafeDir: Math.random() < 0.5 ? -1 : 1,
      bossMode: 'none',
      rage: false,
      bossTier,
      chargeAngle: 0,
      chargeHit: false,
      ringCooldown: Phaser.Math.FloatBetween(1.4, 2.4) / bossTempo,
      body,
    };
    this.applySpecialWaveEnemyMods(enemy);
    return enemy;
  }

  private applySpecialWaveEnemyMods(enemy: Enemy) {
    if (enemy.type === 'bossTitan' || enemy.type === 'bossGunner') return;
    if (this.specialWave === 'toxic') {
      enemy.maxHp *= 1.12;
      enemy.hp = enemy.maxHp;
      enemy.damage *= 1.08;
      this.tintContainer(enemy.body, 0x8aff6a);
    }
    if (this.specialWave === 'night') {
      enemy.maxHp *= 0.72;
      enemy.hp = enemy.maxHp;
      enemy.speed *= 1.12;
      enemy.damage *= 0.82;
      enemy.body.setAlpha(0.86);
    }
    if (this.specialWave === 'elite') {
      enemy.maxHp *= enemy.type === 'brute' ? 1.75 : 1.45;
      enemy.hp = enemy.maxHp;
      enemy.speed *= 1.16;
      enemy.damage *= 1.38;
      enemy.radius *= 1.08;
      enemy.body.setScale(enemy.body.scaleX * 1.14, enemy.body.scaleY * 1.14);
      this.tintContainer(enemy.body, 0xffd166);
    }
    if (this.specialWave === 'gunnerRaid' && enemy.type === 'gunner') {
      enemy.attackCooldown *= 0.65;
      enemy.damage *= 1.16;
      this.tintContainer(enemy.body, 0xff9f6a);
    }
    if (this.specialWave === 'burning') {
      enemy.burn = Math.max(enemy.burn, 1.6);
      enemy.speed *= 1.08;
      this.tintContainer(enemy.body, 0xff7b32);
    }
    if (this.specialWave === 'fog') {
      enemy.speed *= 1.08;
      enemy.body.setAlpha(0.78);
    }
  }

  private tintContainer(container: Phaser.GameObjects.Container, tint: number) {
    container.list.forEach((child) => {
      const target = child as Phaser.GameObjects.Shape & { setTint?: (value: number) => void };
      target.setTint?.(tint);
    });
  }

  private drawEnemy(type: EnemyType, color: number): Phaser.GameObjects.Container {
    const c = this.add.container(0, 0);
    if (type === 'bossTitan') {
      const titan = this.drawBossTitan(color);
      titan.setScale(2.2);
      return titan;
    }
    if (type === 'bossGunner') {
      const boss = this.drawGunnerEnemy(color);
      boss.setScale(1.85);
      return boss;
    }
    if (type === 'gunner') return this.drawGunnerEnemy(color);
    const scale = type === 'brute' ? 1.5 : type === 'runner' ? 0.96 : 1;
    const skin = color;
    const skinDark = type === 'brute' ? 0x4c5942 : 0x4f5b49;
    const skinLight = type === 'brute' ? 0xa8af86 : 0xa9af8b;
    const uniform = type === 'runner' ? 0x34333a : type === 'brute' ? 0x2e2932 : 0x2d3940;
    const uniformDark = 0x171b22;
    const gear = type === 'runner' ? 0x684239 : type === 'brute' ? 0x5b3534 : 0x514331;
    const gearLight = type === 'runner' ? 0xa1583f : type === 'brute' ? 0x8d4438 : 0x736143;
    const blood = 0x9d2c2f;
    const outline = 0x10141a;
    const px = (parent: Phaser.GameObjects.Container, x: number, y: number, w: number, h: number, fill: number, alpha = 1) => {
      const o = this.add.rectangle(x, y, w + 4, h + 4, outline, alpha).setOrigin(0.5);
      const f = this.add.rectangle(x, y, w, h, fill, alpha).setOrigin(0.5);
      parent.add([o, f]);
      return f;
    };
    const chip = (parent: Phaser.GameObjects.Container, x: number, y: number, w: number, h: number, fill: number, alpha = 1) => {
      const f = this.add.rectangle(x, y, w, h, fill, alpha).setOrigin(0.5);
      parent.add(f);
      return f;
    };

    c.setScale(scale);
    c.add(this.add.rectangle(0, type === 'brute' ? 38 : 34, type === 'brute' ? 58 : 43, type === 'brute' ? 14 : 11, 0x000000, 0.28));

    if (type === 'brute') {
      const leftLeg = this.add.container(-13, 31);
      const rightLeg = this.add.container(13, 31);
      px(leftLeg, 0, 0, 12, 24, uniformDark);
      chip(leftLeg, -2, -6, 5, 14, 0x3c3440);
      chip(leftLeg, 1, 14, 17, 6, 0x0d1118);
      px(rightLeg, 0, 0, 12, 24, uniformDark);
      chip(rightLeg, 2, -4, 5, 13, 0x3c3440);
      chip(rightLeg, 1, 14, 17, 6, 0x0d1118);

      const body = this.add.container(0, 2);
      px(body, 0, 3, 48, 42, uniform);
      px(body, -26, -2, 18, 23, skinDark);
      px(body, 26, -2, 18, 23, skinDark);
      chip(body, -6, 3, 36, 8, gear);
      chip(body, 0, 13, 30, 23, 0x574638);
      chip(body, -10, 11, 8, 24, 0x29212a);
      chip(body, 13, 7, 7, 14, gearLight);
      chip(body, -20, -11, 8, 8, blood);
      chip(body, 22, 13, 7, 11, blood);
      chip(body, 0, -11, 42, 5, 0x11151c);
      chip(body, -14, -4, 6, 6, 0x11151c);
      chip(body, 14, -4, 6, 6, 0x11151c);

      const leftArm = this.add.container(-39, 11);
      leftArm.setRotation(0.13);
      px(leftArm, 0, 0, 15, 35, skin);
      chip(leftArm, -4, -4, 5, 24, skinDark);
      px(leftArm, 0, 23, 17, 10, skinDark);
      chip(leftArm, 3, -15, 7, 8, blood);
      const rightArm = this.add.container(39, 11);
      rightArm.setRotation(-0.13);
      px(rightArm, 0, 0, 15, 35, skin);
      chip(rightArm, 4, -4, 5, 24, skinDark);
      px(rightArm, 0, 23, 17, 10, skinDark);

      const head = this.add.container(0, -33);
      px(head, 0, 0, 32, 28, skin);
      chip(head, -8, 0, 10, 22, skinDark);
      chip(head, 7, -16, 20, 7, skinDark);
      chip(head, -9, -18, 13, 8, skinDark);
      chip(head, 0, -9, 30, 7, 0x30372e);
      chip(head, -7, -3, 11, 8, 0xffa43a, 0.3);
      chip(head, 7, -3, 11, 8, 0xffa43a, 0.3);
      chip(head, -7, -3, 5, 5, 0xffdf55);
      chip(head, 7, -3, 5, 5, 0xffdf55);
      chip(head, 0, 7, 16, 6, 0x110d10);
      chip(head, -5, 8, 3, 5, 0xf0dfb8);
      chip(head, 4, 8, 3, 5, 0xf0dfb8);
      chip(head, 13, 2, 6, 8, blood);

      c.add([leftLeg, rightLeg, body, leftArm, rightArm, head]);
      c.setData('anim', { leftArm, rightArm, leftLeg, rightLeg, baseLean: 0, heavy: true });
      return c;
    }

    const runner = type === 'runner';
    const lean = runner ? -0.22 : -0.04;
    const leftLeg = this.add.container(runner ? -8 : -7, 28);
    leftLeg.setRotation(runner ? 0.5 : 0.12);
    px(leftLeg, 0, 0, 7, runner ? 20 : 17, 0x252a32);
    chip(leftLeg, -1, 11, 12, 5, 0x0d1118);
    const rightLeg = this.add.container(runner ? 9 : 8, 28);
    rightLeg.setRotation(runner ? -0.62 : -0.12);
    px(rightLeg, 0, 0, 7, runner ? 20 : 17, 0x30252d);
    chip(rightLeg, 1, 11, 12, 5, 0x0d1118);

    const body = this.add.container(0, 5);
    px(body, runner ? 2 : 0, 3, runner ? 20 : 25, runner ? 28 : 30, uniform);
    chip(body, runner ? -4 : -7, 1, 7, 24, uniformDark, 0.75);
    chip(body, runner ? 7 : 5, 1, 9, 24, gear);
    chip(body, runner ? 1 : 0, -6, runner ? 23 : 27, 5, 0x11151c);
    chip(body, runner ? -3 : -6, 10, 6, 6, 0x12161d);
    chip(body, runner ? 8 : 9, 13, 6, 8, blood, 0.9);
    chip(body, runner ? 0 : 0, 20, runner ? 22 : 27, 5, gearLight, 0.65);

    const leftArm = this.add.container(runner ? -17 : -18, 7);
    leftArm.setRotation(runner ? 0.96 : 0.42);
    px(leftArm, 0, 0, 7, runner ? 28 : 23, skinDark);
    chip(leftArm, -1, -7, 4, 14, skin);
    chip(leftArm, 0, 15, 8, 7, skin);
    const rightArm = this.add.container(runner ? 20 : 19, 7);
    rightArm.setRotation(runner ? -0.9 : -0.55);
    px(rightArm, 0, 0, 7, runner ? 28 : 23, skinDark);
    chip(rightArm, 1, -7, 4, 14, skin);
    chip(rightArm, 0, 15, 8, 7, skin);

    const head = this.add.container(runner ? 4 : 0, -20);
    px(head, 0, 0, runner ? 24 : 26, runner ? 23 : 24, skin);
    chip(head, -7, 1, 7, 18, skinDark, 0.78);
    chip(head, 4, -16, runner ? 20 : 22, 6, skinLight);
    chip(head, 10, -13, 9, 6, skinDark);
    chip(head, 0, -8, runner ? 25 : 27, 6, 0x30362f);
    chip(head, -6, -2, 9, 7, 0xff9f2e, 0.24);
    chip(head, 6, -2, 9, 7, 0xff9f2e, 0.24);
    chip(head, -6, -2, 4, 4, 0xffdf5a);
    chip(head, 6, -2, 4, 4, 0xffdf5a);
    chip(head, runner ? 3 : 0, 8, 10, 4, 0x110d10);
    chip(head, runner ? 11 : 10, 4, 5, 8, blood, 0.85);
    chip(head, -1, 13, 15, 5, skinDark);

    c.setRotation(lean);
    c.add([leftLeg, rightLeg, body, leftArm, rightArm, head]);
    c.setData('anim', { leftArm, rightArm, leftLeg, rightLeg, baseLean: lean, heavy: false, runner });
    return c;
  }

  private drawBossTitan(color: number) {
    const c = this.add.container(0, 0);
    const outline = 0x10141a;
    const px = (x: number, y: number, w: number, h: number, fill: number, alpha = 1) => {
      const o = this.add.rectangle(x, y, w + 4, h + 4, outline, alpha).setOrigin(0.5);
      const f = this.add.rectangle(x, y, w, h, fill, alpha).setOrigin(0.5);
      c.add([o, f]);
      return f;
    };
    c.add(this.add.rectangle(0, 45, 80, 18, 0x000000, 0.32));
    px(-16, 32, 14, 28, 0x171b22);
    px(16, 32, 14, 28, 0x201b22);
    px(0, 4, 54, 52, 0x2e2932);
    px(-33, 6, 18, 38, color);
    px(33, 6, 18, 38, color);
    px(0, -35, 36, 32, color);
    px(-8, -35, 10, 20, 0x4c5942);
    px(0, -10, 44, 7, 0x11151c);
    px(-10, -38, 6, 6, 0xffdf55);
    px(10, -38, 6, 6, 0xffdf55);
    px(0, -26, 20, 7, 0x110d10);
    px(0, 9, 38, 22, 0x574638);
    px(18, 13, 10, 13, 0x9d2c2f);
    return c;
  }

  private drawGunnerEnemy(color: number) {
    const c = this.add.container(0, 0);
    const outline = 0x10141a;
    const uniform = 0x2b3039;
    const vest = 0x6e2024;
    const skin = color;
    const skinDark = 0x585246;
    const metal = 0x151a22;
    const px = (parent: Phaser.GameObjects.Container, x: number, y: number, w: number, h: number, fill: number, alpha = 1) => {
      const o = this.add.rectangle(x, y, w + 4, h + 4, outline, alpha).setOrigin(0.5);
      const f = this.add.rectangle(x, y, w, h, fill, alpha).setOrigin(0.5);
      parent.add([o, f]);
      return f;
    };
    const chip = (parent: Phaser.GameObjects.Container, x: number, y: number, w: number, h: number, fill: number, alpha = 1) => {
      const f = this.add.rectangle(x, y, w, h, fill, alpha).setOrigin(0.5);
      parent.add(f);
      return f;
    };

    c.add(this.add.rectangle(0, 34, 45, 11, 0x000000, 0.28));
    const leftLeg = this.add.container(-8, 29);
    const rightLeg = this.add.container(8, 29);
    px(leftLeg, 0, 0, 8, 19, 0x1b2028);
    px(rightLeg, 0, 0, 8, 19, 0x242832);

    const body = this.add.container(0, 6);
    px(body, 0, 2, 26, 31, uniform);
    chip(body, 0, 1, 24, 21, vest);
    chip(body, -8, -3, 5, 24, 0x161b22);
    chip(body, 8, -3, 5, 24, 0x151a22);
    chip(body, 0, -12, 28, 5, 0x9f2a2f);
    chip(body, 8, 8, 6, 9, 0x9d2c2f, 0.8);

    const leftArm = this.add.container(-18, 6);
    leftArm.setRotation(0.24);
    px(leftArm, 0, 0, 7, 22, skinDark);
    const rightArm = this.add.container(20, 3);
    rightArm.setRotation(-0.48);
    px(rightArm, 0, 0, 8, 24, skin);
    const gun = this.add.container(14, 8);
    gun.add(this.add.rectangle(0, 0, 25, 7, outline).setOrigin(0.5));
    gun.add(this.add.rectangle(1, 0, 21, 4, metal).setOrigin(0.5));
    gun.add(this.add.rectangle(13, 0, 10, 3, 0x303845).setOrigin(0.5));
    rightArm.add(gun);

    const head = this.add.container(0, -20);
    px(head, 0, 0, 25, 23, skin);
    chip(head, -7, 0, 8, 18, skinDark, 0.8);
    chip(head, 0, -13, 29, 8, 0x222832);
    chip(head, 7, -18, 20, 7, 0x151a22);
    chip(head, -9, -15, 11, 5, 0x9f2a2f);
    chip(head, -5, -2, 5, 5, 0xffdf55);
    chip(head, 6, -2, 5, 5, 0xffdf55);
    chip(head, 4, 8, 13, 4, 0x110d10);

    c.add([leftLeg, rightLeg, body, leftArm, rightArm, head]);
    c.setData('anim', { leftArm, rightArm, leftLeg, rightLeg, gun, baseLean: -0.03, heavy: false, runner: false, gunner: true });
    return c;
  }

  private updatePlayer(dt: number) {
    const input = {
      x: Number(this.keys.D.isDown) - Number(this.keys.A.isDown),
      y: Number(this.keys.S.isDown) - Number(this.keys.W.isDown),
    };
    const len = Math.hypot(input.x, input.y) || 1;
    this.playerVel.x = input.x ? (input.x / len) * this.stats.speed : 0;
    this.playerVel.y = input.y ? (input.y / len) * this.stats.speed : 0;
    this.playerPos.x += this.playerVel.x * dt;
    this.playerPos.y += this.playerVel.y * dt;
    this.playerPos.x = Phaser.Math.Clamp(this.playerPos.x, -PLAYABLE_HALF_SIZE, PLAYABLE_HALF_SIZE);
    this.playerPos.y = Phaser.Math.Clamp(this.playerPos.y, -PLAYABLE_HALF_SIZE, PLAYABLE_HALF_SIZE);
    this.hp = Math.min(this.maxHp, this.hp + this.stats.regen * dt);
    this.shield = Math.min(this.stats.shield * 35, this.shield + this.stats.shield * 7 * dt);
    this.invulnTimer = Math.max(0, this.invulnTimer - dt);
    this.playerHitTimer = Math.max(0, this.playerHitTimer - dt);
    this.player.setPosition(this.playerPos.x, this.playerPos.y);
    const angle = Phaser.Math.Angle.Between(this.playerPos.x, this.playerPos.y, this.aim.x, this.aim.y);
    const facing = Math.cos(angle) < 0 ? -1 : 1;
    const moving = Math.hypot(this.playerVel.x, this.playerVel.y) > 1;
    const bob = Math.sin(this.elapsed * (moving ? 17 : 5)) * (moving ? 3 : 1);
    this.gunRecoil = Math.max(0, this.gunRecoil - dt * 18);
    this.player.setScale(facing, 1);
    this.player.setRotation(0);
    this.player.y = this.playerPos.y + bob;
    this.playerGun.setRotation(facing === -1 ? Math.PI - angle : angle);
    this.playerGun.setPosition(20 - this.gunRecoil, 7 + (this.firing ? -1 : 0));
    this.playerLegs[0].y = 27 + (moving ? Math.sin(this.elapsed * 18) * 3 : 0);
    this.playerLegs[1].y = 27 + (moving ? Math.sin(this.elapsed * 18 + Math.PI) * 3 : 0);
    this.player.setAlpha(this.playerHitTimer > 0 ? 0.55 : 1);
  }

  private updateShooting(dt: number) {
    this.equippedWeapons.forEach((slot) => (slot.cooldown = Math.max(0, slot.cooldown - dt)));
    if (!this.firing) return;
    const angle = Phaser.Math.Angle.Between(this.playerPos.x, this.playerPos.y, this.aim.x, this.aim.y);
    for (const slot of this.equippedWeapons) {
      if (slot.cooldown > 0) continue;
      const weapon = WEAPONS[slot.id];
      const tierDamage = 1 + (slot.level - 1) * 0.16;
      const tierFireRate = 1 + (slot.level - 1) * 0.08;
      slot.cooldown = 1 / (weapon.fireRate * tierFireRate * (slot.id === this.selectedWeapon ? this.stats.fireRate / weapon.fireRate : Math.sqrt(this.stats.fireRate / WEAPONS[this.selectedWeapon].fireRate)));
      const shots = this.getWeaponShotAngles(angle, weapon, slot.evolved);
      if (slot.id === this.selectedWeapon && this.stats.doubleShot > 0) shots.push(...shots.map((shot) => shot + 0.055));
      const damage = this.stats.damage * (weapon.damage / WEAPONS[this.selectedWeapon].damage) * tierDamage * (slot.evolved ? 1.18 : 1);
      shots.forEach((shotAngle) => this.spawnBullet(shotAngle, 'player', { damage }, weapon, slot.evolved));
      this.muzzleFx(angle);
      this.shellFx(angle);
      this.sfx.playWeaponShot(slot.id);
      this.gunRecoil = weapon.id === 'shotgun' || weapon.id === 'launcher' || weapon.id === 'railgun' ? 13 : weapon.id === 'smg' || weapon.id === 'minigun' ? 4 : 7;
      this.shake(35, weapon.shake);
    }
  }

  private getWeaponShotAngles(angle: number, weapon = WEAPONS[this.selectedWeapon], evolved = false) {
    const pelletCount = weapon.pellets + (weapon.id === 'shotgun' ? this.stats.pellets * 2 : 0);
    const spreadBonus = this.stats.spread > 0 ? 0.18 : 0;
    const angles: number[] = [];
    if (pelletCount > 1) {
      const arc = weapon.spreadAngle + spreadBonus + (evolved && weapon.id === 'shotgun' ? 0.08 : 0);
      for (let i = 0; i < pelletCount; i += 1) {
        const pct = pelletCount === 1 ? 0.5 : i / (pelletCount - 1);
        angles.push(angle - arc / 2 + arc * pct + Phaser.Math.FloatBetween(-weapon.inaccuracy, weapon.inaccuracy));
      }
      return angles;
    }
    const sprayControl = weapon.id === 'smg' || weapon.id === 'minigun' ? Math.max(0.34, 1 - this.stats.sprayControl * 0.18) : 1;
    angles.push(angle + Phaser.Math.FloatBetween(-weapon.inaccuracy * sprayControl, weapon.inaccuracy * sprayControl));
    if (this.stats.spread > 0) angles.push(angle - 0.18, angle + 0.18);
    return angles;
  }

  private spawnBullet(angle: number, owner: 'player' | 'secondary' = 'player', overrides: Partial<Pick<Bullet, 'damage' | 'fire' | 'poison' | 'freeze' | 'pierce' | 'ricochet' | 'explosive' | 'chain' | 'knockback'>> = {}, weapon = WEAPONS[this.selectedWeapon], evolved = false) {
    const speed = 720 * this.stats.bulletSpeed * (owner === 'player' ? weapon.bulletSpeed : 1);
    const spawn = { x: this.playerPos.x + Math.cos(angle) * 30, y: this.playerPos.y + Math.sin(angle) * 30 };
    const body = this.add.container(spawn.x, spawn.y);
    const size = this.stats.projectileSize * (owner === 'player' ? weapon.projectileSize : 0.75);
    const color = this.stats.fire ? 0xff7b32 : this.stats.poison ? 0x8aff6a : this.stats.freeze ? 0x8ee8ff : owner === 'player' ? weapon.color : 0x96f7ff;
    const slug = this.add.rectangle(0, 0, 15 * size, 5 * size, color);
    slug.setRotation(angle);
    body.add(slug);
    this.fxLayer.add(body);
    this.tracerFx(spawn, angle);
    this.bullets.push({
      pos: { ...spawn },
      vel: { x: Math.cos(angle) * speed, y: Math.sin(angle) * speed },
      damage: overrides.damage ?? this.stats.damage * (weapon.damage / WEAPONS[this.selectedWeapon].damage) * (evolved ? 1.18 : 1),
      radius: 8 * size,
      life: owner === 'player' && (weapon.id === 'shotgun' || weapon.id === 'flamethrower') ? 0.48 : 0.85 * this.stats.bulletSpeed,
      fire: overrides.fire ?? this.stats.fire + (weapon.id === 'flamethrower' ? 1 + Number(evolved) : 0),
      poison: overrides.poison ?? this.stats.poison + (weapon.id === 'smg' && evolved ? 2 : 0),
      freeze: overrides.freeze ?? this.stats.freeze,
      pierce: overrides.pierce ?? this.stats.pierce + (weapon.id === 'railgun' ? 4 + Number(evolved) * 2 : 0),
      ricochet: overrides.ricochet ?? this.stats.ricochet + (STARTING_WEAPONS.includes(weapon.id) && evolved ? 2 : 0) + (weapon.id === 'dualPistols' ? 1 : 0),
      explosive: overrides.explosive ?? (this.stats.explosive > 0 || weapon.id === 'launcher' || (weapon.id === 'shotgun' && evolved) || weapon.id === 'plasma'),
      chain: overrides.chain ?? (this.stats.chain > 0 || weapon.id === 'lightningCannon' || (weapon.id === 'railgun' && evolved)),
      knockback: overrides.knockback ?? (owner === 'player' ? weapon.knockback + this.stats.knockback * 0.35 : 0.8),
      owner,
      body,
    });
  }

  private updateWave(dt: number) {
    if (this.wavePhase === 'countdown') {
      this.waveTimer -= dt;
      if (this.waveTimer <= 0) this.startWave();
      return;
    }

    if (this.wavePhase === 'bossWarning') {
      this.waveTimer -= dt;
      if (this.waveTimer <= 0) this.spawnBoss();
      return;
    }

    if (this.wavePhase === 'complete') {
      this.waveTimer -= dt;
      if (this.waveTimer <= 0) {
        this.wavePhase = 'upgrade';
        this.waveUpgradePending = true;
        this.leveling = true;
        this.showUpgradeChoices(`WAVE ${this.wave} CLEARED`);
      }
      return;
    }

    if (this.wavePhase !== 'active') return;

    this.spawnCooldown -= dt;
    if (this.spawnCooldown <= 0 && this.waveSpawned < this.waveTarget) {
      this.spawnCooldown = this.getWaveSpawnDelay();
      this.spawnWaveEnemy();
    }

    if (this.waveSpawned >= this.waveTarget && this.enemies.length === 0) this.completeWave();
  }

  private startWave() {
    this.wave += 1;
    if (this.isBossWave()) {
      this.specialWave = 'none';
      this.nextSpecialWave = 'none';
      this.applySpecialWaveAtmosphere();
      this.wavePhase = 'bossWarning';
      this.waveTimer = 2.5;
      this.waveSpawned = 0;
      this.waveTarget = 1;
      this.spawnCooldown = 999;
      this.firing = false;
      this.popText(this.playerPos, 'BOSS INCOMING', '#ff3b32');
      this.shake(550, 0.008);
      return;
    }
    this.specialWave = this.rollSpecialWave();
    this.nextSpecialWave = 'none';
    this.applySpecialWaveAtmosphere();
    this.wavePhase = 'active';
    this.waveSpawned = 0;
    this.waveTarget = this.getWaveEnemyCount();
    this.spawnCooldown = 0.25;
    if (this.specialWave === 'none') {
      this.popText(this.playerPos, `WAVE ${this.wave}`, '#ffd166');
      this.shake(120, 0.003);
    } else {
      const meta = SPECIAL_WAVE_META[this.specialWave];
      this.popText(this.playerPos, meta.title, meta.color);
      this.shake(360, 0.007);
      this.soundtrack.levelUpStinger();
    }
  }

  private completeWave() {
    this.grantSpecialWaveReward();
    this.wavePhase = 'complete';
    this.waveTimer = 1.25;
    this.firing = false;
    this.hp = Math.min(this.maxHp, this.hp + 10 + this.wave * 2);
    this.popText(this.playerPos, 'WAVE COMPLETE', '#8aff6a');
    this.runStats.bestWave = Math.max(this.runStats.bestWave, this.wave);
    this.persistProgress();
    this.clearGroundHazards();
    this.specialWave = 'none';
    this.nextSpecialWave = 'none';
    this.applySpecialWaveAtmosphere();
  }

  private isBossWave() {
    return this.isBossWaveNumber(this.wave);
  }

  private getBossTier() {
    return Math.max(1, Math.floor(this.wave / 5));
  }

  private getBossTempo(enemy: Enemy) {
    return 1 + Math.max(0, enemy.bossTier - 1) * 0.2;
  }

  private spawnBoss() {
    this.wavePhase = 'active';
    this.waveSpawned = 1;
    this.waveTarget = 1;
    this.spawnCooldown = 999;
    const angle = Phaser.Math.FloatBetween(0, Math.PI * 2);
    const dist = 620;
    const type: EnemyType = this.wave % 10 === 0 ? 'bossGunner' : 'bossTitan';
    const boss = this.createEnemy(type, { x: this.playerPos.x + Math.cos(angle) * dist, y: this.playerPos.y + Math.sin(angle) * dist });
    if (type === 'bossGunner') boss.attackCooldown = 0.25 / this.getBossTempo(boss);
    else boss.attackCooldown = Math.max(0.35, 1.2 / this.getBossTempo(boss));
    this.enemies.push(boss);
    const tierLabel = boss.bossTier > 1 ? ` T${boss.bossTier}` : '';
    this.popText(this.playerPos, `${type === 'bossTitan' ? 'BRUTE TITAN' : 'INFECTED GUNNER'}${tierLabel}`, boss.bossTier >= 3 ? '#ff3b32' : '#ff6b45');
    this.shake(900, 0.012);
  }

  private beginNextWaveCountdown() {
    this.wavePhase = 'countdown';
    this.waveTimer = 3;
    this.waveUpgradePending = false;
    this.firing = false;
    this.nextSpecialWave = this.previewSpecialWave();
    this.applySpecialWaveAtmosphere();
    this.updateCursorMode();
  }

  private previewSpecialWave() {
    if (this.wave + 1 < 4 || this.isBossWaveNumber(this.wave + 1)) return 'none';
    if (this.wave - this.lastSpecialWave < 2) return 'none';
    return Math.random() < 0.34 ? Phaser.Utils.Array.GetRandom(['toxic', 'night', 'elite', 'gunnerRaid', 'burning', 'fog'] as SpecialWaveType[]) : 'none';
  }

  private rollSpecialWave() {
    const rolled = this.nextSpecialWave !== 'none' ? this.nextSpecialWave : this.previewSpecialWave();
    if (rolled !== 'none') this.lastSpecialWave = this.wave;
    return rolled;
  }

  private isBossWaveNumber(wave: number) {
    return wave > 0 && wave % 5 === 0;
  }

  private getWaveEnemyCount() {
    const late = Math.max(0, this.wave - 6);
    const base = 7 + this.wave * 4 + Math.floor(late * 1.7);
    const special = this.wave % 5 === 0 ? 6 + Math.floor(late * 0.7) : this.wave % 4 === 0 ? 9 + Math.floor(late * 0.5) : 0;
    const normalCount = base + special;
    if (this.specialWave === 'night') return Math.floor(normalCount * 1.45) + 8;
    if (this.specialWave === 'elite') return Math.max(6, Math.floor(normalCount * 0.48));
    if (this.specialWave === 'gunnerRaid') return Math.floor(normalCount * 0.86);
    if (this.specialWave === 'burning') return Math.floor(normalCount * 1.12);
    if (this.specialWave === 'toxic' || this.specialWave === 'fog') return Math.floor(normalCount * 1.04);
    return normalCount;
  }

  private getWaveSpawnDelay() {
    const late = Math.max(0, this.wave - 6);
    const pressure = 1 + this.wave * 0.1 + late * 0.055;
    const swarm = this.wave % 4 === 0 ? 0.62 : this.wave % 5 === 0 ? 0.74 : 1;
    const eventMul = {
      none: 1,
      toxic: 0.92,
      night: 0.52,
      elite: 1.45,
      gunnerRaid: 0.88,
      burning: 0.7,
      fog: 0.9,
    }[this.specialWave];
    return Math.max(0.075, (0.58 / pressure) * swarm * eventMul);
  }

  private spawnWaveEnemy() {
    const angle = Phaser.Math.FloatBetween(0, Math.PI * 2);
    const dist = Phaser.Math.Between(520, 740);
    const type = this.pickWaveEnemyType();
    this.waveSpawned += 1;
    this.enemies.push(this.createEnemy(type, { x: this.playerPos.x + Math.cos(angle) * dist, y: this.playerPos.y + Math.sin(angle) * dist }));
  }

  private pickWaveEnemyType(): EnemyType {
    if (this.specialWave === 'night') return Math.random() < 0.72 ? 'walker' : 'runner';
    if (this.specialWave === 'elite') return Math.random() < 0.72 ? 'brute' : this.wave >= 9 ? 'gunner' : 'runner';
    if (this.specialWave === 'gunnerRaid') return Math.random() < 0.48 ? 'gunner' : Math.random() < 0.72 ? 'runner' : 'walker';
    if (this.specialWave === 'burning') return Math.random() < 0.62 ? 'runner' : Math.random() < 0.82 ? 'walker' : 'brute';
    if (this.specialWave === 'toxic') return Math.random() < 0.5 ? 'walker' : Math.random() < 0.78 ? 'runner' : 'brute';
    if (this.specialWave === 'fog') return Math.random() < 0.45 ? 'runner' : Math.random() < 0.72 ? 'walker' : 'brute';
    if (this.wave < 3) return 'walker';
    if (this.wave % 5 === 0 && this.waveSpawned >= this.waveTarget - 1) return 'brute';
    const roll = Math.random();
    const late = Math.max(0, this.wave - 6);
    const activeGunners = this.enemies.filter((enemy) => enemy.type === 'gunner').length;
    const gunnerCap = this.wave >= 14 ? 3 : this.wave >= 10 ? 2 : 1;
    const gunnerChance = this.wave >= 9 && activeGunners < gunnerCap ? Math.min(0.045 + late * 0.003, 0.08) : 0;
    const bruteChance = Math.min(0.06 + this.wave * 0.018 + late * 0.012, 0.34);
    const runnerChance = this.wave % 4 === 0 ? 0.78 : Math.min(0.2 + this.wave * 0.038 + late * 0.012, 0.68);
    if (roll < gunnerChance) return 'gunner';
    if (this.wave >= 5 && roll < bruteChance) return 'brute';
    if (this.wave >= 3 && roll < runnerChance) return 'runner';
    return 'walker';
  }

  private updateEnemies(dt: number) {
    for (const enemy of this.enemies) {
      enemy.hitFlash = Math.max(0, enemy.hitFlash - dt);
      enemy.attackCooldown = Math.max(0, enemy.attackCooldown - dt);
      enemy.burstTimer = Math.max(0, enemy.burstTimer - dt);
      enemy.ringCooldown = Math.max(0, enemy.ringCooldown - dt);
      if (enemy.burn > 0) {
        enemy.burn -= dt;
        enemy.hp -= 10 * dt;
        if (Math.random() < 0.035) this.pixelSpark(enemy.pos, 0xb65a36);
      }
      if (enemy.poison > 0) {
        enemy.poison -= dt;
        enemy.hp -= 7 * dt;
      }
      if (this.specialWave === 'burning' && enemy.burn > 0 && Math.random() < 0.12) this.createGroundHazard('fire', enemy.pos, 38, 8, 1.6);
      if (this.specialWave === 'toxic' && Math.random() < 0.012) this.createGroundHazard('toxic', enemy.pos, 48, 6, 3.5);
      enemy.freeze = Math.max(0, enemy.freeze - dt);
      const angle = Phaser.Math.Angle.Between(enemy.pos.x, enemy.pos.y, this.playerPos.x, this.playerPos.y);
      const freezeMul = enemy.freeze > 0 ? 0.48 : 1;
      const playerDistance = Phaser.Math.Distance.Between(enemy.pos.x, enemy.pos.y, this.playerPos.x, this.playerPos.y);
      if (enemy.type === 'bossTitan') {
        this.updateBossTitan(enemy, angle, playerDistance, dt);
      } else if (enemy.type === 'bossGunner') {
        this.updateBossGunner(enemy, angle, playerDistance, dt);
      } else if (enemy.type === 'gunner') {
        if (enemy.burstShots > 0 && enemy.burstTimer <= 0) this.gunnerBurstShot(enemy, angle);
        const tooClose = playerDistance < 270;
        const tooFar = playerDistance > 470;
        const moveDir = tooClose ? angle + Math.PI : tooFar ? angle : 0;
        if (tooClose || tooFar) {
          enemy.vel.x += Math.cos(moveDir) * enemy.speed * freezeMul * dt * 6.2;
          enemy.vel.y += Math.sin(moveDir) * enemy.speed * freezeMul * dt * 6.2;
          enemy.aimTimer = enemy.burstShots > 0 ? enemy.aimTimer : Math.max(0, enemy.aimTimer - dt * 1.1);
        } else if (enemy.attackCooldown <= 0) {
          const strafeAngle = angle + Math.PI / 2;
          if (Math.random() < 0.006) enemy.strafeDir *= -1;
          enemy.vel.x += Math.cos(strafeAngle) * enemy.speed * enemy.strafeDir * dt * 2.6;
          enemy.vel.y += Math.sin(strafeAngle) * enemy.speed * enemy.strafeDir * dt * 2.6;
          enemy.aimTimer += dt;
          if (enemy.aimTimer > 0.16 && enemy.aimTimer < 0.22) this.gunnerAimFx(enemy);
          if (enemy.aimTimer >= 0.72) this.startGunnerBurst(enemy, angle);
        } else {
          enemy.aimTimer = 0;
          const strafeAngle = angle + Math.PI / 2;
          enemy.vel.x += Math.cos(strafeAngle) * enemy.speed * enemy.strafeDir * dt * 1.2;
          enemy.vel.y += Math.sin(strafeAngle) * enemy.speed * enemy.strafeDir * dt * 1.2;
        }
      } else {
        enemy.vel.x += Math.cos(angle) * enemy.speed * freezeMul * dt * 8;
        enemy.vel.y += Math.sin(angle) * enemy.speed * freezeMul * dt * 8;
      }
      enemy.vel.x *= Math.pow(0.05, dt);
      enemy.vel.y *= Math.pow(0.05, dt);
      enemy.pos.x += enemy.vel.x * dt;
      enemy.pos.y += enemy.vel.y * dt;
      const stride = enemy.type === 'runner' ? 17 : enemy.type === 'brute' || enemy.type === 'bossTitan' ? 7 : enemy.type === 'gunner' || enemy.type === 'bossGunner' ? 9 : 11;
      const bob = Math.sin(this.elapsed * stride + enemy.id) * (enemy.type === 'brute' ? 1.6 : 3);
      enemy.body.setPosition(enemy.pos.x, enemy.pos.y + bob);
      enemy.body.setScale(enemy.body.scaleX < 0 ? -Math.abs(enemy.body.scaleX) : Math.abs(enemy.body.scaleX), enemy.body.scaleY);
      enemy.body.scaleX = Math.cos(angle) < 0 ? -Math.abs(enemy.body.scaleX) : Math.abs(enemy.body.scaleX);
      const anim = enemy.body.getData('anim') as
        | {
            leftArm: Phaser.GameObjects.Container;
            rightArm: Phaser.GameObjects.Container;
            leftLeg: Phaser.GameObjects.Container;
            rightLeg: Phaser.GameObjects.Container;
            baseLean: number;
            heavy: boolean;
            runner?: boolean;
            gunner?: boolean;
            gun?: Phaser.GameObjects.Container;
          }
        | undefined;
      const cycle = Math.sin(this.elapsed * stride + enemy.id);
      enemy.body.setRotation((anim?.baseLean ?? 0) + cycle * (enemy.type === 'brute' ? 0.02 : 0.045));
      if (anim) {
        const armSwing = anim.heavy ? 0.16 : anim.runner ? 0.34 : 0.24;
        const legSwing = anim.heavy ? 0.08 : anim.runner ? 0.25 : 0.17;
        anim.leftArm.setRotation((anim.runner ? 0.96 : anim.heavy ? 0.13 : 0.42) + cycle * armSwing);
        anim.rightArm.setRotation((anim.runner ? -0.9 : anim.heavy ? -0.13 : -0.55) - cycle * armSwing);
        anim.leftLeg.setRotation((anim.runner ? 0.5 : 0.12) - cycle * legSwing);
        anim.rightLeg.setRotation((anim.runner ? -0.62 : -0.12) + cycle * legSwing);
        if (anim.gunner && anim.gun) {
          anim.rightArm.setRotation(enemy.aimTimer > 0 ? -0.86 : -0.48 - cycle * 0.08);
          anim.gun.setRotation(enemy.aimTimer > 0 ? 0.16 : 0);
        }
      }
      enemy.body.setAlpha(enemy.hitFlash > 0 ? 0.76 : 1);
      const touchingPlayer = Phaser.Math.Distance.Between(enemy.pos.x, enemy.pos.y, this.playerPos.x, this.playerPos.y) < enemy.radius + 18;
      if (enemy.type !== 'gunner' && enemy.type !== 'bossGunner' && touchingPlayer && enemy.attackCooldown <= 0) {
        enemy.attackCooldown = Math.max(0.28, 0.5 - this.stats.invuln * 0.08);
        this.damagePlayer(enemy.damage);
      }
    }
    const dead = this.enemies.filter((e) => e.hp <= 0);
    dead.forEach((enemy) => this.killEnemy(enemy));
    this.enemies = this.enemies.filter((e) => e.hp > 0);
  }

  private updateBullets(dt: number) {
    for (const bullet of this.bullets) {
      bullet.life -= dt;
      bullet.pos.x += bullet.vel.x * dt;
      bullet.pos.y += bullet.vel.y * dt;
      if (bullet.ricochet > 0 && Phaser.Math.Distance.Between(bullet.pos.x, bullet.pos.y, this.playerPos.x, this.playerPos.y) > 620) {
        bullet.ricochet -= 1;
        bullet.vel.x *= -1;
        bullet.vel.y *= -1;
        bullet.life += 0.28;
        this.pixelSpark(bullet.pos, 0xfff2a3);
      }
      bullet.body.setPosition(bullet.pos.x, bullet.pos.y);
      const hit = this.enemies.find((enemy) => Phaser.Math.Distance.Between(bullet.pos.x, bullet.pos.y, enemy.pos.x, enemy.pos.y) < bullet.radius + enemy.radius);
      if (!hit) continue;
      const crit = Math.random() < this.stats.critChance;
      const armorMul = hit.type === 'bossTitan' ? 0.5 : hit.type === 'bossGunner' ? 0.55 : hit.type === 'gunner' ? 0.58 : 1;
      const finalDamage = bullet.damage * (crit ? this.stats.critDamage : 1) * armorMul;
      hit.hp -= finalDamage;
      hit.hitFlash = 0.07;
      const knockMul = hit.type === 'bossTitan' || hit.type === 'bossGunner' ? 0.04 : hit.type === 'gunner' ? 0.12 : hit.type === 'brute' ? 0.16 : 0.34;
      hit.vel.x += bullet.vel.x * knockMul * bullet.knockback;
      hit.vel.y += bullet.vel.y * knockMul * bullet.knockback;
      if (bullet.fire) hit.burn = Math.max(hit.burn, 2.4);
      if (crit && this.stats.critBurn > 0) hit.burn = Math.max(hit.burn, 2.8);
      if (bullet.poison) hit.poison = Math.max(hit.poison, 3.2);
      if (bullet.freeze) hit.freeze = Math.max(hit.freeze, 1.35);
      this.damageNumber(hit.pos, Math.round(finalDamage));
      this.bloodFx(hit.pos, Math.atan2(bullet.vel.y, bullet.vel.x), hit.type === 'brute' ? 9 : 6);
      this.impactFx(bullet.pos, Math.atan2(bullet.vel.y, bullet.vel.x));
      this.hitStop = Math.max(this.hitStop, hit.type === 'brute' ? 0.055 : 0.028);
      this.shake(hit.type === 'brute' ? 70 : 38, hit.type === 'brute' ? 0.0045 : 0.0025);
      if (bullet.explosive) this.explosion(hit.pos, 84, bullet.damage * 0.55);
      if (bullet.chain) this.chainLightning(hit);
      bullet.pierce -= 1;
      if (bullet.pierce < 0) bullet.life = 0;
    }
    this.bullets = this.bullets.filter((bullet) => {
      const alive = bullet.life > 0;
      if (!alive) bullet.body.destroy();
      return alive;
    });
  }

  private updateBossTitan(enemy: Enemy, angle: number, distance: number, dt: number) {
    const tempo = this.getBossTempo(enemy);
    if (!enemy.rage && enemy.hp < enemy.maxHp * 0.5) {
      enemy.rage = true;
      enemy.speed *= 1.45;
      enemy.damage *= 1.35;
      enemy.attackCooldown = Math.min(enemy.attackCooldown, 1.15);
      enemy.ringCooldown = Math.min(enemy.ringCooldown, 0.7);
      enemy.body.setData('rageAura', true);
      this.popText(enemy.pos, 'RAGE MODE', '#ff3b32');
      this.explosion(enemy.pos, 130, 0);
      this.shake(620, 0.016);
      this.soundtrack.levelUpStinger();
    }
    if (enemy.rage && Math.random() < 0.18) {
      this.pixelSpark({ x: enemy.pos.x + Phaser.Math.FloatBetween(-55, 55), y: enemy.pos.y + Phaser.Math.FloatBetween(-65, 45) }, 0xff3b32);
    }
    if (enemy.bossMode === 'chargeWindup') {
      enemy.aimTimer -= dt;
      enemy.vel.x *= Math.pow(0.01, dt);
      enemy.vel.y *= Math.pow(0.01, dt);
      if (enemy.aimTimer <= 0) {
        enemy.bossMode = 'charge';
        enemy.aimTimer = (enemy.rage ? 0.52 : 0.62) / tempo;
        enemy.chargeHit = false;
        this.shake(220, enemy.rage ? 0.013 : 0.01);
      }
      return;
    }
    if (enemy.bossMode === 'charge') {
      const chargeSpeed = enemy.speed * (enemy.rage ? 18.5 : 15.5);
      enemy.vel.x += Math.cos(enemy.chargeAngle) * chargeSpeed * dt;
      enemy.vel.y += Math.sin(enemy.chargeAngle) * chargeSpeed * dt;
      if (Math.random() < 0.72) this.bossChargeTrail(enemy, enemy.chargeAngle);
      if (!enemy.chargeHit && distance < enemy.radius + 28) {
        enemy.chargeHit = true;
        this.damagePlayer(enemy.damage * (enemy.rage ? 1.85 : 1.65));
        this.shake(500, 0.022);
      }
      enemy.aimTimer -= dt;
      if (enemy.aimTimer <= 0) enemy.bossMode = 'none';
      return;
    }
    if (enemy.bossMode === 'ring') {
      enemy.aimTimer -= dt;
      enemy.vel.x *= Math.pow(0.02, dt);
      enemy.vel.y *= Math.pow(0.02, dt);
      if (enemy.aimTimer <= 0) {
        this.bossBulletRing(enemy);
        enemy.bossMode = 'none';
        enemy.ringCooldown = Phaser.Math.FloatBetween(enemy.rage ? 1.45 : 2.25, enemy.rage ? 2.15 : 3.25) / tempo;
      }
      return;
    }
    if (enemy.bossMode === 'slam') {
      enemy.aimTimer -= dt;
      if (enemy.aimTimer <= 0) {
        this.bossSlam(enemy);
        enemy.bossMode = 'none';
      }
      return;
    }
    enemy.vel.x += Math.cos(angle) * enemy.speed * dt * (enemy.rage ? 7.3 : 6.2);
    enemy.vel.y += Math.sin(angle) * enemy.speed * dt * (enemy.rage ? 7.3 : 6.2);
    if (enemy.attackCooldown <= 0) {
      if (enemy.ringCooldown <= 0 && distance > 150 && distance < 980) {
        enemy.bossMode = 'ring';
        enemy.aimTimer = (enemy.rage ? 0.38 : 0.52) / tempo;
        enemy.attackCooldown = Phaser.Math.FloatBetween(enemy.rage ? 0.75 : 1.15, enemy.rage ? 1.25 : 1.75) / tempo;
        this.bossRingTelegraph(enemy);
      } else if (distance < 230) {
        enemy.bossMode = 'slam';
        enemy.aimTimer = (enemy.rage ? 0.54 : 0.66) / tempo;
        enemy.attackCooldown = (enemy.rage ? 1.25 : 1.8) / tempo;
        this.bossTelegraph(enemy, 110, 0xff6b45);
      } else if (distance < 1180) {
        enemy.bossMode = 'chargeWindup';
        enemy.chargeAngle = angle;
        enemy.aimTimer = (enemy.rage ? 0.34 : 0.46) / tempo;
        enemy.attackCooldown = Phaser.Math.FloatBetween(enemy.rage ? 1.45 : 2.2, enemy.rage ? 2.05 : 3.2) / tempo;
        this.bossChargeTelegraph(enemy, enemy.chargeAngle);
      } else {
        this.bossAimedVolley(enemy, angle);
        enemy.attackCooldown = Phaser.Math.FloatBetween(enemy.rage ? 1.15 : 1.65, enemy.rage ? 1.75 : 2.35) / tempo;
      }
    }
  }

  private updateBossGunner(enemy: Enemy, angle: number, distance: number, dt: number) {
    const tempo = this.getBossTempo(enemy);
    if (!enemy.rage && enemy.hp < enemy.maxHp * 0.5) {
      enemy.rage = true;
      enemy.speed *= 1.38;
      enemy.damage *= 1.32;
      enemy.attackCooldown = Math.min(enemy.attackCooldown, 0.9);
      enemy.ringCooldown = Math.min(enemy.ringCooldown, 0.45);
      this.popText(enemy.pos, 'RAGE MODE', '#ff3b32');
      this.explosion(enemy.pos, 112, 0);
      this.shake(520, 0.014);
      this.soundtrack.levelUpStinger();
    }
    if (enemy.rage && Math.random() < 0.14) {
      this.pixelSpark({ x: enemy.pos.x + Phaser.Math.FloatBetween(-34, 34), y: enemy.pos.y + Phaser.Math.FloatBetween(-48, 30) }, 0xff3b32);
    }
    if (enemy.bossMode === 'chargeWindup') {
      enemy.aimTimer -= dt;
      enemy.vel.x *= Math.pow(0.02, dt);
      enemy.vel.y *= Math.pow(0.02, dt);
      if (enemy.aimTimer <= 0) {
        enemy.bossMode = 'charge';
        enemy.aimTimer = (enemy.rage ? 0.42 : 0.5) / tempo;
        enemy.chargeHit = false;
        this.shake(180, enemy.rage ? 0.011 : 0.008);
      }
      return;
    }
    if (enemy.bossMode === 'charge') {
      const chargeSpeed = enemy.speed * (enemy.rage ? 16.4 : 13.6);
      enemy.vel.x += Math.cos(enemy.chargeAngle) * chargeSpeed * dt;
      enemy.vel.y += Math.sin(enemy.chargeAngle) * chargeSpeed * dt;
      if (Math.random() < 0.62) this.bossChargeTrail(enemy, enemy.chargeAngle);
      if (!enemy.chargeHit && distance < enemy.radius + 26) {
        enemy.chargeHit = true;
        this.damagePlayer(enemy.damage * (enemy.rage ? 1.65 : 1.45));
        this.shake(420, 0.018);
      }
      enemy.aimTimer -= dt;
      if (enemy.aimTimer <= 0) enemy.bossMode = 'none';
      return;
    }
    if (enemy.bossMode === 'ring') {
      enemy.aimTimer -= dt;
      enemy.vel.x *= Math.pow(0.02, dt);
      enemy.vel.y *= Math.pow(0.02, dt);
      if (enemy.aimTimer <= 0) {
        this.bossBulletRing(enemy);
        enemy.bossMode = 'none';
        enemy.ringCooldown = Phaser.Math.FloatBetween(enemy.rage ? 1.35 : 2.15, enemy.rage ? 2.05 : 3.05) / tempo;
      }
      return;
    }
    if (enemy.burstShots > 0 && enemy.burstTimer <= 0) this.gunnerBurstShot(enemy, angle);
    const tooClose = distance < 360;
    const tooFar = distance > 620;
    const moveDir = tooClose ? angle + Math.PI : tooFar ? angle : angle + Math.PI / 2 * enemy.strafeDir;
    if (Math.random() < 0.004) enemy.strafeDir *= -1;
    enemy.vel.x += Math.cos(moveDir) * enemy.speed * dt * (tooClose || tooFar ? 6.4 : 3.3);
    enemy.vel.y += Math.sin(moveDir) * enemy.speed * dt * (tooClose || tooFar ? 6.4 : 3.3);
    if (enemy.attackCooldown <= 0) {
      this.gunnerAimFx(enemy);
      if (enemy.ringCooldown <= 0 && distance > 170 && distance < 920 && Math.random() < (enemy.rage ? 0.38 : 0.28)) {
        enemy.bossMode = 'ring';
        enemy.aimTimer = (enemy.rage ? 0.32 : 0.46) / tempo;
        enemy.attackCooldown = Phaser.Math.FloatBetween(enemy.rage ? 0.65 : 1.05, enemy.rage ? 1.1 : 1.55) / tempo;
        this.bossRingTelegraph(enemy);
        return;
      }
      if (distance > 260 && distance < 980 && Math.random() < (enemy.rage ? 0.28 : 0.16)) {
        enemy.bossMode = 'chargeWindup';
        enemy.chargeAngle = angle;
        enemy.aimTimer = (enemy.rage ? 0.28 : 0.38) / tempo;
        enemy.attackCooldown = Phaser.Math.FloatBetween(enemy.rage ? 1.25 : 1.9, enemy.rage ? 1.85 : 2.8) / tempo;
        this.bossChargeTelegraph(enemy, enemy.chargeAngle);
        return;
      }
      if (Math.random() < (enemy.rage ? 0.62 : 0.52)) this.bossGunnerSpread(enemy, angle);
      else this.startGunnerBurst(enemy, angle);
      enemy.attackCooldown = Phaser.Math.FloatBetween(enemy.rage ? 0.72 : 1.05, enemy.rage ? 1.08 : 1.45) / tempo;
      enemy.aimTimer = 0;
      if (Math.random() < (enemy.rage ? 0.26 : 0.16)) this.summonBossMinions(enemy);
    } else {
      enemy.aimTimer = 0;
    }
  }

  private bossTelegraph(enemy: Enemy, radius: number, color: number) {
    const ring = this.add.circle(enemy.pos.x, enemy.pos.y, radius, color, 0.12).setStrokeStyle(4, color, 0.55);
    this.fxLayer.add(ring);
    this.tweens.add({ targets: ring, alpha: 0, scale: 1.25, duration: 650, onComplete: () => ring.destroy() });
  }

  private bossChargeTelegraph(enemy: Enemy, angle: number) {
    const line = this.add.rectangle(enemy.pos.x + Math.cos(angle) * 170, enemy.pos.y + Math.sin(angle) * 170, 360, 12, 0xff3b32, 0.42);
    line.setRotation(angle);
    this.fxLayer.add(line);
    this.tweens.add({ targets: line, alpha: 0, scaleX: 1.35, duration: enemy.rage ? 410 : 540, onComplete: () => line.destroy() });
    const eye = this.add.circle(enemy.pos.x + Math.cos(angle) * 34, enemy.pos.y + Math.sin(angle) * 34, 12, 0xfff2a3, 0.92);
    this.fxLayer.add(eye);
    this.tweens.add({ targets: eye, alpha: 0, scale: 2.4, duration: enemy.rage ? 330 : 450, onComplete: () => eye.destroy() });
  }

  private bossChargeTrail(enemy: Enemy, angle: number) {
    const backAngle = angle + Math.PI + Phaser.Math.FloatBetween(-0.52, 0.52);
    const pos = {
      x: enemy.pos.x + Math.cos(backAngle) * Phaser.Math.FloatBetween(enemy.radius * 0.25, enemy.radius * 0.85),
      y: enemy.pos.y + Math.sin(backAngle) * Phaser.Math.FloatBetween(enemy.radius * 0.25, enemy.radius * 0.85),
    };
    const dust = this.add.circle(pos.x, pos.y, Phaser.Math.Between(5, 12), enemy.rage ? 0xff4a34 : 0xc79c72, enemy.rage ? 0.46 : 0.34);
    this.fxLayer.add(dust);
    this.tweens.add({ targets: dust, alpha: 0, scale: Phaser.Math.FloatBetween(1.8, 3.2), duration: Phaser.Math.Between(260, 430), onComplete: () => dust.destroy() });
  }

  private bossRingTelegraph(enemy: Enemy) {
    this.popText(enemy.pos, 'BULLET RING', '#ff6b45');
    const radius = enemy.type === 'bossTitan' ? 142 : 108;
    const ring = this.add.circle(enemy.pos.x, enemy.pos.y, radius, 0xff3b32, 0.08).setStrokeStyle(5, 0xffc0a3, 0.72);
    this.fxLayer.add(ring);
    this.tweens.add({ targets: ring, alpha: 0, scale: 0.58, duration: enemy.rage ? 460 : 620, onComplete: () => ring.destroy() });
  }

  private bossBulletRing(enemy: Enemy) {
    const tierBonus = Math.max(0, enemy.bossTier - 1);
    const count = (enemy.rage ? (enemy.type === 'bossTitan' ? 34 : 32) : enemy.type === 'bossTitan' ? 26 : 24) + tierBonus * 4;
    const speed = (enemy.rage ? 430 : 360) + tierBonus * 36;
    const offset = Phaser.Math.FloatBetween(0, Math.PI * 2);
    for (let i = 0; i < count; i += 1) {
      if (i % (enemy.rage ? 9 : 7) === 0) continue;
      const shotAngle = offset + (i / count) * Math.PI * 2;
      this.fireBossRingShot(enemy, shotAngle, speed, enemy.damage * (enemy.rage ? 0.68 : 0.58));
    }
    if (enemy.rage) {
      const secondCount = (enemy.type === 'bossTitan' ? 18 : 16) + tierBonus * 2;
      this.time.delayedCall(260, () => {
        if (!this.enemies.includes(enemy) || enemy.hp <= 0) return;
        for (let i = 0; i < secondCount; i += 1) {
          if (i % 6 === 0) continue;
          const shotAngle = offset + Math.PI / secondCount + (i / secondCount) * Math.PI * 2;
          this.fireBossRingShot(enemy, shotAngle, speed * 0.86, enemy.damage * 0.52);
        }
      });
    }
    for (let i = 0; i < 28; i += 1) {
      this.pixelSparkDirected(enemy.pos, (i / 28) * Math.PI * 2, Phaser.Math.Between(90, 230), enemy.rage ? 0xff3b32 : 0xff8a5c, 5);
    }
    this.shake(300, enemy.rage ? 0.014 : 0.01);
  }

  private fireBossRingShot(enemy: Enemy, shotAngle: number, speed: number, damage: number) {
    const spawn = { x: enemy.pos.x + Math.cos(shotAngle) * (enemy.radius + 18), y: enemy.pos.y + Math.sin(shotAngle) * (enemy.radius + 18) };
    const body = this.add.container(spawn.x, spawn.y);
    body.add(this.add.circle(0, 0, 10, 0xff593f, 0.96).setStrokeStyle(3, 0xfff2a3, 0.9));
    body.add(this.add.circle(0, 0, 4, 0xfff2a3, 0.85));
    this.fxLayer.add(body);
    this.enemyProjectiles.push({
      pos: { ...spawn },
      vel: { x: Math.cos(shotAngle) * speed, y: Math.sin(shotAngle) * speed },
      damage,
      radius: 10,
      life: 2.7,
      body,
    });
  }

  private bossAimedVolley(enemy: Enemy, angle: number) {
    this.popText(enemy.pos, 'VOLLEY', '#ff6b45');
    this.gunnerAimFx(enemy);
    const tierBonus = Math.max(0, enemy.bossTier - 1);
    const spread = enemy.rage || enemy.bossTier >= 3 ? [-0.26, -0.13, 0, 0.13, 0.26] : [-0.18, 0, 0.18];
    spread.forEach((offset, index) => {
      this.time.delayedCall(index * 70, () => {
        if (!this.enemies.includes(enemy) || enemy.hp <= 0) return;
        const freshAngle = Phaser.Math.Angle.Between(enemy.pos.x, enemy.pos.y, this.playerPos.x, this.playerPos.y);
        this.fireEnemyShot(enemy, freshAngle + offset, (enemy.rage ? 500 : 440) + tierBonus * 30, enemy.damage * (enemy.rage ? 0.76 : 0.66));
      });
    });
  }

  private bossSlam(enemy: Enemy) {
    this.explosion(enemy.pos, 150, 0);
    const d = Phaser.Math.Distance.Between(enemy.pos.x, enemy.pos.y, this.playerPos.x, this.playerPos.y);
    if (d < 180) {
      const angle = Phaser.Math.Angle.Between(enemy.pos.x, enemy.pos.y, this.playerPos.x, this.playerPos.y);
      this.playerPos.x += Math.cos(angle) * 80;
      this.playerPos.y += Math.sin(angle) * 80;
      this.damagePlayer(enemy.damage * (1 - d / 230));
    }
    for (let i = 0; i < 18; i += 1) {
      this.pixelSparkDirected(enemy.pos, (i / 18) * Math.PI * 2, Phaser.Math.Between(85, 190), 0xff8a5c, 6);
    }
    this.shake(420, 0.018);
  }

  private bossGunnerSpread(enemy: Enemy, angle: number) {
    const tempo = this.getBossTempo(enemy);
    const tierBonus = Math.max(0, enemy.bossTier - 1);
    enemy.attackCooldown = Phaser.Math.FloatBetween(enemy.rage ? 0.85 : 1.25, enemy.rage ? 1.35 : 1.85) / tempo;
    enemy.aimTimer = 0;
    this.popText(enemy.pos, 'SPREAD SHOT', '#ff6b45');
    const pattern = enemy.rage || enemy.bossTier >= 3 ? [-0.48, -0.34, -0.22, -0.11, 0, 0.11, 0.22, 0.34, 0.48] : [-0.34, -0.2, -0.09, 0.09, 0.2, 0.34];
    pattern.forEach((offset) => this.fireEnemyShot(enemy, angle + offset, (enemy.rage ? 500 : 445) + tierBonus * 34, enemy.damage * (enemy.rage ? 0.95 : 0.86)));
    if (enemy.rage || enemy.bossTier >= 3) {
      this.time.delayedCall(220, () => {
        if (!this.enemies.includes(enemy) || enemy.hp <= 0) return;
        const freshAngle = Phaser.Math.Angle.Between(enemy.pos.x, enemy.pos.y, this.playerPos.x, this.playerPos.y);
        [-0.24, -0.08, 0.08, 0.24].forEach((offset) => this.fireEnemyShot(enemy, freshAngle + offset, 470 + tierBonus * 30, enemy.damage * 0.72));
      });
    }
  }

  private summonBossMinions(enemy: Enemy) {
    for (let i = 0; i < 3; i += 1) {
      const angle = Phaser.Math.FloatBetween(0, Math.PI * 2);
      const pos = { x: enemy.pos.x + Math.cos(angle) * 90, y: enemy.pos.y + Math.sin(angle) * 90 };
      this.enemies.push(this.createEnemy(i === 0 ? 'runner' : 'walker', pos));
    }
    this.popText(enemy.pos, 'SUMMON', '#ff8a5c');
  }

  private gunnerAimFx(enemy: Enemy) {
    const angle = Phaser.Math.Angle.Between(enemy.pos.x, enemy.pos.y, this.playerPos.x, this.playerPos.y);
    const pos = { x: enemy.pos.x + Math.cos(angle) * 35, y: enemy.pos.y + Math.sin(angle) * 35 - 2 };
    const glow = this.add.circle(pos.x, pos.y, 6, 0xff6b45, 0.75);
    this.fxLayer.add(glow);
    this.tweens.add({ targets: glow, alpha: 0, scale: 1.8, duration: 260, onComplete: () => glow.destroy() });
    const laser = this.add.rectangle(enemy.pos.x + Math.cos(angle) * 130, enemy.pos.y + Math.sin(angle) * 130 - 2, 240, 3, 0xff3b32, 0.34);
    laser.setRotation(angle);
    this.fxLayer.add(laser);
    this.tweens.add({ targets: laser, alpha: 0, scaleX: 1.12, duration: 420, onComplete: () => laser.destroy() });
  }

  private startGunnerBurst(enemy: Enemy, angle: number) {
    const tempo = this.getBossTempo(enemy);
    enemy.aimTimer = 0;
    enemy.attackCooldown = Phaser.Math.FloatBetween(enemy.rage ? 0.95 : 1.35, enemy.rage ? 1.45 : 1.95) / tempo;
    enemy.burstShots = enemy.type === 'bossGunner' ? (enemy.rage ? 8 : 6) + Math.max(0, enemy.bossTier - 1) : 3;
    enemy.burstTimer = 0;
    this.popText(enemy.pos, 'GUNNER!', '#ff6b45');
    this.gunnerBurstShot(enemy, angle);
  }

  private gunnerBurstShot(enemy: Enemy, angle: number) {
    if (enemy.burstShots <= 0) return;
    enemy.burstShots -= 1;
    const tempo = this.getBossTempo(enemy);
    enemy.burstTimer = (enemy.type === 'bossGunner' ? (enemy.rage ? 0.095 : 0.125) : 0.18) / tempo;
    const shotAngle = angle + Phaser.Math.FloatBetween(enemy.type === 'bossGunner' ? -0.085 : -0.045, enemy.type === 'bossGunner' ? 0.085 : 0.045);
    this.fireEnemyShot(enemy, shotAngle, (enemy.type === 'bossGunner' ? (enemy.rage ? 560 : 500) : 390) + Math.max(0, enemy.bossTier - 1) * 32, enemy.damage * (enemy.type === 'bossGunner' ? 1.05 : 1));
  }

  private fireEnemyShot(enemy: Enemy, shotAngle: number, speed: number, damage: number) {
    const spawn = { x: enemy.pos.x + Math.cos(shotAngle) * 38, y: enemy.pos.y + Math.sin(shotAngle) * 38 - 2 };
    const body = this.add.container(spawn.x, spawn.y);
    const tracer = this.add.rectangle(0, 0, enemy.type === 'bossGunner' || enemy.type === 'bossTitan' ? 36 : 28, enemy.type === 'bossGunner' || enemy.type === 'bossTitan' ? 7 : 5, 0xffc0a3, 0.98);
    tracer.setRotation(shotAngle);
    body.add(tracer);
    this.fxLayer.add(body);
    this.enemyProjectiles.push({
      pos: { ...spawn },
      vel: { x: Math.cos(shotAngle) * speed, y: Math.sin(shotAngle) * speed },
      damage,
      radius: enemy.type === 'bossGunner' || enemy.type === 'bossTitan' ? 10 : 8,
      life: 2.45,
      body,
    });
    const flash = this.add.star(spawn.x, spawn.y, 5, 4, 17, 0xff6b45, 0.9);
    flash.setRotation(shotAngle);
    this.fxLayer.add(flash);
    this.tweens.add({ targets: flash, alpha: 0, scale: 1.5, duration: 95, onComplete: () => flash.destroy() });
    this.sfx.playWeaponShot('pistol', true);
  }

  private updateEnemyProjectiles(dt: number) {
    for (const shot of this.enemyProjectiles) {
      shot.life -= dt;
      shot.pos.x += shot.vel.x * dt;
      shot.pos.y += shot.vel.y * dt;
      shot.body.setPosition(shot.pos.x, shot.pos.y);
      if (Phaser.Math.Distance.Between(shot.pos.x, shot.pos.y, this.playerPos.x, this.playerPos.y) < shot.radius + 16) {
        this.enemyBulletImpact(shot.pos, Math.atan2(shot.vel.y, shot.vel.x));
        this.damagePlayer(shot.damage);
        shot.life = 0;
      }
    }
    this.enemyProjectiles = this.enemyProjectiles.filter((shot) => {
      const alive = shot.life > 0;
      if (!alive) shot.body.destroy();
      return alive;
    });
  }

  private enemyBulletImpact(pos: Vec2, angle: number) {
    const flash = this.add.circle(pos.x, pos.y, 10, 0xff6b45, 0.75);
    this.fxLayer.add(flash);
    this.tweens.add({ targets: flash, alpha: 0, scale: 1.8, duration: 120, onComplete: () => flash.destroy() });
    for (let i = 0; i < 5; i += 1) {
      this.pixelSparkDirected(pos, angle + Math.PI + Phaser.Math.FloatBetween(-0.8, 0.8), Phaser.Math.Between(35, 80), 0xff8a5c, 3);
    }
  }

  private updateGems(dt: number) {
    for (const gem of this.gems) {
      gem.age += dt;
      const d = Phaser.Math.Distance.Between(gem.pos.x, gem.pos.y, this.playerPos.x, this.playerPos.y);
      if (d < 170) {
        const a = Phaser.Math.Angle.Between(gem.pos.x, gem.pos.y, this.playerPos.x, this.playerPos.y);
        const pull = d < 56 ? 580 : 260;
        gem.pos.x += Math.cos(a) * pull * dt;
        gem.pos.y += Math.sin(a) * pull * dt;
      }
      gem.body.setPosition(gem.pos.x, gem.pos.y + Math.sin(gem.age * 8) * 4);
      gem.body.setScale(1 + Math.sin(gem.age * 7) * 0.08);
    }
    const collected = this.gems.filter((gem) => Phaser.Math.Distance.Between(gem.pos.x, gem.pos.y, this.playerPos.x, this.playerPos.y) < 28);
    collected.forEach((gem) => {
      this.xp += gem.value;
      gem.body.destroy();
      this.popText(this.playerPos, `+${gem.value} XP`, '#78f7ff');
      while (this.xp >= this.xpNeed) {
        this.xp -= this.xpNeed;
        this.level += 1;
        this.xpNeed = Math.floor(this.xpNeed * 1.28 + 12);
      }
    });
    this.gems = this.gems.filter((gem) => !collected.includes(gem));
  }

  private updateCoins(dt: number) {
    for (const coin of this.coinDrops) {
      coin.age += dt;
      const d = Phaser.Math.Distance.Between(coin.pos.x, coin.pos.y, this.playerPos.x, this.playerPos.y);
      const previous = { x: coin.pos.x, y: coin.pos.y };
      if (d < 210) {
        const a = Phaser.Math.Angle.Between(coin.pos.x, coin.pos.y, this.playerPos.x, this.playerPos.y);
        const distanceFactor = 1 - Phaser.Math.Clamp(d / 210, 0, 1);
        const pull = Phaser.Math.Linear(170, 780, distanceFactor * distanceFactor);
        coin.pos.x += Math.cos(a) * pull * dt;
        coin.pos.y += Math.sin(a) * pull * dt;
      }
      const moved = Phaser.Math.Distance.Between(previous.x, previous.y, coin.pos.x, coin.pos.y);
      const rollDir = coin.pos.x >= previous.x ? 1 : -1;
      coin.body.rotation += moved * 0.08 * rollDir;
      coin.body.setPosition(coin.pos.x, coin.pos.y + Math.sin(coin.age * 10) * 2);
      coin.body.setScale(1 + Math.sin(coin.body.rotation * 2.5) * 0.14, 1 + Math.cos(coin.body.rotation * 2.5) * 0.06);
    }
    const collected = this.coinDrops.filter((coin) => Phaser.Math.Distance.Between(coin.pos.x, coin.pos.y, this.playerPos.x, this.playerPos.y) < 26);
    collected.forEach((coin) => {
      this.coins += coin.value;
      coin.body.destroy();
      this.popText({ x: this.playerPos.x, y: this.playerPos.y - 34 }, `+${coin.value} COINS`, '#ffd166');
    });
    this.coinDrops = this.coinDrops.filter((coin) => !collected.includes(coin));
  }

  private updateOrbitals(dt: number) {
    if (!this.stats.orbit) return;
    const radius = 86 + this.stats.orbitSize * 18;
    const count = this.stats.orbit;
    for (let i = 0; i < count; i += 1) {
      const angle = this.elapsed * (4.2 + this.stats.orbitSpeed * 0.9) + (i / count) * Math.PI * 2;
      const pos = { x: this.playerPos.x + Math.cos(angle) * radius, y: this.playerPos.y + Math.sin(angle) * radius };
      if (Math.random() < 0.2) this.pixelSpark(pos, 0xb8f7ff);
      for (const enemy of this.enemies) {
        if (Phaser.Math.Distance.Between(pos.x, pos.y, enemy.pos.x, enemy.pos.y) < enemy.radius + 14 + this.stats.orbitSize * 3) {
          enemy.hp -= (28 + this.stats.orbitSpeed * 4 + this.stats.orbitSize * 5) * dt;
          enemy.hitFlash = 0.05;
        }
      }
    }
  }

  private updateDrone(dt: number) {
    if (!this.stats.drone) return;
    this.droneCooldown -= dt;
    if (this.droneCooldown > 0) return;
    const target = this.enemies.sort((a, b) => Phaser.Math.Distance.Between(a.pos.x, a.pos.y, this.playerPos.x, this.playerPos.y) - Phaser.Math.Distance.Between(b.pos.x, b.pos.y, this.playerPos.x, this.playerPos.y))[0];
    if (!target) return;
    this.droneCooldown = Math.max(0.12, 0.36 - this.stats.droneFireRate * 0.055);
    const angle = Phaser.Math.Angle.Between(this.playerPos.x, this.playerPos.y, target.pos.x, target.pos.y);
    this.spawnBullet(angle, 'secondary', { damage: 9 + this.stats.damage * 0.28, knockback: 0.45, pierce: 0, ricochet: 0, explosive: false });
    this.sfx.playWeaponShot('rapidPistol', true);
  }

  private updateSpecials(dt: number) {
    if (this.stats.turret > 0) {
      this.turretCooldown -= dt;
      if (this.turretCooldown <= 0) {
        const target = this.enemies.find((enemy) => Phaser.Math.Distance.Between(enemy.pos.x, enemy.pos.y, this.playerPos.x, this.playerPos.y) < 430);
        if (target) {
          this.turretCooldown = 0.52 / this.stats.turret;
          this.spawnBullet(Phaser.Math.Angle.Between(this.playerPos.x, this.playerPos.y, target.pos.x, target.pos.y), 'secondary', { damage: 13 + this.stats.damage * 0.32, knockback: 0.8, pierce: 0, ricochet: 0 });
          this.sfx.playWeaponShot('pistol', true);
          this.pixelSpark({ x: this.playerPos.x - 24, y: this.playerPos.y - 24 }, 0xffd166);
        }
      }
    }

    if (this.stats.fireAura > 0) {
      for (const enemy of this.enemies) {
        if (Phaser.Math.Distance.Between(enemy.pos.x, enemy.pos.y, this.playerPos.x, this.playerPos.y) < 86 + this.stats.fireAura * 12) {
          enemy.burn = Math.max(enemy.burn, 1.3);
          enemy.hp -= 7 * this.stats.fireAura * dt;
          if (Math.random() < 0.08) this.pixelSpark(enemy.pos, 0xff7b32);
        }
      }
    }

    if (this.stats.lightningAura > 0) {
      this.auraCooldown -= dt;
      if (this.auraCooldown <= 0) {
        this.auraCooldown = Math.max(0.55, 1.4 - this.stats.lightningAura * 0.18);
        const targets = this.enemies
          .filter((enemy) => Phaser.Math.Distance.Between(enemy.pos.x, enemy.pos.y, this.playerPos.x, this.playerPos.y) < 260)
          .slice(0, 2 + this.stats.lightningAura + this.stats.lightningChain);
        targets.forEach((enemy) => {
          enemy.hp -= 24 + this.stats.damage * 0.25;
          enemy.hitFlash = 0.1;
          const line = this.add.line(0, 0, this.playerPos.x, this.playerPos.y, enemy.pos.x, enemy.pos.y, 0x96f7ff, 0.75).setLineWidth(4);
          this.fxLayer.add(line);
          this.tweens.add({ targets: line, alpha: 0, duration: 120, onComplete: () => line.destroy() });
        });
      }
    }
  }

  private updateSoundtrack() {
    const wavePressure = Phaser.Math.Clamp(this.wave / 8, 0, 0.45);
    const enemyPressure = Phaser.Math.Clamp(this.enemies.length / Math.max(10, this.waveTarget || 10), 0, 0.42);
    const elitePressure = this.wave % 5 === 0 && this.wavePhase === 'active' ? 0.18 : 0;
    const bossPressure = this.enemies.some((enemy) => enemy.type === 'bossTitan' || enemy.type === 'bossGunner') ? 0.2 : 0;
    const ragePressure = this.enemies.some((enemy) => enemy.rage) ? 0.18 : 0;
    const specialPressure = this.specialWave === 'none' ? 0 : this.specialWave === 'night' || this.specialWave === 'burning' ? 0.18 : 0.12;
    const healthPressure = this.hp / this.maxHp < 0.34 ? 0.22 : 0;
    const combatPressure = this.wavePhase === 'active' ? 0.12 : -0.08;
    this.soundtrack.update(wavePressure + enemyPressure + elitePressure + bossPressure + ragePressure + specialPressure + healthPressure + combatPressure, this.hp / this.maxHp < 0.24 || ragePressure > 0 || specialPressure > 0.15);
  }

  private killEnemy(enemy: Enemy) {
    const bossKilled = enemy.type === 'bossTitan' || enemy.type === 'bossGunner';
    this.score += 1;
    this.hp = Math.min(this.maxHp, this.hp + this.stats.lifesteal);
    this.dropCoins(enemy);
    if (this.isWeaponEvolved('flamethrower') && enemy.burn > 0) this.explosion(enemy.pos, 74, 18 + this.stats.damage * 0.35);
    if (this.stats.poisonSpread > 0 && enemy.poison > 0) this.spreadPoison(enemy);
    if (this.stats.deathBurst > 0 && Math.random() < 0.34) this.explosion(enemy.pos, 58, 12 + this.stats.damage * 0.22);
    if (this.specialWave === 'toxic' && !bossKilled) this.createGroundHazard('toxic', enemy.pos, enemy.type === 'brute' ? 70 : 48, 8, 5.6);
    if (this.specialWave === 'burning' && !bossKilled) {
      this.createGroundHazard('fire', enemy.pos, enemy.type === 'brute' ? 64 : 44, 11, 3.8);
      if (enemy.type === 'brute' || Math.random() < 0.28) this.explosion(enemy.pos, 58, 9 + this.wave * 0.7);
    }
    this.deathFx(enemy);
    if (bossKilled) this.bossReward(enemy);
    else this.gainXp(enemy.type === 'brute' ? 12 : enemy.type === 'runner' ? 5 : enemy.type === 'gunner' ? 10 : 3, enemy.pos);
  }

  private bossReward(enemy: Enemy) {
    this.explosion(enemy.pos, 190, 0);
    this.hp = this.maxHp;
    this.xp += this.xpNeed;
    this.popText(this.playerPos, 'BOSS DEFEATED - FULL HEAL', '#ff6b45');
    this.leveling = true;
    this.waveUpgradePending = true;
    this.showUpgradeChoices('BOSS REWARD');
  }

  private grantSpecialWaveReward() {
    if (this.specialWave === 'none') return;
    const meta = SPECIAL_WAVE_META[this.specialWave];
    const bonusCoins = meta.bonus + Math.floor(this.wave * 2.5);
    const bonusXp = 12 + Math.floor(this.wave * 1.6);
    this.coins += bonusCoins;
    this.xp += bonusXp * this.stats.magnet;
    this.specialRewardPending = true;
    this.popText(this.playerPos, `${meta.title} BONUS +${bonusCoins} COINS`, meta.color);
  }

  private dropCoins(enemy: Enemy) {
    const boss = enemy.type === 'bossTitan' || enemy.type === 'bossGunner';
    const baseValue = boss
      ? 28 + enemy.bossTier * 14
      : enemy.type === 'brute'
        ? Phaser.Math.Between(4, 7)
        : enemy.type === 'gunner'
          ? Phaser.Math.Between(3, 5)
          : enemy.type === 'runner'
            ? Phaser.Math.Between(1, 3)
            : Math.random() < 0.55
              ? 1
              : 0;
    const eventBonus = this.specialWave === 'elite'
      ? enemy.type === 'brute' || enemy.type === 'gunner' ? Phaser.Math.Between(2, 5) : 0
      : this.specialWave === 'gunnerRaid' && enemy.type === 'gunner'
        ? Phaser.Math.Between(1, 3)
        : this.specialWave !== 'none' && baseValue > 0 && Math.random() < 0.25
          ? 1
          : 0;
    const value = baseValue + eventBonus;
    if (value <= 0) return;
    const body = this.add.container(enemy.pos.x, enemy.pos.y);
    const coin = this.add.circle(0, 0, boss ? 13 : 8, 0xffd166, 0.95).setStrokeStyle(3, 0x6e4420, 0.9);
    const shine = this.add.rectangle(2, -2, boss ? 10 : 6, 3, 0xfff2a3, 0.8);
    body.add([coin, shine]);
    this.fxLayer.add(body);
    this.coinDrops.push({
      pos: { x: enemy.pos.x + Phaser.Math.Between(-18, 18), y: enemy.pos.y + Phaser.Math.Between(-18, 18) },
      value,
      age: 0,
      body,
    });
  }

  private spreadPoison(source: Enemy) {
    this.enemies
      .filter((enemy) => enemy !== source && Phaser.Math.Distance.Between(enemy.pos.x, enemy.pos.y, source.pos.x, source.pos.y) < 120)
      .slice(0, 4)
      .forEach((enemy) => {
        enemy.poison = Math.max(enemy.poison, 2.6);
        enemy.hitFlash = 0.08;
        this.pixelSpark(enemy.pos, 0x8aff6a);
      });
  }

  private createGroundHazard(type: 'toxic' | 'fire', source: Vec2, radius: number, damage: number, life: number) {
    if (this.groundHazards.length > 36) return;
    const pos = { x: source.x + Phaser.Math.Between(-18, 18), y: source.y + Phaser.Math.Between(-18, 18) };
    const color = type === 'toxic' ? 0x66d96d : 0xff7b32;
    const body = this.add.container(pos.x, pos.y);
    const puddle = this.add.circle(0, 0, radius, color, type === 'toxic' ? 0.18 : 0.22).setScale(1, 0.56);
    puddle.setStrokeStyle(3, type === 'toxic' ? 0x173f28 : 0x6e2024, 0.45);
    body.add(puddle);
    for (let i = 0; i < 4; i += 1) {
      const fleck = this.add.rectangle(Phaser.Math.Between(-radius, radius), Phaser.Math.Between(-Math.floor(radius * 0.32), Math.floor(radius * 0.32)), Phaser.Math.Between(5, 12), Phaser.Math.Between(3, 8), color, 0.28);
      fleck.setRotation(Phaser.Math.FloatBetween(-0.8, 0.8));
      body.add(fleck);
    }
    this.fxLayer.add(body);
    this.groundHazards.push({ type, pos, radius, damage, life, tick: 0, body });
  }

  private updateGroundHazards(dt: number) {
    for (let i = this.groundHazards.length - 1; i >= 0; i -= 1) {
      const hazard = this.groundHazards[i];
      hazard.life -= dt;
      hazard.tick -= dt;
      hazard.body.setAlpha(Phaser.Math.Clamp(hazard.life / 1.4, 0.18, 0.8));
      if (Math.random() < (hazard.type === 'toxic' ? 0.08 : 0.12)) this.pixelSpark(hazard.pos, hazard.type === 'toxic' ? 0x8aff6a : 0xff7b32);
      const dist = Phaser.Math.Distance.Between(hazard.pos.x, hazard.pos.y, this.playerPos.x, this.playerPos.y);
      if (dist < hazard.radius && hazard.tick <= 0) {
        hazard.tick = 0.42;
        this.damagePlayer(hazard.damage);
      }
      if (hazard.life <= 0) {
        hazard.body.destroy();
        this.groundHazards.splice(i, 1);
      }
    }
  }

  private updateFog(dt: number) {
    const eventDensity = this.specialWave === 'fog' || this.nextSpecialWave === 'fog' ? 1.75 : this.specialWave === 'night' ? 1.28 : 1;
    this.fogPatches.forEach((patch) => {
      patch.phase += dt * (0.24 + patch.pulse);
      patch.origin.x += patch.drift.x * dt * eventDensity;
      patch.origin.y += patch.drift.y * dt * eventDensity;
      const edgeLimit = WORLD_HALF_SIZE + 360;
      if (patch.origin.x > edgeLimit) patch.origin.x = -edgeLimit;
      if (patch.origin.x < -edgeLimit) patch.origin.x = edgeLimit;
      if (patch.origin.y > edgeLimit) patch.origin.y = -edgeLimit;
      if (patch.origin.y < -edgeLimit) patch.origin.y = edgeLimit;
      const breathe = 1 + Math.sin(patch.phase) * 0.045;
      patch.body.setPosition(patch.origin.x + Math.sin(patch.phase * 0.7) * 14, patch.origin.y + Math.cos(patch.phase * 0.53) * 8);
      patch.body.setScale(breathe * (1 + (eventDensity - 1) * 0.08), (1 / breathe) * (1 + (eventDensity - 1) * 0.04));
      patch.body.setAlpha(Phaser.Math.Clamp((0.42 + patch.baseAlpha * 4.2 * patch.density) * eventDensity, 0.18, 0.88));
    });
  }

  private illuminateFog(pos: Vec2, color: number, radius: number, strength: number) {
    const glow = this.add.container(pos.x, pos.y);
    for (let i = 0; i < 4; i += 1) {
      const halo = this.add.circle(
        Phaser.Math.Between(-12, 12),
        Phaser.Math.Between(-8, 8),
        radius * Phaser.Math.FloatBetween(0.42, 0.95),
        color,
        strength * Phaser.Math.FloatBetween(0.025, 0.075),
      );
      halo.setScale(Phaser.Math.FloatBetween(1.4, 2.4), Phaser.Math.FloatBetween(0.35, 0.72));
      halo.setBlendMode(Phaser.BlendModes.ADD);
      glow.add(halo);
    }
    this.fogLayer.add(glow);
    this.tweens.add({
      targets: glow,
      alpha: 0,
      scaleX: 1.32,
      scaleY: 1.1,
      duration: 110 + radius * 0.52,
      ease: 'Sine.easeOut',
      onComplete: () => glow.destroy(),
    });
  }

  private clearGroundHazards() {
    this.groundHazards.forEach((hazard) => hazard.body.destroy());
    this.groundHazards = [];
  }

  private gainXp(value: number, pos: Vec2) {
    this.xp += value * this.stats.magnet;
    this.popText({ x: pos.x, y: pos.y - 28 }, `+${value} XP`, '#78f7ff');
    while (this.xp >= this.xpNeed) {
      this.xp -= this.xpNeed;
      this.level += 1;
      this.xpNeed = Math.floor(this.xpNeed * 1.28 + 12);
      this.hp = Math.min(this.maxHp, this.hp + 8);
      this.popText(this.playerPos, `LVL ${this.level}`, '#ffd166');
      this.soundtrack.levelUpStinger();
      this.leveling = true;
      this.waveUpgradePending = false;
      this.showUpgradeChoices(`LEVEL ${this.level}`);
      break;
    }
  }

  private damagePlayer(amount: number) {
    if (this.stats.dodge > 0 && Math.random() < this.stats.dodge) {
      this.popText(this.playerPos, 'DODGE', '#8ee8ff');
      return;
    }
    let remaining = amount * (1 - this.stats.damageReduction);
    if (this.shield > 0) {
      const absorbed = Math.min(this.shield, remaining);
      this.shield -= absorbed;
      remaining -= absorbed;
    }
    if (remaining <= 0) return;
    this.hp = Math.max(0, this.hp - remaining);
    this.playerHitTimer = Math.max(this.playerHitTimer, 0.16);
    this.invulnTimer = 0.15 + this.stats.invuln;
    this.flashPlayerDamage();
    this.popText(this.playerPos, `-${Math.ceil(remaining)}`, '#ff6b6b');
    this.shake(70, 0.004);
    if (this.hp <= 0) this.endRun();
  }

  private flashPlayerDamage() {
    this.player.setAlpha(0.42);
    this.time.delayedCall(90, () => {
      if (!this.playerDead) this.player.setAlpha(1);
    });
    this.damageFlashOverlay.classList.remove('visible');
    void this.damageFlashOverlay.offsetWidth;
    this.damageFlashOverlay.classList.add('visible');
  }

  private showUpgradeChoices(title = 'LEVEL UP') {
    const choices = this.rollUpgradeChoices();
    this.playUpgradeRevealFx(choices);
    this.upgradeOverlay.classList.add('visible');
    this.updateCursorMode();
    this.upgradeOverlay.innerHTML = `
      <div class="upgrade-box">
        <h1>${title}</h1>
        <p class="upgrade-subtitle">Choose how this run gets stronger.</p>
        <div class="upgrade-grid">
          ${choices.map((u, index) => this.renderUpgradeCard(u, index)).join('')}
        </div>
      </div>`;
    this.upgradeOverlay.querySelectorAll<HTMLButtonElement>('button').forEach((button) => {
      const rarity = button.dataset.rarity as UpgradeRarity;
      button.addEventListener('mouseenter', () => this.sfx.playUpgradeHover(rarity));
      button.addEventListener('click', () => {
        this.sfx.playUpgradeSelect(rarity);
        this.applyUpgrade(button.dataset.id as UpgradeId);
      }, { once: true });
    });
  }

  private renderUpgradeCard(upgrade: Upgrade, index: number) {
    const tags = this.getUpgradeTags(upgrade.id);
    return `
      <button class="upgrade-card ${upgrade.rarity.toLowerCase()}" data-id="${upgrade.id}" data-rarity="${upgrade.rarity}" style="--card-index: ${index}">
        <span class="rarity-aura" aria-hidden="true"></span>
        ${this.renderIcon(upgrade.id, upgrade.title)}
        <em>${upgrade.rarity}</em>
        <h2>${upgrade.title}</h2>
        <p class="upgrade-flavor">${upgrade.desc}</p>
        <p class="upgrade-effect">${this.getUpgradeEffectText(upgrade.id)}</p>
        <div class="upgrade-tags">${tags.map((tag) => `<span>${tag}</span>`).join('')}</div>
      </button>`;
  }

  private playUpgradeRevealFx(choices: Upgrade[]) {
    this.hitStop = Math.max(this.hitStop, 0.18);
    this.shake(130, choices.some((upgrade) => upgrade.rarity === 'Legendary') ? 0.006 : 0.003);
    this.soundtrack.levelUpStinger();
    this.sfx.playLevelUp();
    this.levelUpBurstFx(choices.some((upgrade) => upgrade.rarity === 'Legendary'));
  }

  private levelUpBurstFx(legendary: boolean) {
    const color = legendary ? 0xffd166 : 0x78f7ff;
    const count = legendary ? 34 : 22;
    this.illuminateFog(this.playerPos, legendary ? 0xffb347 : 0x78f7ff, legendary ? 155 : 110, legendary ? 0.28 : 0.16);
    const ring = this.add.circle(this.playerPos.x, this.playerPos.y, 42, color, 0.08).setStrokeStyle(4, color, legendary ? 0.58 : 0.38);
    this.fxLayer.add(ring);
    this.tweens.add({ targets: ring, alpha: 0, scale: legendary ? 3.2 : 2.45, duration: 520, ease: 'Sine.easeOut', onComplete: () => ring.destroy() });
    for (let i = 0; i < count; i += 1) {
      const angle = (i / count) * Math.PI * 2 + Phaser.Math.FloatBetween(-0.12, 0.12);
      this.pixelSparkDirected(this.playerPos, angle, Phaser.Math.Between(80, legendary ? 210 : 155), i % 3 === 0 ? 0xffd166 : color, legendary ? 5 : 4);
    }
  }

  private rollUpgradeChoices() {
    const pool = UPGRADES.filter((upgrade) => {
      if (!this.canOfferUpgrade(upgrade.id)) return false;
      if (upgrade.id.startsWith('unlock') || upgrade.id.startsWith('evolve')) return false;
      if ((upgrade.id === 'pellets' || upgrade.id === 'knockback') && !this.hasWeapon('shotgun')) return false;
      if (upgrade.id === 'sprayControl' && !this.hasWeapon('smg')) return false;
      if (upgrade.id === 'droneFireRate' && this.stats.drone <= 0) return false;
      if (upgrade.id === 'orbitSpeed' && this.stats.orbit <= 0) return false;
      if (upgrade.id === 'lightningChain' && this.stats.lightningAura <= 0 && this.stats.chain <= 0) return false;
      return true;
    }).sort(() => Math.random() - 0.5);
    const weighted = pool.sort((a, b) => this.upgradeRollScore(a) - this.upgradeRollScore(b));
    return weighted.slice(0, 3);
  }

  private canOfferUpgrade(id: UpgradeId) {
    const limit = UPGRADE_LIMITS[id];
    if (limit !== undefined && (this.upgradeStacks[id] ?? 0) >= limit) return false;
    if (this.recentUpgrades.includes(id)) return false;
    return true;
  }

  private upgradeRollScore(upgrade: Upgrade) {
    const rarityBias = { Common: 0.08, Rare: 0.16, Epic: 0.3, Legendary: 0.5 }[upgrade.rarity];
    const stackPenalty = (this.upgradeStacks[upgrade.id] ?? 0) * 0.22;
    const statPenalty = STAT_UPGRADES.has(upgrade.id) ? 0.2 + Math.min(0.35, this.level * 0.015) : -0.08;
    const mechanicBonus = upgrade.rarity === 'Epic' || upgrade.rarity === 'Legendary' ? -0.08 : 0;
    const specialRewardBonus = this.specialRewardPending && (upgrade.rarity === 'Epic' || upgrade.rarity === 'Legendary') ? -0.22 : 0;
    return Math.random() + rarityBias + stackPenalty + statPenalty + mechanicBonus + specialRewardBonus;
  }

  private getUpgradeTags(id: UpgradeId) {
    const tags: string[] = [];
    if (['fire', 'fireAura', 'critBurn'].includes(id)) tags.push('FIRE');
    if (['poison', 'poisonSpread'].includes(id)) tags.push('TOXIN');
    if (id === 'freeze') tags.push('CRYO');
    if (['lightningAura', 'chain', 'lightningChain'].includes(id)) tags.push('LIGHTNING');
    if (['pellets', 'knockback'].includes(id)) tags.push('SHOTGUN');
    if (id === 'sprayControl') tags.push('SMG');
    if (['drone', 'droneFireRate', 'turret'].includes(id)) tags.push('SUMMON');
    if (['orbit', 'orbitSpeed', 'orbitSize'].includes(id)) tags.push('ORBIT');
    if (['maxHp', 'shield', 'regen', 'lifesteal', 'damageReduction', 'dodge', 'invuln'].includes(id)) tags.push('SURVIVE');
    if (['damage', 'damageBig', 'fireRate', 'critChance', 'critDamage', 'bulletSpeed', 'projectileSize', 'pierce', 'doubleShot', 'ricochet', 'spread', 'explosive', 'deathBurst'].includes(id)) tags.push('DAMAGE');
    if (id === 'speed' || id === 'magnet') tags.push('UTILITY');
    return tags.slice(0, 2);
  }

  private getUpgradeEffectText(id: UpgradeId) {
    const stack = this.upgradeStacks[id] ?? 0;
    const text: Partial<Record<UpgradeId, string>> = {
      damage: `Weapon damage +${Math.round((([1.12, 1.09, 1.07, 1.05][stack] ?? 1.04) - 1) * 100)}%.`,
      damageBig: `Heavy damage spike +${Math.round((([1.2, 1.13][stack] ?? 1.08) - 1) * 100)}%.`,
      fireRate: `Fire rate +${Math.round((([1.16, 1.11, 1.08, 1.05][stack] ?? 1.03) - 1) * 100)}%.`,
      critChance: `Critical chance +${Math.round(([0.07, 0.05, 0.035][stack] ?? 0.02) * 100)}%.`,
      critDamage: 'Critical damage +55%.',
      bulletSpeed: 'Projectile speed +18%.',
      projectileSize: 'Projectile size +16%.',
      pierce: 'Bullets pierce +1 enemy.',
      doubleShot: 'Adds an extra paired shot.',
      ricochet: 'Bullets bounce +1 time.',
      spread: 'Adds side shots to your fire pattern.',
      fire: 'Shots ignite enemies.',
      poison: 'Shots apply toxic damage over time.',
      freeze: 'Shots slow enemies with cold.',
      maxHp: `Max HP +${[25, 15, 10][stack] ?? 8}.`,
      shield: 'Gain a regenerating shield layer.',
      lifesteal: `Heal +${[1.6, 1.1, 0.7][stack] ?? 0.5} per kill.`,
      damageReduction: 'Incoming damage reduced.',
      invuln: 'Longer invulnerability after hits.',
      dodge: 'Chance to fully avoid damage.',
      orbit: 'Adds a rotating blade.',
      drone: 'Adds a combat drone.',
      turret: 'Drops a pocket turret.',
      lightningAura: 'Periodically shocks nearby enemies.',
      fireAura: 'Burns enemies that get too close.',
      magnet: 'XP and coins pull from farther away.',
      chain: 'Bullets can chain lightning.',
      explosive: 'Bullets gain explosive impacts.',
      speed: 'Move speed increased.',
      regen: 'Regenerate HP during combat.',
      pellets: 'Shotgun gains extra pellets.',
      knockback: 'More shove and extra damage.',
      sprayControl: 'SMG/minigun spread tightens.',
      droneFireRate: 'Drones fire faster.',
      orbitSpeed: 'Orbitals spin faster.',
      lightningChain: 'Lightning jumps to more targets.',
      poisonSpread: 'Poisoned enemies spread toxin on death.',
      critBurn: 'Critical hits ignite enemies.',
      deathBurst: 'Enemies can burst on death.',
      orbitSize: 'Orbitals cover a wider area.',
    };
    return text[id] ?? 'Improves this run immediately.';
  }

  private applyUpgrade(id: UpgradeId) {
    const previousStacks = this.upgradeStacks[id] ?? 0;
    this.upgradeStacks[id] = previousStacks + 1;
    this.recentUpgrades = [id, ...this.recentUpgrades.filter((recent) => recent !== id)].slice(0, 4);
    if (id === 'damage') this.stats.damage *= [1.12, 1.09, 1.07, 1.05][previousStacks] ?? 1.04;
    if (id === 'damageBig') this.stats.damage *= [1.2, 1.13][previousStacks] ?? 1.08;
    if (id === 'fireRate') this.stats.fireRate *= [1.16, 1.11, 1.08, 1.05][previousStacks] ?? 1.03;
    if (id === 'critChance') this.stats.critChance = Math.min(0.32, this.stats.critChance + ([0.07, 0.05, 0.035][previousStacks] ?? 0.02));
    if (id === 'critDamage') this.stats.critDamage += 0.55;
    if (id === 'bulletSpeed') this.stats.bulletSpeed *= 1.18;
    if (id === 'projectileSize') this.stats.projectileSize *= 1.16;
    if (id === 'pierce') this.stats.pierce += 1;
    if (id === 'doubleShot') this.stats.doubleShot += 1;
    if (id === 'ricochet') this.stats.ricochet += 1;
    if (id === 'spread') this.stats.spread += 1;
    if (id === 'fire') this.stats.fire += 1;
    if (id === 'poison') this.stats.poison += 1;
    if (id === 'freeze') this.stats.freeze += 1;
    if (id === 'maxHp') {
      const hpGain = [25, 15, 10][previousStacks] ?? 8;
      this.maxHp += hpGain;
      this.hp = Math.min(this.maxHp, this.hp + hpGain);
    }
    if (id === 'shield') {
      this.stats.shield += 1;
      this.shield = Math.max(this.shield, 35);
    }
    if (id === 'lifesteal') this.stats.lifesteal += [1.6, 1.1, 0.7][previousStacks] ?? 0.5;
    if (id === 'damageReduction') this.stats.damageReduction = Math.min(0.42, this.stats.damageReduction + ([0.1, 0.08, 0.06, 0.04][previousStacks] ?? 0.03));
    if (id === 'invuln') this.stats.invuln += [0.16, 0.11, 0.07][previousStacks] ?? 0.04;
    if (id === 'dodge') this.stats.dodge = Math.min(0.28, this.stats.dodge + ([0.07, 0.055, 0.04, 0.025][previousStacks] ?? 0.02));
    if (id === 'orbit') this.stats.orbit += 1;
    if (id === 'drone') this.stats.drone += 1;
    if (id === 'turret') this.stats.turret += 1;
    if (id === 'lightningAura') this.stats.lightningAura += 1;
    if (id === 'fireAura') this.stats.fireAura += 1;
    if (id === 'magnet') this.stats.magnet += [0.18, 0.12, 0.08][previousStacks] ?? 0.05;
    if (id === 'chain') this.stats.chain += 1;
    if (id === 'explosive') this.stats.explosive += 1;
    if (id === 'speed') this.stats.speed *= [1.12, 1.08, 1.05][previousStacks] ?? 1.03;
    if (id === 'regen') this.stats.regen += [1.6, 1, 0.6][previousStacks] ?? 0.4;
    if (id === 'pellets') this.stats.pellets += 1;
    if (id === 'knockback') {
      this.stats.knockback += 1;
      this.stats.damage *= 1.08;
    }
    if (id === 'sprayControl') {
      this.stats.sprayControl += 1;
      this.stats.fireRate *= 1.08;
    }
    if (id === 'droneFireRate') this.stats.droneFireRate += 1;
    if (id === 'orbitSpeed') this.stats.orbitSpeed += 1;
    if (id === 'lightningChain') this.stats.lightningChain += 1;
    if (id === 'poisonSpread') this.stats.poisonSpread = 1;
    if (id === 'critBurn') this.stats.critBurn = 1;
    if (id === 'deathBurst') this.stats.deathBurst = 1;
    if (id === 'orbitSize') this.stats.orbitSize += 1;
    this.upgradeOverlay.classList.remove('visible');
    this.specialRewardPending = false;
    this.leveling = false;
    if (this.waveUpgradePending) this.showCampShop();
  }

  private showCampShop() {
    this.leveling = true;
    this.ensureShopOffers();
    this.campOverlay.classList.add('visible');
    this.updateCursorMode();
    this.campOverlay.innerHTML = `
      <div class="camp-box">
        <div class="camp-header">
          <span class="camp-trader" aria-hidden="true"></span>
          <div>
            <h1>SAFE CAMP</h1>
            <p>COINS: <strong>${this.coins}</strong></p>
          </div>
        </div>
        <div class="camp-section-head">
          <h2>WEAPON DEALER</h2>
          <button data-camp-action="reroll" ${this.coins < this.getRerollPrice() ? 'disabled' : ''}>Reroll ${this.getRerollPrice()}</button>
        </div>
        <div class="camp-grid weapon-shop-grid">
          ${this.shopOffers.length ? this.shopOffers.map((id) => this.renderWeaponShopCard(id)).join('') : '<p class="camp-empty">Dealer stock is empty. Upgrade owned weapons.</p>'}
        </div>
        <h2 class="camp-section-title">OWNED WEAPON MODS</h2>
        <div class="camp-grid weapon-shop-grid">
          ${this.equippedWeapons.map((slot) => this.renderOwnedWeaponCard(slot)).join('')}
        </div>
        <div class="pause-actions lobby-bottom-actions">
          <button data-camp-action="continue">Start Next Wave</button>
        </div>
      </div>`;
    this.campOverlay.querySelectorAll<HTMLButtonElement>('button[data-buy-weapon]').forEach((button) => {
      button.addEventListener('click', () => this.buyShopWeapon(button.dataset.buyWeapon as WeaponId));
    });
    this.campOverlay.querySelectorAll<HTMLButtonElement>('button[data-upgrade-weapon]').forEach((button) => {
      button.addEventListener('click', () => this.upgradeOwnedWeapon(button.dataset.upgradeWeapon as WeaponId));
    });
    this.campOverlay.querySelector<HTMLButtonElement>('button[data-camp-action="reroll"]')?.addEventListener('click', () => this.rerollWeaponShop());
    this.campOverlay.querySelector<HTMLButtonElement>('button[data-camp-action="continue"]')?.addEventListener('click', () => {
      this.campOverlay.classList.remove('visible');
      this.leveling = false;
      this.beginNextWaveCountdown();
    });
  }

  private ensureShopOffers(force = false) {
    if (!force && this.shopOffers.some((id) => !this.hasWeapon(id))) return;
    const pool = (Object.keys(WEAPONS) as WeaponId[]).filter((id) => {
      if (STARTING_WEAPONS.includes(id) || this.hasWeapon(id)) return false;
      if (WEAPONS[id].tier === 'Late' && this.wave < 5 && this.level < 5) return false;
      if (WEAPONS[id].tier === 'Mid' && this.wave < 2 && this.level < 2) return false;
      return true;
    });
    this.shopOffers = pool.sort(() => Math.random() - 0.5).slice(0, 3);
  }

  private renderWeaponShopCard(id: WeaponId) {
    const weapon = WEAPONS[id];
    const price = this.getWeaponPrice(id);
    const disabled = this.coins < price || this.equippedWeapons.length >= 3;
    const iconKey = this.getUnlockIconKey(id);
    return `
      <button class="camp-card weapon-shop-card" data-buy-weapon="${id}" ${disabled ? 'disabled' : ''}>
        ${this.renderIcon(iconKey, weapon.title)}
        <em>${weapon.tier.toUpperCase()} WEAPON</em>
        <h2>${weapon.title}</h2>
        <p>${weapon.tagline}. ${weapon.desc}</p>
        <strong>${this.equippedWeapons.length >= 3 ? 'SLOTS FULL' : `${price} COINS`}</strong>
      </button>`;
  }

  private renderOwnedWeaponCard(slot: EquippedWeapon) {
    const weapon = WEAPONS[slot.id];
    const maxed = slot.level >= 3 && slot.evolved;
    const price = this.getWeaponUpgradePrice(slot);
    const label = slot.level < 3 ? `TIER ${slot.level + 1}` : slot.evolved ? 'MAX' : 'EVOLVE';
    const desc = slot.level < 3
      ? `Damage +16%, fire rate +8%. Current tier ${slot.level}.`
      : slot.evolved
        ? 'Fully tuned and battle hardened.'
        : 'Capstone mod adds stronger special behavior.';
    return `
      <button class="camp-card weapon-shop-card ${maxed ? 'maxed' : ''}" data-upgrade-weapon="${slot.id}" ${maxed || this.coins < price ? 'disabled' : ''}>
        ${this.renderIcon(this.getEvolutionIconKey(slot.id), weapon.title)}
        <em>${label}</em>
        <h2>${weapon.title}</h2>
        <p>${desc}</p>
        <strong>${maxed ? 'MAXED' : `${price} COINS`}</strong>
      </button>`;
  }

  private renderIcon(key: UpgradeId | string, label: string) {
    const src = ICON_URLS[key];
    return `<span class="upgrade-icon"><img src="${src}" alt="${label}" loading="eager"></span>`;
  }

  private getUnlockIconKey(id: WeaponId): UpgradeId {
    const map: Partial<Record<WeaponId, UpgradeId>> = {
      shotgun: 'unlockShotgun',
      smg: 'unlockSmg',
      burstRifle: 'unlockBurstRifle',
      flamethrower: 'unlockFlamethrower',
      dualPistols: 'unlockDualPistols',
      launcher: 'unlockLauncher',
      railgun: 'unlockRailgun',
      plasma: 'unlockPlasma',
      lightningCannon: 'unlockLightningCannon',
      minigun: 'unlockMinigun',
    };
    return map[id] ?? 'damage';
  }

  private getEvolutionIconKey(id: WeaponId): UpgradeId {
    const map: Partial<Record<WeaponId, UpgradeId>> = {
      shotgun: 'evolveShotgun',
      smg: 'evolveSmg',
      flamethrower: 'evolveFlamethrower',
      railgun: 'evolveRailgun',
      lightningCannon: 'evolveLightningCannon',
      pistol: 'evolvePistol',
      rapidPistol: 'evolvePistol',
      heavyPistol: 'evolvePistol',
      burstPistol: 'evolvePistol',
    };
    return map[id] ?? this.getUnlockIconKey(id);
  }

  private getWeaponPrice(id: WeaponId) {
    const tierCost = { Early: 34, Mid: 58, Late: 92 }[WEAPONS[id].tier];
    return tierCost + Math.floor(this.wave * 3.5);
  }

  private getWeaponUpgradePrice(slot: EquippedWeapon) {
    const tierCost = { Early: 18, Mid: 26, Late: 38 }[WEAPONS[slot.id].tier];
    if (slot.level >= 3 && !slot.evolved) return tierCost + 48 + Math.floor(this.wave * 4);
    return Math.floor((tierCost + 12) * Math.pow(1.55, slot.level - 1) + this.wave * 2);
  }

  private getRerollPrice() {
    return 10 + Math.floor(this.wave * 1.5);
  }

  private buyShopWeapon(id: WeaponId) {
    const price = this.getWeaponPrice(id);
    if (this.coins < price || this.hasWeapon(id) || this.equippedWeapons.length >= 3) return;
    this.coins -= price;
    this.unlockWeapon(id);
    this.shopOffers = this.shopOffers.filter((offer) => offer !== id);
    this.ensureShopOffers();
    this.showCampShop();
    this.updateHud();
  }

  private upgradeOwnedWeapon(id: WeaponId) {
    const slot = this.equippedWeapons.find((weapon) => weapon.id === id);
    if (!slot) return;
    const price = this.getWeaponUpgradePrice(slot);
    if (this.coins < price || (slot.level >= 3 && slot.evolved)) return;
    this.coins -= price;
    if (slot.level < 3) {
      slot.level += 1;
      this.popText(this.playerPos, `${WEAPONS[id].title} T${slot.level}`, '#ffd166');
    } else {
      this.evolveWeapon(id);
    }
    this.showCampShop();
    this.updateHud();
  }

  private rerollWeaponShop() {
    const price = this.getRerollPrice();
    if (this.coins < price) return;
    this.coins -= price;
    this.ensureShopOffers(true);
    this.popText(this.playerPos, 'SHOP REROLLED', '#8ee8ff');
    this.showCampShop();
    this.updateHud();
  }

  private hasWeapon(id: WeaponId) {
    return this.equippedWeapons.some((weapon) => weapon.id === id);
  }

  private isWeaponEvolved(id: WeaponId) {
    return this.equippedWeapons.some((weapon) => weapon.id === id && weapon.evolved);
  }

  private unlockWeapon(id: WeaponId) {
    if (this.hasWeapon(id) || this.equippedWeapons.length >= 3) return;
    this.equippedWeapons.push({ id, cooldown: 0, evolved: false, level: 1 });
    this.popText(this.playerPos, `${WEAPONS[id].title} UNLOCKED`, '#78f7ff');
  }

  private evolveWeapon(id: WeaponId) {
    const slot = this.equippedWeapons.find((weapon) => weapon.id === id);
    if (!slot || slot.evolved) return;
    slot.evolved = true;
    this.popText(this.playerPos, `${WEAPONS[id].title} EVOLVED`, '#ffd166');
  }

  private getUnlockWeaponId(id: UpgradeId): WeaponId | undefined {
    const map: Partial<Record<UpgradeId, WeaponId>> = {
      unlockShotgun: 'shotgun',
      unlockSmg: 'smg',
      unlockBurstRifle: 'burstRifle',
      unlockFlamethrower: 'flamethrower',
      unlockDualPistols: 'dualPistols',
      unlockLauncher: 'launcher',
      unlockRailgun: 'railgun',
      unlockPlasma: 'plasma',
      unlockLightningCannon: 'lightningCannon',
      unlockMinigun: 'minigun',
    };
    return map[id];
  }

  private getEvolutionWeaponId(id: UpgradeId): WeaponId | undefined {
    if (id === 'evolvePistol') return this.equippedWeapons.find((weapon) => STARTING_WEAPONS.includes(weapon.id))?.id;
    const map: Partial<Record<UpgradeId, WeaponId>> = {
      evolveSmg: 'smg',
      evolveShotgun: 'shotgun',
      evolveFlamethrower: 'flamethrower',
      evolveRailgun: 'railgun',
      evolveLightningCannon: 'lightningCannon',
    };
    return map[id];
  }

  private startRunWithWeapon(id: WeaponId) {
    this.soundtrack.start(this.settings.masterVolume, this.settings.musicVolume);
    this.sfx.start(this.settings.masterVolume, this.settings.sfxVolume);
    this.selectedWeapon = id;
    const weapon = WEAPONS[id];
    this.equippedWeapons = [{ id, cooldown: 0, evolved: false, level: 1 }];
    this.stats.damage = weapon.damage;
    this.stats.fireRate = weapon.fireRate;
    this.stats.bulletSpeed = weapon.bulletSpeed;
    this.stats.projectileSize = weapon.projectileSize;
    this.stats.knockback = 0;
    if (STARTING_WEAPONS.includes(id)) this.stats.critChance = id === 'rapidPistol' ? 0.03 : 0.06;
    if (id === 'shotgun') this.stats.pierce = 0;
    if (id === 'smg') this.stats.poison = 1;
    this.inLobby = false;
    this.selectingWeapon = false;
    this.updateCursorMode();
    this.lobbyOverlay.classList.remove('visible');
    this.lobbyOverlay.innerHTML = '';
    this.weaponOverlay.classList.remove('visible');
    this.weaponOverlay.innerHTML = '';
    this.popText(this.playerPos, `${weapon.title} READY`, '#ffd166');
  }

  private showLobbyMenu() {
    this.loadPersistentProgress();
    this.inLobby = true;
    this.selectingWeapon = true;
    this.firing = false;
    this.lobbyOverlay.classList.add('visible');
    this.updateCursorMode();
    this.lobbyOverlay.innerHTML = `
      <div class="lobby-scene" aria-hidden="true">
        <span class="fog fog-a"></span>
        <span class="fog fog-b"></span>
        <span class="ember e1"></span>
        <span class="ember e2"></span>
        <span class="ember e3"></span>
        <div class="lobby-survivor"></div>
        <div class="zombie-line">
          <i></i><i></i><i></i><i></i><i></i>
        </div>
      </div>
      <div class="lobby-shell">
        <section class="lobby-panel">
          <p class="lobby-kicker">ARCADE SURVIVAL</p>
          <h1>ZOMBIE RUN</h1>
          <p class="pause-copy">Choose a pistol. Survive the wave. Build the chaos.</p>
          <div class="selected-loadout">
            <span>STARTING WEAPON</span>
            <strong id="lobbyWeapon">${WEAPONS[this.selectedWeapon].title}</strong>
          </div>
          <div class="pause-actions">
            <button data-lobby-action="start">Start Run</button>
            <button data-lobby-action="weapons">Weapon Select</button>
            <button data-lobby-action="settings">Settings</button>
            <button data-lobby-action="quit">Quit</button>
          </div>
        </section>
        <section class="lobby-character-card" aria-hidden="true">
          <div class="lobby-character-glow"></div>
          <div class="lobby-character"></div>
          <div class="lobby-character-ground"></div>
        </section>
        <aside class="lobby-stats">
          <h2>RUN RECORDS</h2>
          <dl>
            <div><dt>Best Wave</dt><dd>${this.runStats.bestWave}</dd></div>
            <div><dt>Best Time</dt><dd>${this.formatTime(this.runStats.bestTime)}</dd></div>
            <div><dt>Total Kills</dt><dd>${this.runStats.totalKills}</dd></div>
          </dl>
        </aside>
      </div>`;
    this.bindLobbyButtons();
  }

  private showLobbyWeaponSelect() {
    this.loadPersistentProgress();
    this.lobbyOverlay.classList.add('visible');
    this.updateCursorMode();
    this.lobbyOverlay.innerHTML = `
      <div class="lobby-scene" aria-hidden="true">
        <span class="fog fog-a"></span>
        <span class="fog fog-b"></span>
        <div class="zombie-line"><i></i><i></i><i></i><i></i><i></i></div>
      </div>
      <div class="weapon-box lobby-weapon-box">
        <h1>CHOOSE STARTING PISTOL</h1>
        <div class="weapon-grid">
          ${STARTING_WEAPONS.map((id) => WEAPONS[id])
            .map(
              (weapon) => `
                <button class="weapon-card ${weapon.id} ${weapon.id === this.selectedWeapon ? 'selected' : ''}" data-id="${weapon.id}">
                  <span class="upgrade-icon">${weapon.icon}</span>
                  <em>${weapon.tagline}</em>
                  <h2>${weapon.title}</h2>
                  <p>${weapon.desc}</p>
                </button>`,
            )
            .join('')}
        </div>
        <div class="pause-actions lobby-bottom-actions">
          <button data-lobby-action="back">Back</button>
        </div>
      </div>`;
    this.lobbyOverlay.querySelectorAll<HTMLButtonElement>('button[data-id]').forEach((button) => {
      button.addEventListener('click', () => {
        this.selectedWeapon = button.dataset.id as WeaponId;
        this.showLobbyMenu();
      });
    });
    this.bindLobbyButtons();
  }

  private showLobbySettings() {
    this.loadPersistentProgress();
    this.lobbyOverlay.classList.add('visible');
    this.updateCursorMode();
    this.lobbyOverlay.innerHTML = `
      <div class="lobby-scene" aria-hidden="true">
        <span class="fog fog-a"></span>
        <span class="fog fog-b"></span>
        <div class="zombie-line"><i></i><i></i><i></i><i></i><i></i></div>
      </div>
      <div class="pause-box settings-box lobby-settings">
        <h1>SETTINGS</h1>
        ${this.renderSlider('masterVolume', 'Master Volume')}
        ${this.renderSlider('musicVolume', 'Music Volume')}
        ${this.renderSlider('sfxVolume', 'SFX Volume')}
        <label class="toggle-row">
          <span>Fullscreen</span>
          <input id="fullscreenSetting" type="checkbox" ${this.settings.fullscreen ? 'checked' : ''}>
        </label>
        <label class="toggle-row">
          <span>Screenshake</span>
          <input id="screenshakeSetting" type="checkbox" ${this.settings.screenshake ? 'checked' : ''}>
        </label>
        <div class="pause-actions">
          <button data-lobby-action="reset-progress">Reset Progress</button>
          <button data-lobby-action="back">Back</button>
        </div>
      </div>`;
    this.bindSettingsControls();
    this.bindLobbyButtons();
  }

  private bindLobbyButtons() {
    this.lobbyOverlay.querySelectorAll<HTMLButtonElement>('button[data-lobby-action]').forEach((button) => {
      button.addEventListener('click', () => {
        const action = button.dataset.lobbyAction;
        if (action === 'start') this.startRunWithWeapon(this.selectedWeapon);
        if (action === 'weapons') this.showLobbyWeaponSelect();
        if (action === 'settings') this.showLobbySettings();
        if (action === 'back') this.showLobbyMenu();
        if (action === 'quit') this.showQuitMessage();
        if (action === 'reset-progress') this.confirmResetProgress();
      });
    });
  }

  private confirmResetProgress() {
    const confirmed = window.confirm('Reset all saved progress on this browser? Coins, unlocks, records, and settings will return to defaults.');
    if (!confirmed) return;
    this.saveManager.resetSave();
    this.loadPersistentProgress();
    this.coins = 0;
    this.selectedWeapon = 'pistol';
    if (!this.inLobby) {
      this.scene.restart();
      return;
    }
    this.showLobbyMenu();
    this.updateHud();
  }

  private showQuitMessage() {
    const message = this.lobbyOverlay.querySelector('.pause-copy');
    if (message) message.textContent = 'Close the browser tab to quit the run.';
  }

  private explosion(pos: Vec2, radius: number, damage: number) {
    for (let i = 0; i < 14; i += 1) {
      this.pixelSpark(pos, i % 2 ? 0xff4d3d : 0xffd166);
    }
    this.illuminateFog(pos, damage > 0 ? 0xff8a45 : 0xff5c3d, radius * (damage > 0 ? 1.05 : 0.58), damage > 0 ? 0.68 : 0.22);
    if (damage > 0) {
      for (const enemy of this.enemies) {
        const d = Phaser.Math.Distance.Between(pos.x, pos.y, enemy.pos.x, enemy.pos.y);
        if (d < radius) {
          enemy.hp -= damage * (1 - d / radius);
          enemy.hitFlash = 0.08;
        }
      }
    }
    this.shake(90, 0.006);
  }

  private deathFx(enemy: Enemy) {
    const heavy = enemy.type === 'brute';
    const burst = heavy ? 14 : 7;
    const pool = this.add.rectangle(enemy.pos.x, enemy.pos.y + (heavy ? 36 : 25), heavy ? 42 : 25, heavy ? 18 : 10, 0x61151f, 0.64);
    pool.setRotation(Phaser.Math.FloatBetween(-0.18, 0.18));
    this.worldLayer.add(pool);
    this.tweens.add({ targets: pool, alpha: 0.28, duration: 4200, delay: 900, onComplete: () => pool.destroy() });

    for (let i = 0; i < burst; i += 1) {
      const angle = Phaser.Math.FloatBetween(0, Math.PI * 2);
      const speed = Phaser.Math.Between(35, heavy ? 155 : 105);
      this.pixelSparkDirected(enemy.pos, angle, speed, i % 3 === 0 ? 0x5f1720 : 0x9f2a35, heavy ? 5 : 3);
    }

    enemy.body.setDepth(2);
    this.tweens.add({
      targets: enemy.body,
      alpha: 0,
      scaleX: enemy.body.scaleX * 1.12,
      scaleY: enemy.body.scaleY * 0.62,
      angle: enemy.body.angle + Phaser.Math.Between(-24, 24),
      duration: heavy ? 520 : 360,
      ease: 'Quad.easeOut',
      onComplete: () => enemy.body.destroy(),
    });
    this.hitStop = Math.max(this.hitStop, heavy ? 0.08 : 0.04);
    this.shake(heavy ? 150 : 75, heavy ? 0.008 : 0.004);
  }

  private chainLightning(source: Enemy) {
    const targets = this.enemies.filter((e) => e !== source && Phaser.Math.Distance.Between(e.pos.x, e.pos.y, source.pos.x, source.pos.y) < 170).slice(0, this.stats.chain);
    targets.forEach((enemy) => {
      enemy.hp -= this.stats.damage * 0.45;
      enemy.hitFlash = 0.08;
      const line = this.add.line(0, 0, source.pos.x, source.pos.y, enemy.pos.x, enemy.pos.y, 0x96f7ff, 0.85).setLineWidth(4);
      this.fxLayer.add(line);
      this.tweens.add({ targets: line, alpha: 0, duration: 110, onComplete: () => line.destroy() });
    });
  }

  private muzzleFx(angle: number) {
    const pos = { x: this.playerPos.x + Math.cos(angle) * 34, y: this.playerPos.y + Math.sin(angle) * 34 };
    const flash = this.add.star(pos.x, pos.y, 6, 4, 22, 0xfff06a, 0.9);
    flash.setRotation(angle);
    this.fxLayer.add(flash);
    const cone = this.add.triangle(
      pos.x + Math.cos(angle) * 20,
      pos.y + Math.sin(angle) * 20,
      0,
      -9,
      42,
      0,
      0,
      9,
      0xffc45c,
      0.58,
    );
    cone.setRotation(angle);
    this.fxLayer.add(cone);
    this.tweens.add({ targets: flash, alpha: 0, scale: 1.42, duration: 62, onComplete: () => flash.destroy() });
    this.tweens.add({ targets: cone, alpha: 0, scaleX: 0.75, duration: 54, onComplete: () => cone.destroy() });
    this.illuminateFog(pos, 0xffc45c, 48, 0.16);
    for (let i = 0; i < 3; i += 1) this.pixelSparkDirected(pos, angle + Phaser.Math.FloatBetween(-0.26, 0.26), Phaser.Math.Between(48, 92), 0xd9a85c, 3);
  }

  private tracerFx(pos: Vec2, angle: number) {
    const tracer = this.add.rectangle(pos.x + Math.cos(angle) * 35, pos.y + Math.sin(angle) * 35, 58, 3, 0xffd68a, 0.32);
    tracer.setRotation(angle);
    this.fxLayer.add(tracer);
    this.tweens.add({ targets: tracer, alpha: 0, scaleX: 0.35, duration: 70, onComplete: () => tracer.destroy() });
  }

  private shellFx(angle: number) {
    const side = angle - Math.PI / 2;
    const pos = { x: this.playerPos.x + Math.cos(angle) * 10, y: this.playerPos.y + Math.sin(angle) * 10 };
    const shell = this.add.rectangle(pos.x, pos.y, 7, 4, 0xffc45c, 0.95);
    shell.setRotation(side);
    this.fxLayer.add(shell);
    this.tweens.add({
      targets: shell,
      x: shell.x + Math.cos(side) * Phaser.Math.Between(20, 36),
      y: shell.y + Math.sin(side) * Phaser.Math.Between(20, 36) + Phaser.Math.Between(-10, 10),
      angle: shell.angle + Phaser.Math.Between(120, 220),
      alpha: 0,
      duration: 360,
      onComplete: () => shell.destroy(),
    });
  }

  private impactFx(pos: Vec2, angle: number) {
    const slash = this.add.rectangle(pos.x, pos.y, 13, 4, 0xffd6a3, 0.48);
    slash.setRotation(angle + Math.PI / 2);
    this.fxLayer.add(slash);
    this.tweens.add({ targets: slash, alpha: 0, scaleX: 1.7, duration: 85, onComplete: () => slash.destroy() });
    for (let i = 0; i < 2; i += 1) {
      this.pixelSparkDirected(pos, angle + Math.PI + Phaser.Math.FloatBetween(-0.55, 0.55), Phaser.Math.Between(24, 58), 0xcaa062, 2);
    }
  }

  private pixelSpark(pos: Vec2, color: number) {
    const p = this.add.rectangle(pos.x, pos.y, Phaser.Math.Between(3, 7), Phaser.Math.Between(3, 7), color, 0.68);
    this.fxLayer.add(p);
    this.tweens.add({
      targets: p,
      x: pos.x + Phaser.Math.Between(-44, 44),
      y: pos.y + Phaser.Math.Between(-44, 44),
      alpha: 0,
      duration: Phaser.Math.Between(160, 310),
      onComplete: () => p.destroy(),
    });
  }

  private pixelSparkDirected(pos: Vec2, angle: number, speed: number, color: number, size = 5) {
    const p = this.add.rectangle(pos.x, pos.y, Phaser.Math.Between(Math.max(2, size - 2), size + 2), Phaser.Math.Between(2, size + 3), color, 0.72);
    p.setRotation(angle);
    this.fxLayer.add(p);
    this.tweens.add({
      targets: p,
      x: pos.x + Math.cos(angle) * speed,
      y: pos.y + Math.sin(angle) * speed + Phaser.Math.Between(-12, 12),
      alpha: 0,
      scaleX: 0.45,
      scaleY: 0.45,
      duration: Phaser.Math.Between(170, 330),
      onComplete: () => p.destroy(),
    });
  }

  private bloodFx(pos: Vec2, angle: number, count: number) {
    for (let i = 0; i < count; i += 1) {
      this.pixelSparkDirected(pos, angle + Phaser.Math.FloatBetween(-0.85, 0.85), Phaser.Math.Between(35, 120), i % 3 === 0 ? 0x7a1721 : 0xff3b5c, 5);
    }
    if (Math.random() < 0.38) {
      const splat = this.add.rectangle(pos.x + Math.cos(angle) * 16, pos.y + Math.sin(angle) * 16 + 18, Phaser.Math.Between(8, 16), Phaser.Math.Between(4, 8), 0x61151f, 0.5);
      splat.setRotation(Phaser.Math.FloatBetween(-0.45, 0.45));
      this.worldLayer.add(splat);
      this.tweens.add({ targets: splat, alpha: 0.18, duration: 2600, delay: 1000, onComplete: () => splat.destroy() });
    }
  }

  private damageNumber(pos: Vec2, amount: number) {
    this.popText({ x: pos.x, y: pos.y - 20 }, String(amount), '#fff4a3');
  }

  private popText(pos: Vec2, text: string, color: string) {
    const label = this.add.text(pos.x, pos.y, text, {
      fontFamily: '"Jersey 10", "Tiny5", "Arial Black", sans-serif',
      fontSize: '24px',
      fontStyle: 'bold',
      color,
      stroke: '#101827',
      strokeThickness: 4,
    });
    label.setResolution(1);
    this.fxLayer.add(label);
    this.tweens.add({ targets: label, y: label.y - 36, alpha: 0, duration: 650, onComplete: () => label.destroy() });
  }

  private createHud() {
    this.hud = document.createElement('div');
    this.hud.className = 'hud';
    this.hud.innerHTML = `
      <div class="hud-stack">
        <div class="vital-panel">
          <div class="bar hp">
            <div id="hpFill"></div>
            <span id="hpText">100 / 100</span>
          </div>
          <div class="level-row">
            <span>LVL <strong id="level">1</strong></span>
            <small><span id="xpText">0</span> / <span id="xpNeed">25</span> XP</small>
          </div>
          <div class="bar xp"><div id="xpFill"></div></div>
        </div>
      </div>`;
    const timer = document.createElement('div');
    timer.className = 'timer-hud';
    timer.id = 'timer';
    timer.textContent = '00:00';
    this.hud.appendChild(timer);
    const kills = document.createElement('div');
    kills.className = 'kills-hud';
    kills.innerHTML = '<span class="pixel-skull" aria-hidden="true"></span><span id="score">0</span>';
    this.hud.appendChild(kills);
    const wavePanel = document.createElement('div');
    wavePanel.className = 'wave-hud';
    wavePanel.innerHTML = `
      <strong id="waveLabel">WAVE 1</strong>
      <span id="waveState">INCOMING</span>
      <small id="remainingLabel">0 LEFT</small>`;
    this.hud.appendChild(wavePanel);
    const weaponPanel = document.createElement('div');
    weaponPanel.className = 'weapon-hud';
    weaponPanel.innerHTML = `
      <strong id="weaponName">PISTOL</strong>
      <span id="weaponSlots">1 / 3 WEAPONS</span>
      <span id="buildTags">STARTER</span>`;
    this.hud.appendChild(weaponPanel);
    const economyPanel = document.createElement('div');
    economyPanel.className = 'economy-hud';
    economyPanel.innerHTML = `
      <strong><span id="coinCount">0</span> COINS</strong>`;
    this.hud.appendChild(economyPanel);
    const waveBanner = document.createElement('div');
    waveBanner.className = 'wave-banner';
    waveBanner.innerHTML = `<strong id="waveBannerTitle">WAVE 1 INCOMING</strong><span id="waveCountdown">3</span>`;
    this.hud.appendChild(waveBanner);
    const debugSkip = document.createElement('button');
    debugSkip.className = 'debug-skip-wave';
    debugSkip.type = 'button';
    debugSkip.textContent = 'SKIP WAVE';
    debugSkip.addEventListener('click', () => this.debugSkipWave());
    this.hud.appendChild(debugSkip);
    document.body.appendChild(this.hud);
    this.upgradeOverlay = document.createElement('div');
    this.upgradeOverlay.className = 'upgrades';
    document.body.appendChild(this.upgradeOverlay);
    this.gameOverOverlay = document.createElement('div');
    this.gameOverOverlay.className = 'gameover';
    document.body.appendChild(this.gameOverOverlay);
    this.campOverlay = document.createElement('div');
    this.campOverlay.className = 'camp-shop';
    document.body.appendChild(this.campOverlay);
    this.pauseOverlay = document.createElement('div');
    this.pauseOverlay.className = 'pause-menu';
    document.body.appendChild(this.pauseOverlay);
    this.weaponOverlay = document.createElement('div');
    this.weaponOverlay.className = 'weapon-select';
    document.body.appendChild(this.weaponOverlay);
    this.lobbyOverlay = document.createElement('div');
    this.lobbyOverlay.className = 'main-lobby';
    document.body.appendChild(this.lobbyOverlay);
    this.damageFlashOverlay = document.createElement('div');
    this.damageFlashOverlay.className = 'damage-flash';
    document.body.appendChild(this.damageFlashOverlay);
    this.crosshair = document.createElement('div');
    this.crosshair.className = 'game-crosshair';
    this.crosshair.setAttribute('aria-hidden', 'true');
    document.body.appendChild(this.crosshair);
  }

  private updateCrosshair(x: number, y: number) {
    if (!this.crosshair) return;
    this.crosshair.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%)`;
  }

  private updateCursorMode() {
    document.body.classList.toggle('menu-cursor-active', this.isMenuCursorActive());
  }

  private updateHud() {
    this.setText('level', String(this.level));
    this.setText('hpText', `${Math.ceil(Math.max(0, this.hp))} / ${this.maxHp}`);
    this.setText('xpText', String(Math.floor(this.xp)));
    this.setText('xpNeed', String(this.xpNeed));
    this.setText('timer', `${Math.floor(this.elapsed / 60).toString().padStart(2, '0')}:${Math.floor(this.elapsed % 60).toString().padStart(2, '0')}`);
    this.setText('score', String(this.score));
    this.setText('waveLabel', `WAVE ${Math.max(1, this.wave || 1)}`);
    this.setText('remainingLabel', `${this.getRemainingEnemies()} LEFT`);
    this.setText('waveState', this.getWaveStateLabel());
    this.setText('weaponName', this.getWeaponHudTitle());
    this.setText('weaponSlots', `${this.equippedWeapons.length || 1} / 3 WEAPONS`);
    this.setText('buildTags', this.getBuildTags());
    this.setText('coinCount', String(this.coins));
    this.setText('waveBannerTitle', this.getWaveBannerTitle());
    this.setText('waveCountdown', String(Math.max(1, Math.ceil(this.waveTimer))));
    document.querySelector('.wave-banner')?.classList.toggle('visible', this.wavePhase === 'countdown' || this.wavePhase === 'bossWarning' || this.wavePhase === 'complete');
    document.body.classList.toggle('boss-warning-active', this.wavePhase === 'bossWarning');
    this.applySpecialWaveAtmosphere();
    this.setFill('hpFill', this.hp / this.maxHp);
    this.setFill('xpFill', this.xp / this.xpNeed);
    this.updateCursorMode();
  }

  private isMenuCursorActive() {
    return this.inLobby || this.selectingWeapon || this.leveling || this.paused || this.gameOver;
  }

  private debugSkipWave() {
    if (this.gameOver || this.inLobby || this.selectingWeapon) return;
    this.enemies.forEach((enemy) => enemy.body.destroy());
    this.bullets.forEach((bullet) => bullet.body.destroy());
    this.enemyProjectiles.forEach((shot) => shot.body.destroy());
    this.groundHazards.forEach((hazard) => hazard.body.destroy());
    this.gems.forEach((gem) => gem.body.destroy());
    this.coinDrops.forEach((coin) => coin.body.destroy());
    this.enemies = [];
    this.bullets = [];
    this.enemyProjectiles = [];
    this.groundHazards = [];
    this.gems = [];
    this.coinDrops = [];
    this.leveling = false;
    this.paused = false;
    this.waveUpgradePending = false;
    this.specialWave = 'none';
    this.nextSpecialWave = 'none';
    this.applySpecialWaveAtmosphere();
    this.upgradeOverlay.classList.remove('visible');
    this.campOverlay.classList.remove('visible');
    this.hidePauseMenu();
    this.wavePhase = 'countdown';
    this.waveTimer = 0.12;
    this.spawnCooldown = 999;
    this.firing = false;
    this.popText(this.playerPos, 'DEBUG SKIP', '#8ee8ff');
    this.updateHud();
  }

  private getRemainingEnemies() {
    if (this.wavePhase === 'countdown') return this.getWaveEnemyCount();
    if (this.wavePhase === 'bossWarning') return 1;
    if (this.wavePhase === 'complete' || this.wavePhase === 'upgrade') return 0;
    return Math.max(0, this.waveTarget - this.waveSpawned + this.enemies.length);
  }

  private getWaveStateLabel() {
    if (this.wavePhase === 'countdown') return 'INCOMING';
    if (this.wavePhase === 'bossWarning') return 'BOSS';
    if (this.wavePhase === 'complete') return 'CLEARED';
    if (this.wavePhase === 'upgrade') return 'UPGRADE';
    if (this.specialWave !== 'none') return SPECIAL_WAVE_META[this.specialWave].label;
    return 'FIGHT';
  }

  private getWaveBannerTitle() {
    if (this.wavePhase === 'complete') return 'WAVE COMPLETE';
    if (this.wavePhase === 'bossWarning') return 'BOSS INCOMING';
    if (this.nextSpecialWave !== 'none') return SPECIAL_WAVE_META[this.nextSpecialWave].title;
    return `WAVE ${this.wave + 1} INCOMING`;
  }

  private applySpecialWaveAtmosphere() {
    const body = document.body;
    const types: SpecialWaveType[] = ['toxic', 'night', 'elite', 'gunnerRaid', 'burning', 'fog'];
    types.forEach((type) => body.classList.toggle(`special-wave-${type}`, this.specialWave === type || this.nextSpecialWave === type));
    body.classList.toggle('special-wave-active', this.specialWave !== 'none' || this.nextSpecialWave !== 'none');
  }

  private getBuildTags() {
    const tags = [
      ...this.equippedWeapons.filter((weapon) => weapon.level > 1).map((weapon) => `${WEAPONS[weapon.id].icon} T${weapon.level}`),
      ...this.equippedWeapons.filter((weapon) => weapon.evolved).map((weapon) => `${WEAPONS[weapon.id].icon} EVO`),
      this.stats.drone ? 'DRONE' : '',
      this.stats.orbit ? 'ORBIT' : '',
      this.stats.turret ? 'TURRET' : '',
      this.stats.fireAura ? 'FIRE AURA' : '',
      this.stats.lightningAura ? 'STORM' : '',
      this.stats.poison ? 'POISON' : '',
      this.stats.fire ? 'FIRE' : '',
      this.stats.freeze ? 'CRYO' : '',
    ].filter(Boolean);
    return tags.slice(0, 3).join(' / ') || 'STARTER';
  }

  private getWeaponHudTitle() {
    const names = this.equippedWeapons.map((slot) => `${WEAPONS[slot.id].title} T${slot.level}${slot.evolved ? '+' : ''}`);
    return names.length ? names.join(' / ').toUpperCase() : WEAPONS[this.selectedWeapon].title.toUpperCase();
  }

  private togglePause(force?: boolean) {
    if (this.gameOver || this.leveling) return;
    this.paused = force ?? !this.paused;
    this.firing = false;
    this.updateCursorMode();
    if (this.paused) this.showPauseMenu();
    else this.hidePauseMenu();
  }

  private showPauseMenu() {
    this.pauseOverlay.classList.add('visible');
    this.updateCursorMode();
    this.pauseOverlay.innerHTML = `
      <div class="pause-box">
        <h1>PAUSED</h1>
        <div class="pause-actions">
          <button data-action="resume">Resume</button>
          <button data-action="restart">Restart Run</button>
          <button data-action="settings">Settings</button>
          <button data-action="main">Main Menu</button>
        </div>
      </div>`;
    this.bindPauseButtons();
  }

  private showSettingsMenu() {
    this.pauseOverlay.classList.add('visible');
    this.updateCursorMode();
    this.pauseOverlay.innerHTML = `
      <div class="pause-box settings-box">
        <h1>SETTINGS</h1>
        ${this.renderSlider('masterVolume', 'Master Volume')}
        ${this.renderSlider('musicVolume', 'Music Volume')}
        ${this.renderSlider('sfxVolume', 'SFX Volume')}
        <label class="toggle-row">
          <span>Fullscreen</span>
          <input id="fullscreenSetting" type="checkbox" ${this.settings.fullscreen ? 'checked' : ''}>
        </label>
        <label class="toggle-row">
          <span>Screenshake</span>
          <input id="screenshakeSetting" type="checkbox" ${this.settings.screenshake ? 'checked' : ''}>
        </label>
        <div class="pause-actions">
          <button data-action="reset-progress">Reset Progress</button>
          <button data-action="back">Back</button>
        </div>
      </div>`;
    this.bindSettingsControls();
    this.bindPauseButtons();
  }

  private showMainMenu() {
    this.paused = true;
    this.firing = false;
    this.pauseOverlay.classList.add('visible');
    this.updateCursorMode();
    this.pauseOverlay.innerHTML = `
      <div class="pause-box">
        <h1>ZOMBIE RUN</h1>
        <p class="pause-copy">Survive. Level up. Try again.</p>
        <div class="pause-actions">
          <button data-action="start">Start Run</button>
          <button data-action="settings">Settings</button>
        </div>
      </div>`;
    this.bindPauseButtons();
  }

  private hidePauseMenu() {
    this.pauseOverlay.classList.remove('visible');
    this.pauseOverlay.innerHTML = '';
    this.updateCursorMode();
  }

  private bindPauseButtons() {
    this.pauseOverlay.querySelectorAll<HTMLButtonElement>('button[data-action]').forEach((button) => {
      button.addEventListener('click', () => {
        const action = button.dataset.action;
        if (action === 'resume') this.togglePause(false);
        if (action === 'restart' || action === 'start') this.scene.restart();
        if (action === 'settings') this.showSettingsMenu();
        if (action === 'main') this.scene.restart();
        if (action === 'back') this.showPauseMenu();
        if (action === 'reset-progress') this.confirmResetProgress();
      });
    });
  }

  private renderSlider(key: 'masterVolume' | 'musicVolume' | 'sfxVolume', label: string) {
    return `
      <label class="setting-row">
        <span>${label}</span>
        <input id="${key}" type="range" min="0" max="100" value="${Math.round(this.settings[key] * 100)}">
        <strong id="${key}Value">${Math.round(this.settings[key] * 100)}</strong>
      </label>`;
  }

  private bindSettingsControls() {
    (['masterVolume', 'musicVolume', 'sfxVolume'] as const).forEach((key) => {
      const slider = document.getElementById(key) as HTMLInputElement | null;
      const value = document.getElementById(`${key}Value`);
      slider?.addEventListener('input', () => {
        this.settings[key] = Number(slider.value) / 100;
        if (value) value.textContent = slider.value;
        this.saveSettings();
      });
    });

    const fullscreen = document.getElementById('fullscreenSetting') as HTMLInputElement | null;
    fullscreen?.addEventListener('change', () => {
      this.settings.fullscreen = fullscreen.checked;
      this.saveSettings();
      if (fullscreen.checked && !document.fullscreenElement) document.documentElement.requestFullscreen?.();
      if (!fullscreen.checked && document.fullscreenElement) document.exitFullscreen?.();
    });

    const screenshake = document.getElementById('screenshakeSetting') as HTMLInputElement | null;
    screenshake?.addEventListener('change', () => {
      this.settings.screenshake = screenshake.checked;
      this.saveSettings();
    });
  }

  private loadPersistentProgress() {
    this.saveManager.loadSave();
    this.settings = this.saveManager.loadSettings();
    this.runStats = {
      bestWave: this.saveManager.save.bestWave,
      bestTime: this.saveManager.save.bestTime,
      totalKills: this.runStats.totalKills,
    };
  }

  private persistProgress() {
    this.saveManager.saveGame({
      bestWave: this.runStats.bestWave,
      bestTime: this.runStats.bestTime,
      settings: this.settings,
    });
  }

  private loadSettings(): GameSettings {
    return this.saveManager.loadSettings();
  }

  private loadRunStats(): RunStats {
    return {
      bestWave: this.saveManager.save.bestWave,
      bestTime: this.saveManager.save.bestTime,
      totalKills: 0,
    };
  }

  private saveRunStats() {
    this.saveManager.updateStats(this.runStats);
  }

  private formatTime(seconds: number) {
    return `${Math.floor(seconds / 60).toString().padStart(2, '0')}:${Math.floor(seconds % 60).toString().padStart(2, '0')}`;
  }

  private saveSettings() {
    this.saveManager.saveSettings(this.settings);
    this.soundtrack.setVolume(this.settings.masterVolume, this.settings.musicVolume);
    this.sfx.setVolume(this.settings.masterVolume, this.settings.sfxVolume);
  }

  private shake(duration: number, intensity: number) {
    if (this.settings.screenshake) this.cameras.main.shake(duration, intensity * this.settings.sfxVolume * this.settings.masterVolume);
  }

  private setText(id: string, value: string) {
    const node = document.getElementById(id);
    if (node) node.textContent = value;
  }

  private setFill(id: string, pct: number) {
    const node = document.getElementById(id) as HTMLElement | null;
    if (node) node.style.width = `${Phaser.Math.Clamp(pct, 0, 1) * 100}%`;
  }

  private endRun() {
    if (this.playerDead) return;
    this.playerDead = true;
    this.gameOver = true;
    this.updateCursorMode();
    this.soundtrack.gameOverTone();
    this.runStats.bestWave = Math.max(this.runStats.bestWave, this.wave);
    this.runStats.bestTime = Math.max(this.runStats.bestTime, Math.floor(this.elapsed));
    this.runStats.totalKills += this.score;
    this.saveRunStats();
    this.player.setAlpha(0.72);
    this.player.setRotation(-0.85);
    this.player.setScale(1.05, 0.72);
    this.gameOverOverlay.classList.add('visible');
    this.gameOverOverlay.innerHTML = `
      <div class="gameover-box">
        <h1>RUN OVER</h1>
        <p>Level ${this.level} - ${Math.floor(this.elapsed)} seconds - ${this.score} kills</p>
        <button>Restart Run</button>
      </div>`;
    this.gameOverOverlay.querySelector('button')?.addEventListener('click', () => this.scene.restart(), { once: true });
  }

  private cleanupDom() {
    window.removeEventListener('beforeunload', this.handleBeforeUnload);
    document.body.classList.remove('boss-warning-active', 'menu-cursor-active', 'special-wave-active', 'special-wave-toxic', 'special-wave-night', 'special-wave-elite', 'special-wave-gunnerRaid', 'special-wave-burning', 'special-wave-fog');
    document.querySelectorAll('.hud, .upgrades, .gameover, .camp-shop, .pause-menu, .weapon-select, .main-lobby, .damage-flash, .game-crosshair').forEach((node) => node.remove());
    this.soundtrack.destroy();
    this.soundtrack = new DynamicSoundtrack();
    this.sfx.destroy();
    this.sfx = new ArcadeSfx();
  }
}
