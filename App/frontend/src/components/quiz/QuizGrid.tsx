import React from 'react';
import QuizButton from './QuizButton';
import type { GameItem } from '../../services/gameData';

interface QuizGridProps {
  options: GameItem[];
  onSelect: (item: GameItem) => void;
}

// The component that renders the quiz options as a 2x2 grid for mobile and 1x4 for wider screens
const QuizGrid: React.FC<QuizGridProps> = ({ options, onSelect }) => {
  return (
    <div className="grid-2x2" style={{ margin: 'var(--space-xl) 0', width: '100%' }}>
      {options.map((option) => (
        <QuizButton key={option.id} item={option} onClick={onSelect} />
      ))}
    </div>
  );
};

export default QuizGrid;
