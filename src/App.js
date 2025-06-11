import React, { useState, useEffect } from 'react';
import TaskList from './components/TaskList';
import AddTask from './components/AddTask';
import SearchTask from './components/SearchTask';
import RuleBuilder from './components/RuleBuilder';
import './App.css';

function App() {
  const [tasks, setTasks] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [rules, setRules] = useState([]);
  const [conflicts, setConflicts] = useState([]);

  // Load tasks and rules from localStorage on initial render
  useEffect(() => {
    const savedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const savedRules = JSON.parse(localStorage.getItem('rules')) || [];
    setTasks(savedTasks);
    setRules(savedRules);
  }, []);

  // Save tasks and rules to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('rules', JSON.stringify(rules));
  }, [rules]);

  // Add a new task
  const addTask = (task) => {
    setTasks([...tasks, { ...task, id: Date.now() }]);
  };

  // Edit an existing task
  const editTask = (id, updatedTask) => {
    setTasks(tasks.map(task => task.id === id ? { ...task, ...updatedTask } : task));
  };

  // Delete a task
  const deleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  // Filter tasks based on search term
  const filteredTasks = tasks.filter(task =>
    task.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Add a new rule
  const addRule = (rule) => {
    const newRules = [...rules, rule];
    setRules(newRules);
    checkForConflicts(newRules);
  };

  // Delete a rule
  const deleteRule = (index) => {
    const newRules = rules.filter((_, i) => i !== index);
    setRules(newRules);
    checkForConflicts(newRules);
  };

  // Check for rule conflicts
  const checkForConflicts = (rulesToCheck) => {
    const newConflicts = [];
    
    // Check for conflicting styling rules
    const styleConflicts = {};
    rulesToCheck.forEach(rule => {
      if (rule.action.startsWith('style-')) {
        const target = rule.condition.target;
        if (!styleConflicts[target]) {
          styleConflicts[target] = [];
        }
        styleConflicts[target].push(rule.action);
      }
    });

    // If a task has multiple style rules, it's a conflict
    for (const [target, actions] of Object.entries(styleConflicts)) {
      if (actions.length > 1) {
        newConflicts.push({
          target,
          actions,
          message: `Multiple style actions for ${target}`
        });
      }
    }

    setConflicts(newConflicts);
  };

  // Apply rules to tasks
  const applyRules = (taskList) => {
    let processedTasks = [...taskList];
    
    // Apply each rule
    rules.forEach(rule => {
      processedTasks = processedTasks.map(task => {
        // Check if task matches rule condition
        const matches = evaluateCondition(task, rule.condition);
        
        if (matches) {
          // Apply the action
          return applyAction(task, rule.action);
        }
        return task;
      });
    });
    
    return processedTasks;
  };

  // Evaluate a condition against a task
  const evaluateCondition = (task, condition) => {
    const { field, operator, value } = condition;
    const taskValue = task[field];
    
    switch (operator) {
      case 'contains':
        return taskValue.includes(value);
      case 'equals':
        return taskValue === value;
      case 'greaterThan':
        return taskValue > value;
      case 'lessThan':
        return taskValue < value;
      default:
        return false;
    }
  };

  // Apply an action to a task
  const applyAction = (task, action) => {
    if (action.startsWith('style-')) {
      const style = action.split('-')[1];
      return { ...task, style };
    } else if (action === 'highlight') {
      return { ...task, highlighted: true };
    } else if (action === 'hide') {
      return { ...task, hidden: true };
    }
    return task;
  };

  // Get tasks with rules applied
  const processedTasks = applyRules(filteredTasks);

  return (
    <div className="app">
      <h1>Task Tracker</h1>
      
      <div className="app-container">
        <div className="task-section">
          <SearchTask searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
          <AddTask onAdd={addTask} />
          <TaskList 
            tasks={processedTasks} 
            onEdit={editTask} 
            onDelete={deleteTask} 
          />
        </div>
        
        <div className="rules-section">
          <RuleBuilder 
            rules={rules} 
            onAddRule={addRule} 
            onDeleteRule={deleteRule} 
            conflicts={conflicts}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
