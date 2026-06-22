import { useEffect, useMemo, useState } from "react";
import {
  FaPlus,
  FaSearch,
  FaEdit,
  FaTrash,
  FaEye,
  FaTimes,
  FaSave,
  FaCalendarCheck,
  FaUserCheck,
  FaUserTimes,
  FaClock,
} from "react-icons/fa";
import API from "../api/api";
import "./Attendance.css";

export default function Attendance() {
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("All Departments");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [dateFilter, setDateFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const [showModal, setShowModal] = useState(false);
  const [viewData, setViewData] = useState(null);
  const [editingData, setEditingData] = useState(null);

  const [formData, setFormData] = useState({
    employeeId: "",
    name: "",
    department: "IT Department",
    date: "",
    checkIn: "",
    checkOut: "",
    status: "Present",
    workMode: "Office",
  });

  const rowsPerPage = 5;

  const departments = [
    "All Departments",
    "IT Department",
    "HR Department",
    "Finance Department",
    "Marketing Department",
  ];

  const statuses = ["All Status", "Present", "Late", "Absent"];
  const workModes = ["Office", "Remote", "Hybrid"];

  const fetchAttendance = async () => {
    try {
      setLoading(true);
      const res = await API.get("/attendance");
      setAttendance(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error("Attendance fetch error:", error);
      alert("Attendance load nahi ho rahi. Backend check karo.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendance();
  }, []);

  const filteredAttendance = useMemo(() => {
    return attendance.filter((item) => {
      const keyword = search.toLowerCase();

      const matchSearch =
        String(item.id || "").toLowerCase().includes(keyword) ||
        String(item.employeeId || "").toLowerCase().includes(keyword) ||
        String(item.name || "").toLowerCase().includes(keyword) ||
        String(item.department || "").toLowerCase().includes(keyword);

      const matchDepartment =
        departmentFilter === "All Departments" ||
        item.department === departmentFilter;

      const matchStatus =
        statusFilter === "All Status" || item.status === statusFilter;

      const matchDate = !dateFilter || item.date === dateFilter;

      return matchSearch && matchDepartment && matchStatus && matchDate;
    });
  }, [attendance, search, departmentFilter, statusFilter, dateFilter]);

  const totalPages = Math.ceil(filteredAttendance.length / rowsPerPage);

  const paginatedAttendance = filteredAttendance.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const presentCount = attendance.filter((item) => item.status === "Present").length;
  const lateCount = attendance.filter((item) => item.status === "Late").length;
  const absentCount = attendance.filter((item) => item.status === "Absent").length;

  const resetForm = () => {
    setEditingData(null);
    setViewData(null);
    setFormData({
      employeeId: "",
      name: "",
      department: "IT Department",
      date: "",
      checkIn: "",
      checkOut: "",
      status: "Present",
      workMode: "Office",
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
      name: item.name || "",
      department: item.department || "IT Department",
      date: item.date || "",
      checkIn: item.checkIn || "",
      checkOut: item.checkOut || "",
      status: item.status || "Present",
      workMode: item.workMode || "Office",
    });
    setShowModal(true);
  };

  const openViewModal = (item) => {
    setEditingData(null);
    setShowModal(false);
    setViewData(item);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.employeeId || !formData.name || !formData.department || !formData.date) {
      alert("Please fill required fields");
      return;
    }

    const payload = {
      employeeId: formData.employeeId,
      name: formData.name,
      department: formData.department,
      date: formData.date,
      checkIn: formData.status === "Absent" ? "" : formData.checkIn,
      checkOut: formData.status === "Absent" ? "" : formData.checkOut,
      status: formData.status,
      workMode: formData.workMode,
    };

    try {
      if (editingData) {
        await API.put(`/attendance/${editingData.id}`, payload);
        alert("Attendance updated successfully");
      } else {
        await API.post("/attendance", payload);
        alert("Attendance added successfully");
      }

      setShowModal(false);
      resetForm();
      fetchAttendance();
    } catch (error) {
      console.error("Attendance save error:", error);
      alert("Attendance save nahi ho rahi. Backend fields check karo.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this attendance record?")) {
      return;
    }

    try {
      await API.delete(`/attendance/${id}`);
      alert("Attendance deleted successfully");
      fetchAttendance();
    } catch (error) {
      console.error("Attendance delete error:", error);
      alert("Attendance delete nahi ho rahi. Backend check karo.");
    }
  };

  const getStatusClass = (status) => {
    if (status === "Present") return "status present";
    if (status === "Late") return "status late";
    if (status === "Absent") return "status absent";
    return "status";
  };

  const getWorkModeClass = (mode) => {
    if (mode === "Remote") return "mode remote";
    if (mode === "Hybrid") return "mode hybrid";
    return "mode office";
  };

  return (
    <div className="attendance-page">
      <div className="attendance-header">
        <div>
          <h1>Attendance Management</h1>
          <span className="attendance-title-line"></span>
          <p>Track employee attendance, working hours and work mode.</p>
        </div>

        <button className="attendance-add-btn" onClick={openAddModal}>
          <FaPlus /> Add Attendance
        </button>
      </div>

      <div className="attendance-stats">
        <div className="attendance-card blue">
          <div className="attendance-icon">
            <FaCalendarCheck />
          </div>
          <div>
            <h2>{attendance.length}</h2>
            <h4>Total Records</h4>
            <p>All attendance entries</p>
          </div>
        </div>

        <div className="attendance-card green">
          <div className="attendance-icon">
            <FaUserCheck />
          </div>
          <div>
            <h2>{presentCount}</h2>
            <h4>Present</h4>
            <p>Employees on time</p>
          </div>
        </div>

        <div className="attendance-card orange">
          <div className="attendance-icon">
            <FaClock />
          </div>
          <div>
            <h2>{lateCount}</h2>
            <h4>Late</h4>
            <p>Late check-ins</p>
          </div>
        </div>

        <div className="attendance-card red">
          <div className="attendance-icon">
            <FaUserTimes />
          </div>
          <div>
            <h2>{absentCount}</h2>
            <h4>Absent</h4>
            <p>Absent records</p>
          </div>
        </div>
      </div>

      <div className="attendance-tools">
        <div className="attendance-search">
          <FaSearch />
          <input
            type="text"
            placeholder="Search attendance..."
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

        <input
          type="date"
          value={dateFilter}
          onChange={(e) => {
            setDateFilter(e.target.value);
            setCurrentPage(1);
          }}
        />
      </div>

      <div className="attendance-table-card">
        <table>
          <thead>
            <tr>
              <th>Record ID</th>
              <th>Employee ID</th>
              <th>Name</th>
              <th>Department</th>
              <th>Date</th>
              <th>Check In</th>
              <th>Check Out</th>
              <th>Status</th>
              <th>Work Mode</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {paginatedAttendance.length > 0 ? (
              paginatedAttendance.map((item) => (
                <tr key={item.id}>
                  <td>{item.id}</td>
                  <td>{item.employeeId}</td>
                  <td className="employee-name">{item.name}</td>
                  <td>{item.department}</td>
                  <td>{item.date}</td>
                  <td>{item.checkIn || "-"}</td>
                  <td>{item.checkOut || "-"}</td>
                  <td>
                    <span className={getStatusClass(item.status)}>
                      {item.status}
                    </span>
                  </td>
                  <td>
                    <span className={getWorkModeClass(item.workMode)}>
                      {item.workMode}
                    </span>
                  </td>
                  <td>
                    <div className="attendance-actions">
                      <button className="view-btn" onClick={() => openViewModal(item)}>
                        <FaEye />
                      </button>
                      <button className="edit-btn" onClick={() => openEditModal(item)}>
                        <FaEdit />
                      </button>
                      <button className="delete-btn" onClick={() => handleDelete(item.id)}>
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="10" className="attendance-no-data">
                  {loading ? "Loading..." : "No attendance record found"}
                </td>
              </tr>
            )}
          </tbody>
        </table>

        <div className="attendance-pagination">
          <p>
            Showing {paginatedAttendance.length} of {filteredAttendance.length} results
          </p>

          <div className="attendance-page-buttons">
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
        <div className="attendance-modal-overlay">
          <div className="attendance-modal">
            <div className="attendance-modal-header">
              <h2>{editingData ? "Edit Attendance" : "Add Attendance"}</h2>
              <button onClick={() => setShowModal(false)}>
                <FaTimes />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="attendance-form">
              <div>
                <label>Employee ID</label>
                <input
                  type="text"
                  placeholder="EMP001"
                  value={formData.employeeId}
                  onChange={(e) =>
                    setFormData({ ...formData, employeeId: e.target.value })
                  }
                />
              </div>

              <div>
                <label>Employee Name</label>
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
                  {departments
                    .filter((dept) => dept !== "All Departments")
                    .map((dept) => (
                      <option key={dept}>{dept}</option>
                    ))}
                </select>
              </div>

              <div>
                <label>Date</label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) =>
                    setFormData({ ...formData, date: e.target.value })
                  }
                />
              </div>

              <div>
                <label>Check In</label>
                <input
                  type="time"
                  disabled={formData.status === "Absent"}
                  value={formData.checkIn}
                  onChange={(e) =>
                    setFormData({ ...formData, checkIn: e.target.value })
                  }
                />
              </div>

              <div>
                <label>Check Out</label>
                <input
                  type="time"
                  disabled={formData.status === "Absent"}
                  value={formData.checkOut}
                  onChange={(e) =>
                    setFormData({ ...formData, checkOut: e.target.value })
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
                  {statuses
                    .filter((status) => status !== "All Status")
                    .map((status) => (
                      <option key={status}>{status}</option>
                    ))}
                </select>
              </div>

              <div>
                <label>Work Mode</label>
                <select
                  value={formData.workMode}
                  onChange={(e) =>
                    setFormData({ ...formData, workMode: e.target.value })
                  }
                >
                  {workModes.map((mode) => (
                    <option key={mode}>{mode}</option>
                  ))}
                </select>
              </div>

              <button type="submit" className="attendance-save-btn">
                <FaSave /> {editingData ? "Update Attendance" : "Save Attendance"}
              </button>
            </form>
          </div>
        </div>
      )}

      {viewData && (
        <div className="attendance-modal-overlay">
          <div className="attendance-view-modal">
            <div className="attendance-modal-header">
              <h2>Attendance Details</h2>
              <button onClick={() => setViewData(null)}>
                <FaTimes />
              </button>
            </div>

            <div className="attendance-details">
              <p><strong>Record ID:</strong> {viewData.id}</p>
              <p><strong>Employee ID:</strong> {viewData.employeeId}</p>
              <p><strong>Name:</strong> {viewData.name}</p>
              <p><strong>Department:</strong> {viewData.department}</p>
              <p><strong>Date:</strong> {viewData.date}</p>
              <p><strong>Check In:</strong> {viewData.checkIn || "-"}</p>
              <p><strong>Check Out:</strong> {viewData.checkOut || "-"}</p>
              <p><strong>Status:</strong> {viewData.status}</p>
              <p><strong>Work Mode:</strong> {viewData.workMode}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}