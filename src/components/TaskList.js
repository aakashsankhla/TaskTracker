// components/TaskList.js
import React, {useState} from 'react';

const TaskList = ({ tasks, onEdit, onDelete }) => {
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState('');
  const [editPriority, setEditPriority] = useState('Medium');

  const handleEditClick = (task) => {
    setEditingId(task.id);
    setEditName(task.name);
    setEditPriority(task.priority);
  };

  const handleEditSubmit = (id) => {
    onEdit(id, { name: editName, priority: editPriority });
    setEditingId(null);
  };

  return (
    <div className="task-list">
      {tasks.filter(task => !task.hidden).map(task => (
        <div 
          key={task.id} 
          className={`task ${task.style || ''} ${task.highlighted ? 'highlighted' : ''}`}
        >
          {editingId === task.id ? (
            <div className="edit-form">
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
              />
              <select
                value={editPriority}
                onChange={(e) => setEditPriority(e.target.value)}
              >
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
              <button onClick={() => handleEditSubmit(task.id)}>Save</button>
              <button onClick={() => setEditingId(null)}>Cancel</button>
            </div>
          ) : (
            <div className="task-content">
              <span className="task-name">{task.name}</span>
              <span className={`priority ${task.priority.toLowerCase()}`}>
                {task.priority}
              </span>
              <div className="task-actions">
                <button onClick={() => handleEditClick(task)}>Edit</button>
                <button onClick={() => onDelete(task.id)}>Delete</button>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default TaskList;