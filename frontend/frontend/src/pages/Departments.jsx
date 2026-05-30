import { useState } from "react";
import "./Departments.css";

export default function Departments() {
  const [departments, setDepartments] = useState([
    {
      id: "DEP001",
      name: "IT Department",
      head: "Vivek Srivastava",
      employees: 41,
    },
    {
      id: "DEP002",
      name: "HR Department",
      head: "Neha Gupta",
      employees: 22,
    },
    {
      id: "DEP003",
      name: "Finance Department",
      head: "Anjali Verma",
      employees: 19,
    },
  ]);

  const [showModal, setShowModal] = useState(false);

  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    id: "",
    name: "",
    head: "",
    employees: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const openAddModal = () => {
    setEditingId(null);

    setFormData({
      id: "",
      name: "",
      head: "",
      employees: "",
    });

    setShowModal(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (editingId) {
      setDepartments(
        departments.map((dept) =>
          dept.id === editingId ? formData : dept
        )
      );
    } else {
      setDepartments([...departments, formData]);
    }

    setShowModal(false);
  };

  const handleEdit = (dept) => {
    setEditingId(dept.id);
    setFormData(dept);
    setShowModal(true);
  };

  const handleDelete = (id) => {
    const confirmDelete = window.confirm(
      "Delete this department?"
    );

    if (confirmDelete) {
      setDepartments(
        departments.filter((dept) => dept.id !== id)
      );
    }
  };

  return (
    <div className="departments-page">
      {/* HEADER */}

      <div className="departments-top">
        <div>
          <h1>Departments</h1>
          <p>
            Manage all departments in your organization.
          </p>
        </div>

        <button
          className="add-department-btn"
          onClick={openAddModal}
        >
          + Add Department
        </button>
      </div>

      {/* STATS */}

      <div className="dept-stats">
        <div className="dept-stat-card blue">
          <h2>{departments.length}</h2>
          <p>Total Departments</p>
        </div>

        <div className="dept-stat-card green">
          <h2>124</h2>
          <p>Total Employees</p>
        </div>

        <div className="dept-stat-card orange">
          <h2>8</h2>
          <p>Department Heads</p>
        </div>
      </div>

      {/* SEARCH */}

      <div className="dept-search-box">
        <input
          type="text"
          placeholder="Search departments..."
        />
      </div>

      {/* TABLE */}

      <div className="departments-card">
        <table className="departments-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Department</th>
              <th>Head</th>
              <th>Employees</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {departments.map((dept) => (
              <tr key={dept.id}>
                <td>{dept.id}</td>

                <td className="department-name">
                  {dept.name}
                </td>

                <td>
                  <div className="head-box">
                    <img
                      src={`https://i.pravatar.cc/100?u=${dept.head}`}
                      alt=""
                    />

                    <span>{dept.head}</span>
                  </div>
                </td>

                <td>
                  <span className="employee-count">
                    {dept.employees}
                  </span>
                </td>

                <td>
                  <div className="action-buttons">
                    <button
                      className="edit-btn"
                      onClick={() => handleEdit(dept)}
                    >
                      ✏️
                    </button>

                    <button
                      className="delete-btn"
                      onClick={() =>
                        handleDelete(dept.id)
                      }
                    >
                      🗑
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MODAL */}

      {showModal && (
        <div className="modal-overlay">
          <div className="department-modal">
            <h2>
              {editingId
                ? "Edit Department"
                : "Add Department"}
            </h2>

            <form onSubmit={handleSubmit}>
              <input
                type="text"
                name="id"
                placeholder="Department ID"
                value={formData.id}
                onChange={handleChange}
                required
              />

              <input
                type="text"
                name="name"
                placeholder="Department Name"
                value={formData.name}
                onChange={handleChange}
                required
              />

              <input
                type="text"
                name="head"
                placeholder="Department Head"
                value={formData.head}
                onChange={handleChange}
                required
              />

              <input
                type="number"
                name="employees"
                placeholder="Employees"
                value={formData.employees}
                onChange={handleChange}
                required
              />

              <div className="modal-buttons">
                <button type="submit">
                  {editingId ? "Update" : "Save"}
                </button>

                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}