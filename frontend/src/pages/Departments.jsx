import { useEffect, useMemo, useState } from "react";
import API from "../api/api";
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

export default function Departments() {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(false);
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

  const fetchDepartments = async () => {
    try {
      setLoading(true);
      const res = await API.get("/departments");
      setDepartments(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error("Departments fetch error:", error);
      alert("Departments load nahi ho rahe. Backend check karo.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  const getDepartmentName = (item) => item.department || item.name || "";
  const getDepartmentHead = (item) => item.head || item.departmentHead || "";
  const getEmployeeCount = (item) => item.employees || item.employeeCount || 0;

  const filteredDepartments = useMemo(() => {
    return departments.filter((item) =>
      `${item.id} ${getDepartmentName(item)} ${getDepartmentHead(item)} ${getEmployeeCount(item)}`
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
    (sum, item) => sum + Number(getEmployeeCount(item)),
    0
  );

  const resetForm = () => {
    setEditingData(null);
    setFormData({
      department: "",
      head: "",
      employees: "",
    });
  };

  const openAddModal = () => {
    resetForm();
    setShowModal(true);
  };

  const openEditModal = (item) => {
    setEditingData(item);
    setFormData({
      department: getDepartmentName(item),
      head: getDepartmentHead(item),
      employees: getEmployeeCount(item),
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.department.trim() || !formData.head.trim()) {
      alert("Please fill department name and head");
      return;
    }

    const payload = {
      department: formData.department,
      name: formData.department,
      head: formData.head,
      departmentHead: formData.head,
      employees: Number(formData.employees) || 0,
      employeeCount: Number(formData.employees) || 0,
    };

    try {
      if (editingData) {
        await API.put(`/departments/${editingData.id}`, payload);
        alert("Department updated successfully");
      } else {
        await API.post("/departments", payload);
        alert("Department added successfully");
      }

      setShowModal(false);
      resetForm();
      fetchDepartments();
    } catch (error) {
      console.error("Department save error:", error);
      alert("Department save nahi ho raha. Backend fields check karo.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this department?")) {
      return;
    }

    try {
      await API.delete(`/departments/${id}`);
      alert("Department deleted successfully");
      fetchDepartments();
    } catch (error) {
      console.error("Department delete error:", error);
      alert("Department delete nahi ho raha. Backend check karo.");
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
                  <td className="dept-name">{getDepartmentName(item)}</td>
                  <td className="dept-head">{getDepartmentHead(item)}</td>
                  <td>
                    <span className="dept-employee-pill">
                      {getEmployeeCount(item)}
                    </span>
                  </td>
                  <td>
                    <div className="dept-actions">
                      <button
                        className="dept-edit-btn"
                        onClick={() => openEditModal(item)}
                      >
                        <FaEdit />
                      </button>

                      <button
                        className="dept-delete-btn"
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
                <td className="dept-no-data" colSpan="5">
                  {loading ? "Loading..." : "No department found"}
                </td>
              </tr>
            )}
          </tbody>
        </table>

        <div className="dept-pagination">
          <p>
            Showing {paginatedDepartments.length} of{" "}
            {filteredDepartments.length} departments
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