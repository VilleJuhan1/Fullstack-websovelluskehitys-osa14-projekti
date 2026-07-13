import React from 'react';
import './QuizGrid.css';
import QuizButton from './QuizButton';
import type { GameItem } from '../../services/gameData';

interface QuizGridProps {
  options: GameItem[];
  onSelect: (item: GameItem) => void;
  disabled?: boolean;
  correctId?: number | string | null;
  feedbackState?: 'idle' | 'correct' | 'wrong';
  wrongGuesses?: (number | string)[];
}

// The component that renders the quiz options as a 2x2 grid for mobile and 1x4 for wider screens
const QuizGrid: React.FC<QuizGridProps> = ({
  options,
  onSelect,
  disabled = false,
  correctId = null,
  feedbackState = 'idle',
  wrongGuesses = [],
}) => {
  const isAnyCorrectSelected = feedbackState === 'correct';

  return (
    <div
      className="grid-2x2"
      style={{ margin: 'var(--space-xl) 0', width: '100%' }}
    >
      {options.map((option) => {
        const optionIdStr = String(option.id);
        const correctIdStr = correctId ? String(correctId) : null;

        const isCorrectSelection = isAnyCorrectSelected && optionIdStr === correctIdStr;
        const isWrongSelection = wrongGuesses.map(String).includes(optionIdStr);
        const isDimmed = isAnyCorrectSelected && optionIdStr !== correctIdStr;
        const isButtonDisabled = disabled || isWrongSelection;

        return (
          <QuizButton
            key={option.id}
            item={option}
            onClick={onSelect}
            disabled={isButtonDisabled}
            isCorrectSelection={isCorrectSelection}
            isWrongSelection={isWrongSelection}
            isDimmed={isDimmed}
          />
        );
      })}
    </div>
  );
};

export default QuizGrid;
