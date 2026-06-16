import { useMemo, useState } from "react";
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
import "./Employees.css";

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
    phone: "9988776655",
    status: "Inactive",
    joinDate: "2026-05-14",
  },
];

export default function Employees() {
  const [employees, setEmployees] = useState(initialEmployees);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [currentPage, setCurrentPage] = useState(1);

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
    joinDate: "",
  });

  const rowsPerPage = 3;

  const departments = [
    "IT Department",
    "HR Department",
    "Finance Department",
    "Marketing Department",
  ];

  const statuses = ["All Status", "Active", "Inactive"];

  const filteredEmployees = useMemo(() => {
    return employees.filter((emp) => {
      const matchSearch =
        emp.id.toLowerCase().includes(search.toLowerCase()) ||
        emp.name.toLowerCase().includes(search.toLowerCase()) ||
        emp.department.toLowerCase().includes(search.toLowerCase()) ||
        emp.designation.toLowerCase().includes(search.toLowerCase()) ||
        emp.email.toLowerCase().includes(search.toLowerCase());

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

  const openAddModal = () => {
    setEditingData(null);
    setViewData(null);
    setFormData({
      name: "",
      department: "IT Department",
      designation: "",
      email: "",
      phone: "",
      status: "Active",
      joinDate: "",
    });
    setShowModal(true);
  };

  const openEditModal = (emp) => {
    setViewData(null);
    setEditingData(emp);
    setFormData({
      name: emp.name,
      department: emp.department,
      designation: emp.designation,
      email: emp.email,
      phone: emp.phone,
      status: emp.status,
      joinDate: emp.joinDate,
    });
    setShowModal(true);
  };

  const openViewModal = (emp) => {
    setShowModal(false);
    setEditingData(null);
    setViewData(emp);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      !formData.name ||
      !formData.department ||
      !formData.designation ||
      !formData.email ||
      !formData.phone ||
      !formData.joinDate
    ) {
      alert("Please fill all fields");
      return;
    }

    if (editingData) {
      setEmployees((prev) =>
        prev.map((emp) =>
          emp.id === editingData.id ? { ...emp, ...formData } : emp
        )
      );
    } else {
      const newId = `EMP${String(employees.length + 1).padStart(3, "0")}`;

      setEmployees((prev) => [
        ...prev,
        {
          id: newId,
          ...formData,
        },
      ]);
    }

    setShowModal(false);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this employee?")) {
      setEmployees((prev) => prev.filter((emp) => emp.id !== id));
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const getInitial = (name) => name.charAt(0).toUpperCase();

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
            <p>{filteredEmployees.length} employees found</p>
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

                    <td>{formatDate(emp.joinDate)}</td>

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
                  <td colSpan="9" className="emp-no-data">
                    No employee found
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
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
              </div>

              <div>
                <label>Department</label>
                <select
                  value={formData.department}
                  onChange={(e) =>
                    setFormData({ ...formData, department: e.target.value })
                  }
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
                  onChange={(e) =>
                    setFormData({ ...formData, designation: e.target.value })
                  }
                />
              </div>

              <div>
                <label>Email</label>
                <input
                  type="email"
                  placeholder="employee@gmail.com"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
              </div>

              <div>
                <label>Phone</label>
                <input
                  type="text"
                  placeholder="Phone number"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                />
              </div>

              <div>
                <label>Status</label>
                <select
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({ ...formData, status: e.target.value })
                  }
                >
                  <option>Active</option>
                  <option>Inactive</option>
                </select>
              </div>

              <div>
                <label>Join Date</label>
                <input
                  type="date"
                  value={formData.joinDate}
                  onChange={(e) =>
                    setFormData({ ...formData, joinDate: e.target.value })
                  }
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
              <p><strong>Status:</strong> {viewData.status}</p>
              <p><strong>Join Date:</strong> {formatDate(viewData.joinDate)}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}