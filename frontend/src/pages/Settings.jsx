import { useState } from "react";
import {
  FaUserCog,
  FaBell,
  FaLock,
  FaPalette,
  FaSave,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";
import "./Settings.css";

export default function Settings() {
  const [showPassword, setShowPassword] = useState(false);

  const [profile, setProfile] = useState({
    name: "Vivek Srivastava",
    email: "vivek@gmail.com",
    role: "Admin",
    phone: "7851804530",
  });

  const [notifications, setNotifications] = useState({
    email: true,
    sms: false,
    attendance: true,
    salary: true,
  });

  const [security, setSecurity] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [theme, setTheme] = useState("Blue");

  const handleProfileSave = (e) => {
    e.preventDefault();
    alert("Profile settings saved successfully!");
  };

  const handleSecuritySave = (e) => {
    e.preventDefault();

    if (security.newPassword !== security.confirmPassword) {
      alert("New password and confirm password do not match!");
      return;
    }

    alert("Password updated successfully!");
    setSecurity({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  };

  return (
    <div className="settings-page">
      <div className="settings-header">
        <div>
          <h1>Settings</h1>
          <span></span>
          <p>Manage your profile, notifications, security and appearance.</p>
        </div>
      </div>

      <div className="settings-grid">
        <div className="settings-card profile-card">
          <div className="settings-card-header">
            <div className="settings-icon blue">
              <FaUserCog />
            </div>
            <div>
              <h2>Profile Settings</h2>
              <p>Update your account details</p>
            </div>
          </div>

          <form onSubmit={handleProfileSave}>
            <label>Full Name</label>
            <input
              value={profile.name}
              onChange={(e) =>
                setProfile({ ...profile, name: e.target.value })
              }
            />

            <label>Email Address</label>
            <input
              type="email"
              value={profile.email}
              onChange={(e) =>
                setProfile({ ...profile, email: e.target.value })
              }
            />

            <label>Role</label>
            <input
              value={profile.role}
              onChange={(e) =>
                setProfile({ ...profile, role: e.target.value })
              }
            />

            <label>Phone Number</label>
            <input
              value={profile.phone}
              onChange={(e) =>
                setProfile({ ...profile, phone: e.target.value })
              }
            />

            <button type="submit">
              <FaSave /> Save Profile
            </button>
          </form>
        </div>

        <div className="settings-card">
          <div className="settings-card-header">
            <div className="settings-icon green">
              <FaBell />
            </div>
            <div>
              <h2>Notifications</h2>
              <p>Control alert preferences</p>
            </div>
          </div>

          <div className="toggle-list">
            <div className="toggle-row">
              <div>
                <h4>Email Notifications</h4>
                <p>Receive updates on email</p>
              </div>
              <label className="switch">
                <input
                  type="checkbox"
                  checked={notifications.email}
                  onChange={() =>
                    setNotifications({
                      ...notifications,
                      email: !notifications.email,
                    })
                  }
                />
                <span></span>
              </label>
            </div>

            <div className="toggle-row">
              <div>
                <h4>SMS Alerts</h4>
                <p>Get important SMS alerts</p>
              </div>
              <label className="switch">
                <input
                  type="checkbox"
                  checked={notifications.sms}
                  onChange={() =>
                    setNotifications({
                      ...notifications,
                      sms: !notifications.sms,
                    })
                  }
                />
                <span></span>
              </label>
            </div>

            <div className="toggle-row">
              <div>
                <h4>Attendance Alerts</h4>
                <p>Notify late or absent records</p>
              </div>
              <label className="switch">
                <input
                  type="checkbox"
                  checked={notifications.attendance}
                  onChange={() =>
                    setNotifications({
                      ...notifications,
                      attendance: !notifications.attendance,
                    })
                  }
                />
                <span></span>
              </label>
            </div>

            <div className="toggle-row">
              <div>
                <h4>Salary Updates</h4>
                <p>Notify salary payment status</p>
              </div>
              <label className="switch">
                <input
                  type="checkbox"
                  checked={notifications.salary}
                  onChange={() =>
                    setNotifications({
                      ...notifications,
                      salary: !notifications.salary,
                    })
                  }
                />
                <span></span>
              </label>
            </div>
          </div>
        </div>

        <div className="settings-card">
          <div className="settings-card-header">
            <div className="settings-icon purple">
              <FaLock />
            </div>
            <div>
              <h2>Security</h2>
              <p>Change your password</p>
            </div>
          </div>

          <form onSubmit={handleSecuritySave}>
            <label>Current Password</label>
            <div className="password-box">
              <input
                type={showPassword ? "text" : "password"}
                value={security.currentPassword}
                onChange={(e) =>
                  setSecurity({
                    ...security,
                    currentPassword: e.target.value,
                  })
                }
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>

            <label>New Password</label>
            <input
              type="password"
              value={security.newPassword}
              onChange={(e) =>
                setSecurity({ ...security, newPassword: e.target.value })
              }
            />

            <label>Confirm Password</label>
            <input
              type="password"
              value={security.confirmPassword}
              onChange={(e) =>
                setSecurity({
                  ...security,
                  confirmPassword: e.target.value,
                })
              }
            />

            <button type="submit">
              <FaSave /> Update Password
            </button>
          </form>
        </div>

        <div className="settings-card">
          <div className="settings-card-header">
            <div className="settings-icon orange">
              <FaPalette />
            </div>
            <div>
              <h2>Appearance</h2>
              <p>Choose dashboard theme</p>
            </div>
          </div>

          <div className="theme-options">
            {["Blue", "Green", "Purple", "Orange"].map((color) => (
              <button
                key={color}
                className={theme === color ? "theme active" : "theme"}
                onClick={() => setTheme(color)}
              >
                <span className={color.toLowerCase()}></span>
                {color}
              </button>
            ))}
          </div>

          <div className="theme-preview">
            <h3>{theme} Theme Selected</h3>
            <p>Your dashboard appearance preference has been updated.</p>
          </div>
        </div>
      </div>
    </div>
  );
}