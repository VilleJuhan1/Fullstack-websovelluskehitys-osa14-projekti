interface StreakScoreProps {
    streak: number;
    attempts?: number;
    feedbackState?: 'idle' | 'correct' | 'wrong';
}

export default function StreakScore({ streak, attempts = 0, feedbackState = 'idle' }: StreakScoreProps) {
    let borderColor = 'rgba(255, 255, 255, 0.1)';
    let boxShadow = 'none';
    let transform = 'translateY(0)';

    if (feedbackState === 'correct') {
        borderColor = 'var(--color-primary)';
        boxShadow = '0 10px 25px -5px rgba(14, 165, 233, 0.4)';
        transform = 'translateY(-4px)';
    } else if (feedbackState === 'wrong') {
        borderColor = 'var(--color-danger)';
        boxShadow = '0 10px 25px -5px rgba(244, 63, 94, 0.4)';
        transform = 'translateY(-4px)';
    }

    return (
        <div
            className="streak-score-container"
            style={{
                margin: 'var(--space-sm) 0 var(--space-md) 0',
                textAlign: 'center',
                padding: 'var(--space-sm)',
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: 'var(--radius-md)',
                border: `2px solid ${borderColor}`,
                boxShadow,
                transform,
                transition: 'all var(--transition-bouncy)'
            }}
        >
            <h3 
                className={streak === 0 && attempts > 0 ? "" : "text-gradient"} 
                style={{ margin: 0, color: streak === 0 && attempts > 0 ? 'var(--color-danger)' : undefined }}
            >
                {streak === 0 ? (attempts === 0 ? "Make a guess!" : "Try again!") : streak === 1 ? "Two in a row starts a streak!" : `Streak: ${streak} 🔥`}
            </h3>
        </div>
    );
}
