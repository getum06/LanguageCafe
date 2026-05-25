import { useState, useEffect } from 'react';
import { useGameState } from './hooks/useGameState';
import Layout from './components/Layout';
import HomePage from './components/HomePage';
import LanguageSelect from './components/LanguageSelect';
import CharacterSelect from './components/CharacterSelect';
import WorldMap from './components/WorldMap';
import Lesson from './components/Lesson';
import Quiz from './components/Quiz';
import ChatPractice from './components/ChatPractice';

function getInitialPage(state) {
  if (!state.selectedLanguage) return 'language-select';
  if (!state.selectedCharacter) return 'character-select';
  return 'home';
}

export default function App() {
  const game = useGameState();
  const [page, setPage] = useState(() => getInitialPage(game.state));

  // If language gets cleared externally, redirect back to language select
  useEffect(() => {
    if (!game.state.selectedLanguage && page !== 'language-select') {
      setPage('language-select');
    }
  }, [game.state.selectedLanguage]);

  function navigate(destination) {
    setPage(destination);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  const sharedProps = {
    state: game.state,
    onNavigate: navigate,
    gainXP: game.gainXP,
    loseHeart: game.loseHeart,
    gainHeart: game.gainHeart,
  };

  function renderPage() {
    switch (page) {
      case 'language-select':
        return (
          <LanguageSelect
            {...sharedProps}
            selectLanguage={game.selectLanguage}
          />
        );
      case 'character-select':
        return (
          <CharacterSelect
            {...sharedProps}
            selectCharacter={game.selectCharacter}
          />
        );
      case 'home':
        return (
          <HomePage
            {...sharedProps}
            selectLanguage={game.selectLanguage}
          />
        );
      case 'world-map':
        return <WorldMap {...sharedProps} />;
      case 'lesson':
        return (
          <Lesson
            {...sharedProps}
            completeLesson={game.completeLesson}
          />
        );
      case 'quiz':
        return (
          <Quiz
            {...sharedProps}
            completeQuiz={game.completeQuiz}
          />
        );
      case 'chat':
        return <ChatPractice {...sharedProps} />;
      default:
        return <HomePage {...sharedProps} />;
    }
  }

  // Language/character select pages get a minimal wrapper (no bottom nav clutter)
  const isOnboarding = page === 'language-select' || page === 'character-select';

  return (
    <Layout state={game.state} onNavigate={navigate} isOnboarding={isOnboarding}>
      {renderPage()}
    </Layout>
  );
}
