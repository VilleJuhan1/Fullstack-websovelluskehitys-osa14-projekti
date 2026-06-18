import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@apollo/client/react';
import './Quiz.css';
import { useGameContext } from '../hooks/useGame';
import type { GameDataType, GameItem } from '../services/gameData';
import QuizGrid from '../components/quiz/QuizGrid';
import { CategorySelector } from '../components/quiz/CategorySelector';
import StreakScore from '../components/quiz/StreakScore';
import { ME } from '../services/auth';
import type { GetMeData, ScoreItem } from '../services/auth';
import { UPDATE_STREAK_SCORE } from '../services/score';
import type { UpdateStreakScoreData } from '../services/score';

// Generic quiz component for rendering the quiz page and handling the quiz logic
export default function Quiz() {
  const { category } = useParams<{ category: string }>();
  const navigate = useNavigate();
  const type = (
    category === 'countries'
      ? 'countries'
      : category === 'dota'
        ? 'dota'
        : 'pokemon'
  ) as GameDataType;

  const { getItems, loading, error } = useGameContext();
  const items = getItems(type);

  const { data: meData } = useQuery<GetMeData>(ME, {
    fetchPolicy: 'cache-and-network',
  });
  const [updateStreakScore] = useMutation<
    UpdateStreakScoreData,
    { category: string; streak: number }
  >(UPDATE_STREAK_SCORE);

  const isLoggedIn = !!meData?.me;
  const isPremiumUser = !!meData?.me?.isPremiumUser;

  // Protect the dota quiz route
  useEffect(() => {
    if (category === 'dota' && meData && !loading) {
      // Wait for meData to load
      if (!isLoggedIn) {
        navigate('/login', { replace: true });
      } else if (!isPremiumUser) {
        navigate('/account', { replace: true });
      }
    }
  }, [category, meData, isLoggedIn, isPremiumUser, navigate, loading]);

  // Find the highest streak in the DB for the current category
  const highestStreak = useMemo(() => {
    if (!isLoggedIn || !category) return 0;
    const scores = meData?.me?.scores;
    if (!scores) return 0;
    const match = scores.find(
      (s: ScoreItem) => s.category === category.toLowerCase()
    );
    return match ? match.highestStreak : 0;
  }, [isLoggedIn, meData?.me?.scores, category]);

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [options, setOptions] = useState<GameItem[]>([]);
  const [targetItem, setTargetItem] = useState<GameItem | null>(null);
  const [streak, setStreak] = useState<number>(0);
  const [attempts, setAttempts] = useState<number>(0);
  const [feedbackState, setFeedbackState] = useState<
    'idle' | 'correct' | 'wrong'
  >('idle');

  const [initialHighestStreak, setInitialHighestStreak] = useState<number>(0);
  const prevTargetRef = useRef<GameItem | null>(null);

  // Keep track of the initial highest streak when the user is not on an active streak
  useEffect(() => {
    if (streak === 0) {
      Promise.resolve().then(() => {
        setInitialHighestStreak(highestStreak);
      });
    }
  }, [highestStreak, streak]);

  const isNewRecord = useMemo(() => {
    return (
      isLoggedIn &&
      selectedCategory === 'all' &&
      streak >= 2 &&
      streak > initialHighestStreak
    );
  }, [isLoggedIn, selectedCategory, streak, initialHighestStreak]);

  // Reset streak when a new game is started (category changes)
  useEffect(() => {
    // Use microtask to avoid "synchronous setState in effect" lint warning
    Promise.resolve().then(() => {
      setStreak(0);
      setAttempts(0);
      prevTargetRef.current = null;
      console.log('Streak reset to 0 (new game started)');
    });
  }, [category, selectedCategory]);

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

    // Filter out the previous correct target item so it never appears twice in a row
    const potentialTargets = selected.filter(
      (item) => item.id !== prevTargetRef.current?.id
    );

    // Pick randomly from potential targets, or fall back if filteredItems constraint isn't met
    const newTarget =
      potentialTargets.length > 0
        ? potentialTargets[Math.floor(Math.random() * potentialTargets.length)]
        : selected[Math.floor(Math.random() * 4)];

    prevTargetRef.current = newTarget;

    setOptions(selected);
    setTargetItem(newTarget);
    setFeedbackState('idle');

    // Blur active element to prevent focus highlight from carrying over to the next round
    // to prevent an option being pre-highlighted at the start of a round
    if (
      typeof document !== 'undefined' &&
      document.activeElement instanceof HTMLElement
    ) {
      document.activeElement.blur();
    }
  }, [filteredItems]);

  // Generate initial question when items load or category changes
  useEffect(() => {
    if (filteredItems.length >= 4) {
      // Use microtask to avoid "synchronous setState in effect" lint warning
      Promise.resolve().then(generateQuestion);
    } else {
      Promise.resolve().then(() => {
        setOptions([]);
        setTargetItem(null);
      });
    }
  }, [filteredItems, generateQuestion]);

  const handleSelect = (selectedItem: GameItem) => {
    setAttempts((prev) => prev + 1);
    if (selectedItem.id === targetItem?.id) {
      setFeedbackState('correct');
      setStreak((prev) => {
        const newStreak = prev + 1;
        console.log(`Current streak: ${newStreak}`);

        // Update DB if user is logged in, selectedCategory is 'all', and newStreak >= 2 and newStreak > highestStreak
        if (
          isLoggedIn &&
          selectedCategory === 'all' &&
          newStreak >= 2 &&
          newStreak > highestStreak
        ) {
          updateStreakScore({
            variables: {
              category: category?.toLowerCase() || '',
              streak: newStreak,
            },
            // Optimistically update Apollo cache
            update: (cache, { data }) => {
              if (data?.updateStreakScore) {
                const updatedScore = data.updateStreakScore;
                const meQueryResult = cache.readQuery<GetMeData>({
                  query: ME,
                });
                if (meQueryResult?.me) {
                  const currentScores = meQueryResult.me.scores || [];
                  const hasCategory = currentScores.some(
                    (s: ScoreItem) => s.category === updatedScore.category
                  );
                  const updatedScores = hasCategory
                    ? currentScores.map((s: ScoreItem) =>
                        s.category === updatedScore.category ? updatedScore : s
                      )
                    : [...currentScores, updatedScore];

                  cache.writeQuery<GetMeData>({
                    query: ME,
                    data: {
                      me: {
                        ...meQueryResult.me,
                        scores: updatedScores,
                      },
                    },
                  });
                }
              }
            },
          }).catch((err: unknown) =>
            console.error('Failed to update streak score:', err)
          );
        }

        return newStreak;
      });
      setTimeout(generateQuestion, 1000); // Generate new question after 1 second
    } else {
      setFeedbackState('wrong');
      setStreak(0);
      console.log('Streak reset to 0 (wrong answer)');
    }
  };

  if (loading) {
    return (
      <div className="container flex-center main-container">
        <h2 className="text-gradient">Loading {category}...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container flex-center main-container">
        <h2 className="quiz-error-text">Error loading data!</h2>
      </div>
    );
  }

  return (
    <div className="container flex-center main-container">
      <div className="glass-panel main-panel">
        <h1 className="text-gradient">{category?.toUpperCase()} QUIZ</h1>

        {filteredItems.length < 4 ? (
          <div className="quiz-warning">
            Not enough items in this category to generate a quiz (minimum 4
            required).
          </div>
        ) : (
          <>
            {targetItem && (
              <div style={{ margin: 'var(--space-lg) 0' }}>
                <span className="quiz-subtitle">Which one is:</span>
                <h2 className="quiz-target-name">{targetItem.name}</h2>
              </div>
            )}

            {options.length > 0 && (
              <QuizGrid options={options} onSelect={handleSelect} />
            )}
          </>
        )}

        <StreakScore
          streak={streak}
          attempts={attempts}
          feedbackState={feedbackState}
          highestStreak={
            selectedCategory === 'all' ? initialHighestStreak : undefined
          }
          isLoggedIn={isLoggedIn}
          isNewRecord={isNewRecord}
        />

        <CategorySelector
          categories={availableCategories}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />

        <div style={{ marginTop: 'var(--space-xl)' }}>
          <Link to="/" className="btn btn-primary">
            Back to Menu
          </Link>
        </div>
      </div>
    </div>
  );
}
