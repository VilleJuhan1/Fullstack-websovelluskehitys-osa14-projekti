import { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useGameContext } from '../hooks/useGame';
import type { GameDataType, GameItem } from '../services/gameData';
import QuizGrid from '../components/quiz/QuizGrid';

// Generic quiz component for rendering the quiz page and handling the quiz logic
export default function Quiz() {
  const { category } = useParams<{ category: string }>();
  const type = (
    category === 'countries' ? 'countries' : 'pokemon'
  ) as GameDataType;

  const { getItems, loading, error } = useGameContext();
  const items = getItems(type);

  const [options, setOptions] = useState<GameItem[]>([]);
  const [targetItem, setTargetItem] = useState<GameItem | null>(null);
  const [feedback, setFeedback] = useState<{
    message: string;
    color: string;
  } | null>(null);

  const generateQuestion = useCallback(() => {
    if (items.length < 4) return;

    const shuffled = [...items].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, 4);

    setOptions(selected);
    setTargetItem(selected[Math.floor(Math.random() * 4)]);
    setFeedback(null);
  }, [items]);

  // Generate initial question when items load
  // Use a check for options.length to avoid the "cascading renders" lint error
  useEffect(() => {
    if (items.length >= 4 && options.length === 0) {
      // Use microtask to avoid "synchronous setState in effect" lint warning
      Promise.resolve().then(generateQuestion);
    }
  }, [items, options.length, generateQuestion]);

  const handleSelect = (selectedItem: GameItem) => {
    if (selectedItem.id === targetItem?.id) {
      setFeedback({ message: 'Correct!', color: 'var(--color-primary)' });
      setTimeout(generateQuestion, 1000); // Generate new question after 1 second
    } else {
      setFeedback({
        message: 'Wrong! Try again.',
        color: 'var(--color-danger)',
      });
    }
  };

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

        {options.length > 0 && (
          <QuizGrid options={options} onSelect={handleSelect} />
        )}

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

        <div style={{ marginTop: '2rem' }}>
          <Link to="/" className="btn btn-primary">
            Back to Menu
          </Link>
        </div>
      </div>
    </div>
  );
}
