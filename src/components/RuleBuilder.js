// components/RuleBuilder.js
import React, { useState } from 'react';

const RuleBuilder = ({ rules, onAddRule, onDeleteRule, conflicts }) => {
  const [field, setField] = useState('name');
  const [operator, setOperator] = useState('contains');
  const [value, setValue] = useState('');
  const [action, setAction] = useState('style-red');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const newRule = {
      condition: { field, operator, value },
      action
    };
    
    onAddRule(newRule);
    
    // Reset form
    setField('name');
    setOperator('contains');
    setValue('');
    setAction('style-red');
  };

  return (
    <div className="rule-builder">
      <h2>Rules</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="rule-condition">
          <select value={field} onChange={(e) => setField(e.target.value)}>
            <option value="name">Task Name</option>
            <option value="priority">Priority</option>
          </select>
          
          <select value={operator} onChange={(e) => setOperator(e.target.value)}>
            <option value="contains">contains</option>
            <option value="equals">equals</option>
            {field === 'priority' && <option value="greaterThan">higher than</option>}
            {field === 'priority' && <option value="lessThan">lower than</option>}
          </select>
          
          {field === 'priority' ? (
            <select value={value} onChange={(e) => setValue(e.target.value)}>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          ) : (
            <input
              type="text"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="Value to match"
            />
          )}
        </div>
        
        <div className="rule-action">
          <select value={action} onChange={(e) => setAction(e.target.value)}>
            <option value="style-red">Highlight in red</option>
            <option value="style-yellow">Highlight in yellow</option>
            <option value="style-green">Highlight in green</option>
            <option value="highlight">Add star marker</option>
            <option value="hide">Hide task</option>
          </select>
        </div>
        
        <button type="submit">Add Rule</button>
      </form>
      
      <div className="rules-list">
        {rules.map((rule, index) => (
          <div key={index} className="rule-item">
            <span>
              If {rule.condition.field} {rule.condition.operator} "{rule.condition.value}", 
              then {rule.action.replace('style-', '').replace('-', ' ')}
            </span>
            <button onClick={() => onDeleteRule(index)}>Delete</button>
          </div>
        ))}
      </div>
      
      {conflicts.length > 0 && (
        <div className="conflicts">
          <h3>Rule Conflicts</h3>
          {conflicts.map((conflict, index) => (
            <div key={index} className="conflict">
              {conflict.message}: {conflict.actions.join(', ')}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RuleBuilder;