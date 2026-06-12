import { useMemo, useState } from "react";
import "./Designations.css";

export default function Designations() {
  const [designations, setDesignations] = useState([
    { id: "DES001", title: "Full Stack Developer", department: "IT Department", employees: 12 },
    { id: "DES002", title: "Backend Developer", department: "IT Department", employees: 6 },
    { id: "DES003", title: "UI/UX Designer", department: "IT Department", employees: 4 },
    { id: "DES004", title: "System Analyst", department: "IT Department", employees: 5 },
    { id: "DES005", title: "HR Executive", department: "HR Department", employees: 10 },
    { id: "DES006", title: "HR Manager", department: "HR Department", employees: 3 },
    { id: "DES007", title: "Accountant", department: "Finance Department", employees: 7 },
    { id: "DES008", title: "Marketing Manager", department: "Marketing Department", employees: 8 },
  ]);

  const [search, setSearch] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("All Departments");
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    id: "",
    title: "",
    department: "",
    employees: "",
  });

  const filteredDesignations = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    return designations.filter((item) => {
      const matchSearch =
        item.id.toLowerCase().includes(keyword) ||
        item.title.toLowerCase().includes(keyword) ||
        item.department.toLowerCase().includes(keyword) ||
        String(item.employees).includes(keyword);

      const matchDepartment =
        departmentFilter === "All Departments" ||
        item.department === departmentFilter;

      return matchSearch && matchDepartment;
    });
  }, [designations, search, departmentFilter]);

  const totalAssignedEmployees = designations.reduce(
    (sum, item) => sum + Number(item.employees || 0),
    0
  );

  const totalDepartments = new Set(
    designations.map((item) => item.department)
  ).size;

  const openAddModal = () => {
    setEditingId(null);
    setFormData({
      id: "",
      title: "",
      department: "",
      employees: "",
    });
    setShowModal(true);
  };

  const handleEdit = (item) => {
    setEditingId(item.id);
    setFormData({
      id: item.id,
      title: item.title,
      department: item.department,
      employees: item.employees,
    });
    setShowModal(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("Delete this designation?")) {
      setDesignations(designations.filter((item) => item.id !== id));
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const generateDesignationId = () => {
    const lastNumber =
      designations.length > 0
        ? Math.max(
            ...designations.map((item) =>
              Number(String(item.id).replace("DES", ""))
            )
          )
        : 0;

    return `DES${String(lastNumber + 1).padStart(3, "0")}`;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      !formData.title.trim() ||
      !formData.department.trim() ||
      formData.employees === ""
    ) {
      alert("Please fill all fields");
      return;
    }

    const finalData = {
      id: formData.id || generateDesignationId(),
      title: formData.title.trim(),
      department: formData.department,
      employees: Number(formData.employees),
    };

    if (editingId) {
      setDesignations(
        designations.map((item) =>
          item.id === editingId ? finalData : item
        )
      );
    } else {
      setDesignations([...designations, finalData]);
    }

    setShowModal(false);
  };

  return (
    <div className="designations-page">
      <div className="designations-header">
        <div>
          <h1>Designations</h1>
          <p>Manage all designations in the organization.</p>
        </div>

        <button className="add-designation-btn" onClick={openAddModal}>
          + Add Designation
        </button>
      </div>

      <div className="designation-stats">
        <div className="designation-stat-card blue">
          <h2>{designations.length}</h2>
          <p>Total Designations</p>
        </div>

        <div className="designation-stat-card green">
          <h2>{totalDepartments}</h2>
          <p>Departments</p>
        </div>

        <div className="designation-stat-card purple">
          <h2>{totalAssignedEmployees}</h2>
          <p>Assigned Employees</p>
        </div>
      </div>

      <div className="designation-filter-row">
        <div className="designation-search">
          <span>🔍</span>
          <input
            type="text"
            placeholder="Search designations..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <select
          value={departmentFilter}
          onChange={(e) => setDepartmentFilter(e.target.value)}
        >
          <option>All Departments</option>
          <option>IT Department</option>
          <option>HR Department</option>
          <option>Finance Department</option>
          <option>Marketing Department</option>
        </select>
      </div>

      <div className="designations-card">
        <table className="designations-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Designation Name</th>
              <th>Department</th>
              <th>Employees</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredDesignations.length > 0 ? (
              filteredDesignations.map((item) => (
                <tr key={item.id}>
                  <td>{item.id}</td>
                  <td className="designation-title">{item.title}</td>
                  <td>
                    <span className="dept-pill">{item.department}</span>
                  </td>
                  <td>
                    <span className="employee-pill">{item.employees}</span>
                  </td>
                  <td>
                    <div className="designation-actions">
                      <button
                        className="designation-edit"
                        onClick={() => handleEdit(item)}
                      >
                        ✏️
                      </button>

                      <button
                        className="designation-delete"
                        onClick={() => handleDelete(item.id)}
                      >
                        🗑
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" style={{ textAlign: "center", padding: "25px" }}>
                  No designations found.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        <p className="designation-footer">
          Showing {filteredDesignations.length} of {designations.length} designations
        </p>
      </div>

      {showModal && (
        <div className="designation-modal-overlay">
          <div className="designation-modal">
            <h2>{editingId ? "Edit Designation" : "Add Designation"}</h2>
            <p>
              {editingId
                ? "Update designation information."
                : "Add a new designation to your organization."}
            </p>

            <form onSubmit={handleSubmit}>
              <input
                type="text"
                name="id"
                placeholder="Designation ID"
                value={formData.id}
                onChange={handleChange}
                disabled={Boolean(editingId)}
              />

              <input
                type="text"
                name="title"
                placeholder="Designation Name"
                value={formData.title}
                onChange={handleChange}
                required
              />

              <select
                name="department"
                value={formData.department}
                onChange={handleChange}
                required
              >
                <option value="">Select Department</option>
                <option>IT Department</option>
                <option>HR Department</option>
                <option>Finance Department</option>
                <option>Marketing Department</option>
                <option>Sales Department</option>
              </select>

              <input
                type="number"
                name="employees"
                placeholder="Employees"
                value={formData.employees}
                onChange={handleChange}
                required
              />

              <div className="designation-modal-buttons">
                <button type="button" onClick={() => setShowModal(false)}>
                  Cancel
                </button>

                <button type="submit">
                  {editingId ? "Update Designation" : "Save Designation"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}