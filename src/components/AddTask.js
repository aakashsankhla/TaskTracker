// components/AddTask.js
import React, { useState } from 'react';

const AddTask = ({ onAdd }) => {
  const [name, setName] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [step, setStep] = useState(1);
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (step === 1) {
      if (!name.trim()) {
        setError('Task name cannot be empty');
        return;
      }
      setStep(2);
      setError('');
    } else {
      onAdd({ name, priority });
      setName('');
      setPriority('Medium');
      setStep(1);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="add-task">
      {step === 1 ? (
        <div>
          <input
            type="text"
            placeholder="Enter task name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          {error && <p className="error">{error}</p>}
        </div>
      ) : (
        <div>
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
          >
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>
      )}
      <button type="submit">
        {step === 1 ? 'Next' : 'Add Task'}
      </button>
    </form>
  );
};

export default AddTask;