import { useEffect, useMemo, useState } from "react";
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
import API from "../api/api";
import "./Performance.css";

export default function Performance() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("All Departments");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [currentPage, setCurrentPage] = useState(1);

  const [showModal, setShowModal] = useState(false);
  const [editingData, setEditingData] = useState(null);
  const [viewData, setViewData] = useState(null);

  const [formData, setFormData] = useState({
    employeeId: "",
    employeeName: "",
    department: "IT Department",
    designation: "",
    rating: "",
    performanceScore: "",
    attendance: "",
    completedTasks: "",
    pendingTasks: "",
    performanceStatus: "Good",
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

  const fetchPerformance = async () => {
    try {
      setLoading(true);
      const res = await API.get("/performance");
      setRecords(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error("Performance fetch error:", error);
      alert("Performance records load nahi ho rahe. Backend check karo.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPerformance();
  }, []);

  const filteredRecords = useMemo(() => {
    return records.filter((item) => {
      const keyword = search.toLowerCase();

      const matchSearch =
        String(item.id || "").toLowerCase().includes(keyword) ||
        String(item.employeeId || "").toLowerCase().includes(keyword) ||
        String(item.employeeName || "").toLowerCase().includes(keyword) ||
        String(item.department || "").toLowerCase().includes(keyword) ||
        String(item.designation || "").toLowerCase().includes(keyword);

      const matchDepartment =
        departmentFilter === "All Departments" ||
        item.department === departmentFilter;

      const matchStatus =
        statusFilter === "All Status" ||
        item.performanceStatus === statusFilter;

      return matchSearch && matchDepartment && matchStatus;
    });
  }, [records, search, departmentFilter, statusFilter]);

  const totalPages = Math.ceil(filteredRecords.length / rowsPerPage);

  const paginatedRecords = filteredRecords.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const excellentCount = records.filter(
    (item) => item.performanceStatus === "Excellent"
  ).length;

  const averageScore =
    records.length > 0
      ? Math.round(
          records.reduce(
            (sum, item) => sum + Number(item.performanceScore || 0),
            0
          ) / records.length
        )
      : 0;

  const topEmployee =
    records.length > 0
      ? records.reduce((prev, curr) =>
          Number(curr.performanceScore || 0) >
          Number(prev.performanceScore || 0)
            ? curr
            : prev
        )
      : null;

  const resetForm = () => {
    setEditingData(null);
    setViewData(null);
    setFormData({
      employeeId: "",
      employeeName: "",
      department: "IT Department",
      designation: "",
      rating: "",
      performanceScore: "",
      attendance: "",
      completedTasks: "",
      pendingTasks: "",
      performanceStatus: "Good",
      reviewDate: "",
      managerComments: "",
    });
  };

  const openAddModal = () => {
    resetForm();
    setShowModal(true);
  };

  const openEditModal = (item) => {
    setViewData(null);
    setEditingData(item);

    setFormData({
      employeeId: item.employeeId || "",
      employeeName: item.employeeName || "",
      department: item.department || "IT Department",
      designation: item.designation || "",
      rating: item.rating || "",
      performanceScore: item.performanceScore || "",
      attendance: item.attendance || "",
      completedTasks: item.completedTasks || "",
      pendingTasks: item.pendingTasks || "",
      performanceStatus: item.performanceStatus || "Good",
      reviewDate: item.reviewDate || "",
      managerComments: item.managerComments || "",
    });

    setShowModal(true);
  };

  const openViewModal = (item) => {
    setShowModal(false);
    setEditingData(null);
    setViewData(item);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.employeeId ||
      !formData.employeeName ||
      !formData.designation ||
      !formData.rating ||
      !formData.performanceScore ||
      !formData.reviewDate
    ) {
      alert("Please fill required fields");
      return;
    }

    const payload = {
      employeeId: Number(formData.employeeId),
      employeeName: formData.employeeName,
      department: formData.department,
      designation: formData.designation,
      rating: Number(formData.rating),
      performanceScore: Number(formData.performanceScore),
      attendance: Number(formData.attendance) || 0,
      completedTasks: Number(formData.completedTasks) || 0,
      pendingTasks: Number(formData.pendingTasks) || 0,
      performanceStatus: formData.performanceStatus,
      reviewDate: formData.reviewDate,
      managerComments: formData.managerComments,
    };

    try {
      if (editingData) {
        await API.put(`/performance/${editingData.id}`, payload);
        alert("Performance updated successfully");
      } else {
        await API.post("/performance", payload);
        alert("Performance added successfully");
      }

      setShowModal(false);
      resetForm();
      fetchPerformance();
    } catch (error) {
      console.error("Performance save error:", error);
      alert("Performance save nahi ho raha. Backend fields check karo.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this record?")) return;

    try {
      await API.delete(`/performance/${id}`);
      alert("Performance deleted successfully");
      fetchPerformance();
    } catch (error) {
      console.error("Performance delete error:", error);
      alert("Performance delete nahi ho raha. Backend check karo.");
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
                    <strong>{item.employeeName}</strong>
                    <small>{item.employeeId}</small>
                  </td>

                  <td>{item.department}</td>
                  <td>{item.designation}</td>
                  <td className="rating">{item.rating} ★</td>

                  <td>
                    <span className="score-pill">
                      {item.performanceScore}%
                    </span>
                  </td>

                  <td>{item.attendance || 0}%</td>

                  <td>
                    <small>Done: {item.completedTasks}</small>
                    <small>Pending: {item.pendingTasks}</small>
                  </td>

                  <td>
                    <span className={getStatusClass(item.performanceStatus)}>
                      {item.performanceStatus}
                    </span>
                  </td>

                  <td>{item.reviewDate}</td>

                  <td>
                    <div className="perf-actions">
                      <button
                        className="view"
                        onClick={() => openViewModal(item)}
                      >
                        <FaEye />
                      </button>

                      <button
                        className="edit"
                        onClick={() => openEditModal(item)}
                      >
                        <FaEdit />
                      </button>

                      <button
                        className="delete"
                        onClick={() => handleDelete(item.id)}
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="11" className="perf-no-data">
                  {loading ? "Loading..." : "No performance record found"}
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
                value={formData.employeeName}
                onChange={(e) =>
                  setFormData({ ...formData, employeeName: e.target.value })
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
                value={formData.performanceScore}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    performanceScore: e.target.value,
                  })
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
                value={formData.performanceStatus}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    performanceStatus: e.target.value,
                  })
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
              <p><b>Name:</b> {viewData.employeeName}</p>
              <p><b>Department:</b> {viewData.department}</p>
              <p><b>Designation:</b> {viewData.designation}</p>
              <p><b>Rating:</b> {viewData.rating} ★</p>
              <p><b>Score:</b> {viewData.performanceScore}%</p>
              <p><b>Attendance:</b> {viewData.attendance || 0}%</p>
              <p><b>Status:</b> {viewData.performanceStatus}</p>
              <p><b>Comments:</b> {viewData.managerComments}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}