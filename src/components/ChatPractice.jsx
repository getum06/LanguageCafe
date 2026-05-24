import { useState, useRef, useEffect } from 'react';
import { CHAT_SCENARIOS } from '../data/lessonData';
import { CHARACTERS } from '../data/characters';

function checkAnswer(input, keywords) {
  const lower = input.toLowerCase().trim();
  if (!lower) return 'empty';
  return keywords.some(kw => lower.includes(kw.toLowerCase())) ? 'correct' : 'partial';
}

function getResponseForType(character, type, result, input) {
  const responses = {
    greeting: {
      correct: [
        `¡Muy bien! You greeted them perfectly! The barista looks happy to see you! 😊`,
        `¡Hola! Great greeting! You're already sounding like a native Spanish speaker! 🌟`,
      ],
      partial: [
        `That's a good try! Try using "Hola" or "Buenos días" to greet the barista! 😊`,
        `Almost! A greeting like "Hola" or "¡Buenos días!" works great here!`,
      ],
    },
    order: {
      correct: [
        `¡Perfecto! The barista understood your order! You said it so naturally! ☕`,
        `Amazing! You ordered like a pro! "Quiero un _____, por favor" is the magic phrase! 🌟`,
      ],
      partial: [
        `Good effort! Try: "Quiero un café, por favor" — that's "I want a coffee, please!"`,
        `You're on the right track! Include "quiero" (I want) + the drink name + "por favor"!`,
      ],
    },
    size: {
      correct: [
        `¡Genial! You picked your size like a true Spanish speaker! 🔝`,
        `Perfect! "Grande" for large and "pequeño" for small — easy to remember! 💪`,
      ],
      partial: [
        `Try "Grande" for large or "Pequeño" for small! You've got this!`,
        `Just say "Grande" or "Pequeño" — keep it simple and clear! 😊`,
      ],
    },
    price: {
      correct: [
        `¡Excelente! You asked the price perfectly! Now you can shop anywhere in Spain! 💰`,
        `¡Muy bien! "¿Cuánto cuesta?" is super useful — you'll use it all the time! 🛍️`,
      ],
      partial: [
        `Try asking: "¿Cuánto cuesta?" — it literally means "How much does it cost?"`,
        `The magic question is "¿Cuánto cuesta?" — you're so close! Give it a try!`,
      ],
    },
    thanks: {
      correct: [
        `¡Gracias! See? The barista is smiling! You're so polite! 💕`,
        `¡Perfecto! "¡Gracias!" is the key to every Spanish heart! They love it! 🌸`,
      ],
      partial: [
        `Just say "¡Gracias!" — it's easy and everyone will love you for it! 😊`,
        `"¡Gracias!" means thank you! Short, sweet, and super important in Spanish!`,
      ],
    },
  };

  const typeResponses = responses[type] || responses.greeting;
  const arr = typeResponses[result] || typeResponses.partial;
  return arr[Math.floor(Math.random() * arr.length)];
}

