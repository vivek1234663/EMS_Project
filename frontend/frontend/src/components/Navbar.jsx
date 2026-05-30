import "./Navbar.css";
import { FaBars, FaBell, FaSearch } from "react-icons/fa";

export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="nav-left">
        <FaBars className="menu-icon" />
        <div>
        <h3 className="brand-title">Employee Management System</h3>
        </div>
      </div>

      <div className="nav-search">
        <FaSearch />
        <input type="text" placeholder="Search employees, departments..." />
      </div>

      <div className="nav-right">
        <div className="bell-box">
          <FaBell />
          <span></span>
        </div>

        <div className="profile-box">
          <img src="https://i.pravatar.cc/100?img=12" alt="profile" />
          <div>
            <h4>Vivek Srivastava</h4>
            <p>Admin</p>
          </div>
        </div>
      </div>
    </nav>
  );
}