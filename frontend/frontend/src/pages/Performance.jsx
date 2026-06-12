import { useMemo, useState } from "react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import {
  FaDownload,
  FaUpload,
  FaEye,
  FaEdit,
  FaTrash,
  FaPlus,
  FaStar,
  FaUsers,
  FaChartLine,
  FaTrophy,
} from "react-icons/fa";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import "./Performance.css";

const initialData = [
  {
    id: 1,
    name: "Vivek Srivastava",
    department: "IT Department",
    role: "Full Stack Developer",
    rating: 5,
    score: 92,
    attendance: 96,
    completedTasks: 42,
    pendingTasks: 3,
    status: "Excellent",
    month: "May 2026",
    comments: "Outstanding performance.",
  },
  {
    id: 2,
    name: "Rahul Sharma",
    department: "IT Department",
    role: "Backend Developer",
    rating: 4,
    score: 81,
    attendance: 90,
    completedTasks: 35,
    pendingTasks: 5,
    status: "Good",
    month: "May 2026",
    comments: "Good backend work.",
  },
  {
    id: 3,
    name: "Priya Patel",
    department: "HR Department",
    role: "HR Executive",
    rating: 3,
    score: 68,
    attendance: 86,
    completedTasks: 24,
    pendingTasks: 8,
    status: "Average",
    month: "May 2026",
    comments: "Needs improvement.",
  },
];

const emptyForm = {
  name: "",
  department: "",
  role: "",
  rating: "",
  score: "",
  attendance: "",
  completedTasks: "",
  pendingTasks: "",
  status: "",
  month: "",
  comments: "",
};

