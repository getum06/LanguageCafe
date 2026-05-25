import { useState, useRef, useEffect } from 'react';
import { getChatPromptSkillMeta } from '../data/skillReview';
import { getLanguagePack, getVocabByKey, resolveLessonKey } from '../data/lessonContent';
import { getWorld } from '../data/worlds';
import { CHARACTERS } from '../data/characters';

function checkAnswer(input, keywords) {
  const lower = input.toLowerCase().trim();
  if (!lower) return 'empty';
  return keywords.some(kw => lower.includes(kw.toLowerCase())) ? 'correct' : 'partial';
}

function buildFeedback(languageId, languageName, lessonKey, type, result) {
  const hello = getVocabByKey(languageId, lessonKey, 'hello')?.word;
  const iWant = getVocabByKey(languageId, lessonKey, 'iWant')?.word;
  const please = getVocabByKey(languageId, lessonKey, 'please')?.word;
  const thankYou = getVocabByKey(languageId, lessonKey, 'thankYou')?.word;

  const map = {
    greeting: {
      correct: [
        `¡Perfecto! Great greeting! The barista looks happy to see you! 😊`,
        `Wonderful! You said hello like a true ${languageName} speaker! 🌟`,
      ],
      partial: [
        `Almost! Try a greeting like "${hello}" — that means "hello"!`,
        `Good effort! In ${languageName} you'd say "${hello}" to greet someone!`,
      ],
    },
    order: {
      correct: [
        `The barista understood you perfectly! Great ordering! ☕`,
        `Amazing! You ordered like a pro ${languageName} speaker! 🌟`,
      ],
      partial: [
        `Try using "${iWant}" + a drink name + "${please}"!`,
        `So close! Include the word for "I want" (${iWant}) in your order!`,
      ],
    },
    size: {
      correct: [
        `You picked your size perfectly! ✨`,
        `Great job! Size words are super useful everywhere! 💪`,
      ],
      partial: [
        `For large or small in ${languageName}, check the hint! 😊`,
        `Try saying large or small — peek at the hint if you need it!`,
      ],
    },
    price: {
      correct: [
        `You asked the price perfectly! You can shop anywhere now! 💰`,
        `Excellent! That question works in any ${languageName}-speaking café or shop! 🛍️`,
      ],
      partial: [
        `To ask the price in ${languageName}, check the hint! 💡`,
        `Almost! Peek at the hint for how to ask "how much?" in ${languageName}!`,
      ],
    },
    thanks: {
      correct: [
        `"${thankYou}"! The barista is smiling! 💕`,
        `So polite! "${thankYou}" is the key to every ${languageName} heart! 🌸`,
      ],
      partial: [
        `Try saying "${thankYou}" — that means thank you! 💕`,
        `Just say "${thankYou}" and you're done! 😊`,
      ],
    },
  };

  const responses = map[type] || map.greeting;
  const list = responses[result] || responses.partial;
  return list[Math.floor(Math.random() * list.length)];
}

function CharacterFeedback({ character, isCorrect }) {
  const getMsg = (arr) => arr[Math.floor(Math.random() * arr.length)];
  if (!character) return null;
  return isCorrect ? getMsg(character.correct) : getMsg(character.wrong);
}

