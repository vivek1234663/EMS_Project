import { useMemo, useState } from "react";
import "./Attendance.css";
import {
  FaEye,
  FaEdit,
  FaTrash,
  FaPlus,
  FaTimes,
  FaCalendarCheck,
  FaUserCheck,
  FaUserTimes,
  FaClock,
} from "react-icons/fa";

const initialAttendance = [
  {
    id: "ATT001",
    employeeId: "EMP001",
    name: "Vivek Srivastava",
    department: "IT Department",
    date: "2026-05-28",
    checkIn: "09:30",
    checkOut: "18:15",
    status: "Present",
    workMode: "Office",
  },
  {
    id: "ATT002",
    employeeId: "EMP002",
    name: "Rahul Sharma",
    department: "IT Department",
    date: "2026-05-28",
    checkIn: "09:55",
    checkOut: "18:00",
    status: "Late",
    workMode: "Office",
  },
  {
    id: "ATT003",
    employeeId: "EMP003",
    name: "Priya Patel",
    department: "HR Department",
    date: "2026-05-28",
    checkIn: "",
    checkOut: "",
    status: "Absent",
    workMode: "Office",
  },
  {
    id: "ATT004",
    employeeId: "EMP004",
    name: "Amit Verma",
    department: "Finance Department",
    date: "2026-05-28",
    checkIn: "09:40",
    checkOut: "18:10",
    status: "Present",
    workMode: "Remote",
  },
];

