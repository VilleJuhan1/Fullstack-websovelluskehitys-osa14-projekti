import { Link } from 'react-router-dom';

// The app home page
export default function Home() {
  return (
    <div className="container flex-center" style={{ minHeight: '100vh' }}>
      <div
        className="glass-panel"
        style={{
          padding: '3rem',
          width: '100%',
          maxWidth: '600px',
          textAlign: 'center',
        }}
      >
        <h1 className="text-gradient">Quiz Platform</h1>
        <p>Choose your category</p>

        {/* Quiz selection with buttons, maybe later will use a dropdown menu and iteratation over available quizzes. */}
        <div className="grid-1-col" style={{ margin: '2rem 0' }}>
          <Link
            to="/quiz/pokemon"
            className="quiz-option"
            style={{ textDecoration: 'none', color: 'inherit' }}
          >
            Pokémon
          </Link>
          <Link
            to="/quiz/countries"
            className="quiz-option"
            style={{ textDecoration: 'none', color: 'inherit' }}
          >
            Countries
          </Link>
        </div>
      </div>
    </div>
  );
}
