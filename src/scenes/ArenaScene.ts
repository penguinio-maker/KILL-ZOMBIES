import Phaser from 'phaser';

type Vec2 = { x: number; y: number };
type EnemyType = 'walker' | 'runner' | 'brute' | 'gunner' | 'spitter' | 'shielder' | 'exploder' | 'screamer' | 'bossTitan' | 'bossGunner';
type WavePhase = 'countdown' | 'bossWarning' | 'active' | 'complete' | 'upgrade';
type BossMode = 'none' | 'chargeWindup' | 'charge' | 'slam' | 'ring';
type SpecialWaveType = 'none' | 'toxic' | 'night' | 'elite' | 'gunnerRaid' | 'burning' | 'fog';
type WeaponId = 'pistol' | 'rapidPistol' | 'heavyPistol' | 'burstPistol' | 'shotgun' | 'smg' | 'burstRifle' | 'flamethrower' | 'dualPistols' | 'launcher' | 'railgun' | 'plasma' | 'lightningCannon' | 'minigun';
type WeaponSlot = 'primary' | 'heavy' | 'sidearm';
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
  type?: 'bullet' | 'toxic';
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

type Turret = {
  id: number;
  pos: Vec2;
  hp: number;
  maxHp: number;
  cooldown: number;
  level: number;
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
  slot: WeaponSlot;
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
const WEAPON_SLOTS: WeaponSlot[] = ['primary', 'heavy', 'sidearm'];
const WEAPON_SLOT_LABELS: Record<WeaponSlot, string> = {
  primary: 'Primary',
  heavy: 'Heavy',
  sidearm: 'Sidearm',
};
const WEAPON_SLOT_BY_ID: Record<WeaponId, WeaponSlot> = {
  pistol: 'sidearm',
  rapidPistol: 'sidearm',
  heavyPistol: 'sidearm',
  burstPistol: 'sidearm',
  dualPistols: 'sidearm',
  shotgun: 'primary',
  smg: 'primary',
  burstRifle: 'primary',
  plasma: 'primary',
  lightningCannon: 'primary',
  minigun: 'primary',
  flamethrower: 'heavy',
  launcher: 'heavy',
  railgun: 'heavy',
};
const SPECIAL_WAVE_META: Record<SpecialWaveType, { title: string; label: string; color: string; bonus: number }> = {
  none: { title: '', label: '', color: '#ffd166', bonus: 0 },
  toxic: { title: 'TOXIC WAVE', label: 'CONTAMINATED', color: '#8aff6a', bonus: 14 },
  night: { title: 'NIGHT SWARM', label: 'DARK HORDE', color: '#9aa7ff', bonus: 12 },
  elite: { title: 'ELITE HUNT', label: 'ELITES', color: '#ffd166', bonus: 22 },
  gunnerRaid: { title: 'GUNNER RAID', label: 'RANGED RAID', color: '#ff9f6a', bonus: 18 },
  burning: { title: 'BURNING HORDE', label: 'FIRESTORM', color: '#ff6b45', bonus: 16 },
  fog: { title: 'FOG EVENT', label: 'LOW VISIBILITY', color: '#c9d1d3', bonus: 12 },
};
const SHOP_WEAPONS: WeaponId[] = ['shotgun', 'smg', 'burstRifle', 'plasma', 'lightningCannon', 'minigun', 'flamethrower', 'launcher', 'railgun', 'rapidPistol', 'heavyPistol', 'burstPistol', 'dualPistols'];

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

  warmup() {
    if (!this.ctx || !this.started) return;
    this.ctx.resume();
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.value = 20;
    gain.gain.setValueAtTime(0.0001, now);
    osc.connect(gain);
    gain.connect(this.master);
    osc.start(now);
    osc.stop(now + 0.025);
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
  nickname: string;
  accountLevel: number;
  accountXp: number;
  accountXpNext: number;
  bestWave: number;
  bestTime: number;
  totalKills: number;
  unlockedWeapons: WeaponId[];
  unlockedCosmetics: string[];
  achievements: string[];
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
      totalKills: Math.max(this.data.totalKills, stats.totalKills),
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
      nickname: 'Nickname',
      accountLevel: 1,
      accountXp: 0,
      accountXpNext: 1000,
      bestWave: 0,
      bestTime: 0,
      totalKills: 0,
      unlockedWeapons: [...STARTING_WEAPONS],
      unlockedCosmetics: [],
      achievements: [],
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
        totalKills: oldStats.totalKills ?? fallback.totalKills,
      }, fallback);
    } catch {
      return fallback;
    }
  }

  private normalizeSave(input: Partial<SaveData>, fallback: SaveData): SaveData {
    const settings = { ...fallback.settings, ...(input.settings ?? {}) };
    const validWeapons = new Set(Object.keys(WEAPONS) as WeaponId[]);
    const unlockedWeapons = Array.from(new Set([...(input.unlockedWeapons ?? fallback.unlockedWeapons), ...STARTING_WEAPONS]))
      .filter((id): id is WeaponId => validWeapons.has(id as WeaponId));
    const normalizeStringList = (value: unknown, fallbackList: string[]) =>
      Array.isArray(value) ? value.filter((item): item is string => typeof item === 'string') : fallbackList;
    return {
      nickname: typeof input.nickname === 'string' && input.nickname.trim() ? input.nickname.trim().slice(0, 18) : fallback.nickname,
      accountLevel: Math.max(1, Math.floor(Number(input.accountLevel ?? fallback.accountLevel) || 1)),
      accountXp: Math.max(0, Math.floor(Number(input.accountXp ?? fallback.accountXp) || 0)),
      accountXpNext: Math.max(100, Math.floor(Number(input.accountXpNext ?? fallback.accountXpNext) || fallback.accountXpNext)),
      bestWave: Math.max(0, Math.floor(Number(input.bestWave ?? fallback.bestWave) || 0)),
      bestTime: Math.max(0, Math.floor(Number(input.bestTime ?? fallback.bestTime) || 0)),
      totalKills: Math.max(0, Math.floor(Number(input.totalKills ?? fallback.totalKills) || 0)),
      unlockedWeapons,
      unlockedCosmetics: normalizeStringList(input.unlockedCosmetics, fallback.unlockedCosmetics),
      achievements: normalizeStringList(input.achievements, fallback.achievements),
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
  private playerHpBar!: Phaser.GameObjects.Container;
  private playerHpBarFill!: Phaser.GameObjects.Rectangle;
  private playerHpBarTimer = 0;
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
  private turrets: Turret[] = [];
  private turretId = 0;
  private placingTurret = false;
  private pendingTurretPrice = 0;
  private turretGhost: Phaser.GameObjects.Container | null = null;
  private turretPlacementPos: Vec2 = { x: 0, y: 0 };
  private turretPlacementValid = false;
  private coins = 0;
  private runCoinsEarned = 0;
  private keys!: Record<'W' | 'A' | 'S' | 'D' | 'SPACE', Phaser.Input.Keyboard.Key>;
  private aim: Vec2 = { x: 1, y: 0 };
  private firing = false;
  private fireCooldown = 0;
  private spawnCooldown = 0;
  private droneCooldown = 0;
  private turretCooldown = 0;
  private auraCooldown = 0;
  private shield = 0;
  private invulnTimer = 0;
  private rollCooldown = 0;
  private rollCooldownMax = 2.8;
  private rollTimer = 0;
  private rollDuration = 0.34;
  private rollTrailTimer = 0;
  private rollDir: Vec2 = { x: 1, y: 0 };
  private rollLandingQueued = false;
  private toxicSlowTimer = 0;
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
  private turretSystemUnlocked = false;
  private turretUnlockShown = false;
  private lastWeaponHudSignature = '';
  private lastHpPct = 1;
  private hpDamageTimeout: number | undefined;
  private transientFx: Phaser.GameObjects.GameObject[] = [];
  private worldDecals: Phaser.GameObjects.GameObject[] = [];
  private hudTick = 0;
  private perfTick = 0;
  private fpsSmoothed = 60;
  private fxQuality = 1;
  private fxQualityTick = 0;
  private debugPerfVisible = false;
  private debugPerfPanel!: HTMLDivElement;
  private uiAssetsPreloaded = false;
  private runPreloadReady = false;
  private runPreloadInProgress = false;
  private preloadOverlay!: HTMLDivElement;
  private bossHudEnemyId: number | null = null;
  private bossHudLastPct = 0;
  private bossHudDamageTimeout: number | undefined;
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
  private activeWeaponSlot: WeaponSlot = 'sidearm';
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
    this.keys = this.input.keyboard!.addKeys('W,A,S,D,SPACE') as Record<'W' | 'A' | 'S' | 'D' | 'SPACE', Phaser.Input.Keyboard.Key>;
    this.input.on('pointermove', (p: Phaser.Input.Pointer) => {
      const world = this.cameras.main.getWorldPoint(p.x, p.y);
      this.aim = { x: world.x, y: world.y };
      this.updateTurretPlacementPreview(world.x, world.y);
      this.updateCrosshair(p.x, p.y);
    });
    this.input.on('pointerdown', (p: Phaser.Input.Pointer) => {
      if (this.placingTurret) {
        if (p.rightButtonDown()) this.cancelTurretPlacement(true);
        else this.confirmTurretPlacement();
        return;
      }
      this.firing = true;
    });
    this.input.mouse?.disableContextMenu();
    this.input.on('pointerup', () => (this.firing = false));
    this.input.keyboard!.on('keydown-R', () => {
      if (this.gameOver) this.scene.restart();
    });
    this.input.keyboard!.on('keydown-ESC', () => {
      if (this.placingTurret) this.cancelTurretPlacement(true);
      else this.togglePause();
    });
    this.input.keyboard!.on('keydown', (event: KeyboardEvent) => {
      if (event.key === '1') this.switchWeaponSlot('primary');
      if (event.key === '2') this.switchWeaponSlot('heavy');
      if (event.key === '3') this.switchWeaponSlot('sidearm');
      if (event.code === 'Space') {
        event.preventDefault();
        if (!event.repeat) this.tryStartRoll();
      }
      if (event.key === 'F3') this.toggleDebugPerf();
    });
    window.addEventListener('beforeunload', this.handleBeforeUnload);
    this.createArena();
    this.player = this.createPlayer();
    this.createHud();
    this.preloadUiAssets();
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
    this.turrets.forEach((turret) => turret.body.destroy());
    this.turrets = [];
    this.turretId = 0;
    this.cancelTurretPlacement(false);
    this.coins = 0;
    this.runCoinsEarned = 0;
    this.aim = { x: 1, y: 0 };
    this.firing = false;
    this.fireCooldown = 0;
    this.activeWeaponSlot = 'sidearm';
    this.spawnCooldown = 0;
    this.droneCooldown = 0;
    this.turretCooldown = 0;
    this.auraCooldown = 0;
    this.shield = 0;
    this.invulnTimer = 0;
    this.rollCooldown = 0;
    this.rollTimer = 0;
    this.rollTrailTimer = 0;
    this.rollDir = { x: 1, y: 0 };
    this.rollLandingQueued = false;
    this.toxicSlowTimer = 0;
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
    this.turretSystemUnlocked = false;
    this.turretUnlockShown = false;
    this.transientFx.forEach((fx) => { if (fx.active) fx.destroy(); });
    this.worldDecals.forEach((fx) => { if (fx.active) fx.destroy(); });
    this.transientFx = [];
    this.worldDecals = [];
    this.hudTick = 0;
    this.perfTick = 0;
    this.fpsSmoothed = 60;
    this.fxQuality = 1;
    this.fxQualityTick = 0;
    this.lastWeaponHudSignature = '';
    this.lastHpPct = 1;
    if (this.hpDamageTimeout) window.clearTimeout(this.hpDamageTimeout);
    this.hpDamageTimeout = undefined;
    if (this.bossHudDamageTimeout) window.clearTimeout(this.bossHudDamageTimeout);
    this.bossHudDamageTimeout = undefined;
    this.bossHudEnemyId = null;
    this.bossHudLastPct = 0;
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
    this.playerHpBarTimer = 0;
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
    this.updateTurrets(dt);
    this.updateOrbitals(dt);
    this.updateDrone(dt);
    this.updateSpecials(dt);
    this.updateSoundtrack();
    this.hudTick += rawDt;
    this.perfTick += rawDt;
    this.updateFxQuality(rawDt);
    if (this.hudTick >= 0.08) {
      this.updateHud();
      this.hudTick = 0;
    }
    this.updateDebugPerf(rawDt);
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

    const hpBar = this.add.container(0, 44).setAlpha(0);
    const hpShadow = this.add.rectangle(0, 0, 50, 8, 0x000000, 0.45).setOrigin(0.5);
    const hpBack = this.add.rectangle(0, 0, 46, 5, 0x090d13, 0.86).setOrigin(0.5).setStrokeStyle(1, 0x151b24, 0.9);
    const hpFill = this.add.rectangle(-22, 0, 44, 3, 0xd9373f, 0.92).setOrigin(0, 0.5);
    hpBar.add([hpShadow, hpBack, hpFill]);
    c.add([backpack, backStrap, leftLeg, rightLeg, body, jacket, belt, neck, head, face, visor, hatTop, hatCrown, hatBrim, scarf, leftArm, rightArm, gun, hpBar]);
    this.worldLayer.add(c);
    this.playerGun = gun;
    this.playerLegs = [leftLeg, rightLeg];
    this.playerHpBar = hpBar;
    this.playerHpBarFill = hpFill;
    return c;
  }

  private createEnemy(type: EnemyType, pos: Vec2): Enemy {
    const late = Math.max(0, this.wave - 6);
    const scale = 1 + Math.min(3.4, this.wave * 0.12 + late * 0.055);
    const speedBonus = Math.min(74, this.wave * 3.4 + late * 1.7);
    const normalSpeedBonus = speedBonus * (this.wave > 10 ? 0.86 : 1);
    const bossTier = this.getBossTier();
    const wave10Boss = (type === 'bossTitan' || type === 'bossGunner') && bossTier === 2;
    const bossPower = type === 'bossTitan' || type === 'bossGunner' ? (1 + Math.max(0, bossTier - 1) * 0.42) * (wave10Boss ? 0.86 : 1) : 1;
    const bossTempo = type === 'bossTitan' || type === 'bossGunner' ? (1 + Math.max(0, bossTier - 1) * 0.2) * (wave10Boss ? 0.88 : 1) : 1;
    const bossHpMul = wave10Boss ? 0.84 : 1;
    const bossSpeedMul = wave10Boss ? 0.9 : 1;
    const config = {
      walker: { hp: 34 * scale, speed: 78 + normalSpeedBonus, damage: 9, radius: 20, color: 0x88906f },
      runner: { hp: 24 * scale, speed: 132 + normalSpeedBonus * 1.1, damage: 7, radius: 18, color: 0x8d9674 },
      brute: { hp: 135 * scale, speed: 54 + normalSpeedBonus * 0.65, damage: 20, radius: 34, color: 0x7f8f69 },
      gunner: { hp: 92 * scale, speed: 82 + normalSpeedBonus * 0.78, damage: 10, radius: 23, color: 0x8a806b },
      spitter: { hp: 68 * scale, speed: 66 + normalSpeedBonus * 0.56, damage: 7, radius: 22, color: 0x6f9a5f },
      shielder: { hp: 118 * scale, speed: 58 + normalSpeedBonus * 0.56, damage: 12, radius: 30, color: 0x7b8970 },
      exploder: { hp: 36 * scale, speed: 116 + normalSpeedBonus * 0.92, damage: 26, radius: 21, color: 0x9b5c4f },
      screamer: { hp: 74 * scale, speed: 74 + normalSpeedBonus * 0.62, damage: 8, radius: 22, color: 0x9b8167 },
      bossTitan: { hp: 1500 * (1 + this.wave * 0.24) * bossPower * bossHpMul, speed: (86 + speedBonus * 0.46) * bossTempo * bossSpeedMul, damage: 42 * bossPower, radius: 70, color: bossTier >= 3 ? 0x8f5d52 : 0x788761 },
      bossGunner: { hp: 1120 * (1 + this.wave * 0.22) * bossPower * bossHpMul, speed: (128 + speedBonus * 0.62) * bossTempo * bossSpeedMul, damage: 22 * bossPower, radius: 42, color: bossTier >= 3 ? 0xb9685c : 0x9b8167 },
    }[type];
    const body = this.drawEnemy(type, config.color);
    body.setData('enemyVisual', true);
    body.setData('enemyCorpse', false);
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
    body.setData('enemyId', enemy.id);
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
    if (this.specialWave === 'toxic' && enemy.type === 'spitter') {
      enemy.attackCooldown *= 0.72;
      enemy.damage *= 1.12;
      this.tintContainer(enemy.body, 0x8aff6a);
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
    if (type === 'spitter') return this.drawSpitterEnemy(color);
    if (type === 'shielder') return this.drawShielderEnemy(color);
    if (type === 'exploder') return this.drawExploderEnemy(color);
    if (type === 'screamer') return this.drawScreamerEnemy(color);
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

  private drawSpitterEnemy(color: number) {
    const c = this.add.container(0, 0);
    const outline = 0x10141a;
    const uniform = 0x243331;
    const skin = color;
    const skinDark = 0x3d5b42;
    const acid = 0x8aff6a;
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

    c.add(this.add.rectangle(0, 35, 48, 12, 0x000000, 0.3));
    const leftLeg = this.add.container(-8, 29);
    const rightLeg = this.add.container(9, 29);
    px(leftLeg, 0, 0, 8, 19, 0x1a2426);
    px(rightLeg, 0, 0, 8, 19, 0x222c2d);

    const body = this.add.container(0, 7);
    px(body, 0, 2, 28, 32, uniform);
    chip(body, -8, 3, 7, 24, 0x15211f, 0.8);
    chip(body, 6, 5, 12, 20, 0x35533a);
    chip(body, 8, 14, 8, 7, acid, 0.48);
    chip(body, 0, -12, 28, 5, 0x0e1718);

    const leftArm = this.add.container(-18, 8);
    leftArm.setRotation(0.34);
    px(leftArm, 0, 0, 7, 23, skinDark);
    const rightArm = this.add.container(19, 8);
    rightArm.setRotation(-0.38);
    px(rightArm, 0, 0, 7, 23, skin);

    const head = this.add.container(1, -20);
    px(head, 0, 0, 27, 24, skin);
    chip(head, -7, 0, 8, 18, skinDark, 0.86);
    chip(head, 4, -14, 24, 7, 0x26362f);
    chip(head, -6, -2, 5, 5, 0xd7ff8a);
    chip(head, 6, -2, 5, 5, 0xd7ff8a);
    chip(head, 3, 9, 15, 5, 0x0f1612);
    const mouthGlow = chip(head, 4, 9, 11, 4, acid, 0.32);
    const sac = this.add.circle(10, 4, 6, acid, 0.24);
    head.add(sac);

    c.add([leftLeg, rightLeg, body, leftArm, rightArm, head]);
    c.setData('anim', { leftArm, rightArm, leftLeg, rightLeg, head, mouthGlow, baseLean: -0.06, heavy: false, runner: false, spitter: true });
    return c;
  }

  private drawShielderEnemy(color: number) {
    const c = this.drawEnemy('brute', color);
    c.setScale(1.18);
    const shield = this.add.container(31, 3);
    shield.add(this.add.rectangle(0, 0, 24, 42, 0x10141a, 0.96).setOrigin(0.5));
    shield.add(this.add.rectangle(0, 0, 19, 36, 0x4b5962, 0.96).setOrigin(0.5));
    shield.add(this.add.rectangle(0, -8, 13, 5, 0xff6b45, 0.72).setOrigin(0.5));
    shield.add(this.add.rectangle(0, 8, 13, 5, 0xffd166, 0.28).setOrigin(0.5));
    c.add(shield);
    c.setData('shieldVisual', shield);
    return c;
  }

  private drawExploderEnemy(color: number) {
    const c = this.drawEnemy('runner', color);
    c.setScale(1.06);
    const core = this.add.circle(1, 2, 13, 0xff6b45, 0.34).setStrokeStyle(3, 0x6e2024, 0.72);
    const fuse = this.add.rectangle(0, -18, 8, 5, 0xffd166, 0.78).setOrigin(0.5);
    c.add([core, fuse]);
    c.setData('exploderCore', core);
    return c;
  }

  private drawScreamerEnemy(color: number) {
    const c = this.drawEnemy('walker', color);
    c.setScale(1.08);
    const halo = this.add.circle(0, -20, 24, 0xffd166, 0.08).setStrokeStyle(3, 0xff6b45, 0.25);
    const jaw = this.add.rectangle(0, -10, 16, 8, 0x10141a, 0.95).setOrigin(0.5);
    c.add([halo, jaw]);
    c.setData('screamHalo', halo);
    c.setData('screamJaw', jaw);
    return c;
  }

  private updatePlayer(dt: number) {
    const input = {
      x: Number(this.keys.D.isDown) - Number(this.keys.A.isDown),
      y: Number(this.keys.S.isDown) - Number(this.keys.W.isDown),
    };
    const len = Math.hypot(input.x, input.y) || 1;
    this.toxicSlowTimer = Math.max(0, this.toxicSlowTimer - dt);
    this.rollCooldown = Math.max(0, this.rollCooldown - dt);
    this.rollTrailTimer = Math.max(0, this.rollTrailTimer - dt);
    const rolling = this.rollTimer > 0;
    if (rolling) {
      const rollElapsed = this.rollDuration - this.rollTimer;
      const ease = Phaser.Math.Clamp(1 - rollElapsed / this.rollDuration, 0, 1);
      const rollSpeed = 460 + 300 * ease;
      this.playerVel.x = this.rollDir.x * rollSpeed;
      this.playerVel.y = this.rollDir.y * rollSpeed;
      this.rollTimer = Math.max(0, this.rollTimer - dt);
      if (rollElapsed > 0.07 && rollElapsed < 0.24) this.invulnTimer = Math.max(this.invulnTimer, 0.05);
      if (this.rollTrailTimer <= 0) {
        this.rollTrailTimer = 0.045;
        this.rollTrailFx();
      }
      if (this.rollTimer <= 0 && this.rollLandingQueued) {
        this.rollLandingQueued = false;
        this.rollLandingFx();
      }
    } else {
      const slowMul = this.toxicSlowTimer > 0 ? 0.72 : 1;
      this.playerVel.x = input.x ? (input.x / len) * this.stats.speed * slowMul : 0;
      this.playerVel.y = input.y ? (input.y / len) * this.stats.speed * slowMul : 0;
    }
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
    const rollSquash = this.rollTimer > 0 ? 0.84 : 1;
    const rollStretch = this.rollTimer > 0 ? 1.12 : 1;
    this.gunRecoil = Math.max(0, this.gunRecoil - dt * 18);
    this.player.setScale(facing * rollStretch, rollSquash);
    this.player.setRotation(0);
    this.player.y = this.playerPos.y + bob;
    this.playerGun.setRotation(facing === -1 ? Math.PI - angle : angle);
    this.playerGun.setPosition(20 - this.gunRecoil, 7 + (this.firing && this.rollTimer <= 0 ? -1 : 0));
    this.playerLegs[0].y = 27 + (moving ? Math.sin(this.elapsed * 18) * 3 : 0);
    this.playerLegs[1].y = 27 + (moving ? Math.sin(this.elapsed * 18 + Math.PI) * 3 : 0);
    this.player.setAlpha(this.playerHitTimer > 0 ? 0.55 : this.rollTimer > 0 && this.invulnTimer > 0 ? 0.78 : 1);
    this.playerHpBarTimer = Math.max(0, this.playerHpBarTimer - dt);
    const hpPct = Phaser.Math.Clamp(this.hp / this.maxHp, 0, 1);
    this.playerHpBar.setAlpha(this.playerHpBarTimer > 0 ? Math.min(0.86, this.playerHpBarTimer * 1.7) : 0);
    this.playerHpBar.setScale(1, this.playerHpBarTimer > 0 ? 1 : 0.82);
    this.playerHpBarFill.width = Math.max(1, 44 * hpPct);
    this.playerHpBarFill.fillColor = hpPct < 0.3 ? 0x8f1d2a : hpPct < 0.58 ? 0xd97d32 : 0xd9373f;
  }

  private tryStartRoll() {
    if (this.inLobby || this.selectingWeapon || this.leveling || this.paused || this.gameOver || this.playerDead) return;
    if (this.rollCooldown > 0 || this.rollTimer > 0) {
      if (this.rollCooldown > 0.22) this.popText(this.playerPos, `${this.rollCooldown.toFixed(1)}s`, '#7f9aaa');
      return;
    }
    const input = {
      x: Number(this.keys.D.isDown) - Number(this.keys.A.isDown),
      y: Number(this.keys.S.isDown) - Number(this.keys.W.isDown),
    };
    let len = Math.hypot(input.x, input.y);
    if (len > 0.1) {
      this.rollDir = { x: input.x / len, y: input.y / len };
    } else {
      const angle = Phaser.Math.Angle.Between(this.playerPos.x, this.playerPos.y, this.aim.x, this.aim.y);
      this.rollDir = { x: Math.cos(angle), y: Math.sin(angle) };
      len = 1;
    }
    this.rollTimer = this.rollDuration;
    this.rollCooldown = this.rollCooldownMax;
    this.rollTrailTimer = 0;
    this.rollLandingQueued = true;
    this.firing = false;
    this.invulnTimer = Math.max(this.invulnTimer, 0.03);
    this.rollStartFx();
  }

  private rollStartFx() {
    const angle = Math.atan2(this.rollDir.y, this.rollDir.x);
    for (let i = 0; i < 7; i += 1) {
      this.pixelSparkDirected(this.playerPos, angle + Math.PI + Phaser.Math.FloatBetween(-0.7, 0.7), Phaser.Math.Between(28, 78), i % 2 ? 0x27384a : 0x8f4a3d, Phaser.Math.Between(3, 5));
    }
    this.shake(55, 0.0025);
  }

  private rollTrailFx() {
    if (!this.shouldSpawnFx(1.25)) return;
    const ghost = this.add.container(this.playerPos.x - this.rollDir.x * 16, this.playerPos.y - this.rollDir.y * 16);
    const body = this.add.rectangle(0, 3, 34, 44, 0x182536, 0.22).setStrokeStyle(2, 0x913844, 0.16);
    const shadow = this.add.ellipse(0, 28, 56, 12, 0x000000, 0.22);
    ghost.add([shadow, body]);
    ghost.setRotation(Math.atan2(this.rollDir.y, this.rollDir.x) * 0.08);
    this.fxLayer.add(ghost);
    this.trackTransientFx(ghost);
    this.tweens.add({ targets: ghost, alpha: 0, scaleX: 1.18, scaleY: 0.82, duration: 170, onComplete: () => ghost.destroy() });
    for (let i = 0; i < 2; i += 1) {
      this.pixelSparkDirected(this.playerPos, Math.atan2(this.rollDir.y, this.rollDir.x) + Math.PI + Phaser.Math.FloatBetween(-0.55, 0.55), Phaser.Math.Between(18, 46), 0x3b4552, 3);
    }
  }

  private rollLandingFx() {
    const pos = { x: this.playerPos.x - this.rollDir.x * 10, y: this.playerPos.y - this.rollDir.y * 6 };
    const dust = this.add.ellipse(pos.x, pos.y + 25, 58, 13, 0x9a6650, 0.18);
    this.fxLayer.add(dust);
    this.trackTransientFx(dust);
    this.tweens.add({ targets: dust, alpha: 0, scaleX: 1.5, scaleY: 0.5, duration: 180, onComplete: () => dust.destroy() });
    this.shake(75, 0.002);
  }

  private getWeaponSlot(id: WeaponId): WeaponSlot {
    return WEAPON_SLOT_BY_ID[id];
  }

  private getEquippedSlot(slot: WeaponSlot) {
    return this.equippedWeapons.find((weapon) => weapon.slot === slot);
  }

  private getActiveWeapon() {
    return this.getEquippedSlot(this.activeWeaponSlot) ?? this.getEquippedSlot('sidearm') ?? this.equippedWeapons[0];
  }

  private switchWeaponSlot(slot: WeaponSlot) {
    if (this.inLobby || this.selectingWeapon || this.leveling || this.paused || this.gameOver) return;
    const weapon = this.getEquippedSlot(slot);
    if (!weapon) {
      this.popText(this.playerPos, `${WEAPON_SLOT_LABELS[slot].toUpperCase()} EMPTY`, '#8495a4');
      return;
    }
    this.activeWeaponSlot = slot;
    this.popText(this.playerPos, WEAPON_SLOT_LABELS[slot].toUpperCase(), '#ffd166');
    this.updateHud();
  }

  private updateShooting(dt: number) {
    this.equippedWeapons.forEach((slot) => (slot.cooldown = Math.max(0, slot.cooldown - dt)));
    if (this.rollTimer > 0) return;
    if (!this.firing) return;
    const angle = Phaser.Math.Angle.Between(this.playerPos.x, this.playerPos.y, this.aim.x, this.aim.y);
    const slot = this.getActiveWeapon();
    if (!slot || slot.cooldown > 0) return;
    const weapon = WEAPONS[slot.id];
    const baseWeapon = WEAPONS[this.selectedWeapon];
    const tierDamage = 1 + (slot.level - 1) * 0.16;
    const tierFireRate = 1 + (slot.level - 1) * 0.08;
    slot.cooldown = 1 / (weapon.fireRate * tierFireRate * (this.stats.fireRate / baseWeapon.fireRate));
    const shots = this.getWeaponShotAngles(angle, weapon, slot.evolved);
    if (this.stats.doubleShot > 0) shots.push(...shots.map((shot) => shot + 0.055));
    const damage = this.stats.damage * (weapon.damage / baseWeapon.damage) * tierDamage * (slot.evolved ? 1.18 : 1);
    shots.forEach((shotAngle) => this.spawnBullet(shotAngle, 'player', { damage }, weapon, slot.evolved));
    this.muzzleFx(angle);
    this.shellFx(angle);
    this.sfx.playWeaponShot(slot.id);
    this.gunRecoil = weapon.id === 'shotgun' || weapon.id === 'launcher' || weapon.id === 'railgun' ? 13 : weapon.id === 'smg' || weapon.id === 'minigun' ? 4 : 7;
    this.shake(35, weapon.shake);
  }

  private getChaosLevel() {
    const specialLoad = this.specialWave === 'none' ? 0 : this.specialWave === 'night' || this.specialWave === 'burning' || this.specialWave === 'fog' ? 0.16 : 0.1;
    return Phaser.Math.Clamp(this.enemies.length / 150 + this.bullets.length / 130 + this.transientFx.length / 220 + this.groundHazards.length / 70 + specialLoad, 0, 1);
  }

  private getEffectScale() {
    const chaos = this.getChaosLevel();
    const specialMul = this.specialWave === 'none' ? 1 : this.specialWave === 'fog' || this.specialWave === 'burning' || this.specialWave === 'night' ? 0.74 : 0.84;
    const qualityMul = Phaser.Math.Clamp(this.fxQuality, 0.22, 1);
    const base = chaos > 0.82 ? 0.28 : chaos > 0.62 ? 0.45 : chaos > 0.38 ? 0.68 : 1;
    return Phaser.Math.Clamp(base * specialMul * qualityMul, 0.12, 1);
  }

  private shouldSpawnFx(weight = 1) {
    return Math.random() < this.getEffectScale() / weight;
  }

  private getTransientFxLimit() {
    const chaos = this.getChaosLevel();
    const base = this.specialWave === 'none' ? 320 : 235;
    const qualityLimit = Math.floor(base * Phaser.Math.Clamp(this.fxQuality, 0.45, 1));
    if (chaos > 0.8) return Math.min(qualityLimit, 150);
    if (chaos > 0.55) return Math.min(qualityLimit, 205);
    return qualityLimit;
  }

  private getDecalLimit() {
    const base = this.specialWave === 'none' ? 70 : 42;
    return Math.max(18, Math.floor(base * Phaser.Math.Clamp(this.fxQuality, 0.42, 1)));
  }

  private getHazardLimit(type?: 'toxic' | 'fire') {
    const specialCap = this.specialWave === 'burning' || this.specialWave === 'toxic' || this.specialWave === 'fog' ? 22 : 30;
    const typeCap = type === 'fire' ? Math.min(specialCap, 18) : specialCap;
    return Math.max(10, Math.floor(typeCap * Phaser.Math.Clamp(this.fxQuality, 0.5, 1)));
  }

  private getGlowLimit() {
    return this.fxQuality < 0.55 || this.specialWave === 'fog' ? 2 : this.specialWave === 'none' ? 5 : 3;
  }

  private updateFxQuality(dt: number) {
    this.fxQualityTick += dt;
    if (this.fxQualityTick < 0.5) return;
    this.fxQualityTick = 0;
    const fps = this.fpsSmoothed;
    const heavyFx = this.transientFx.length > this.getTransientFxLimit() * 0.8 || this.groundHazards.length > this.getHazardLimit() * 0.8;
    if (fps < 38 || heavyFx) this.fxQuality = Math.max(0.32, this.fxQuality - 0.12);
    else if (fps > 54 && !heavyFx) this.fxQuality = Math.min(1, this.fxQuality + 0.04);
  }

  private trackTransientFx<T extends Phaser.GameObjects.GameObject>(fx: T, list = this.transientFx, limit = this.getTransientFxLimit()) {
    list.push(fx);
    fx.once('destroy', () => {
      const index = list.indexOf(fx);
      if (index >= 0) list.splice(index, 1);
    });
    while (list.length > limit) {
      const oldest = list.shift();
      if (oldest?.active) oldest.destroy();
    }
    return fx;
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
    this.cleanupAllEnemies('start-wave');
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
    this.cleanupAllEnemies('wave-complete');
    this.wavePhase = 'complete';
    this.waveTimer = 1.25;
    this.firing = false;
    this.hp = Math.min(this.maxHp, this.hp + 10 + this.wave * 2);
    this.popText(this.playerPos, 'WAVE COMPLETE', '#8aff6a');
    this.runStats.bestWave = Math.max(this.runStats.bestWave, this.wave);
    this.persistProgress();
    this.tryUnlockTurretSystem();
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
    const base = 1 + Math.max(0, enemy.bossTier - 1) * 0.2;
    return enemy.bossTier === 2 ? base * 0.88 : base;
  }

  private getBossDowntime(enemy: Enemy) {
    return enemy.bossTier === 2 ? 1.28 : 1;
  }

  private getBossTelegraphMul(enemy: Enemy) {
    return enemy.bossTier === 2 ? 1.24 : 1;
  }

  private getBossAttackMul(enemy: Enemy) {
    return enemy.bossTier === 2 ? 0.84 : 1;
  }

  private tryUnlockTurretSystem() {
    if (this.turretSystemUnlocked || this.wave < 10) return;
    this.turretSystemUnlocked = true;
    if (!this.turretUnlockShown) {
      this.turretUnlockShown = true;
      this.popText(this.playerPos, 'TURRET SYSTEM UNLOCKED', '#ffd166');
      this.soundtrack.levelUpStinger();
    }
  }

  private cleanupAllEnemies(reason: string) {
    this.enemies.forEach((enemy) => this.destroyEnemyVisual(enemy));
    this.enemies = [];
    this.enemyProjectiles.forEach((shot) => shot.body.destroy());
    this.enemyProjectiles = [];
    this.waveSpawned = Math.min(this.waveSpawned, this.waveTarget);
    this.spawnCooldown = 999;
    this.bossHudEnemyId = null;
    this.bossHudLastPct = 0;

    const enemyVisuals = this.collectEnemyVisuals();
    enemyVisuals.forEach((visual) => {
      this.tweens.killTweensOf(visual);
      visual.destroy();
    });

    this.debugEnemyCleanup(reason);
  }

  private destroyEnemyVisual(enemy: Enemy) {
    if (!enemy.body || !enemy.body.active) return;
    this.tweens.killTweensOf(enemy.body);
    enemy.body.destroy();
  }

  private collectEnemyVisuals() {
    const layers = [this.worldLayer, this.fxLayer].filter(Boolean);
    const visuals: Phaser.GameObjects.GameObject[] = [];
    layers.forEach((layer) => {
      const children = (layer as Phaser.GameObjects.Container).list as Phaser.GameObjects.GameObject[];
      children.forEach((child) => {
        if (child.getData?.('enemyVisual')) visuals.push(child);
      });
    });
    this.transientFx.forEach((fx) => {
      if (fx.getData?.('enemyVisual')) visuals.push(fx);
    });
    return Array.from(new Set(visuals)).filter((visual) => visual.active);
  }

  private debugEnemyCleanup(reason: string) {
    const remainingVisuals = this.collectEnemyVisuals().length;
    if (this.enemies.length === 0 && remainingVisuals > 0) {
      console.warn(`[cleanupAllEnemies:${reason}] enemy visuals remain`, remainingVisuals);
    }
  }

  private spawnBoss() {
    if (this.gameOver || this.leveling || this.inLobby) return;
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
    this.soundtrack.levelUpStinger();
    this.shake(900, 0.012);
  }

  private beginNextWaveCountdown() {
    this.cleanupAllEnemies('next-wave-countdown');
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
    if (this.wavePhase !== 'active' || this.gameOver || this.leveling || this.inLobby) return;
    const angle = Phaser.Math.FloatBetween(0, Math.PI * 2);
    const dist = Phaser.Math.Between(520, 740);
    const type = this.pickWaveEnemyType();
    this.waveSpawned += 1;
    this.enemies.push(this.createEnemy(type, { x: this.playerPos.x + Math.cos(angle) * dist, y: this.playerPos.y + Math.sin(angle) * dist }));
  }

  private pickWaveEnemyType(): EnemyType {
    if (this.specialWave === 'night') return Math.random() < 0.66 ? 'walker' : Math.random() < 0.86 ? 'runner' : this.wave >= 6 ? 'exploder' : 'runner';
    if (this.specialWave === 'elite') return Math.random() < 0.5 ? 'brute' : this.wave >= 11 ? Phaser.Utils.Array.GetRandom(['gunner', 'spitter', 'shielder', 'screamer'] as EnemyType[]) : this.wave >= 9 ? Phaser.Utils.Array.GetRandom(['gunner', 'spitter', 'shielder'] as EnemyType[]) : 'runner';
    if (this.specialWave === 'gunnerRaid') return Math.random() < 0.38 ? 'gunner' : Math.random() < 0.58 && this.wave >= 7 ? 'spitter' : Math.random() < 0.72 && this.wave >= 8 ? 'shielder' : Math.random() < 0.86 ? 'runner' : 'walker';
    if (this.specialWave === 'burning') return Math.random() < 0.24 && this.wave >= 5 ? 'exploder' : Math.random() < 0.66 ? 'runner' : Math.random() < 0.84 ? 'walker' : 'brute';
    if (this.specialWave === 'toxic') return Math.random() < 0.32 && this.wave >= 6 ? 'spitter' : Math.random() < 0.58 ? 'walker' : Math.random() < 0.82 ? 'runner' : 'brute';
    if (this.specialWave === 'fog') return Math.random() < 0.45 ? 'runner' : Math.random() < 0.72 ? 'walker' : 'brute';
    if (this.wave < 3) return 'walker';
    if (this.wave % 5 === 0 && this.waveSpawned >= this.waveTarget - 1) return 'brute';
    const roll = Math.random();
    const late = Math.max(0, this.wave - 6);
    const activeGunners = this.enemies.filter((enemy) => enemy.type === 'gunner').length;
    const activeSpitters = this.enemies.filter((enemy) => enemy.type === 'spitter').length;
    const activeShielders = this.enemies.filter((enemy) => enemy.type === 'shielder').length;
    const activeScreamers = this.enemies.filter((enemy) => enemy.type === 'screamer').length;
    const gunnerCap = this.wave >= 14 ? 3 : this.wave >= 10 ? 2 : 1;
    const spitterCap = this.wave >= 14 ? 4 : this.wave >= 10 ? 3 : 2;
    const shielderCap = this.wave >= 14 ? 3 : this.wave >= 9 ? 2 : 1;
    const screamerCap = this.wave >= 15 ? 2 : 1;
    const gunnerChance = this.wave >= 9 && activeGunners < gunnerCap ? Math.min(0.045 + late * 0.003, 0.08) : 0;
    const spitterChance = this.wave >= 7 && activeSpitters < spitterCap ? Math.min(0.075 + late * 0.005, 0.14) : 0;
    const shielderChance = this.wave >= 8 && activeShielders < shielderCap ? Math.min(0.055 + late * 0.004, 0.11) : 0;
    const screamerChance = this.wave >= 11 && activeScreamers < screamerCap ? Math.min(0.035 + late * 0.003, 0.07) : 0;
    const exploderChance = this.wave >= 5 ? Math.min(0.075 + late * 0.004, 0.13) : 0;
    const bruteChance = Math.min(0.06 + this.wave * 0.018 + late * 0.012, 0.34);
    const runnerChance = this.wave % 4 === 0 ? 0.78 : Math.min(0.2 + this.wave * 0.038 + late * 0.012, 0.68);
    if (roll < gunnerChance) return 'gunner';
    if (roll < gunnerChance + spitterChance) return 'spitter';
    if (roll < gunnerChance + spitterChance + shielderChance) return 'shielder';
    if (roll < gunnerChance + spitterChance + shielderChance + screamerChance) return 'screamer';
    if (roll < gunnerChance + spitterChance + shielderChance + screamerChance + exploderChance) return 'exploder';
    if (this.wave >= 5 && roll < bruteChance) return 'brute';
    if (this.wave >= 3 && roll < runnerChance) return 'runner';
    return 'walker';
  }

  private updateEnemies(dt: number) {
    const offscreenSkip = this.enemies.length > 120;
    const screamers = this.enemies.filter((enemy) => enemy.type === 'screamer' && enemy.hp > 0);
    for (const enemy of this.enemies) {
      enemy.hitFlash = Math.max(0, enemy.hitFlash - dt);
      enemy.attackCooldown = Math.max(0, enemy.attackCooldown - dt);
      enemy.burstTimer = Math.max(0, enemy.burstTimer - dt);
      enemy.ringCooldown = Math.max(0, enemy.ringCooldown - dt);
      const dx = this.playerPos.x - enemy.pos.x;
      const dy = this.playerPos.y - enemy.pos.y;
      const playerDistanceSq = dx * dx + dy * dy;
      const farFromPlayer = playerDistanceSq > 1100 * 1100;
      const skipAnimation = offscreenSkip && farFromPlayer && enemy.id % 3 !== Math.floor(this.elapsed * 12) % 3;
      if (enemy.burn > 0) {
        enemy.burn -= dt;
        enemy.hp -= 10 * dt;
        if (Math.random() < 0.02 && this.shouldSpawnFx(1.8)) this.pixelSpark(enemy.pos, 0xb65a36);
      }
      if (enemy.poison > 0) {
        enemy.poison -= dt;
        enemy.hp -= 7 * dt;
      }
      if (this.groundHazards.length < this.getHazardLimit('fire') && this.specialWave === 'burning' && enemy.burn > 0 && Math.random() < 0.026 * this.getEffectScale()) this.createGroundHazard('fire', enemy.pos, 38, 8, 1.05);
      if (this.groundHazards.length < this.getHazardLimit('toxic') && this.specialWave === 'toxic' && Math.random() < 0.0035 * this.getEffectScale()) this.createGroundHazard('toxic', enemy.pos, 48, 6, 2.35);
      enemy.freeze = Math.max(0, enemy.freeze - dt);
      const angle = Math.atan2(dy, dx);
      const freezeMul = enemy.freeze > 0 ? 0.48 : 1;
      const playerDistance = Math.sqrt(playerDistanceSq);
      const buffedByScreamer = enemy.type !== 'screamer' && enemy.type !== 'bossTitan' && enemy.type !== 'bossGunner' && screamers.some((screamer) => {
        const sx = screamer.pos.x - enemy.pos.x;
        const sy = screamer.pos.y - enemy.pos.y;
        return sx * sx + sy * sy < 230 * 230;
      });
      const roleSpeedMul = buffedByScreamer ? 1.22 : 1;
      if (buffedByScreamer && Math.random() < 0.015 * this.getEffectScale()) this.pixelSpark(enemy.pos, 0xffd166);
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
      } else if (enemy.type === 'spitter') {
        if (enemy.attackCooldown <= 0) {
          enemy.vel.x *= 0.72;
          enemy.vel.y *= 0.72;
          enemy.aimTimer += dt;
          if (enemy.burstShots <= 0) {
            enemy.burstShots = 1;
            this.spitterAimFx(enemy);
          }
          if (enemy.aimTimer >= 0.72) this.spitterShot(enemy, angle);
        } else {
          enemy.aimTimer = 0;
          enemy.burstShots = 0;
          const tooClose = playerDistance < 245;
          const tooFar = playerDistance > 520;
          const moveDir = tooClose ? angle + Math.PI : tooFar ? angle : angle + Math.PI / 2;
          const strafeMul = tooClose || tooFar ? 5.1 : 1.45;
          if (!tooClose && !tooFar && Math.random() < 0.005) enemy.strafeDir *= -1;
          enemy.vel.x += Math.cos(moveDir) * enemy.speed * freezeMul * roleSpeedMul * dt * strafeMul * (tooClose || tooFar ? 1 : enemy.strafeDir);
          enemy.vel.y += Math.sin(moveDir) * enemy.speed * freezeMul * roleSpeedMul * dt * strafeMul * (tooClose || tooFar ? 1 : enemy.strafeDir);
          enemy.attackCooldown = Math.max(0, enemy.attackCooldown - dt * 0.32);
        }
      } else if (enemy.type === 'screamer') {
        enemy.aimTimer += dt;
        const desired = playerDistance < 330 ? angle + Math.PI : playerDistance > 560 ? angle : angle + Math.PI / 2 * enemy.strafeDir;
        if (Math.random() < 0.004) enemy.strafeDir *= -1;
        enemy.vel.x += Math.cos(desired) * enemy.speed * freezeMul * dt * (playerDistance < 330 || playerDistance > 560 ? 4.4 : 1.5);
        enemy.vel.y += Math.sin(desired) * enemy.speed * freezeMul * dt * (playerDistance < 330 || playerDistance > 560 ? 4.4 : 1.5);
        if (enemy.aimTimer > 2.1) {
          enemy.aimTimer = 0;
          this.screamerPulse(enemy);
        }
      } else if (enemy.type === 'exploder') {
        enemy.vel.x += Math.cos(angle) * enemy.speed * freezeMul * roleSpeedMul * dt * 10;
        enemy.vel.y += Math.sin(angle) * enemy.speed * freezeMul * roleSpeedMul * dt * 10;
        if (playerDistance < 72 && enemy.attackCooldown <= 0) {
          enemy.attackCooldown = 999;
          enemy.hp = 0;
          this.enemyExplosion(enemy, true);
        }
      } else {
        const push = enemy.type === 'shielder' ? 5.7 : 8;
        enemy.vel.x += Math.cos(angle) * enemy.speed * freezeMul * roleSpeedMul * dt * push;
        enemy.vel.y += Math.sin(angle) * enemy.speed * freezeMul * roleSpeedMul * dt * push;
      }
      enemy.vel.x *= Math.pow(0.05, dt);
      enemy.vel.y *= Math.pow(0.05, dt);
      enemy.pos.x += enemy.vel.x * dt;
      enemy.pos.y += enemy.vel.y * dt;
      const stride = enemy.type === 'runner' ? 17 : enemy.type === 'brute' || enemy.type === 'bossTitan' ? 7 : enemy.type === 'gunner' || enemy.type === 'bossGunner' ? 9 : 11;
      const cycle = skipAnimation ? 0 : Math.sin(this.elapsed * stride + enemy.id);
      const bob = cycle * (enemy.type === 'brute' ? 1.6 : 3);
      enemy.body.setPosition(enemy.pos.x, enemy.pos.y + bob);
      enemy.body.scaleX = dx < 0 ? -Math.abs(enemy.body.scaleX) : Math.abs(enemy.body.scaleX);
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
            spitter?: boolean;
            gun?: Phaser.GameObjects.Container;
            head?: Phaser.GameObjects.Container;
            mouthGlow?: Phaser.GameObjects.Rectangle;
          }
        | undefined;
      enemy.body.setRotation((anim?.baseLean ?? 0) + cycle * (enemy.type === 'brute' ? 0.02 : 0.045));
      if (anim && !skipAnimation) {
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
        if (anim.spitter) {
          const charging = enemy.aimTimer > 0;
          anim.head?.setRotation(charging ? Math.sin(this.elapsed * 18 + enemy.id) * 0.08 : cycle * 0.05);
          anim.mouthGlow?.setAlpha(charging ? 0.38 + Math.sin(this.elapsed * 26) * 0.18 : 0.22);
          anim.rightArm.setRotation((charging ? -0.64 : -0.38) - cycle * 0.08);
          anim.leftArm.setRotation((charging ? 0.62 : 0.34) + cycle * 0.1);
        }
      }
      enemy.body.setAlpha(enemy.hitFlash > 0 ? 0.76 : 1);
      const touchRadius = enemy.radius + 18;
      const touchingPlayer = playerDistanceSq < touchRadius * touchRadius;
      if (enemy.hp > 0 && enemy.type !== 'gunner' && enemy.type !== 'bossGunner' && enemy.type !== 'exploder' && touchingPlayer && enemy.attackCooldown <= 0) {
        enemy.attackCooldown = Math.max(0.28, 0.5 - this.stats.invuln * 0.08);
        this.damagePlayer(enemy.damage);
      }
    }
    const dead = this.enemies.filter((e) => e.hp <= 0);
    dead.forEach((enemy) => this.killEnemy(enemy));
    this.enemies = this.enemies.filter((e) => e.hp > 0);
  }

  private updateBullets(dt: number) {
    const enemyGrid = this.buildEnemyGrid(170);
    for (const bullet of this.bullets) {
      bullet.life -= dt;
      bullet.pos.x += bullet.vel.x * dt;
      bullet.pos.y += bullet.vel.y * dt;
      const playerDx = bullet.pos.x - this.playerPos.x;
      const playerDy = bullet.pos.y - this.playerPos.y;
      if (bullet.ricochet > 0 && playerDx * playerDx + playerDy * playerDy > 620 * 620) {
        bullet.ricochet -= 1;
        bullet.vel.x *= -1;
        bullet.vel.y *= -1;
        bullet.life += 0.28;
        if (this.shouldSpawnFx(1.4)) this.pixelSpark(bullet.pos, 0xfff2a3);
      }
      bullet.body.setPosition(bullet.pos.x, bullet.pos.y);
      const hit = this.getBulletHit(bullet, enemyGrid, 170);
      if (!hit) continue;
      const crit = Math.random() < this.stats.critChance;
      const armorMul = hit.type === 'bossTitan' ? 0.5 : hit.type === 'bossGunner' ? 0.55 : hit.type === 'gunner' ? 0.58 : hit.type === 'spitter' ? 0.82 : 1;
      const shieldBlock = this.getShieldBlockMultiplier(hit, bullet);
      const finalDamage = bullet.damage * (crit ? this.stats.critDamage : 1) * armorMul * shieldBlock;
      hit.hp -= finalDamage;
      hit.hitFlash = 0.07;
      if (shieldBlock < 0.9) this.shieldBlockFx(hit.pos);
      const knockMul = hit.type === 'bossTitan' || hit.type === 'bossGunner' ? 0.04 : hit.type === 'gunner' || hit.type === 'spitter' ? 0.12 : hit.type === 'brute' ? 0.16 : 0.34;
      hit.vel.x += bullet.vel.x * knockMul * bullet.knockback;
      hit.vel.y += bullet.vel.y * knockMul * bullet.knockback;
      if (bullet.fire) hit.burn = Math.max(hit.burn, 2.4);
      if (crit && this.stats.critBurn > 0) hit.burn = Math.max(hit.burn, 2.8);
      if (bullet.poison) hit.poison = Math.max(hit.poison, 3.2);
      if (bullet.freeze) hit.freeze = Math.max(hit.freeze, 1.35);
      if (this.shouldSpawnFx(this.enemies.length > 120 ? 2.6 : 1.35)) this.damageNumber(hit.pos, Math.round(finalDamage));
      const hitCount = hit.type === 'brute' || hit.type === 'bossTitan' || hit.type === 'bossGunner' ? 10 : hit.type === 'gunner' || hit.type === 'spitter' ? 7 : 5;
      this.bloodHitFx(bullet.pos, Math.atan2(bullet.vel.y, bullet.vel.x), hitCount);
      if (this.shouldSpawnFx(1.25)) this.impactFx(bullet.pos, Math.atan2(bullet.vel.y, bullet.vel.x));
      this.hitStop = Math.max(this.hitStop, (hit.type === 'brute' ? 0.055 : 0.028) * this.getEffectScale());
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

  private buildEnemyGrid(cellSize: number) {
    const grid = new Map<string, Enemy[]>();
    for (const enemy of this.enemies) {
      const cx = Math.floor(enemy.pos.x / cellSize);
      const cy = Math.floor(enemy.pos.y / cellSize);
      const key = `${cx},${cy}`;
      const bucket = grid.get(key);
      if (bucket) bucket.push(enemy);
      else grid.set(key, [enemy]);
    }
    return grid;
  }

  private getBulletHit(bullet: Bullet, grid: Map<string, Enemy[]>, cellSize: number) {
    const cx = Math.floor(bullet.pos.x / cellSize);
    const cy = Math.floor(bullet.pos.y / cellSize);
    for (let gx = cx - 1; gx <= cx + 1; gx += 1) {
      for (let gy = cy - 1; gy <= cy + 1; gy += 1) {
        const bucket = grid.get(`${gx},${gy}`);
        if (!bucket) continue;
        for (const enemy of bucket) {
          const radius = bullet.radius + enemy.radius;
          const dx = bullet.pos.x - enemy.pos.x;
          const dy = bullet.pos.y - enemy.pos.y;
          if (dx * dx + dy * dy < radius * radius) return enemy;
        }
      }
    }
    return undefined;
  }

  private getShieldBlockMultiplier(hit: Enemy, bullet: Bullet) {
    if (hit.type === 'shielder') {
      const toPlayer = Math.atan2(this.playerPos.y - hit.pos.y, this.playerPos.x - hit.pos.x);
      const incoming = Math.atan2(bullet.vel.y, bullet.vel.x);
      const frontHit = Math.cos(incoming - toPlayer) < -0.35;
      return frontHit ? 0.28 : 1;
    }
    const protector = this.enemies.find((enemy) => {
      if (enemy.type !== 'shielder' || enemy.hp <= 0) return false;
      const dx = enemy.pos.x - hit.pos.x;
      const dy = enemy.pos.y - hit.pos.y;
      return dx * dx + dy * dy < 135 * 135;
    });
    return protector ? 0.72 : 1;
  }

  private shieldBlockFx(pos: Vec2) {
    if (!this.shouldSpawnFx(1.2)) return;
    const spark = this.add.rectangle(pos.x, pos.y - 10, 26, 5, 0x96f7ff, 0.55).setRotation(Phaser.Math.FloatBetween(-0.6, 0.6));
    this.fxLayer.add(spark);
    this.trackTransientFx(spark);
    this.tweens.add({ targets: spark, alpha: 0, scaleX: 1.6, duration: 140, onComplete: () => spark.destroy() });
  }

  private updateBossTitan(enemy: Enemy, angle: number, distance: number, dt: number) {
    const tempo = this.getBossTempo(enemy);
    const downtime = this.getBossDowntime(enemy);
    const telegraphMul = this.getBossTelegraphMul(enemy);
    const attackMul = this.getBossAttackMul(enemy);
    if (!enemy.rage && enemy.hp < enemy.maxHp * 0.5) {
      enemy.rage = true;
      enemy.speed *= enemy.bossTier === 2 ? 1.22 : 1.45;
      enemy.damage *= enemy.bossTier === 2 ? 1.16 : 1.35;
      enemy.attackCooldown = Math.min(enemy.attackCooldown, enemy.bossTier === 2 ? 1.35 : 1.15);
      enemy.ringCooldown = Math.min(enemy.ringCooldown, enemy.bossTier === 2 ? 1.05 : 0.7);
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
        enemy.aimTimer = ((enemy.rage ? 0.52 : 0.62) / tempo) * (enemy.bossTier === 2 ? 0.92 : 1);
        enemy.chargeHit = false;
        this.shake(220, enemy.rage ? 0.013 : 0.01);
      }
      return;
    }
    if (enemy.bossMode === 'charge') {
      const chargeSpeed = enemy.speed * (enemy.rage ? 18.5 : 15.5) * (enemy.bossTier === 2 ? 0.86 : 1);
      enemy.vel.x += Math.cos(enemy.chargeAngle) * chargeSpeed * dt;
      enemy.vel.y += Math.sin(enemy.chargeAngle) * chargeSpeed * dt;
      if (Math.random() < 0.72) this.bossChargeTrail(enemy, enemy.chargeAngle);
      if (!enemy.chargeHit && distance < enemy.radius + 28) {
        enemy.chargeHit = true;
        this.damagePlayer(enemy.damage * (enemy.rage ? 1.85 : 1.65) * attackMul);
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
        enemy.ringCooldown = (Phaser.Math.FloatBetween(enemy.rage ? 1.45 : 2.25, enemy.rage ? 2.15 : 3.25) / tempo) * downtime;
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
        enemy.aimTimer = ((enemy.rage ? 0.38 : 0.52) / tempo) * telegraphMul;
        enemy.attackCooldown = (Phaser.Math.FloatBetween(enemy.rage ? 0.75 : 1.15, enemy.rage ? 1.25 : 1.75) / tempo) * downtime;
        this.bossRingTelegraph(enemy);
      } else if (distance < 230) {
        enemy.bossMode = 'slam';
        enemy.aimTimer = ((enemy.rage ? 0.54 : 0.66) / tempo) * telegraphMul;
        enemy.attackCooldown = ((enemy.rage ? 1.25 : 1.8) / tempo) * downtime;
        this.bossTelegraph(enemy, 110, 0xff6b45);
      } else if (distance < 1180) {
        enemy.bossMode = 'chargeWindup';
        enemy.chargeAngle = angle;
        enemy.aimTimer = ((enemy.rage ? 0.34 : 0.46) / tempo) * telegraphMul;
        enemy.attackCooldown = (Phaser.Math.FloatBetween(enemy.rage ? 1.45 : 2.2, enemy.rage ? 2.05 : 3.2) / tempo) * downtime;
        this.bossChargeTelegraph(enemy, enemy.chargeAngle);
      } else {
        this.bossAimedVolley(enemy, angle);
        enemy.attackCooldown = (Phaser.Math.FloatBetween(enemy.rage ? 1.15 : 1.65, enemy.rage ? 1.75 : 2.35) / tempo) * downtime;
      }
    }
  }

  private updateBossGunner(enemy: Enemy, angle: number, distance: number, dt: number) {
    const tempo = this.getBossTempo(enemy);
    const downtime = this.getBossDowntime(enemy);
    const telegraphMul = this.getBossTelegraphMul(enemy);
    const attackMul = this.getBossAttackMul(enemy);
    if (!enemy.rage && enemy.hp < enemy.maxHp * 0.5) {
      enemy.rage = true;
      enemy.speed *= enemy.bossTier === 2 ? 1.18 : 1.38;
      enemy.damage *= enemy.bossTier === 2 ? 1.14 : 1.32;
      enemy.attackCooldown = Math.min(enemy.attackCooldown, enemy.bossTier === 2 ? 1.18 : 0.9);
      enemy.ringCooldown = Math.min(enemy.ringCooldown, enemy.bossTier === 2 ? 0.95 : 0.45);
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
        enemy.aimTimer = ((enemy.rage ? 0.42 : 0.5) / tempo) * (enemy.bossTier === 2 ? 0.95 : 1);
        enemy.chargeHit = false;
        this.shake(180, enemy.rage ? 0.011 : 0.008);
      }
      return;
    }
    if (enemy.bossMode === 'charge') {
      const chargeSpeed = enemy.speed * (enemy.rage ? 16.4 : 13.6) * (enemy.bossTier === 2 ? 0.84 : 1);
      enemy.vel.x += Math.cos(enemy.chargeAngle) * chargeSpeed * dt;
      enemy.vel.y += Math.sin(enemy.chargeAngle) * chargeSpeed * dt;
      if (Math.random() < 0.62) this.bossChargeTrail(enemy, enemy.chargeAngle);
      if (!enemy.chargeHit && distance < enemy.radius + 26) {
        enemy.chargeHit = true;
        this.damagePlayer(enemy.damage * (enemy.rage ? 1.65 : 1.45) * attackMul);
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
        enemy.ringCooldown = (Phaser.Math.FloatBetween(enemy.rage ? 1.35 : 2.15, enemy.rage ? 2.05 : 3.05) / tempo) * downtime;
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
        enemy.aimTimer = ((enemy.rage ? 0.32 : 0.46) / tempo) * telegraphMul;
        enemy.attackCooldown = (Phaser.Math.FloatBetween(enemy.rage ? 0.65 : 1.05, enemy.rage ? 1.1 : 1.55) / tempo) * downtime;
        this.bossRingTelegraph(enemy);
        return;
      }
      if (distance > 260 && distance < 980 && Math.random() < (enemy.rage ? 0.28 : 0.16)) {
        enemy.bossMode = 'chargeWindup';
        enemy.chargeAngle = angle;
        enemy.aimTimer = ((enemy.rage ? 0.28 : 0.38) / tempo) * telegraphMul;
        enemy.attackCooldown = (Phaser.Math.FloatBetween(enemy.rage ? 1.25 : 1.9, enemy.rage ? 1.85 : 2.8) / tempo) * downtime;
        this.bossChargeTelegraph(enemy, enemy.chargeAngle);
        return;
      }
      if (Math.random() < (enemy.rage ? 0.62 : 0.52)) this.bossGunnerSpread(enemy, angle);
      else this.startGunnerBurst(enemy, angle);
      enemy.attackCooldown = (Phaser.Math.FloatBetween(enemy.rage ? 0.72 : 1.05, enemy.rage ? 1.08 : 1.45) / tempo) * downtime;
      enemy.aimTimer = 0;
      if (Math.random() < (enemy.rage ? 0.26 : 0.16)) this.summonBossMinions(enemy);
    } else {
      enemy.aimTimer = 0;
    }
  }

  private bossTelegraph(enemy: Enemy, radius: number, color: number) {
    const ring = this.add.circle(enemy.pos.x, enemy.pos.y, radius, color, 0.12).setStrokeStyle(4, color, 0.55);
    this.fxLayer.add(ring);
    this.trackTransientFx(ring);
    this.tweens.add({ targets: ring, alpha: 0, scale: 1.25, duration: 650, onComplete: () => ring.destroy() });
  }

  private bossChargeTelegraph(enemy: Enemy, angle: number) {
    const line = this.add.rectangle(enemy.pos.x + Math.cos(angle) * 170, enemy.pos.y + Math.sin(angle) * 170, 360, enemy.bossTier === 2 ? 15 : 12, 0xff3b32, enemy.bossTier === 2 ? 0.5 : 0.42);
    line.setRotation(angle);
    this.fxLayer.add(line);
    this.trackTransientFx(line);
    this.tweens.add({ targets: line, alpha: 0, scaleX: 1.35, duration: (enemy.rage ? 410 : 540) * (enemy.bossTier === 2 ? 1.22 : 1), onComplete: () => line.destroy() });
    const eye = this.add.circle(enemy.pos.x + Math.cos(angle) * 34, enemy.pos.y + Math.sin(angle) * 34, 12, 0xfff2a3, 0.92);
    this.fxLayer.add(eye);
    this.trackTransientFx(eye);
    this.tweens.add({ targets: eye, alpha: 0, scale: enemy.bossTier === 2 ? 2.9 : 2.4, duration: (enemy.rage ? 330 : 450) * (enemy.bossTier === 2 ? 1.22 : 1), onComplete: () => eye.destroy() });
  }

  private bossChargeTrail(enemy: Enemy, angle: number) {
    if (!this.shouldSpawnFx(1.25)) return;
    const backAngle = angle + Math.PI + Phaser.Math.FloatBetween(-0.52, 0.52);
    const pos = {
      x: enemy.pos.x + Math.cos(backAngle) * Phaser.Math.FloatBetween(enemy.radius * 0.25, enemy.radius * 0.85),
      y: enemy.pos.y + Math.sin(backAngle) * Phaser.Math.FloatBetween(enemy.radius * 0.25, enemy.radius * 0.85),
    };
    const dust = this.add.circle(pos.x, pos.y, Phaser.Math.Between(5, 12), enemy.rage ? 0xff4a34 : 0xc79c72, enemy.rage ? 0.46 : 0.34);
    this.fxLayer.add(dust);
    this.trackTransientFx(dust);
    this.tweens.add({ targets: dust, alpha: 0, scale: Phaser.Math.FloatBetween(1.8, 3.2), duration: Phaser.Math.Between(260, 430), onComplete: () => dust.destroy() });
  }

  private bossRingTelegraph(enemy: Enemy) {
    this.popText(enemy.pos, 'BULLET RING', '#ff6b45');
    const radius = enemy.type === 'bossTitan' ? 142 : 108;
    const ring = this.add.circle(enemy.pos.x, enemy.pos.y, radius, 0xff3b32, 0.08).setStrokeStyle(5, 0xffc0a3, 0.72);
    this.fxLayer.add(ring);
    this.trackTransientFx(ring);
    this.tweens.add({ targets: ring, alpha: 0, scale: 0.58, duration: enemy.rage ? 460 : 620, onComplete: () => ring.destroy() });
  }

  private bossBulletRing(enemy: Enemy) {
    const tierBonus = Math.max(0, enemy.bossTier - 1);
    const wave10Ring = enemy.bossTier === 2;
    const count = Math.max(14, (enemy.rage ? (enemy.type === 'bossTitan' ? 34 : 32) : enemy.type === 'bossTitan' ? 26 : 24) + tierBonus * 4 - (wave10Ring ? 6 : 0));
    const speed = ((enemy.rage ? 430 : 360) + tierBonus * 36) * (wave10Ring ? 0.86 : 1);
    const offset = Phaser.Math.FloatBetween(0, Math.PI * 2);
    for (let i = 0; i < count; i += 1) {
      if (i % (enemy.rage ? 9 : 7) === 0) continue;
      const shotAngle = offset + (i / count) * Math.PI * 2;
      this.fireBossRingShot(enemy, shotAngle, speed, enemy.damage * (enemy.rage ? 0.68 : 0.58) * this.getBossAttackMul(enemy));
    }
    if (enemy.rage) {
      const secondCount = Math.max(10, (enemy.type === 'bossTitan' ? 18 : 16) + tierBonus * 2 - (wave10Ring ? 4 : 0));
      this.time.delayedCall(260, () => {
        if (this.wavePhase !== 'active' || this.gameOver || !this.enemies.includes(enemy) || enemy.hp <= 0) return;
        for (let i = 0; i < secondCount; i += 1) {
          if (i % 6 === 0) continue;
          const shotAngle = offset + Math.PI / secondCount + (i / secondCount) * Math.PI * 2;
          this.fireBossRingShot(enemy, shotAngle, speed * 0.86, enemy.damage * 0.52 * this.getBossAttackMul(enemy));
        }
      });
    }
    const sparks = Math.max(8, Math.floor(28 * this.getEffectScale()));
    for (let i = 0; i < sparks; i += 1) {
      this.pixelSparkDirected(enemy.pos, (i / sparks) * Math.PI * 2, Phaser.Math.Between(90, 230), enemy.rage ? 0xff3b32 : 0xff8a5c, 5);
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
        if (this.wavePhase !== 'active' || this.gameOver || !this.enemies.includes(enemy) || enemy.hp <= 0) return;
        const freshAngle = Phaser.Math.Angle.Between(enemy.pos.x, enemy.pos.y, this.playerPos.x, this.playerPos.y);
        this.fireEnemyShot(enemy, freshAngle + offset, ((enemy.rage ? 500 : 440) + tierBonus * 30) * (enemy.bossTier === 2 ? 0.9 : 1), enemy.damage * (enemy.rage ? 0.76 : 0.66) * this.getBossAttackMul(enemy));
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
      this.damagePlayer(enemy.damage * (1 - d / 230) * this.getBossAttackMul(enemy));
    }
    for (let i = 0; i < 18; i += 1) {
      this.pixelSparkDirected(enemy.pos, (i / 18) * Math.PI * 2, Phaser.Math.Between(85, 190), 0xff8a5c, 6);
    }
    this.shake(420, 0.018);
  }

  private bossGunnerSpread(enemy: Enemy, angle: number) {
    const tempo = this.getBossTempo(enemy);
    const tierBonus = Math.max(0, enemy.bossTier - 1);
    enemy.attackCooldown = (Phaser.Math.FloatBetween(enemy.rage ? 0.85 : 1.25, enemy.rage ? 1.35 : 1.85) / tempo) * this.getBossDowntime(enemy);
    enemy.aimTimer = 0;
    this.popText(enemy.pos, 'SPREAD SHOT', '#ff6b45');
    const pattern = enemy.rage || enemy.bossTier >= 3 ? (enemy.bossTier === 2 ? [-0.38, -0.23, -0.1, 0.1, 0.23, 0.38] : [-0.48, -0.34, -0.22, -0.11, 0, 0.11, 0.22, 0.34, 0.48]) : [-0.34, -0.2, -0.09, 0.09, 0.2, 0.34];
    pattern.forEach((offset) => this.fireEnemyShot(enemy, angle + offset, ((enemy.rage ? 500 : 445) + tierBonus * 34) * (enemy.bossTier === 2 ? 0.9 : 1), enemy.damage * (enemy.rage ? 0.95 : 0.86) * this.getBossAttackMul(enemy)));
    if (enemy.rage || enemy.bossTier >= 3) {
      this.time.delayedCall(220, () => {
        if (this.wavePhase !== 'active' || this.gameOver || !this.enemies.includes(enemy) || enemy.hp <= 0) return;
        const freshAngle = Phaser.Math.Angle.Between(enemy.pos.x, enemy.pos.y, this.playerPos.x, this.playerPos.y);
        if (enemy.bossTier === 2 && enemy.rage) return;
        [-0.24, -0.08, 0.08, 0.24].forEach((offset) => this.fireEnemyShot(enemy, freshAngle + offset, (470 + tierBonus * 30) * (enemy.bossTier === 2 ? 0.9 : 1), enemy.damage * 0.72 * this.getBossAttackMul(enemy)));
      });
    }
  }

  private summonBossMinions(enemy: Enemy) {
    if (this.wavePhase !== 'active' || this.gameOver || !this.enemies.includes(enemy)) return;
    for (let i = 0; i < 3; i += 1) {
      const angle = Phaser.Math.FloatBetween(0, Math.PI * 2);
      const pos = { x: enemy.pos.x + Math.cos(angle) * 90, y: enemy.pos.y + Math.sin(angle) * 90 };
      this.enemies.push(this.createEnemy(i === 0 ? 'runner' : 'walker', pos));
    }
    this.popText(enemy.pos, 'SUMMON', '#ff8a5c');
  }

  private screamerPulse(enemy: Enemy) {
    this.popText(enemy.pos, 'SCREAM', '#ffd166');
    const ring = this.add.circle(enemy.pos.x, enemy.pos.y, 68, 0xffd166, 0.08).setStrokeStyle(4, 0xff6b45, 0.38);
    this.fxLayer.add(ring);
    this.trackTransientFx(ring);
    this.tweens.add({ targets: ring, alpha: 0, scale: 3.1, duration: 620, ease: 'Sine.easeOut', onComplete: () => ring.destroy() });
    for (const target of this.enemies) {
      if (target === enemy || target.type === 'bossTitan' || target.type === 'bossGunner') continue;
      const dx = target.pos.x - enemy.pos.x;
      const dy = target.pos.y - enemy.pos.y;
      if (dx * dx + dy * dy < 260 * 260) {
        target.attackCooldown = Math.min(target.attackCooldown, 0.18);
        target.vel.x += Math.cos(Math.atan2(dy, dx)) * 120;
        target.vel.y += Math.sin(Math.atan2(dy, dx)) * 120;
      }
    }
  }

  private enemyExplosion(enemy: Enemy, proximity = false) {
    if (enemy.body.getData('exploded')) return;
    enemy.body.setData('exploded', true);
    const radius = proximity ? 118 : 94;
    const d = Phaser.Math.Distance.Between(enemy.pos.x, enemy.pos.y, this.playerPos.x, this.playerPos.y);
    const blast = this.add.circle(enemy.pos.x, enemy.pos.y, radius * 0.35, 0xff6b45, 0.2).setStrokeStyle(4, 0xffd166, 0.46);
    this.fxLayer.add(blast);
    this.trackTransientFx(blast);
    this.tweens.add({ targets: blast, alpha: 0, scale: 3, duration: 360, ease: 'Sine.easeOut', onComplete: () => blast.destroy() });
    for (let i = 0; i < 12; i += 1) {
      this.pixelSparkDirected(enemy.pos, (i / 12) * Math.PI * 2, Phaser.Math.Between(60, 145), i % 2 ? 0xff6b45 : 0xffd166, 5);
    }
    if (d < radius) this.damagePlayer(enemy.damage * (1 - d / radius) * (proximity ? 1.15 : 0.85));
    for (const target of this.enemies) {
      if (target === enemy) continue;
      const td = Phaser.Math.Distance.Between(enemy.pos.x, enemy.pos.y, target.pos.x, target.pos.y);
      if (td < radius) {
        target.hp -= enemy.damage * 1.8 * (1 - td / radius);
        target.hitFlash = 0.08;
      }
    }
    this.shake(190, 0.009);
  }

  private spitterAimFx(enemy: Enemy) {
    const angle = Phaser.Math.Angle.Between(enemy.pos.x, enemy.pos.y, this.playerPos.x, this.playerPos.y);
    const mouth = { x: enemy.pos.x + Math.cos(angle) * 24, y: enemy.pos.y + Math.sin(angle) * 24 - 10 };
    const charge = this.add.circle(mouth.x, mouth.y, 8, 0x8aff6a, 0.52).setStrokeStyle(2, 0xd7ff8a, 0.42);
    this.fxLayer.add(charge);
    this.trackTransientFx(charge);
    this.tweens.add({ targets: charge, alpha: 0, scale: 2.1, duration: 520, ease: 'Sine.easeOut', onComplete: () => charge.destroy() });
    for (let i = 0; i < 3; i += 1) {
      this.pixelSparkDirected(mouth, angle + Phaser.Math.FloatBetween(-0.62, 0.62), Phaser.Math.Between(18, 42), 0x8aff6a, 3);
    }
  }

  private spitterShot(enemy: Enemy, angle: number) {
    enemy.aimTimer = 0;
    enemy.burstShots = 0;
    enemy.attackCooldown = Phaser.Math.FloatBetween(2.2, 3.15);
    const lead = Phaser.Math.Clamp(Phaser.Math.Distance.Between(enemy.pos.x, enemy.pos.y, this.playerPos.x, this.playerPos.y) / 700, 0, 0.42);
    const aim = Math.atan2((this.playerPos.y + this.playerVel.y * lead) - enemy.pos.y, (this.playerPos.x + this.playerVel.x * lead) - enemy.pos.x);
    this.fireSpitShot(enemy, aim + Phaser.Math.FloatBetween(-0.055, 0.055));
  }

  private fireSpitShot(enemy: Enemy, shotAngle: number) {
    const spawn = { x: enemy.pos.x + Math.cos(shotAngle) * 34, y: enemy.pos.y + Math.sin(shotAngle) * 34 - 8 };
    const body = this.add.container(spawn.x, spawn.y);
    const glob = this.add.circle(0, 0, 9, 0x8aff6a, 0.9).setStrokeStyle(3, 0x173f28, 0.9);
    const core = this.add.rectangle(1, -1, 7, 4, 0xd7ff8a, 0.72);
    core.setRotation(shotAngle);
    body.add([glob, core]);
    this.fxLayer.add(body);
    this.enemyProjectiles.push({
      pos: { ...spawn },
      vel: { x: Math.cos(shotAngle) * 285, y: Math.sin(shotAngle) * 285 },
      damage: enemy.damage,
      radius: 11,
      life: 2.2,
      type: 'toxic',
      body,
    });
    this.sfx.playWeaponShot('rapidPistol', true);
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
    enemy.burstShots = enemy.type === 'bossGunner' ? Math.max(4, (enemy.rage ? 8 : 6) + Math.max(0, enemy.bossTier - 1) - (enemy.bossTier === 2 ? 2 : 0)) : 3;
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
    this.fireEnemyShot(enemy, shotAngle, ((enemy.type === 'bossGunner' ? (enemy.rage ? 560 : 500) : 390) + Math.max(0, enemy.bossTier - 1) * 32) * (enemy.bossTier === 2 ? 0.9 : 1), enemy.damage * (enemy.type === 'bossGunner' ? 1.05 : 1) * this.getBossAttackMul(enemy));
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
      if (shot.type === 'toxic') shot.body.setRotation(shot.body.rotation + dt * 7);
      shot.body.setPosition(shot.pos.x, shot.pos.y);
      let impacted = false;
      if (Phaser.Math.Distance.Between(shot.pos.x, shot.pos.y, this.playerPos.x, this.playerPos.y) < shot.radius + 16) {
        if (shot.type === 'toxic') this.toxicSpitImpact(shot.pos);
        else this.enemyBulletImpact(shot.pos, Math.atan2(shot.vel.y, shot.vel.x));
        this.damagePlayer(shot.damage);
        shot.life = 0;
        impacted = true;
      }
      if (!impacted && shot.type === 'toxic' && shot.life <= 0) this.toxicSpitImpact(shot.pos);
    }
    this.enemyProjectiles = this.enemyProjectiles.filter((shot) => {
      const alive = shot.life > 0;
      if (!alive) shot.body.destroy();
      return alive;
    });
  }

  private toxicSpitImpact(pos: Vec2) {
    this.createGroundHazard('toxic', pos, 72, 7.5, 4.8);
    const splash = this.add.circle(pos.x, pos.y, 18, 0x8aff6a, 0.22).setStrokeStyle(3, 0xd7ff8a, 0.42);
    this.fxLayer.add(splash);
    this.trackTransientFx(splash);
    this.tweens.add({ targets: splash, alpha: 0, scale: 2.3, duration: 360, ease: 'Sine.easeOut', onComplete: () => splash.destroy() });
    for (let i = 0; i < 8; i += 1) {
      this.pixelSparkDirected(pos, (i / 8) * Math.PI * 2 + Phaser.Math.FloatBetween(-0.28, 0.28), Phaser.Math.Between(34, 88), 0x8aff6a, 4);
    }
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
      this.runCoinsEarned += coin.value;
      coin.body.destroy();
      this.popText({ x: this.playerPos.x, y: this.playerPos.y - 34 }, `+${coin.value} COINS`, '#ffd166');
    });
    this.coinDrops = this.coinDrops.filter((coin) => !collected.includes(coin));
  }

  private createTurretBody(level: number, ghost = false) {
    const body = this.add.container(0, 0);
    const alpha = ghost ? 0.58 : 1;
    const shadow = this.add.ellipse(0, 24, 52, 16, 0x000000, ghost ? 0.18 : 0.34);
    const base = this.add.rectangle(0, 13, 34, 18, ghost ? 0x2b4a58 : 0x263241, alpha).setStrokeStyle(2, ghost ? 0x8ee8ff : 0x101621, ghost ? 0.72 : 0.95);
    const neck = this.add.rectangle(0, -1, 14, 15, ghost ? 0x3e6270 : 0x38475a, alpha);
    const head = this.add.rectangle(0, -13, 42, 20, ghost ? 0x385d69 : 0x2f394a, alpha).setStrokeStyle(2, ghost ? 0x8ee8ff : 0xff6b45, ghost ? 0.52 : 0.72);
    const barrel = this.add.rectangle(27, -13, 25 + level * 3, 7, ghost ? 0x8ee8ff : 0xffd166, ghost ? 0.45 : 0.9).setOrigin(0, 0.5);
    const core = this.add.rectangle(-8, -13, 8, 8, ghost ? 0x8ee8ff : 0xff6b45, ghost ? 0.55 : 0.9);
    body.add([shadow, base, neck, head, barrel, core]);
    body.setData('barrel', barrel);
    body.setData('core', core);
    body.setData('ghostParts', [base, head, barrel, core]);
    return body;
  }

  private updateTurrets(dt: number) {
    for (let i = this.turrets.length - 1; i >= 0; i -= 1) {
      const turret = this.turrets[i];
      for (const enemy of this.enemies) {
        if (enemy.hp <= 0 || enemy.type === 'bossTitan' || enemy.type === 'bossGunner') continue;
        if (Phaser.Math.Distance.Between(enemy.pos.x, enemy.pos.y, turret.pos.x, turret.pos.y) < enemy.radius + 25 && enemy.attackCooldown <= 0) {
          enemy.attackCooldown = 0.75;
          turret.hp -= enemy.damage;
          turret.body.setAlpha(0.62);
          this.time.delayedCall(90, () => { if (turret.body.active) turret.body.setAlpha(1); });
          this.pixelSpark(turret.pos, 0xff6b45);
        }
      }
      if (turret.hp <= 0) {
        this.popText(turret.pos, 'TURRET DESTROYED', '#ff6b6b');
        this.explosion(turret.pos, 58, 0);
        turret.body.destroy();
        this.turrets.splice(i, 1);
        this.stats.turret = this.turrets.length;
        continue;
      }
      turret.cooldown = Math.max(0, turret.cooldown - dt);
      const target = this.enemies
        .filter((enemy) => enemy.hp > 0 && Phaser.Math.Distance.Between(enemy.pos.x, enemy.pos.y, turret.pos.x, turret.pos.y) < 520)
        .sort((a, b) => Phaser.Math.Distance.Between(a.pos.x, a.pos.y, turret.pos.x, turret.pos.y) - Phaser.Math.Distance.Between(b.pos.x, b.pos.y, turret.pos.x, turret.pos.y))[0];
      const barrel = turret.body.getData('barrel') as Phaser.GameObjects.Rectangle | undefined;
      const core = turret.body.getData('core') as Phaser.GameObjects.Rectangle | undefined;
      if (target) {
        const angle = Phaser.Math.Angle.Between(turret.pos.x, turret.pos.y, target.pos.x, target.pos.y);
        turret.body.setRotation(angle * 0.04);
        barrel?.setRotation(angle);
        if (turret.cooldown <= 0) {
          turret.cooldown = Math.max(0.32, 0.82 - turret.level * 0.09);
          const spawn = { x: turret.pos.x + Math.cos(angle) * 34, y: turret.pos.y + Math.sin(angle) * 34 };
          this.spawnTurretBullet(spawn, angle, 11 + this.stats.damage * (0.18 + turret.level * 0.045));
          core?.setFillStyle(0xffd166, 1);
          this.time.delayedCall(70, () => core?.setFillStyle(0xff6b45, 0.9));
        }
      }
    }
  }

  private spawnTurretBullet(spawn: Vec2, angle: number, damage: number) {
    const weapon = WEAPONS.pistol;
    const body = this.add.container(spawn.x, spawn.y);
    const slug = this.add.rectangle(0, 0, 13, 5, 0xffd166, 0.96);
    slug.setRotation(angle);
    body.add(slug);
    this.fxLayer.add(body);
    this.bullets.push({
      pos: { ...spawn },
      vel: { x: Math.cos(angle) * 760, y: Math.sin(angle) * 760 },
      damage,
      radius: 6,
      life: 1.35,
      fire: 0,
      poison: 0,
      freeze: 0,
      pierce: 0,
      ricochet: 0,
      explosive: false,
      chain: false,
      knockback: 0.55,
      owner: 'secondary',
      body,
    });
    this.sfx.playWeaponShot(weapon.id, true);
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
        this.auraCooldown = Math.max(0.55, 1.4 - this.stats.lightningAura * 0.18) * (this.fxQuality < 0.5 ? 1.18 : 1);
        const targets = this.enemies
          .filter((enemy) => Phaser.Math.Distance.Between(enemy.pos.x, enemy.pos.y, this.playerPos.x, this.playerPos.y) < 260)
          .slice(0, Math.min(this.fxQuality < 0.5 ? 3 : 5, 2 + this.stats.lightningAura + this.stats.lightningChain));
        targets.forEach((enemy) => {
          enemy.hp -= 24 + this.stats.damage * 0.25;
          enemy.hitFlash = 0.1;
          if (this.transientFx.length > this.getTransientFxLimit() * 0.82) return;
          const line = this.add.line(0, 0, this.playerPos.x, this.playerPos.y, enemy.pos.x, enemy.pos.y, 0x96f7ff, 0.75).setLineWidth(4);
          this.fxLayer.add(line);
          this.trackTransientFx(line);
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
    if (enemy.type === 'exploder') this.enemyExplosion(enemy, false);
    if (this.specialWave === 'toxic' && !bossKilled && this.groundHazards.length < this.getHazardLimit('toxic')) this.createGroundHazard('toxic', enemy.pos, enemy.type === 'brute' ? 70 : 48, 8, 4.6);
    if (this.specialWave === 'burning' && !bossKilled) {
      if (this.groundHazards.length < this.getHazardLimit('fire')) this.createGroundHazard('fire', enemy.pos, enemy.type === 'brute' ? 64 : 44, 11, 3.1);
      if (this.fxQuality > 0.42 && (enemy.type === 'brute' || Math.random() < 0.18 * this.getEffectScale())) this.explosion(enemy.pos, 58, 9 + this.wave * 0.7);
    }
    this.bloodDeathBurst(enemy);
    this.deathFx(enemy);
    if (bossKilled) this.bossReward(enemy);
    else this.gainXp(enemy.type === 'brute' ? 12 : enemy.type === 'gunner' || enemy.type === 'spitter' || enemy.type === 'shielder' || enemy.type === 'screamer' ? 10 : enemy.type === 'exploder' ? 7 : enemy.type === 'runner' ? 5 : 3, enemy.pos);
  }

  private bossReward(enemy: Enemy) {
    this.explosion(enemy.pos, 190, 0);
    this.hp = this.maxHp;
    this.xp += this.xpNeed;
    this.tryUnlockTurretSystem();
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
    this.runCoinsEarned += bonusCoins;
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
        : enemy.type === 'spitter'
          ? Phaser.Math.Between(3, 5)
          : enemy.type === 'shielder' || enemy.type === 'screamer'
            ? Phaser.Math.Between(3, 6)
            : enemy.type === 'exploder'
              ? Phaser.Math.Between(2, 4)
          : enemy.type === 'runner'
            ? Phaser.Math.Between(1, 3)
            : Math.random() < 0.55
              ? 1
              : 0;
    const eventBonus = this.specialWave === 'elite'
      ? enemy.type === 'brute' || enemy.type === 'gunner' || enemy.type === 'spitter' ? Phaser.Math.Between(2, 5) : 0
      : this.specialWave === 'gunnerRaid' && (enemy.type === 'gunner' || enemy.type === 'spitter')
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
    const limit = this.getHazardLimit(type);
    const mergeRadius = type === 'toxic' ? 74 : 58;
    const nearby = this.groundHazards.find((hazard) => hazard.type === type && Phaser.Math.Distance.Between(hazard.pos.x, hazard.pos.y, source.x, source.y) < mergeRadius);
    if (nearby) {
      nearby.life = Math.min(Math.max(nearby.life, life * 0.75), life + 1.2);
      nearby.damage = Math.max(nearby.damage, damage);
      nearby.radius = Math.min(Math.max(nearby.radius, radius), radius + 22);
      nearby.body.setScale(Math.min(1.18, nearby.body.scaleX + 0.04), Math.min(1.08, nearby.body.scaleY + 0.03));
      return;
    }
    if (this.groundHazards.length >= limit) {
      const oldest = this.groundHazards.shift();
      oldest?.body.destroy();
    }
    if (this.specialWave !== 'none' && this.fxQuality < 0.45 && this.groundHazards.length >= Math.floor(limit * 0.82)) return;
    const pos = { x: source.x + Phaser.Math.Between(-18, 18), y: source.y + Phaser.Math.Between(-18, 18) };
    const color = type === 'toxic' ? 0x66d96d : 0xff7b32;
    const body = this.add.container(pos.x, pos.y);
    const quality = this.getEffectScale();
    const puddle = this.add.circle(0, 0, radius, color, type === 'toxic' ? 0.14 + quality * 0.04 : 0.16 + quality * 0.05).setScale(1, 0.56);
    puddle.setStrokeStyle(quality > 0.42 ? 3 : 1, type === 'toxic' ? 0x173f28 : 0x6e2024, quality > 0.42 ? 0.38 : 0.22);
    body.add(puddle);
    const flecks = quality > 0.55 ? 2 : quality > 0.28 ? 1 : 0;
    for (let i = 0; i < flecks; i += 1) {
      const fleck = this.add.rectangle(Phaser.Math.Between(-radius, radius), Phaser.Math.Between(-Math.floor(radius * 0.32), Math.floor(radius * 0.32)), Phaser.Math.Between(5, 12), Phaser.Math.Between(3, 8), color, 0.28);
      fleck.setRotation(Phaser.Math.FloatBetween(-0.8, 0.8));
      body.add(fleck);
    }
    this.fxLayer.add(body);
    this.groundHazards.push({ type, pos, radius, damage, life: life * (this.fxQuality < 0.5 ? 0.78 : 1), tick: 0, body });
  }

  private updateGroundHazards(dt: number) {
    for (let i = this.groundHazards.length - 1; i >= 0; i -= 1) {
      const hazard = this.groundHazards[i];
      hazard.life -= dt;
      hazard.tick -= dt;
      hazard.body.setAlpha(Phaser.Math.Clamp(hazard.life / 1.4, 0.18, 0.8));
      if (this.fxQuality > 0.42 && Math.random() < (hazard.type === 'toxic' ? 0.016 : 0.024) * this.getEffectScale()) this.pixelSpark(hazard.pos, hazard.type === 'toxic' ? 0x8aff6a : 0xff7b32);
      const dx = hazard.pos.x - this.playerPos.x;
      const dy = hazard.pos.y - this.playerPos.y;
      if (dx * dx + dy * dy < hazard.radius * hazard.radius && hazard.tick <= 0) {
        hazard.tick = 0.42;
        if (hazard.type === 'toxic') this.toxicSlowTimer = Math.max(this.toxicSlowTimer, 0.5);
        this.damagePlayer(hazard.damage);
      }
      if (hazard.life <= 0) {
        hazard.body.destroy();
        this.groundHazards.splice(i, 1);
      }
    }
  }

  private updateFog(dt: number) {
    const eventDensity = (this.specialWave === 'fog' || this.nextSpecialWave === 'fog' ? 1.22 : this.specialWave === 'night' ? 1.08 : 0.82) * Phaser.Math.Linear(0.55, 1, this.fxQuality);
    const maxPatches = this.fxQuality < 0.45 ? 10 : this.specialWave === 'fog' ? 15 : this.specialWave === 'night' ? 13 : 18;
    this.fogPatches.forEach((patch, index) => {
      if (index >= maxPatches) {
        patch.body.setVisible(false);
        return;
      }
      patch.body.setVisible(true);
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
      patch.body.setAlpha(Phaser.Math.Clamp((0.34 + patch.baseAlpha * 3.2 * patch.density) * eventDensity, 0.1, 0.68));
    });
  }

  private illuminateFog(pos: Vec2, color: number, radius: number, strength: number) {
    if (this.transientFx.length > this.getTransientFxLimit() * 0.72 || this.fxQuality < 0.38) return;
    const activeGlows = this.transientFx.filter((fx) => fx.active && fx.getData?.('fxKind') === 'glow').length;
    if (activeGlows >= this.getGlowLimit()) return;
    const glow = this.add.container(pos.x, pos.y);
    glow.setData('fxKind', 'glow');
    const halos = this.getEffectScale() > 0.55 ? 2 : 1;
    for (let i = 0; i < halos; i += 1) {
      const halo = this.add.circle(
        Phaser.Math.Between(-12, 12),
        Phaser.Math.Between(-8, 8),
        radius * Phaser.Math.FloatBetween(0.42, 0.95),
        color,
        strength * Phaser.Math.FloatBetween(0.018, 0.052) * this.fxQuality,
      );
      halo.setScale(Phaser.Math.FloatBetween(1.4, 2.4), Phaser.Math.FloatBetween(0.35, 0.72));
      halo.setBlendMode(Phaser.BlendModes.ADD);
      glow.add(halo);
    }
    this.fogLayer.add(glow);
    this.trackTransientFx(glow);
    this.tweens.add({
      targets: glow,
      alpha: 0,
      scaleX: 1.32,
      scaleY: 1.1,
      duration: 90 + radius * 0.38,
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
    if (this.invulnTimer > 0) {
      if (this.rollTimer > 0) this.popText(this.playerPos, 'EVADE', '#8ee8ff');
      return;
    }
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
    this.playerHpBarTimer = 1.45;
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

  private preloadUiAssets() {
    if (this.uiAssetsPreloaded) return;
    this.uiAssetsPreloaded = true;
    const urls = Array.from(new Set(Object.values(ICON_URLS).filter(Boolean)));
    urls.forEach((src) => {
      const img = new Image();
      img.decoding = 'async';
      img.loading = 'eager';
      img.src = src;
      void img.decode?.().catch(() => undefined);
    });
    void document.fonts?.ready.catch(() => undefined);
  }

  private nextFrame() {
    return new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
  }

  private updatePreloadScreen(progress: number, tip = 'Tip: Dodge roll through dangerous attacks.') {
    const pct = Phaser.Math.Clamp(progress, 0, 1);
    this.preloadOverlay.innerHTML = `
      <div class="preload-box">
        <span class="preload-pixels" aria-hidden="true"><i></i><i></i><i></i></span>
        <h1>Preparing run...</h1>
        <div class="preload-bar"><i style="width:${Math.round(pct * 100)}%"></i></div>
        <strong>${Math.round(pct * 100)}%</strong>
        <p>${tip}</p>
      </div>`;
  }

  private setPreloadVisible(visible: boolean) {
    this.preloadOverlay.classList.toggle('visible', visible);
    this.preloadOverlay.style.display = visible ? 'grid' : '';
    this.preloadOverlay.style.opacity = visible ? '1' : '';
    this.preloadOverlay.style.visibility = visible ? 'visible' : '';
    this.preloadOverlay.style.pointerEvents = visible ? 'auto' : '';
  }

  private async prepareRunAssets() {
    if (this.runPreloadReady) {
      this.updatePreloadScreen(1, 'Tip: Coins reset after each run.');
      await this.nextFrame();
      return;
    }
    const started = performance.now();
    const tips = [
      'Tip: Heavy weapons are best for bosses.',
      'Tip: Dodge roll through dangerous attacks.',
      'Tip: Coins reset after each run.',
    ];
    const iconUrls = Array.from(new Set(Object.values(ICON_URLS).filter(Boolean)));
    let loaded = 0;
    const totalSteps = iconUrls.length + 5;
    const setProgress = (tipIndex = 0) => {
      this.updatePreloadScreen(Math.min(0.98, loaded / totalSteps), tips[tipIndex % tips.length]);
    };

    this.sfx.warmup();
    setProgress(0);
    await this.nextFrame();

    await Promise.all(iconUrls.map(async (src, index) => {
      const img = new Image();
      img.decoding = 'async';
      img.loading = 'eager';
      img.src = src;
      try {
        await img.decode?.();
      } catch {
        await new Promise<void>((resolve) => {
          img.onload = () => resolve();
          img.onerror = () => resolve();
        });
      }
      loaded += 1;
      if (index % 8 === 0) {
        setProgress(index);
        await this.nextFrame();
      }
    }));

    setProgress(1);
    await document.fonts?.ready.catch(() => undefined);
    loaded += 1;
    await this.nextFrame();

    this.warmupUpgradeUiTemplates();
    loaded += 1;
    setProgress(2);
    await this.nextFrame();

    this.warmupShopUiTemplates();
    loaded += 1;
    setProgress(0);
    await this.nextFrame();

    this.warmupGameplayFxTemplates();
    loaded += 1;
    setProgress(1);
    await this.nextFrame();

    this.preloadUiAssets();
    loaded = totalSteps;
    this.updatePreloadScreen(1, 'Tip: Survive first, spend second.');
    await this.nextFrame();
    this.runPreloadReady = true;
    if (this.debugPerfVisible) console.debug(`[preload] run warmup: ${Math.round((performance.now() - started) * 10) / 10}ms, assets ${iconUrls.length}`);
  }

  private warmupUpgradeUiTemplates() {
    const holder = document.createElement('div');
    holder.className = 'ui-warmup-cache';
    const upgrades = UPGRADES.slice(0, 12);
    holder.innerHTML = `
      <div class="upgrade-grid">
        ${upgrades.map((upgrade, index) => this.renderUpgradeCard(upgrade, index % 3)).join('')}
      </div>`;
    document.body.appendChild(holder);
    void holder.offsetHeight;
    requestAnimationFrame(() => holder.remove());
  }

  private warmupShopUiTemplates() {
    const holder = document.createElement('div');
    holder.className = 'ui-warmup-cache';
    const weapons = SHOP_WEAPONS.slice(0, 9);
    holder.innerHTML = `
      <div class="camp-grid weapon-shop-grid">
        ${weapons.map((id) => this.renderWeaponShopCard(id)).join('')}
        ${this.equippedWeapons.map((slot) => this.renderOwnedWeaponCard(slot)).join('')}
        ${this.renderTurretShopCard()}
      </div>`;
    document.body.appendChild(holder);
    void holder.offsetHeight;
    requestAnimationFrame(() => holder.remove());
  }

  private warmupGameplayFxTemplates() {
    const original = this.transientFx.length;
    const sparkPos = { x: this.playerPos.x - 9000, y: this.playerPos.y - 9000 };
    for (let i = 0; i < 4; i += 1) this.pixelSparkDirected(sparkPos, i * 0.8, 12, i % 2 ? 0xff6b45 : 0x8ee8ff, 3);
    this.transientFx.slice(original).forEach((fx) => { if (fx.active) fx.destroy(); });
  }

  private requestRunStart(id: WeaponId) {
    if (this.runPreloadInProgress) return;
    this.runPreloadInProgress = true;
    const showStarted = performance.now();
    this.updatePreloadScreen(0, 'Tip: Heavy weapons are best for bosses.');
    this.lobbyOverlay.classList.add('preload-dimmed');
    this.setPreloadVisible(true);
    this.updateCursorMode();
    window.setTimeout(() => void this.prepareRunThenStart(id, showStarted), 90);
  }

  private async prepareRunThenStart(id: WeaponId, showStarted = performance.now()) {
    this.soundtrack.start(this.settings.masterVolume, this.settings.musicVolume);
    this.sfx.start(this.settings.masterVolume, this.settings.sfxVolume);
    try {
      await this.nextFrame();
      await this.prepareRunAssets();
      const remaining = Math.max(0, 1250 - (performance.now() - showStarted));
      await new Promise((resolve) => window.setTimeout(resolve, remaining));
      this.lobbyOverlay.classList.remove('preload-dimmed');
      this.setPreloadVisible(false);
      this.runPreloadInProgress = false;
      this.startRunWithWeapon(id);
    } catch (error) {
      console.warn('[preload] failed, starting run anyway', error);
      this.lobbyOverlay.classList.remove('preload-dimmed');
      this.setPreloadVisible(false);
      this.runPreloadInProgress = false;
      this.startRunWithWeapon(id);
    }
  }

  private markUiOpenStart(label: string) {
    return { label, start: performance.now(), nodes: document.querySelectorAll('.upgrade-card, .camp-card, .weapon-card').length };
  }

  private markUiOpenEnd(mark: { label: string; start: number; nodes: number }) {
    if (!this.debugPerfVisible) return;
    const nodes = document.querySelectorAll('.upgrade-card, .camp-card, .weapon-card').length;
    console.debug(`[ui-open] ${mark.label}: ${Math.round((performance.now() - mark.start) * 10) / 10}ms, cards ${mark.nodes}->${nodes}`);
  }

  private revealOverlayNextFrame(overlay: HTMLElement, mark: { label: string; start: number; nodes: number }) {
    overlay.classList.add('ui-preparing');
    requestAnimationFrame(() => {
      overlay.classList.remove('ui-preparing');
      overlay.classList.add('visible');
      this.updateCursorMode();
      this.markUiOpenEnd(mark);
    });
  }

  private showUpgradeChoices(title = 'LEVEL UP') {
    const mark = this.markUiOpenStart('upgrade');
    const choices = this.rollUpgradeChoices();
    this.preloadUiAssets();
    this.upgradeOverlay.classList.remove('visible');
    this.upgradeOverlay.innerHTML = `
      <div class="upgrade-box">
        <h1>${title}</h1>
        <p class="upgrade-subtitle">Choose how this run gets stronger.</p>
        <div class="upgrade-grid">
          ${choices.map((u, index) => this.renderUpgradeCard(u, index)).join('')}
        </div>
      </div>`;
    this.upgradeOverlay.onmouseover = (event) => {
      const button = (event.target as HTMLElement).closest<HTMLButtonElement>('button[data-rarity]');
      if (!button || button.dataset.hovered === '1') return;
      button.dataset.hovered = '1';
      this.sfx.playUpgradeHover(button.dataset.rarity as UpgradeRarity);
    };
    this.upgradeOverlay.onmouseout = (event) => {
      const button = (event.target as HTMLElement).closest<HTMLButtonElement>('button[data-rarity]');
      if (button) button.dataset.hovered = '0';
    };
    this.upgradeOverlay.onclick = (event) => {
      const button = (event.target as HTMLElement).closest<HTMLButtonElement>('button[data-id]');
      if (!button || button.disabled) return;
      button.disabled = true;
      const rarity = button.dataset.rarity as UpgradeRarity;
      this.sfx.playUpgradeSelect(rarity);
      this.applyUpgrade(button.dataset.id as UpgradeId);
    };
    this.playUpgradeRevealFx(choices);
    this.revealOverlayNextFrame(this.upgradeOverlay, mark);
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
  }

  private rollUpgradeChoices() {
    const pool = UPGRADES.filter((upgrade) => {
      if (!this.canOfferUpgrade(upgrade.id)) return false;
      if (upgrade.id.startsWith('unlock') || upgrade.id.startsWith('evolve')) return false;
      if (upgrade.id === 'turret') return false;
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
    const mark = this.markUiOpenStart('camp-shop');
    const wasVisible = this.campOverlay.classList.contains('visible');
    this.leveling = true;
    this.ensureShopOffers();
    this.preloadUiAssets();
    if (!wasVisible) this.campOverlay.classList.remove('visible');
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
        ${this.turretSystemUnlocked ? `
          <h2 class="camp-section-title">DEFENSE SYSTEMS</h2>
          <div class="camp-grid weapon-shop-grid">
            ${this.renderTurretShopCard()}
          </div>` : ''}
        <div class="pause-actions lobby-bottom-actions">
          <button data-camp-action="continue">Start Next Wave</button>
        </div>
      </div>`;
    this.campOverlay.onclick = (event) => {
      const button = (event.target as HTMLElement).closest<HTMLButtonElement>('button');
      if (!button || button.disabled) return;
      const action = button.dataset.campAction;
      if (button.dataset.buyWeapon) this.buyShopWeapon(button.dataset.buyWeapon as WeaponId);
      else if (button.dataset.upgradeWeapon) this.upgradeOwnedWeapon(button.dataset.upgradeWeapon as WeaponId);
      else if (button.dataset.buyTurret !== undefined) this.buyTurretSystem();
      else if (action === 'reroll') this.rerollWeaponShop();
      else if (action === 'continue') {
      this.campOverlay.classList.remove('visible');
      this.leveling = false;
      this.beginNextWaveCountdown();
      }
    };
    if (wasVisible) this.markUiOpenEnd(mark);
    else this.revealOverlayNextFrame(this.campOverlay, mark);
  }

  private ensureShopOffers(force = false) {
    if (!force && this.shopOffers.some((id) => !this.hasWeapon(id))) return;
    this.shopOffers = WEAPON_SLOTS.map((slot) => {
      const pool = SHOP_WEAPONS.filter((id) => {
        if (this.getWeaponSlot(id) !== slot || this.hasWeapon(id)) return false;
        if (WEAPONS[id].tier === 'Late' && this.wave < 5 && this.level < 5) return false;
        if (WEAPONS[id].tier === 'Mid' && this.wave < 2 && this.level < 2) return false;
        return true;
      });
      return pool.sort(() => Math.random() - 0.5)[0];
    }).filter(Boolean) as WeaponId[];
  }

  private renderWeaponShopCard(id: WeaponId) {
    const weapon = WEAPONS[id];
    const price = this.getWeaponPrice(id);
    const slot = this.getWeaponSlot(id);
    const equipped = this.getEquippedSlot(slot);
    const disabled = this.coins < price || equipped?.id === id;
    const iconKey = this.getUnlockIconKey(id);
    const replaceText = equipped && equipped.id !== id ? `REPLACES ${WEAPONS[equipped.id].title.toUpperCase()}` : `${WEAPON_SLOT_LABELS[slot].toUpperCase()} SLOT`;
    return `
      <button class="camp-card weapon-shop-card" data-buy-weapon="${id}" ${disabled ? 'disabled' : ''}>
        ${this.renderIcon(iconKey, weapon.title)}
        <em>${replaceText}</em>
        <h2>${weapon.title}</h2>
        <p>${weapon.tagline}. ${weapon.desc}</p>
        <strong>${equipped?.id === id ? 'EQUIPPED' : `${price} COINS`}</strong>
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
        <em>${WEAPON_SLOT_LABELS[slot.slot].toUpperCase()} - ${label}</em>
        <h2>${weapon.title}</h2>
        <p>${desc}</p>
        <strong>${maxed ? 'MAXED' : `${price} COINS`}</strong>
      </button>`;
  }

  private renderTurretShopCard() {
    const price = this.getTurretPrice();
    const maxed = this.turrets.length >= 3 || this.placingTurret;
    const level = Math.min(3, this.turrets.length + 1);
    return `
      <button class="camp-card weapon-shop-card" data-buy-turret ${maxed || this.coins < price ? 'disabled' : ''}>
        ${this.renderIcon('turret', 'Pocket Turret')}
        <em>LATE-GAME DEFENSE</em>
        <h2>Pocket Turret Mk.${level}</h2>
        <p>Buy, then place it on the arena. Tracks enemies and shoots from its deployed position.</p>
        <strong>${this.placingTurret ? 'PLACE CURRENT TURRET' : maxed ? 'MAX 3 ACTIVE' : `${price} COINS`}</strong>
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

  private getTurretPrice() {
    return 86 + this.turrets.length * 64 + Math.floor(this.wave * 4.5);
  }

  private buyTurretSystem() {
    if (!this.turretSystemUnlocked || this.turrets.length >= 3 || this.placingTurret) return;
    const price = this.getTurretPrice();
    if (this.coins < price) return;
    this.coins -= price;
    this.pendingTurretPrice = price;
    console.debug('[turret] purchased', { price, coins: this.coins, active: this.turrets.length });
    this.startTurretPlacement();
    this.updateHud();
  }

  private startTurretPlacement() {
    this.placingTurret = true;
    this.firing = false;
    this.leveling = false;
    this.campOverlay.classList.remove('visible');
    this.campOverlay.innerHTML = '';
    this.turretGhost?.destroy();
    this.turretGhost = this.createTurretBody(Math.min(3, this.turrets.length + 1), true);
    this.fxLayer.add(this.turretGhost);
    this.updateTurretPlacementPreview(this.aim.x, this.aim.y);
    this.popText(this.playerPos, 'PLACE TURRET - LMB CONFIRM / RMB OR ESC CANCEL', '#ffd166');
    console.debug('[turret] placement mode entered');
    this.updateCursorMode();
  }

  private updateTurretPlacementPreview(x: number, y: number) {
    if (!this.placingTurret || !this.turretGhost) return;
    const pos = {
      x: Phaser.Math.Clamp(x, -PLAYABLE_HALF_SIZE + 80, PLAYABLE_HALF_SIZE - 80),
      y: Phaser.Math.Clamp(y, -PLAYABLE_HALF_SIZE + 80, PLAYABLE_HALF_SIZE - 80),
    };
    this.turretPlacementPos = pos;
    const awayFromPlayer = Phaser.Math.Distance.Between(pos.x, pos.y, this.playerPos.x, this.playerPos.y) > 82;
    const awayFromTurrets = this.turrets.every((turret) => Phaser.Math.Distance.Between(pos.x, pos.y, turret.pos.x, turret.pos.y) > 92);
    this.turretPlacementValid = awayFromPlayer && awayFromTurrets;
    this.turretGhost.setPosition(pos.x, pos.y);
    this.turretGhost.setAlpha(this.turretPlacementValid ? 0.72 : 0.42);
    const color = this.turretPlacementValid ? 0x8ee8ff : 0xff4d45;
    (this.turretGhost.getData('ghostParts') as Phaser.GameObjects.Rectangle[] | undefined)?.forEach((part) => {
      part.setStrokeStyle(2, color, 0.74);
    });
  }

  private confirmTurretPlacement() {
    if (!this.placingTurret) return;
    if (!this.turretPlacementValid) {
      this.popText(this.turretPlacementPos, 'INVALID PLACEMENT', '#ff6b6b');
      console.debug('[turret] placement rejected', this.turretPlacementPos);
      return;
    }
    const level = Math.min(3, this.turrets.length + 1);
    const body = this.createTurretBody(level);
    const pos = { ...this.turretPlacementPos };
    body.setPosition(pos.x, pos.y);
    this.worldLayer.add(body);
    const turret: Turret = {
      id: ++this.turretId,
      pos,
      hp: 90 + level * 25,
      maxHp: 90 + level * 25,
      cooldown: 0.18,
      level,
      body,
    };
    this.turrets.push(turret);
    this.stats.turret = this.turrets.length;
    console.debug('[turret] spawned', { id: turret.id, pos, level, active: this.turrets.length });
    this.turretGhost?.destroy();
    this.turretGhost = null;
    this.placingTurret = false;
    this.pendingTurretPrice = 0;
    this.popText(pos, `TURRET MK.${level} DEPLOYED`, '#ffd166');
    this.updateHud();
    this.updateCursorMode();
    if (!this.gameOver && !this.inLobby && this.wavePhase !== 'active') this.showCampShop();
  }

  private cancelTurretPlacement(refund = true) {
    if (!this.placingTurret && !this.turretGhost) return;
    if (refund && this.pendingTurretPrice > 0) {
      this.coins += this.pendingTurretPrice;
      this.popText(this.playerPos, `+${this.pendingTurretPrice} COINS REFUNDED`, '#ffd166');
      console.debug('[turret] placement canceled, refunded', this.pendingTurretPrice);
    }
    this.turretGhost?.destroy();
    this.turretGhost = null;
    this.placingTurret = false;
    this.pendingTurretPrice = 0;
    this.updateHud();
    this.updateCursorMode();
    if (refund && !this.gameOver && !this.inLobby && this.wavePhase !== 'active') this.showCampShop();
  }

  private buyShopWeapon(id: WeaponId) {
    const price = this.getWeaponPrice(id);
    const slot = this.getWeaponSlot(id);
    const current = this.getEquippedSlot(slot);
    if (this.coins < price || current?.id === id) return;
    if (current && !window.confirm(`Replace ${WEAPONS[current.id].title} in ${WEAPON_SLOT_LABELS[slot]} slot with ${WEAPONS[id].title}?`)) return;
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
    const slot = this.getWeaponSlot(id);
    const existing = this.getEquippedSlot(slot);
    if (existing) {
      existing.id = id;
      existing.cooldown = 0;
      existing.evolved = false;
      existing.level = 1;
    } else {
      this.equippedWeapons.push({ id, slot, cooldown: 0, evolved: false, level: 1 });
    }
    this.activeWeaponSlot = slot;
    this.popText(this.playerPos, `${WEAPONS[id].title} EQUIPPED`, '#78f7ff');
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
    this.cleanupAllEnemies('new-run');
    this.resetRunState();
    this.soundtrack.start(this.settings.masterVolume, this.settings.musicVolume);
    this.sfx.start(this.settings.masterVolume, this.settings.sfxVolume);
    const sidearm = this.getWeaponSlot(id) === 'sidearm' ? id : 'pistol';
    this.selectedWeapon = sidearm;
    this.activeWeaponSlot = 'sidearm';
    const weapon = WEAPONS[sidearm];
    this.equippedWeapons = [{ id: sidearm, slot: 'sidearm', cooldown: 0, evolved: false, level: 1 }];
    this.stats.damage = weapon.damage;
    this.stats.fireRate = weapon.fireRate;
    this.stats.bulletSpeed = weapon.bulletSpeed;
    this.stats.projectileSize = weapon.projectileSize;
    this.stats.knockback = 0;
    if (STARTING_WEAPONS.includes(sidearm)) this.stats.critChance = sidearm === 'rapidPistol' ? 0.03 : 0.06;
    if (sidearm === 'shotgun') this.stats.pierce = 0;
    if (sidearm === 'smg') this.stats.poison = 1;
    this.inLobby = false;
    this.selectingWeapon = false;
    this.updateCursorMode();
    this.lobbyOverlay.classList.remove('visible');
    this.lobbyOverlay.innerHTML = '';
    this.weaponOverlay.classList.remove('visible');
    this.weaponOverlay.innerHTML = '';
    this.popText(this.playerPos, `${weapon.title} READY`, '#ffd166');
    this.updateHud();
  }

  private getAccountLevel() {
    return this.saveManager.save.accountLevel;
  }

  private getAccountXpNext(level: number) {
    return Math.floor(1000 + (level - 1) * 220 + Math.pow(level - 1, 1.32) * 65);
  }

  private getAccountXpReward(wave: number, kills: number, seconds: number) {
    const waveXp = Math.max(0, wave) * 45;
    const killXp = Math.max(0, kills) * 4;
    const survivalXp = Math.floor(Math.max(0, seconds) / 10) * 10;
    const milestoneXp = Math.floor(Math.max(0, wave) / 5) * 150;
    return Math.max(40, waveXp + killXp + survivalXp + milestoneXp);
  }

  private grantAccountXp(amount: number) {
    let accountLevel = this.saveManager.save.accountLevel;
    let accountXp = this.saveManager.save.accountXp + amount;
    let accountXpNext = this.saveManager.save.accountXpNext || this.getAccountXpNext(accountLevel);
    let levelsGained = 0;

    while (accountXp >= accountXpNext) {
      accountXp -= accountXpNext;
      accountLevel += 1;
      levelsGained += 1;
      accountXpNext = this.getAccountXpNext(accountLevel);
    }

    this.saveManager.saveGame({ accountLevel, accountXp, accountXpNext });
    return { levelsGained, accountLevel, accountXp, accountXpNext };
  }

  private renderAccountProfile() {
    const save = this.saveManager.save;
    const xpPct = Phaser.Math.Clamp(save.accountXp / Math.max(1, save.accountXpNext), 0, 1) * 100;
    return `
      <aside class="account-profile" aria-label="Survivor profile">
        <div class="account-avatar">NR</div>
        <div class="account-meta">
          <strong>${this.escapeHtml(save.nickname)}</strong>
          <span>Level ${save.accountLevel} Survivor</span>
          <div class="account-xp-bar" aria-hidden="true"><i style="width:${xpPct}%"></i></div>
          <small>XP: ${save.accountXp} / ${save.accountXpNext}</small>
        </div>
      </aside>`;
  }

  private escapeHtml(value: string) {
    return value.replace(/[&<>"']/g, (char) => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;',
    })[char] ?? char);
  }

  private showAccountLevelToast(levelsGained: number, accountLevel: number, xpGained: number) {
    const toast = document.createElement('div');
    toast.className = 'account-level-toast';
    toast.innerHTML = `
      <strong>${levelsGained > 0 ? `Account Level ${accountLevel}` : `+${xpGained} Account XP`}</strong>
      <span>${levelsGained > 0 ? `+${levelsGained} survivor level${levelsGained > 1 ? 's' : ''}` : 'Profile progress saved'}</span>`;
    document.body.appendChild(toast);
    window.setTimeout(() => toast.remove(), 2600);
  }

  private getUnlockedWeaponIds() {
    const unlocked = this.saveManager.save.unlockedWeapons.filter((id) => WEAPONS[id]);
    return unlocked.length > 0 ? unlocked : [...STARTING_WEAPONS];
  }

  private showLobbyMenu() {
    this.loadPersistentProgress();
    this.inLobby = true;
    this.selectingWeapon = true;
    this.firing = false;
    const accountLevel = this.getAccountLevel();
    this.lobbyOverlay.classList.add('visible');
    this.updateCursorMode();
    this.lobbyOverlay.innerHTML = `
      ${this.renderAccountProfile()}
      <div class="lobby-static-bg" aria-hidden="true"></div>
      <div class="lobby-shell">
        <section class="lobby-panel">
          <p class="lobby-kicker">SAFE CAMP / NIGHT SHIFT</p>
          <h1>ZOMBIE RUN</h1>
          <p class="pause-copy">Tune your kit, watch the treeline, then step back into the dead zone.</p>
          <div class="selected-loadout">
            <span>STARTING WEAPON</span>
            <strong id="lobbyWeapon">${WEAPONS[this.selectedWeapon].title}</strong>
          </div>
          <div class="profile-strip">
            <div><span>ACCOUNT LVL</span><strong>${accountLevel}</strong></div>
            <div><span>BEST WAVE</span><strong>${this.runStats.bestWave}</strong></div>
            <div><span>BEST TIME</span><strong>${this.formatTime(this.runStats.bestTime)}</strong></div>
          </div>
          <div class="pause-actions lobby-actions">
            <button data-lobby-action="start">Start Run</button>
            <button data-lobby-action="weapons">Weapon Select</button>
            <button data-lobby-action="settings">Settings</button>
            <button data-lobby-action="quit">Quit</button>
          </div>
        </section>
        <section class="lobby-character-card" aria-label="Survivor camp">
          <div class="camp-backdrop">
            <span class="bench-shadow"></span>
            <span class="hanging-lamp"></span>
          </div>
          <div class="lobby-character-glow"></div>
          <div class="lobby-character"></div>
          <div class="showcase-label">
            <strong>${WEAPONS[this.selectedWeapon].title}</strong>
          </div>
          <div class="lobby-character-ground"></div>
        </section>
        <aside class="lobby-stats">
          <h2>SURVIVOR FILE</h2>
          <dl>
            <div><dt>Account Level</dt><dd>${accountLevel}</dd></div>
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
    const unlockedWeapons = this.getUnlockedWeaponIds();
    this.lobbyOverlay.classList.add('visible');
    this.updateCursorMode();
    this.lobbyOverlay.innerHTML = `
      <div class="lobby-static-bg" aria-hidden="true"></div>
      <div class="weapon-box lobby-weapon-box">
        <h1>CHOOSE STARTING PISTOL</h1>
        <div class="weapon-grid">
          ${unlockedWeapons.map((id) => WEAPONS[id])
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
      <div class="lobby-static-bg" aria-hidden="true"></div>
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
        if (action === 'start') this.requestRunStart(this.selectedWeapon);
        if (action === 'weapons') this.showLobbyWeaponSelect();
        if (action === 'loadout') this.showLobbyWeaponSelect();
        if (action === 'settings') this.showLobbySettings();
        if (action === 'back') this.showLobbyMenu();
        if (action === 'quit') this.showQuitMessage();
        if (action === 'reset-progress') this.confirmResetProgress();
      });
    });
  }

  private confirmResetProgress() {
    const confirmed = window.confirm('Reset all saved progress on this browser? Records, unlocks, achievements, and settings will return to defaults.');
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
    const sparks = Math.max(3, Math.floor(14 * this.getEffectScale()));
    for (let i = 0; i < sparks; i += 1) {
      this.pixelSpark(pos, i % 2 ? 0xff4d3d : 0xffd166);
    }
    if (this.shouldSpawnFx(1.35)) this.illuminateFog(pos, damage > 0 ? 0xff8a45 : 0xff5c3d, radius * (damage > 0 ? 1.05 : 0.58), damage > 0 ? 0.42 : 0.14);
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
    const boss = enemy.type === 'bossTitan' || enemy.type === 'bossGunner';
    const heavy = enemy.type === 'brute' || boss;
    const pool = this.add.rectangle(enemy.pos.x, enemy.pos.y + (boss ? 48 : heavy ? 36 : 25), boss ? 90 : heavy ? 48 : 28, boss ? 30 : heavy ? 19 : 11, 0x4d1018, boss ? 0.72 : 0.58);
    pool.setRotation(Phaser.Math.FloatBetween(-0.18, 0.18));
    this.worldLayer.add(pool);
    this.trackTransientFx(pool, this.worldDecals, boss ? 90 : 65);
    this.tweens.add({ targets: pool, alpha: boss ? 0.32 : 0.22, duration: boss ? 7800 : 5200, delay: boss ? 1600 : 900, onComplete: () => pool.destroy() });

    enemy.body.setDepth(2);
    enemy.body.setData('enemyCorpse', true);
    enemy.body.setData('enemyVisual', true);
    this.trackTransientFx(enemy.body, this.transientFx, this.getTransientFxLimit());
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
    this.hitStop = Math.max(this.hitStop, boss ? 0.16 : heavy ? 0.08 : 0.04);
    this.shake(boss ? 420 : heavy ? 150 : 75, boss ? 0.014 : heavy ? 0.008 : 0.004);
  }

  private chainLightning(source: Enemy) {
    const maxTargets = Math.min(this.stats.chain, this.getEffectScale() < 0.5 ? 2 : this.stats.chain);
    const targets = this.enemies.filter((e) => e !== source && Phaser.Math.Distance.Between(e.pos.x, e.pos.y, source.pos.x, source.pos.y) < 170).slice(0, maxTargets);
    targets.forEach((enemy) => {
      enemy.hp -= this.stats.damage * 0.45;
      enemy.hitFlash = 0.08;
      const line = this.add.line(0, 0, source.pos.x, source.pos.y, enemy.pos.x, enemy.pos.y, 0x96f7ff, 0.85).setLineWidth(4);
      this.fxLayer.add(line);
      this.trackTransientFx(line);
      this.tweens.add({ targets: line, alpha: 0, duration: 110, onComplete: () => line.destroy() });
    });
  }

  private muzzleFx(angle: number) {
    const fxScale = this.getEffectScale();
    const pos = { x: this.playerPos.x + Math.cos(angle) * 34, y: this.playerPos.y + Math.sin(angle) * 34 };
    const flash = this.add.star(pos.x, pos.y, 6, 4, 22, 0xfff06a, 0.9);
    flash.setRotation(angle);
    this.fxLayer.add(flash);
    this.trackTransientFx(flash);
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
    this.trackTransientFx(cone);
    this.tweens.add({ targets: flash, alpha: 0, scale: 1.42, duration: 62, onComplete: () => flash.destroy() });
    this.tweens.add({ targets: cone, alpha: 0, scaleX: 0.75, duration: 54, onComplete: () => cone.destroy() });
    if (fxScale > 0.5) this.illuminateFog(pos, 0xffc45c, 38, 0.08);
    const sparks = fxScale > 0.75 ? 2 : fxScale > 0.45 ? 1 : 0;
    for (let i = 0; i < sparks; i += 1) this.pixelSparkDirected(pos, angle + Phaser.Math.FloatBetween(-0.26, 0.26), Phaser.Math.Between(42, 72), 0xd9a85c, 3);
  }

  private tracerFx(pos: Vec2, angle: number) {
    if (!this.shouldSpawnFx(1.45)) return;
    const tracer = this.add.rectangle(pos.x + Math.cos(angle) * 35, pos.y + Math.sin(angle) * 35, 58, 3, 0xffd68a, 0.32);
    tracer.setRotation(angle);
    this.fxLayer.add(tracer);
    this.trackTransientFx(tracer);
    this.tweens.add({ targets: tracer, alpha: 0, scaleX: 0.35, duration: 70, onComplete: () => tracer.destroy() });
  }

  private shellFx(angle: number) {
    if (!this.shouldSpawnFx(1.8)) return;
    const side = angle - Math.PI / 2;
    const pos = { x: this.playerPos.x + Math.cos(angle) * 10, y: this.playerPos.y + Math.sin(angle) * 10 };
    const shell = this.add.rectangle(pos.x, pos.y, 7, 4, 0xffc45c, 0.95);
    shell.setRotation(side);
    this.fxLayer.add(shell);
    this.trackTransientFx(shell);
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
    this.trackTransientFx(slash);
    this.tweens.add({ targets: slash, alpha: 0, scaleX: 1.7, duration: 85, onComplete: () => slash.destroy() });
    const sparks = this.getEffectScale() > 0.6 ? 2 : 1;
    for (let i = 0; i < sparks; i += 1) {
      this.pixelSparkDirected(pos, angle + Math.PI + Phaser.Math.FloatBetween(-0.55, 0.55), Phaser.Math.Between(24, 58), 0xcaa062, 2);
    }
  }

  private pixelSpark(pos: Vec2, color: number) {
    if (!this.shouldSpawnFx(1.15)) return;
    const p = this.add.rectangle(pos.x, pos.y, Phaser.Math.Between(3, 7), Phaser.Math.Between(3, 7), color, 0.68);
    this.fxLayer.add(p);
    this.trackTransientFx(p);
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
    if (!this.shouldSpawnFx(1.1)) return;
    const p = this.add.rectangle(pos.x, pos.y, Phaser.Math.Between(Math.max(2, size - 2), size + 2), Phaser.Math.Between(2, size + 3), color, 0.72);
    p.setRotation(angle);
    this.fxLayer.add(p);
    this.trackTransientFx(p);
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

  private bloodHitFx(pos: Vec2, angle: number, count: number) {
    if (!this.shouldSpawnFx(1.15)) return;
    const palette = [0x4d1018, 0x6f1721, 0x8f1d2a, 0xb6333e];
    const scaledCount = Math.max(1, Math.floor(count * this.getEffectScale()));
    for (let i = 0; i < scaledCount; i += 1) {
      this.spawnBloodParticle(pos, angle + Math.PI + Phaser.Math.FloatBetween(-0.58, 0.58), Phaser.Math.Between(100, 230), Phaser.Utils.Array.GetRandom(palette), Phaser.Math.Between(3, 7), Phaser.Math.Between(190, 360));
    }
    if (this.worldDecals.length < this.getDecalLimit() && Math.random() < 0.16 * this.getEffectScale()) this.spawnBloodDecal(pos, Phaser.Math.Between(8, 15), 0.22);
  }

  private bloodDeathBurst(enemy: Enemy) {
    const boss = enemy.type === 'bossTitan' || enemy.type === 'bossGunner';
    const heavy = enemy.type === 'brute' || boss;
    const count = Math.max(boss ? 18 : heavy ? 8 : 5, Math.floor((boss ? 72 : heavy ? 32 : enemy.type === 'runner' ? 18 : 22) * this.getEffectScale()));
    const palette = boss ? [0x3b0c12, 0x5d1019, 0x8f1d2a, 0xc13a42] : [0x4d1018, 0x6f1721, 0x8f1d2a, 0xa72a34];
    for (let i = 0; i < count; i += 1) {
      const angle = (i / count) * Math.PI * 2 + Phaser.Math.FloatBetween(-0.36, 0.36);
      const speed = Phaser.Math.Between(heavy ? 120 : 75, boss ? 470 : heavy ? 330 : 220);
      this.spawnBloodParticle(enemy.pos, angle, speed, Phaser.Utils.Array.GetRandom(palette), Phaser.Math.Between(heavy ? 5 : 3, boss ? 12 : heavy ? 9 : 7), Phaser.Math.Between(420, boss ? 980 : 760), heavy ? 0.34 : 0.22);
    }
    const decalCount = Math.max(0, Math.floor((boss ? 6 : heavy ? 3 : 1) * this.getEffectScale()));
    for (let i = 0; i < decalCount; i += 1) {
      this.spawnBloodDecal({ x: enemy.pos.x + Phaser.Math.Between(-enemy.radius, enemy.radius), y: enemy.pos.y + Phaser.Math.Between(-enemy.radius * 0.4, enemy.radius * 0.7) }, Phaser.Math.Between(boss ? 22 : 12, boss ? 46 : heavy ? 28 : 20), boss ? 0.5 : 0.38);
    }
  }

  private spawnBloodParticle(pos: Vec2, angle: number, speed: number, color: number, size: number, duration: number, gravity = 0.18) {
    const particle = this.add.rectangle(pos.x, pos.y, Phaser.Math.Between(Math.max(2, size - 2), size + 2), Phaser.Math.Between(2, size + 4), color, 0.88);
    particle.setRotation(angle + Phaser.Math.FloatBetween(-0.7, 0.7));
    this.fxLayer.add(particle);
    this.trackTransientFx(particle);
    const travel = speed * 0.58;
    this.tweens.add({
      targets: particle,
      x: pos.x + Math.cos(angle) * travel + Phaser.Math.Between(-18, 18),
      y: pos.y + Math.sin(angle) * travel + Phaser.Math.Between(8, 34) * gravity,
      angle: particle.angle + Phaser.Math.Between(-220, 260),
      alpha: 0,
      scaleX: Phaser.Math.FloatBetween(0.35, 0.75),
      scaleY: Phaser.Math.FloatBetween(0.35, 0.75),
      duration: Math.floor(duration * (0.72 + this.getEffectScale() * 0.22)),
      ease: 'Quad.easeOut',
      onComplete: () => particle.destroy(),
    });
  }

  private spawnBloodDecal(pos: Vec2, size: number, alpha: number) {
    if (this.worldDecals.length >= this.getDecalLimit()) return;
    const decal = this.add.rectangle(pos.x, pos.y, size, Math.max(4, Math.floor(size * Phaser.Math.FloatBetween(0.28, 0.52))), Phaser.Utils.Array.GetRandom([0x3d0b12, 0x4d1018, 0x61151f]), alpha);
    decal.setRotation(Phaser.Math.FloatBetween(-0.45, 0.45));
    this.worldLayer.add(decal);
    this.trackTransientFx(decal, this.worldDecals, this.getDecalLimit());
    this.tweens.add({ targets: decal, alpha: alpha * 0.28, duration: Math.floor(2200 + 1100 * this.fxQuality), delay: 650, onComplete: () => decal.destroy() });
  }

  private damageNumber(pos: Vec2, amount: number) {
    this.popText({ x: pos.x, y: pos.y - 20 }, String(amount), '#fff4a3');
  }

  private popText(pos: Vec2, text: string, color: string) {
    if (!this.debugPerfVisible && this.transientFx.length > this.getTransientFxLimit() * 0.85 && !text.includes('WAVE') && !text.includes('BOSS') && !text.includes('LVL')) return;
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
    this.trackTransientFx(label);
    this.tweens.add({ targets: label, y: label.y - 30, alpha: 0, duration: 460, onComplete: () => label.destroy() });
  }

  private createHud() {
    this.hud = document.createElement('div');
    this.hud.className = 'hud';
    this.hud.innerHTML = `
      <div class="hud-stack">
        <div class="vital-panel">
          <span class="hp-icon" aria-hidden="true"></span>
          <div class="bar hp">
            <div id="hpDamageFill" class="hp-damage-fill"></div>
            <div id="hpFill"></div>
            <i class="hp-segments" aria-hidden="true"></i>
            <span id="hpText">100 / 100</span>
          </div>
        </div>
        <div class="dodge-panel ready" id="dodgePanel">
          <span class="dodge-icon" aria-hidden="true"></span>
          <div class="dodge-meter">
            <div id="dodgeFill"></div>
            <span id="dodgeText">ROLL READY</span>
          </div>
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
    wavePanel.className = 'wave-center-hud';
    wavePanel.innerHTML = `
      <strong id="waveLabel">WAVE 1</strong>
      <span id="waveState">INCOMING</span>
      <small id="remainingLabel">0 LEFT</small>`;
    this.hud.appendChild(wavePanel);
    const bossHud = document.createElement('div');
    bossHud.className = 'boss-hud';
    bossHud.innerHTML = `
      <div class="boss-hud-title">
        <span id="bossSubtitle">WAVE BOSS</span>
        <strong id="bossName">BRUTE TITAN</strong>
        <em id="bossPhase">PHASE 1</em>
      </div>
      <div class="boss-hp-frame">
        <div id="bossDamageFill" class="boss-damage-fill"></div>
        <div id="bossHpFill" class="boss-hp-fill"></div>
        <i class="boss-hp-segments" aria-hidden="true"></i>
        <span id="bossHpText">0 / 0</span>
      </div>`;
    this.hud.appendChild(bossHud);
    const weaponPanel = document.createElement('div');
    weaponPanel.className = 'weapon-hud';
    weaponPanel.innerHTML = this.renderWeaponLoadoutHud();
    this.hud.appendChild(weaponPanel);
    const economyPanel = document.createElement('div');
    economyPanel.className = 'economy-hud';
    economyPanel.innerHTML = '<span class="pixel-coin" aria-hidden="true"></span><span id="coinCount">0</span>';
    this.hud.appendChild(economyPanel);
    const waveBanner = document.createElement('div');
    waveBanner.className = 'wave-banner';
    waveBanner.id = 'waveBannerText';
    waveBanner.textContent = 'Wave starts in 3';
    this.hud.appendChild(waveBanner);
    const debugSkip = document.createElement('button');
    debugSkip.className = 'debug-skip-wave';
    debugSkip.type = 'button';
    debugSkip.textContent = 'SKIP WAVE';
    debugSkip.addEventListener('click', () => this.debugSkipWave());
    this.hud.appendChild(debugSkip);
    this.debugPerfPanel = document.createElement('div');
    this.debugPerfPanel.className = 'debug-perf-panel';
    this.debugPerfPanel.textContent = 'F3 PERF';
    this.hud.appendChild(this.debugPerfPanel);
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
    this.preloadOverlay = document.createElement('div');
    this.preloadOverlay.className = 'preload-screen';
    document.body.appendChild(this.preloadOverlay);
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

  private toggleDebugPerf() {
    this.debugPerfVisible = !this.debugPerfVisible;
    this.debugPerfPanel?.classList.toggle('visible', this.debugPerfVisible);
    this.updateDebugPerf(0);
  }

  private updateDebugPerf(dt: number) {
    if (dt > 0) this.fpsSmoothed = this.fpsSmoothed * 0.92 + Math.min(120, 1 / Math.max(0.001, dt)) * 0.08;
    if (!this.debugPerfVisible || !this.debugPerfPanel || this.perfTick < 0.25) return;
    this.perfTick = 0;
    this.debugPerfPanel.innerHTML = `
      FPS ${Math.round(this.fpsSmoothed)}<br>
      EN ${this.enemies.length} / BUL ${this.bullets.length}<br>
      FX ${this.transientFx.length} / DEC ${this.worldDecals.length}<br>
      HAZ ${this.groundHazards.length} / COIN ${this.coinDrops.length}<br>
      Q ${Math.round(this.fxQuality * 100)}% / ${this.specialWave.toUpperCase()}`;
  }

  private updateHud() {
    this.setText('level', String(this.level));
    const hpPct = Phaser.Math.Clamp(this.hp / this.maxHp, 0, 1);
    const hpPanel = document.querySelector('.vital-panel');
    const damageFill = document.getElementById('hpDamageFill') as HTMLElement | null;
    const tookDamage = hpPct < this.lastHpPct - 0.002;
    const healed = hpPct > this.lastHpPct + 0.002;
    if (hpPanel) {
      hpPanel.classList.toggle('low-hp', hpPct <= 0.3);
      if (tookDamage || healed) {
        hpPanel.classList.remove('hp-damaged', 'hp-healed');
        void (hpPanel as HTMLElement).offsetWidth;
        hpPanel.classList.add(tookDamage ? 'hp-damaged' : 'hp-healed');
      }
    }
    if (damageFill && tookDamage) {
      damageFill.style.width = `${this.lastHpPct * 100}%`;
      if (this.hpDamageTimeout) window.clearTimeout(this.hpDamageTimeout);
      this.hpDamageTimeout = window.setTimeout(() => {
        damageFill.style.width = `${hpPct * 100}%`;
      }, 180);
    } else if (damageFill && healed) {
      damageFill.style.width = `${hpPct * 100}%`;
    }
    this.lastHpPct = hpPct;
    this.setText('hpText', `${Math.ceil(Math.max(0, this.hp))} / ${this.maxHp}`);
    this.setText('xpText', String(Math.floor(this.xp)));
    this.setText('xpNeed', String(this.xpNeed));
    this.setText('timer', `${Math.floor(this.elapsed / 60).toString().padStart(2, '0')}:${Math.floor(this.elapsed % 60).toString().padStart(2, '0')}`);
    this.setText('score', String(this.score));
    this.setText('waveLabel', `WAVE ${Math.max(1, this.wave || 1)}`);
    this.setText('remainingLabel', `${this.getRemainingEnemies()} LEFT`);
    this.setText('waveState', this.getWaveStateLabel());
    const weaponPanel = document.querySelector('.weapon-hud') as HTMLElement | null;
    const weaponSignature = this.getWeaponHudSignature();
    if (weaponPanel && weaponSignature !== this.lastWeaponHudSignature) {
      this.lastWeaponHudSignature = weaponSignature;
      weaponPanel.innerHTML = this.renderWeaponLoadoutHud();
      weaponPanel.classList.remove('weapon-hud-pulse');
      void (weaponPanel as HTMLElement).offsetWidth;
      weaponPanel.classList.add('weapon-hud-pulse');
    }
    this.setText('coinCount', String(this.coins));
    const rollPct = 1 - Phaser.Math.Clamp(this.rollCooldown / this.rollCooldownMax, 0, 1);
    const dodgePanel = document.getElementById('dodgePanel');
    dodgePanel?.classList.toggle('ready', this.rollCooldown <= 0);
    dodgePanel?.classList.toggle('rolling', this.rollTimer > 0);
    this.setFill('dodgeFill', rollPct);
    this.setText('dodgeText', this.rollTimer > 0 ? 'ROLLING' : this.rollCooldown > 0 ? `${this.rollCooldown.toFixed(1)}s` : 'SPACE ROLL');
    this.setText('waveBannerText', this.getWaveCenterText());
    document.querySelector('.wave-banner')?.classList.toggle('visible', this.wavePhase === 'countdown' || this.wavePhase === 'bossWarning');
    document.body.classList.toggle('boss-warning-active', this.wavePhase === 'bossWarning');
    this.applySpecialWaveAtmosphere();
    this.setFill('hpFill', hpPct);
    this.setFill('xpFill', this.xp / this.xpNeed);
    this.updateBossHud();
    this.updateCursorMode();
  }

  private updateBossHud() {
    const boss = this.enemies.find((enemy) => enemy.type === 'bossTitan' || enemy.type === 'bossGunner');
    const hud = document.querySelector('.boss-hud') as HTMLElement | null;
    if (!hud) return;
    if (!boss) {
      hud.classList.remove('visible', 'enraged', 'low-hp', 'boss-hit', 'intro');
      this.bossHudEnemyId = null;
      this.bossHudLastPct = 0;
      return;
    }

    const pct = Phaser.Math.Clamp(boss.hp / boss.maxHp, 0, 1);
    const newBoss = this.bossHudEnemyId !== boss.id;
    const damageFill = document.getElementById('bossDamageFill') as HTMLElement | null;
    const bossName = boss.type === 'bossTitan' ? 'BRUTE TITAN' : 'INFECTED GUNNER';
    const tierLabel = boss.bossTier > 1 ? `TIER ${boss.bossTier}` : `WAVE ${this.wave} BOSS`;
    const phase = boss.rage ? 'ENRAGED' : pct <= 0.32 ? 'CRITICAL' : 'PHASE 1';

    if (newBoss) {
      this.bossHudEnemyId = boss.id;
      this.bossHudLastPct = pct;
      hud.classList.remove('intro');
      void hud.offsetWidth;
      hud.classList.add('intro');
      if (damageFill) damageFill.style.width = `${pct * 100}%`;
    } else if (pct < this.bossHudLastPct - 0.001) {
      if (damageFill) {
        damageFill.style.width = `${this.bossHudLastPct * 100}%`;
        if (this.bossHudDamageTimeout) window.clearTimeout(this.bossHudDamageTimeout);
        this.bossHudDamageTimeout = window.setTimeout(() => {
          damageFill.style.width = `${pct * 100}%`;
        }, 160);
      }
      hud.classList.remove('boss-hit');
      void hud.offsetWidth;
      hud.classList.add('boss-hit');
      this.bossHudLastPct = pct;
    } else {
      this.bossHudLastPct = pct;
    }

    hud.classList.add('visible');
    hud.classList.toggle('enraged', boss.rage);
    hud.classList.toggle('low-hp', pct <= 0.24);
    this.setText('bossSubtitle', tierLabel);
    this.setText('bossName', bossName);
    this.setText('bossPhase', phase);
    this.setText('bossHpText', `${Math.ceil(Math.max(0, boss.hp))} / ${Math.ceil(boss.maxHp)}`);
    this.setFill('bossHpFill', pct);
  }

  private isMenuCursorActive() {
    return this.inLobby || this.selectingWeapon || this.leveling || this.paused || this.gameOver || this.runPreloadInProgress;
  }

  private debugSkipWave() {
    if (this.gameOver || this.inLobby || this.selectingWeapon) return;
    this.cleanupAllEnemies('debug-skip');
    this.bullets.forEach((bullet) => bullet.body.destroy());
    this.enemyProjectiles.forEach((shot) => shot.body.destroy());
    this.groundHazards.forEach((hazard) => hazard.body.destroy());
    this.gems.forEach((gem) => gem.body.destroy());
    this.coinDrops.forEach((coin) => coin.body.destroy());
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

  private getWaveCenterText() {
    const seconds = Math.max(1, Math.ceil(this.waveTimer));
    if (this.wavePhase === 'bossWarning') return `Boss arrives in ${seconds}`;
    if (this.nextSpecialWave !== 'none') return `${SPECIAL_WAVE_META[this.nextSpecialWave].title} starts in ${seconds}`;
    return `Wave starts in ${seconds}`;
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

  private getWeaponHudSignature() {
    return WEAPON_SLOTS.map((slot) => {
      const weapon = this.getEquippedSlot(slot);
      return weapon ? `${slot}:${weapon.id}:${weapon.level}:${weapon.evolved}` : `${slot}:empty`;
    }).join('|') + `|active:${this.activeWeaponSlot}`;
  }

  private renderWeaponLoadoutHud() {
    return WEAPON_SLOTS.map((slot, index) => {
      const equipped = this.getEquippedSlot(slot);
      const active = slot === this.activeWeaponSlot && Boolean(equipped);
      if (!equipped) {
        return `
          <div class="weapon-slot-card empty" data-slot="${slot}">
            <span class="weapon-slot-number">${index + 1}</span>
            <span class="weapon-slot-icon">--</span>
            <span class="weapon-slot-copy">
              <strong>Empty</strong>
              <small>${WEAPON_SLOT_LABELS[slot]}</small>
            </span>
          </div>`;
      }
      const weapon = WEAPONS[equipped.id];
      return `
        <div class="weapon-slot-card ${active ? 'active' : ''} ${equipped.evolved ? 'evolved' : ''}" data-slot="${slot}">
          <span class="weapon-slot-number">${index + 1}</span>
          <span class="weapon-slot-icon">${weapon.icon}</span>
          <span class="weapon-slot-copy">
            <strong>${weapon.title}</strong>
            <small>${WEAPON_SLOT_LABELS[slot]} - ${equipped.evolved ? 'Evolved' : `Tier ${equipped.level}`}</small>
          </span>
        </div>`;
    }).join('');
  }

  private getWeaponHudTitle() {
    const names = WEAPON_SLOTS.map((slot) => this.getEquippedSlot(slot))
      .filter((slot): slot is EquippedWeapon => Boolean(slot))
      .map((slot) => `${WEAPONS[slot.id].title} T${slot.level}${slot.evolved ? '+' : ''}`);
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
      totalKills: this.saveManager.save.totalKills,
    };
  }

  private persistProgress() {
    this.saveManager.saveGame({
      bestWave: this.runStats.bestWave,
      bestTime: this.runStats.bestTime,
      totalKills: this.runStats.totalKills,
      unlockedWeapons: this.saveManager.save.unlockedWeapons,
      unlockedCosmetics: this.saveManager.save.unlockedCosmetics,
      achievements: this.saveManager.save.achievements,
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
      totalKills: this.saveManager.save.totalKills,
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
    this.cleanupAllEnemies('game-over');
    this.cancelTurretPlacement(true);
    this.turrets.forEach((turret) => turret.body.destroy());
    this.turrets = [];
    this.stats.turret = 0;
    this.updateCursorMode();
    this.soundtrack.gameOverTone();
    const runWave = this.wave;
    const runTime = Math.floor(this.elapsed);
    const runKills = this.score;
    const runCoins = this.runCoinsEarned;
    const accountXpGained = this.getAccountXpReward(runWave, runKills, runTime);
    this.runStats.bestWave = Math.max(this.runStats.bestWave, this.wave);
    this.runStats.bestTime = Math.max(this.runStats.bestTime, runTime);
    this.runStats.totalKills += this.score;
    this.saveRunStats();
    const accountResult = this.grantAccountXp(accountXpGained);
    this.showAccountLevelToast(accountResult.levelsGained, accountResult.accountLevel, accountXpGained);
    this.coins = 0;
    this.player.setAlpha(0.72);
    this.player.setRotation(-0.85);
    this.player.setScale(1.05, 0.72);
    this.gameOverOverlay.classList.add('visible');
    this.gameOverOverlay.innerHTML = `
      <div class="gameover-box">
        <h1>RUN OVER</h1>
        <p>The run is finished. Coins were temporary and vanish with the dead zone.</p>
        <div class="run-summary">
          <div><span>Wave Reached</span><strong>${runWave}</strong></div>
          <div><span>Kills</span><strong>${runKills}</strong></div>
          <div><span>Time Survived</span><strong>${this.formatTime(runTime)}</strong></div>
          <div><span>Coins This Run</span><strong>${runCoins}</strong></div>
          <div><span>Account XP</span><strong>+${accountXpGained}</strong></div>
          <div><span>Account Level</span><strong>Lv ${accountResult.accountLevel}</strong></div>
          <div><span>Level Progress</span><strong>${accountResult.accountXp} / ${accountResult.accountXpNext} XP</strong></div>
        </div>
        <button>Restart Run</button>
      </div>`;
    this.gameOverOverlay.querySelector('button')?.addEventListener('click', () => this.scene.restart(), { once: true });
  }

  private cleanupDom() {
    window.removeEventListener('beforeunload', this.handleBeforeUnload);
    document.body.classList.remove('boss-warning-active', 'menu-cursor-active', 'special-wave-active', 'special-wave-toxic', 'special-wave-night', 'special-wave-elite', 'special-wave-gunnerRaid', 'special-wave-burning', 'special-wave-fog');
    if (this.worldLayer && this.fxLayer) this.cleanupAllEnemies('cleanup-dom');
    this.cancelTurretPlacement(false);
    this.turrets.forEach((turret) => { if (turret.body.active) turret.body.destroy(); });
    this.turrets = [];
    this.transientFx.forEach((fx) => { if (fx.active) fx.destroy(); });
    this.worldDecals.forEach((fx) => { if (fx.active) fx.destroy(); });
    this.transientFx = [];
    this.worldDecals = [];
    document.querySelectorAll('.hud, .upgrades, .gameover, .camp-shop, .pause-menu, .weapon-select, .main-lobby, .preload-screen, .damage-flash, .game-crosshair, .account-level-toast, .ui-warmup-cache').forEach((node) => node.remove());
    this.soundtrack.destroy();
    this.soundtrack = new DynamicSoundtrack();
    this.sfx.destroy();
    this.sfx = new ArcadeSfx();
  }
}
