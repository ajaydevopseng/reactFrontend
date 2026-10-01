import React, { useEffect, useState, useCallback } from 'react';
import { api } from './api';
import EmployeeList from './components/EmployeeList';
import DepartmentList from './components/DepartmentList';

export default function App() {
  const [view, setView] = useState('employees');
  const [departments, setDepartments] = useState([]);

  const loadDepartments = useCallback(async () => {
    try {
      const data = await api.getDepartments();
      setDepartments(data);
    } catch (err) {
      console.error(err);
    }
  }, []);

  useEffect(() => { loadDepartments(); }, [loadDepartments]);

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand"><span className="brand-mark" />Roster</div>
        <ul className="nav-list">
          <li className={`nav-item ${view === 'employees' ? 'active' : ''}`} onClick={() => setView('employees')}>
            Employees
          </li>
          <li className={`nav-item ${view === 'departments' ? 'active' : ''}`} onClick={() => setView('departments')}>
            Departments
          </li>
        </ul>
        <div className="sidebar-foot">Employee Management System</div>
      </aside>

      <main className="main">
        {view === 'employees' ? (
          <EmployeeList departments={departments} />
        ) : (
          <DepartmentList departments={departments} onChanged={loadDepartments} />
        )}
      </main>
    </div>
  );
}
