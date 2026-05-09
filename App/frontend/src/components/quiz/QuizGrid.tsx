import React from 'react';
import QuizButton from './QuizButton';
import type { GameItem } from '../../services/gameData';

interface QuizGridProps {
  options: GameItem[];
  onSelect: (item: GameItem) => void;
}

const QuizGrid: React.FC<QuizGridProps> = ({ options, onSelect }) => {
  return (
    <div className="grid-2x2" style={{ margin: '2rem 0', width: '100%' }}>
      {options.map((option) => (
        <QuizButton key={option.id} item={option} onClick={onSelect} />
      ))}
    </div>
  );
};

export default QuizGrid;
