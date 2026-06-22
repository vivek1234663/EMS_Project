import { useEffect, useMemo, useState } from "react";
import "./Employees.css";
import API from "../api/api";
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

export default function Employees() {
  const [employees, setEmployees] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [viewEmployee, setViewEmployee] = useState(null);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    department: "",
    designation: "",
    email: "",
    phone: "",
    status: "Active",
    joiningDate: "",
    salary: "",
  });

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const res = await API.get("/employees");
      setEmployees(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error("Employee fetch error:", error);
      alert("Employees load nahi ho rahe. Backend/API check karo.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

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
        emp.joiningDate,
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

  const resetForm = () => {
    setForm({
      name: "",
      department: "",
      designation: "",
      email: "",
      phone: "",
      status: "Active",
      joiningDate: "",
      salary: "",
    });

    setEditId(null);
    setShowForm(false);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    if (
      !form.name.trim() ||
      !form.department.trim() ||
      !form.designation.trim() ||
      !form.email.trim() ||
      !form.phone.trim() ||
      !form.joiningDate
    ) {
      alert("Please fill all required fields");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    const payload = {
      ...form,
      salary: form.salary ? Number(form.salary) : 0,
    };

    try {
      if (editId) {
        await API.put(`/employees/${editId}`, payload);
        alert("Employee updated successfully");
      } else {
        await API.post("/employees", payload);
        alert("Employee added successfully");
      }

      resetForm();
      fetchEmployees();
    } catch (error) {
      console.error("Employee save error:", error);
      alert("Employee save nahi ho raha. Backend field names check karo.");
    }
  };

  const handleEdit = (emp) => {
    setEditId(emp.id);

    setForm({
      name: emp.name || "",
      department: emp.department || "",
      designation: emp.designation || "",
      email: emp.email || "",
      phone: emp.phone || "",
      status: emp.status || "Active",
      joiningDate: emp.joiningDate || "",
      salary: emp.salary || "",
    });

    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this employee?")) return;

    try {
      await API.delete(`/employees/${id}`);
      alert("Employee deleted successfully");

      if (editId === id) resetForm();
      if (viewEmployee?.id === id) setViewEmployee(null);

      fetchEmployees();
    } catch (error) {
      console.error("Employee delete error:", error);
      alert("Employee delete nahi ho raha. Backend check karo.");
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
            <p>
              {loading
                ? "Loading employees..."
                : `${filteredEmployees.length} employees found`}
            </p>
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
                <th>Salary</th>
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
                          {emp.name?.charAt(0)}
                        </div>
                        <span>{emp.name}</span>
                      </div>
                    </td>

                    <td>{emp.department}</td>
                    <td>{emp.designation}</td>
                    <td>{emp.email}</td>
                    <td>{emp.phone}</td>
                    <td>{emp.salary || 0}</td>

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

                    <td>{formatDate(emp.joiningDate)}</td>

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
                  <td colSpan="10" className="empty-row">
                    {loading ? "Loading..." : "No employees found."}
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

              <input
                type="number"
                name="salary"
                placeholder="Salary"
                value={form.salary}
                onChange={handleChange}
              />

              <select name="status" value={form.status} onChange={handleChange}>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>

              <input
                type="date"
                name="joiningDate"
                value={form.joiningDate}
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
            <div className="view-avatar">
              {viewEmployee.name?.charAt(0)}
            </div>

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

              <span>Salary</span>
              <b>{viewEmployee.salary || 0}</b>

              <span>Status</span>
              <b>{viewEmployee.status}</b>

              <span>Join Date</span>
              <b>{formatDate(viewEmployee.joiningDate)}</b>
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