export default function ChatPractice({ state, onNavigate, gainXP }) {
  const scenarios = CHAT_SCENARIOS['cafe-ordering'];
  const character = state.selectedCharacter ? CHARACTERS[state.selectedCharacter] : CHARACTERS.yumi;

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [scenarioIdx, setScenarioIdx] = useState(0);
  const [xpEarned, setXpEarned] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const [finished, setFinished] = useState(false);
  const [started, setStarted] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  function addMessage(msg) {
    setMessages(prev => [...prev, { ...msg, id: Date.now() + Math.random() }]);
  }

  function startChat() {
    setStarted(true);
    const firstScenario = scenarios[0];
    addMessage({
      role: 'character',
      text: `¡Hola! I'm ${character.name}! Let's practice ordering at a Spanish café! Ready? 🌸`,
    });
    setTimeout(() => {
      addMessage({
        role: 'prompt',
        text: firstScenario.prompt,
        hint: firstScenario.hint,
      });
      setIsTyping(false);
    }, 800);
  }

  function handleSend() {
    const text = input.trim();
    if (!text || isTyping) return;
    setInput('');

    const scenario = scenarios[scenarioIdx];
    addMessage({ role: 'user', text });

    const result = checkAnswer(text, scenario.keywords);
    setIsTyping(true);

    setTimeout(() => {
      const responseText = getResponseForType(character, scenario.type, result, text);

      if (result === 'correct') {
        const xp = 10;
        gainXP(xp);
        setXpEarned(x => x + xp);
        addMessage({
          role: 'character',
          text: responseText,
          correct: true,
        });

        setTimeout(() => {
          const nextIdx = scenarioIdx + 1;
          if (nextIdx < scenarios.length) {
            setScenarioIdx(nextIdx);
            addMessage({
              role: 'prompt',
              text: scenarios[nextIdx].prompt,
              hint: scenarios[nextIdx].hint,
            });
          } else {
            addMessage({
              role: 'character',
              text: `🎉 ¡Increíble! You completed the whole café conversation in Spanish! I'm SO proud of you! Keep practicing and you'll be amazing! ${character.emoji}`,
              correct: true,
            });
            addMessage({
              role: 'system',
              text: `🏆 Chat Practice Complete! You earned ${xpEarned + xp} XP!`,
            });
            setFinished(true);
          }
          setIsTyping(false);
        }, 600);
      } else {
        addMessage({
          role: 'character',
          text: responseText,
          correct: false,
        });
        setIsTyping(false);
      }
    }, 800);
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  function handleHint() {
    const scenario = scenarios[scenarioIdx];
    addMessage({
      role: 'hint',
      text: `💡 Hint: ${scenario.hint}`,
    });
  }

  function handleRestart() {
    setMessages([]);
    setScenarioIdx(0);
    setXpEarned(0);
    setFinished(false);
    setStarted(false);
  }

  return (
    <div className="flex flex-col h-[calc(100vh-180px)] max-h-[700px] space-y-0">
      {/* Header */}
      <div className="flex items-center gap-3 pb-3">
        <button
          onClick={() => onNavigate('home')}
          className="w-10 h-10 rounded-xl bg-pink-100 border border-pink-200 flex items-center justify-center text-xl hover:bg-pink-200 transition-colors flex-shrink-0"
        >
          ←
        </button>
        <div className={`flex items-center gap-2 flex-1 p-2 rounded-2xl ${character.bgColor} border ${character.borderColor}`}>
          <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${character.color} 
            flex items-center justify-center text-2xl border ${character.borderColor} flex-shrink-0`}>
            {character.emoji}
          </div>
          <div>
            <div className="font-black text-gray-800 text-sm">{character.name}</div>
            <div className="text-xs text-gray-500 font-medium">{character.personality} · Café Practice</div>
          </div>
          {xpEarned > 0 && (
            <div className="ml-auto font-black text-yellow-600 text-sm bg-yellow-50 px-2 py-1 rounded-xl border border-yellow-200">
              +{xpEarned} XP ⭐
            </div>
          )}
        </div>
      </div>

      {/* Scenario progress */}
      {started && (
        <div className="pb-2">
          <div className="flex justify-between text-xs font-bold text-gray-400 mb-1">
            <span>Progress</span>
            <span>{Math.min(scenarioIdx, scenarios.length)}/{scenarios.length} prompts</span>
          </div>
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-green-300 to-teal-400 rounded-full xp-fill"
              style={{ width: `${(Math.min(scenarioIdx, scenarios.length) / scenarios.length) * 100}%` }}
            />
          </div>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-3 py-2 px-1">
        {!started ? (
          /* Welcome screen */
          <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
            <div className={`w-24 h-24 rounded-3xl bg-gradient-to-br ${character.color} 
              flex items-center justify-center text-6xl shadow-lg border-2 ${character.borderColor} animate-float`}>
              {character.emoji}
            </div>
            <div>
              <h2 className="font-black text-2xl text-gray-800 mb-2">Chat with {character.name}!</h2>
              <p className="text-gray-500 font-medium text-sm max-w-xs mx-auto">
                Practice your Spanish café conversation! {character.name} will guide you through ordering a drink step by step.
              </p>
            </div>
            <div className={`p-4 rounded-2xl ${character.bgColor} border ${character.borderColor} max-w-xs w-full text-left`}>
              <p className="font-bold text-sm text-gray-700">You'll practice:</p>
              <ul className="text-sm text-gray-600 space-y-1 mt-2">
                {['Greeting a barista', 'Ordering a drink', 'Choosing a size', 'Asking the price', 'Saying thank you!'].map((item, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <span className="text-green-400 font-black">✓</span> {item}
                  </li>
                ))}
              </ul>
            </div>
            <button onClick={startChat} className="btn-primary px-8 py-4 text-lg w-full max-w-xs">
              ¡Vamos! Let's go! 🚀
            </button>
          </div>
        ) : (
          <>
            {messages.map((msg) => (
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
                      flex items-center justify-center text-lg flex-shrink-0 border ${character.borderColor}`}>
                      {character.emoji}
                    </div>
                    <div className={`max-w-[80%] rounded-3xl rounded-bl-md px-4 py-2.5 shadow-sm border
                      ${msg.correct
                        ? 'bg-green-50 border-green-300'
                        : `${character.bgColor} ${character.borderColor}`
                      }`}>
                      {msg.correct && <span className="text-green-500 text-xs font-black block mb-1">✅ Correct!</span>}
                      <p className="font-bold text-gray-800 text-sm">{msg.text}</p>
                    </div>
                  </div>
                )}

                {msg.role === 'prompt' && (
                  <div className="flex items-end gap-2">
                    <div className={`w-8 h-8 rounded-xl bg-gradient-to-br ${character.color} 
                      flex items-center justify-center text-lg flex-shrink-0 border ${character.borderColor}`}>
                      {character.emoji}
                    </div>
                    <div className="max-w-[85%] bg-pastel-purple border-2 border-purple-300 rounded-3xl rounded-bl-md px-4 py-3 shadow-sm">
                      <p className="font-bold text-gray-800 text-sm">{msg.text}</p>
                      {msg.hint && (
                        <p className="text-purple-500 text-xs font-medium mt-1.5 italic">{msg.hint}</p>
                      )}
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
                      <p className="font-black text-purple-700">{msg.text}</p>
                    </div>
                  </div>
                )}
              </div>
            ))}

            {isTyping && (
              <div className="flex items-end gap-2">
                <div className={`w-8 h-8 rounded-xl bg-gradient-to-br ${character.color} 
                  flex items-center justify-center text-lg flex-shrink-0 border ${character.borderColor}`}>
                  {character.emoji}
                </div>
                <div className={`${character.bgColor} border ${character.borderColor} rounded-3xl rounded-bl-md px-4 py-3`}>
                  <div className="flex gap-1 items-center h-4">
                    <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
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
        <div className="pt-3 border-t-2 border-pink-100">
          <div className="flex gap-2">
            <button
              onClick={handleHint}
              className="w-10 h-10 rounded-xl bg-yellow-100 border border-yellow-200 flex items-center justify-center text-lg hover:bg-yellow-200 transition-colors flex-shrink-0"
              title="Get a hint!"
            >
              💡
            </button>
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your Spanish answer here..."
              className="flex-1 px-4 py-2.5 rounded-2xl border-2 border-pink-200 focus:border-pink-400 
                focus:outline-none font-medium text-gray-700 bg-white text-sm"
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || isTyping}
              className="w-10 h-10 rounded-xl bg-pink-400 border-2 border-pink-500 flex items-center justify-center 
                text-white text-lg hover:bg-pink-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
            >
              ➤
            </button>
          </div>
          <p className="text-center text-xs text-gray-400 font-medium mt-2">
            💡 Don't worry about perfect spelling! Just try your best! 🌸
          </p>
        </div>
      )}

      {/* Finished actions */}
      {finished && (
        <div className="pt-3 border-t-2 border-pink-100 grid grid-cols-2 gap-2">
          <button onClick={handleRestart} className="btn-secondary py-2.5 text-sm">
            🔄 Practice Again
          </button>
          <button onClick={() => onNavigate('home')} className="btn-primary py-2.5 text-sm">
            🏠 Back Home
          </button>
        </div>
      )}
    </div>
  );
}
