import { useMemo, useState } from "react";
import {
  FaPlus,
  FaSearch,
  FaEye,
  FaEdit,
  FaTrash,
  FaTimes,
  FaSave,
  FaStar,
  FaChartLine,
  FaUsers,
  FaTrophy,
} from "react-icons/fa";
import "./Performance.css";

const initialData = [
  {
    id: "PER001",
    employeeId: "EMP001",
    name: "Vivek Srivastava",
    department: "IT Department",
    designation: "Full Stack Developer",
    rating: 5,
    score: 92,
    attendance: 96,
    completedTasks: 34,
    pendingTasks: 2,
    status: "Excellent",
    reviewDate: "2026-05-28",
    managerComments: "Great performance and strong problem solving.",
  },
  {
    id: "PER002",
    employeeId: "EMP002",
    name: "Rahul Sharma",
    department: "IT Department",
    designation: "Backend Developer",
    rating: 4,
    score: 82,
    attendance: 90,
    completedTasks: 28,
    pendingTasks: 5,
    status: "Good",
    reviewDate: "2026-05-28",
    managerComments: "Good backend skills, improve delivery speed.",
  },
  {
    id: "PER003",
    employeeId: "EMP003",
    name: "Priya Patel",
    department: "HR Department",
    designation: "HR Executive",
    rating: 3,
    score: 68,
    attendance: 85,
    completedTasks: 20,
    pendingTasks: 8,
    status: "Average",
    reviewDate: "2026-05-29",
    managerComments: "Needs improvement in follow-ups.",
  },
];

