import React from 'react';

interface CategorySelectorProps {
  categories: string[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

// A dropdown component for selecting sub-categories within the quiz
export const CategorySelector: React.FC<CategorySelectorProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
}) => {
  return (
    <div
      className="category-selector-container flex-center"
      style={{ flexDirection: 'column' }}
    >
      <label className="quiz-subtitle" style={{ fontWeight: 600 }}>
        Category
      </label>
      <select
        value={selectedCategory}
        onChange={(e) => onSelectCategory(e.target.value)}
        className="category-select"
      >
        {categories.map((cat) => (
          <option key={cat} value={cat}>
            {cat.charAt(0).toUpperCase() + cat.slice(1)}
          </option>
        ))}
      </select>
    </div>
  );
};
