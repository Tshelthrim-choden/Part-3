import { useEffect, useState } from 'react';
import Filter from './Component/Filter';
import PersonForm from './Component/PersonForm';
import Persons from './Component/Persons';
import server from './Server/server';
import Notification from './Component/Error';

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState('');
  const [newNumber, setNewNumber] = useState('');
  const [searchName, setSearchName] = useState('');
  const [notification, setNotification] =useState(null);

  useEffect(() => {
    server.getAll()
    .then(response => {
      setPersons(response.data);
    })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, []);

  const handleNewName = (event) => {
    setNewName(event.target.value);
  };

  const handleNewNumber = (event) => {
    setNewNumber(event.target.value);
  };

  const handleSearchName = (event) => {
    setSearchName(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const sameName = persons.find(person => person.name === newName);
    const sameNumber = persons.some(person => person.number === newNumber);

    if (sameName) {
      window.confirm(`${newName} is already added to phonebook.Replace the old number with a new one?`);
      const updatedPerson = { ...sameName, number: newNumber };
      server.update(sameName.id, updatedPerson)
        .then(response => {
          setPersons(persons.map(person =>
            person.id !== sameName.id ? person : response.data
          ));
          setNewName('');
          setNewNumber('');
          setNotification(`Updated ${newName}'s number`);
          setTimeout(() => setNotification(null), 3000);
        })
        .catch(error => {
          console.error('Error updating person:', error);
        });
    } else if (sameNumber) {
      alert(`Number ${newNumber} is already added to phonebook`);
    } else {
      const newPerson = { name: newName, number: newNumber, id: (persons.length + 1).toString()};
      server.create(newPerson).then(response =>{
        setPersons(persons.concat(response.data));
          setNewName('');
          setNewNumber('');
          setNotification(`Added ${newName}`);
          setTimeout(() => setNotification(null), 3000); 
        })
        .catch(error => {
          console.error('Error adding person:', error);
        });
    }

    setNewName('');
    setNewNumber('');
  };

  const filteredPersons =persons.filter(person =>
        person.name.toLowerCase().startsWith(searchName.toLowerCase())
      );

      const handleDelete = (id) => {
        const person = persons.find(p => p.id === id);
        if (window.confirm(`Delete ${person.name}?`)) {
          server.remove(id)
            .then(() => {
              setPersons(persons.filter(p => p.id !== id));
            })
            .catch(error => {
              console.error('Error deleting person:', error);
            });
        }
      };

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={notification} />
      <Filter searchName={searchName} handleSearchName={handleSearchName}/>
      <h2>Add a new</h2>
      <PersonForm 
        newName={newName} 
        newNumber={newNumber} 
        handleNewName={handleNewName} 
        handleNewNumber={handleNewNumber} 
        handleSubmit={handleSubmit} 
      />
      <h2>Numbers</h2>
     <Persons filteredPersons={filteredPersons} handleDelete={handleDelete}/>
    </div>
  );
};

export default App;