/**
 * Personality-driven companion feedback for Yumi, Kai, and Luna.
 *
 * @typedef {'correctAnswer'|'wrongAnswer'|'encouragement'|'lessonComplete'|'quizComplete'|'streakContinue'|'levelUp'|'reviewNeeded'} FeedbackEventType
 *
 * @typedef {Object} FeedbackContext
 * @property {string} [languageName]
 * @property {string} [languageFlag]
 * @property {number} [streak]
 * @property {number} [level]
 * @property {number} [score]
 * @property {number} [totalQuestions]
 * @property {number} [percentage]
 * @property {number} [dueWordCount]
 * @property {string} [lessonTitle]
 * @property {number} [xpEarned]
 * @property {string} [sceneLabel]
 */

export const FEEDBACK_EVENTS = {
  correctAnswer: 'correctAnswer',
  wrongAnswer: 'wrongAnswer',
  encouragement: 'encouragement',
  lessonComplete: 'lessonComplete',
  quizComplete: 'quizComplete',
  streakContinue: 'streakContinue',
  levelUp: 'levelUp',
  reviewNeeded: 'reviewNeeded',
};

function pickRandom(messages) {
  if (!messages?.length) return '';
  return messages[Math.floor(Math.random() * messages.length)];
}

function applyContext(template, context = {}) {
  return template
    .replace(/\{languageName\}/g, context.languageName ?? 'your language')
    .replace(/\{languageFlag\}/g, context.languageFlag ?? '')
    .replace(/\{streak\}/g, String(context.streak ?? 0))
    .replace(/\{level\}/g, String(context.level ?? 1))
    .replace(/\{score\}/g, String(context.score ?? 0))
    .replace(/\{totalQuestions\}/g, String(context.totalQuestions ?? 0))
    .replace(/\{percentage\}/g, String(context.percentage ?? 0))
    .replace(/\{dueWordCount\}/g, String(context.dueWordCount ?? 0))
    .replace(/\{lessonTitle\}/g, context.lessonTitle ?? 'this lesson')
    .replace(/\{xpEarned\}/g, String(context.xpEarned ?? 0))
    .replace(/\{sceneLabel\}/g, context.sceneLabel ?? 'the café');
}