export default function Performance() {
  const [records, setRecords] = useState(initialData);
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState(null);
  const [viewData, setViewData] = useState(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [ratingFilter, setRatingFilter] = useState("All");

  const filteredRecords = useMemo(() => {
    return records.filter((item) => {
      const text = search.toLowerCase();

      const matchSearch =
        item.name.toLowerCase().includes(text) ||
        item.department.toLowerCase().includes(text) ||
        item.role.toLowerCase().includes(text);

      const matchStatus =
        statusFilter === "All" || item.status === statusFilter;

      const matchRating =
        ratingFilter === "All" || item.rating === Number(ratingFilter);

      return matchSearch && matchStatus && matchRating;
    });
  }, [records, search, statusFilter, ratingFilter]);

  const totalRecords = records.length;
  const excellentCount = records.filter((item) => item.status === "Excellent").length;

  const averageScore =
    totalRecords === 0
      ? 0
      : Math.round(records.reduce((sum, item) => sum + item.score, 0) / totalRecords);

  const averageRating =
    totalRecords === 0
      ? 0
      : (records.reduce((sum, item) => sum + item.rating, 0) / totalRecords).toFixed(1);

  const topEmployee = records.reduce(
    (best, item) => (item.score > best.score ? item : best),
    records[0]
  );

  const lowEmployee = records.reduce(
    (low, item) => (item.score < low.score ? item : low),
    records[0]
  );

  const departmentChartData = Object.values(
    records.reduce((acc, item) => {
      if (!acc[item.department]) {
        acc[item.department] = {
          name: item.department,
          value: 0,
          count: 0,
        };
      }

      acc[item.department].value += item.score;
      acc[item.department].count += 1;
      return acc;
    }, {})
  ).map((item) => ({
    name: item.name,
    value: Math.round(item.value / item.count),
  }));

  const barChartData = records.map((item) => ({
    name: item.name.split(" ")[0],
    score: item.score,
  }));

  const ratingChartData = [1, 2, 3, 4, 5].map((rating) => ({
    rating: `${rating} Star`,
    count: records.filter((item) => item.rating === rating).length,
  }));

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const resetForm = () => {
    setForm(emptyForm);
    setEditId(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.name || !form.department || !form.role || !form.rating || !form.score) {
      alert("Please fill required fields");
      return;
    }

    const payload = {
      ...form,
      rating: Number(form.rating),
      score: Number(form.score),
      attendance: Number(form.attendance),
      completedTasks: Number(form.completedTasks),
      pendingTasks: Number(form.pendingTasks),
    };

    if (editId) {
      setRecords(records.map((item) => (item.id === editId ? { ...payload, id: editId } : item)));
    } else {
      setRecords([{ ...payload, id: Date.now() }, ...records]);
    }

    resetForm();
  };

  const handleEdit = (item) => {
    setEditId(item.id);
    setForm(item);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this record?")) {
      setRecords(records.filter((item) => item.id !== id));
    }
  };

  const downloadExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(records);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Performance");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const fileData = new Blob([excelBuffer], {
      type: "application/octet-stream",
    });

    saveAs(fileData, "employee-performance.xlsx");
  };

  const importExcel = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = (event) => {
      const workbook = XLSX.read(event.target.result, { type: "binary" });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const data = XLSX.utils.sheet_to_json(sheet);

      const formatted = data.map((item, index) => ({
        id: Date.now() + index,
        name: item.name || item.Name || "",
        department: item.department || item.Department || "",
        role: item.role || item.Role || "",
        rating: Number(item.rating || item.Rating || 1),
        score: Number(item.score || item.Score || 0),
        attendance: Number(item.attendance || item.Attendance || 0),
        completedTasks: Number(item.completedTasks || item.CompletedTasks || 0),
        pendingTasks: Number(item.pendingTasks || item.PendingTasks || 0),
        status: item.status || item.Status || "Average",
        month: item.month || item.Month || "",
        comments: item.comments || item.Comments || "",
      }));

      setRecords([...formatted, ...records]);
    };

    reader.readAsBinaryString(file);
  };

  const colors = ["#2563eb", "#22c55e", "#f97316", "#7c3aed", "#ef4444"];

  return (
    <div className="performance-page">
      <div className="performance-header">
        <div>
          <h1>Employee Performance</h1>
          <p>Track employee rating, score and monthly performance.</p>
        </div>

        <div className="performance-header-actions">
          <label className="import-btn">
            <FaUpload /> Import Excel
            <input type="file" accept=".xlsx,.xls" onChange={importExcel} hidden />
          </label>

          <button className="download-btn" onClick={downloadExcel}>
            <FaDownload /> Download Excel
          </button>
        </div>
      </div>

      <div className="performance-cards">
        <div className="performance-card blue">
          <div className="card-icon"><FaUsers /></div>
          <div>
            <h3>{totalRecords}</h3>
            <p>Total Records</p>
          </div>
        </div>

        <div className="performance-card green">
          <div className="card-icon"><FaStar /></div>
          <div>
            <h3>{excellentCount}</h3>
            <p>Excellent Employees</p>
          </div>
        </div>

        <div className="performance-card purple">
          <div className="card-icon"><FaChartLine /></div>
          <div>
            <h3>{averageScore}%</h3>
            <p>Average Score</p>
          </div>
        </div>

        <div className="performance-card orange">
          <div className="card-icon"><FaTrophy /></div>
          <div>
            <h3>{topEmployee?.name || "N/A"}</h3>
            <p>Top Rated Employee</p>
          </div>
        </div>
      </div>

      <div className="analytics-grid">
        <div><b>Average Rating:</b> {averageRating} ⭐</div>
        <div><b>Highest Performer:</b> {topEmployee?.name} ({topEmployee?.score}%)</div>
        <div><b>Lowest Performer:</b> {lowEmployee?.name} ({lowEmployee?.score}%)</div>
      </div>

      <div className="charts-grid">
        <div className="chart-card">
          <h3>Department Performance</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={departmentChartData} dataKey="value" nameKey="name" outerRadius={85} label>
                {departmentChartData.map((_, index) => (
                  <Cell key={index} fill={colors[index % colors.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card">
          <h3>Employee Score</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={barChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="score" fill="#2563eb" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card">
          <h3>Rating Distribution</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={ratingChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="rating" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#7c3aed" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="performance-main">
        <form className="performance-form" onSubmit={handleSubmit}>
          <h2>{editId ? "Update Performance" : "Add Performance"}</h2>

          <input name="name" placeholder="Employee Name" value={form.name} onChange={handleChange} />
          <input name="department" placeholder="Department" value={form.department} onChange={handleChange} />
          <input name="role" placeholder="Role" value={form.role} onChange={handleChange} />

          <input name="rating" type="number" min="1" max="5" placeholder="Rating 1-5" value={form.rating} onChange={handleChange} />
          <input name="score" type="number" min="0" max="100" placeholder="Score %" value={form.score} onChange={handleChange} />
          <input name="attendance" type="number" min="0" max="100" placeholder="Attendance %" value={form.attendance} onChange={handleChange} />

          <input name="completedTasks" type="number" placeholder="Completed Tasks" value={form.completedTasks} onChange={handleChange} />
          <input name="pendingTasks" type="number" placeholder="Pending Tasks" value={form.pendingTasks} onChange={handleChange} />

          <select name="status" value={form.status} onChange={handleChange}>
            <option value="">Select Status</option>
            <option value="Excellent">Excellent</option>
            <option value="Good">Good</option>
            <option value="Average">Average</option>
            <option value="Poor">Poor</option>
          </select>

          <input name="month" placeholder="Month e.g. May 2026" value={form.month} onChange={handleChange} />
          <textarea name="comments" placeholder="Manager Comments" value={form.comments} onChange={handleChange}></textarea>

          <button type="submit">
            <FaPlus /> {editId ? "Update" : "Add"} Performance
          </button>

          {editId && (
            <button type="button" className="cancel-btn" onClick={resetForm}>
              Cancel
            </button>
          )}
        </form>

        <div className="performance-table-box">
          <div className="table-top">
            <h2>Performance List</h2>

            <div className="table-filters">
              <input
                type="text"
                placeholder="Search employee..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />

              <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                <option value="All">All Status</option>
                <option value="Excellent">Excellent</option>
                <option value="Good">Good</option>
                <option value="Average">Average</option>
                <option value="Poor">Poor</option>
              </select>

              <select value={ratingFilter} onChange={(e) => setRatingFilter(e.target.value)}>
                <option value="All">All Rating</option>
                <option value="5">5 Star</option>
                <option value="4">4 Star</option>
                <option value="3">3 Star</option>
                <option value="2">2 Star</option>
                <option value="1">1 Star</option>
              </select>
            </div>
          </div>

          <div className="table-responsive">
            <table>
              <thead>
                <tr>
                  <th>Employee</th>
                  <th>Department</th>
                  <th>Role</th>
                  <th>Rating</th>
                  <th>Score</th>
                  <th>Status</th>
                  <th>Month</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredRecords.map((item) => (
                  <tr key={item.id}>
                    <td>{item.name}</td>
                    <td>{item.department}</td>
                    <td>{item.role}</td>
                    <td>{"⭐".repeat(item.rating)}</td>
                    <td>
                      <div className="score-bar">
                        <span style={{ width: `${item.score}%` }}></span>
                      </div>
                      {item.score}%
                    </td>
                    <td>
                      <span className={`status ${item.status.toLowerCase()}`}>
                        {item.status}
                      </span>
                    </td>
                    <td>{item.month}</td>
                    <td className="action-buttons">
                      <button className="view-btn" onClick={() => setViewData(item)}>
                        <FaEye />
                      </button>
                      <button className="edit-btn" onClick={() => handleEdit(item)}>
                        <FaEdit />
                      </button>
                      <button className="delete-btn" onClick={() => handleDelete(item.id)}>
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))}

                {filteredRecords.length === 0 && (
                  <tr>
                    <td colSpan="8" className="no-data">No record found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {viewData && (
        <div className="modal-overlay" onClick={() => setViewData(null)}>
          <div className="view-modal" onClick={(e) => e.stopPropagation()}>
            <h2>{viewData.name}</h2>
            <p><b>Department:</b> {viewData.department}</p>
            <p><b>Role:</b> {viewData.role}</p>
            <p><b>Rating:</b> {"⭐".repeat(viewData.rating)}</p>
            <p><b>Score:</b> {viewData.score}%</p>
            <p><b>Attendance:</b> {viewData.attendance}%</p>
            <p><b>Completed Tasks:</b> {viewData.completedTasks}</p>
            <p><b>Pending Tasks:</b> {viewData.pendingTasks}</p>
            <p><b>Status:</b> {viewData.status}</p>
            <p><b>Month:</b> {viewData.month}</p>
            <p><b>Comments:</b> {viewData.comments}</p>

            <button onClick={() => setViewData(null)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}