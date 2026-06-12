import { NavLink } from "react-router-dom";
import {
  FaTachometerAlt,
  FaUsers,
  FaMoneyBillWave,
  FaUsersCog,
  FaBuilding,
  FaUserTie,
  FaCalendarCheck,
  FaClipboardList,
  FaChartLine,
  FaFileAlt,
  FaCog,
  FaUser,
  FaSignOutAlt,
} from "react-icons/fa";
import "./Sidebar.css";

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div className="sidebar-logo-icon">
          <FaUsersCog />
        </div>

        <div className="sidebar-logo-text">
          <h2>
            Employee
            <br />
            Management
          </h2>
          <span>System</span>
        </div>
      </div>

      <nav className="sidebar-menu">
        <NavLink to="/dashboard" className="menu-item">
          <FaTachometerAlt />
          <span>Dashboard</span>
        </NavLink>

        <NavLink to="/employees" className="menu-item">
          <FaUsers />
          <span>Employees</span>
        </NavLink>

        <NavLink to="/departments" className="menu-item">
          <FaBuilding />
          <span>Departments</span>
        </NavLink>

        <NavLink to="/designations" className="menu-item">
          <FaUserTie />
          <span>Designations</span>
        </NavLink>

        <NavLink to="/attendance" className="menu-item">
          <FaCalendarCheck />
          <span>Attendance</span>
        </NavLink>

        <NavLink to="/salary" className="menu-item">
  <FaMoneyBillWave />
  <span>Salary</span>
</NavLink>

        <NavLink to="/leave" className="menu-item">
          <FaClipboardList />
          <span>Leave</span>
        </NavLink>

        <NavLink to="/performance" className="menu-item">
          <FaChartLine />
          <span>Performance</span>
        </NavLink>

        <NavLink to="/reports" className="menu-item">
          <FaFileAlt />
          <span>Reports</span>
        </NavLink>

        <NavLink to="/settings" className="menu-item">
          <FaCog />
          <span>Settings</span>
        </NavLink>

        <NavLink to="/profile" className="menu-item">
          <FaUser />
          <span>Profile</span>
        </NavLink>
      </nav>

      
    </aside>
  );
}