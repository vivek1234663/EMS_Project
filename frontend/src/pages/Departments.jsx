import { useMemo, useState } from "react";
import {
  FaPlus,
  FaSearch,
  FaEdit,
  FaTrash,
  FaTimes,
  FaSave,
  FaBuilding,
  FaUsers,
  FaUserTie,
} from "react-icons/fa";
import "./Departments.css";

const initialDepartments = [
  { id: "DEP001", department: "IT Department", head: "Vivek Srivastava", employees: 41 },
  { id: "DEP002", department: "HR Department", head: "Neha Gupta", employees: 22 },
  { id: "DEP003", department: "Finance Department", head: "Anjali Verma", employees: 19 },
  { id: "DEP004", department: "Marketing Department", head: "Rahul Sharma", employees: 14 },
  { id: "DEP005", department: "Sales Department", head: "Amit Verma", employees: 18 },
];

export default function Departments() {
  const [departments, setDepartments] = useState(initialDepartments);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingData, setEditingData] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const [formData, setFormData] = useState({
    department: "",
    head: "",
    employees: "",
  });

  const rowsPerPage = 4;

  const filteredDepartments = useMemo(() => {
    return departments.filter((item) =>
      `${item.id} ${item.department} ${item.head} ${item.employees}`
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [departments, search]);

  const totalPages = Math.ceil(filteredDepartments.length / rowsPerPage);

  const paginatedDepartments = filteredDepartments.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const totalEmployees = departments.reduce(
    (sum, item) => sum + Number(item.employees),
    0
  );

  const openAddModal = () => {
    setEditingData(null);
    setFormData({
      department: "",
      head: "",
      employees: "",
    });
    setShowModal(true);
  };

  const openEditModal = (item) => {
    setEditingData(item);
    setFormData({
      department: item.department,
      head: item.head,
      employees: item.employees,
    });
    setShowModal(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.department || !formData.head || !formData.employees) {
      alert("Please fill all fields");
      return;
    }

    if (editingData) {
      setDepartments((prev) =>
        prev.map((item) =>
          item.id === editingData.id
            ? {
                ...item,
                department: formData.department,
                head: formData.head,
                employees: Number(formData.employees),
              }
            : item
        )
      );
    } else {
      const newId = `DEP${String(departments.length + 1).padStart(3, "0")}`;

      setDepartments((prev) => [
        ...prev,
        {
          id: newId,
          department: formData.department,
          head: formData.head,
          employees: Number(formData.employees),
        },
      ]);
    }

    setShowModal(false);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this department?")) {
      setDepartments((prev) => prev.filter((item) => item.id !== id));
    }
  };

  return (
    <div className="departments-page">
      <div className="departments-header">
        <div>
          <h1>Departments</h1>
          <span className="dept-title-line"></span>
          <p>Manage all departments in your organization.</p>
        </div>

        <button className="dept-add-btn" onClick={openAddModal}>
          <FaPlus /> Add Department
        </button>
      </div>

      <div className="dept-stats">
        <div className="dept-stat-card blue">
          <div className="dept-icon">
            <FaBuilding />
          </div>
          <div>
            <h2>{departments.length}</h2>
            <h4>Total Departments</h4>
            <p>Active departments</p>
          </div>
        </div>

        <div className="dept-stat-card green">
          <div className="dept-icon">
            <FaUsers />
          </div>
          <div>
            <h2>{totalEmployees}</h2>
            <h4>Total Employees</h4>
            <p>Across all departments</p>
          </div>
        </div>

        <div className="dept-stat-card orange">
          <div className="dept-icon">
            <FaUserTie />
          </div>
          <div>
            <h2>{departments.length}</h2>
            <h4>Department Heads</h4>
            <p>Assigned team leaders</p>
          </div>
        </div>
      </div>

      <div className="dept-tools">
        <div className="dept-search">
          <FaSearch />
          <input
            type="text"
            placeholder="Search by id, department, head or employees..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>
      </div>

      <div className="dept-table-card">
        <table>
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
            {paginatedDepartments.length > 0 ? (
              paginatedDepartments.map((item) => (
                <tr key={item.id}>
                  <td>{item.id}</td>
                  <td className="dept-name">{item.department}</td>
                  <td className="dept-head">{item.head}</td>
                  <td>
                    <span className="dept-employee-pill">{item.employees}</span>
                  </td>
                  <td>
                    <div className="dept-actions">
                      <button className="dept-edit-btn" onClick={() => openEditModal(item)}>
                        <FaEdit />
                      </button>

                      <button className="dept-delete-btn" onClick={() => handleDelete(item.id)}>
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td className="dept-no-data" colSpan="5">
                  No department found
                </td>
              </tr>
            )}
          </tbody>
        </table>

        <div className="dept-pagination">
          <p>
            Showing {paginatedDepartments.length} of {filteredDepartments.length} departments
          </p>

          <div className="dept-page-buttons">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
            >
              Prev
            </button>

            {[...Array(totalPages || 1)].map((_, index) => (
              <button
                key={index}
                className={currentPage === index + 1 ? "active-page" : ""}
                onClick={() => setCurrentPage(index + 1)}
              >
                {index + 1}
              </button>
            ))}

            <button
              disabled={currentPage === totalPages || totalPages === 0}
              onClick={() => setCurrentPage(currentPage + 1)}
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="dept-modal-overlay">
          <div className="dept-modal">
            <div className="dept-modal-header">
              <h2>{editingData ? "Edit Department" : "Add Department"}</h2>
              <button onClick={() => setShowModal(false)}>
                <FaTimes />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <label>Department Name</label>
              <input
                type="text"
                placeholder="Enter department name"
                value={formData.department}
                onChange={(e) =>
                  setFormData({ ...formData, department: e.target.value })
                }
              />

              <label>Department Head</label>
              <input
                type="text"
                placeholder="Enter head name"
                value={formData.head}
                onChange={(e) =>
                  setFormData({ ...formData, head: e.target.value })
                }
              />

              <label>Total Employees</label>
              <input
                type="number"
                placeholder="Enter employee count"
                value={formData.employees}
                onChange={(e) =>
                  setFormData({ ...formData, employees: e.target.value })
                }
              />

              <button type="submit" className="dept-save-btn">
                <FaSave /> {editingData ? "Update Department" : "Save Department"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}