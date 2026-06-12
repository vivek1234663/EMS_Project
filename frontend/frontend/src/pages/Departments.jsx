import { useMemo, useState } from "react";
import "./Departments.css";
import { FaEdit, FaTrash } from "react-icons/fa";

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
  const [searchTerm, setSearchTerm] = useState("");

  const [formData, setFormData] = useState({
    id: "",
    name: "",
    head: "",
    employees: "",
  });

  const totalEmployees = useMemo(() => {
    return departments.reduce(
      (total, dept) => total + Number(dept.employees || 0),
      0
    );
  }, [departments]);

  const departmentHeads = useMemo(() => {
    return departments.filter((dept) => dept.head?.trim() !== "").length;
  }, [departments]);

  const filteredDepartments = useMemo(() => {
    const keyword = searchTerm.trim().toLowerCase();

    return departments.filter((dept) => {
      const searchableText = [
        dept.id,
        dept.name,
        dept.head,
        dept.employees,
      ]
        .join(" ")
        .toLowerCase();

      return searchableText.includes(keyword);
    });
  }, [departments, searchTerm]);

  const generateDepartmentId = () => {
    if (departments.length === 0) {
      return "DEP001";
    }

    const maxNumber = Math.max(
      ...departments.map((dept) =>
        Number(String(dept.id).replace("DEP", ""))
      )
    );

    return `DEP${String(maxNumber + 1).padStart(3, "0")}`;
  };

  const resetForm = () => {
    setFormData({
      id: "",
      name: "",
      head: "",
      employees: "",
    });
    setEditingId(null);
    setShowModal(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const openAddModal = () => {
    setEditingId(null);
    setFormData({
      id: generateDepartmentId(),
      name: "",
      head: "",
      employees: "",
    });
    setShowModal(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      !formData.id.trim() ||
      !formData.name.trim() ||
      !formData.head.trim() ||
      formData.employees === ""
    ) {
      alert("Please fill all fields");
      return;
    }

    const payload = {
      id: formData.id.trim(),
      name: formData.name.trim(),
      head: formData.head.trim(),
      employees: Number(formData.employees),
    };

    if (payload.employees < 0) {
      alert("Employees count cannot be negative");
      return;
    }

    const isDuplicateId = departments.some(
      (dept) => dept.id === payload.id && dept.id !== editingId
    );

    if (isDuplicateId) {
      alert("Department ID already exists");
      return;
    }

    if (editingId) {
      setDepartments(
        departments.map((dept) =>
          dept.id === editingId ? payload : dept
        )
      );
    } else {
      setDepartments([...departments, payload]);
    }

    resetForm();
  };

  const handleEdit = (dept) => {
    setEditingId(dept.id);
    setFormData({
      id: dept.id,
      name: dept.name,
      head: dept.head,
      employees: dept.employees,
    });
    setShowModal(true);
  };

  const handleDelete = (id) => {
    const confirmDelete = window.confirm("Delete this department?");

    if (confirmDelete) {
      setDepartments(departments.filter((dept) => dept.id !== id));

      if (editingId === id) {
        resetForm();
      }
    }
  };

  return (
    <div className="departments-page">
      <div className="departments-top">
        <div>
          <h1>Departments</h1>
          <p>Manage all departments in your organization.</p>
        </div>

        <button type="button" className="add-department-btn" onClick={openAddModal}>
          + Add Department
        </button>
      </div>

      <div className="dept-stats">
        <div className="dept-stat-card blue">
          <h2>{departments.length}</h2>
          <p>Total Departments</p>
        </div>

        <div className="dept-stat-card green">
          <h2>{totalEmployees}</h2>
          <p>Total Employees</p>
        </div>

        <div className="dept-stat-card orange">
          <h2>{departmentHeads}</h2>
          <p>Department Heads</p>
        </div>
      </div>

      <div className="dept-search-box">
        <input
          type="text"
          placeholder="Search by id, department, head or employees..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        {searchTerm && (
          <button
            type="button"
            className="clear-dept-search"
            onClick={() => setSearchTerm("")}
          >
            ×
          </button>
        )}
      </div>

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
            {filteredDepartments.length > 0 ? (
              filteredDepartments.map((dept) => (
                <tr key={dept.id}>
                  <td>{dept.id}</td>

                  <td className="department-name">{dept.name}</td>

                  <td>
                    <div className="head-box">
                      <span>{dept.head}</span>
                    </div>
                  </td>

                  <td>
                    <span className="employee-count">{dept.employees}</span>
                  </td>

                  <td>
                    <div className="action-buttons">
                      <button
                        type="button"
                        className="edit-btn"
                        onClick={() => handleEdit(dept)}
                        title="Edit Department"
                      >
                        <FaEdit />
                      </button>

                      <button
                        type="button"
                        className="delete-btn"
                        onClick={() => handleDelete(dept.id)}
                        title="Delete Department"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="empty-message">
                  No departments found.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        <p className="department-footer">
          Showing {filteredDepartments.length} of {departments.length} departments
        </p>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="department-modal">
            <h2>{editingId ? "Edit Department" : "Add Department"}</h2>

            <form onSubmit={handleSubmit}>
              <input
                type="text"
                name="id"
                placeholder="Department ID"
                value={formData.id}
                onChange={handleChange}
                required
                readOnly={Boolean(editingId)}
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
                min="0"
                required
              />

              <div className="modal-buttons">
                <button type="submit">
                  {editingId ? "Update" : "Save"}
                </button>

                <button
                  type="button"
                  className="cancel-btn"
                  onClick={resetForm}
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