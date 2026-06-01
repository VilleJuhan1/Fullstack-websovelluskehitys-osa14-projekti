import './StreakScore.css';

interface StreakScoreProps {
  streak: number;
  attempts?: number;
  feedbackState?: 'idle' | 'correct' | 'wrong';
  highestStreak?: number;
  isLoggedIn?: boolean;
  isNewRecord?: boolean;
}

export default function StreakScore({
  streak,
  attempts = 0,
  feedbackState = 'idle',
  highestStreak,
  isLoggedIn = false,
  isNewRecord = false,
}: StreakScoreProps) {

  // Build container classes dynamically
  const containerClasses = [
    'streak-score-container',
    isNewRecord ? 'streak-new-record' : '',
    !isNewRecord && feedbackState === 'correct' ? 'feedback-correct' : '',
    !isNewRecord && feedbackState === 'wrong' ? 'feedback-wrong' : '',
  ]
    .filter(Boolean)
    .join(' ');

  // Build title classes dynamically
  const titleClasses = [
    'streak-score-title',
    isNewRecord ? 'streak-new-record' : '',
    !isNewRecord && streak === 0 && attempts > 0 ? 'streak-wrong' : '',
    !isNewRecord && !(streak === 0 && attempts > 0) ? 'text-gradient' : '',
  ]
    .filter(Boolean)
    .join(' ');

  // Determine main text
  let mainText = '';
  if (isNewRecord) {
    mainText = `New longest streak! ${streak} 👑`;
  } else if (streak === 0) {
    mainText = attempts === 0 ? 'Make a guess!' : 'Try again!';
  } else if (streak === 1) {
    mainText = 'Two in a row starts a streak!';
  } else {
    mainText = `Streak: ${streak} 🔥`;
  }

  return (
    <div className={containerClasses}>
      <h3 className={titleClasses}>{mainText}</h3>

      {isLoggedIn && highestStreak !== undefined && (
        <div
          className={`streak-score-pb ${isNewRecord ? 'streak-new-record' : ''}`}
        >
          {isNewRecord
            ? `Personal Best Smashed! (Previous: ${highestStreak})`
            : `Personal Best: ${highestStreak} 🔥`}
        </div>
      )}
    </div>
  );
}
