import { useMemo, useState } from "react";
import "./Leave.css";
import {
  FaEye,
  FaEdit,
  FaTrash,
  FaPlus,
  FaTimes,
  FaPlaneDeparture,
  FaCheckCircle,
  FaClock,
  FaTimesCircle,
} from "react-icons/fa";

const initialLeaves = [
  {
    id: "LEV001",
    employeeId: "EMP001",
    name: "Vivek Srivastava",
    department: "IT Department",
    leaveType: "Casual Leave",
    fromDate: "2026-05-28",
    toDate: "2026-05-29",
    days: 2,
    reason: "Personal work",
    status: "Pending",
  },
  {
    id: "LEV002",
    employeeId: "EMP002",
    name: "Rahul Sharma",
    department: "IT Department",
    leaveType: "Sick Leave",
    fromDate: "2026-05-30",
    toDate: "2026-05-30",
    days: 1,
    reason: "Fever",
    status: "Approved",
  },
  {
    id: "LEV003",
    employeeId: "EMP003",
    name: "Priya Patel",
    department: "HR Department",
    leaveType: "Paid Leave",
    fromDate: "2026-06-01",
    toDate: "2026-06-03",
    days: 3,
    reason: "Family function",
    status: "Rejected",
  },
];

export default function Leave() {
  const [leaves, setLeaves] = useState(initialLeaves);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [departmentFilter, setDepartmentFilter] = useState("All");
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [viewLeave, setViewLeave] = useState(null);

  const [form, setForm] = useState({
    employeeId: "",
    name: "",
    department: "",
    leaveType: "Casual Leave",
    fromDate: "",
    toDate: "",
    days: "",
    reason: "",
    status: "Pending",
  });

  const departments = useMemo(() => {
    return ["All", ...new Set(leaves.map((item) => item.department))];
  }, [leaves]);

  const filteredLeaves = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    return leaves.filter((item) => {
      const matchSearch = [
        item.id,
        item.employeeId,
        item.name,
        item.department,
        item.leaveType,
        item.reason,
        item.status,
      ]
        .join(" ")
        .toLowerCase()
        .includes(keyword);

      const matchStatus =
        statusFilter === "All" || item.status === statusFilter;

      const matchDepartment =
        departmentFilter === "All" || item.department === departmentFilter;

      return matchSearch && matchStatus && matchDepartment;
    });
  }, [leaves, search, statusFilter, departmentFilter]);

  const totalLeaves = leaves.length;
  const pendingLeaves = leaves.filter((item) => item.status === "Pending").length;
  const approvedLeaves = leaves.filter((item) => item.status === "Approved").length;
  const rejectedLeaves = leaves.filter((item) => item.status === "Rejected").length;

  const generateLeaveId = () => {
    if (leaves.length === 0) return "LEV001";

    const maxNumber = Math.max(
      ...leaves.map((item) => Number(item.id.replace("LEV", "")))
    );

    return `LEV${String(maxNumber + 1).padStart(3, "0")}`;
  };

  const resetForm = () => {
    setForm({
      employeeId: "",
      name: "",
      department: "",
      leaveType: "Casual Leave",
      fromDate: "",
      toDate: "",
      days: "",
      reason: "",
      status: "Pending",
    });
    setEditId(null);
    setShowModal(false);
  };

  const openAddModal = () => {
    resetForm();
    setShowModal(true);
  };

  const calculateDays = (fromDate, toDate) => {
    if (!fromDate || !toDate) return "";

    const start = new Date(fromDate);
    const end = new Date(toDate);
    const diff = end - start;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24)) + 1;

    return days > 0 ? days : "";
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    const updatedForm = {
      ...form,
      [name]: value,
    };

    if (name === "fromDate" || name === "toDate") {
      const from = name === "fromDate" ? value : form.fromDate;
      const to = name === "toDate" ? value : form.toDate;
      updatedForm.days = calculateDays(from, to);
    }

    setForm(updatedForm);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      !form.employeeId.trim() ||
      !form.name.trim() ||
      !form.department.trim() ||
      !form.fromDate ||
      !form.toDate ||
      !form.reason.trim()
    ) {
      alert("Please fill all required fields");
      return;
    }

    if (!form.days) {
      alert("To Date should be greater than or equal to From Date");
      return;
    }

    const payload = {
      id: editId || generateLeaveId(),
      ...form,
      days: Number(form.days),
    };

    if (editId) {
      setLeaves(leaves.map((item) => (item.id === editId ? payload : item)));
    } else {
      setLeaves([...leaves, payload]);
    }

    resetForm();
  };

  const handleEdit = (item) => {
    setEditId(item.id);
    setForm({
      employeeId: item.employeeId,
      name: item.name,
      department: item.department,
      leaveType: item.leaveType,
      fromDate: item.fromDate,
      toDate: item.toDate,
      days: item.days,
      reason: item.reason,
      status: item.status,
    });
    setShowModal(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("Delete this leave request?")) {
      setLeaves(leaves.filter((item) => item.id !== id));

      if (editId === id) resetForm();
      if (viewLeave?.id === id) setViewLeave(null);
    }
  };

  const updateStatus = (id, status) => {
    setLeaves(
      leaves.map((item) => (item.id === id ? { ...item, status } : item))
    );
  };

  return (
    <main className="leave-page">
      <div className="leave-header">
        <div>
          <h1>Leave Management</h1>
          <p>Manage employee leave requests, approvals and leave history.</p>
        </div>

        <button type="button" className="add-leave-btn" onClick={openAddModal}>
          <FaPlus /> Add Leave
        </button>
      </div>

      <section className="leave-stats">
        <div className="leave-stat-card blue">
          <FaPlaneDeparture />
          <div>
            <h2>{totalLeaves}</h2>
            <p>Total Leaves</p>
          </div>
        </div>

        <div className="leave-stat-card orange">
          <FaClock />
          <div>
            <h2>{pendingLeaves}</h2>
            <p>Pending</p>
          </div>
        </div>

        <div className="leave-stat-card green">
          <FaCheckCircle />
          <div>
            <h2>{approvedLeaves}</h2>
            <p>Approved</p>
          </div>
        </div>

        <div className="leave-stat-card red">
          <FaTimesCircle />
          <div>
            <h2>{rejectedLeaves}</h2>
            <p>Rejected</p>
          </div>
        </div>
      </section>

      <section className="leave-filter-row">
        <div className="leave-search">
          <span>🔍</span>
          <input
            type="text"
            placeholder="Search leave requests..."
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
          <option value="Pending">Pending</option>
          <option value="Approved">Approved</option>
          <option value="Rejected">Rejected</option>
        </select>
      </section>

      <section className="leave-card">
        <table className="leave-table">
          <thead>
            <tr>
              <th>Leave ID</th>
              <th>Employee ID</th>
              <th>Name</th>
              <th>Department</th>
              <th>Leave Type</th>
              <th>From</th>
              <th>To</th>
              <th>Days</th>
              <th>Status</th>
              <th>Approval</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredLeaves.length > 0 ? (
              filteredLeaves.map((item) => (
                <tr key={item.id}>
                  <td>{item.id}</td>
                  <td>{item.employeeId}</td>
                  <td className="leave-name">{item.name}</td>
                  <td>{item.department}</td>
                  <td>{item.leaveType}</td>
                  <td>{item.fromDate}</td>
                  <td>{item.toDate}</td>
                  <td>{item.days}</td>
                  <td>
                    <span className={`leave-badge ${item.status.toLowerCase()}`}>
                      {item.status}
                    </span>
                  </td>
                  <td>
                    <div className="leave-approval-actions">
                      <button
                        type="button"
                        className="approve-btn"
                        onClick={() => updateStatus(item.id, "Approved")}
                      >
                        Approve
                      </button>

                      <button
                        type="button"
                        className="reject-btn"
                        onClick={() => updateStatus(item.id, "Rejected")}
                      >
                        Reject
                      </button>
                    </div>
                  </td>
                  <td>
                    <div className="leave-actions">
                      <button
                        type="button"
                        className="view-btn"
                        onClick={() => setViewLeave(item)}
                      >
                        <FaEye />
                      </button>

                      <button
                        type="button"
                        className="edit-btn"
                        onClick={() => handleEdit(item)}
                      >
                        <FaEdit />
                      </button>

                      <button
                        type="button"
                        className="delete-btn"
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
                <td colSpan="11" className="leave-empty">
                  No leave requests found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </section>

      {showModal && (
        <div className="leave-modal-overlay">
          <div className="leave-modal">
            <div className="leave-modal-header">
              <h2>{editId ? "Edit Leave" : "Add Leave"}</h2>

              <button type="button" onClick={resetForm}>
                <FaTimes />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="leave-form">
              <input
                name="employeeId"
                placeholder="Employee ID"
                value={form.employeeId}
                onChange={handleChange}
              />

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

              <select
                name="leaveType"
                value={form.leaveType}
                onChange={handleChange}
              >
                <option value="Casual Leave">Casual Leave</option>
                <option value="Sick Leave">Sick Leave</option>
                <option value="Paid Leave">Paid Leave</option>
                <option value="Unpaid Leave">Unpaid Leave</option>
                <option value="Emergency Leave">Emergency Leave</option>
              </select>

              <input
                type="date"
                name="fromDate"
                value={form.fromDate}
                onChange={handleChange}
              />

              <input
                type="date"
                name="toDate"
                value={form.toDate}
                onChange={handleChange}
              />

              <input
                type="number"
                name="days"
                placeholder="Leave Days"
                value={form.days}
                onChange={handleChange}
                min="1"
              />

              <textarea
                name="reason"
                placeholder="Leave Reason"
                value={form.reason}
                onChange={handleChange}
              />

              <select name="status" value={form.status} onChange={handleChange}>
                <option value="Pending">Pending</option>
                <option value="Approved">Approved</option>
                <option value="Rejected">Rejected</option>
              </select>

              <button type="submit">
                {editId ? "Update Leave" : "Save Leave"}
              </button>
            </form>
          </div>
        </div>
      )}

      {viewLeave && (
        <div className="leave-modal-overlay">
          <div className="leave-view-modal">
            <h2>Leave Details</h2>

            <p><b>Leave ID:</b> {viewLeave.id}</p>
            <p><b>Employee ID:</b> {viewLeave.employeeId}</p>
            <p><b>Name:</b> {viewLeave.name}</p>
            <p><b>Department:</b> {viewLeave.department}</p>
            <p><b>Leave Type:</b> {viewLeave.leaveType}</p>
            <p><b>From:</b> {viewLeave.fromDate}</p>
            <p><b>To:</b> {viewLeave.toDate}</p>
            <p><b>Days:</b> {viewLeave.days}</p>
            <p><b>Reason:</b> {viewLeave.reason}</p>
            <p><b>Status:</b> {viewLeave.status}</p>

            <button type="button" onClick={() => setViewLeave(null)}>
              Close
            </button>
          </div>
        </div>
      )}
    </main>
  );
}