/** @type {Record<string, Record<FeedbackEventType, string[]>>} */
const COMPANION_FEEDBACK = {
  yumi: {
    correctAnswer: [
      'Yay!! That\'s amazing! You\'re so smart! 🎉✨',
      'Woohoo!! Perfect! I knew you could do it! 🌸💕',
      'Yes yes YES! That\'s totally right! ⭐🎀',
      'You nailed it!! I\'m doing a little happy dance! 💃🌸',
      'SO GOOD!! You\'re shining today! ✨💖',
    ],
    wrongAnswer: [
      'Aww, no worries! Let\'s try again together! 💪🌸',
      'Oopsie! That\'s okay — mistakes help us grow! 😊💕',
      'Almost! Take a breath and give it another go! 🌸✨',
      'Don\'t be sad! Every try makes you stronger! 💖🎀',
      'It\'s fine!! I still believe in you 100%! 🌸⭐',
    ],
    encouragement: [
      'Let\'s practice {languageName} together! Ready for {sceneLabel}? 🌸✨',
      'You\'ve got this! Cozy {languageName} time at {sceneLabel}! ☕💕',
      'I\'m so excited to learn with you today! {languageFlag} 🎀',
      'Every word we practice makes you shine brighter! 🌸💖',
    ],
    lessonComplete: [
      'You finished {lessonTitle}! I\'m SO proud of you! 🎉🌸💕',
      'Lesson complete!! You\'re getting better every day! ✨💖',
      'Yay yay YAY! {languageFlag} {languageName} superstar alert! 🌟🎀',
      'We did it together! Cozy study vibes unlocked! ☕🌸',
    ],
    quizComplete: [
      'Quiz done!! {score}/{totalQuestions} — you\'re incredible! 🎉✨',
      '{percentage}% on the quiz! My heart is so full right now! 💕🌸',
      'You worked so hard! +{xpEarned} XP of pure awesome! ⭐💖',
      'Amazing effort! Keep that cheerful energy going! 🌸🎀',
    ],
    streakContinue: [
      '🔥 {streak} days in a row!! You\'re unstoppable! 🌸✨',
      'Your {streak}-day streak is SO inspiring! Keep showing up! 💕⭐',
      '{streak} days strong!! I\'m cheering for you every single day! 🎉🌸',
      'Look at you — {streak} cozy study days! I\'m so happy! ☕💖',
    ],
    levelUp: [
      'LEVEL {level}!! You leveled up!! I\'m literally screaming! 🎉🌸✨',
      'Yay!! Level {level} unlocked! You\'re growing so fast! 💕⭐',
      'New level {level}! Every word you learn makes me smile! 🌸💖',
      'Level {level}!! This is the best news today! 🎀✨',
    ],
    reviewNeeded: [
      '📅 {dueWordCount} words want a cozy review date! Let\'s visit them! 🌸💕',
      'A little review time keeps your {languageName} flowers blooming! 🌸✨',
      '{dueWordCount} words are ready — quick review = big smiles! 💖📚',
      'Your review cards miss you! Just a few minutes together? ☕🌸',
    ],
  },

  kai: {
    correctAnswer: [
      'POGGERS! That\'s correct! +100 XP vibes! 🎮⚡',
      'BRO NO WAY! Clutch answer! GG!! 🕹️🔥',
      'EZ CLAP! You\'re built different fr fr! ⚡🎮',
      'CRITICAL HIT!! That answer was CLEAN! 💥🕹️',
      'Combo extended!! Keep that streak rolling! 🎮🔥',
    ],
    wrongAnswer: [
      'Respawn! You\'ll get it next round! 💀🎮',
      'RIP but we take those L\'s and queue again! 🕹️😂',
      'Skill issue… JK JK! Run it back, you\'ve got this! ⚡',
      'Missed input! No damage taken — try again! 🎮💪',
      'That\'s a whiff! Shake it off and go again! 🕹️🔥',
    ],
    encouragement: [
      '{languageName} quest activated! {sceneLabel} mode! {languageFlag} 🎮',
      'Player ready! Let\'s speedrun {lessonTitle}! ⚡🕹️',
      'Grind time! {languageFlag} XP awaits at {sceneLabel}! 🔥',
      'New daily quest: crush {languageName} chat! LET\'S GOOO! 🎮',
    ],
    lessonComplete: [
      'QUEST COMPLETE: {lessonTitle}! Legendary run! 🎮🏆',
      '{languageFlag} {languageName} XP farmed! Level up energy! ⚡🕹️',
      'You cleared {lessonTitle}! Speedrun approved! 🔥🎮',
      'Boss defeated — lesson done! What\'s next, champ? 🏆⚡',
    ],
    quizComplete: [
      'Quiz boss down! {score}/{totalQuestions} — {percentage}% damage! 🎮🔥',
      'Run complete! +{xpEarned} XP banked! Keep grinding! ⚡🕹️',
      '{percentage}% accuracy — your combo streak is INSANE! 🎮💥',
      'Quiz cleared! New high score energy! GG! 🏆⚡',
    ],
    streakContinue: [
      '🔥 {streak}-day combo streak!! Don\'t break the chain! 🎮⚡',
      '{streak} days logged in! That\'s pro gamer discipline! 🕹️🔥',
      'Combo x{streak}! You\'re on a roll — keep the grind! 🎮💥',
      '{streak}-day streak unlocked! Top 1% dedication! 🏆⚡',
    ],
    levelUp: [
      'LEVEL UP!! You hit Level {level}! LET\'S GOOO! 🎮🔥',
      'DING! Level {level} achieved! New perks unlocked! ⚡🕹️',
      'Level {level}! Your {languageName} build is meta now! 🎮💥',
      'GG — Level {level}! Time to flex on the leaderboard! 🏆⚡',
    ],
    reviewNeeded: [
      '📅 {dueWordCount} vocab cards respawned for review! Farm that XP! 🎮',
      'Review queue loaded — {dueWordCount} words waiting! Don\'t AFK! 🕹️⚡',
      'Daily side quest: review {dueWordCount} words! Easy XP! 🎮🔥',
      'Your {languageName} deck needs a quick grind — {dueWordCount} due! 💪🕹️',
    ],
  },

  luna: {
    correctAnswer: [
      'Precisely correct. Your wisdom grows. 🔮✨',
      'Well done, young one. That is the way. 🌟🌙',
      'The magic of language flows through you. ✨',
      'Excellent. You have mastered this spell. 🌙💫',
      'Gently, perfectly done. The stars approve. 🌟🔮',
    ],
    wrongAnswer: [
      'Hmm, not quite. Let the answer reveal itself. 🌙✨',
      'Even the stars stumble. Try once more, softly. 🔮',
      'A small misstep on the path. Return and try again. 🌙',
      'Breathe. The word will come to you. 🌟✨',
      'No worry — every mistake is a gentle teacher. 🌙💫',
    ],
    encouragement: [
      'We begin our {languageName} practice in {sceneLabel}… {languageFlag} 🌙',
      'Settle in — {lessonTitle} awaits with calm, cozy energy. ☕✨',
      'The forest is quiet. Perfect for {languageName} study. 🔮',
      'Shall we walk through {sceneLabel} together, word by word? 🌙',
    ],
    lessonComplete: [
      'Your {lessonTitle} journey rests peacefully — well done. 🌙✨',
      'The lesson is complete. Your {languageName} light grows. 🔮🌟',
      'Cozy study complete. You walked the path with grace. ☕🌙',
      '{languageFlag} words settle into your heart like moonlight. 🌙💫',
    ],
    quizComplete: [
      'The quiz ends with {score}/{totalQuestions} — steady, beautiful progress. 🌙',
      '{percentage}% correct. Your knowledge glows like starlight. ✨🔮',
      '+{xpEarned} XP earned. Each point is a quiet spell cast. 🌟',
      'Quiz complete. Rest a moment — you earned this peace. ☕🌙',
    ],
    streakContinue: [
      '🌙 {streak} days of gentle practice — like phases of the moon. ✨',
      'Your {streak}-day streak glows softly. Keep the rhythm. 🔮',
      '{streak} cozy study days in a row. The forest is proud. 🌙☕',
      '{streak} days of learning. Trust the journey, dear one. ✨🌟',
    ],
    levelUp: [
      'You have risen to Level {level}. The moon celebrates. 🌙✨',
      'Level {level} — a new chapter in your magical path. 🔮',
      'Level {level} reached. Your inner light shines brighter. 🌟💫',
      'A quiet level up to {level}. Beautiful, steady growth. 🌙☕',
    ],
    reviewNeeded: [
      '📅 {dueWordCount} words whisper for review. Shall we listen? 🌙✨',
      'A gentle reminder — {dueWordCount} words await your touch. 🔮',
      'Your review cards glow softly. {dueWordCount} need your care. 🌟',
      'Cozy review time? {dueWordCount} {languageName} words are due. ☕🌙',
    ],
  },
};

const FALLBACK_MESSAGES = {
  correctAnswer: 'Great job! ✨',
  wrongAnswer: 'Not quite — try again!',
  encouragement: 'You can do this! Keep going!',
  lessonComplete: 'Lesson complete! Well done!',
  quizComplete: 'Quiz complete! Nice work!',
  streakContinue: 'Keep your streak going! 🔥',
  levelUp: 'Level up! ⭐',
  reviewNeeded: 'Time for a quick review! 📚',
};

/**
 * Returns a personality-specific message for the given companion and event.
 *
 * @param {string} companionId - yumi | kai | luna
 * @param {FeedbackEventType} eventType
 * @param {FeedbackContext} [context]
 * @returns {string}
 */
export function getCompanionFeedback(companionId, eventType, context = {}) {
  const pool = COMPANION_FEEDBACK[companionId]?.[eventType]
    ?? COMPANION_FEEDBACK.yumi?.[eventType]
    ?? [FALLBACK_MESSAGES[eventType] ?? 'Keep going!'];

  return applyContext(pickRandom(pool), context);
}
