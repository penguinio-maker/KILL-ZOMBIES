import Phaser from 'phaser';

type Vec2 = { x: number; y: number };
type EnemyType = 'walker' | 'runner' | 'brute' | 'gunner' | 'spitter' | 'shielder' | 'exploder' | 'screamer' | 'bossTitan' | 'bossGunner';
type WavePhase = 'countdown' | 'bossWarning' | 'active' | 'complete' | 'upgrade';
type BossMode = 'none' | 'chargeWindup' | 'charge' | 'slam' | 'ring' | 'vulnerable';
type SpecialWaveType = 'none' | 'toxic' | 'night' | 'elite' | 'gunnerRaid' | 'burning' | 'fog';
type EncounterArchetype = 'intro' | 'swarm' | 'breather' | 'mixed' | 'supportPressure' | 'shieldedElite' | 'rangedPressure' | 'hazardAmbush';
type WeaponId = 'pistol' | 'rapidPistol' | 'heavyPistol' | 'burstPistol' | 'shotgun' | 'smg' | 'burstRifle' | 'flamethrower' | 'dualPistols' | 'launcher' | 'railgun' | 'plasma' | 'lightningCannon' | 'minigun' | 'baseballBat' | 'combatKnife' | 'chainsawMachete';
type WeaponSlot = 'primary' | 'heavy' | 'sidearm';
type CharacterId = 'survivor' | 'scout' | 'heavy' | 'medic' | 'hunter';
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

const FIRST_BOSS_WAVE = 15;

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

type MedkitDrop = {
  pos: Vec2;
  age: number;
  heal: number;
  body: Phaser.GameObjects.Container;
};
type ShopOffer =
  | { kind: 'weapon'; id: WeaponId; sold?: boolean }
  | { kind: 'weaponUpgrade'; id: WeaponId; sold?: boolean }
  | { kind: 'utilitySlot'; sold?: boolean }
  | { kind: 'turret'; sold?: boolean };

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

type CombatDrone = {
  pos: Vec2;
  body: Phaser.GameObjects.Container;
  sprite?: Phaser.GameObjects.Image;
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
  visual: WeaponVisual;
  melee?: MeleeProfile;
};

type MeleeProfile = {
  mode: 'swingArc' | 'quickSlash' | 'continuousCone';
  range: number;
  arc: number;
  maxTargets: number;
  windup: number;
  active: number;
  recovery: number;
  tick: number;
  hitStop: number;
  recoil: number;
  fx: 'bat' | 'knife' | 'chainsaw';
};

type MeleeAttackState = {
  weaponId: WeaponId;
  angle: number;
  damage: number;
  evolved: boolean;
  elapsed: number;
  activeStarted: boolean;
  tickTimer: number;
  hitIds: Set<number>;
  variant: number;
};

type WeaponVisual = {
  spriteKey: WeaponId;
  width: number;
  height: number;
  handOffsetX: number;
  handOffsetY: number;
  muzzleOffsetX: number;
  muzzleOffsetY: number;
  rotationOffset?: number;
};

type EquippedWeapon = {
  id: WeaponId;
  slot: WeaponSlot;
  cooldown: number;
  evolved: boolean;
  level: number;
};

const WEAPON_VISUALS: Record<WeaponId, WeaponVisual> = {
  pistol: { spriteKey: 'pistol', width: 44, height: 22, handOffsetX: 12, handOffsetY: 5, muzzleOffsetX: 39, muzzleOffsetY: 0 },
  rapidPistol: { spriteKey: 'rapidPistol', width: 46, height: 22, handOffsetX: 12, handOffsetY: 5, muzzleOffsetX: 41, muzzleOffsetY: 0 },
  heavyPistol: { spriteKey: 'heavyPistol', width: 50, height: 25, handOffsetX: 12, handOffsetY: 5, muzzleOffsetX: 45, muzzleOffsetY: 0 },
  burstPistol: { spriteKey: 'burstPistol', width: 48, height: 24, handOffsetX: 12, handOffsetY: 5, muzzleOffsetX: 43, muzzleOffsetY: 0 },
  dualPistols: { spriteKey: 'dualPistols', width: 52, height: 30, handOffsetX: 12, handOffsetY: 4, muzzleOffsetX: 45, muzzleOffsetY: -5 },
  shotgun: { spriteKey: 'shotgun', width: 72, height: 24, handOffsetX: 13, handOffsetY: 5, muzzleOffsetX: 63, muzzleOffsetY: 0 },
  smg: { spriteKey: 'smg', width: 60, height: 29, handOffsetX: 13, handOffsetY: 5, muzzleOffsetX: 53, muzzleOffsetY: 0 },
  burstRifle: { spriteKey: 'burstRifle', width: 72, height: 30, handOffsetX: 13, handOffsetY: 5, muzzleOffsetX: 64, muzzleOffsetY: 0 },
  flamethrower: { spriteKey: 'flamethrower', width: 76, height: 25, handOffsetX: 13, handOffsetY: 6, muzzleOffsetX: 67, muzzleOffsetY: 1 },
  launcher: { spriteKey: 'launcher', width: 78, height: 28, handOffsetX: 13, handOffsetY: 5, muzzleOffsetX: 69, muzzleOffsetY: 0 },
  railgun: { spriteKey: 'railgun', width: 78, height: 27, handOffsetX: 13, handOffsetY: 5, muzzleOffsetX: 69, muzzleOffsetY: 0 },
  plasma: { spriteKey: 'plasma', width: 70, height: 33, handOffsetX: 13, handOffsetY: 5, muzzleOffsetX: 61, muzzleOffsetY: 0 },
  lightningCannon: { spriteKey: 'lightningCannon', width: 72, height: 32, handOffsetX: 13, handOffsetY: 5, muzzleOffsetX: 64, muzzleOffsetY: 0 },
  minigun: { spriteKey: 'minigun', width: 78, height: 32, handOffsetX: 13, handOffsetY: 5, muzzleOffsetX: 69, muzzleOffsetY: -1 },
  baseballBat: { spriteKey: 'baseballBat', width: 76, height: 82, handOffsetX: 12, handOffsetY: 2, muzzleOffsetX: 74, muzzleOffsetY: 0, rotationOffset: -0.18 },
  combatKnife: { spriteKey: 'combatKnife', width: 66, height: 72, handOffsetX: 10, handOffsetY: 4, muzzleOffsetX: 58, muzzleOffsetY: 0, rotationOffset: -0.12 },
  chainsawMachete: { spriteKey: 'chainsawMachete', width: 80, height: 86, handOffsetX: 10, handOffsetY: 4, muzzleOffsetX: 70, muzzleOffsetY: 0, rotationOffset: -0.14 },
};

const RAW_WEAPONS: Record<WeaponId, Omit<WeaponProfile, 'visual'>> = {
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
  baseballBat: {
    id: 'baseballBat',
    title: 'Baseball Bat',
    tagline: 'Wide crowd control',
    desc: 'Slow heavy swings hit a wide arc and shove crowds back.',
    icon: 'BAT',
    damage: 28,
    fireRate: 1.45,
    bulletSpeed: 1,
    pellets: 1,
    spreadAngle: 0,
    inaccuracy: 0,
    projectileSize: 1,
    knockback: 2.65,
    shake: 0.0065,
    color: 0xd19a55,
    tier: 'Early',
    melee: { mode: 'swingArc', range: 116, arc: Phaser.Math.DegToRad(118), maxTargets: 7, windup: 0.16, active: 0.14, recovery: 0.32, tick: 0.14, hitStop: 0.045, recoil: 12, fx: 'bat' },
  },
  combatKnife: {
    id: 'combatKnife',
    title: 'Combat Knife',
    tagline: 'Fast close DPS',
    desc: 'Very fast short slashes for risky close-range damage.',
    icon: 'KNF',
    damage: 13,
    fireRate: 7.8,
    bulletSpeed: 1,
    pellets: 1,
    spreadAngle: 0,
    inaccuracy: 0,
    projectileSize: 1,
    knockback: 0.45,
    shake: 0.0018,
    color: 0xd8d2be,
    tier: 'Early',
    melee: { mode: 'quickSlash', range: 74, arc: Phaser.Math.DegToRad(48), maxTargets: 3, windup: 0.045, active: 0.06, recovery: 0.11, tick: 0.06, hitStop: 0.012, recoil: 5, fx: 'knife' },
  },
  chainsawMachete: {
    id: 'chainsawMachete',
    title: 'Chainsaw Machete',
    tagline: 'Horde shredder',
    desc: 'Sustained short-range damage chews through clustered enemies.',
    icon: 'SAW',
    damage: 9.5,
    fireRate: 10.5,
    bulletSpeed: 1,
    pellets: 1,
    spreadAngle: 0,
    inaccuracy: 0,
    projectileSize: 1,
    knockback: 1.05,
    shake: 0.0028,
    color: 0xff6b45,
    tier: 'Mid',
    melee: { mode: 'continuousCone', range: 92, arc: Phaser.Math.DegToRad(72), maxTargets: 6, windup: 0.14, active: 0.42, recovery: 0.12, tick: 0.09, hitStop: 0.006, recoil: 4, fx: 'chainsaw' },
  },
};
const WEAPONS = Object.fromEntries(
  (Object.entries(RAW_WEAPONS) as Array<[WeaponId, Omit<WeaponProfile, 'visual'>]>).map(([id, weapon]) => [
    id,
    { ...weapon, visual: WEAPON_VISUALS[id] },
  ]),
) as Record<WeaponId, WeaponProfile>;

const STARTING_WEAPONS: WeaponId[] = ['baseballBat', 'combatKnife', 'chainsawMachete'];
const WEAPON_SLOTS: WeaponSlot[] = ['primary', 'heavy', 'sidearm'];
const UTILITY_SLOT_COUNT = 3;
const UTILITY_SLOT_PRICES = [80, 140, 220] as const;
const WEAPON_SLOT_LABELS: Record<WeaponSlot, string> = {
  primary: 'Weapon Slot 1',
  heavy: 'Weapon Slot 2',
  sidearm: 'Weapon Slot 3',
};
const CHARACTER_TEMPLATES: Record<CharacterId, { title: string; icon: string; desc: string; traits: string[] }> = {
  survivor: {
    title: 'Survivor',
    icon: 'SV',
    desc: 'Balanced survivor with steady combat instincts.',
    traits: ['+ Steady health pool', '+ Small damage reduction', '- No extreme specialty'],
  },
  scout: {
    title: 'Scout',
    icon: 'SC',
    desc: 'Fast and light, better at repositioning.',
    traits: ['+ Faster movement', '+ Quicker dodge roll', '- Lower staying power'],
  },
  heavy: {
    title: 'Heavy',
    icon: 'HV',
    desc: 'Slow but tougher under pressure.',
    traits: ['+ Higher max HP', '+ Better damage reduction', '- Slower movement'],
  },
  medic: {
    title: 'Engineer / Medic',
    icon: 'MD',
    desc: 'Support specialist with cleaner recovery tools.',
    traits: ['+ Better recovery', '+ Utility tech focus', '- Lower burst damage'],
  },
  hunter: {
    title: 'Hunter',
    icon: 'HT',
    desc: 'Precision survivor built around calm ranged pressure.',
    traits: ['+ Higher crit chance', '+ Better bullet speed', '- Less max HP'],
  },
};
const PLAYER_CHARACTER_TEXTURES: Record<CharacterId, string> = {
  survivor: new URL('../assets/characters/player-survivor.png', import.meta.url).href,
  scout: new URL('../assets/characters/classes/scout.png', import.meta.url).href,
  heavy: new URL('../assets/characters/classes/heavy.png', import.meta.url).href,
  medic: new URL('../assets/characters/classes/medic.png', import.meta.url).href,
  hunter: new URL('../assets/characters/classes/hunter.png', import.meta.url).href,
};
const PLAYER_CHARACTER_TEXTURE_KEYS: Record<CharacterId, string> = {
  survivor: 'player-character-survivor',
  scout: 'player-character-scout',
  heavy: 'player-character-heavy',
  medic: 'player-character-medic',
  hunter: 'player-character-hunter',
};
const PLAYER_ROLL_TEXTURES: Record<CharacterId, string> = {
  survivor: new URL('../assets/characters/rolls/survivor-roll.png', import.meta.url).href,
  scout: new URL('../assets/characters/rolls/scout-roll.png', import.meta.url).href,
  heavy: new URL('../assets/characters/rolls/heavy-roll.png', import.meta.url).href,
  medic: new URL('../assets/characters/rolls/medic-roll.png', import.meta.url).href,
  hunter: new URL('../assets/characters/rolls/hunter-roll.png', import.meta.url).href,
};
const PLAYER_ROLL_TEXTURE_KEYS: Record<CharacterId, string> = {
  survivor: 'player-roll-survivor',
  scout: 'player-roll-scout',
  heavy: 'player-roll-heavy',
  medic: 'player-roll-medic',
  hunter: 'player-roll-hunter',
};
const PLAYER_ROLL_ANIM_KEYS: Record<CharacterId, string> = {
  survivor: 'player-roll-anim-survivor',
  scout: 'player-roll-anim-scout',
  heavy: 'player-roll-anim-heavy',
  medic: 'player-roll-anim-medic',
  hunter: 'player-roll-anim-hunter',
};
const ENEMY_SPRITE_URLS: Record<EnemyType, string> = {
  walker: new URL('../assets/enemies/walker.png', import.meta.url).href,
  runner: new URL('../assets/enemies/runner.png', import.meta.url).href,
  brute: new URL('../assets/enemies/brute.png', import.meta.url).href,
  gunner: new URL('../assets/enemies/gunner.png', import.meta.url).href,
  spitter: new URL('../assets/enemies/spitter.png', import.meta.url).href,
  shielder: new URL('../assets/enemies/shielder.png', import.meta.url).href,
  exploder: new URL('../assets/enemies/exploder.png', import.meta.url).href,
  screamer: new URL('../assets/enemies/screamer.png', import.meta.url).href,
  bossTitan: new URL('../assets/enemies/bossTitan.png', import.meta.url).href,
  bossGunner: new URL('../assets/enemies/bossGunner.png', import.meta.url).href,
};
const ENEMY_SPRITE_KEYS: Record<EnemyType, string> = {
  walker: 'enemy-sprite-walker',
  runner: 'enemy-sprite-runner',
  brute: 'enemy-sprite-brute',
  gunner: 'enemy-sprite-gunner',
  spitter: 'enemy-sprite-spitter',
  shielder: 'enemy-sprite-shielder',
  exploder: 'enemy-sprite-exploder',
  screamer: 'enemy-sprite-screamer',
  bossTitan: 'enemy-sprite-boss-titan',
  bossGunner: 'enemy-sprite-boss-gunner',
};
const ENEMY_RUN_SPRITE_URLS: Record<EnemyType, string> = {
  walker: new URL('../assets/enemies/runs/walker-run.png', import.meta.url).href,
  runner: new URL('../assets/enemies/runs/runner-run.png', import.meta.url).href,
  brute: new URL('../assets/enemies/runs/brute-run.png', import.meta.url).href,
  gunner: new URL('../assets/enemies/runs/gunner-run.png', import.meta.url).href,
  spitter: new URL('../assets/enemies/runs/spitter-run.png', import.meta.url).href,
  shielder: new URL('../assets/enemies/runs/shielder-run.png', import.meta.url).href,
  exploder: new URL('../assets/enemies/runs/exploder-run.png', import.meta.url).href,
  screamer: new URL('../assets/enemies/runs/screamer-run.png', import.meta.url).href,
  bossTitan: new URL('../assets/enemies/runs/bossTitan-run.png', import.meta.url).href,
  bossGunner: new URL('../assets/enemies/runs/bossGunner-run.png', import.meta.url).href,
};
const ENEMY_RUN_SPRITE_KEYS: Record<EnemyType, string> = {
  walker: 'enemy-run-walker',
  runner: 'enemy-run-runner',
  brute: 'enemy-run-brute',
  gunner: 'enemy-run-gunner',
  spitter: 'enemy-run-spitter',
  shielder: 'enemy-run-shielder',
  exploder: 'enemy-run-exploder',
  screamer: 'enemy-run-screamer',
  bossTitan: 'enemy-run-boss-titan',
  bossGunner: 'enemy-run-boss-gunner',
};
const ENEMY_RUN_ANIM_KEYS: Record<EnemyType, string> = {
  walker: 'enemy-run-anim-walker',
  runner: 'enemy-run-anim-runner',
  brute: 'enemy-run-anim-brute',
  gunner: 'enemy-run-anim-gunner',
  spitter: 'enemy-run-anim-spitter',
  shielder: 'enemy-run-anim-shielder',
  exploder: 'enemy-run-anim-exploder',
  screamer: 'enemy-run-anim-screamer',
  bossTitan: 'enemy-run-anim-boss-titan',
  bossGunner: 'enemy-run-anim-boss-gunner',
};
const ENEMY_RUN_FRAME_SIZES: Record<EnemyType, { width: number; height: number }> = {
  walker: { width: 217, height: 312 },
  runner: { width: 315, height: 307 },
  brute: { width: 327, height: 358 },
  gunner: { width: 279, height: 329 },
  spitter: { width: 230, height: 287 },
  shielder: { width: 267, height: 354 },
  exploder: { width: 299, height: 356 },
  screamer: { width: 250, height: 321 },
  bossTitan: { width: 426, height: 395 },
  bossGunner: { width: 445, height: 366 },
};
const ENEMY_VISUALS: Record<EnemyType, { width: number; height: number; shadowW: number; shadowH: number; y: number }> = {
  walker: { width: 60, height: 91, shadowW: 46, shadowH: 11, y: 33 },
  runner: { width: 84, height: 83, shadowW: 50, shadowH: 10, y: 30 },
  brute: { width: 148, height: 166, shadowW: 104, shadowH: 24, y: 61 },
  gunner: { width: 86, height: 105, shadowW: 64, shadowH: 14, y: 39 },
  spitter: { width: 79, height: 103, shadowW: 58, shadowH: 14, y: 38 },
  shielder: { width: 104, height: 142, shadowW: 86, shadowH: 20, y: 53 },
  exploder: { width: 102, height: 126, shadowW: 72, shadowH: 17, y: 47 },
  screamer: { width: 84, height: 113, shadowW: 62, shadowH: 14, y: 41 },
  bossTitan: { width: 258, height: 241, shadowW: 184, shadowH: 40, y: 91 },
  bossGunner: { width: 232, height: 190, shadowW: 158, shadowH: 32, y: 73 },
};
const WEAPON_SPRITE_URLS: Record<WeaponId, string> = {
  pistol: new URL('../assets/weapons/pistol.png', import.meta.url).href,
  rapidPistol: new URL('../assets/weapons/rapidPistol.png', import.meta.url).href,
  heavyPistol: new URL('../assets/weapons/heavyPistol.png', import.meta.url).href,
  burstPistol: new URL('../assets/weapons/burstPistol.png', import.meta.url).href,
  dualPistols: new URL('../assets/weapons/dualPistols.png', import.meta.url).href,
  shotgun: new URL('../assets/weapons/shotgun.png', import.meta.url).href,
  smg: new URL('../assets/weapons/smg.png', import.meta.url).href,
  burstRifle: new URL('../assets/weapons/burstRifle.png', import.meta.url).href,
  flamethrower: new URL('../assets/weapons/flamethrower.png', import.meta.url).href,
  launcher: new URL('../assets/weapons/launcher.png', import.meta.url).href,
  railgun: new URL('../assets/weapons/railgun.png', import.meta.url).href,
  plasma: new URL('../assets/weapons/plasma.png', import.meta.url).href,
  lightningCannon: new URL('../assets/weapons/lightningCannon.png', import.meta.url).href,
  minigun: new URL('../assets/weapons/minigun.png', import.meta.url).href,
  baseballBat: new URL('../assets/weapons/baseball_bat_clean.png', import.meta.url).href,
  combatKnife: new URL('../assets/weapons/combat_knife_clean.png', import.meta.url).href,
  chainsawMachete: new URL('../assets/weapons/chainsaw_machete_clean.png', import.meta.url).href,
};
const WEAPON_SPRITE_KEYS: Record<WeaponId, string> = {
  pistol: 'weapon-sprite-pistol',
  rapidPistol: 'weapon-sprite-rapid-pistol',
  heavyPistol: 'weapon-sprite-heavy-pistol',
  burstPistol: 'weapon-sprite-burst-pistol',
  dualPistols: 'weapon-sprite-dual-pistols',
  shotgun: 'weapon-sprite-shotgun',
  smg: 'weapon-sprite-smg',
  burstRifle: 'weapon-sprite-burst-rifle',
  flamethrower: 'weapon-sprite-flamethrower',
  launcher: 'weapon-sprite-launcher',
  railgun: 'weapon-sprite-railgun',
  plasma: 'weapon-sprite-plasma',
  lightningCannon: 'weapon-sprite-lightning-cannon',
  minigun: 'weapon-sprite-minigun',
  baseballBat: 'weapon-sprite-baseball-bat',
  combatKnife: 'weapon-sprite-combat-knife',
  chainsawMachete: 'weapon-sprite-chainsaw-machete-clean-v2',
};
const TURRET_SPRITE_URLS = {
  1: new URL('../assets/turrets/turret_mk1.png', import.meta.url).href,
  2: new URL('../assets/turrets/turret_mk2.png', import.meta.url).href,
  3: new URL('../assets/turrets/turret_mk3.png', import.meta.url).href,
} as const;
const TURRET_SPRITE_KEYS = {
  1: 'turret-sprite-mk1',
  2: 'turret-sprite-mk2',
  3: 'turret-sprite-mk3',
} as const;
const TURRET_VISUALS = {
  1: { width: 72, height: 54, muzzleOffset: 54 },
  2: { width: 88, height: 66, muzzleOffset: 63 },
  3: { width: 104, height: 78, muzzleOffset: 72 },
} as const;
const DRONE_SPRITE_URL = new URL('../assets/drones/drone_buddy.png', import.meta.url).href;
const DRONE_SPRITE_KEY = 'combat-drone-buddy';
const MEDKIT_SPRITE_URL = new URL('../assets/items/medkit.png', import.meta.url).href;
const MEDKIT_SPRITE_KEY = 'item-medkit';
const MEDKIT_HEAL_AMOUNT = 22;
const MEDKIT_DROP_LIMIT_PER_WAVE = 2;
const MEDKIT_SLOT_CAPACITY = 1;
const SPECIAL_WAVE_META: Record<SpecialWaveType, { title: string; label: string; color: string; bonus: number }> = {
  none: { title: '', label: '', color: '#ffd166', bonus: 0 },
  toxic: { title: 'TOXIC WAVE', label: 'CONTAMINATED', color: '#8aff6a', bonus: 14 },
  night: { title: 'NIGHT SWARM', label: 'DARK HORDE', color: '#9aa7ff', bonus: 12 },
  elite: { title: 'ELITE HUNT', label: 'ELITES', color: '#ffd166', bonus: 22 },
  gunnerRaid: { title: 'GUNNER RAID', label: 'RANGED RAID', color: '#ff9f6a', bonus: 18 },
  burning: { title: 'BURNING HORDE', label: 'FIRESTORM', color: '#ff6b45', bonus: 16 },
  fog: { title: 'FOG EVENT', label: 'LOW VISIBILITY', color: '#c9d1d3', bonus: 12 },
};
const SHOP_WEAPONS: WeaponId[] = ['pistol', 'rapidPistol', 'heavyPistol', 'burstPistol', 'dualPistols', 'shotgun', 'smg', 'burstRifle', 'baseballBat', 'combatKnife', 'chainsawMachete', 'plasma', 'lightningCannon', 'minigun', 'flamethrower', 'launcher', 'railgun'];

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
    if (id === 'baseballBat') return this.playMeleeSwing('heavy');
    if (id === 'combatKnife') return this.playMeleeSwing('light');
    if (id === 'chainsawMachete') return this.playMeleeSwing('saw');
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

  private playMeleeSwing(kind: 'heavy' | 'light' | 'saw') {
    if (kind === 'heavy') {
      this.toneBurst(190, 86, 0.105, 0.09, 'sawtooth');
      this.noiseBurst(0.055, 0.035, 720);
      return;
    }
    if (kind === 'saw') {
      this.toneBurst(120, 145, 0.055, 0.055, 'sawtooth');
      this.noiseBurst(0.04, 0.028, 1500);
      return;
    }
    this.toneBurst(620, 260, 0.035, 0.04, 'triangle');
    this.noiseBurst(0.015, 0.012, 2300);
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
  id?: string;
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
  createdAt?: number;
  lastPlayedAt?: number;
};