export default function ChatPractice({ state, onNavigate, gainXP, recordSessionXp, recordSkillAttempt }) {
  const lessonKey = resolveLessonKey(state);
  const pack = getLanguagePack(state.selectedLanguage, lessonKey);
  const { meta: language, lesson, chat } = pack;
  const world = state.selectedWorld ? getWorld(state.selectedWorld) : null;
  const character = state.selectedCharacter ? CHARACTERS[state.selectedCharacter] : CHARACTERS.yumi;
  const prompts = chat.prompts;
  const sceneLabel = world?.name ?? lesson.title;

  const [messages, setMessages]     = useState([]);
  const [input, setInput]           = useState('');
  const [promptIdx, setPromptIdx]   = useState(0);
  const [xpEarned, setXpEarned]     = useState(0);
  const [isTyping, setIsTyping]     = useState(false);
  const [finished, setFinished]     = useState(false);
  const [started, setStarted]       = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef       = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  function addMsg(msg) {
    setMessages(prev => [...prev, { ...msg, id: Date.now() + Math.random() }]);
  }

  function startChat() {
    setStarted(true);
    addMsg({
      role: 'character',
      text: `${character.emoji} ${character.id === 'yumi'
        ? `Let's practice ${language.name} together! ${language.flag} Ready for ${sceneLabel}? 🌸`
        : character.id === 'kai'
        ? `${language.name} quest activated! ${language.flag} ${sceneLabel} mode! 🎮`
        : `We begin our ${language.name} practice in ${sceneLabel}… ${language.flag} 🌙`}`,
    });
    setTimeout(() => {
      addMsg({ role: 'prompt', text: prompts[0].prompt, hint: prompts[0].hint });
      setIsTyping(false);
    }, 700);
  }

  function handleSend() {
    const text = input.trim();
    if (!text || isTyping) return;
    setInput('');

    const prompt = prompts[promptIdx];
    addMsg({ role: 'user', text });

    const result = checkAnswer(text, prompt.keywords);
    setIsTyping(true);

    setTimeout(() => {
      const isCorrect = result === 'correct';
      const isPartial = result === 'partial';
      const { skill, wordKey } = getChatPromptSkillMeta(prompt);

      if (isCorrect) {
        recordSkillAttempt?.(skill, true, wordKey, lessonKey);
      } else if (isPartial || result === 'empty') {
        recordSkillAttempt?.(skill, false, wordKey, lessonKey);
      }

      const langFeedback = buildFeedback(language.id, language.name, lessonKey, prompt.type, result);
      const charMsg = isCorrect
        ? (character ? CharacterFeedback({ character, isCorrect: true }) : null)
        : null;

      const responseText = charMsg ? `${charMsg} ${langFeedback}` : langFeedback;

      addMsg({ role: 'character', text: responseText, correct: isCorrect });

      if (isCorrect) {
        const xp = chat.xpPerCorrect;
        gainXP(xp);
        recordSessionXp?.('chat', xp);
        setXpEarned(x => x + xp);

        setTimeout(() => {
          const next = promptIdx + 1;
          if (next < prompts.length) {
            setPromptIdx(next);
            addMsg({ role: 'prompt', text: prompts[next].prompt, hint: prompts[next].hint });
          } else {
            addMsg({
              role: 'character',
              text: `🎉 ${character.id === 'yumi' ? 'You did AMAZING!' : character.id === 'kai' ? 'GG EZ! You crushed it!' : 'Your practice is complete.'}
You just had a full ${language.name} conversation! ${language.flag} Keep practicing! ${character.emoji}`,
              correct: true,
            });
            addMsg({ role: 'system', text: `🏆 Chat Complete! +${xpEarned + xp} XP total earned!` });
            setFinished(true);
          }
          setIsTyping(false);
        }, 500);
      } else {
        setIsTyping(false);
      }
    }, 750);
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
  }

  function handleHint() {
    addMsg({ role: 'hint', text: `💡 Hint: ${prompts[promptIdx].hint}` });
  }

  function handleRestart() {
    setMessages([]); setPromptIdx(0); setXpEarned(0);
    setFinished(false); setStarted(false);
  }

  return (
    <div className="flex flex-col h-[calc(100vh-180px)] max-h-[700px]">
      {/* Header */}
      <div className="flex items-center gap-3 pb-3 flex-shrink-0">
        <button
          onClick={() => onNavigate('quiz')}
          className="w-10 h-10 rounded-xl bg-pink-100 border border-pink-200 flex items-center justify-center text-xl hover:bg-pink-200 transition-colors flex-shrink-0"
        >
          ←
        </button>
        <div className={`flex items-center gap-2 flex-1 p-2 rounded-2xl ${character.bgColor} border ${character.borderColor} overflow-hidden`}>
          <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${character.color}
            flex items-center justify-center text-2xl border ${character.borderColor} flex-shrink-0`}>
            {character.emoji}
          </div>
          <div className="min-w-0">
            <div className="font-black text-gray-800 text-sm">{character.name}</div>
            <div className="text-xs text-gray-500 truncate">
              {language.flag} {language.name} · {lesson.title}
            </div>
          </div>
          {xpEarned > 0 && (
            <div className="ml-auto font-black text-yellow-600 text-sm bg-yellow-50 px-2 py-1 rounded-xl border border-yellow-200 flex-shrink-0">
              +{xpEarned} XP ⭐
            </div>
          )}
        </div>
      </div>

      {/* Progress bar */}
      {started && (
        <div className="pb-2 flex-shrink-0">
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-green-300 to-teal-400 rounded-full xp-fill"
              style={{ width: `${(Math.min(promptIdx, prompts.length) / prompts.length) * 100}%` }}
            />
          </div>
          <div className="flex justify-between text-xs font-bold text-gray-400 mt-0.5">
            <span>{language.flag} {lesson.title}</span>
            <span>{Math.min(promptIdx, prompts.length)}/{prompts.length}</span>
          </div>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-3 py-2 px-0.5">
        {!started ? (
          /* Welcome screen */
          <div className="h-full flex flex-col items-center justify-center text-center space-y-4 py-4">
            <div className={`w-20 h-20 rounded-3xl bg-gradient-to-br ${character.color}
              flex items-center justify-center text-5xl shadow-lg border-2 ${character.borderColor} animate-float`}>
              {character.emoji}
            </div>
            <div>
              <h2 className="font-black text-xl text-gray-800 mb-1">
                {language.flag} {lesson.title} with {character.name}!
              </h2>
              <p className="text-gray-500 font-medium text-sm max-w-xs mx-auto">
                Practice {language.name} in {sceneLabel}! {character.name} will guide you step by step.
              </p>
            </div>
            <div className={`p-4 rounded-2xl ${character.bgColor} border ${character.borderColor} max-w-xs w-full text-left`}>
              <p className="font-bold text-sm text-gray-700 mb-2">You'll practice:</p>
              <ul className="text-sm text-gray-600 space-y-1">
                {['Greeting the barista', 'Ordering a drink', 'Choosing a size', 'Asking the price', 'Saying thank you!'].map((item, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <span className="text-green-400 font-black">✓</span> {item}
                    <span className="text-gray-400 text-xs ml-auto">{language.flag}</span>
                  </li>
                ))}
              </ul>
            </div>
            <button onClick={startChat} className="btn-primary px-8 py-4 text-base w-full max-w-xs">
              {language.id === 'japanese' ? '始めましょう！' :
               language.id === 'korean'   ? '시작합시다!' :
               language.id === 'french'   ? 'Allons-y! 🚀' :
               language.id === 'italian'  ? 'Andiamo! 🚀' :
               '¡Vamos! Let\'s go! 🚀'}
            </button>
          </div>
        ) : (
          <>
            {messages.map(msg => (
              <div key={msg.id}>
                {msg.role === 'user' && (
                  <div className="flex justify-end">
                    <div className="max-w-[80%] bg-pastel-pink border-2 border-pink-300 rounded-3xl rounded-br-md px-4 py-2.5 shadow-sm">
                      <p className="font-bold text-gray-800 text-sm">{msg.text}</p>
                    </div>
                  </div>
                )}

                {msg.role === 'character' && (
                  <div className="flex items-end gap-2">
                    <div className={`w-8 h-8 rounded-xl bg-gradient-to-br ${character.color}
                      flex items-center justify-center text-base flex-shrink-0 border ${character.borderColor}`}>
                      {character.emoji}
                    </div>
                    <div className={`max-w-[80%] rounded-3xl rounded-bl-md px-4 py-2.5 shadow-sm border
                      ${msg.correct
                        ? 'bg-green-50 border-green-300'
                        : `${character.bgColor} ${character.borderColor}`}`}>
                      {msg.correct && <span className="text-green-500 text-xs font-black block mb-1">✅ Correct!</span>}
                      <p className="font-bold text-gray-800 text-sm">{msg.text}</p>
                    </div>
                  </div>
                )}

                {msg.role === 'prompt' && (
                  <div className="flex items-end gap-2">
                    <div className={`w-8 h-8 rounded-xl bg-gradient-to-br ${character.color}
                      flex items-center justify-center text-base flex-shrink-0 border ${character.borderColor}`}>
                      {character.emoji}
                    </div>
                    <div className="max-w-[85%] bg-pastel-purple border-2 border-purple-300 rounded-3xl rounded-bl-md px-4 py-3 shadow-sm">
                      <p className="font-bold text-gray-800 text-sm">{msg.text}</p>
                      {msg.hint && <p className="text-purple-400 text-xs font-medium mt-1 italic">{msg.hint}</p>}
                    </div>
                  </div>
                )}

                {msg.role === 'hint' && (
                  <div className="flex justify-center">
                    <div className="bg-yellow-50 border border-yellow-200 rounded-2xl px-4 py-2 text-sm font-bold text-yellow-700 shadow-sm">
                      {msg.text}
                    </div>
                  </div>
                )}

                {msg.role === 'system' && (
                  <div className="flex justify-center">
                    <div className="bg-gradient-to-r from-pink-100 to-purple-100 border-2 border-purple-200 rounded-2xl px-6 py-3 text-center">
                      <p className="font-black text-purple-700 text-sm">{msg.text}</p>
                    </div>
                  </div>
                )}
              </div>
            ))}

            {isTyping && (
              <div className="flex items-end gap-2">
                <div className={`w-8 h-8 rounded-xl bg-gradient-to-br ${character.color}
                  flex items-center justify-center text-base flex-shrink-0 border ${character.borderColor}`}>
                  {character.emoji}
                </div>
                <div className={`${character.bgColor} border ${character.borderColor} rounded-3xl rounded-bl-md px-4 py-3`}>
                  <div className="flex gap-1 items-center h-4">
                    {[0, 150, 300].map(delay => (
                      <div key={delay} className="w-2 h-2 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: `${delay}ms` }} />
                    ))}
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Input area */}
      {started && !finished && (
        <div className="pt-3 border-t-2 border-pink-100 flex-shrink-0">
          <div className="flex gap-2">
            <button
              onClick={handleHint}
              className="w-10 h-10 rounded-xl bg-yellow-100 border border-yellow-200 flex items-center justify-center hover:bg-yellow-200 transition-colors flex-shrink-0 text-lg"
              title="Get a hint"
            >💡</button>
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={`Type in ${language.name}…`}
              className="flex-1 px-4 py-2.5 rounded-2xl border-2 border-pink-200 focus:border-pink-400
                focus:outline-none font-medium text-gray-700 bg-white text-sm"
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || isTyping}
              className="w-10 h-10 rounded-xl bg-pink-400 border-2 border-pink-500 flex items-center
                justify-center text-white hover:bg-pink-500 transition-colors
                disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
            >
              ➤
            </button>
          </div>
          <p className="text-center text-xs text-gray-400 font-medium mt-1.5">
            💡 Don't worry about perfect spelling — just try! 🌸
          </p>
        </div>
      )}

      {/* Finished actions */}
      {finished && (
        <div className="pt-3 border-t-2 border-pink-100 grid grid-cols-2 gap-2 flex-shrink-0">
          <button onClick={handleRestart} className="btn-secondary py-2.5 text-sm">🔄 Again</button>
          <button onClick={() => onNavigate('rewards-summary')} className="btn-primary py-2.5 text-sm">🏆 Rewards →</button>
        </div>
      )}
    </div>
  );
}
