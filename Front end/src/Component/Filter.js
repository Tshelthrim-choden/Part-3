import React from 'react';

const Filter = ({ searchName, handleSearchName }) => {
  return (
    <div>
      <input 
        value={searchName} 
        onChange={handleSearchName} 
        placeholder="Search by name" 
      />
    </div>
  );
};

export default Filter;
