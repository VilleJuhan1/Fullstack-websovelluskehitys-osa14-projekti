import { Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@apollo/client/react';
import { ME } from '../services/auth';
import type { GetMeData } from '../services/auth';
import './Quiz.css';

// The app home page
export default function Home() {
  const navigate = useNavigate();
  const { data: meData } = useQuery<GetMeData>(ME, {
    fetchPolicy: 'cache-and-network',
  });

  const isLoggedIn = !!meData?.me;
  const isPremiumUser = !!meData?.me?.isPremiumUser;

  const handleDotaClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    if (!isLoggedIn) {
      navigate('/login');
    } else if (!isPremiumUser) {
      navigate('/account');
    } else {
      navigate('/quiz/dota');
    }
  };

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
          <a
            href="/quiz/dota"
            onClick={handleDotaClick}
            className="quiz-option"
            style={{ 
              textDecoration: 'none', 
              color: 'inherit',
              ...(isPremiumUser ? {} : {
                boxShadow: '0 0 15px rgba(150, 150, 150, 0.4)',
                border: '1px solid rgba(150, 150, 150, 0.6)'
              })
            }}
          >
            Dota Heroes
            {!isPremiumUser && (
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
                ⭐ Upgrade to premium to access this quiz
              </div>
            )}
          </a>
        </div>
      </div>
    </div>
  );
}
