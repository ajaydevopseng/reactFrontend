import React, { useState } from 'react';

const emptyForm = {
  first_name: '',
  last_name: '',
  email: '',
  phone: '',
  position: '',
  department_id: '',
  salary: '',
  hire_date: '',
  status: 'active',
};

export default function EmployeeForm({ departments, initial, onSave, onClose }) {
  const [form, setForm] = useState(
    initial
      ? {
          ...emptyForm,
          ...initial,
          department_id: initial.department_id || '',
          hire_date: initial.hire_date ? initial.hire_date.slice(0, 10) : '',
        }
      : emptyForm
  );
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.first_name || !form.last_name || !form.email) {
      setError('First name, last name and email are required.');
      return;
    }
    setSaving(true);
    try {
      await onSave({
        ...form,
        department_id: form.department_id ? Number(form.department_id) : null,
        salary: form.salary ? Number(form.salary) : 0,
        hire_date: form.hire_date || null,
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h2 className="modal-title">{initial ? 'Edit employee' : 'Add employee'}</h2>

        {error && <div className="error-banner">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div>
              <label className="form-label">First name</label>
              <input className="form-field" name="first_name" value={form.first_name} onChange={handleChange} />
            </div>
            <div>
              <label className="form-label">Last name</label>
              <input className="form-field" name="last_name" value={form.last_name} onChange={handleChange} />
            </div>
            <div className="span-2">
              <label className="form-label">Email</label>
              <input className="form-field" type="email" name="email" value={form.email} onChange={handleChange} />
            </div>
            <div>
              <label className="form-label">Phone</label>
              <input className="form-field" name="phone" value={form.phone} onChange={handleChange} />
            </div>
            <div>
              <label className="form-label">Position</label>
              <input className="form-field" name="position" value={form.position} onChange={handleChange} />
            </div>
            <div>
              <label className="form-label">Department</label>
              <select className="form-field" name="department_id" value={form.department_id} onChange={handleChange}>
                <option value="">— Unassigned —</option>
                {departments.map((d) => (
                  <option key={d.id} value={d.id}>{d.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="form-label">Status</label>
              <select className="form-field" name="status" value={form.status} onChange={handleChange}>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
            <div>
              <label className="form-label">Salary (annual)</label>
              <input className="form-field" type="number" min="0" step="1000" name="salary" value={form.salary} onChange={handleChange} />
            </div>
            <div>
              <label className="form-label">Hire date</label>
              <input className="form-field" type="date" name="hire_date" value={form.hire_date} onChange={handleChange} />
            </div>
          </div>

          <div className="modal-actions">
            <button type="button" className="btn btn-ghost" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn" disabled={saving}>
              {saving ? 'Saving…' : initial ? 'Save changes' : 'Add employee'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
