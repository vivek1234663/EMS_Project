import { useEffect, useState } from "react";
import "./Dashboard.css";
import API from "../api/axios";
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

const colors = ["#2563eb", "#22c55e", "#f97316", "#7c3aed", "#ec4899"];

export default function Dashboard() {
  const [employees, setEmployees] = useState([]);
  const [departmentsList, setDepartmentsList] = useState([]);

  const [stats, setStats] = useState({
    totalEmployees: 0,
    totalDepartments: 0,
    totalAttendanceRecords: 0,
    totalPerformanceRecords: 0,
    totalSalaryRecords: 0,
  });

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

  useEffect(() => {
    fetchDashboardStats();
    fetchEmployees();
    fetchDepartments();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const res = await API.get("/dashboard/stats");
      setStats(res.data);
    } catch (error) {
      console.log("Dashboard stats error:", error);
    }
  };

  const fetchEmployees = async () => {
    try {
      const res = await API.get("/employees");
      setEmployees(Array.isArray(res.data) ? res.data : res.data.content || []);
    } catch (error) {
      console.log("Employees fetch error:", error);
    }
  };

  const fetchDepartments = async () => {
    try {
      const res = await API.get("/departments");

      const data = Array.isArray(res.data) ? res.data : res.data.content || [];

      const departmentsWithColor = data.map((dept, index) => ({
        ...dept,
        color: dept.color || colors[index % colors.length],
      }));

      setDepartmentsList(departmentsWithColor);
    } catch (error) {
      console.log("Departments fetch error:", error);
    }
  };

  const totalEmployees = stats.totalEmployees || employees.length;

  const activeEmployees = employees.filter(
    (e) => e.status === "Active" || e.status === "ACTIVE"
  ).length;

  const inactiveEmployees = employees.filter(
    (e) => e.status === "Inactive" || e.status === "INACTIVE"
  ).length;

  const departments = stats.totalDepartments || departmentsList.length;

  const activePercentage =
    totalEmployees > 0 ? Math.round((activeEmployees / totalEmployees) * 100) : 0;

  const getDepartmentName = (department) => {
    if (!department) return "-";
    if (typeof department === "object") return department.name;
    return department;
  };

  const getDepartmentCount = (departmentName) => {
    return employees.filter(
      (emp) => getDepartmentName(emp.department) === departmentName
    ).length;
  };

  const conicGradient =
    departmentsList.length > 0
      ? departmentsList
          .map((dept, index) => {
            const start = (index / departmentsList.length) * 100;
            const end = ((index + 1) / departmentsList.length) * 100;
            return `${dept.color} ${start}% ${end}%`;
          })
          .join(", ")
      : "#e5e7eb 0% 100%";

  const filteredEmployees = employees.filter((emp) =>
    `${emp.name || ""} ${getDepartmentName(emp.department)} ${emp.designation || ""} ${
      emp.email || ""
    }`
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

  const handleSubmit = async (e) => {
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

    try {
      if (editId) {
        await API.put(`/employees/${editId}`, form);
      } else {
        await API.post("/employees", form);
      }

      resetForm();
      setShowFormModal(false);
      fetchEmployees();
      fetchDashboardStats();
    } catch (error) {
      console.log("Employee save error:", error);
      alert("Employee save failed");
    }
  };

  const handleEdit = (emp) => {
    setEditId(emp.id);

    setForm({
      name: emp.name || "",
      department: getDepartmentName(emp.department),
      designation: emp.designation || "",
      email: emp.email || "",
      status: emp.status || "Active",
      joinDate: emp.joinDate || "",
    });

    setShowFormModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this employee?")) return;

    try {
      await API.delete(`/employees/${id}`);
      fetchEmployees();
      fetchDashboardStats();

      if (editId === id) {
        resetForm();
      }
    } catch (error) {
      console.log("Employee delete error:", error);
      alert("Employee delete failed");
    }
  };

  const handleDepartmentSubmit = async (e) => {
    e.preventDefault();

    if (!deptName.trim()) {
      alert("Please enter department name");
      return;
    }

    try {
      if (deptEditId) {
        await API.put(`/departments/${deptEditId}`, {
          name: deptName,
        });
      } else {
        await API.post("/departments", {
          name: deptName,
        });
      }

      setDeptEditId(null);
      setDeptName("");
      fetchDepartments();
      fetchEmployees();
      fetchDashboardStats();
    } catch (error) {
      console.log("Department save error:", error);
      alert("Department save failed");
    }
  };

  const handleDepartmentEdit = (dept) => {
    setDeptEditId(dept.id);
    setDeptName(dept.name);
  };

  const handleDepartmentDelete = async (dept) => {
    const usedEmployees = employees.filter(
      (emp) => getDepartmentName(emp.department) === dept.name
    ).length;

    if (usedEmployees > 0) {
      alert("This department has employees. Please move/delete employees first.");
      return;
    }

    try {
      await API.delete(`/departments/${dept.id}`);

      if (deptEditId === dept.id) {
        setDeptEditId(null);
        setDeptName("");
      }

      fetchDepartments();
      fetchDashboardStats();
    } catch (error) {
      console.log("Department delete error:", error);
      alert("Department delete failed");
    }
  };

  return (
    <main className="dashboard">
      <div className="dashboard-top">
        <div>
          <h1>Welcome back, Vivek 👋</h1>
          <p>Here’s what’s happening with your organization today.</p>
        </div>

        <div className="date-pill">
          {new Date().toLocaleDateString("en-US", {
            weekday: "long",
            month: "long",
            day: "numeric",
            year: "numeric",
          })}
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card blue">
          <div className="stat-icon">
            <FaUsers />
          </div>
          <div>
            <p>Total Employees</p>
            <h2>{totalEmployees}</h2>
            <span>Live from backend</span>
          </div>
        </div>

        <div className="stat-card green">
          <div className="stat-icon">
            <FaUserCheck />
          </div>
          <div>
            <p>Active Employees</p>
            <h2>{activeEmployees}</h2>
            <span>Live status count</span>
          </div>
        </div>

        <div className="stat-card orange">
          <div className="stat-icon">
            <FaUserTimes />
          </div>
          <div>
            <p>Inactive Employees</p>
            <h2>{inactiveEmployees}</h2>
            <span>Live status count</span>
          </div>
        </div>

        <div className="stat-card purple">
          <div className="stat-icon">
            <FaBuilding />
          </div>
          <div>
            <p>Departments</p>
            <h2>{departments}</h2>
            <span>Live from backend</span>
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
              <div className="avatar">{emp.name?.charAt(0)}</div>

              <div className="recent-info">
                <h4>{emp.name}</h4>
                <p>{getDepartmentName(emp.department)}</p>
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
                      <td>{emp.employeeCode || emp.id}</td>
                      <td>{emp.name}</td>
                      <td>{getDepartmentName(emp.department)}</td>
                      <td>{emp.designation}</td>
                      <td>{emp.email}</td>
                      <td>
                        <span
                          className={
                            emp.status === "Active" || emp.status === "ACTIVE"
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
            <p>
              Showing 1 to {filteredEmployees.length} of {employees.length} employees
            </p>
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
              <b>ID:</b> {viewEmployee.employeeCode || viewEmployee.id}
            </p>
            <p>
              <b>Name:</b> {viewEmployee.name}
            </p>
            <p>
              <b>Department:</b> {getDepartmentName(viewEmployee.department)}
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