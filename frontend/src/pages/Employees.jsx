import { useEffect, useMemo, useState } from "react";
import {
  FaPlus,
  FaSearch,
  FaEye,
  FaEdit,
  FaTrash,
  FaTimes,
  FaSave,
  FaUsers,
  FaUserCheck,
  FaUserTimes,
} from "react-icons/fa";
import API from "../api/api";
import "./Employees.css";

export default function Employees() {
  const [employees, setEmployees] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [editingData, setEditingData] = useState(null);
  const [viewData, setViewData] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    department: "IT Department",
    designation: "",
    email: "",
    phone: "",
    status: "Active",
    joiningDate: "",
    salary: "",
  });

  const rowsPerPage = 3;

  const departments = [
    "IT Department",
    "HR Department",
    "Finance Department",
    "Marketing Department",
  ];

  const statuses = ["All Status", "Active", "Inactive"];

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const res = await API.get("/employees");
      setEmployees(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error("Employees fetch error:", error);
      alert("Employees load nahi ho rahe. Backend running hai ya nahi check karo.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const filteredEmployees = useMemo(() => {
    return employees.filter((emp) => {
      const keyword = search.toLowerCase();

      const matchSearch =
        String(emp.id || "").toLowerCase().includes(keyword) ||
        String(emp.name || "").toLowerCase().includes(keyword) ||
        String(emp.department || "").toLowerCase().includes(keyword) ||
        String(emp.designation || "").toLowerCase().includes(keyword) ||
        String(emp.email || "").toLowerCase().includes(keyword) ||
        String(emp.phone || "").toLowerCase().includes(keyword);

      const matchStatus =
        statusFilter === "All Status" || emp.status === statusFilter;

      return matchSearch && matchStatus;
    });
  }, [employees, search, statusFilter]);

  const totalPages = Math.ceil(filteredEmployees.length / rowsPerPage);

  const paginatedEmployees = filteredEmployees.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const activeCount = employees.filter((emp) => emp.status === "Active").length;
  const inactiveCount = employees.filter((emp) => emp.status === "Inactive").length;

  const resetForm = () => {
    setEditingData(null);
    setViewData(null);
    setFormData({
      name: "",
      department: "IT Department",
      designation: "",
      email: "",
      phone: "",
      status: "Active",
      joiningDate: "",
      salary: "",
    });
  };

  const openAddModal = () => {
    resetForm();
    setShowModal(true);
  };

  const openEditModal = (emp) => {
    setViewData(null);
    setEditingData(emp);
    setFormData({
      name: emp.name || "",
      department: emp.department || "IT Department",
      designation: emp.designation || "",
      email: emp.email || "",
      phone: emp.phone || "",
      status: emp.status || "Active",
      joiningDate: emp.joiningDate || "",
      salary: emp.salary || "",
    });
    setShowModal(true);
  };

  const openViewModal = (emp) => {
    setShowModal(false);
    setEditingData(null);
    setViewData(emp);
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.name.trim() ||
      !formData.department.trim() ||
      !formData.designation.trim() ||
      !formData.email.trim() ||
      !formData.phone.trim() ||
      !formData.joiningDate
    ) {
      alert("Please fill all fields");
      return;
    }

    const payload = {
      name: formData.name,
      department: formData.department,
      designation: formData.designation,
      email: formData.email,
      phone: formData.phone,
      status: formData.status,
      joiningDate: formData.joiningDate,
      salary: formData.salary ? Number(formData.salary) : 0,
    };

    try {
      if (editingData) {
        await API.put(`/employees/${editingData.id}`, payload);
        alert("Employee updated successfully");
      } else {
        await API.post("/employees", payload);
        alert("Employee added successfully");
      }

      setShowModal(false);
      resetForm();
      fetchEmployees();
    } catch (error) {
      console.error("Employee save error:", error);
      alert("Employee save nahi ho raha. Backend fields check karo.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this employee?")) return;

    try {
      await API.delete(`/employees/${id}`);
      alert("Employee deleted successfully");

      if (viewData?.id === id) {
        setViewData(null);
      }

      fetchEmployees();
    } catch (error) {
      console.error("Employee delete error:", error);
      alert("Employee delete nahi ho raha. Backend check karo.");
    }
  };

  const formatDate = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const getInitial = (name) => {
    return name ? name.charAt(0).toUpperCase() : "?";
  };

  return (
    <div className="employees-page">
      <div className="employees-hero">
        <div>
          <span>Employee Management</span>
          <h1>Manage Your Team</h1>
          <p>Add, update and track employee information easily.</p>
        </div>

        <button onClick={openAddModal}>
          <FaPlus /> Add Employee
        </button>
      </div>

      <div className="employees-stats">
        <div className="emp-stat-card blue">
          <div className="emp-stat-icon">
            <FaUsers />
          </div>
          <div>
            <h3>Total Employees</h3>
            <h2>{employees.length}</h2>
            <p>All registered employees</p>
          </div>
        </div>

        <div className="emp-stat-card green">
          <div className="emp-stat-icon">
            <FaUserCheck />
          </div>
          <div>
            <h3>Active Employees</h3>
            <h2>{activeCount}</h2>
            <p>Currently working</p>
          </div>
        </div>

        <div className="emp-stat-card orange">
          <div className="emp-stat-icon">
            <FaUserTimes />
          </div>
          <div>
            <h3>Inactive Employees</h3>
            <h2>{inactiveCount}</h2>
            <p>Not active currently</p>
          </div>
        </div>
      </div>

      <div className="employee-directory">
        <div className="directory-header">
          <div>
            <h2>Employee Directory</h2>
            <p>
              {loading
                ? "Loading employees..."
                : `${filteredEmployees.length} employees found`}
            </p>
          </div>

          <div className="employee-tools">
            <div className="employee-search">
              <FaSearch />
              <input
                type="text"
                placeholder="Search by name..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
            >
              {statuses.map((status) => (
                <option key={status}>{status}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="employee-table-wrap">
          <table>
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
              {paginatedEmployees.length > 0 ? (
                paginatedEmployees.map((emp) => (
                  <tr key={emp.id}>
                    <td>{emp.id}</td>

                    <td>
                      <div className="emp-profile">
                        <div className="emp-avatar">{getInitial(emp.name)}</div>
                        <strong>{emp.name}</strong>
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
                            ? "emp-status active"
                            : "emp-status inactive"
                        }
                      >
                        {emp.status}
                      </span>
                    </td>

                    <td>{formatDate(emp.joiningDate)}</td>

                    <td>
                      <div className="emp-actions">
                        <button className="view" onClick={() => openViewModal(emp)}>
                          <FaEye />
                        </button>

                        <button className="edit" onClick={() => openEditModal(emp)}>
                          <FaEdit />
                        </button>

                        <button className="delete" onClick={() => handleDelete(emp.id)}>
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="10" className="emp-no-data">
                    {loading ? "Loading..." : "No employee found"}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="emp-pagination">
          <p>
            Showing {paginatedEmployees.length} of {filteredEmployees.length} employees
          </p>

          <div className="emp-page-buttons">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
            >
              Prev
            </button>

            {[...Array(totalPages || 1)].map((_, index) => (
              <button
                key={index}
                className={currentPage === index + 1 ? "active-page" : ""}
                onClick={() => setCurrentPage(index + 1)}
              >
                {index + 1}
              </button>
            ))}

            <button
              disabled={currentPage === totalPages || totalPages === 0}
              onClick={() => setCurrentPage(currentPage + 1)}
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="emp-modal-overlay">
          <div className="emp-modal">
            <div className="emp-modal-header">
              <h2>{editingData ? "Edit Employee" : "Add Employee"}</h2>
              <button onClick={() => setShowModal(false)}>
                <FaTimes />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="emp-form">
              <div>
                <label>Name</label>
                <input
                  type="text"
                  placeholder="Employee name"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                />
              </div>

              <div>
                <label>Department</label>
                <select
                  value={formData.department}
                  onChange={(e) => handleInputChange("department", e.target.value)}
                >
                  {departments.map((dept) => (
                    <option key={dept}>{dept}</option>
                  ))}
                </select>
              </div>

              <div>
                <label>Designation</label>
                <input
                  type="text"
                  placeholder="Designation"
                  value={formData.designation}
                  onChange={(e) => handleInputChange("designation", e.target.value)}
                />
              </div>

              <div>
                <label>Email</label>
                <input
                  type="email"
                  placeholder="employee@gmail.com"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                />
              </div>

              <div>
                <label>Phone</label>
                <input
                  type="text"
                  placeholder="Phone number"
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                />
              </div>

              <div>
                <label>Salary</label>
                <input
                  type="number"
                  placeholder="Salary"
                  value={formData.salary}
                  onChange={(e) => handleInputChange("salary", e.target.value)}
                />
              </div>

              <div>
                <label>Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => handleInputChange("status", e.target.value)}
                >
                  <option>Active</option>
                  <option>Inactive</option>
                </select>
              </div>

              <div>
                <label>Join Date</label>
                <input
                  type="date"
                  value={formData.joiningDate}
                  onChange={(e) => handleInputChange("joiningDate", e.target.value)}
                />
              </div>

              <button type="submit" className="emp-save-btn">
                <FaSave /> {editingData ? "Update Employee" : "Save Employee"}
              </button>
            </form>
          </div>
        </div>
      )}

      {viewData && (
        <div className="emp-modal-overlay">
          <div className="emp-view-modal">
            <div className="emp-modal-header">
              <h2>Employee Details</h2>
              <button onClick={() => setViewData(null)}>
                <FaTimes />
              </button>
            </div>

            <div className="emp-details">
              <p><strong>ID:</strong> {viewData.id}</p>
              <p><strong>Name:</strong> {viewData.name}</p>
              <p><strong>Department:</strong> {viewData.department}</p>
              <p><strong>Designation:</strong> {viewData.designation}</p>
              <p><strong>Email:</strong> {viewData.email}</p>
              <p><strong>Phone:</strong> {viewData.phone}</p>
              <p><strong>Salary:</strong> {viewData.salary || 0}</p>
              <p><strong>Status:</strong> {viewData.status}</p>
              <p><strong>Join Date:</strong> {formatDate(viewData.joiningDate)}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}