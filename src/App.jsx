import { useState, useEffect } from 'react';
import { useGameState } from './hooks/useGameState';
import Layout from './components/Layout';
import HomePage from './components/HomePage';
import LanguageSelect from './components/LanguageSelect';
import CharacterSelect from './components/CharacterSelect';
import WorldMap from './components/WorldMap';
import LessonSelect from './components/LessonSelect';
import Lesson from './components/Lesson';
import Quiz from './components/Quiz';
import ChatPractice from './components/ChatPractice';
import RewardsSummary from './components/RewardsSummary';
import ReviewPractice from './components/ReviewPractice';

function getInitialPage(state) {
  if (!state.selectedLanguage) return 'language-select';
  if (!state.selectedCharacter) return 'character-select';
  return 'home';
}

const LESSON_FLOW_PAGES = ['lesson', 'quiz', 'chat', 'rewards-summary'];

export default function App() {
  const game = useGameState();
  const [page, setPage] = useState(() => getInitialPage(game.state));

  useEffect(() => {
    if (!game.state.selectedLanguage && page !== 'language-select') {
      setPage('language-select');
    }
  }, [game.state.selectedLanguage, page]);

  useEffect(() => {
    if (LESSON_FLOW_PAGES.includes(page) && !game.state.selectedLesson) {
      setPage(game.state.selectedWorld ? 'lesson-select' : 'world-map');
    }
  }, [page, game.state.selectedLesson, game.state.selectedWorld]);

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
        return (
          <WorldMap
            {...sharedProps}
            selectWorld={game.selectWorld}
          />
        );
      case 'lesson-select':
        return (
          <LessonSelect
            {...sharedProps}
            startLessonFlow={game.startLessonFlow}
          />
        );
      case 'lesson':
        return (
          <Lesson
            {...sharedProps}
            completeLesson={game.completeLesson}
            recordSessionXp={game.recordSessionXp}
          />
        );
      case 'quiz':
        return (
          <Quiz
            {...sharedProps}
            completeQuiz={game.completeQuiz}
            recordSessionXp={game.recordSessionXp}
            recordSkillAttempt={game.recordSkillAttempt}
          />
        );
      case 'chat':
        return (
          <ChatPractice
            {...sharedProps}
            recordSessionXp={game.recordSessionXp}
            recordSkillAttempt={game.recordSkillAttempt}
          />
        );
      case 'rewards-summary':
        return (
          <RewardsSummary
            {...sharedProps}
            clearSessionRewards={game.clearSessionRewards}
          />
        );
      case 'review-practice':
        return (
          <ReviewPractice
            {...sharedProps}
            recordSkillAttempt={game.recordSkillAttempt}
          />
        );
      default:
        return <HomePage {...sharedProps} selectLanguage={game.selectLanguage} />;
    }
  }

  const isOnboarding = page === 'language-select' || page === 'character-select';

  return (
    <Layout state={game.state} onNavigate={navigate} isOnboarding={isOnboarding}>
      {renderPage()}
    </Layout>
  );
}
