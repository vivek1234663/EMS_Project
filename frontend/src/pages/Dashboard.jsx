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
  {
    id: "EMP004",
    name: "Amit Verma",
    department: "Finance Department",
    designation: "Accountant",
    email: "amit@gmail.com",
    status: "Active",
    joinDate: "2026-05-15",
  },
  {
    id: "EMP005",
    name: "Neha Singh",
    department: "Marketing Department",
    designation: "Marketing Executive",
    email: "neha@gmail.com",
    status: "Active",
    joinDate: "2026-05-16",
  },
];

const initialDepartments = [
  { id: 1, name: "IT Department", color: "#2563eb" },
  { id: 2, name: "HR Department", color: "#22c55e" },
  { id: 3, name: "Finance Department", color: "#f97316" },
  { id: 4, name: "Marketing Department", color: "#7c3aed" },
];

const colors = ["#2563eb", "#22c55e", "#f97316", "#7c3aed", "#ec4899"];

export default function Dashboard() {
  const [employees, setEmployees] = useState(initialEmployees);
  const [departmentsList, setDepartmentsList] = useState(initialDepartments);

  const [search, setSearch] = useState("");
  const [editId, setEditId] = useState(null);
  const [viewEmployee, setViewEmployee] = useState(null);
  const [showFormModal, setShowFormModal] = useState(false);

  const [deptName, setDeptName] = useState("");
  const [deptEditId, setDeptEditId] = useState(null);

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
  const inactiveEmployees = employees.filter((e) => e.status === "Inactive").length;
  const departments = departmentsList.length;

  const activePercentage =
    totalEmployees > 0 ? Math.round((activeEmployees / totalEmployees) * 100) : 0;

  const getDepartmentCount = (departmentName) => {
    return employees.filter((emp) => emp.department === departmentName).length;
  };

  const conicGradient = departmentsList
    .map((dept, index) => {
      const start = (index / departmentsList.length) * 100;
      const end = ((index + 1) / departmentsList.length) * 100;
      return `${dept.color} ${start}% ${end}%`;
    })
    .join(", ");

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

  const openAddModal = () => {
    resetForm();
    setShowFormModal(true);
  };

  const closeFormModal = () => {
    resetForm();
    setShowFormModal(false);
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
        employees.map((emp) => (emp.id === editId ? { ...emp, ...form } : emp))
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
    setShowFormModal(false);
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

    setShowFormModal(true);
  };

  const handleDelete = (id) => {
    if (!window.confirm("Are you sure you want to delete this employee?")) return;

    setEmployees(employees.filter((emp) => emp.id !== id));

    if (editId === id) {
      resetForm();
    }
  };

  const handleDepartmentSubmit = (e) => {
    e.preventDefault();

    if (!deptName.trim()) {
      alert("Please enter department name");
      return;
    }

    if (deptEditId) {
      const oldDept = departmentsList.find((dept) => dept.id === deptEditId);

      setDepartmentsList(
        departmentsList.map((dept) =>
          dept.id === deptEditId ? { ...dept, name: deptName } : dept
        )
      );

      setEmployees(
        employees.map((emp) =>
          emp.department === oldDept.name ? { ...emp, department: deptName } : emp
        )
      );

      setDeptEditId(null);
    } else {
      setDepartmentsList([
        ...departmentsList,
        {
          id: Date.now(),
          name: deptName,
          color: colors[departmentsList.length % colors.length],
        },
      ]);
    }

    setDeptName("");
  };

  const handleDepartmentEdit = (dept) => {
    setDeptEditId(dept.id);
    setDeptName(dept.name);
  };

  const handleDepartmentDelete = (dept) => {
    const usedEmployees = employees.filter(
      (emp) => emp.department === dept.name
    ).length;

    if (usedEmployees > 0) {
      alert("This department has employees. Please move/delete employees first.");
      return;
    }

    setDepartmentsList(departmentsList.filter((item) => item.id !== dept.id));

    if (deptEditId === dept.id) {
      setDeptEditId(null);
      setDeptName("");
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
            <div
              className="donut"
              style={{
                background: `conic-gradient(${conicGradient})`,
              }}
            >
              <div className="donut-center">
                <h2>{totalEmployees}</h2>
                <p>Total</p>
              </div>
            </div>

            <ul className="dept-list">
              {departmentsList.map((dept) => (
                <li key={dept.id}>
                  <span className="dot" style={{ background: dept.color }}></span>
                  <span>{dept.name}</span>
                  <b>{getDepartmentCount(dept.name)}</b>

                  <button
                    type="button"
                    className="dept-edit"
                    onClick={() => handleDepartmentEdit(dept)}
                    title="Edit Department"
                  >
                    <FaEdit />
                  </button>

                  <button
                    type="button"
                    className="dept-delete"
                    onClick={() => handleDepartmentDelete(dept)}
                    title="Delete Department"
                  >
                    <FaTrash />
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <form className="dept-form" onSubmit={handleDepartmentSubmit}>
            <input
              type="text"
              placeholder="Department name"
              value={deptName}
              onChange={(e) => setDeptName(e.target.value)}
            />

            <button type="submit">
              {deptEditId ? "Update Department" : "Add Department"}
            </button>

            {deptEditId && (
              <button
                type="button"
                className="dept-cancel"
                onClick={() => {
                  setDeptEditId(null);
                  setDeptName("");
                }}
              >
                Cancel
              </button>
            )}
          </form>
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

      <div className="bottom-grid only-table">
        <div className="card employee-table-card">
          <div className="table-header">
            <div>
              <h3>Recent Employees</h3>
              <p className="table-subtitle">
                Manage and view your organization's recent employees
              </p>
            </div>

            <div className="table-header-actions">
              <div className="search-box">
                <FaSearch />
                <input
                  type="text"
                  placeholder="Search employee..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              <button type="button" className="header-add-btn" onClick={openAddModal}>
                <FaPlus /> Add Employee
              </button>
            </div>
          </div>

          <div className="employee-table-wrapper">
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
                  <th className="actions-heading">Actions</th>
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
                      <td className="actions-cell">
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

          <div className="table-footer">
            <p>Showing 1 to {filteredEmployees.length} of {employees.length} employees</p>
          </div>
        </div>
      </div>

      {showFormModal && (
        <div className="modal-overlay">
          <div className="employee-form-modal">
            <div className="modal-title-row">
              <h3>{editId ? "Update Employee" : "Add Employee"}</h3>

              <button
                type="button"
                className="modal-close-btn"
                onClick={closeFormModal}
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mini-form">
              <input
                name="name"
                placeholder="Name"
                value={form.name}
                onChange={handleChange}
              />

              <select
                name="department"
                value={form.department}
                onChange={handleChange}
              >
                <option value="">Select Department</option>
                {departmentsList.map((dept) => (
                  <option key={dept.id} value={dept.name}>
                    {dept.name}
                  </option>
                ))}
              </select>

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
                {editId ? "Update Employee" : "Add Employee"}
              </button>

              <button type="button" className="cancel-btn" onClick={closeFormModal}>
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}

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