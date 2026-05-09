import { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useGameContext } from '../context/GameContext';
import type { GameDataType, GameItem } from '../services/gameData';
import QuizGrid from '../components/quiz/QuizGrid';

/* 
Generic quiz component for rendering the quiz page
and handling the quiz logic.
*/
export default function Quiz() {
  const { category } = useParams<{ category: string }>();
  const type = (
    category === 'countries' ? 'countries' : 'pokemon'
  ) as GameDataType;

  // Data comes from GameProvider context
  const { getItems, loading, error } = useGameContext();
  const items = getItems(type);

  const [options, setOptions] = useState<GameItem[]>([]);
  const [targetItem, setTargetItem] = useState<GameItem | null>(null);
  const [feedback, setFeedback] = useState<{
    message: string;
    color: string;
  } | null>(null);

  // Picks four random items and chooses one as the correct answer
  const generateQuestion = useCallback(() => {
    if (items.length < 4) return;

    const shuffled = [...items].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, 4);

    setOptions(selected);
    setTargetItem(selected[Math.floor(Math.random() * 4)]);
    setFeedback(null);
  }, [items]);

  // Generate a question whenever items change (initial load or category switch)
  useEffect(() => {
    if (items.length >= 4) {
      generateQuestion();
    } else {
      // Clear stale data while loading or when dataset is too small
      setOptions([]);
      setTargetItem(null);
      setFeedback(null);
    }
  }, [items, generateQuestion]);

  // Handles the click on a quiz option*/
  const handleSelect = (selectedItem: GameItem) => {
    if (selectedItem.id === targetItem?.id) {
      setFeedback({ message: 'Correct!', color: 'var(--color-primary)' });
      setTimeout(generateQuestion, 1200);
    } else {
      setFeedback({
        message: 'Wrong! Try again.',
        color: 'var(--color-danger)',
      });
    }
  };

  // Generic fallbacks for loading and error states
  if (loading) {
    return (
      <div className="container flex-center" style={{ minHeight: '100vh' }}>
        <h2 className="text-gradient">Loading {category}...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container flex-center" style={{ minHeight: '100vh' }}>
        <h2 style={{ color: 'var(--color-danger)' }}>Error loading data!</h2>
      </div>
    );
  }

  return (
    <div
      className="container flex-center"
      style={{ minHeight: '100vh', padding: '2rem 0' }}
    >
      <div
        className="glass-panel"
        style={{
          padding: '2rem',
          width: '100%',
          maxWidth: '600px',
          textAlign: 'center',
        }}
      >
        <h1 className="text-gradient">{category?.toUpperCase()} QUIZ</h1>

        {/*Displays target name, ie. name of the pokemon or country that player has to guess*/}
        {targetItem && (
          <div style={{ margin: '1.5rem 0' }}>
            <p style={{ opacity: 0.8, marginBottom: '0.5rem' }}>
              Which one is:
            </p>
            <h2 style={{ fontSize: '2.5rem', marginBottom: '1.5rem' }}>
              {targetItem.name}
            </h2>
          </div>
        )}

        {/* Displays four options via QuizGrid component*/}
        {options.length > 0 && (
          <QuizGrid options={options} onSelect={handleSelect} />
        )}

        {/* Feedback message for correct/wrong answer*/}
        <div style={{ height: '60px', marginTop: '1rem' }}>
          {feedback && (
            <div
              style={{
                padding: '0.8rem',
                borderRadius: 'var(--radius-sm)',
                background: feedback.color,
                color: 'white',
                fontWeight: '600',
                animation: 'bounceIn 0.4s ease-out',
              }}
            >
              {feedback.message}
            </div>
          )}
        </div>

        {/* Back to menu button*/}
        <div style={{ marginTop: '2rem' }}>
          <Link to="/" className="btn btn-primary">
            Back to Menu
          </Link>
        </div>
      </div>
    </div>
  );
}
