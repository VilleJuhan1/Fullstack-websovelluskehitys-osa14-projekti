import { useParams, Link } from 'react-router-dom';
import { useGameData } from '../services/gameData';
import type { GameDataType } from '../services/gameData';

export default function Quiz() {
  const { category } = useParams<{ category: string }>();

  // Define type dynamically from router parameter
  const type = (category === 'countries' ? 'countries' : 'pokemon') as GameDataType;
  const { items, loading, error } = useGameData(type);

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
    <div className="container flex-center" style={{ minHeight: '100vh', padding: '2rem 0' }}>
      <div className="glass-panel" style={{ padding: '2rem', width: '100%', maxWidth: '800px', textAlign: 'center' }}>
        <h1 className="text-gradient">{category?.toUpperCase()}</h1>
        <p>Found {items.length} {category} loaded from the backend.</p>

        {/* Placeholder for the Kahoot-style quiz logic */}
        <div className="grid-2x2" style={{ margin: '3rem 0' }}>
          {/* Random items to test that backend works */}
          {items.slice(0, 4).map(item => (
            <div key={item.id} className="quiz-option" style={{ pointerEvents: 'none' }}>
              <h3>{item.name}</h3>
              {item.imageUrl && (
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  style={{ width: '80px', height: '80px', objectFit: 'contain', marginTop: '1rem' }}
                />
              )}
            </div>
          ))}
        </div>

        <Link to="/" className="btn btn-primary">Back to Menu</Link>
      </div>
    </div>
  );
}
