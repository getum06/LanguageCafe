import { useState } from 'react';
import { useGameState } from './hooks/useGameState';
import Layout from './components/Layout';
import HomePage from './components/HomePage';
import CharacterSelect from './components/CharacterSelect';
import WorldMap from './components/WorldMap';
import Lesson from './components/Lesson';
import Quiz from './components/Quiz';
import ChatPractice from './components/ChatPractice';

export default function App() {
  const [page, setPage] = useState('home');
  const game = useGameState();

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
      case 'home':
        return <HomePage {...sharedProps} />;
      case 'character-select':
        return (
          <CharacterSelect
            {...sharedProps}
            selectCharacter={game.selectCharacter}
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

  return (
    <Layout state={game.state} onNavigate={navigate}>
      {renderPage()}
    </Layout>
  );
}
