import React, { useEffect, useState, useCallback } from 'react';
import { api } from '../api';
import EmployeeForm from './EmployeeForm';

const currency = (n) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n || 0);

export default function EmployeeList({ departments }) {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [deptFilter, setDeptFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await api.getEmployees({
        search: search || undefined,
        department_id: deptFilter || undefined,
        status: statusFilter || undefined,
      });
      setEmployees(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [search, deptFilter, statusFilter]);

  useEffect(() => {
    const t = setTimeout(load, 250); // debounce search
    return () => clearTimeout(t);
  }, [load]);

  const handleSave = async (payload) => {
    if (editing) {
      await api.updateEmployee(editing.id, payload);
    } else {
      await api.createEmployee(payload);
    }
    setFormOpen(false);
    setEditing(null);
    load();
  };

  const handleDelete = async (emp) => {
    if (!window.confirm(`Remove ${emp.first_name} ${emp.last_name} from the roster?`)) return;
    try {
      await api.deleteEmployee(emp.id);
      load();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div>
      <div className="page-head">
        <div>
          <h1 className="page-title">Employee roster</h1>
          <p className="page-sub">{employees.length} {employees.length === 1 ? 'record' : 'records'}</p>
        </div>
        <button className="btn" onClick={() => { setEditing(null); setFormOpen(true); }}>+ Add employee</button>
      </div>

      <div className="toolbar">
        <input
          className="field"
          placeholder="Search name or email…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select className="field" value={deptFilter} onChange={(e) => setDeptFilter(e.target.value)}>
          <option value="">All departments</option>
          {departments.map((d) => (
            <option key={d.id} value={d.id}>{d.name}</option>
          ))}
        </select>
        <select className="field" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="">All statuses</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      {error && <div className="error-banner">{error}</div>}

      {loading ? (
        <p className="loading-note">Loading roster…</p>
      ) : employees.length === 0 ? (
        <div className="empty-state">No employees match these filters yet.</div>
      ) : (
        <table className="ledger">
          <thead>
            <tr>
              <th className="row-num">#</th>
              <th>Name</th>
              <th>Position</th>
              <th>Department</th>
              <th>Salary</th>
              <th>Hired</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {employees.map((emp, i) => (
              <tr key={emp.id}>
                <td className="row-num">{i + 1}</td>
                <td>
                  <div className="name-cell">{emp.first_name} {emp.last_name}</div>
                  <div className="email-cell">{emp.email}</div>
                </td>
                <td>{emp.position || '—'}</td>
                <td>{emp.department_name || '—'}</td>
                <td>{currency(emp.salary)}</td>
                <td>{emp.hire_date ? emp.hire_date.slice(0, 10) : '—'}</td>
                <td>
                  <span className={`badge ${emp.status === 'active' ? 'badge-active' : 'badge-inactive'}`}>
                    {emp.status}
                  </span>
                </td>
                <td>
                  <div className="row-actions">
                    <button className="btn btn-ghost btn-small" onClick={() => { setEditing(emp); setFormOpen(true); }}>Edit</button>
                    <button className="btn btn-danger btn-small" onClick={() => handleDelete(emp)}>Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {formOpen && (
        <EmployeeForm
          departments={departments}
          initial={editing}
          onSave={handleSave}
          onClose={() => { setFormOpen(false); setEditing(null); }}
        />
      )}
    </div>
  );
}
