import { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useGameContext } from '../hooks/useGame';
import type { GameDataType, GameItem } from '../services/gameData';
import QuizGrid from '../components/quiz/QuizGrid';
import { CategorySelector } from '../components/quiz/CategorySelector';

// Generic quiz component for rendering the quiz page and handling the quiz logic
export default function Quiz() {
  const { category } = useParams<{ category: string }>();
  const type = (
    category === 'countries' ? 'countries' : 'pokemon'
  ) as GameDataType;

  const { getItems, loading, error } = useGameContext();
  const items = getItems(type);

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [options, setOptions] = useState<GameItem[]>([]);
  const [targetItem, setTargetItem] = useState<GameItem | null>(null);
  const [feedback, setFeedback] = useState<{
    message: string;
    color: string;
  } | null>(null);

  // Extract unique categories from items
  const availableCategories = useMemo(() => {
    const cats = new Set<string>();
    items.forEach((item) => {
      if (item.categories) {
        item.categories.forEach((c) => cats.add(c));
      }
    });
    return ['all', ...Array.from(cats)].sort();
  }, [items]);

  // Filter items based on selected category
  const filteredItems = useMemo(() => {
    if (selectedCategory === 'all') return items;
    return items.filter((item) => item.categories?.includes(selectedCategory));
  }, [items, selectedCategory]);

  const generateQuestion = useCallback(() => {
    if (filteredItems.length < 4) {
      setOptions([]);
      setTargetItem(null);
      return;
    }

    const shuffled = [...filteredItems].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, 4);

    setOptions(selected);
    setTargetItem(selected[Math.floor(Math.random() * 4)]);
    setFeedback(null);
  }, [filteredItems]);

  // Generate initial question when items load or category changes
  useEffect(() => {
    if (filteredItems.length >= 4) {
      // Use microtask to avoid "synchronous setState in effect" lint warning
      Promise.resolve().then(generateQuestion);
    } else {
      setOptions([]);
      setTargetItem(null);
    }
  }, [filteredItems, generateQuestion]);

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
      <div className="container flex-center quiz-container">
        <h2 className="text-gradient">Loading {category}...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container flex-center quiz-container">
        <h2 className="quiz-error-text">Error loading data!</h2>
      </div>
    );
  }

  return (
    <div className="container flex-center quiz-container">
      <div className="glass-panel quiz-panel">
        <h1 className="text-gradient">{category?.toUpperCase()} QUIZ</h1>

        {filteredItems.length < 4 ? (
          <div className="quiz-warning">
            Not enough items in this category to generate a quiz (minimum 4
            required).
          </div>
        ) : (
          <>
            {targetItem && (
              <div style={{ margin: '1.5rem 0' }}>
                <span className="quiz-subtitle">Which one is:</span>
                <h2 className="quiz-target-name">{targetItem.name}</h2>
              </div>
            )}

            {options.length > 0 && (
              <QuizGrid options={options} onSelect={handleSelect} />
            )}
          </>
        )}

        <div className="quiz-feedback-container">
          {feedback && (
            <div
              className="quiz-feedback"
              style={{ backgroundColor: feedback.color }}
            >
              {feedback.message}
            </div>
          )}
        </div>

        <CategorySelector
          categories={availableCategories}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />

        <div style={{ marginTop: '2rem' }}>
          <Link to="/" className="btn btn-primary">
            Back to Menu
          </Link>
        </div>
      </div>
    </div>
  );
}
