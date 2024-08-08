import React from 'react';

const Persons = ({ filteredPersons, handleDelete }) => {
  return (
    <div>
      {filteredPersons.length > 0 ? (
        filteredPersons.map(person => (
          <div key={person.id}>
            {person.name} {person.number}
            <button onClick={() => handleDelete(person.id)}>delete</button>
          </div>
        ))
      ) : (
        <div>No results found</div>
      )}
    </div>
  );
};

export default Persons;
