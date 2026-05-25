export const WORLD_STORAGE_KEY = 'lingoCafeQuest.selectedWorld';
export const LESSON_STORAGE_KEY = 'lingoCafeQuest.selectedLesson';

const VALID_WORLDS = ['cozyCafe', 'animeSchool', 'nightMarket', 'magicForest'];
const VALID_LESSONS = ['cafe', 'school', 'market'];

export function getStoredWorld() {
  try {
    const id = localStorage.getItem(WORLD_STORAGE_KEY);
    return VALID_WORLDS.includes(id) ? id : null;
  } catch {
    return null;
  }
}

export function setStoredWorld(worldId) {
  try {
    if (worldId && VALID_WORLDS.includes(worldId)) {
      localStorage.setItem(WORLD_STORAGE_KEY, worldId);
    } else {
      localStorage.removeItem(WORLD_STORAGE_KEY);
    }
  } catch {
    // ignore
  }
}

export function getStoredLesson() {
  try {
    const id = localStorage.getItem(LESSON_STORAGE_KEY);
    return VALID_LESSONS.includes(id) ? id : null;
  } catch {
    return null;
  }
}

export function setStoredLesson(lessonId) {
  try {
    if (lessonId && VALID_LESSONS.includes(lessonId)) {
      localStorage.setItem(LESSON_STORAGE_KEY, lessonId);
    } else {
      localStorage.removeItem(LESSON_STORAGE_KEY);
    }
  } catch {
    // ignore
  }
}
