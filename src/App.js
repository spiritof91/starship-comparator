import React from 'react';
import './App.scss';
import ComparisonForm from './components/ComparisonForm'

function App() {
  return (
    <div className="App">
      <div className='container'>
        <h1>Starships comparator</h1>
        <h4 className='text-muted'>Compare ships as much as you like</h4>
        <ComparisonForm />
      </div>
    </div>
  );
}

export default App;