const SAVE_KEY = 'zombie_survival_save_v1';
const PROFILE_SLOTS_KEY = 'zombie_survival_profiles_v1';
const ACTIVE_PROFILE_KEY = 'zombie_survival_active_profile_v1';
const PROFILE_IDS = ['profile_1', 'profile_2', 'profile_3'];

class SaveManager {
  private data: SaveData;
  private activeProfileId = PROFILE_IDS[0];

  constructor() {
    this.data = this.loadSave();
  }

  get save() {
    return this.data;
  }

  get activeId() {
    return this.activeProfileId;
  }

  get profiles() {
    return this.loadProfileSlots();
  }

  loadSave(): SaveData {
    const fallback = this.defaultSave();
    try {
      this.ensureProfileSlots();
      const slots = this.loadProfileSlots();
      const active = localStorage.getItem(ACTIVE_PROFILE_KEY) || PROFILE_IDS[0];
      const existing = slots.find((slot) => slot?.id === active) ?? slots.find(Boolean) ?? this.createDefaultProfile(PROFILE_IDS[0], 'Nickname');
      this.activeProfileId = existing.id || PROFILE_IDS[0];
      localStorage.setItem(ACTIVE_PROFILE_KEY, this.activeProfileId);
      this.data = this.normalizeSave(existing, fallback);
      return this.data;
    } catch {
      this.data = fallback;
      return this.data;
    }
  }

  saveGame(next?: Partial<SaveData>) {
    this.data = this.normalizeSave({ ...this.data, ...next, id: this.activeProfileId, lastPlayedAt: Date.now() }, this.defaultSave());
    const slots = this.loadProfileSlots();
    const index = this.getProfileIndex(this.activeProfileId);
    slots[index] = { ...this.data, id: this.activeProfileId, lastPlayedAt: Date.now(), createdAt: this.data.createdAt ?? Date.now() };
    this.saveProfileSlots(slots);
    localStorage.setItem(SAVE_KEY, JSON.stringify(this.data));
  }

  resetSave() {
    const slots: Array<SaveData | null> = [this.createDefaultProfile(PROFILE_IDS[0], 'Nickname'), null, null];
    this.activeProfileId = PROFILE_IDS[0];
    localStorage.setItem(ACTIVE_PROFILE_KEY, this.activeProfileId);
    this.saveProfileSlots(slots);
    this.data = this.normalizeSave(slots[0]!, this.defaultSave());
    this.saveGame();
    return this.data;
  }

  createProfile(id: string, nickname: string) {
    const profileId = PROFILE_IDS.includes(id) ? id : PROFILE_IDS[0];
    const slots = this.loadProfileSlots();
    const index = this.getProfileIndex(profileId);
    if (slots[index]) return slots[index]!;
    slots[index] = this.createDefaultProfile(profileId, nickname || `Profile ${index + 1}`);
    this.saveProfileSlots(slots);
    this.selectProfile(profileId);
    return this.data;
  }

  selectProfile(id: string) {
    this.saveGame();
    const slots = this.loadProfileSlots();
    const profile = slots.find((slot) => slot?.id === id);
    if (!profile) return this.data;
    this.activeProfileId = id;
    localStorage.setItem(ACTIVE_PROFILE_KEY, id);
    this.data = this.normalizeSave({ ...profile, lastPlayedAt: Date.now() }, this.defaultSave());
    this.saveGame();
    return this.data;
  }

  renameProfile(id: string, nickname: string) {
    const slots = this.loadProfileSlots();
    const index = this.getProfileIndex(id);
    const profile = slots[index];
    if (!profile) return;
    slots[index] = this.normalizeSave({ ...profile, nickname }, this.defaultSave());
    slots[index]!.id = id;
    slots[index]!.createdAt = profile.createdAt ?? Date.now();
    slots[index]!.lastPlayedAt = Date.now();
    this.saveProfileSlots(slots);
    if (id === this.activeProfileId) this.loadSave();
  }

