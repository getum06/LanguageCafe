/**
 * World progression — unlock gates and map metadata.
 */
export const WORLDS = [
  {
    id: 'cozyCafe',
    name: 'Cozy Café',
    description: 'Learn greetings, drinks, and polite phrases',
    unlockXP: 0,
    theme: 'pastel café',
    emoji: '☕',
    icon: '🏠',
    lessonKey: 'cafe',
    color: 'from-amber-100 to-orange-100',
    borderColor: 'border-amber-300',
    hoverColor: 'hover:border-amber-400',
    bgDot: 'bg-amber-400',
    mapBg: 'from-pink-50 via-amber-50 to-orange-50',
    position: { top: '55%', left: '25%' },
    sparkles: ['☕', '🧁', '🍰', '✨'],
  },
  {
    id: 'animeSchool',
    name: 'Anime School',
    description: 'Learn classroom, friends, and daily school phrases',
    unlockXP: 150,
    theme: 'cherry blossom school',
    emoji: '📚',
    icon: '🏫',
    lessonKey: 'school',
    color: 'from-pink-100 to-blue-100',
    borderColor: 'border-pink-300',
    hoverColor: 'hover:border-pink-400',
    bgDot: 'bg-pink-400',
    mapBg: 'from-pink-50 via-rose-50 to-blue-50',
    position: { top: '25%', left: '55%' },
    sparkles: ['🌸', '📚', '✏️', '⭐'],
  },
  {
    id: 'nightMarket',
    name: 'Night Market',
    description: 'Learn shopping, food, and prices',
    unlockXP: 300,
    theme: 'glowing city market',
    emoji: '🏮',
    icon: '🛍️',
    lessonKey: 'market',
    color: 'from-violet-100 to-indigo-100',
    borderColor: 'border-violet-300',
    hoverColor: 'hover:border-violet-400',
    bgDot: 'bg-violet-400',
    mapBg: 'from-indigo-50 via-purple-50 to-violet-100',
    position: { top: '65%', left: '62%' },
    sparkles: ['🏮', '🥟', '🌃', '💫'],
  },
  {
    id: 'magicForest',
    name: 'Magic Forest',
    description: 'Learn nature, emotions, and adventure phrases',
    unlockXP: 500,
    theme: 'magical forest',
    emoji: '🌙',
    icon: '🌲',
    lessonKey: null,
    color: 'from-emerald-100 to-purple-100',
    borderColor: 'border-emerald-300',
    hoverColor: 'hover:border-emerald-400',
    bgDot: 'bg-emerald-400',
    mapBg: 'from-green-50 via-emerald-50 to-purple-50',
    position: { top: '30%', left: '25%' },
    sparkles: ['🌙', '🍄', '✨', '🦋'],
  },
];

export const WORLD_BY_ID = Object.fromEntries(WORLDS.map(w => [w.id, w]));

export function isWorldUnlocked(worldId, userXP = 0) {
  const world = WORLD_BY_ID[worldId];
  if (!world) return false;
  return userXP >= world.unlockXP;
}

export function getXpNeeded(worldId, userXP = 0) {
  const world = WORLD_BY_ID[worldId];
  if (!world) return 0;
  return Math.max(0, world.unlockXP - userXP);
}

/**
 * All worlds with unlock status for UI.
 */
export function getWorlds(userXP = 0) {
  return WORLDS.map(world => {
    const unlocked = userXP >= world.unlockXP;
    const xpNeeded = Math.max(0, world.unlockXP - userXP);
    return {
      ...world,
      unlocked,
      xpNeeded,
      xpRemaining: xpNeeded,
    };
  });
}

export function getUnlockedWorlds(userXP = 0) {
  return getWorlds(userXP).filter(w => w.unlocked);
}

export function getWorld(worldId) {
  return WORLD_BY_ID[worldId] ?? null;
}

/** Map legacy kebab-case area ids to camelCase world ids */
export function normalizeWorldId(worldId) {
  const legacy = {
    'cozy-cafe': 'cozyCafe',
    'anime-school': 'animeSchool',
    marketplace: 'nightMarket',
    'magic-forest': 'magicForest',
  };
  if (legacy[worldId]) return legacy[worldId];
  return WORLD_BY_ID[worldId] ? worldId : 'cozyCafe';
}
