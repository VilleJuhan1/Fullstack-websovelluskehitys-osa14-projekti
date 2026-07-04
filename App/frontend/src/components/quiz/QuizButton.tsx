import React from 'react';
import type { GameItem } from '../../services/gameData';

interface QuizButtonProps {
  item: GameItem;
  onClick: (item: GameItem) => void;
  disabled?: boolean;
}

// A component that renders the quiz options as a button with the image of the item
const QuizButton: React.FC<QuizButtonProps> = ({
  item,
  onClick,
  disabled = false,
}) => {
  return (
    <button
      className="quiz-option"
      onClick={() => onClick(item)}
      disabled={disabled}
      style={{
        padding: '0.5rem',
        overflow: 'hidden',
        aspectRatio: '1/1',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--bg-surface-elevated)',
        cursor: disabled ? 'default' : 'pointer',
        opacity: disabled ? 0.8 : 1,
        pointerEvents: disabled ? 'none' : 'auto',
      }}
    >
      <img
        src={item.imageUrl}
        alt="Quiz option"
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'contain',
        }}
      />
    </button>
  );
};

export default QuizButton;
