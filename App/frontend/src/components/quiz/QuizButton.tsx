import React from 'react';
import type { GameItem } from '../../services/gameData';

interface QuizButtonProps {
  item: GameItem;
  onClick: (item: GameItem) => void;
}

const QuizButton: React.FC<QuizButtonProps> = ({ item, onClick }) => {
  return (
    <button 
      className="quiz-option" 
      onClick={() => onClick(item)} 
      style={{ 
        padding: '0.5rem', 
        overflow: 'hidden', 
        aspectRatio: '1/1',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--bg-surface-elevated)'
      }}
    >
      <img 
        src={item.imageUrl} 
        alt="Quiz option" 
        style={{ 
          width: '100%', 
          height: '100%', 
          objectFit: 'contain' 
        }} 
      />
    </button>
  );
};

export default QuizButton;