export default function Attendance() {
  const [attendance, setAttendance] = useState(initialAttendance);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [departmentFilter, setDepartmentFilter] = useState("All");
  const [dateFilter, setDateFilter] = useState("");

  const [showAttendanceModal, setShowAttendanceModal] = useState(false);
  const [editAttendanceId, setEditAttendanceId] = useState(null);
  const [viewAttendance, setViewAttendance] = useState(null);

  const [attendanceForm, setAttendanceForm] = useState({
    employeeId: "",
    name: "",
    department: "",
    date: "",
    checkIn: "",
    checkOut: "",
    status: "Present",
    workMode: "Office",
  });

  const departments = useMemo(() => {
    return ["All", ...new Set(attendance.map((item) => item.department))];
  }, [attendance]);

  const filteredAttendance = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    return attendance.filter((item) => {
      const matchSearch = [
        item.id,
        item.employeeId,
        item.name,
        item.department,
        item.date,
        item.status,
        item.workMode,
      ]
        .join(" ")
        .toLowerCase()
        .includes(keyword);

      const matchStatus =
        statusFilter === "All" || item.status === statusFilter;

      const matchDepartment =
        departmentFilter === "All" || item.department === departmentFilter;

      const matchDate = !dateFilter || item.date === dateFilter;

      return matchSearch && matchStatus && matchDepartment && matchDate;
    });
  }, [attendance, search, statusFilter, departmentFilter, dateFilter]);

  const totalRecords = attendance.length;
  const presentCount = attendance.filter(
    (item) => item.status === "Present"
  ).length;
  const lateCount = attendance.filter((item) => item.status === "Late").length;
  const absentCount = attendance.filter(
    (item) => item.status === "Absent"
  ).length;

  const generateAttendanceId = () => {
    if (attendance.length === 0) return "ATT001";

    const maxNumber = Math.max(
      ...attendance.map((item) => Number(item.id.replace("ATT", "")))
    );

    return `ATT${String(maxNumber + 1).padStart(3, "0")}`;
  };

  const resetAttendanceForm = () => {
    setAttendanceForm({
      employeeId: "",
      name: "",
      department: "",
      date: "",
      checkIn: "",
      checkOut: "",
      status: "Present",
      workMode: "Office",
    });
    setEditAttendanceId(null);
    setShowAttendanceModal(false);
  };

  const openAddModal = () => {
    setEditAttendanceId(null);
    setAttendanceForm({
      employeeId: "",
      name: "",
      department: "",
      date: "",
      checkIn: "",
      checkOut: "",
      status: "Present",
      workMode: "Office",
    });
    setShowAttendanceModal(true);
  };

  const handleAttendanceChange = (e) => {
    const { name, value } = e.target;

    const updatedForm = {
      ...attendanceForm,
      [name]: value,
    };

    if (name === "status" && value === "Absent") {
      updatedForm.checkIn = "";
      updatedForm.checkOut = "";
    }

    setAttendanceForm(updatedForm);
  };

  const handleAttendanceSubmit = (e) => {
    e.preventDefault();

    if (
      !attendanceForm.employeeId.trim() ||
      !attendanceForm.name.trim() ||
      !attendanceForm.department.trim() ||
      !attendanceForm.date ||
      !attendanceForm.status
    ) {
      alert("Please fill all required fields");
      return;
    }

    if (
      attendanceForm.status !== "Absent" &&
      (!attendanceForm.checkIn || !attendanceForm.checkOut)
    ) {
      alert("Please fill check-in and check-out time");
      return;
    }

    const payload = {
      id: editAttendanceId || generateAttendanceId(),
      ...attendanceForm,
    };

    if (editAttendanceId) {
      setAttendance(
        attendance.map((item) =>
          item.id === editAttendanceId ? payload : item
        )
      );
    } else {
      setAttendance([...attendance, payload]);
    }

    resetAttendanceForm();
  };

  const handleEditAttendance = (record) => {
    setEditAttendanceId(record.id);
    setAttendanceForm({
      employeeId: record.employeeId,
      name: record.name,
      department: record.department,
      date: record.date,
      checkIn: record.checkIn,
      checkOut: record.checkOut,
      status: record.status,
      workMode: record.workMode,
    });
    setShowAttendanceModal(true);
  };

  const handleDeleteAttendance = (id) => {
    if (window.confirm("Delete this attendance record?")) {
      setAttendance(attendance.filter((item) => item.id !== id));

      if (editAttendanceId === id) {
        resetAttendanceForm();
      }

      if (viewAttendance?.id === id) {
        setViewAttendance(null);
      }
    }
  };

  return (
    <main className="attendance-page">
      <div className="attendance-header">
        <div>
          <h1>Attendance Management</h1>
          <p>Track employee attendance, working hours and work mode.</p>
        </div>

        <button
          type="button"
          className="attendance-export-btn"
          onClick={openAddModal}
        >
          <FaPlus /> Add Attendance
        </button>
      </div>

      <section className="attendance-stats">
        <div className="attendance-stat-card blue">
          <FaCalendarCheck />
          <div>
            <h2>{totalRecords}</h2>
            <p>Total Records</p>
          </div>
        </div>

        <div className="attendance-stat-card green">
          <FaUserCheck />
          <div>
            <h2>{presentCount}</h2>
            <p>Present</p>
          </div>
        </div>

        <div className="attendance-stat-card orange">
          <FaClock />
          <div>
            <h2>{lateCount}</h2>
            <p>Late</p>
          </div>
        </div>

        <div className="attendance-stat-card red">
          <FaUserTimes />
          <div>
            <h2>{absentCount}</h2>
            <p>Absent</p>
          </div>
        </div>
      </section>

      <section className="attendance-filter-row">
        <div className="attendance-search">
          <span>🔍</span>
          <input
            type="text"
            placeholder="Search attendance..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <select
          value={departmentFilter}
          onChange={(e) => setDepartmentFilter(e.target.value)}
        >
          {departments.map((dept) => (
            <option key={dept} value={dept}>
              {dept === "All" ? "All Departments" : dept}
            </option>
          ))}
        </select>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="All">All Status</option>
          <option value="Present">Present</option>
          <option value="Late">Late</option>
          <option value="Absent">Absent</option>
        </select>

        <input
          className="attendance-date-filter"
          type="date"
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
        />
      </section>

      <section className="attendance-card">
        <table className="attendance-table">
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
            {filteredAttendance.length > 0 ? (
              filteredAttendance.map((item) => (
                <tr key={item.id}>
                  <td>{item.id}</td>
                  <td>{item.employeeId}</td>
                  <td className="attendance-name">{item.name}</td>
                  <td>{item.department}</td>
                  <td>{item.date}</td>
                  <td>{item.checkIn || "-"}</td>
                  <td>{item.checkOut || "-"}</td>
                  <td>
                    <span
                      className={`attendance-badge ${item.status.toLowerCase()}`}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td>
                    <span className="workmode-pill">{item.workMode}</span>
                  </td>
                  <td>
                    <div className="attendance-actions">
                      <button
                        type="button"
                        className="view-btn"
                        onClick={() => setViewAttendance(item)}
                      >
                        <FaEye />
                      </button>

                      <button
                        type="button"
                        className="edit-btn"
                        onClick={() => handleEditAttendance(item)}
                      >
                        <FaEdit />
                      </button>

                      <button
                        type="button"
                        className="delete-btn"
                        onClick={() => handleDeleteAttendance(item.id)}
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="10" className="attendance-empty">
                  No attendance records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </section>

      {showAttendanceModal && (
        <div className="attendance-modal-overlay">
          <div className="attendance-modal">
            <div className="attendance-modal-header">
              <h2>{editAttendanceId ? "Edit Attendance" : "Add Attendance"}</h2>

              <button type="button" onClick={resetAttendanceForm}>
                <FaTimes />
              </button>
            </div>

            <form onSubmit={handleAttendanceSubmit} className="attendance-form">
              <input
                name="employeeId"
                placeholder="Employee ID"
                value={attendanceForm.employeeId}
                onChange={handleAttendanceChange}
              />

              <input
                name="name"
                placeholder="Employee Name"
                value={attendanceForm.name}
                onChange={handleAttendanceChange}
              />

              <input
                name="department"
                placeholder="Department"
                value={attendanceForm.department}
                onChange={handleAttendanceChange}
              />

              <input
                type="date"
                name="date"
                value={attendanceForm.date}
                onChange={handleAttendanceChange}
              />

              <input
                type="time"
                name="checkIn"
                value={attendanceForm.checkIn}
                onChange={handleAttendanceChange}
                disabled={attendanceForm.status === "Absent"}
              />

              <input
                type="time"
                name="checkOut"
                value={attendanceForm.checkOut}
                onChange={handleAttendanceChange}
                disabled={attendanceForm.status === "Absent"}
              />

              <select
                name="status"
                value={attendanceForm.status}
                onChange={handleAttendanceChange}
              >
                <option value="Present">Present</option>
                <option value="Late">Late</option>
                <option value="Absent">Absent</option>
              </select>

              <select
                name="workMode"
                value={attendanceForm.workMode}
                onChange={handleAttendanceChange}
              >
                <option value="Office">Office</option>
                <option value="Remote">Remote</option>
                <option value="Hybrid">Hybrid</option>
              </select>

              <button type="submit">
                {editAttendanceId ? "Update Attendance" : "Save Attendance"}
              </button>
            </form>
          </div>
        </div>
      )}

      {viewAttendance && (
        <div className="attendance-modal-overlay">
          <div className="attendance-view-modal">
            <h2>Attendance Details</h2>

            <p>
              <b>Record ID:</b> {viewAttendance.id}
            </p>
            <p>
              <b>Employee ID:</b> {viewAttendance.employeeId}
            </p>
            <p>
              <b>Name:</b> {viewAttendance.name}
            </p>
            <p>
              <b>Department:</b> {viewAttendance.department}
            </p>
            <p>
              <b>Date:</b> {viewAttendance.date}
            </p>
            <p>
              <b>Check In:</b> {viewAttendance.checkIn || "-"}
            </p>
            <p>
              <b>Check Out:</b> {viewAttendance.checkOut || "-"}
            </p>
            <p>
              <b>Status:</b> {viewAttendance.status}
            </p>
            <p>
              <b>Work Mode:</b> {viewAttendance.workMode}
            </p>

            <button type="button" onClick={() => setViewAttendance(null)}>
              Close
            </button>
          </div>
        </div>
      )}
    </main>
  );
}