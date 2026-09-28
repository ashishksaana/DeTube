import React from 'react'
import './CategoriesBar.css'

const categories = [
    { id: 0, name: "All" },
    { id: 20, name: "Gaming" },
    { id: 10, name: "Music" },
    { id: 2, name: "Automobiles" },
    { id: 17, name: "Sports" },
    { id: 24, name: "Entertainment" },
    { id: 28, name: "Technology" },
    { id: 25, name: "News" },
    { id: 39, name: "Horror" },
    { id: 1, name: "Film & Animation" },
    { id: 15, name: "Pets & Animals" },
    { id: 22, name: "People & Blogs" },
    { id: 23, name: "Comedy" },
    { id: 26, name: "Howto & Style" },
    { id: 27, name: "Education" },
];

function CategoriesBar({ category, setCategory }) {
  return (
    <div className="categories-bar">
      {categories.map((cat) => (
        <button
          key={cat.id}
          className={`category-chip ${category === cat.id ? "active" : ""}`}
          onClick={() => setCategory(cat.id)}
        >
          {cat.name}
        </button>
      ))}
    </div>
  )
}

export default CategoriesBar