export default function Performance() {
  const [records, setRecords] = useState(initialData);
  const [search, setSearch] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("All Departments");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [currentPage, setCurrentPage] = useState(1);

  const [showModal, setShowModal] = useState(false);
  const [editingData, setEditingData] = useState(null);
  const [viewData, setViewData] = useState(null);

  const [formData, setFormData] = useState({
    employeeId: "",
    name: "",
    department: "IT Department",
    designation: "",
    rating: "",
    score: "",
    attendance: "",
    completedTasks: "",
    pendingTasks: "",
    status: "Good",
    reviewDate: "",
    managerComments: "",
  });

  const rowsPerPage = 4;

  const departments = [
    "All Departments",
    "IT Department",
    "HR Department",
    "Finance Department",
    "Marketing Department",
  ];

  const statuses = ["All Status", "Excellent", "Good", "Average", "Poor"];

  const filteredRecords = useMemo(() => {
    return records.filter((item) => {
      const matchSearch =
        item.id.toLowerCase().includes(search.toLowerCase()) ||
        item.employeeId.toLowerCase().includes(search.toLowerCase()) ||
        item.name.toLowerCase().includes(search.toLowerCase()) ||
        item.department.toLowerCase().includes(search.toLowerCase()) ||
        item.designation.toLowerCase().includes(search.toLowerCase());

      const matchDepartment =
        departmentFilter === "All Departments" ||
        item.department === departmentFilter;

      const matchStatus =
        statusFilter === "All Status" || item.status === statusFilter;

      return matchSearch && matchDepartment && matchStatus;
    });
  }, [records, search, departmentFilter, statusFilter]);

  const totalPages = Math.ceil(filteredRecords.length / rowsPerPage);

  const paginatedRecords = filteredRecords.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const excellentCount = records.filter((item) => item.status === "Excellent").length;

  const averageScore = Math.round(
    records.reduce((sum, item) => sum + Number(item.score), 0) / records.length
  );

  const topEmployee =
    records.length > 0
      ? records.reduce((prev, curr) =>
          Number(curr.score) > Number(prev.score) ? curr : prev
        )
      : null;

  const openAddModal = () => {
    setEditingData(null);
    setViewData(null);
    setFormData({
      employeeId: "",
      name: "",
      department: "IT Department",
      designation: "",
      rating: "",
      score: "",
      attendance: "",
      completedTasks: "",
      pendingTasks: "",
      status: "Good",
      reviewDate: "",
      managerComments: "",
    });
    setShowModal(true);
  };

  const openEditModal = (item) => {
    setViewData(null);
    setEditingData(item);
    setFormData({ ...item });
    setShowModal(true);
  };

  const openViewModal = (item) => {
    setShowModal(false);
    setEditingData(null);
    setViewData(item);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      !formData.employeeId ||
      !formData.name ||
      !formData.designation ||
      !formData.rating ||
      !formData.score ||
      !formData.reviewDate
    ) {
      alert("Please fill required fields");
      return;
    }

    if (editingData) {
      setRecords((prev) =>
        prev.map((item) =>
          item.id === editingData.id
            ? {
                ...item,
                ...formData,
                rating: Number(formData.rating),
                score: Number(formData.score),
                attendance: Number(formData.attendance),
                completedTasks: Number(formData.completedTasks),
                pendingTasks: Number(formData.pendingTasks),
              }
            : item
        )
      );
    } else {
      const newId = `PER${String(records.length + 1).padStart(3, "0")}`;

      setRecords((prev) => [
        ...prev,
        {
          id: newId,
          ...formData,
          rating: Number(formData.rating),
          score: Number(formData.score),
          attendance: Number(formData.attendance),
          completedTasks: Number(formData.completedTasks),
          pendingTasks: Number(formData.pendingTasks),
        },
      ]);
    }

    setShowModal(false);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this record?")) {
      setRecords((prev) => prev.filter((item) => item.id !== id));
    }
  };

  const getStatusClass = (status) => {
    if (status === "Excellent") return "perf-status excellent";
    if (status === "Good") return "perf-status good";
    if (status === "Average") return "perf-status average";
    if (status === "Poor") return "perf-status poor";
    return "perf-status";
  };

  return (
    <div className="performance-page">
      <div className="performance-header">
        <div>
          <h1>Performance Management</h1>
          <span></span>
          <p>Track employee performance, ratings, tasks and reviews.</p>
        </div>

        <button onClick={openAddModal}>
          <FaPlus /> Add Performance
        </button>
      </div>

      <div className="performance-stats">
        <div className="perf-card blue">
          <FaUsers />
          <div>
            <h2>{records.length}</h2>
            <p>Total Records</p>
          </div>
        </div>

        <div className="perf-card green">
          <FaTrophy />
          <div>
            <h2>{excellentCount}</h2>
            <p>Excellent Performers</p>
          </div>
        </div>

        <div className="perf-card purple">
          <FaChartLine />
          <div>
            <h2>{averageScore}%</h2>
            <p>Average Score</p>
          </div>
        </div>

        <div className="perf-card orange">
          <FaStar />
          <div>
            <h2>{topEmployee ? topEmployee.rating : 0}</h2>
            <p>Top Rating</p>
          </div>
        </div>
      </div>

      <div className="performance-tools">
        <div className="performance-search">
          <FaSearch />
          <input
            placeholder="Search performance..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>

        <select
          value={departmentFilter}
          onChange={(e) => {
            setDepartmentFilter(e.target.value);
            setCurrentPage(1);
          }}
        >
          {departments.map((dept) => (
            <option key={dept}>{dept}</option>
          ))}
        </select>

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

      <div className="performance-table-card">
        <table>
          <thead>
            <tr>
              <th>Record ID</th>
              <th>Employee</th>
              <th>Department</th>
              <th>Designation</th>
              <th>Rating</th>
              <th>Score</th>
              <th>Attendance</th>
              <th>Tasks</th>
              <th>Status</th>
              <th>Review Date</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {paginatedRecords.length > 0 ? (
              paginatedRecords.map((item) => (
                <tr key={item.id}>
                  <td>{item.id}</td>
                  <td>
                    <strong>{item.name}</strong>
                    <small>{item.employeeId}</small>
                  </td>
                  <td>{item.department}</td>
                  <td>{item.designation}</td>
                  <td className="rating">{item.rating} ★</td>
                  <td>
                    <span className="score-pill">{item.score}%</span>
                  </td>
                  <td>{item.attendance}%</td>
                  <td>
                    <small>Done: {item.completedTasks}</small>
                    <small>Pending: {item.pendingTasks}</small>
                  </td>
                  <td>
                    <span className={getStatusClass(item.status)}>
                      {item.status}
                    </span>
                  </td>
                  <td>{item.reviewDate}</td>
                  <td>
                    <div className="perf-actions">
                      <button className="view" onClick={() => openViewModal(item)}>
                        <FaEye />
                      </button>
                      <button className="edit" onClick={() => openEditModal(item)}>
                        <FaEdit />
                      </button>
                      <button className="delete" onClick={() => handleDelete(item.id)}>
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="11" className="perf-no-data">
                  No performance record found
                </td>
              </tr>
            )}
          </tbody>
        </table>

        <div className="perf-pagination">
          <p>
            Showing {paginatedRecords.length} of {filteredRecords.length} records
          </p>

          <div className="perf-page-buttons">
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
        <div className="perf-modal-overlay">
          <div className="perf-modal">
            <div className="perf-modal-header">
              <h2>{editingData ? "Edit Performance" : "Add Performance"}</h2>
              <button onClick={() => setShowModal(false)}>
                <FaTimes />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="perf-form">
              <input
                placeholder="Employee ID"
                value={formData.employeeId}
                onChange={(e) =>
                  setFormData({ ...formData, employeeId: e.target.value })
                }
              />

              <input
                placeholder="Employee Name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />

              <select
                value={formData.department}
                onChange={(e) =>
                  setFormData({ ...formData, department: e.target.value })
                }
              >
                {departments
                  .filter((dept) => dept !== "All Departments")
                  .map((dept) => (
                    <option key={dept}>{dept}</option>
                  ))}
              </select>

              <input
                placeholder="Designation"
                value={formData.designation}
                onChange={(e) =>
                  setFormData({ ...formData, designation: e.target.value })
                }
              />

              <input
                type="number"
                min="1"
                max="5"
                placeholder="Rating 1-5"
                value={formData.rating}
                onChange={(e) =>
                  setFormData({ ...formData, rating: e.target.value })
                }
              />

              <input
                type="number"
                placeholder="Performance Score %"
                value={formData.score}
                onChange={(e) =>
                  setFormData({ ...formData, score: e.target.value })
                }
              />

              <input
                type="number"
                placeholder="Attendance %"
                value={formData.attendance}
                onChange={(e) =>
                  setFormData({ ...formData, attendance: e.target.value })
                }
              />

              <input
                type="number"
                placeholder="Completed Tasks"
                value={formData.completedTasks}
                onChange={(e) =>
                  setFormData({ ...formData, completedTasks: e.target.value })
                }
              />

              <input
                type="number"
                placeholder="Pending Tasks"
                value={formData.pendingTasks}
                onChange={(e) =>
                  setFormData({ ...formData, pendingTasks: e.target.value })
                }
              />

              <select
                value={formData.status}
                onChange={(e) =>
                  setFormData({ ...formData, status: e.target.value })
                }
              >
                {statuses
                  .filter((status) => status !== "All Status")
                  .map((status) => (
                    <option key={status}>{status}</option>
                  ))}
              </select>

              <input
                type="date"
                value={formData.reviewDate}
                onChange={(e) =>
                  setFormData({ ...formData, reviewDate: e.target.value })
                }
              />

              <textarea
                placeholder="Manager Comments"
                value={formData.managerComments}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    managerComments: e.target.value,
                  })
                }
              ></textarea>

              <button type="submit">
                <FaSave /> {editingData ? "Update" : "Save"}
              </button>
            </form>
          </div>
        </div>
      )}

      {viewData && (
        <div className="perf-modal-overlay">
          <div className="perf-view-modal">
            <div className="perf-modal-header">
              <h2>Performance Details</h2>
              <button onClick={() => setViewData(null)}>
                <FaTimes />
              </button>
            </div>

            <div className="perf-details">
              <p><b>Record ID:</b> {viewData.id}</p>
              <p><b>Employee ID:</b> {viewData.employeeId}</p>
              <p><b>Name:</b> {viewData.name}</p>
              <p><b>Department:</b> {viewData.department}</p>
              <p><b>Designation:</b> {viewData.designation}</p>
              <p><b>Rating:</b> {viewData.rating} ★</p>
              <p><b>Score:</b> {viewData.score}%</p>
              <p><b>Attendance:</b> {viewData.attendance}%</p>
              <p><b>Status:</b> {viewData.status}</p>
              <p><b>Comments:</b> {viewData.managerComments}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}