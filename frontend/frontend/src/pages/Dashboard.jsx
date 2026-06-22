import { useEffect, useState } from "react";
import "./Dashboard.css";
import API from "../api/api";
import {
  FaUsers,
  FaUserCheck,
  FaUserTimes,
  FaBuilding,
  FaChartLine,
  FaMoneyBillWave,
} from "react-icons/fa";

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalEmployees: 0,
    activeEmployees: 0,
    inactiveEmployees: 0,
    totalDepartments: 0,
    totalAttendance: 0,
    totalPerformance: 0,
    totalSalary: 0,
  });

  const [recentEmployees, setRecentEmployees] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      const statsRes = await API.get("/dashboard/stats");
      setStats({
        totalEmployees: statsRes.data.totalEmployees || 0,
        activeEmployees: statsRes.data.activeEmployees || 0,
        inactiveEmployees: statsRes.data.inactiveEmployees || 0,
        totalDepartments: statsRes.data.totalDepartments || 0,
        totalAttendance: statsRes.data.totalAttendance || 0,
        totalPerformance: statsRes.data.totalPerformance || 0,
        totalSalary: statsRes.data.totalSalary || 0,
      });

      const empRes = await API.get("/employees");
      setRecentEmployees(Array.isArray(empRes.data) ? empRes.data.slice(0, 5) : []);
    } catch (error) {
      console.error("Dashboard fetch error:", error);
      alert("Dashboard data load nahi ho raha. Backend/API check karo.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const activePercentage =
    stats.totalEmployees > 0
      ? Math.round((stats.activeEmployees / stats.totalEmployees) * 100)
      : 0;

  const formatDate = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <main className="dashboard">
      <div className="dashboard-top">
        <div>
          <h1>Welcome back, Vivek 👋</h1>
          <p>
            {loading
              ? "Loading dashboard data..."
              : "Here’s what’s happening with your organization today."}
          </p>
        </div>

        <div className="date-pill">
          {new Date().toLocaleDateString("en-US", {
            weekday: "long",
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card blue">
          <div className="stat-icon">
            <FaUsers />
          </div>
          <div>
            <p>Total Employees</p>
            <h2>{stats.totalEmployees}</h2>
            <span>Live backend data</span>
          </div>
        </div>

        <div className="stat-card green">
          <div className="stat-icon">
            <FaUserCheck />
          </div>
          <div>
            <p>Active Employees</p>
            <h2>{stats.activeEmployees}</h2>
            <span>{activePercentage}% active</span>
          </div>
        </div>

        <div className="stat-card orange">
          <div className="stat-icon">
            <FaUserTimes />
          </div>
          <div>
            <p>Inactive Employees</p>
            <h2>{stats.inactiveEmployees}</h2>
            <span>Inactive staff count</span>
          </div>
        </div>

        <div className="stat-card purple">
          <div className="stat-icon">
            <FaBuilding />
          </div>
          <div>
            <p>Departments</p>
            <h2>{stats.totalDepartments}</h2>
            <span>Total departments</span>
          </div>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card blue">
          <div className="stat-icon">
            <FaChartLine />
          </div>
          <div>
            <p>Attendance Records</p>
            <h2>{stats.totalAttendance}</h2>
            <span>Total attendance entries</span>
          </div>
        </div>

        <div className="stat-card green">
          <div className="stat-icon">
            <FaChartLine />
          </div>
          <div>
            <p>Performance Records</p>
            <h2>{stats.totalPerformance}</h2>
            <span>Total performance entries</span>
          </div>
        </div>

        <div className="stat-card orange">
          <div className="stat-icon">
            <FaMoneyBillWave />
          </div>
          <div>
            <p>Salary Records</p>
            <h2>{stats.totalSalary}</h2>
            <span>Total salary entries</span>
          </div>
        </div>
      </div>

      <div className="middle-grid">
        <div className="card status-card">
          <h3>Employee Status</h3>

          <div className="status-circle">
            <h2>{activePercentage}%</h2>
            <p>Active</p>
          </div>

          <div className="status-counts">
            <span>
              Active <b>{stats.activeEmployees}</b>
            </span>
            <span>
              Inactive <b>{stats.inactiveEmployees}</b>
            </span>
          </div>
        </div>

        <div className="card recent-card">
          <h3>Recent Employees</h3>

          {recentEmployees.length > 0 ? (
            recentEmployees.map((emp) => (
              <div className="recent-row" key={emp.id}>
                <div className="avatar">{emp.name?.charAt(0)}</div>

                <div className="recent-info">
                  <h4>{emp.name}</h4>
                  <p>{emp.department}</p>
                </div>

                <span>{formatDate(emp.joiningDate)}</span>
              </div>
            ))
          ) : (
            <p className="empty-message">
              {loading ? "Loading employees..." : "No recent employees found."}
            </p>
          )}
        </div>
      </div>
    </main>
  );
}