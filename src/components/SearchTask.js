// components/SearchTask.js
import React from 'react';

const SearchTask = ({ searchTerm, setSearchTerm }) => {
  return (
    <div className="search-task">
      <input
        type="text"
        placeholder="Search tasks..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
    </div>
  );
};

export default SearchTask;