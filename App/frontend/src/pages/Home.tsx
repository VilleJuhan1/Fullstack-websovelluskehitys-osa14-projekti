import { Link } from 'react-router-dom';
import './Quiz.css';

// The app home page
export default function Home() {
  return (
    <div className="container flex-center main-container">
      <div className="glass-panel main-panel">
        <h1 className="text-gradient">Quiz Platform</h1>
        <p>Choose your theme</p>

        {/* Quiz selection with buttons, maybe later will use a dropdown menu and iteratation over available quizzes. */}
        <div className="grid-1-col" style={{ margin: 'var(--space-xl) 0' }}>
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
