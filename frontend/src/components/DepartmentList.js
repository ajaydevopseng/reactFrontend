import React, { useState } from 'react';
import { api } from '../api';

export default function DepartmentList({ departments, onChanged }) {
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');

  const openNew = () => { setEditing(null); setName(''); setDescription(''); setError(''); setFormOpen(true); };
  const openEdit = (d) => { setEditing(d); setName(d.name); setDescription(d.description || ''); setError(''); setFormOpen(true); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) { setError('Department name is required.'); return; }
    try {
      if (editing) {
        await api.updateDepartment(editing.id, { name, description });
      } else {
        await api.createDepartment({ name, description });
      }
      setFormOpen(false);
      onChanged();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (d) => {
    if (!window.confirm(`Delete "${d.name}"? Employees in it will become unassigned.`)) return;
    try {
      await api.deleteDepartment(d.id);
      onChanged();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div>
      <div className="page-head">
        <div>
          <h1 className="page-title">Departments</h1>
          <p className="page-sub">{departments.length} {departments.length === 1 ? 'department' : 'departments'}</p>
        </div>
        <button className="btn" onClick={openNew}>+ Add department</button>
      </div>

      {departments.length === 0 ? (
        <div className="empty-state">No departments yet — add the first one.</div>
      ) : (
        <div className="dept-grid">
          {departments.map((d) => (
            <div className="dept-card" key={d.id}>
              <h3 className="dept-name">{d.name}</h3>
              <p className="dept-desc">{d.description || 'No description.'}</p>
              <div className="dept-meta">
                <span><span className="dept-count">{d.employee_count}</span> employees</span>
                <div className="row-actions">
                  <button className="btn btn-ghost btn-small" onClick={() => openEdit(d)}>Edit</button>
                  <button className="btn btn-danger btn-small" onClick={() => handleDelete(d)}>Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {formOpen && (
        <div className="modal-overlay" onClick={() => setFormOpen(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2 className="modal-title">{editing ? 'Edit department' : 'Add department'}</h2>
            {error && <div className="error-banner">{error}</div>}
            <form onSubmit={handleSubmit}>
              <div className="form-grid">
                <div className="span-2">
                  <label className="form-label">Name</label>
                  <input className="form-field" value={name} onChange={(e) => setName(e.target.value)} />
                </div>
                <div className="span-2">
                  <label className="form-label">Description</label>
                  <input className="form-field" value={description} onChange={(e) => setDescription(e.target.value)} />
                </div>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn btn-ghost" onClick={() => setFormOpen(false)}>Cancel</button>
                <button type="submit" className="btn">{editing ? 'Save changes' : 'Add department'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
