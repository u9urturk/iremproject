// CategorySelector.js
import React, { useState } from "react";

const CategorySelector = ({ categories, onSelectCategory }) => {
  const [selectedCategory, setSelectedCategory] = useState(null);

  const handleSelect = (category) => {
    setSelectedCategory(category);
    onSelectCategory(category);
  };

  return (
    <div className="w-full max-w-4xl mx-auto mt-8">
      <h2 className="text-2xl font-bold text-center mb-6">Kategori Seçimi</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {categories.map((category) => (
          <div
            key={category.id}
            className={`card shadow-md p-4 cursor-pointer border-2 
              ${selectedCategory?.id === category.id ? "border-blue-500" : "border-gray-200"}`}
            onClick={() => handleSelect(category)}
          >
            <h3 className="text-lg font-semibold text-center">{category.name}</h3>
            <img 
              src={category.image} 
              alt={category.name} 
              className="w-full h-32 object-cover mt-4 rounded"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategorySelector;
