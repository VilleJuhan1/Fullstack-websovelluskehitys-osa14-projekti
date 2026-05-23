export default function StreakScore({ streak }: { streak: number }) {
  return (
    <div
      className="streak-score-container"
      style={{
        margin: 'var(--space-sm) 0',
        textAlign: 'center',
        padding: 'var(--space-sm)',
        background: 'rgba(255, 255, 255, 0.05)',
        borderRadius: 'var(--radius-md)',
        border: '1px solid rgba(255, 255, 255, 0.1)'
      }}
    >
      <h3 className="text-gradient" style={{ margin: 0 }}>
        {streak < 2 ? "Two in a row starts a streak!" : `Streak: ${streak} 🔥`}
      </h3>
    </div>
  );
}