  deleteProfile(id: string) {
    const slots = this.loadProfileSlots();
    const index = this.getProfileIndex(id);
    slots[index] = null;
    const activeStillExists = slots.some((slot) => slot?.id === this.activeProfileId);
    const next = activeStillExists
      ? slots.find((slot) => slot?.id === this.activeProfileId)!
      : slots.find(Boolean) ?? this.createDefaultProfile(PROFILE_IDS[0], 'Nickname');
    if (!slots.find(Boolean)) slots[0] = next;
    this.saveProfileSlots(slots);
    this.activeProfileId = next.id || PROFILE_IDS[0];
    localStorage.setItem(ACTIVE_PROFILE_KEY, this.activeProfileId);
    this.loadSave();
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
      id: this.activeProfileId,
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
      createdAt: Date.now(),
      lastPlayedAt: Date.now(),
    };
  }

  private createDefaultProfile(id: string, nickname: string): SaveData {
    return this.normalizeSave({ ...this.defaultSave(), id, nickname, createdAt: Date.now(), lastPlayedAt: Date.now() }, this.defaultSave());
  }

  private ensureProfileSlots() {
    const existing = localStorage.getItem(PROFILE_SLOTS_KEY);
    if (existing) return;
    const fallback = this.defaultSave();
    let first = this.migrateOldSave(fallback);
    try {
      const raw = localStorage.getItem(SAVE_KEY);
      if (raw) first = this.normalizeSave(JSON.parse(raw) as Partial<SaveData>, fallback);
    } catch {
      first = fallback;
    }
    first.id = PROFILE_IDS[0];
    first.createdAt = first.createdAt ?? Date.now();
    first.lastPlayedAt = Date.now();
    this.saveProfileSlots([first, null, null]);
    localStorage.setItem(ACTIVE_PROFILE_KEY, PROFILE_IDS[0]);
  }

  private loadProfileSlots(): Array<SaveData | null> {
    try {
      const parsed = JSON.parse(localStorage.getItem(PROFILE_SLOTS_KEY) || '[]') as Array<Partial<SaveData> | null>;
      const slots = PROFILE_IDS.map((id, index) => {
        const value = parsed[index];
        if (!value) return null;
        const normalized = this.normalizeSave({ ...value, id }, this.defaultSave());
        normalized.id = id;
        normalized.createdAt = Math.max(0, Number(value.createdAt ?? normalized.createdAt ?? Date.now()) || Date.now());
        normalized.lastPlayedAt = Math.max(0, Number(value.lastPlayedAt ?? normalized.lastPlayedAt ?? normalized.createdAt ?? Date.now()) || Date.now());
        return normalized;
      });
      return slots;
    } catch {
      return [this.createDefaultProfile(PROFILE_IDS[0], 'Nickname'), null, null];
    }
  }

  private saveProfileSlots(slots: Array<SaveData | null>) {
    const normalized = PROFILE_IDS.map((id, index) => {
      const slot = slots[index];
      if (!slot) return null;
      const save = this.normalizeSave({ ...slot, id }, this.defaultSave());
      save.id = id;
      save.createdAt = slot.createdAt ?? Date.now();
      save.lastPlayedAt = slot.lastPlayedAt ?? Date.now();
      return save;
    });
    localStorage.setItem(PROFILE_SLOTS_KEY, JSON.stringify(normalized));
  }

  private getProfileIndex(id: string) {
    const index = PROFILE_IDS.indexOf(id);
    return index >= 0 ? index : 0;
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
      id: typeof input.id === 'string' ? input.id : fallback.id,
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
        masterVolume: Phaser.Math.Clamp(Number.isFinite(Number(settings.masterVolume)) ? Number(settings.masterVolume) : fallback.settings.masterVolume, 0, 1),
        musicVolume: Phaser.Math.Clamp(Number.isFinite(Number(settings.musicVolume)) ? Number(settings.musicVolume) : fallback.settings.musicVolume, 0, 1),
        sfxVolume: Phaser.Math.Clamp(Number.isFinite(Number(settings.sfxVolume)) ? Number(settings.sfxVolume) : fallback.settings.sfxVolume, 0, 1),
        fullscreen: Boolean(settings.fullscreen),
        screenshake: settings.screenshake !== false,
      },
      createdAt: Math.max(0, Number(input.createdAt ?? fallback.createdAt ?? Date.now()) || Date.now()),
      lastPlayedAt: Math.max(0, Number(input.lastPlayedAt ?? fallback.lastPlayedAt ?? Date.now()) || Date.now()),
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
const MAX_ACTIVE_BULLETS = 360;
const ENEMY_GRID_CELL_SIZE = 170;
const ENEMY_GRID_STRIDE = 10000;
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
  slotExpansion: new URL('../assets/icons/slotExpansion.png', import.meta.url).href,
  lockedSlot: new URL('../assets/icons/lockedSlot.png', import.meta.url).href,
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
  private playerCharacterSprite!: Phaser.GameObjects.Sprite;
  private playerGun!: Phaser.GameObjects.Container;
  private playerGunSprite!: Phaser.GameObjects.Image;
  private playerGunFallback!: Phaser.GameObjects.Container;
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
  private medkitDrops: MedkitDrop[] = [];
  private medkitsDroppedThisWave = 0;
  private medkitDropAttemptsThisWave = 0;
  private storedMedkits = 0;
  private turrets: Turret[] = [];
  private combatDrone: CombatDrone | null = null;
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
  private meleeAttack: MeleeAttackState | null = null;
  private meleeVariant = 0;
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
  private wavePrepUpgradeGranted = false;
  private pendingLevelChoices = 0;
  private waveStartCoins = 0;
  private waveEarnedXp = 0;
  private specialWave: SpecialWaveType = 'none';
  private nextSpecialWave: SpecialWaveType = 'none';
  private lastSpecialWave = -99;
  private encounterArchetype: EncounterArchetype = 'intro';
  private encounterQueue: EnemyType[] = [];
  private specialRewardPending = false;
  private turretSystemUnlocked = false;
  private utilitySlotsUnlocked = 0;
  private lastUtilitySlotPulse = 0;
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
  private collisionChecksThisFrame = 0;
  private updateCostMsSmoothed = 0;
  private debugPerfVisible = false;
  private debugPerfPanel!: HTMLDivElement;
  private uiAssetsPreloaded = false;
  private runPreloadReady = false;
  private runPreloadInProgress = false;
  private preloadOverlay!: HTMLDivElement;
  private bossHudEnemyId: number | null = null;
  private bossHudLastPct = 0;
  private bossHudDamageTimeout: number | undefined;
  private lobbyZombieTimer: number | undefined;
  private hitStop = 0;
  private hitStopCooldown = 0;
  private gunRecoil = 0;
  private lastWeaponVisualId: WeaponId | null = null;
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
  private selectedWeapon: WeaponId = 'baseballBat';
  private selectedCharacter: CharacterId = 'survivor';
  private equippedWeapons: EquippedWeapon[] = [];
  private activeWeaponSlot: WeaponSlot = 'primary';
  private shopOffers: ShopOffer[] = [];
  private shopRerollsThisPrep = 0;
  private pendingWeaponSlotPick: WeaponId | null = null;
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

  preload() {
    (Object.entries(PLAYER_CHARACTER_TEXTURES) as Array<[CharacterId, string]>).forEach(([id, url]) => {
      this.load.image(PLAYER_CHARACTER_TEXTURE_KEYS[id], url);
    });
    (Object.entries(PLAYER_ROLL_TEXTURES) as Array<[CharacterId, string]>).forEach(([id, url]) => {
      this.load.spritesheet(PLAYER_ROLL_TEXTURE_KEYS[id], url, { frameWidth: 360, frameHeight: 360 });
    });
    (Object.entries(ENEMY_SPRITE_URLS) as Array<[EnemyType, string]>).forEach(([id, url]) => {
      this.load.image(ENEMY_SPRITE_KEYS[id], url);
    });
    (Object.entries(ENEMY_RUN_SPRITE_URLS) as Array<[EnemyType, string]>).forEach(([id, url]) => {
      const size = ENEMY_RUN_FRAME_SIZES[id];
      this.load.spritesheet(ENEMY_RUN_SPRITE_KEYS[id], url, { frameWidth: size.width, frameHeight: size.height });
    });
    (Object.entries(WEAPON_SPRITE_URLS) as Array<[WeaponId, string]>).forEach(([id, url]) => {
      this.load.image(WEAPON_SPRITE_KEYS[id], url);
    });
    (Object.entries(TURRET_SPRITE_URLS) as Array<[string, string]>).forEach(([level, url]) => {
      this.load.image(TURRET_SPRITE_KEYS[Number(level) as 1 | 2 | 3], url);
    });
    this.load.image(DRONE_SPRITE_KEY, DRONE_SPRITE_URL);
    this.load.image(MEDKIT_SPRITE_KEY, MEDKIT_SPRITE_URL);
    (Object.entries(ENEMY_SPRITE_URLS) as Array<[EnemyType, string]>).forEach(([id, url]) => {
      this.load.image(ENEMY_SPRITE_KEYS[id], url);
    });
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
      if (event.key.toLowerCase() === 'e') this.useStoredMedkit();
      if (event.code === 'Space') {
        event.preventDefault();
        if (!event.repeat) this.tryStartRoll();
      }
      if (event.key === 'F3') this.toggleDebugPerf();
    });
    window.addEventListener('beforeunload', this.handleBeforeUnload);
    this.createArena();
    this.player = this.createPlayer();
    this.createPlayerRollAnimations();
    this.createEnemyRunAnimations();
    this.createHud();
    this.preloadUiAssets();
    this.showLobbyMenu();
    this.cameras.main.setZoom(1.08);
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
    this.medkitDrops.forEach((drop) => drop.body.destroy());
    this.medkitDrops = [];
    this.medkitsDroppedThisWave = 0;
    this.medkitDropAttemptsThisWave = 0;
    this.storedMedkits = 0;
    this.turrets.forEach((turret) => turret.body.destroy());
    this.turrets = [];
    this.destroyCombatDrone();
    this.turretId = 0;
    this.cancelTurretPlacement(false);
    this.coins = 0;
    this.runCoinsEarned = 0;
    this.aim = { x: 1, y: 0 };
    this.firing = false;
    this.fireCooldown = 0;
    this.activeWeaponSlot = 'primary';
    this.spawnCooldown = 0;
    this.droneCooldown = 0;
    this.turretCooldown = 0;
    this.auraCooldown = 0;
    this.shield = 0;
    this.invulnTimer = 0;
    this.rollCooldown = 0;
    this.rollCooldownMax = 2.8;
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
    this.wavePrepUpgradeGranted = false;
    this.pendingLevelChoices = 0;
    this.waveStartCoins = 0;
    this.waveEarnedXp = 0;
    this.specialWave = 'none';
    this.nextSpecialWave = 'none';
    this.lastSpecialWave = -99;
    this.encounterArchetype = 'intro';
    this.encounterQueue = [];
    this.specialRewardPending = false;
    this.turretSystemUnlocked = false;
    this.utilitySlotsUnlocked = 0;
    this.lastUtilitySlotPulse = 0;
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
    this.lastWeaponVisualId = null;
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
    this.selectedWeapon = 'baseballBat';
    this.equippedWeapons = [];
    this.shopOffers = [];
    this.shopRerollsThisPrep = 0;
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
    const updateStarted = performance.now();
    const rawDt = Math.min(deltaMs / 1000, 0.033);
    this.collisionChecksThisFrame = 0;
    this.hitStop = Math.max(0, this.hitStop - rawDt);
    this.hitStopCooldown = Math.max(0, this.hitStopCooldown - rawDt);
    const dt = this.hitStop > 0 ? rawDt * 0.45 : rawDt;
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
    this.updateMedkits(dt);
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
    this.updateCostMsSmoothed = this.updateCostMsSmoothed * 0.9 + (performance.now() - updateStarted) * 0.1;
    this.cameras.main.centerOn(this.playerPos.x, this.playerPos.y);
  }

  private createArena() {
    const bg = this.add.rectangle(0, 0, WORLD_HALF_SIZE * 2, WORLD_HALF_SIZE * 2, 0x0b1218, 1);
    this.worldLayer.add(bg);

    const outerGround = this.add.rectangle(0, 0, WORLD_HALF_SIZE * 2, WORLD_HALF_SIZE * 2, 0x0f181f, 0.72);
    this.worldLayer.add(outerGround);

    const arenaFloor = this.add.rectangle(0, 0, PLAYABLE_HALF_SIZE * 2 + 520, PLAYABLE_HALF_SIZE * 2 + 520, 0x17232c, 0.94);
    arenaFloor.setStrokeStyle(2, 0x24313b, 0.18);
    this.worldLayer.add(arenaFloor);

    for (let x = -2320; x <= 2320; x += 180) {
      for (let y = -2320; y <= 2320; y += 180) {
        const tile = this.add.rectangle(
          x,
          y,
          170,
          170,
          Phaser.Display.Color.GetColor(19 + Phaser.Math.Between(-2, 4), 30 + Phaser.Math.Between(-3, 5), 38 + Phaser.Math.Between(-3, 5)),
          0.22,
        );
        tile.setStrokeStyle(1, 0x25333e, 0.07);
        this.worldLayer.add(tile);
      }
    }

    this.createMinimalGroundDetails();
    this.createArenaBoundary();
    this.createAtmosphericFog();
  }

  private createMinimalGroundDetails() {
    for (let i = 0; i < 150; i += 1) this.createSmallCrack();
    for (let i = 0; i < 95; i += 1) this.createSoftGroundPatch();
    for (let i = 0; i < 120; i += 1) this.createTinyDebris();
    for (let i = 0; i < 28; i += 1) this.createGrassPatch();
    for (let i = 0; i < 18; i += 1) this.createSubtlePuddleOrOil();
  }

  private createSmallCrack() {
    const x = Phaser.Math.Between(-2250, 2250);
    const y = Phaser.Math.Between(-2250, 2250);
    const length = Phaser.Math.Between(28, 120);
    const crack = this.add.rectangle(x, y, length, Phaser.Math.Between(2, 5), 0x05090d, Phaser.Math.FloatBetween(0.16, 0.34));
    crack.setRotation(Phaser.Math.FloatBetween(-1.4, 1.4));
    this.worldLayer.add(crack);
    if (Math.random() < 0.32) {
      const branch = this.add.rectangle(x + Phaser.Math.Between(-20, 20), y + Phaser.Math.Between(-20, 20), length * Phaser.Math.FloatBetween(0.25, 0.55), 2, 0x05090d, 0.16);
      branch.setRotation(crack.rotation + Phaser.Math.FloatBetween(0.65, 1.1));
      this.worldLayer.add(branch);
    }
  }

  private createSoftGroundPatch() {
    const patch = this.add.rectangle(
      Phaser.Math.Between(-2300, 2300),
      Phaser.Math.Between(-2300, 2300),
      Phaser.Math.Between(55, 210),
      Phaser.Math.Between(28, 112),
      Phaser.Utils.Array.GetRandom([0x0a1015, 0x1d211d, 0x241f1a, 0x101b1c]),
      Phaser.Math.FloatBetween(0.08, 0.18),
    );
    patch.setRotation(Phaser.Math.FloatBetween(-1.2, 1.2));
    this.worldLayer.add(patch);
  }

  private createTinyDebris() {
    const debris = this.add.rectangle(
      Phaser.Math.Between(-2300, 2300),
      Phaser.Math.Between(-2300, 2300),
      Phaser.Math.Between(5, 22),
      Phaser.Math.Between(4, 14),
      Phaser.Utils.Array.GetRandom([0x2a3840, 0x303431, 0x3d3326, 0x1c252b]),
      Phaser.Math.FloatBetween(0.22, 0.46),
    );
    debris.setRotation(Phaser.Math.FloatBetween(-1.4, 1.4));
    this.worldLayer.add(debris);
  }

  private createGrassPatch() {
    const c = this.add.container(Phaser.Math.Between(-2300, 2300), Phaser.Math.Between(-2300, 2300));
    const blades = Phaser.Math.Between(3, 6);
    for (let i = 0; i < blades; i += 1) {
      const blade = this.add.rectangle(Phaser.Math.Between(-18, 18), Phaser.Math.Between(-12, 12), Phaser.Math.Between(3, 5), Phaser.Math.Between(13, 26), 0x243329, 0.38);
      blade.setRotation(Phaser.Math.FloatBetween(-0.45, 0.45));
      c.add(blade);
    }
    this.worldLayer.add(c);
  }

  private createSubtlePuddleOrOil() {
    const puddle = this.add.ellipse(
      Phaser.Math.Between(-2200, 2200),
      Phaser.Math.Between(-2200, 2200),
      Phaser.Math.Between(42, 120),
      Phaser.Math.Between(16, 48),
      Phaser.Utils.Array.GetRandom([0x05080c, 0x0b161a, 0x15110f]),
      Phaser.Math.FloatBetween(0.18, 0.28),
    );
    puddle.setRotation(Phaser.Math.FloatBetween(-1.2, 1.2));
    this.worldLayer.add(puddle);
  }

  private createUrbanRoad(x: number, y: number, w: number, h: number, vertical: boolean) {
    const road = this.add.rectangle(x, y, w, h, 0x0c131a, 0.9);
    road.setStrokeStyle(2, 0x222b31, 0.22);
    this.worldLayer.add(road);

    const segmentCount = Math.floor((vertical ? h : w) / 260);
    for (let i = -segmentCount; i <= segmentCount; i += 1) {
      const offset = i * 260;
      if (Math.abs(offset) < 150 && (w > 1500 || h > 1500)) continue;
      const stripe = this.add.rectangle(
        x + (vertical ? 0 : offset),
        y + (vertical ? offset : 0),
        vertical ? 10 : 88,
        vertical ? 88 : 10,
        0xa2a19a,
        0.24,
      );
      stripe.setRotation(vertical ? 0 : 0);
      this.worldLayer.add(stripe);
    }

    for (let i = 0; i < Math.floor((w * h) / 140000); i += 1) {
      const crack = this.add.rectangle(
        x + Phaser.Math.Between(-w / 2 + 80, w / 2 - 80),
        y + Phaser.Math.Between(-h / 2 + 80, h / 2 - 80),
        Phaser.Math.Between(38, 150),
        Phaser.Math.Between(3, 8),
        0x020508,
        0.28,
      );
      crack.setRotation(Phaser.Math.FloatBetween(-1.2, 1.2));
      this.worldLayer.add(crack);
    }
  }

  private createSidewalkBand(x: number, y: number, w: number, h: number, vertical: boolean) {
    const band = this.add.rectangle(x, y, w, h, 0x17202a, 0.34);
    band.setStrokeStyle(2, 0x34404a, 0.1);
    this.worldLayer.add(band);
    const edgeA = this.add.rectangle(x + (vertical ? -w / 2 : 0), y + (vertical ? 0 : -h / 2), vertical ? 16 : w, vertical ? h : 16, 0x29333a, 0.4);
    const edgeB = this.add.rectangle(x + (vertical ? w / 2 : 0), y + (vertical ? 0 : h / 2), vertical ? 16 : w, vertical ? h : 16, 0x29333a, 0.34);
    this.worldLayer.add(edgeA);
    this.worldLayer.add(edgeB);
  }

  private createUrbanDistrictDetails() {
    [
      [-2180, -2140, 720, 470],
      [2180, -1980, 650, 520],
      [-2300, 1750, 820, 500],
      [2250, 1900, 780, 540],
      [-2100, 180, 520, 430],
      [2070, 90, 560, 500],
      [-250, -2320, 680, 380],
      [360, 2250, 760, 430],
    ].forEach(([x, y, w, h], index) => this.createRuinedBuilding(x, y, w, h, index % 2 === 0));

    [
      [-1840, -1040], [-520, -1100], [1460, -1030], [-1160, -160], [1030, 560],
      [-1850, 760], [330, 770], [1650, 760], [-1050, 1420], [1090, -1540],
    ].forEach(([x, y], index) => this.createCrosswalkOrMarking(x, y, index % 2 === 0));

    for (let i = 0; i < 36; i += 1) {
      this.createRubbleCluster(Phaser.Math.Between(-2600, 2600), Phaser.Math.Between(-2600, 2600), Phaser.Math.Between(34, 90));
    }

    [
      [-720, -820], [430, -1210], [1540, -620], [-1510, 520], [-420, 1060],
      [1360, 1260], [-1920, -1680], [2100, 1450], [90, 1960], [-2380, 960],
    ].forEach(([x, y], index) => this.createWreckedVehicle(x, y, index % 3 === 0));

    [
      [-1460, -1190], [780, -1040], [-1120, 880], [1080, 920], [-2100, -1680],
      [2100, -1580], [-2190, 2060], [1760, 1940], [50, -1760], [-70, 1660],
    ].forEach(([x, y], index) => this.createGroundedLightSource(x, y, index));

    [
      [-2520, -440, 0], [2450, -820, 1], [-1680, 2190, 2], [1920, 2300, 3],
    ].forEach(([x, y, variant]) => this.createCheckpointDebris(x, y, variant));

    for (let i = 0; i < 22; i += 1) {
      this.createIndustrialCrateStack(Phaser.Math.Between(-2450, 2450), Phaser.Math.Between(-2450, 2450));
    }
  }

  private createRuinedBuilding(x: number, y: number, w: number, h: number, lit: boolean) {
    const floor = this.add.rectangle(x, y, w, h, 0x101820, 0.86).setStrokeStyle(5, 0x29343b, 0.58);
    this.worldLayer.add(floor);
    const inner = this.add.rectangle(x, y, w - 58, h - 58, 0x0a0f14, 0.72).setStrokeStyle(2, 0x3b332a, 0.22);
    this.worldLayer.add(inner);
    for (let i = 0; i < 5; i += 1) {
      const wall = this.add.rectangle(x + Phaser.Math.Between(-w / 2, w / 2), y + Phaser.Math.Between(-h / 2, h / 2), Phaser.Math.Between(70, 180), Phaser.Math.Between(14, 34), 0x303239, 0.62);
      wall.setRotation(Phaser.Math.FloatBetween(-0.4, 0.4));
      this.worldLayer.add(wall);
    }
    if (lit) {
      const wx = x + w * 0.24;
      const wy = y + h * 0.18;
      const roomGlow = this.add.rectangle(wx, wy + 18, 170, 92, 0xc9793b, 0.055);
      roomGlow.setRotation(Phaser.Math.FloatBetween(-0.08, 0.08));
      this.worldLayer.add(roomGlow);
      const windowFrame = this.add.rectangle(wx, wy, 86, 38, 0x15100d, 0.9).setStrokeStyle(3, 0x3a2a1c, 0.78);
      const windowLight = this.add.rectangle(wx, wy, 66, 20, 0xd58a3a, 0.26);
      this.worldLayer.add(windowFrame);
      this.worldLayer.add(windowLight);
    }
  }

  private createCrosswalkOrMarking(x: number, y: number, horizontal: boolean) {
    for (let i = -2; i <= 2; i += 1) {
      const stripe = this.add.rectangle(x + (horizontal ? i * 34 : 0), y + (horizontal ? 0 : i * 34), horizontal ? 18 : 140, horizontal ? 140 : 18, 0xc8c0ad, 0.2);
      stripe.setRotation(Phaser.Math.FloatBetween(-0.02, 0.02));
      this.worldLayer.add(stripe);
    }
  }

  private createRubbleCluster(x: number, y: number, radius: number) {
    for (let i = 0; i < 9; i += 1) {
      const angle = Phaser.Math.FloatBetween(0, Math.PI * 2);
      const dist = Phaser.Math.Between(0, radius);
      const stone = this.add.rectangle(
        x + Math.cos(angle) * dist,
        y + Math.sin(angle) * dist,
        Phaser.Math.Between(10, 34),
        Phaser.Math.Between(7, 24),
        Phaser.Utils.Array.GetRandom([0x27313a, 0x353838, 0x4c4133, 0x1a2329]),
        Phaser.Math.FloatBetween(0.32, 0.62),
      );
      stone.setRotation(Phaser.Math.FloatBetween(-1.4, 1.4));
      this.worldLayer.add(stone);
    }
  }

  private createWreckedVehicle(x: number, y: number, truck: boolean) {
    const c = this.add.container(x, y);
    const bodyColor = truck ? 0x4b3525 : 0x1f2a34;
    c.add(this.add.rectangle(0, 0, truck ? 150 : 112, truck ? 64 : 58, bodyColor, 0.74).setStrokeStyle(4, 0x070b0f, 0.82));
    c.add(this.add.rectangle(truck ? 26 : 18, -8, truck ? 52 : 40, 24, 0x0b1118, 0.72).setStrokeStyle(2, 0x30363a, 0.5));
    c.add(this.add.rectangle(truck ? -48 : -36, 26, 28, 9, 0x06080b, 0.88));
    c.add(this.add.rectangle(truck ? 48 : 36, 26, 28, 9, 0x06080b, 0.88));
    c.setRotation(Phaser.Math.FloatBetween(-0.55, 0.55));
    this.worldLayer.add(c);
  }

  private createGroundedLightSource(x: number, y: number, variant: number) {
    if (variant % 4 === 0) {
      this.createBurningBarrel(x, y);
      return;
    }
    if (variant % 4 === 1) {
      this.createEmergencyGenerator(x, y);
      return;
    }
    this.createDamagedStreetLamp(x, y, variant % 2 === 0);
  }

  private createDamagedStreetLamp(x: number, y: number, broken: boolean) {
    const c = this.add.container(x, y);
    const rotation = Phaser.Math.FloatBetween(-0.18, 0.18);
    const cast = this.add.rectangle(0, 48, broken ? 118 : 150, broken ? 82 : 105, 0xd2a45f, broken ? 0.045 : 0.062);
    cast.setRotation(Phaser.Math.FloatBetween(-0.08, 0.08));
    c.add(cast);
    const pole = this.add.rectangle(28, 26, 8, 126, 0x2a3034, 0.72).setStrokeStyle(1, 0x090d10, 0.7);
    const arm = this.add.rectangle(5, -28, 58, 8, 0x3a3d3a, 0.7).setStrokeStyle(1, 0x0b0e10, 0.68);
    const head = this.add.rectangle(-28, -28, 26, 14, 0x4c4f48, broken ? 0.48 : 0.7).setStrokeStyle(2, 0x0b0e10, 0.85);
    c.add([pole, arm, head]);
    if (!broken) {
      c.add(this.add.rectangle(-28, -20, 15, 4, 0xd8ad67, 0.54));
    } else {
      const hanging = this.add.rectangle(-38, -18, 5, 24, 0x272b2d, 0.62);
      hanging.setRotation(0.35);
      c.add(hanging);
    }
    c.setRotation(rotation);
    this.worldLayer.add(c);
  }

  private createBurningBarrel(x: number, y: number) {
    const c = this.add.container(x, y);
    const cast = this.add.rectangle(0, 18, 132, 86, 0xc25a22, 0.06);
    cast.setRotation(Phaser.Math.FloatBetween(-0.18, 0.18));
    c.add(cast);
    const barrel = this.add.rectangle(0, 18, 36, 46, 0x4b2520, 0.86).setStrokeStyle(3, 0x090b0c, 0.9);
    const rim = this.add.rectangle(0, -5, 39, 9, 0x2b2e2c, 0.88).setStrokeStyle(1, 0x08090a, 0.8);
    const flameA = this.add.triangle(-6, -14, 0, 20, 12, -8, 24, 20, 0xff8a2b, 0.46);
    const flameB = this.add.triangle(7, -11, 0, 18, 9, -12, 18, 18, 0xffd166, 0.32);
    c.add([barrel, rim, flameA, flameB]);
    this.worldLayer.add(c);
  }

  private createEmergencyGenerator(x: number, y: number) {
    const c = this.add.container(x, y);
    const cast = this.add.rectangle(0, 32, 122, 74, 0xb84a32, 0.045);
    cast.setRotation(Phaser.Math.FloatBetween(-0.12, 0.12));
    c.add(cast);
    const base = this.add.rectangle(0, 14, 78, 42, 0x343a36, 0.82).setStrokeStyle(3, 0x070b0d, 0.9);
    const tank = this.add.rectangle(-22, 2, 30, 22, 0x5b3325, 0.82).setStrokeStyle(2, 0x16100d, 0.8);
    const lamp = this.add.rectangle(27, -10, 18, 14, 0x7b2922, 0.84).setStrokeStyle(2, 0x100b0a, 0.86);
    const litPanel = this.add.rectangle(27, -10, 9, 5, 0xff6b45, 0.52);
    c.add([base, tank, lamp, litPanel]);
    c.setRotation(Phaser.Math.FloatBetween(-0.35, 0.35));
    this.worldLayer.add(c);
  }

  private createCheckpointDebris(x: number, y: number, variant: number) {
    const c = this.add.container(x, y);
    c.add(this.add.rectangle(0, 0, 150, 24, 0x4a4437, 0.72).setStrokeStyle(2, 0x0d1010, 0.82));
    c.add(this.add.rectangle(-58, 28, 34, 44, 0x302f2a, 0.74).setStrokeStyle(2, 0x0a0d0d, 0.74));
    c.add(this.add.rectangle(58, 27, 34, 42, 0x302f2a, 0.72).setStrokeStyle(2, 0x0a0d0d, 0.74));
    if (variant % 2 === 0) {
      c.add(this.add.rectangle(0, -27, 92, 10, 0x8f3328, 0.58).setStrokeStyle(1, 0x130c0b, 0.8));
    } else {
      c.add(this.add.rectangle(0, -30, 86, 12, 0xc0a45a, 0.5).setStrokeStyle(1, 0x17140d, 0.8));
    }
    c.setRotation(Phaser.Math.FloatBetween(-0.45, 0.45));
    this.worldLayer.add(c);
  }

  private createIndustrialCrateStack(x: number, y: number) {
    const c = this.add.container(x, y);
    const count = Phaser.Math.Between(2, 5);
    for (let i = 0; i < count; i += 1) {
      const box = this.add.rectangle((i % 2) * 44, Math.floor(i / 2) * 34, 38, 30, Phaser.Utils.Array.GetRandom([0x4a3a28, 0x3d4744, 0x5b3325]), 0.56);
      box.setStrokeStyle(2, 0x0a0e10, 0.72);
      c.add(box);
    }
    c.setRotation(Phaser.Math.FloatBetween(-0.5, 0.5));
    this.worldLayer.add(c);
  }

  private createUrbanBoundary() {
    for (let i = 0; i < 4; i += 1) {
      const horizontal = i < 2;
      const sign = i % 2 === 0 ? -1 : 1;
      const wall = this.add.rectangle(
        horizontal ? 0 : sign * 2860,
        horizontal ? sign * 2860 : 0,
        horizontal ? 5800 : 180,
        horizontal ? 180 : 5800,
        0x070b0f,
        0.56,
      );
      wall.setStrokeStyle(4, 0x2b211a, 0.32);
      this.worldLayer.add(wall);
      for (let step = -2700; step <= 2700; step += 360) {
        const x = horizontal ? step + Phaser.Math.Between(-70, 70) : sign * Phaser.Math.Between(2620, 2820);
        const y = horizontal ? sign * Phaser.Math.Between(2620, 2820) : step + Phaser.Math.Between(-70, 70);
        this.createBoundaryRemnant(x, y, horizontal ? 0 : Math.PI / 2);
      }
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

    c.add(this.add.ellipse(0, 26, 46, 14, 0x000000, 0.28));
    const character = this.add.sprite(0, 39, PLAYER_CHARACTER_TEXTURE_KEYS[this.selectedCharacter]).setOrigin(0.5, 1);
    character.setScale(this.selectedCharacter === 'heavy' ? 0.23 : 0.215);
    const leftLeg = px(-7, 27, 7, 15, 0x211b2a).setAlpha(0);
    const rightLeg = px(8, 27, 7, 15, 0x211b2a).setAlpha(0);
    const gun = this.add.container(20, 7);
    const gunFallback = this.add.container(0, 0);
    gunFallback.add(px(6, 0, 23, 7, 0x343545));
    gunFallback.add(px(20, 0, 12, 4, 0x111722));
    gunFallback.add(px(-2, 5, 7, 9, 0x1b202b));
    const gunSprite = this.add.image(0, 0, WEAPON_SPRITE_KEYS.pistol).setOrigin(0.18, 0.52);
    gun.add([gunFallback, gunSprite]);

    const hpBar = this.add.container(0, 44).setAlpha(0);
    const hpShadow = this.add.rectangle(0, 0, 50, 8, 0x000000, 0.45).setOrigin(0.5);
    const hpBack = this.add.rectangle(0, 0, 46, 5, 0x090d13, 0.86).setOrigin(0.5).setStrokeStyle(1, 0x151b24, 0.9);
    const hpFill = this.add.rectangle(-22, 0, 44, 3, 0xd9373f, 0.92).setOrigin(0, 0.5);
    hpBar.add([hpShadow, hpBack, hpFill]);
    c.add([leftLeg, rightLeg, character, gun, hpBar]);
    this.worldLayer.add(c);
    this.playerCharacterSprite = character;
    this.playerGun = gun;
    this.playerGunSprite = gunSprite;
    this.playerGunFallback = gunFallback;
    this.playerLegs = [leftLeg, rightLeg];
    this.playerHpBar = hpBar;
    this.playerHpBarFill = hpFill;
    return c;
  }

  private createPlayerRollAnimations() {
    (Object.keys(PLAYER_ROLL_TEXTURE_KEYS) as CharacterId[]).forEach((id) => {
      const key = PLAYER_ROLL_ANIM_KEYS[id];
      if (this.anims.exists(key)) return;
      this.anims.create({
        key,
        frames: this.anims.generateFrameNumbers(PLAYER_ROLL_TEXTURE_KEYS[id], { start: 0, end: 5 }),
        frameRate: 18,
        repeat: 0,
      });
    });
  }

  private createEnemyRunAnimations() {
    (Object.keys(ENEMY_RUN_SPRITE_KEYS) as EnemyType[]).forEach((type) => {
      const key = ENEMY_RUN_ANIM_KEYS[type];
      if (this.anims.exists(key)) return;
      const frameRate = type === 'runner' || type === 'exploder'
        ? 12
        : type === 'bossTitan' || type === 'bossGunner' || type === 'brute' || type === 'shielder'
          ? 7
          : 9;
      this.anims.create({
        key,
        frames: this.anims.generateFrameNumbers(ENEMY_RUN_SPRITE_KEYS[type], { start: 0, end: 5 }),
        frameRate,
        repeat: -1,
      });
    });
  }

  private createEnemy(type: EnemyType, pos: Vec2): Enemy {
    const late = Math.max(0, this.wave - 6);
    const scale = 1 + Math.min(3.4, this.wave * 0.12 + late * 0.055);
    const speedBonus = Math.min(74, this.wave * 3.4 + late * 1.7);
    const normalSpeedBonus = speedBonus * (this.wave > 10 ? 0.86 : 1);
    const bossTier = this.getBossTier();
    const firstBoss = (type === 'bossTitan' || type === 'bossGunner') && this.wave === FIRST_BOSS_WAVE;
    const bossPower = type === 'bossTitan' || type === 'bossGunner' ? (1 + Math.max(0, bossTier - 1) * 0.42) * (firstBoss ? 0.9 : 1) : 1;
    const bossTempo = type === 'bossTitan' || type === 'bossGunner' ? (1 + Math.max(0, bossTier - 1) * 0.2) * (firstBoss ? 0.92 : 1) : 1;
    const bossHpMul = firstBoss ? 0.72 : 1;
    const bossSpeedMul = firstBoss ? 0.92 : 1;
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
    const visual = ENEMY_VISUALS[type];
    const runTextureKey = ENEMY_RUN_SPRITE_KEYS[type];
    const textureKey = this.textures.exists(runTextureKey) ? runTextureKey : ENEMY_SPRITE_KEYS[type];
    if (visual && this.textures.exists(textureKey)) {
      const boss = type === 'bossTitan' || type === 'bossGunner';
      const shadow = this.add.ellipse(0, visual.y + 5, visual.shadowW, visual.shadowH, 0x000000, boss ? 0.34 : 0.28);
      const sprite = this.add.sprite(0, visual.y, textureKey).setOrigin(0.5, 1).setDisplaySize(visual.width, visual.height);
      const animKey = ENEMY_RUN_ANIM_KEYS[type];
      if (this.anims.exists(animKey)) sprite.play(animKey);
      sprite.setData('enemySprite', true);
      c.add([shadow, sprite]);
      c.setData('spriteVisual', sprite);
      c.setData('baseLean', type === 'runner' ? -0.12 : type === 'brute' || type === 'bossTitan' ? 0.02 : 0);
      return c;
    }

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
        this.finishPlayerRollAnimation();
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
    this.updatePlayerWeaponVisual();
    const activeWeapon = this.getActiveWeapon();
    const visual = activeWeapon ? WEAPONS[activeWeapon.id].visual : WEAPON_VISUALS.pistol;
    const meleePose = this.getMeleeWeaponPose(activeWeapon?.id, angle, facing);
    const baseRotation = facing === -1 ? Math.PI - angle : angle + (visual.rotationOffset ?? 0);
    this.playerGun.setRotation(baseRotation + meleePose.rotation);
    this.playerGun.setPosition(
      visual.handOffsetX - this.gunRecoil + meleePose.x,
      visual.handOffsetY + (this.firing && this.rollTimer <= 0 ? -1 : 0) + meleePose.y,
    );
    this.playerGun.setScale(meleePose.scaleX, meleePose.scaleY);
    this.playerGun.setVisible(this.rollTimer <= 0);
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

  private updatePlayerWeaponVisual(force = false) {
    const activeWeapon = this.getActiveWeapon();
    const weaponId = activeWeapon?.id ?? 'pistol';
    if (!force && this.lastWeaponVisualId === weaponId) return;
    this.lastWeaponVisualId = weaponId;
    const weapon = WEAPONS[weaponId] ?? WEAPONS.pistol;
    const visual = weapon.visual ?? WEAPON_VISUALS.pistol;
    const textureKey = WEAPON_SPRITE_KEYS[weaponId] ?? WEAPON_SPRITE_KEYS[visual.spriteKey] ?? WEAPON_SPRITE_KEYS.pistol;
    if (this.textures.exists(textureKey)) {
      this.playerGunSprite.setTexture(textureKey);
      this.playerGunSprite.setDisplaySize(visual.width, visual.height);
      this.playerGunSprite.setVisible(true);
      this.playerGunFallback.setVisible(false);
    } else {
      this.playerGunSprite.setVisible(false);
      this.playerGunFallback.setVisible(!weapon.melee);
    }
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
    this.playPlayerRollAnimation();
    this.rollStartFx();
  }

  private playPlayerRollAnimation() {
    if (!this.playerCharacterSprite) return;
    const textureKey = PLAYER_ROLL_TEXTURE_KEYS[this.selectedCharacter];
    const animKey = PLAYER_ROLL_ANIM_KEYS[this.selectedCharacter];
    if (!this.textures.exists(textureKey) || !this.anims.exists(animKey)) return;
    this.playerCharacterSprite.setTexture(textureKey, 0);
    this.playerCharacterSprite.play(animKey, true);
  }

  private finishPlayerRollAnimation() {
    if (!this.playerCharacterSprite) return;
    this.playerCharacterSprite.stop();
    this.playerCharacterSprite.setTexture(PLAYER_CHARACTER_TEXTURE_KEYS[this.selectedCharacter]);
    this.playerCharacterSprite.setScale(this.selectedCharacter === 'heavy' ? 0.23 : 0.215);
    this.playerGun?.setVisible(true);
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
    return this.equippedWeapons.find((weapon) => weapon.id === id)?.slot ?? 'primary';
  }

  private getEquippedSlot(slot: WeaponSlot) {
    return this.equippedWeapons.find((weapon) => weapon.slot === slot);
  }

  private getActiveWeapon() {
    return this.getEquippedSlot(this.activeWeaponSlot) ?? this.equippedWeapons[0];
  }

  private switchWeaponSlot(slot: WeaponSlot) {
    if (this.inLobby || this.selectingWeapon || this.leveling || this.paused || this.gameOver) return;
    const weapon = this.getEquippedSlot(slot);
    if (!weapon) {
      this.popText(this.playerPos, `${WEAPON_SLOT_LABELS[slot].toUpperCase()} EMPTY`, '#8495a4');
      return;
    }
    this.activeWeaponSlot = slot;
    this.updatePlayerWeaponVisual(true);
    this.popText(this.playerPos, WEAPON_SLOT_LABELS[slot].toUpperCase(), '#ffd166');
    this.updateHud();
  }

  private getMeleeWeaponPose(activeId: WeaponId | undefined, aimAngle: number, facing: number) {
    if (!this.meleeAttack || this.meleeAttack.weaponId !== activeId) return { rotation: 0, x: 0, y: 0, scaleX: 1, scaleY: 1 };
    const weapon = WEAPONS[this.meleeAttack.weaponId];
    const melee = weapon.melee;
    if (!melee) return { rotation: 0, x: 0, y: 0, scaleX: 1, scaleY: 1 };
    const windupEnd = melee.windup;
    const activeEnd = windupEnd + melee.active;
    const elapsed = this.meleeAttack.elapsed;
    const side = facing === -1 ? -1 : 1;
    const variantSide = this.meleeAttack.variant % 2 === 0 ? 1 : -1;
    let rotation = 0;
    let x = 0;
    let y = 0;
    let scaleX = 1;
    let scaleY = 1;

    if (melee.mode === 'swingArc') {
      if (elapsed < windupEnd) {
        const t = Phaser.Math.Easing.Quadratic.Out(elapsed / windupEnd);
        rotation = -0.72 * t * side;
        x = -8 * t;
        y = -4 * t;
      } else if (elapsed < activeEnd) {
        const t = Phaser.Math.Easing.Cubic.Out((elapsed - windupEnd) / melee.active);
        rotation = Phaser.Math.Linear(-0.72, 0.86, t) * side;
        x = Phaser.Math.Linear(-8, 10, t);
        y = Phaser.Math.Linear(-4, 3, t);
      } else {
        const t = Phaser.Math.Easing.Quadratic.Out((elapsed - activeEnd) / melee.recovery);
        rotation = Phaser.Math.Linear(0.86, 0, t) * side;
        x = Phaser.Math.Linear(10, 0, t);
        y = Phaser.Math.Linear(3, 0, t);
      }
    } else if (melee.mode === 'quickSlash') {
      if (elapsed < windupEnd) {
        const t = elapsed / windupEnd;
        rotation = -0.24 * t * side * variantSide;
        x = -4 * t;
      } else if (elapsed < activeEnd) {
        const t = Phaser.Math.Easing.Cubic.Out((elapsed - windupEnd) / melee.active);
        rotation = Phaser.Math.Linear(-0.24, 0.34, t) * side * variantSide;
        x = Phaser.Math.Linear(-4, 8, t);
        y = variantSide * 2 * Math.sin(t * Math.PI);
      } else {
        const t = (elapsed - activeEnd) / melee.recovery;
        rotation = Phaser.Math.Linear(0.34, 0, t) * side * variantSide;
        x = Phaser.Math.Linear(8, 0, t);
      }
    } else {
      const active = elapsed >= windupEnd && elapsed < activeEnd;
      const buzz = active ? Math.sin(this.elapsed * 88) : 0;
      if (elapsed < windupEnd) {
        const t = elapsed / windupEnd;
        rotation = -0.18 * t * side;
        x = -5 * t;
      } else if (active) {
        rotation = (0.08 + buzz * 0.035) * side;
        x = 4 + buzz * 1.6;
        y = buzz * 1.2;
        scaleX = 1 + Math.abs(buzz) * 0.02;
      } else {
        const t = (elapsed - activeEnd) / melee.recovery;
        rotation = Phaser.Math.Linear(0.08, 0, t) * side;
        x = Phaser.Math.Linear(4, 0, t);
      }
    }
    return { rotation, x, y, scaleX, scaleY };
  }

  private updateShooting(dt: number) {
    this.equippedWeapons.forEach((slot) => (slot.cooldown = Math.max(0, slot.cooldown - dt)));
    this.updateMeleeAttack(dt);
    if (this.rollTimer > 0) return;
    if (!this.firing) return;
    const angle = Phaser.Math.Angle.Between(this.playerPos.x, this.playerPos.y, this.aim.x, this.aim.y);
    const slot = this.getActiveWeapon();
    if (!slot || slot.cooldown > 0) return;
    const weapon = WEAPONS[slot.id];
    const baseWeapon = WEAPONS[this.selectedWeapon];
    const tierDamage = 1 + (slot.level - 1) * 0.16;
    const tierFireRate = 1 + (slot.level - 1) * 0.08;
    if (weapon.melee) {
      if (this.meleeAttack) return;
      const speedMul = tierFireRate * (this.stats.fireRate / baseWeapon.fireRate);
      const animationTime = weapon.melee.windup + weapon.melee.active + weapon.melee.recovery;
      slot.cooldown = animationTime / Math.max(0.45, speedMul);
      const damage = this.stats.damage * (weapon.damage / baseWeapon.damage) * tierDamage * (slot.evolved ? 1.18 : 1);
      this.startMeleeAttack(angle, weapon, damage, slot.evolved);
      this.sfx.playWeaponShot(slot.id);
      this.gunRecoil = weapon.melee.recoil;
      return;
    }
    slot.cooldown = 1 / (weapon.fireRate * tierFireRate * (this.stats.fireRate / baseWeapon.fireRate));
    const shots = this.getWeaponShotAngles(angle, weapon, slot.evolved);
    if (this.stats.doubleShot > 0) shots.push(...shots.map((shot) => shot + 0.055));
    const damage = this.stats.damage * (weapon.damage / baseWeapon.damage) * tierDamage * (slot.evolved ? 1.18 : 1);
    shots.forEach((shotAngle) => this.spawnBullet(shotAngle, 'player', { damage }, weapon, slot.evolved));
    this.muzzleFx(angle, weapon);
    this.shellFx(angle, weapon);
    this.sfx.playWeaponShot(slot.id);
    this.gunRecoil = weapon.id === 'shotgun' || weapon.id === 'launcher' || weapon.id === 'railgun' ? 13 : weapon.id === 'smg' || weapon.id === 'minigun' ? 4 : 7;
    this.shake(35, weapon.shake);
  }

  private startMeleeAttack(angle: number, weapon: WeaponProfile, damage: number, evolved = false) {
    if (!weapon.melee) return;
    this.meleeAttack = {
      weaponId: weapon.id,
      angle,
      damage,
      evolved,
      elapsed: 0,
      activeStarted: false,
      tickTimer: 0,
      hitIds: new Set<number>(),
      variant: this.meleeVariant++,
    };
    this.gunRecoil = weapon.melee.recoil;
    if (weapon.melee.mode === 'continuousCone') this.shake(30, weapon.shake * 0.6);
  }

  private updateMeleeAttack(dt: number) {
    if (!this.meleeAttack) return;
    const attack = this.meleeAttack;
    const weapon = WEAPONS[attack.weaponId];
    const melee = weapon.melee;
    if (!melee) {
      this.meleeAttack = null;
      return;
    }
    attack.elapsed += dt;
    const activeStart = melee.windup;
    const activeEnd = activeStart + melee.active;
    const total = activeEnd + melee.recovery;
    if (attack.elapsed >= activeStart && attack.elapsed <= activeEnd) {
      if (!attack.activeStarted) {
        attack.activeStarted = true;
        this.meleeSwingFx(attack.angle, weapon, attack.variant);
        if (melee.mode !== 'continuousCone') this.resolveMeleeHit(attack, weapon);
      }
      if (melee.mode === 'continuousCone') {
        attack.tickTimer -= dt;
        if (attack.tickTimer <= 0) {
          attack.tickTimer = melee.tick;
          this.resolveMeleeHit(attack, weapon);
          this.meleeSwingFx(attack.angle, weapon, attack.variant);
        }
      }
    }
    if (attack.elapsed >= total || (melee.mode === 'continuousCone' && !this.firing && attack.elapsed >= activeStart + 0.08)) {
      this.meleeAttack = null;
      this.playerGun.setScale(1, 1);
    }
  }

  private resolveMeleeHit(attack: MeleeAttackState, weapon: WeaponProfile) {
    if (!weapon.melee) return;
    const melee = weapon.melee;
    const hits = this.enemies
      .filter((enemy) => {
        if (enemy.hp <= 0) return false;
        if (melee.mode !== 'continuousCone' && attack.hitIds.has(enemy.id)) return false;
        const dx = enemy.pos.x - this.playerPos.x;
        const dy = enemy.pos.y - this.playerPos.y;
        const dist = Math.hypot(dx, dy);
        if (dist > melee.range + enemy.radius) return false;
        const enemyAngle = Math.atan2(dy, dx);
        const diff = Math.abs(Phaser.Math.Angle.Wrap(enemyAngle - attack.angle));
        const closeGrace = melee.mode === 'quickSlash' ? 22 : melee.mode === 'continuousCone' ? 30 : 42;
        return diff <= melee.arc / 2 || dist < closeGrace + enemy.radius;
      })
      .sort((a, b) => Phaser.Math.Distance.Between(this.playerPos.x, this.playerPos.y, a.pos.x, a.pos.y) - Phaser.Math.Distance.Between(this.playerPos.x, this.playerPos.y, b.pos.x, b.pos.y))
      .slice(0, melee.maxTargets);

    hits.forEach((enemy, index) => {
      attack.hitIds.add(enemy.id);
      const crit = Math.random() < this.stats.critChance;
      const armorMul = enemy.type === 'bossTitan' ? 0.48 : enemy.type === 'bossGunner' ? 0.52 : enemy.type === 'gunner' ? 0.62 : enemy.type === 'spitter' ? 0.86 : 1;
      const falloff = weapon.id === 'combatKnife' ? 1 : Math.max(0.72, 1 - index * 0.045);
      const finalDamage = attack.damage * falloff * (crit ? this.stats.critDamage : 1) * armorMul;
      enemy.hp -= finalDamage;
      enemy.hitFlash = weapon.id === 'chainsawMachete' ? 0.045 : 0.075;
      const pushAngle = Math.atan2(enemy.pos.y - this.playerPos.y, enemy.pos.x - this.playerPos.x);
      const bossMul = enemy.type === 'bossTitan' || enemy.type === 'bossGunner' ? 0.08 : enemy.type === 'brute' ? 0.24 : 0.46;
      enemy.vel.x += Math.cos(pushAngle) * weapon.knockback * bossMul * 420;
      enemy.vel.y += Math.sin(pushAngle) * weapon.knockback * bossMul * 420;
      if (this.stats.fire) enemy.burn = Math.max(enemy.burn, 2.2);
      if (crit && this.stats.critBurn > 0) enemy.burn = Math.max(enemy.burn, 2.8);
      if (this.stats.poison) enemy.poison = Math.max(enemy.poison, 3);
      if (this.stats.freeze) enemy.freeze = Math.max(enemy.freeze, 1.1);
      const hitPos = {
        x: this.playerPos.x + Math.cos(pushAngle) * Math.min(melee.range, Phaser.Math.Distance.Between(this.playerPos.x, this.playerPos.y, enemy.pos.x, enemy.pos.y)),
        y: this.playerPos.y + Math.sin(pushAngle) * Math.min(melee.range, Phaser.Math.Distance.Between(this.playerPos.x, this.playerPos.y, enemy.pos.x, enemy.pos.y)),
      };
      if (this.shouldSpawnDamageNumber()) this.damageNumber(enemy.pos, Math.round(finalDamage));
      this.bloodHitFx(hitPos, pushAngle, weapon.id === 'chainsawMachete' ? 4 : weapon.id === 'baseballBat' ? 8 : 3);
      if (weapon.id === 'chainsawMachete' && this.shouldSpawnFx(1.3)) this.pixelSparkDirected(hitPos, pushAngle + Phaser.Math.FloatBetween(-0.7, 0.7), Phaser.Math.Between(22, 48), 0xff8a42, 3);
      else if (this.shouldSpawnFx(1.35)) this.impactFx(hitPos, pushAngle);
      this.applyHitStop(melee.hitStop);
      this.shake(weapon.id === 'baseballBat' ? 55 : weapon.id === 'chainsawMachete' ? 22 : 18, weapon.shake);
      if (this.stats.explosive > 0 && Math.random() < 0.08) this.explosion(enemy.pos, 62, attack.damage * 0.34);
      if (this.stats.chain > 0 && Math.random() < 0.12) this.chainLightning(enemy);
      if (this.stats.lifesteal > 0 && enemy.hp <= 0) this.hp = Math.min(this.maxHp, this.hp + 1.2 * this.stats.lifesteal);
    });
  }

  private meleeSwingFx(angle: number, weapon: WeaponProfile, variant = 0) {
    const melee = weapon.melee;
    if (!melee || !this.shouldSpawnFx(weapon.id === 'chainsawMachete' ? 1.5 : 1.05)) return;
    const origin = {
      x: this.playerPos.x + Math.cos(angle) * (melee.range * 0.48),
      y: this.playerPos.y + Math.sin(angle) * (melee.range * 0.48),
    };
    const color = weapon.id === 'baseballBat' ? 0xd19a55 : weapon.id === 'combatKnife' ? 0xd8d2be : 0xff6b45;
    const trail = this.add.graphics();
    trail.setPosition(this.playerPos.x, this.playerPos.y);
    const start = angle - melee.arc * 0.5;
    const end = angle + melee.arc * 0.5;
    if (melee.mode === 'swingArc') {
      trail.lineStyle(16, color, 0.24);
      trail.beginPath();
      trail.arc(0, 0, melee.range * 0.72, start, end, false);
      trail.strokePath();
      trail.lineStyle(5, 0xffe1a1, 0.18);
      trail.beginPath();
      trail.arc(0, 0, melee.range * 0.84, start + 0.1, end - 0.08, false);
      trail.strokePath();
    } else if (melee.mode === 'quickSlash') {
      const side = variant % 2 === 0 ? 1 : -1;
      const slashAngle = angle + side * melee.arc * 0.35;
      trail.lineStyle(5, color, 0.36);
      trail.beginPath();
      trail.moveTo(Math.cos(slashAngle - 0.28) * 24, Math.sin(slashAngle - 0.28) * 24);
      trail.lineTo(Math.cos(slashAngle) * melee.range, Math.sin(slashAngle) * melee.range);
      trail.strokePath();
      trail.lineStyle(2, 0xffffff, 0.28);
      trail.beginPath();
      trail.moveTo(Math.cos(slashAngle - 0.18) * 34, Math.sin(slashAngle - 0.18) * 34);
      trail.lineTo(Math.cos(slashAngle) * (melee.range + 8), Math.sin(slashAngle) * (melee.range + 8));
      trail.strokePath();
    } else {
      trail.fillStyle(color, 0.13);
      trail.slice(0, 0, melee.range, start, end, false);
      trail.fillPath();
      trail.lineStyle(5, 0xffd166, 0.22);
      for (let i = 0; i < 3; i += 1) {
        const jitter = Phaser.Math.FloatBetween(-0.12, 0.12);
        trail.beginPath();
        trail.moveTo(Math.cos(angle + jitter) * 28, Math.sin(angle + jitter) * 28);
        trail.lineTo(Math.cos(angle + jitter) * melee.range, Math.sin(angle + jitter) * melee.range);
        trail.strokePath();
      }
    }
    this.fxLayer.add(trail);
    this.trackTransientFx(trail);
    this.tweens.add({
      targets: trail,
      alpha: 0,
      duration: weapon.id === 'combatKnife' ? 70 : weapon.id === 'chainsawMachete' ? 58 : 135,
      onComplete: () => trail.destroy(),
    });
    if (weapon.id === 'chainsawMachete') {
      for (let i = 0; i < 2; i += 1) {
        const sparkPos = { x: origin.x + Phaser.Math.Between(-16, 16), y: origin.y + Phaser.Math.Between(-16, 16) };
        this.pixelSparkDirected(sparkPos, angle + Phaser.Math.FloatBetween(-0.45, 0.45), Phaser.Math.Between(28, 58), 0xffd166, 3);
      }
    }
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

  private applyHitStop(amount: number) {
    if (amount <= 0 || this.hitStopCooldown > 0 || this.getChaosLevel() > 0.72) return;
    this.hitStop = Math.max(this.hitStop, Math.min(amount * this.getEffectScale(), 0.045));
    this.hitStopCooldown = 0.045;
  }

  private shouldSpawnFx(weight = 1) {
    if (this.transientFx.length >= this.getTransientFxLimit()) return false;
    return Math.random() < this.getEffectScale() / weight;
  }

  private shouldSpawnDamageNumber() {
    if (this.transientFx.length > this.getTransientFxLimit() * 0.72) return false;
    const chaos = this.getChaosLevel();
    const weight = chaos > 0.82 ? 8 : chaos > 0.62 ? 4.5 : this.enemies.length > 120 ? 2.8 : 1.6;
    return this.shouldSpawnFx(weight);
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
    const heavyFx = this.transientFx.length > this.getTransientFxLimit() * 0.8 || this.groundHazards.length > this.getHazardLimit() * 0.8 || this.bullets.length > MAX_ACTIVE_BULLETS * 0.82 || this.updateCostMsSmoothed > 13;
    if (fps < 38 || heavyFx) this.fxQuality = Math.max(0.24, this.fxQuality - 0.14);
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
    while (this.bullets.length >= MAX_ACTIVE_BULLETS) {
      const oldest = this.bullets.shift();
      if (oldest?.body.active) oldest.body.destroy();
    }
    const speed = 720 * this.stats.bulletSpeed * (owner === 'player' ? weapon.bulletSpeed : 1);
    const spawn = owner === 'player'
      ? this.getPlayerMuzzlePosition(angle, weapon)
      : { x: this.playerPos.x + Math.cos(angle) * 30, y: this.playerPos.y + Math.sin(angle) * 30 };
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
      poison: overrides.poison ?? this.stats.poison + (weapon.id === 'smg' ? 1 + Number(evolved) : 0),
      freeze: overrides.freeze ?? this.stats.freeze,
      pierce: overrides.pierce ?? this.stats.pierce + (weapon.id === 'railgun' ? 4 + Number(evolved) * 2 : 0),
      ricochet: overrides.ricochet ?? this.stats.ricochet + (STARTING_WEAPONS.includes(weapon.id) && evolved ? 2 : 0) + (weapon.id === 'dualPistols' ? 1 : 0),
      explosive: overrides.explosive ?? (this.stats.explosive > 0 || weapon.id === 'launcher' || (weapon.id === 'shotgun' && evolved) || weapon.id === 'plasma'),
      chain: overrides.chain ?? (this.stats.chain > 0 || weapon.id === 'lightningCannon' || (weapon.id === 'railgun' && evolved)),
      knockback: overrides.knockback ?? (owner === 'player' ? weapon.knockback + this.stats.knockback * 0.35 + (weapon.id === 'shotgun' ? 0.35 : 0) : 0.8),
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
        this.showCampShop();
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
    this.waveStartCoins = this.coins;
    this.waveEarnedXp = 0;
    this.medkitsDroppedThisWave = 0;
    this.medkitDropAttemptsThisWave = 0;
    if (this.isBossWave()) {
      this.specialWave = 'none';
      this.nextSpecialWave = 'none';
      this.applySpecialWaveAtmosphere();
      this.wavePhase = 'bossWarning';
      this.waveTimer = 2.5;
      this.waveSpawned = 0;
      this.waveTarget = 1;
      this.encounterQueue = [];
      this.spawnCooldown = 999;
      this.firing = false;
      this.popText(this.playerPos, `WAVE ${this.wave} - BOSS INCOMING`, '#ff3b32');
      this.shake(550, 0.008);
      return;
    }
    this.specialWave = this.rollSpecialWave();
    this.nextSpecialWave = 'none';
    this.applySpecialWaveAtmosphere();
    this.wavePhase = 'active';
    this.waveSpawned = 0;
    this.waveTarget = this.getWaveEnemyCount();
    this.encounterArchetype = this.rollEncounterArchetype();
    this.encounterQueue = this.buildEncounterQueue(this.waveTarget);
    this.spawnCooldown = 0.25;
    if (this.specialWave === 'none') {
      this.popText(this.playerPos, `WAVE ${this.wave} - ${this.getEncounterLabel()}`, '#ffd166');
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
    if (this.wave === FIRST_BOSS_WAVE) return 1;
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
    this.wavePrepUpgradeGranted = false;
    this.firing = false;
    this.shopOffers = [];
    this.shopRerollsThisPrep = 0;
    this.medkitDrops.forEach((drop) => drop.body.destroy());
    this.medkitDrops = [];
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
    return wave === FIRST_BOSS_WAVE;
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
    if (this.encounterQueue.length > 0) {
      const planned = this.encounterQueue.shift()!;
      if (this.canSpawnPlannedEnemy(planned)) return planned;
      const replacement = this.findPlannedReplacement(planned);
      if (replacement) return replacement;
    }
    return this.pickFallbackEnemyType();
  }

  private rollEncounterArchetype(): EncounterArchetype {
    if (this.specialWave === 'night') return 'swarm';
    if (this.specialWave === 'elite') return 'shieldedElite';
    if (this.specialWave === 'gunnerRaid') return 'rangedPressure';
    if (this.specialWave === 'burning' || this.specialWave === 'fog') return 'hazardAmbush';
    if (this.specialWave === 'toxic') return 'supportPressure';
    if (this.wave < 3) return 'intro';
    if (this.wave % 4 === 0) return 'swarm';
    if (this.wave % 5 === 4) return 'breather';
    if (this.wave >= 8 && this.wave % 3 === 0) return 'shieldedElite';
    if (this.wave >= 9 && this.wave % 3 === 1) return 'rangedPressure';
    if (this.wave >= 7 && this.wave % 3 === 2) return 'supportPressure';
    return 'mixed';
  }

  private getEncounterLabel() {
    const labels: Record<EncounterArchetype, string> = {
      intro: 'CONTACT',
      swarm: 'SWARM',
      breather: 'REGROUP',
      mixed: 'MIXED HORDE',
      supportPressure: 'PRESSURE ZONES',
      shieldedElite: 'ARMORED PUSH',
      rangedPressure: 'RAID',
      hazardAmbush: 'AMBUSH',
    };
    return labels[this.encounterArchetype];
  }

  private buildEncounterQueue(target: number): EnemyType[] {
    const counts = this.getEncounterComposition(target);
    const queue: EnemyType[] = [];
    Object.entries(counts).forEach(([type, count]) => {
      for (let i = 0; i < count; i += 1) queue.push(type as EnemyType);
    });
    while (queue.length < target) queue.push(this.getDefaultFillerEnemy());
    if (queue.length > target) queue.length = target;
    const early = queue.splice(0, Math.min(queue.length, Math.ceil(target * 0.16)));
    Phaser.Utils.Array.Shuffle(queue);
    return [...early, ...queue];
  }

  private getEncounterComposition(target: number): Partial<Record<EnemyType, number>> {
    const c: Partial<Record<EnemyType, number>> = {};
    const add = (type: EnemyType, ratio: number, min = 0, max = Infinity) => {
      if (!this.enemyUnlocked(type)) return;
      const count = Phaser.Math.Clamp(Math.round(target * ratio), min, max);
      if (count > 0) c[type] = (c[type] ?? 0) + count;
    };
    if (this.encounterArchetype === 'intro') {
      add('walker', 0.82, target);
      return c;
    }
    if (this.encounterArchetype === 'swarm') {
      add('walker', this.specialWave === 'night' ? 0.58 : 0.46);
      add('runner', this.specialWave === 'night' ? 0.36 : 0.42);
      add('exploder', this.specialWave === 'night' ? 0.06 : 0.08, 0, this.wave >= 8 ? 7 : 4);
      add('spitter', 0.04, 0, 2);
      return c;
    }
    if (this.encounterArchetype === 'breather') {
      add('walker', 0.48);
      add('runner', 0.22);
      add('brute', 0.12, 0, 4);
      add('spitter', 0.07, 0, 2);
      add('shielder', 0.05, 0, 1);
      return c;
    }
    if (this.encounterArchetype === 'shieldedElite') {
      add('walker', 0.28);
      add('runner', 0.18);
      add('brute', this.specialWave === 'elite' ? 0.34 : 0.2, 1, this.specialWave === 'elite' ? 10 : 6);
      add('shielder', 0.15, 1, this.wave >= 14 ? 5 : 3);
      add('screamer', 0.05, 0, this.wave >= 15 ? 2 : 1);
      add('gunner', 0.06, 0, 2);
      return c;
    }
    if (this.encounterArchetype === 'rangedPressure') {
      add('walker', 0.26);
      add('runner', 0.24);
      add('gunner', this.specialWave === 'gunnerRaid' ? 0.2 : 0.12, 1, this.wave >= 14 ? 5 : 3);
      add('spitter', this.specialWave === 'gunnerRaid' ? 0.16 : 0.1, 1, this.wave >= 14 ? 5 : 3);
      add('shielder', 0.08, 0, 2);
      add('brute', 0.08, 0, 3);
      return c;
    }
    if (this.encounterArchetype === 'hazardAmbush') {
      add('walker', 0.34);
      add('runner', 0.32);
      add('exploder', this.specialWave === 'burning' ? 0.18 : 0.11, 1, this.wave >= 12 ? 8 : 5);
      add('spitter', this.specialWave === 'fog' ? 0.08 : 0.04, 0, 3);
      add('brute', 0.08, 0, 3);
      return c;
    }
    if (this.encounterArchetype === 'supportPressure') {
      add('walker', 0.3);
      add('runner', 0.26);
      add('spitter', this.specialWave === 'toxic' ? 0.18 : 0.12, 1, this.wave >= 14 ? 5 : 3);
      add('screamer', 0.06, 0, this.wave >= 15 ? 2 : 1);
      add('shielder', 0.07, 0, 2);
      add('brute', 0.09, 0, 3);
      return c;
    }
    add('walker', 0.35);
    add('runner', 0.34);
    add('brute', 0.13, 0, 4);
    add('exploder', 0.07, 0, 3);
    add('spitter', 0.06, 0, 2);
    add('shielder', 0.04, 0, 1);
    return c;
  }

  private getDefaultFillerEnemy(): EnemyType {
    if (this.wave < 3) return 'walker';
    if (this.encounterArchetype === 'swarm' || this.specialWave === 'night') return Math.random() < 0.58 ? 'walker' : 'runner';
    if (this.encounterArchetype === 'breather') return Math.random() < 0.7 ? 'walker' : 'runner';
    return Math.random() < 0.5 ? 'walker' : 'runner';
  }

  private enemyUnlocked(type: EnemyType) {
    if (type === 'runner') return this.wave >= 3;
    if (type === 'exploder' || type === 'brute') return this.wave >= 5;
    if (type === 'spitter') return this.wave >= 7;
    if (type === 'shielder') return this.wave >= 8;
    if (type === 'gunner') return this.wave >= 9;
    if (type === 'screamer') return this.wave >= 11;
    return true;
  }

  private canSpawnPlannedEnemy(type: EnemyType) {
    if (!this.enemyUnlocked(type)) return false;
    const active = this.enemies.filter((enemy) => enemy.type === type).length;
    const cap = this.getActiveEnemyCap(type);
    return active < cap;
  }

  private getActiveEnemyCap(type: EnemyType) {
    if (type === 'gunner') return this.specialWave === 'gunnerRaid' ? (this.wave >= 14 ? 5 : 3) : (this.wave >= 14 ? 3 : 2);
    if (type === 'spitter') return this.specialWave === 'toxic' ? (this.wave >= 14 ? 5 : 3) : (this.wave >= 14 ? 4 : 3);
    if (type === 'shielder') return this.specialWave === 'elite' ? (this.wave >= 14 ? 5 : 3) : (this.wave >= 14 ? 3 : 2);
    if (type === 'screamer') return this.wave >= 15 ? 2 : 1;
    if (type === 'exploder') return this.specialWave === 'burning' ? (this.wave >= 12 ? 8 : 5) : 4;
    return Infinity;
  }

  private findPlannedReplacement(type: EnemyType): EnemyType | undefined {
    const options: EnemyType[] = type === 'spitter' || type === 'gunner'
      ? ['runner', 'walker']
      : type === 'shielder' || type === 'screamer'
        ? ['brute', 'runner', 'walker']
        : type === 'exploder'
          ? ['runner', 'walker']
          : ['walker'];
    return options.find((option) => this.canSpawnPlannedEnemy(option));
  }

  private pickFallbackEnemyType(): EnemyType {
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
      const baseLean = anim?.baseLean ?? (enemy.body.getData('baseLean') as number | undefined) ?? 0;
      enemy.body.setRotation(baseLean + cycle * (enemy.type === 'brute' || enemy.type === 'bossTitan' ? 0.02 : 0.045));
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
    const enemyGrid = this.buildEnemyGrid(ENEMY_GRID_CELL_SIZE);
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
      const hit = this.getBulletHit(bullet, enemyGrid, ENEMY_GRID_CELL_SIZE);
      if (!hit) continue;
      const crit = Math.random() < this.stats.critChance;
      const armorMul = hit.type === 'bossTitan' ? 0.5 : hit.type === 'bossGunner' ? 0.55 : hit.type === 'gunner' ? 0.58 : hit.type === 'spitter' ? 0.82 : 1;
      const shieldBlock = this.getShieldBlockMultiplier(hit, bullet, enemyGrid, ENEMY_GRID_CELL_SIZE);
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
      if (this.shouldSpawnDamageNumber()) this.damageNumber(hit.pos, Math.round(finalDamage));
      const hitCount = hit.type === 'brute' || hit.type === 'bossTitan' || hit.type === 'bossGunner' ? 10 : hit.type === 'gunner' || hit.type === 'spitter' ? 7 : 5;
      this.bloodHitFx(bullet.pos, Math.atan2(bullet.vel.y, bullet.vel.x), Math.max(1, Math.floor(hitCount * (this.getChaosLevel() > 0.72 ? 0.45 : 1))));
      if (this.shouldSpawnFx(1.25)) this.impactFx(bullet.pos, Math.atan2(bullet.vel.y, bullet.vel.x));
      this.applyHitStop(hit.type === 'brute' ? 0.055 : 0.028);
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
    const grid = new Map<number, Enemy[]>();
    for (const enemy of this.enemies) {
      const cx = Math.floor(enemy.pos.x / cellSize);
      const cy = Math.floor(enemy.pos.y / cellSize);
      const key = this.enemyGridKey(cx, cy);
      const bucket = grid.get(key);
      if (bucket) bucket.push(enemy);
      else grid.set(key, [enemy]);
    }
    return grid;
  }

  private enemyGridKey(cx: number, cy: number) {
    return (cx + ENEMY_GRID_STRIDE) * ENEMY_GRID_STRIDE * 2 + cy + ENEMY_GRID_STRIDE;
  }

  private getBulletHit(bullet: Bullet, grid: Map<number, Enemy[]>, cellSize: number) {
    const cx = Math.floor(bullet.pos.x / cellSize);
    const cy = Math.floor(bullet.pos.y / cellSize);
    for (let gx = cx - 1; gx <= cx + 1; gx += 1) {
      for (let gy = cy - 1; gy <= cy + 1; gy += 1) {
        const bucket = grid.get(this.enemyGridKey(gx, gy));
        if (!bucket) continue;
        for (const enemy of bucket) {
          this.collisionChecksThisFrame += 1;
          const radius = bullet.radius + enemy.radius;
          const dx = bullet.pos.x - enemy.pos.x;
          const dy = bullet.pos.y - enemy.pos.y;
          if (dx * dx + dy * dy < radius * radius) return enemy;
        }
      }
    }
    return undefined;
  }

  private getShieldBlockMultiplier(hit: Enemy, bullet: Bullet, grid: Map<number, Enemy[]>, cellSize: number) {
    if (hit.type === 'shielder') {
      const toPlayer = Math.atan2(this.playerPos.y - hit.pos.y, this.playerPos.x - hit.pos.x);
      const incoming = Math.atan2(bullet.vel.y, bullet.vel.x);
      const frontHit = Math.cos(incoming - toPlayer) < -0.35;
      return frontHit ? 0.28 : 1;
    }
    const cx = Math.floor(hit.pos.x / cellSize);
    const cy = Math.floor(hit.pos.y / cellSize);
    for (let gx = cx - 1; gx <= cx + 1; gx += 1) {
      for (let gy = cy - 1; gy <= cy + 1; gy += 1) {
        const bucket = grid.get(this.enemyGridKey(gx, gy));
        if (!bucket) continue;
        for (const enemy of bucket) {
          if (enemy.type !== 'shielder' || enemy.hp <= 0) continue;
          const dx = enemy.pos.x - hit.pos.x;
          const dy = enemy.pos.y - hit.pos.y;
          if (dx * dx + dy * dy < 135 * 135) return 0.72;
        }
      }
    }
    return 1;
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
    const firstBoss = this.wave === FIRST_BOSS_WAVE && enemy.bossTier === 1;
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
    if (!firstBoss && enemy.rage && Math.random() < 0.18) {
      this.pixelSpark({ x: enemy.pos.x + Phaser.Math.FloatBetween(-55, 55), y: enemy.pos.y + Phaser.Math.FloatBetween(-65, 45) }, 0xff3b32);
    }
    if (enemy.bossMode === 'vulnerable') {
      enemy.aimTimer -= dt;
      enemy.vel.x *= Math.pow(0.006, dt);
      enemy.vel.y *= Math.pow(0.006, dt);
      if (Math.random() < 0.08 * this.getEffectScale()) this.pixelSpark(enemy.pos, 0xffd166);
      if (enemy.aimTimer <= 0) enemy.bossMode = 'none';
      return;
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
      if (enemy.aimTimer <= 0) this.enterBossMeleeWindow(enemy, enemy.rage ? 0.48 : 0.68);
      return;
    }
    if (enemy.bossMode === 'ring') {
      enemy.aimTimer -= dt;
      enemy.vel.x *= Math.pow(0.02, dt);
      enemy.vel.y *= Math.pow(0.02, dt);
      if (enemy.aimTimer <= 0) {
        this.bossBulletRing(enemy);
        this.enterBossMeleeWindow(enemy, enemy.rage ? 0.34 : 0.48, false);
        enemy.ringCooldown = (Phaser.Math.FloatBetween(enemy.rage ? 1.45 : 2.25, enemy.rage ? 2.15 : 3.25) / tempo) * downtime;
      }
      return;
    }
    if (enemy.bossMode === 'slam') {
      enemy.aimTimer -= dt;
      if (enemy.aimTimer <= 0) {
        this.bossSlam(enemy);
        this.enterBossMeleeWindow(enemy, enemy.rage ? 0.58 : 0.78);
      }
      return;
    }
    enemy.vel.x += Math.cos(angle) * enemy.speed * dt * (enemy.rage ? 7.3 : 6.2);
    enemy.vel.y += Math.sin(angle) * enemy.speed * dt * (enemy.rage ? 7.3 : 6.2);
    if (enemy.attackCooldown <= 0) {
      if (!firstBoss && enemy.ringCooldown <= 0 && distance > 150 && distance < 980) {
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
        if (firstBoss) return;
        this.bossAimedVolley(enemy, angle);
        this.enterBossMeleeWindow(enemy, enemy.rage ? 0.3 : 0.42, false);
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
    if (enemy.bossMode === 'vulnerable') {
      enemy.aimTimer -= dt;
      enemy.vel.x *= Math.pow(0.008, dt);
      enemy.vel.y *= Math.pow(0.008, dt);
      if (Math.random() < 0.07 * this.getEffectScale()) this.pixelSpark(enemy.pos, 0xffd166);
      if (enemy.aimTimer <= 0) enemy.bossMode = 'none';
      return;
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
      if (enemy.aimTimer <= 0) this.enterBossMeleeWindow(enemy, enemy.rage ? 0.42 : 0.58);
      return;
    }
    if (enemy.bossMode === 'ring') {
      enemy.aimTimer -= dt;
      enemy.vel.x *= Math.pow(0.02, dt);
      enemy.vel.y *= Math.pow(0.02, dt);
      if (enemy.aimTimer <= 0) {
        this.bossBulletRing(enemy);
        this.enterBossMeleeWindow(enemy, enemy.rage ? 0.28 : 0.4, false);
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
      if (Math.random() < (enemy.rage ? 0.62 : 0.52)) {
        this.bossGunnerSpread(enemy, angle);
        this.enterBossMeleeWindow(enemy, enemy.rage ? 0.24 : 0.36, false);
      } else {
        this.startGunnerBurst(enemy, angle);
      }
      enemy.attackCooldown = (Phaser.Math.FloatBetween(enemy.rage ? 0.72 : 1.05, enemy.rage ? 1.08 : 1.45) / tempo) * downtime;
      enemy.aimTimer = 0;
      if (Math.random() < (enemy.rage ? 0.26 : 0.16)) this.summonBossMinions(enemy);
    } else {
      enemy.aimTimer = 0;
    }
  }

  private enterBossMeleeWindow(enemy: Enemy, duration: number, showText = true) {
    enemy.bossMode = 'vulnerable';
    enemy.aimTimer = duration * (enemy.bossTier === 2 ? 0.86 : 1);
    enemy.vel.x *= 0.16;
    enemy.vel.y *= 0.16;
    enemy.attackCooldown = Math.max(enemy.attackCooldown, enemy.aimTimer + 0.18);
    this.bossMeleeWindowFx(enemy);
    if (showText && this.wave <= 6) this.popText(enemy.pos, 'OPENING', '#ffd166');
  }

  private bossMeleeWindowFx(enemy: Enemy) {
    if (!this.shouldSpawnFx(1.15)) return;
    const radius = enemy.type === 'bossTitan' ? 96 : 72;
    const ring = this.add.circle(enemy.pos.x, enemy.pos.y, radius, 0xffd166, 0.08).setStrokeStyle(5, 0xffd166, 0.42);
    const mark = this.add.rectangle(enemy.pos.x, enemy.pos.y - enemy.radius - 28, 44, 8, 0xffd166, 0.58).setRotation(Phaser.Math.FloatBetween(-0.08, 0.08));
    this.fxLayer.add([ring, mark]);
    this.trackTransientFx(ring);
    this.trackTransientFx(mark);
    this.tweens.add({ targets: ring, alpha: 0, scale: 1.22, duration: 520, ease: 'Sine.easeOut', onComplete: () => ring.destroy() });
    this.tweens.add({ targets: mark, alpha: 0, y: mark.y - 14, duration: 460, ease: 'Sine.easeOut', onComplete: () => mark.destroy() });
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
    if (enemy.type === 'bossGunner' && enemy.burstShots <= 0) {
      this.enterBossMeleeWindow(enemy, enemy.rage ? 0.28 : 0.42, false);
    }
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
      this.waveEarnedXp += gem.value;
      gem.body.destroy();
      this.popText(this.playerPos, `+${gem.value} XP`, '#78f7ff');
      this.bankLevelRewardsFromXp();
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

  private updateMedkits(dt: number) {
    for (const medkit of this.medkitDrops) {
      medkit.age += dt;
      const d = Phaser.Math.Distance.Between(medkit.pos.x, medkit.pos.y, this.playerPos.x, this.playerPos.y);
      if (d < 150 && (this.hp < this.maxHp || this.storedMedkits < MEDKIT_SLOT_CAPACITY)) {
        const a = Phaser.Math.Angle.Between(medkit.pos.x, medkit.pos.y, this.playerPos.x, this.playerPos.y);
        const pull = d < 52 ? 520 : 180;
        medkit.pos.x += Math.cos(a) * pull * dt;
        medkit.pos.y += Math.sin(a) * pull * dt;
      }
      const pulse = 1 + Math.sin(medkit.age * 7) * 0.06;
      medkit.body.setPosition(medkit.pos.x, medkit.pos.y + Math.sin(medkit.age * 6) * 3);
      medkit.body.setScale(pulse);
      medkit.body.setAlpha(medkit.age > 18 ? 0.55 + Math.sin(medkit.age * 18) * 0.22 : 1);
    }
    const collected = this.medkitDrops.filter((medkit) => (this.hp < this.maxHp || this.storedMedkits < MEDKIT_SLOT_CAPACITY) && Phaser.Math.Distance.Between(medkit.pos.x, medkit.pos.y, this.playerPos.x, this.playerPos.y) < 30);
    collected.forEach((medkit) => {
      medkit.body.destroy();
      if (this.storedMedkits < MEDKIT_SLOT_CAPACITY) {
        this.storedMedkits += 1;
        this.popText({ x: this.playerPos.x, y: this.playerPos.y - 44 }, 'MEDKIT STORED', '#8aff6a');
        this.healPickupFx(this.playerPos);
        this.updateHud();
      } else {
        this.applyMedkitHeal(medkit.heal);
      }
    });
    const expired = this.medkitDrops.filter((medkit) => medkit.age > 24 && !collected.includes(medkit));
    expired.forEach((medkit) => medkit.body.destroy());
    this.medkitDrops = this.medkitDrops.filter((medkit) => !collected.includes(medkit) && !expired.includes(medkit));
  }

  private useStoredMedkit() {
    if (this.inLobby || this.selectingWeapon || this.leveling || this.paused || this.gameOver || this.playerDead) return;
    if (this.storedMedkits <= 0) {
      this.popText(this.playerPos, 'NO MEDKIT', '#8495a4');
      return;
    }
    if (this.hp >= this.maxHp) {
      this.popText(this.playerPos, 'HP FULL', '#8ee8ff');
      return;
    }
    this.storedMedkits -= 1;
    this.applyMedkitHeal(MEDKIT_HEAL_AMOUNT);
    this.updateHud();
  }

  private applyMedkitHeal(amount: number) {
    const heal = Math.min(amount, this.maxHp - this.hp);
    if (heal <= 0) return;
    this.hp = Math.min(this.maxHp, this.hp + heal);
    this.playerHpBarTimer = 2.4;
    this.popText({ x: this.playerPos.x, y: this.playerPos.y - 44 }, `+${Math.ceil(heal)} HP`, '#8aff6a');
    this.healPickupFx(this.playerPos);
  }

  private healPickupFx(pos: Vec2) {
    const ring = this.add.circle(pos.x, pos.y, 30, 0x8aff6a, 0.1).setStrokeStyle(4, 0xd7ff8a, 0.44);
    this.fxLayer.add(ring);
    this.trackTransientFx(ring);
    this.tweens.add({ targets: ring, alpha: 0, scale: 1.8, duration: 260, ease: 'Sine.easeOut', onComplete: () => ring.destroy() });
    for (let i = 0; i < 6; i += 1) {
      this.pixelSparkDirected(pos, (i / 6) * Math.PI * 2, Phaser.Math.Between(26, 62), 0x8aff6a, 3);
    }
  }

  private createTurretBody(level: number, ghost = false) {
    const turretLevel = Phaser.Math.Clamp(Math.round(level), 1, 3) as 1 | 2 | 3;
    const visual = TURRET_VISUALS[turretLevel];
    if (this.textures.exists(TURRET_SPRITE_KEYS[turretLevel])) {
      const body = this.add.container(0, 0);
      const alpha = ghost ? 0.58 : 1;
      const shadow = this.add.ellipse(0, 24, 52 + turretLevel * 6, 16 + turretLevel * 2, 0x000000, ghost ? 0.16 : 0.34);
      const sprite = this.add.image(0, -4, TURRET_SPRITE_KEYS[turretLevel])
        .setDisplaySize(visual.width, visual.height)
        .setAlpha(alpha)
        .setOrigin(0.5, 0.5);
      const core = this.add.rectangle(-7, -12, 7 + turretLevel, 7 + turretLevel, ghost ? 0x8ee8ff : 0xff6b45, ghost ? 0.45 : 0);
      body.add([shadow, sprite, core]);
      body.setData('sprite', sprite);
      body.setData('core', core);
      body.setData('muzzleOffset', visual.muzzleOffset);
      body.setData('ghostParts', [sprite, core]);
      return body;
    }
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
    body.setData('muzzleOffset', 34);
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
      let target: Enemy | undefined;
      let bestDistSq = 520 * 520;
      for (const enemy of this.enemies) {
        if (enemy.hp <= 0) continue;
        const dx = enemy.pos.x - turret.pos.x;
        const dy = enemy.pos.y - turret.pos.y;
        const dSq = dx * dx + dy * dy;
        if (dSq < bestDistSq) {
          bestDistSq = dSq;
          target = enemy;
        }
      }
      const barrel = turret.body.getData('barrel') as Phaser.GameObjects.Rectangle | undefined;
      const core = turret.body.getData('core') as Phaser.GameObjects.Rectangle | undefined;
      const sprite = turret.body.getData('sprite') as Phaser.GameObjects.Image | undefined;
      const muzzleOffset = (turret.body.getData('muzzleOffset') as number | undefined) ?? 34;
      if (target) {
        const angle = Phaser.Math.Angle.Between(turret.pos.x, turret.pos.y, target.pos.x, target.pos.y);
        turret.body.setRotation(angle * 0.04);
        barrel?.setRotation(angle);
        sprite?.setRotation(angle * 0.08);
        if (turret.cooldown <= 0) {
          turret.cooldown = Math.max(0.32, 0.82 - turret.level * 0.09);
          const spawn = { x: turret.pos.x + Math.cos(angle) * muzzleOffset, y: turret.pos.y + Math.sin(angle) * muzzleOffset };
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
    if (!this.stats.drone) {
      this.destroyCombatDrone();
      return;
    }
    const drone = this.ensureCombatDrone();
    this.updateCombatDronePose(drone, dt);
    this.droneCooldown -= dt;
    if (this.droneCooldown > 0) return;
    let target: Enemy | undefined;
    let bestDistSq = Infinity;
    for (const enemy of this.enemies) {
      if (enemy.hp <= 0) continue;
      const dx = enemy.pos.x - drone.pos.x;
      const dy = enemy.pos.y - drone.pos.y;
      const dSq = dx * dx + dy * dy;
      if (dSq > 760 * 760) continue;
      if (dSq < bestDistSq) {
        bestDistSq = dSq;
        target = enemy;
      }
    }
    if (!target) return;
    this.droneCooldown = Math.max(0.12, 0.36 - this.stats.droneFireRate * 0.055);
    const angle = Phaser.Math.Angle.Between(drone.pos.x, drone.pos.y, target.pos.x, target.pos.y);
    drone.sprite?.setRotation(angle * 0.1);
    this.spawnDroneBullet(drone.pos, angle, 9 + this.stats.damage * 0.28);
    this.sfx.playWeaponShot('rapidPistol', true);
  }

  private ensureCombatDrone() {
    if (this.combatDrone?.body.active) return this.combatDrone;
    const body = this.add.container(this.playerPos.x - 64, this.playerPos.y - 76);
    const shadow = this.add.ellipse(0, 38, 54, 12, 0x000000, 0.28);
    let sprite: Phaser.GameObjects.Image | undefined;
    if (this.textures.exists(DRONE_SPRITE_KEY)) {
      sprite = this.add.image(0, 0, DRONE_SPRITE_KEY).setDisplaySize(92, 60).setOrigin(0.5);
      body.add([shadow, sprite]);
    } else {
      const hull = this.add.rectangle(0, 0, 48, 24, 0x293744, 1).setStrokeStyle(3, 0x05080c, 1);
      const gun = this.add.rectangle(31, 8, 24, 8, 0x1b1513, 1).setStrokeStyle(2, 0x070707, 1);
      const eye = this.add.circle(8, 0, 5, 0xff6b45, 0.95);
      body.add([shadow, hull, gun, eye]);
    }
    body.setDepth(2);
    this.worldLayer.add(body);
    this.combatDrone = { pos: { x: body.x, y: body.y }, body, sprite };
    return this.combatDrone;
  }

  private updateCombatDronePose(drone: CombatDrone, dt: number) {
    const offsetAngle = this.elapsed * 1.65;
    const desired = {
      x: this.playerPos.x - 62 + Math.cos(offsetAngle) * 16,
      y: this.playerPos.y - 76 + Math.sin(offsetAngle * 1.3) * 10,
    };
    const follow = 1 - Math.pow(0.006, dt);
    drone.pos.x += (desired.x - drone.pos.x) * follow;
    drone.pos.y += (desired.y - drone.pos.y) * follow;
    drone.body.setPosition(drone.pos.x, drone.pos.y);
    drone.body.setScale(1 + Math.sin(this.elapsed * 5.4) * 0.018);
  }

  private spawnDroneBullet(origin: Vec2, angle: number, damage: number) {
    while (this.bullets.length >= MAX_ACTIVE_BULLETS) {
      const oldest = this.bullets.shift();
      if (oldest?.body.active) oldest.body.destroy();
    }
    const spawn = { x: origin.x + Math.cos(angle) * 42, y: origin.y + Math.sin(angle) * 42 + 8 };
    const body = this.add.container(spawn.x, spawn.y);
    const slug = this.add.rectangle(0, 0, 12, 4, 0xff9f6a, 0.96).setRotation(angle);
    const core = this.add.rectangle(-2, 0, 5, 3, 0xffe0a3, 0.82).setRotation(angle);
    body.add([slug, core]);
    this.fxLayer.add(body);
    this.tracerFx(spawn, angle);
    this.bullets.push({
      pos: { ...spawn },
      vel: { x: Math.cos(angle) * 820, y: Math.sin(angle) * 820 },
      damage,
      radius: 6,
      life: 1.05,
      fire: 0,
      poison: 0,
      freeze: 0,
      pierce: 0,
      ricochet: 0,
      explosive: false,
      chain: false,
      knockback: 0.45,
      owner: 'secondary',
      body,
    });
  }

  private destroyCombatDrone() {
    if (!this.combatDrone) return;
    if (this.combatDrone.body.active) this.combatDrone.body.destroy();
    this.combatDrone = null;
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
    this.tryDropMedkit(enemy);
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
    const bonusCoins = this.wave === FIRST_BOSS_WAVE ? 90 : 55 + enemy.bossTier * 20;
    this.coins += bonusCoins;
    this.runCoinsEarned += bonusCoins;
    this.hp = this.maxHp;
    this.xp += this.xpNeed;
    this.waveEarnedXp += this.xpNeed;
    this.bankLevelRewardsFromXp(false);
    this.tryUnlockTurretSystem();
    this.popText(this.playerPos, `BOSS DEFEATED +${bonusCoins}`, '#ff6b45');
    this.waveUpgradePending = true;
  }

  private grantSpecialWaveReward() {
    if (this.specialWave === 'none') return;
    const meta = SPECIAL_WAVE_META[this.specialWave];
    const bonusCoins = meta.bonus + Math.floor(this.wave * 2.5);
    const bonusXp = 12 + Math.floor(this.wave * 1.6);
    this.coins += bonusCoins;
    this.runCoinsEarned += bonusCoins;
    const gainedXp = bonusXp * this.stats.magnet;
    this.xp += gainedXp;
    this.waveEarnedXp += gainedXp;
    this.bankLevelRewardsFromXp(false);
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

  private tryDropMedkit(enemy: Enemy) {
    if (enemy.type === 'bossTitan' || enemy.type === 'bossGunner') return;
    if (this.medkitsDroppedThisWave >= MEDKIT_DROP_LIMIT_PER_WAVE) return;
    this.medkitDropAttemptsThisWave += 1;
    const hpPct = this.hp / this.maxHp;
    const slotNeedsFill = this.storedMedkits < MEDKIT_SLOT_CAPACITY;
    const baseChance = hpPct < 0.35 ? 0.095 : hpPct < 0.55 ? 0.07 : hpPct < 0.75 ? 0.05 : slotNeedsFill ? 0.04 : 0.016;
    const eliteBonus = enemy.type === 'brute' || enemy.type === 'gunner' || enemy.type === 'spitter' || enemy.type === 'shielder' || enemy.type === 'screamer' ? 0.025 : 0;
    const pityBonus = Math.min(0.09, Math.max(0, this.medkitDropAttemptsThisWave - 10) * 0.006);
    if (Math.random() > baseChance + eliteBonus + pityBonus) return;
    this.medkitsDroppedThisWave += 1;
    this.medkitDropAttemptsThisWave = 0;
    this.spawnMedkitDrop({
      x: enemy.pos.x + Phaser.Math.Between(-22, 22),
      y: enemy.pos.y + Phaser.Math.Between(-18, 18),
    });
  }

  private spawnMedkitDrop(pos: Vec2) {
    const body = this.add.container(pos.x, pos.y);
    const shadow = this.add.ellipse(0, 17, 44, 13, 0x000000, 0.34);
    if (this.textures.exists(MEDKIT_SPRITE_KEY)) {
      const sprite = this.add.image(0, 0, MEDKIT_SPRITE_KEY).setDisplaySize(54, 54).setOrigin(0.5);
      body.add([shadow, sprite]);
    } else {
      const bag = this.add.rectangle(0, 0, 34, 22, 0x9d2c2f, 1).setStrokeStyle(3, 0x161016, 1);
      const crossA = this.add.rectangle(0, 0, 16, 6, 0xf1e1c3, 1);
      const crossB = this.add.rectangle(0, 0, 6, 16, 0xf1e1c3, 1);
      body.add([shadow, bag, crossA, crossB]);
    }
    this.fxLayer.add(body);
    this.medkitDrops.push({ pos, age: 0, heal: MEDKIT_HEAL_AMOUNT, body });
    if (this.shouldSpawnFx(1.3)) this.pixelSpark(pos, 0x8aff6a);
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

  private bankLevelRewardsFromXp(showToast = true) {
    let gained = 0;
    while (this.xp >= this.xpNeed) {
      this.xp -= this.xpNeed;
      this.level += 1;
      this.pendingLevelChoices += 1;
      gained += 1;
      this.xpNeed = Math.floor(this.xpNeed * 1.28 + 12);
      this.hp = Math.min(this.maxHp, this.hp + 8);
    }
    if (gained > 0 && showToast) {
      this.popText(this.playerPos, gained > 1 ? `${gained} UPGRADES BANKED` : 'UPGRADE BANKED', '#ffd166');
      this.soundtrack.levelUpStinger();
    }
    return gained;
  }

  private gainXp(value: number, pos: Vec2) {
    const gained = value * this.stats.magnet;
    this.xp += gained;
    this.waveEarnedXp += gained;
    this.popText({ x: pos.x, y: pos.y - 28 }, `+${value} XP`, '#78f7ff');
    this.bankLevelRewardsFromXp();
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
        ${this.renderUtilitySlotShopCard()}
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

  private requestPreRunStart() {
    this.stopLobbyAmbientZombies();
    this.showPreRunMenu();
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
        <span class="upgrade-select-label">SELECT</span>
        <div class="upgrade-tags">${tags.map((tag) => `<span>${tag}</span>`).join('')}</div>
      </button>`;
  }

  private playUpgradeRevealFx(choices: Upgrade[]) {
    this.applyHitStop(0.18);
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

  private applyUpgrade(id: UpgradeId, keepEndWaveMenu = false) {
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
    if (!keepEndWaveMenu) this.upgradeOverlay.classList.remove('visible');
    this.specialRewardPending = false;
    if (!keepEndWaveMenu) {
      this.leveling = false;
      if (this.waveUpgradePending) this.showCampShop();
    }
  }

  private showCampShop() {
    const mark = this.markUiOpenStart('camp-shop');
    const wasVisible = this.campOverlay.classList.contains('visible');
    this.leveling = true;
    this.ensureShopOffers();
    this.preloadUiAssets();
    if (this.waveUpgradePending && !this.wavePrepUpgradeGranted) {
      if (this.pendingLevelChoices <= 0) this.pendingLevelChoices = 1;
      this.wavePrepUpgradeGranted = true;
    }
    const upgradesLocked = this.pendingLevelChoices > 0;
    const upgradeChoices = upgradesLocked ? this.rollUpgradeChoices() : [];
    const shopCards = [
      ...this.shopOffers.map((offer) => this.renderShopOfferCard(offer)),
    ].slice(0, 4);
    if (!wasVisible) this.campOverlay.classList.remove('visible');
    this.campOverlay.innerHTML = `
      <div class="camp-box prep-screen">
        <header class="prep-header prep-header-minimal">
          <div>
            <span>WAVE ${this.wave} CLEARED</span>
            <h1>PREPARE</h1>
          </div>
        </header>
        <div class="prep-layout">
          <main class="prep-panel prep-upgrade-panel ${upgradesLocked ? 'prep-upgrade-mode' : 'prep-shop-mode'}">
            <div class="prep-section-head">
              <h2>${upgradesLocked ? 'CHOOSE UPGRADE' : 'FIELD SHOP'}</h2>
              ${upgradesLocked
                ? `<span>${this.pendingLevelChoices} left</span>`
                : `<button class="prep-head-reroll" data-camp-action="reroll" ${this.coins < this.getRerollPrice() ? 'disabled' : ''}>Reroll ${this.getRerollPrice()}</button>`}
            </div>
            ${upgradesLocked ? `
              <div class="upgrade-grid end-wave-upgrade-grid">
                ${upgradeChoices.map((u, index) => this.renderUpgradeCard(u, index)).join('')}
              </div>
            ` : `
              <div class="prep-shop-stage">
                <div class="prep-shop-grid">
                  ${shopCards.length ? shopCards.join('') : '<p class="camp-empty">Dealer stock is empty.</p>'}
                </div>
              </div>
            `}
          </main>
          ${this.renderPrepBuildPanel()}
        </div>
        ${this.renderWeaponSlotPicker()}
        ${upgradesLocked ? '' : `<footer class="prep-footer">
          <button class="prep-footer-reroll" data-camp-action="reroll" ${this.coins < this.getRerollPrice() ? 'disabled' : ''}>Reroll ${this.getRerollPrice()}</button>
          <button class="prep-footer-continue" data-camp-action="continue">Continue</button>
        </footer>`}
      </div>`;
    this.campOverlay.onclick = (event) => {
      const button = (event.target as HTMLElement).closest<HTMLButtonElement>('button');
      if (!button || button.disabled) return;
      const action = button.dataset.campAction;
      if (action === 'continue') {
        this.pendingLevelChoices = 0;
        this.campOverlay.classList.remove('visible');
        this.leveling = false;
        this.waveUpgradePending = false;
        this.wavePrepUpgradeGranted = false;
        this.beginNextWaveCountdown();
      }
      else if (button.dataset.id) this.chooseEndWaveUpgrade(button.dataset.id as UpgradeId, button.dataset.rarity as UpgradeRarity);
      else if (button.dataset.cancelWeaponSlotPick !== undefined) {
        this.pendingWeaponSlotPick = null;
        this.showCampShop();
      } else if (button.dataset.equipWeaponSlot && this.pendingWeaponSlotPick) {
        this.buyShopWeaponInSlot(this.pendingWeaponSlotPick, button.dataset.equipWeaponSlot as WeaponSlot);
      } else if (this.pendingLevelChoices > 0) return;
      else if (button.dataset.buyWeapon) this.openWeaponSlotPicker(button.dataset.buyWeapon as WeaponId);
      else if (button.dataset.upgradeWeapon) this.upgradeOwnedWeapon(button.dataset.upgradeWeapon as WeaponId);
      else if (button.dataset.buyUtilitySlot !== undefined) this.buyUtilitySlot();
      else if (button.dataset.buyTurret !== undefined) this.buyTurretSystem();
      else if (action === 'reroll') this.rerollWeaponShop();
    };
    if (wasVisible) this.markUiOpenEnd(mark);
    else this.revealOverlayNextFrame(this.campOverlay, mark);
  }

  private renderPrepBuildPanel() {
    const character = CHARACTER_TEMPLATES[this.selectedCharacter];
    const activeWeapon = this.getActiveWeapon();
    const statRows = this.getPrepStatRows(activeWeapon);
    const perkRows = this.getPrepActiveEffects();
    const weaponRows = WEAPON_SLOTS.map((slot) => this.renderPrepLoadoutSlot(slot)).join('');
    const utilityRows = Array.from({ length: UTILITY_SLOT_COUNT }, (_, index) => this.renderPrepUtilitySlot(index)).join('');
    return `
      <aside class="prep-build-panel" aria-label="Current tactical build">
        <section class="prep-build-identity">
          <div class="prep-build-portrait ${this.selectedCharacter}"></div>
          <div>
            <span>CHARACTER</span>
            <h2>${character.title}</h2>
            <strong>LEVEL ${this.level}</strong>
          </div>
        </section>
        <section class="prep-build-block">
          <h3>CORE STATS</h3>
          <div class="prep-build-stat-list">
            ${statRows.map((row) => `<div class="prep-build-stat-row"><span>${row.label}</span><strong>${row.value}</strong></div>`).join('')}
          </div>
        </section>
        <section class="prep-build-block">
          <h3>LOADOUT</h3>
          <div class="prep-build-loadout">
            ${weaponRows}
            ${utilityRows}
            <div class="prep-build-loadout-row medkit ${this.storedMedkits > 0 ? 'filled' : ''}">
              <span class="prep-loadout-icon">+</span>
              <strong>${this.storedMedkits > 0 ? 'Medkit' : 'Medkit'}</strong>
            </div>
          </div>
        </section>
        <section class="prep-build-block prep-build-effects">
          <h3>ACTIVE EFFECTS</h3>
          ${perkRows.length
            ? `<div class="prep-build-effect-list">${perkRows.map((perk) => `<span>${perk}</span>`).join('')}</div>`
            : '<p>No active perks yet.</p>'}
        </section>
      </aside>`;
  }

  private renderPrepLoadoutSlot(slot: WeaponSlot) {
    const equipped = this.getEquippedSlot(slot);
    if (!equipped) {
      return `
        <div class="prep-build-loadout-row empty">
          <span class="prep-loadout-icon">+</span>
          <strong>${WEAPON_SLOT_LABELS[slot]}</strong>
        </div>`;
    }
    const weapon = WEAPONS[equipped.id];
    return `
      <div class="prep-build-loadout-row filled">
        ${this.renderWeaponSpriteIcon(equipped.id, weapon.title, 'prep-loadout-icon weapon-sprite-preview')}
        <strong>${weapon.title}</strong>
      </div>`;
  }

  private renderPrepUtilitySlot(index: number) {
    const unlocked = index < this.utilitySlotsUnlocked;
    const turret = this.turrets[index];
    if (!unlocked) {
      return `
        <div class="prep-build-loadout-row locked">
          ${this.renderLockedSlotIcon()}
        </div>`;
    }
    return `
      <div class="prep-build-loadout-row ${turret ? 'filled' : 'empty'}">
        <span class="prep-loadout-icon">${turret ? 'TR' : '+'}</span>
        <strong>${turret ? `Turret Mk.${turret.level}` : 'Utility'}</strong>
      </div>`;
  }

  private getPrepStatRows(activeWeapon: EquippedWeapon | undefined) {
    const weapon = activeWeapon ? WEAPONS[activeWeapon.id] : undefined;
    const baseWeapon = WEAPONS[this.selectedWeapon];
    const tierDamage = activeWeapon ? 1 + (activeWeapon.level - 1) * 0.16 : 1;
    const weaponDamage = weapon
      ? Math.round(this.stats.damage * (weapon.damage / baseWeapon.damage) * tierDamage * (activeWeapon?.evolved ? 1.18 : 1) * 10) / 10
      : Math.round(this.stats.damage);
    return [
      { label: 'HP', value: `${Math.ceil(this.hp)}/${this.maxHp}` },
      { label: weapon?.melee ? 'MELEE DMG' : 'DAMAGE', value: `${weaponDamage}` },
      { label: 'FIRE RATE', value: `${Math.round(this.stats.fireRate * 10) / 10}/s` },
      { label: 'CRIT', value: `${Math.round(this.stats.critChance * 100)}%` },
      { label: 'DODGE', value: `${Math.round(this.stats.dodge * 100)}%` },
      { label: 'MOVE SPEED', value: `${Math.round(this.stats.speed)}` },
      { label: 'UTILITY', value: `${this.utilitySlotsUnlocked}/${UTILITY_SLOT_COUNT}` },
      { label: 'COINS', value: `${this.coins}` },
    ];
  }

  private getPrepActiveEffects() {
    const effects: string[] = [];
    const add = (condition: boolean, label: string) => { if (condition) effects.push(label); };
    add(this.stats.regen > 0, 'Health Regen');
    add(this.stats.lifesteal > 0, 'Lifesteal');
    add(this.stats.fire > 0 || this.stats.fireAura > 0, 'Burn Tools');
    add(this.stats.poison > 0 || this.stats.poisonSpread > 0, 'Toxic Rounds');
    add(this.stats.freeze > 0, 'Cryo Rounds');
    add(this.stats.lightningAura > 0 || this.stats.lightningChain > 0, 'Lightning Kit');
    add(this.stats.orbit > 0, 'Orbitals');
    add(this.stats.drone > 0, 'Drone Buddy');
    add(this.turretSystemUnlocked || this.turrets.length > 0, 'Turret System');
    add(this.stats.shield > 0 || this.shield > 0, 'Shield Buffer');
    add(this.stats.explosive > 0 || this.stats.deathBurst > 0, 'Explosives');
    add(this.stats.knockback > 0, 'Knockback');
    this.equippedWeapons.filter((weapon) => weapon.evolved).forEach((weapon) => effects.push(`${WEAPONS[weapon.id].title} EVO`));
    return effects.slice(0, 8);
  }

  private ensureShopOffers(force = false) {
    if (!force && this.shopOffers.length > 0) return;
    this.shopOffers = this.rollShopOffers();
  }

  private rollShopOffers() {
    const offers: ShopOffer[] = [];
    const weaponPool = SHOP_WEAPONS.filter((id) => {
      if (WEAPONS[id].tier === 'Late' && this.wave < 5 && this.level < 5) return false;
      if (WEAPONS[id].tier === 'Mid' && this.wave < 2 && this.level < 2) return false;
      return true;
    });
    const shuffledWeapons = [...weaponPool].sort(() => Math.random() - 0.5);
    const firstWeapon = shuffledWeapons.shift();
    if (firstWeapon) offers.push({ kind: 'weapon', id: firstWeapon });

    const candidates: ShopOffer[] = [
      ...shuffledWeapons.map((id) => ({ kind: 'weapon', id }) as ShopOffer),
      ...this.equippedWeapons
        .filter((slot) => !(slot.level >= 3 && slot.evolved))
        .map((slot) => ({ kind: 'weaponUpgrade', id: slot.id }) as ShopOffer),
    ];
    if (this.utilitySlotsUnlocked < UTILITY_SLOT_COUNT) candidates.push({ kind: 'utilitySlot' });
    if (this.turretSystemUnlocked && this.turrets.length < UTILITY_SLOT_COUNT) candidates.push({ kind: 'turret' });

    const unique = candidates
      .filter((offer) => !offers.some((existing) => this.getShopOfferKey(existing) === this.getShopOfferKey(offer)))
      .sort(() => Math.random() - 0.5);
    while (offers.length < 4 && unique.length > 0) offers.push(unique.shift()!);
    return offers.slice(0, 4);
  }

  private getShopOfferKey(offer: ShopOffer) {
    return offer.kind === 'weapon' || offer.kind === 'weaponUpgrade' ? `${offer.kind}:${offer.id}` : offer.kind;
  }

  private renderShopOfferCard(offer: ShopOffer) {
    if (offer.sold) return this.renderSoldShopCard();
    if (offer.kind === 'weapon') return this.renderWeaponShopCard(offer.id);
    if (offer.kind === 'weaponUpgrade') {
      const slot = this.equippedWeapons.find((weapon) => weapon.id === offer.id);
      return slot ? this.renderOwnedWeaponCard(slot) : this.renderSoldShopCard();
    }
    if (offer.kind === 'utilitySlot') return this.renderUtilitySlotShopCard();
    return this.renderTurretShopCard();
  }

  private renderSoldShopCard() {
    return `
      <button class="camp-card weapon-shop-card shop-sold" disabled>
        <span class="shop-sold-mark">SOLD</span>
        <h2>Sold Out</h2>
        <p>Reroll or clear next wave</p>
        <strong>--</strong>
      </button>`;
  }

  private markShopOfferSold(kind: ShopOffer['kind'], id?: WeaponId) {
    const offer = this.shopOffers.find((entry) => {
      if (entry.sold || entry.kind !== kind) return false;
      if ((entry.kind === 'weapon' || entry.kind === 'weaponUpgrade') && id) return entry.id === id;
      return true;
    });
    if (offer) offer.sold = true;
  }

  private renderWeaponShopCard(id: WeaponId) {
    const weapon = WEAPONS[id];
    const price = this.getWeaponPrice(id);
    const disabled = this.coins < price;
    const emptySlot = WEAPON_SLOTS.find((slot) => !this.getEquippedSlot(slot));
    const slotText = emptySlot ? 'CHOOSE OPEN SLOT' : 'CHOOSE SLOT TO REPLACE';
    return `
      <button class="camp-card weapon-shop-card shop-weapon ${weapon.melee ? 'shop-melee' : ''}" data-buy-weapon="${id}" ${disabled ? 'disabled' : ''}>
        ${this.renderWeaponSpriteIcon(id, weapon.title)}
        <em>WEAPON</em>
        <h2>${weapon.title}</h2>
        <p>${this.getShopWeaponSubtitle(id)}</p>
        <span class="shop-meta">${slotText}</span>
        <strong>${price}</strong>
      </button>`;
  }

  private getShopWeaponSubtitle(id: WeaponId) {
    const subtitles: Partial<Record<WeaponId, string>> = {
      pistol: 'Balanced sidearm',
      rapidPistol: 'Fast light shots',
      heavyPistol: 'Heavy burst',
      dualPistols: 'Twin spray',
      smg: 'Rapid spray',
      burstRifle: 'Precision burst',
      shotgun: 'Close-range blast',
      railgun: 'Piercing line',
      flamethrower: 'Area denial',
      launcher: 'Explosive clear',
      lightningCannon: 'Chain rounds',
      plasma: 'Energy pressure',
      minigun: 'Sustained fire',
      baseballBat: 'Wide crowd control',
      combatKnife: 'Fast close DPS',
      chainsawMachete: 'Horde shredder',
    };
    return subtitles[id] ?? WEAPONS[id].tagline;
  }

  private renderOwnedWeaponCard(slot: EquippedWeapon) {
    const weapon = WEAPONS[slot.id];
    const maxed = slot.level >= 3 && slot.evolved;
    const price = this.getWeaponUpgradePrice(slot);
    const label = slot.level < 3 ? `TIER ${slot.level + 1}` : slot.evolved ? 'MAX' : 'EVOLVE';
    return `
      <button class="camp-card weapon-shop-card shop-${slot.slot} ${weapon.melee ? 'shop-melee' : ''} ${maxed ? 'maxed' : ''}" data-upgrade-weapon="${slot.id}" ${maxed || this.coins < price ? 'disabled' : ''}>
        ${this.renderWeaponSpriteIcon(slot.id, weapon.title)}
        <em>${WEAPON_SLOT_LABELS[slot.slot].toUpperCase()}</em>
        <h2>${weapon.title}</h2>
        <p>${slot.level < 3 ? 'Sharper output' : slot.evolved ? 'Fully tuned' : 'Final mod'}</p>
        <span class="shop-meta">${label} CALIBRATION</span>
        <strong>${maxed ? 'MAXED' : price}</strong>
      </button>`;
  }

  private chooseEndWaveUpgrade(id: UpgradeId, rarity: UpgradeRarity) {
    if (this.pendingLevelChoices <= 0) return;
    this.pendingLevelChoices = Math.max(0, this.pendingLevelChoices - 1);
    this.sfx.playUpgradeSelect(rarity);
    this.applyUpgrade(id, true);
    this.showCampShop();
  }

  private renderTurretShopCard() {
    const price = this.getTurretPrice();
    const locked = this.utilitySlotsUnlocked <= this.turrets.length;
    const maxed = this.turrets.length >= UTILITY_SLOT_COUNT || locked || this.placingTurret;
    const level = Math.min(3, this.turrets.length + 1);
    return `
      <button class="camp-card weapon-shop-card shop-utility" data-buy-turret ${maxed || this.coins < price ? 'disabled' : ''}>
        ${this.renderTurretSpriteIcon(level)}
        <em>UTILITY</em>
        <h2>Pocket Turret Mk.${level}</h2>
        <p>Deployable fire support</p>
        <span class="shop-meta">${locked ? 'REQUIRES UTILITY SLOT' : 'USES 1 UTILITY SLOT'}</span>
        <strong>${this.placingTurret ? 'PLACE CURRENT TURRET' : locked ? 'SLOT LOCKED' : this.turrets.length >= UTILITY_SLOT_COUNT ? 'MAX ACTIVE' : price}</strong>
      </button>`;
  }

  private renderUtilitySlotStrip() {
    const slots = Array.from({ length: UTILITY_SLOT_COUNT }, (_, index) => {
      const unlocked = index < this.utilitySlotsUnlocked;
      const turret = this.turrets[index];
      const price = index === this.utilitySlotsUnlocked ? UTILITY_SLOT_PRICES[index] : undefined;
      return `
        <span class="prep-utility-slot ${unlocked ? 'unlocked' : 'locked'}">
          <b>U${index + 1}</b>
          <strong>${unlocked ? (turret ? `Turret Mk.${turret.level}` : 'Empty') : 'Locked'}</strong>
          <em>${unlocked ? 'Utility' : price ? `${price}` : 'Slot'}</em>
        </span>`;
    }).join('');
    return `<div class="prep-utility-strip">${slots}</div>`;
  }

  private renderUtilitySlotShopCard() {
    if (this.utilitySlotsUnlocked >= UTILITY_SLOT_COUNT) {
      return `
        <button class="camp-card weapon-shop-card shop-utility maxed utility-slot-card" disabled>
          ${this.renderIcon('slotExpansion', 'Utility slots')}
          <em>TACTICAL</em>
          <h2>Utility Slots</h2>
          <p>All tactical slots online</p>
          <span class="shop-meta">3 / 3 UNLOCKED</span>
          <strong>MAXED</strong>
        </button>`;
    }
    const next = this.utilitySlotsUnlocked + 1;
    const price = UTILITY_SLOT_PRICES[this.utilitySlotsUnlocked] ?? UTILITY_SLOT_PRICES[UTILITY_SLOT_PRICES.length - 1];
    return `
      <button class="camp-card weapon-shop-card shop-utility utility-slot-card" data-buy-utility-slot ${this.coins < price ? 'disabled' : ''}>
        ${this.renderIcon('slotExpansion', `Utility Slot ${next}`)}
        <em>TACTICAL</em>
        <h2>Utility Slot ${next}</h2>
        <p>Unlock extra utility slot</p>
        <span class="shop-meta">DEPLOYABLE / SUPPORT CAPACITY</span>
        <strong>${price}</strong>
      </button>`;
  }

  private renderIcon(key: UpgradeId | string, label: string) {
    const src = ICON_URLS[key];
    return `<span class="upgrade-icon"><img src="${src}" alt="${label}" loading="eager"></span>`;
  }

  private renderWeaponSpriteIcon(id: WeaponId, label: string, className = 'weapon-sprite-icon') {
    const src = WEAPON_SPRITE_URLS[id] ?? WEAPON_SPRITE_URLS.pistol;
    return `<span class="${className}"><img src="${src}" alt="${label}" loading="eager"></span>`;
  }

  private renderTurretSpriteIcon(level: number) {
    const turretLevel = Phaser.Math.Clamp(Math.round(level), 1, 3) as 1 | 2 | 3;
    const src = TURRET_SPRITE_URLS[turretLevel] ?? ICON_URLS.turret;
    return `<span class="weapon-sprite-icon turret-sprite-icon"><img src="${src}" alt="Pocket Turret Mk.${turretLevel}" loading="eager"></span>`;
  }

  private renderLockedSlotIcon(className = 'prep-loadout-icon pixel-lock-icon') {
    return `<span class="${className}" aria-label="Locked"><img src="${ICON_URLS.lockedSlot}" alt="" loading="eager"></span>`;
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
    const tierCost = { Early: 42, Mid: 70, Late: 112 }[WEAPONS[id].tier];
    return tierCost + Math.floor(this.wave * 4.3);
  }

  private getWeaponUpgradePrice(slot: EquippedWeapon) {
    const tierCost = { Early: 22, Mid: 32, Late: 48 }[WEAPONS[slot.id].tier];
    if (slot.level >= 3 && !slot.evolved) return tierCost + 60 + Math.floor(this.wave * 4.8);
    return Math.floor((tierCost + 14) * Math.pow(1.62, slot.level - 1) + this.wave * 2.5);
  }

  private getRerollPrice() {
    return 14 + Math.floor(this.wave * 1.8) + Math.floor(this.shopRerollsThisPrep * 4.5);
  }

  private getTurretPrice() {
    return 104 + this.turrets.length * 72 + Math.floor(this.wave * 5.2);
  }

  private getUtilitySlotPrice() {
    return this.utilitySlotsUnlocked < UTILITY_SLOT_COUNT ? UTILITY_SLOT_PRICES[this.utilitySlotsUnlocked] : Infinity;
  }

  private buyUtilitySlot() {
    if (this.utilitySlotsUnlocked >= UTILITY_SLOT_COUNT) return;
    const price = this.getUtilitySlotPrice();
    if (this.coins < price) return;
    this.coins -= price;
    this.utilitySlotsUnlocked += 1;
    this.markShopOfferSold('utilitySlot');
    this.lastUtilitySlotPulse = performance.now();
    this.popText(this.playerPos, `UTILITY SLOT ${this.utilitySlotsUnlocked} ONLINE`, '#ffd166');
    this.sfx.playUpgradeSelect('Rare');
    this.soundtrack.levelUpStinger();
    this.shake(120, 0.004);
    this.updateHud();
    this.showCampShop();
  }

  private buyTurretSystem() {
    if (!this.turretSystemUnlocked || this.turrets.length >= UTILITY_SLOT_COUNT || this.placingTurret) return;
    if (this.turrets.length >= this.utilitySlotsUnlocked) {
      this.popText(this.playerPos, 'UTILITY SLOT REQUIRED', '#ffb86b');
      return;
    }
    const price = this.getTurretPrice();
    if (this.coins < price) return;
    this.coins -= price;
    this.markShopOfferSold('turret');
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
    (this.turretGhost.getData('ghostParts') as Phaser.GameObjects.GameObject[] | undefined)?.forEach((part) => {
      if (part instanceof Phaser.GameObjects.Rectangle) part.setStrokeStyle(2, color, 0.74);
      if (part instanceof Phaser.GameObjects.Image) part.setTint(color).setAlpha(this.turretPlacementValid ? 0.66 : 0.42);
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

  private openWeaponSlotPicker(id: WeaponId) {
    const price = this.getWeaponPrice(id);
    if (this.coins < price) return;
    this.pendingWeaponSlotPick = id;
    this.showCampShop();
  }

  private buyShopWeaponInSlot(id: WeaponId, slot: WeaponSlot) {
    const price = this.getWeaponPrice(id);
    if (this.coins < price || !WEAPON_SLOTS.includes(slot)) return;
    this.coins -= price;
    this.unlockWeapon(id, slot);
    this.pendingWeaponSlotPick = null;
    this.markShopOfferSold('weapon', id);
    this.showCampShop();
    this.updateHud();
  }

  private renderWeaponSlotPicker() {
    const id = this.pendingWeaponSlotPick;
    if (!id) return '';
    const weapon = WEAPONS[id];
    const rows = WEAPON_SLOTS.map((slot) => {
      const equipped = this.getEquippedSlot(slot);
      return `
        <button class="weapon-slot-pick-card ${equipped ? 'replace' : 'empty'}" data-equip-weapon-slot="${slot}">
          <span>${WEAPON_SLOT_LABELS[slot]}</span>
          <strong>${equipped ? WEAPONS[equipped.id].title : 'Empty'}</strong>
          <em>${equipped ? 'Replace' : 'Equip here'}</em>
        </button>`;
    }).join('');
    return `
      <div class="weapon-slot-picker">
        <div class="weapon-slot-picker-box">
          <header>
            ${this.renderWeaponSpriteIcon(id, weapon.title, 'weapon-slot-picker-icon weapon-sprite-preview')}
            <div>
              <span>CHOOSE WEAPON SLOT</span>
              <h2>${weapon.title}</h2>
            </div>
          </header>
          <div class="weapon-slot-picker-grid">${rows}</div>
          <button class="weapon-slot-picker-cancel" data-cancel-weapon-slot-pick>Cancel</button>
        </div>
      </div>`;
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
    this.markShopOfferSold('weaponUpgrade', id);
    this.showCampShop();
    this.updateHud();
  }

  private rerollWeaponShop() {
    const price = this.getRerollPrice();
    if (this.coins < price) return;
    this.coins -= price;
    this.shopRerollsThisPrep += 1;
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

  private unlockWeapon(id: WeaponId, slot: WeaponSlot = this.getWeaponSlot(id)) {
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
    this.updatePlayerWeaponVisual(true);
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
    if (id === 'evolvePistol') return this.equippedWeapons.find((weapon) => ['pistol', 'rapidPistol', 'heavyPistol', 'burstPistol'].includes(weapon.id))?.id;
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
    const slot: WeaponSlot = 'primary';
    this.selectedWeapon = id;
    this.activeWeaponSlot = slot;
    const weapon = WEAPONS[id];
    this.equippedWeapons = [{ id, slot, cooldown: 0, evolved: false, level: 1 }];
    this.stats.damage = weapon.damage;
    this.stats.fireRate = weapon.fireRate;
    this.stats.bulletSpeed = weapon.bulletSpeed;
    this.stats.projectileSize = weapon.projectileSize;
    this.stats.knockback = 0;
    if (id === 'combatKnife') this.stats.critChance = 0.08;
    else if (id === 'baseballBat') this.stats.damageReduction = 0.06;
    else if (id === 'chainsawMachete') this.stats.knockback = 0.25;
    if (id === 'shotgun') this.stats.pierce = 0;
    if (id === 'smg') this.stats.poison = 1;
    this.applyCharacterTemplate(this.selectedCharacter);
    this.applyPlayerCharacterVisual();
    this.updatePlayerWeaponVisual(true);
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

  private applyPlayerCharacterVisual() {
    if (!this.playerCharacterSprite) return;
    this.playerCharacterSprite.stop();
    this.playerCharacterSprite.setTexture(PLAYER_CHARACTER_TEXTURE_KEYS[this.selectedCharacter]);
    this.playerCharacterSprite.setScale(this.selectedCharacter === 'heavy' ? 0.23 : 0.215);
  }

  private applyCharacterTemplate(id: CharacterId) {
    if (id === 'survivor') {
      this.maxHp += 10;
      this.hp = this.maxHp;
      this.stats.damageReduction += 0.04;
    }
    if (id === 'scout') {
      this.stats.speed *= 1.08;
      this.rollCooldownMax = 2.45;
    }
    if (id === 'heavy') {
      this.maxHp += 25;
      this.hp = this.maxHp;
      this.stats.damageReduction += 0.08;
      this.stats.speed *= 0.94;
    }
    if (id === 'medic') {
      this.stats.regen += 1;
      this.stats.magnet *= 1.08;
      this.stats.damage *= 0.96;
    }
    if (id === 'hunter') {
      this.stats.critChance += 0.08;
      this.stats.bulletSpeed *= 1.12;
      this.maxHp -= 8;
      this.hp = this.maxHp;
    }
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
    return `
      <aside class="account-profile" aria-label="Survivor profile">
        <div class="account-avatar">NR</div>
        <div class="account-meta">
          <strong>${this.escapeHtml(save.nickname)}</strong>
          <span>Level ${save.accountLevel} Survivor</span>
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
    this.lobbyOverlay.classList.add('visible');
    this.updateCursorMode();
    this.lobbyOverlay.innerHTML = `
      ${this.renderAccountProfile()}
      <div class="lobby-static-bg" aria-hidden="true"></div>
      <div class="lobby-env-details" aria-hidden="true">
        <span class="env-campfire"></span>
        <span class="env-smoke"></span>
        <span class="env-lamp"></span>
        <span class="env-wire wire-a"></span>
        <span class="env-wire wire-b"></span>
        <span class="env-crates"></span>
        <span class="env-sandbags"></span>
        <span class="env-barrel"></span>
        <span class="env-sign"></span>
        <span class="env-hedgehog hedge-a"></span>
        <span class="env-hedgehog hedge-b"></span>
        <span class="env-branch branch-a"></span>
        <span class="env-branch branch-b"></span>
        <span class="env-bush bush-a"></span>
        <span class="env-bush bush-b"></span>
        <span class="env-ash ash-a"></span>
        <span class="env-ash ash-b"></span>
        <span class="env-ash ash-c"></span>
      </div>
      <div class="lobby-shell">
        <section class="lobby-panel">
          <p class="lobby-kicker">SAFE CAMP</p>
          <h1>ZOMBIE RUN</h1>
          <p class="pause-copy">Survive the dead zone. Upgrade. Return stronger.</p>
          <div class="pause-actions lobby-actions">
            <button data-lobby-action="start">Start Run</button>
            <button data-lobby-action="profile">Profile</button>
            <button data-lobby-action="settings">Settings</button>
            <button data-lobby-action="quit">Exit</button>
          </div>
        </section>
        <section class="lobby-character-card" aria-label="Survivor camp">
          <div class="camp-backdrop">
            <span class="checkpoint-line"></span>
            <span class="camp-post post-left"></span>
            <span class="camp-post post-right"></span>
            <span class="distant-barricade barricade-left"></span>
            <span class="distant-barricade barricade-right"></span>
            <span class="signal-light"></span>
          </div>
          <div class="lobby-character-glow"></div>
          <div class="lobby-character"></div>
          <div class="showcase-label">
            <strong>${WEAPONS[this.selectedWeapon].title}</strong>
            <span>Starting weapon</span>
          </div>
          <div class="lobby-character-ground"></div>
        </section>
        <aside class="lobby-stats">
          <h2>Record</h2>
          <dl>
            <div><dt>Best Wave</dt><dd>${this.runStats.bestWave}</dd></div>
            <div><dt>Best Time</dt><dd>${this.formatTime(this.runStats.bestTime)}</dd></div>
            <div><dt>Total Kills</dt><dd>${this.runStats.totalKills}</dd></div>
          </dl>
        </aside>
      </div>`;
    this.bindLobbyButtons();
    this.stopLobbyAmbientZombies();
  }

  private showLobbyProfile() {
    this.stopLobbyAmbientZombies();
    this.loadPersistentProgress();
    const save = this.saveManager.save;
    const xpPct = Phaser.Math.Clamp(save.accountXp / Math.max(1, save.accountXpNext), 0, 1) * 100;
    const slots = this.saveManager.profiles;
    this.lobbyOverlay.classList.add('visible');
    this.updateCursorMode();
    this.lobbyOverlay.innerHTML = `
      <div class="lobby-static-bg" aria-hidden="true"></div>
      <div class="pause-box settings-box lobby-profile-box">
        <h1>PROFILE</h1>
        <div class="profile-card-large">
          <div class="account-avatar">NR</div>
          <div>
            <strong>${this.escapeHtml(save.nickname)}</strong>
            <span>Level ${save.accountLevel} Survivor</span>
          </div>
        </div>
        <div class="profile-xp-large">
          <span>XP ${save.accountXp} / ${save.accountXpNext}</span>
          <i style="width:${xpPct}%"></i>
        </div>
        <div class="profile-record-grid">
          <div><span>Best Wave</span><strong>${this.runStats.bestWave}</strong></div>
          <div><span>Best Time</span><strong>${this.formatTime(this.runStats.bestTime)}</strong></div>
          <div><span>Total Kills</span><strong>${this.runStats.totalKills}</strong></div>
        </div>
        <h2 class="profile-slots-title">SAVE SLOTS</h2>
        <div class="profile-slots-grid">
          ${PROFILE_IDS.map((id, index) => this.renderProfileSlot(id, index, slots[index])).join('')}
        </div>
        <div class="pause-actions">
          <button data-lobby-action="back">Back</button>
        </div>
      </div>`;
    this.bindProfileSlotButtons();
    this.bindLobbyButtons();
  }

  private renderProfileSlot(id: string, index: number, profile: SaveData | null) {
    const active = this.saveManager.activeId === id;
    if (!profile) {
      return `
        <article class="profile-slot-card empty">
          <em>SLOT ${index + 1}</em>
          <h3>Empty Profile</h3>
          <p>No survivor record yet.</p>
          <button data-profile-create="${id}">Create Profile</button>
        </article>`;
    }
    return `
      <article class="profile-slot-card ${active ? 'active' : ''}">
        <em>SLOT ${index + 1}${active ? ' - ACTIVE' : ''}</em>
        <h3>${this.escapeHtml(profile.nickname)}</h3>
        <dl>
          <div><dt>Level</dt><dd>${profile.accountLevel}</dd></div>
          <div><dt>Best Wave</dt><dd>${profile.bestWave}</dd></div>
          <div><dt>Total Kills</dt><dd>${profile.totalKills}</dd></div>
          <div><dt>Last Played</dt><dd>${this.formatProfileDate(profile.lastPlayedAt)}</dd></div>
        </dl>
        <div class="profile-slot-actions">
          <button data-profile-select="${id}" ${active ? 'disabled' : ''}>${active ? 'Active' : 'Select'}</button>
          <button data-profile-rename="${id}">Rename</button>
          <button data-profile-delete="${id}">Delete</button>
        </div>
      </article>`;
  }

  private bindProfileSlotButtons() {
    this.lobbyOverlay.querySelectorAll<HTMLButtonElement>('button[data-profile-create]').forEach((button) => {
      button.addEventListener('click', () => {
        const id = button.dataset.profileCreate;
        if (!id) return;
        const nickname = window.prompt('Enter profile nickname:', `Profile ${PROFILE_IDS.indexOf(id) + 1}`) ?? '';
        if (!nickname.trim()) return;
        this.saveManager.createProfile(id, nickname);
        this.loadPersistentProgress();
        this.showLobbyProfile();
      });
    });
    this.lobbyOverlay.querySelectorAll<HTMLButtonElement>('button[data-profile-select]').forEach((button) => {
      button.addEventListener('click', () => {
        const id = button.dataset.profileSelect;
        if (!id) return;
        this.saveManager.selectProfile(id);
        this.loadPersistentProgress();
        this.selectedWeapon = 'baseballBat';
        this.showLobbyProfile();
      });
    });
    this.lobbyOverlay.querySelectorAll<HTMLButtonElement>('button[data-profile-rename]').forEach((button) => {
      button.addEventListener('click', () => {
        const id = button.dataset.profileRename;
        if (!id) return;
        const profile = this.saveManager.profiles.find((slot) => slot?.id === id);
        const nickname = window.prompt('Rename profile:', profile?.nickname ?? 'Nickname') ?? '';
        if (!nickname.trim()) return;
        this.saveManager.renameProfile(id, nickname);
        this.loadPersistentProgress();
        this.showLobbyProfile();
      });
    });
    this.lobbyOverlay.querySelectorAll<HTMLButtonElement>('button[data-profile-delete]').forEach((button) => {
      button.addEventListener('click', () => {
        const id = button.dataset.profileDelete;
        if (!id) return;
        const profile = this.saveManager.profiles.find((slot) => slot?.id === id);
        const confirmed = window.confirm(`Delete ${profile?.nickname ?? 'this profile'}? This local progress will be lost.`);
        if (!confirmed) return;
        this.saveManager.deleteProfile(id);
        this.loadPersistentProgress();
        this.selectedWeapon = 'baseballBat';
        this.showLobbyProfile();
      });
    });
  }

  private formatProfileDate(value?: number) {
    if (!value) return 'Never';
    try {
      return new Date(value).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
    } catch {
      return 'Saved';
    }
  }

  private showPreRunMenu(stableUpdate = false) {
    this.loadPersistentProgress();
    this.lobbyOverlay.classList.add('visible');
    this.updateCursorMode();
    const weaponIds = STARTING_WEAPONS;
    const character = CHARACTER_TEMPLATES[this.selectedCharacter];
    const weapon = WEAPONS[this.selectedWeapon];
    this.lobbyOverlay.innerHTML = `
      <div class="lobby-static-bg" aria-hidden="true"></div>
      <div class="lobby-env-details" aria-hidden="true">
        <span class="env-campfire"></span>
        <span class="env-smoke"></span>
        <span class="env-lamp"></span>
        <span class="env-wire wire-a"></span>
        <span class="env-wire wire-b"></span>
        <span class="env-crates"></span>
        <span class="env-sandbags"></span>
        <span class="env-barrel"></span>
        <span class="env-sign"></span>
      </div>
      <div class="pre-run-box ${stableUpdate ? 'no-intro' : ''}">
        <header class="pre-run-header">
          <p>MISSION PREP</p>
          <h1>Prepare Run</h1>
        </header>
        <section class="pre-run-section character-focus-section">
          <div class="character-switcher">
            <button data-character-step="-1" aria-label="Previous character">&lt;</button>
            <strong>${character.title}</strong>
            <button data-character-step="1" aria-label="Next character">&gt;</button>
          </div>
          <div class="character-showcase">
            <div class="character-portrait ${this.selectedCharacter}">
              <span>${character.icon}</span>
            </div>
            <div class="character-copy">
              <p>${character.desc}</p>
              <ul>
                ${character.traits.map((trait) => `<li>${trait}</li>`).join('')}
              </ul>
            </div>
          </div>
        </section>
        <section class="pre-run-section">
          <h2>Starting Weapon</h2>
          <div class="selected-weapon-preview">
            <span>${weapon.icon}</span>
            <div>
              <strong>${weapon.title}</strong>
              <em>${weapon.tagline}</em>
            </div>
          </div>
          <div class="pre-run-card-grid weapon-grid-compact">
            ${weaponIds.map((id) => this.renderPreRunWeaponCard(id)).join('')}
          </div>
        </section>
        <aside class="loadout-overview">
          <h2>Loadout</h2>
          <div><span>Character</span><strong>${character.title}</strong></div>
          <div><span>Weapon Slot 1</span><strong>${weapon.title}</strong></div>
          <div><span>Weapon Slot 2</span><strong>Empty</strong></div>
          <div><span>Weapon Slot 3</span><strong>Empty</strong></div>
          <div class="loadout-traits"><span>Traits</span><strong>${character.traits.join(' / ')}</strong></div>
        </aside>
        <div class="pause-actions pre-run-actions">
          <button data-lobby-action="begin-run">Begin Run</button>
          <button data-lobby-action="back">Back</button>
        </div>
      </div>`;
    this.bindPreRunButtons();
    this.bindLobbyButtons();
  }

  private renderPreRunWeaponCard(id: WeaponId) {
    const weapon = WEAPONS[id];
    return `
      <button class="pre-run-card weapon-pick-card ${this.selectedWeapon === id ? 'selected' : ''}" data-prep-weapon-id="${id}">
        ${this.renderWeaponSpriteIcon(id, weapon.title, 'pre-run-icon weapon-sprite-preview')}
        <h3>${weapon.title}</h3>
        <p>${weapon.tagline}</p>
        <em>DMG ${weapon.damage} / RPM ${weapon.fireRate}</em>
      </button>`;
  }

  private bindPreRunButtons() {
    this.lobbyOverlay.querySelectorAll<HTMLButtonElement>('button[data-character-step]').forEach((button) => {
      button.addEventListener('click', () => {
        const ids = Object.keys(CHARACTER_TEMPLATES) as CharacterId[];
        const current = ids.indexOf(this.selectedCharacter);
        const step = Number(button.dataset.characterStep) || 1;
        this.selectedCharacter = ids[(current + step + ids.length) % ids.length];
        this.showPreRunMenu(true);
      });
    });
    this.lobbyOverlay.querySelectorAll<HTMLButtonElement>('button[data-prep-weapon-id]').forEach((button) => {
      button.addEventListener('click', () => {
        this.selectedWeapon = button.dataset.prepWeaponId as WeaponId;
        this.showPreRunMenu(true);
      });
    });
  }

  private showLobbyWeaponSelect() {
    this.stopLobbyAmbientZombies();
    this.loadPersistentProgress();
    const unlockedWeapons = this.getUnlockedWeaponIds();
    this.lobbyOverlay.classList.add('visible');
    this.updateCursorMode();
    this.lobbyOverlay.innerHTML = `
      <div class="lobby-static-bg" aria-hidden="true"></div>
      <div class="weapon-box lobby-weapon-box">
        <h1>CHOOSE STARTING WEAPON</h1>
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
    this.stopLobbyAmbientZombies();
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
        if (action === 'start') {
          this.requestPreRunStart();
        }
        if (action === 'begin-run') this.requestRunStart(this.selectedWeapon);
        if (action === 'weapons') this.showLobbyWeaponSelect();
        if (action === 'loadout') this.showLobbyWeaponSelect();
        if (action === 'profile') this.showLobbyProfile();
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
    this.selectedWeapon = 'baseballBat';
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

  private startLobbyAmbientZombies() {
    this.stopLobbyAmbientZombies();
  }

  private stopLobbyAmbientZombies() {
    if (this.lobbyZombieTimer !== undefined) {
      window.clearTimeout(this.lobbyZombieTimer);
      this.lobbyZombieTimer = undefined;
    }
    this.lobbyOverlay?.querySelectorAll('.ambient-zombie, .ambient-blood').forEach((node) => node.remove());
  }

  private spawnLobbyAmbientZombie() {
    const layer = this.lobbyOverlay.querySelector<HTMLDivElement>('.lobby-ambient-zombies');
    if (!layer || layer.querySelectorAll('.ambient-zombie').length >= 5) return;
    const zombie = document.createElement('button');
    const leftToRight = Math.random() < 0.5;
    const lane = Phaser.Utils.Array.GetRandom(['far', 'mid', 'edge']);
    const y = lane === 'far' ? Phaser.Math.Between(24, 36) : lane === 'mid' ? Phaser.Math.Between(47, 64) : Phaser.Math.Between(70, 82);
    const scale = lane === 'far' ? Phaser.Math.FloatBetween(0.72, 0.9) : lane === 'mid' ? Phaser.Math.FloatBetween(0.9, 1.12) : Phaser.Math.FloatBetween(1.06, 1.28);
    zombie.type = 'button';
    zombie.className = `ambient-zombie ${leftToRight ? 'run-right' : 'run-left'} ${lane}`;
    zombie.setAttribute('aria-label', 'background zombie');
    zombie.style.setProperty('--z-y', `${y}%`);
    zombie.style.setProperty('--z-scale', String(scale));
    zombie.style.setProperty('--z-duration', `${Phaser.Math.FloatBetween(4.2, 6.8).toFixed(2)}s`);
    zombie.addEventListener('click', (event) => {
      event.preventDefault();
      event.stopPropagation();
      this.popLobbyAmbientZombie(zombie);
    });
    zombie.addEventListener('animationend', () => zombie.remove(), { once: true });
    layer.appendChild(zombie);
  }

  private popLobbyAmbientZombie(zombie: HTMLElement) {
    const layer = zombie.parentElement;
    if (!layer) return;
    const rect = zombie.getBoundingClientRect();
    const parentRect = layer.getBoundingClientRect();
    const blood = document.createElement('div');
    blood.className = 'ambient-blood';
    blood.style.left = `${rect.left - parentRect.left + rect.width * 0.5}px`;
    blood.style.top = `${rect.top - parentRect.top + rect.height * 0.48}px`;
    for (let i = 0; i < 8; i += 1) {
      const p = document.createElement('i');
      const angle = (i / 8) * Math.PI * 2 + Math.random() * 0.45;
      const dist = Phaser.Math.Between(12, 34);
      p.style.setProperty('--bx', `${Math.cos(angle) * dist}px`);
      p.style.setProperty('--by', `${Math.sin(angle) * dist}px`);
      p.style.setProperty('--bs', `${Phaser.Math.Between(3, 7)}px`);
      blood.appendChild(p);
    }
    layer.appendChild(blood);
    zombie.classList.add('popped');
    window.setTimeout(() => zombie.remove(), 40);
    window.setTimeout(() => blood.remove(), 520);
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
    this.applyHitStop(boss ? 0.16 : heavy ? 0.08 : 0.04);
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

  private getPlayerMuzzlePosition(angle: number, weapon = WEAPONS[this.selectedWeapon]) {
    const visual = weapon.visual ?? WEAPON_VISUALS.pistol;
    const forward = visual.muzzleOffsetX;
    const side = visual.muzzleOffsetY;
    return {
      x: this.playerPos.x + Math.cos(angle) * forward + Math.cos(angle + Math.PI / 2) * side,
      y: this.playerPos.y + Math.sin(angle) * forward + Math.sin(angle + Math.PI / 2) * side,
    };
  }

  private muzzleFx(angle: number, weapon = WEAPONS[this.selectedWeapon]) {
    const fxScale = this.getEffectScale();
    const pos = this.getPlayerMuzzlePosition(angle, weapon);
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

  private shellFx(angle: number, weapon = WEAPONS[this.selectedWeapon]) {
    if (!this.shouldSpawnFx(1.8)) return;
    const side = angle - Math.PI / 2;
    const ejectDist = Math.max(10, weapon.visual.handOffsetX + weapon.visual.width * 0.22);
    const pos = {
      x: this.playerPos.x + Math.cos(angle) * ejectDist + Math.cos(side) * 9,
      y: this.playerPos.y + Math.sin(angle) * ejectDist + Math.sin(side) * 9,
    };
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
      UPD ${Math.round(this.updateCostMsSmoothed * 10) / 10}ms / COL ${this.collisionChecksThisFrame}<br>
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
    this.setText('dodgeText', this.rollTimer > 0 ? 'ROLL' : this.rollCooldown > 0 ? `${this.rollCooldown.toFixed(1)}s` : 'DODGE');
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
    this.medkitDrops.forEach((drop) => drop.body.destroy());
    this.bullets = [];
    this.enemyProjectiles = [];
    this.groundHazards = [];
    this.gems = [];
    this.coinDrops = [];
    this.medkitDrops = [];
    this.leveling = false;
    this.paused = false;
    this.waveUpgradePending = false;
    this.wavePrepUpgradeGranted = false;
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
    if (this.wavePhase === 'bossWarning') return `Wave ${this.wave} - Boss incoming`;
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
    }).join('|') + `|active:${this.activeWeaponSlot}|utility:${this.utilitySlotsUnlocked}:${this.turrets.length}:${Math.round(this.lastUtilitySlotPulse)}`;
  }

  private renderWeaponLoadoutHud() {
    const weaponSlots = WEAPON_SLOTS.map((slot, index) => {
      const equipped = this.getEquippedSlot(slot);
      const active = slot === this.activeWeaponSlot && Boolean(equipped);
      if (!equipped) {
        return `
          <div class="weapon-slot-card empty" data-slot="${slot}">
            <span class="weapon-slot-icon">--</span>
            <span class="weapon-slot-copy">
              <strong>${WEAPON_SLOT_LABELS[slot]}</strong>
            </span>
          </div>`;
      }
      const weapon = WEAPONS[equipped.id];
      return `
        <div class="weapon-slot-card ${active ? 'active' : ''} ${equipped.evolved ? 'evolved' : ''}" data-slot="${slot}">
          ${this.renderWeaponSpriteIcon(equipped.id, weapon.title, 'weapon-slot-icon weapon-sprite-preview')}
          <span class="weapon-slot-copy">
            <strong>${weapon.title}</strong>
          </span>
        </div>`;
    }).join('');
    const utilitySlots = Array.from({ length: UTILITY_SLOT_COUNT }, (_, index) => {
      const unlocked = index < this.utilitySlotsUnlocked;
      const turret = this.turrets[index];
      const pulse = unlocked && performance.now() - this.lastUtilitySlotPulse < 900 && index === this.utilitySlotsUnlocked - 1;
      return `
        <div class="weapon-slot-card utility-hud-slot ${unlocked ? '' : 'locked'} ${pulse ? 'active' : ''}" data-utility-slot="${index + 1}">
          ${unlocked ? `<span class="weapon-slot-icon">${turret ? 'TR' : '+'}</span>` : this.renderLockedSlotIcon('weapon-slot-icon pixel-lock-icon')}
          <span class="weapon-slot-copy">
            <strong>${unlocked ? (turret ? `Turret Mk.${turret.level}` : 'Utility') : ''}</strong>
          </span>
        </div>`;
    }).join('');
    const medkitSlot = `
      <div class="weapon-slot-card medkit-hud-slot ${this.storedMedkits > 0 ? 'active' : 'empty'}" data-medkit-slot>
        <span class="weapon-slot-icon">${this.storedMedkits > 0 ? 'HP' : '--'}</span>
        <span class="weapon-slot-copy">
          <strong>Medkit</strong>
        </span>
      </div>`;
    return weaponSlots + utilitySlots + medkitSlot;
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
