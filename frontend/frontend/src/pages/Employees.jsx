import { useMemo, useState } from "react";
import "./Employees.css";
import {
  FaEye,
  FaEdit,
  FaTrash,
  FaPlus,
  FaSearch,
  FaTimes,
  FaUsers,
  FaUserCheck,
  FaUserClock,
} from "react-icons/fa";

const initialEmployees = [
  {
    id: "EMP001",
    name: "Vivek Srivastava",
    department: "IT Department",
    designation: "Full Stack Developer",
    email: "vivek@gmail.com",
    phone: "7851804530",
    status: "Active",
    joinDate: "2026-05-12",
  },
  {
    id: "EMP002",
    name: "Rahul Sharma",
    department: "IT Department",
    designation: "Backend Developer",
    email: "rahul@gmail.com",
    phone: "9876543210",
    status: "Active",
    joinDate: "2026-05-13",
  },
  {
    id: "EMP003",
    name: "Priya Patel",
    department: "HR Department",
    designation: "HR Executive",
    email: "priya@gmail.com",
    phone: "9123456780",
    status: "Inactive",
    joinDate: "2026-05-14",
  },
];

export default function Employees() {
  const [employees, setEmployees] = useState(initialEmployees);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [viewEmployee, setViewEmployee] = useState(null);

  const [form, setForm] = useState({
    name: "",
    department: "",
    designation: "",
    email: "",
    phone: "",
    status: "Active",
    joinDate: "",
  });

  const totalEmployees = employees.length;
  const activeEmployees = employees.filter(
    (emp) => emp.status === "Active"
  ).length;
  const inactiveEmployees = employees.filter(
    (emp) => emp.status === "Inactive"
  ).length;

  const filteredEmployees = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    return employees.filter((emp) => {
      const searchableText = [
        emp.id,
        emp.name,
        emp.department,
        emp.designation,
        emp.email,
        emp.phone,
        emp.status,
        emp.joinDate,
      ]
        .join(" ")
        .toLowerCase();

      const matchSearch = searchableText.includes(keyword);

      const matchStatus =
        statusFilter === "All" || emp.status === statusFilter;

      return matchSearch && matchStatus;
    });
  }, [employees, search, statusFilter]);

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
      phone: "",
      status: "Active",
      joinDate: "",
    });
    setEditId(null);
    setShowForm(false);
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
      !form.phone.trim() ||
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
      phone: emp.phone,
      status: emp.status,
      joinDate: emp.joinDate,
    });
    setShowForm(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this employee?")) {
      setEmployees(employees.filter((emp) => emp.id !== id));

      if (editId === id) {
        resetForm();
      }

      if (viewEmployee?.id === id) {
        setViewEmployee(null);
      }
    }
  };

  const handleAddClick = () => {
    resetForm();
    setShowForm(true);
  };

  return (
    <main className="employees-page">
      <section className="employees-hero">
        <div>
          <span className="page-badge">Employee Management</span>
          <h1>Manage Your Team</h1>
        </div>

        <button className="add-employee-btn" onClick={handleAddClick}>
          <FaPlus />
          Add Employee
        </button>
      </section>

      <section className="employee-stats">
        <div className="emp-stat-card blue">
          <FaUsers />
          <div>
            <p>Total Employees</p>
            <h2>{totalEmployees}</h2>
          </div>
        </div>

        <div className="emp-stat-card green">
          <FaUserCheck />
          <div>
            <p>Active Employees</p>
            <h2>{activeEmployees}</h2>
          </div>
        </div>

        <div className="emp-stat-card orange">
          <FaUserClock />
          <div>
            <p>Inactive Employees</p>
            <h2>{inactiveEmployees}</h2>
          </div>
        </div>
      </section>

      <section className="employees-card">
        <div className="employees-toolbar">
          <div>
            <h3>Employee Directory</h3>
            <p>{filteredEmployees.length} employees found</p>
          </div>

          <div className="toolbar-actions">
            <div className="employee-search">
              <FaSearch />
              <input
                type="text"
                placeholder="Search by name, ID, email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />

              {search && (
                <button
                  type="button"
                  className="clear-search-btn"
                  onClick={() => setSearch("")}
                  title="Clear search"
                >
                  <FaTimes />
                </button>
              )}
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="All">All Status</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
        </div>

        <div className="employees-table-wrapper">
          <table className="employees-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Employee</th>
                <th>Department</th>
                <th>Designation</th>
                <th>Email</th>
                <th>Phone</th>
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
                    <td>
                      <div className="employee-name-cell">
                        <div className="employee-avatar">
                          {emp.name.charAt(0)}
                        </div>
                        <span>{emp.name}</span>
                      </div>
                    </td>
                    <td>{emp.department}</td>
                    <td>{emp.designation}</td>
                    <td>{emp.email}</td>
                    <td>{emp.phone}</td>
                    <td>
                      <span
                        className={
                          emp.status === "Active"
                            ? "emp-badge active"
                            : "emp-badge inactive"
                        }
                      >
                        {emp.status}
                      </span>
                    </td>
                    <td>{formatDate(emp.joinDate)}</td>
                    <td>
                      <div className="employee-actions">
                        <button
                          type="button"
                          className="view"
                          onClick={() => setViewEmployee(emp)}
                        >
                          <FaEye />
                        </button>

                        <button
                          type="button"
                          className="edit"
                          onClick={() => handleEdit(emp)}
                        >
                          <FaEdit />
                        </button>

                        <button
                          type="button"
                          className="delete"
                          onClick={() => handleDelete(emp.id)}
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="9" className="empty-row">
                    No employees found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {showForm && (
        <div className="employee-modal-overlay">
          <div className="employee-modal">
            <div className="modal-header">
              <h3>{editId ? "Update Employee" : "Add New Employee"}</h3>
              <button type="button" onClick={resetForm}>
                <FaTimes />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="employee-form">
              <input
                name="name"
                placeholder="Employee Name"
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
                type="email"
                name="email"
                placeholder="Email Address"
                value={form.email}
                onChange={handleChange}
              />

              <input
                name="phone"
                placeholder="Phone Number"
                value={form.phone}
                onChange={handleChange}
              />

              <select name="status" value={form.status} onChange={handleChange}>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>

              <input
                type="date"
                name="joinDate"
                value={form.joinDate}
                onChange={handleChange}
              />

              <button type="submit">
                {editId ? "Update Employee" : "Add Employee"}
              </button>
            </form>
          </div>
        </div>
      )}

      {viewEmployee && (
        <div className="employee-modal-overlay">
          <div className="employee-view-modal">
            <div className="view-avatar">{viewEmployee.name.charAt(0)}</div>
            <h3>{viewEmployee.name}</h3>
            <p>{viewEmployee.designation}</p>

            <div className="view-details">
              <span>ID</span>
              <b>{viewEmployee.id}</b>

              <span>Department</span>
              <b>{viewEmployee.department}</b>

              <span>Email</span>
              <b>{viewEmployee.email}</b>

              <span>Phone</span>
              <b>{viewEmployee.phone}</b>

              <span>Status</span>
              <b>{viewEmployee.status}</b>

              <span>Join Date</span>
              <b>{formatDate(viewEmployee.joinDate)}</b>
            </div>

            <button type="button" onClick={() => setViewEmployee(null)}>
              Close
            </button>
          </div>
        </div>
      )}
    </main>
  );
}  