import { useState } from "react";
import "./Dashboard.css";
import {
  FaUsers,
  FaUserCheck,
  FaUserTimes,
  FaBuilding,
  FaEdit,
  FaTrash,
  FaEye,
  FaPlus,
  FaSearch,
  FaUserPlus,
  FaCalendarCheck,
} from "react-icons/fa";

const initialEmployees = [
  {
    id: "EMP001",
    name: "Vivek Srivastava",
    department: "IT Department",
    designation: "Full Stack Developer",
    email: "vivek@gmail.com",
    status: "Active",
    joinDate: "2026-05-12",
  },
  {
    id: "EMP002",
    name: "Rahul Sharma",
    department: "IT Department",
    designation: "Backend Developer",
    email: "rahul@gmail.com",
    status: "Active",
    joinDate: "2026-05-13",
  },
  {
    id: "EMP003",
    name: "Priya Patel",
    department: "HR Department",
    designation: "HR Executive",
    email: "priya@gmail.com",
    status: "Inactive",
    joinDate: "2026-05-14",
  },
];

export default function Dashboard() {
  const [employees, setEmployees] = useState(initialEmployees);
  const [search, setSearch] = useState("");
  const [editId, setEditId] = useState(null);
  const [viewEmployee, setViewEmployee] = useState(null);

  const [form, setForm] = useState({
    name: "",
    department: "",
    designation: "",
    email: "",
    status: "Active",
    joinDate: "",
  });

  const totalEmployees = employees.length;
  const activeEmployees = employees.filter((e) => e.status === "Active").length;
  const inactiveEmployees = employees.filter(
    (e) => e.status === "Inactive"
  ).length;

  const departmentStats = employees.reduce((acc, emp) => {
    acc[emp.department] = (acc[emp.department] || 0) + 1;
    return acc;
  }, {});

  const departments = Object.keys(departmentStats).length;

  const activePercentage =
    totalEmployees > 0 ? Math.round((activeEmployees / totalEmployees) * 100) : 0;

  const filteredEmployees = employees.filter((emp) =>
    `${emp.name} ${emp.department} ${emp.designation} ${emp.email}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const formatDate = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const generateEmployeeId = () => {
    const lastNumber =
      employees.length > 0
        ? Math.max(...employees.map((emp) => Number(emp.id.replace("EMP", ""))))
        : 0;

    return `EMP${String(lastNumber + 1).padStart(3, "0")}`;
  };

  const resetForm = () => {
    setForm({
      name: "",
      department: "",
      designation: "",
      email: "",
      status: "Active",
      joinDate: "",
    });
    setEditId(null);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      !form.name.trim() ||
      !form.department.trim() ||
      !form.designation.trim() ||
      !form.email.trim() ||
      !form.joinDate
    ) {
      alert("Please fill all fields");
      return;
    }

    if (editId) {
      setEmployees(
        employees.map((emp) =>
          emp.id === editId ? { ...emp, ...form } : emp
        )
      );
    } else {
      setEmployees([
        ...employees,
        {
          id: generateEmployeeId(),
          ...form,
        },
      ]);
    }

    resetForm();
  };

  const handleEdit = (emp) => {
    setEditId(emp.id);
    setForm({
      name: emp.name,
      department: emp.department,
      designation: emp.designation,
      email: emp.email,
      status: emp.status,
      joinDate: emp.joinDate,
    });

    window.scrollTo({
      top: document.body.scrollHeight,
      behavior: "smooth",
    });
  };

  const handleDelete = (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this employee?"
    );

    if (confirmDelete) {
      setEmployees(employees.filter((emp) => emp.id !== id));

      if (editId === id) {
        resetForm();
      }
    }
  };

  return (
    <main className="dashboard">
      <div className="dashboard-top">
        <div>
          <h1>Welcome back, Vivek 👋</h1>
          <p>Here’s what’s happening with your organization today.</p>
        </div>

        <div className="date-pill">Wednesday, May 28, 2026</div>
      </div>

      <div className="stats-grid">
        <div className="stat-card blue">
          <div className="stat-icon">
            <FaUsers />
          </div>
          <div>
            <p>Total Employees</p>
            <h2>{totalEmployees}</h2>
            <span>+12% from last month</span>
          </div>
        </div>

        <div className="stat-card green">
          <div className="stat-icon">
            <FaUserCheck />
          </div>
          <div>
            <p>Active Employees</p>
            <h2>{activeEmployees}</h2>
            <span>+8% from last month</span>
          </div>
        </div>

        <div className="stat-card orange">
          <div className="stat-icon">
            <FaUserTimes />
          </div>
          <div>
            <p>Inactive Employees</p>
            <h2>{inactiveEmployees}</h2>
            <span>-3% from last month</span>
          </div>
        </div>

        <div className="stat-card purple">
          <div className="stat-icon">
            <FaBuilding />
          </div>
          <div>
            <p>Departments</p>
            <h2>{departments}</h2>
            <span>+2 this month</span>
          </div>
        </div>
      </div>

      <div className="middle-grid">
        <div className="card chart-card">
          <h3>Employees by Department</h3>

          <div className="donut-wrap">
            <div className="donut">
              <div className="donut-center">
                <h2>{totalEmployees}</h2>
                <p>Total</p>
              </div>
            </div>

            <ul className="dept-list">
              {Object.entries(departmentStats).map(([department, count], index) => (
                <li key={department}>
                  <span
                    className={`dot ${
                      ["blue-dot", "green-dot", "orange-dot", "purple-dot"][
                        index % 4
                      ]
                    }`}
                  ></span>
                  <span>{department}</span>
                  <b>{count}</b>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="card recent-card">
          <h3>Recent Hires</h3>

          {employees.slice(0, 4).map((emp) => (
            <div className="recent-row" key={emp.id}>
              <div className="avatar">{emp.name.charAt(0)}</div>

              <div className="recent-info">
                <h4>{emp.name}</h4>
                <p>{emp.department}</p>
              </div>

              <span>{formatDate(emp.joinDate)}</span>
            </div>
          ))}
        </div>

        <div className="card status-card">
          <h3>Employee Status</h3>

          <div className="status-circle">
            <h2>{activePercentage}%</h2>
            <p>Active</p>
          </div>

          <div className="status-counts">
            <span>
              Active <b>{activeEmployees}</b>
            </span>
            <span>
              Inactive <b>{inactiveEmployees}</b>
            </span>
          </div>
        </div>
      </div>

      <div className="bottom-grid">
        <div className="card employee-table-card">
          <div className="table-header">
            <div>
              <h3>Recent Employees</h3>
            </div>

            <div className="search-box">
              <FaSearch />
              <input
                type="text"
                placeholder="Search employee..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Department</th>
                <th>Designation</th>
                <th>Email</th>
                <th>Status</th>
                <th>Join Date</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredEmployees.length > 0 ? (
                filteredEmployees.map((emp) => (
                  <tr key={emp.id}>
                    <td>{emp.id}</td>
                    <td>{emp.name}</td>
                    <td>{emp.department}</td>
                    <td>{emp.designation}</td>
                    <td>{emp.email}</td>
                    <td>
                      <span
                        className={
                          emp.status === "Active"
                            ? "badge active"
                            : "badge inactive"
                        }
                      >
                        {emp.status}
                      </span>
                    </td>
                    <td>{formatDate(emp.joinDate)}</td>
                    <td>
                      <div className="crud-actions">
                        <button
                          type="button"
                          className="view-btn"
                          onClick={() => setViewEmployee(emp)}
                          title="View"
                        >
                          <FaEye />
                        </button>

                        <button
                          type="button"
                          className="edit-btn"
                          onClick={() => handleEdit(emp)}
                          title="Edit"
                        >
                          <FaEdit />
                        </button>

                        <button
                          type="button"
                          className="delete-btn"
                          onClick={() => handleDelete(emp.id)}
                          title="Delete"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="empty-message">
                    No employee found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="card action-card">
          <h3>{editId ? "Update Employee" : "Add Employee"}</h3>

          <form onSubmit={handleSubmit} className="mini-form">
            <input
              name="name"
              placeholder="Name"
              value={form.name}
              onChange={handleChange}
            />

            <input
              name="department"
              placeholder="Department"
              value={form.department}
              onChange={handleChange}
            />

            <input
              name="designation"
              placeholder="Designation"
              value={form.designation}
              onChange={handleChange}
            />

            <input
              name="email"
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
            />

            <select name="status" value={form.status} onChange={handleChange}>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>

            <input
              name="joinDate"
              type="date"
              value={form.joinDate}
              onChange={handleChange}
            />

            <button type="submit">
              <FaPlus />
              {editId ? "Update" : "Add Employee"}
            </button>

            {editId && (
              <button type="button" className="cancel-btn" onClick={resetForm}>
                Cancel
              </button>
            )}
          </form>

          <div className="quick-actions">
            <h3>Quick Actions</h3>
            <button type="button" onClick={resetForm}>
              <FaUserPlus /> Add New
            </button>

            <button type="button">
              <FaCalendarCheck /> Attendance
            </button>
          </div>
        </div>
      </div>

      {viewEmployee && (
        <div className="modal-overlay">
          <div className="view-modal">
            <h3>Employee Details</h3>

            <p>
              <b>ID:</b> {viewEmployee.id}
            </p>
            <p>
              <b>Name:</b> {viewEmployee.name}
            </p>
            <p>
              <b>Department:</b> {viewEmployee.department}
            </p>
            <p>
              <b>Designation:</b> {viewEmployee.designation}
            </p>
            <p>
              <b>Email:</b> {viewEmployee.email}
            </p>
            <p>
              <b>Status:</b> {viewEmployee.status}
            </p>
            <p>
              <b>Join Date:</b> {formatDate(viewEmployee.joinDate)}
            </p>

            <button type="button" onClick={() => setViewEmployee(null)}>
              Close
            </button>
          </div>
        </div>
      )}
    </main>
  );
}