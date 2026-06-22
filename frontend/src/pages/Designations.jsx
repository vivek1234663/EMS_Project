import { useEffect, useMemo, useState } from "react";
import {
  FaPlus,
  FaSearch,
  FaEdit,
  FaTrash,
  FaUsers,
  FaBuilding,
  FaBriefcase,
  FaTimes,
  FaSave,
} from "react-icons/fa";
import API from "../api/api";
import "./Designations.css";

export default function Designations() {
  const [designations, setDesignations] = useState([]);
  const [search, setSearch] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("All Departments");
  const [showModal, setShowModal] = useState(false);
  const [editingData, setEditingData] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    department: "IT Department",
    employees: "",
  });

  const rowsPerPage = 5;

  const departments = [
    "All Departments",
    "IT Department",
    "HR Department",
    "Finance Department",
    "Marketing Department",
  ];

  const fetchDesignations = async () => {
    try {
      setLoading(true);
      const res = await API.get("/designations");
      setDesignations(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error("Designation fetch error:", error);
      alert("Designations load nahi ho rahe. Backend check karo.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDesignations();
  }, []);

  const filteredData = useMemo(() => {
    return designations.filter((item) => {
      const matchSearch =
        String(item.name || "").toLowerCase().includes(search.toLowerCase()) ||
        String(item.id || "").toLowerCase().includes(search.toLowerCase()) ||
        String(item.department || "")
          .toLowerCase()
          .includes(search.toLowerCase());

      const matchDepartment =
        departmentFilter === "All Departments" ||
        item.department === departmentFilter;

      return matchSearch && matchDepartment;
    });
  }, [designations, search, departmentFilter]);

  const totalPages = Math.ceil(filteredData.length / rowsPerPage);

  const paginatedData = filteredData.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const totalEmployees = designations.reduce(
    (sum, item) => sum + Number(item.employees || 0),
    0
  );

  const openAddModal = () => {
    setEditingData(null);
    setFormData({
      name: "",
      department: "IT Department",
      employees: "",
    });
    setShowModal(true);
  };

  const openEditModal = (item) => {
    setEditingData(item);
    setFormData({
      name: item.name || "",
      department: item.department || "IT Department",
      employees: item.employees || "",
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.department.trim()) {
      alert("Please fill all fields");
      return;
    }

    const payload = {
      name: formData.name,
      department: formData.department,
      employees: Number(formData.employees) || 0,
    };

    try {
      if (editingData) {
        await API.put(`/designations/${editingData.id}`, payload);
        alert("Designation updated successfully");
      } else {
        await API.post("/designations", payload);
        alert("Designation added successfully");
      }

      setShowModal(false);
      fetchDesignations();
    } catch (error) {
      console.error("Designation save error:", error);
      alert("Designation save nahi ho raha. Backend fields check karo.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this designation?")) {
      return;
    }

    try {
      await API.delete(`/designations/${id}`);
      alert("Designation deleted successfully");
      fetchDesignations();
    } catch (error) {
      console.error("Designation delete error:", error);
      alert("Designation delete nahi ho raha. Backend check karo.");
    }
  };

  const getBadgeClass = (department) => {
    if (department?.includes("IT")) return "badge it";
    if (department?.includes("HR")) return "badge hr";
    if (department?.includes("Finance")) return "badge finance";
    if (department?.includes("Marketing")) return "badge marketing";
    return "badge";
  };

  return (
    <div className="designation-page">
      <div className="designation-header">
        <div>
          <h1>Designations</h1>
          <span className="title-line"></span>
          <p>Manage all designations in the organization.</p>
        </div>

        <button className="add-btn" onClick={openAddModal}>
          <FaPlus /> Add Designation
        </button>
      </div>

      <div className="designation-stats">
        <div className="stat-card blue-card">
          <div className="stat-icon">
            <FaBriefcase />
          </div>
          <div>
            <h2>{designations.length}</h2>
            <h4>Total Designations</h4>
            <p>Across all departments</p>
          </div>
        </div>

        <div className="stat-card green-card">
          <div className="stat-icon">
            <FaBuilding />
          </div>
          <div>
            <h2>{departments.length - 1}</h2>
            <h4>Departments</h4>
            <p>Active departments</p>
          </div>
        </div>

        <div className="stat-card purple-card">
          <div className="stat-icon">
            <FaUsers />
          </div>
          <div>
            <h2>{totalEmployees}</h2>
            <h4>Assigned Employees</h4>
            <p>Across all designations</p>
          </div>
        </div>
      </div>

      <div className="designation-tools">
        <div className="search-box">
          <FaSearch />
          <input
            type="text"
            placeholder="Search designations..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>

        <select
          value={departmentFilter}
          onChange={(e) => {
            setDepartmentFilter(e.target.value);
            setCurrentPage(1);
          }}
        >
          {departments.map((dept) => (
            <option key={dept}>{dept}</option>
          ))}
        </select>
      </div>

      <div className="designation-table-card">
        <table>
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
            {paginatedData.length > 0 ? (
              paginatedData.map((item) => (
                <tr key={item.id}>
                  <td>{item.id}</td>

                  <td className="designation-name">{item.name}</td>

                  <td>
                    <span className={getBadgeClass(item.department)}>
                      {item.department}
                    </span>
                  </td>

                  <td>
                    <span className="employee-count">
                      {item.employees || 0}
                    </span>
                  </td>

                  <td>
                    <div className="action-buttons">
                      <button
                        className="edit-btn"
                        onClick={() => openEditModal(item)}
                      >
                        <FaEdit />
                      </button>

                      <button
                        className="delete-btn"
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
                <td colSpan="5" className="no-data">
                  {loading ? "Loading..." : "No designation found"}
                </td>
              </tr>
            )}
          </tbody>
        </table>

        <div className="pagination">
          <p>
            Showing {paginatedData.length} of {filteredData.length} results
          </p>

          <div className="page-buttons">
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
        <div className="modal-overlay">
          <div className="designation-modal">
            <div className="modal-header">
              <h2>{editingData ? "Edit Designation" : "Add Designation"}</h2>

              <button onClick={() => setShowModal(false)}>
                <FaTimes />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <label>Designation Name</label>
              <input
                type="text"
                placeholder="Enter designation name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />

              <label>Department</label>
              <select
                value={formData.department}
                onChange={(e) =>
                  setFormData({ ...formData, department: e.target.value })
                }
              >
                {departments
                  .filter((dept) => dept !== "All Departments")
                  .map((dept) => (
                    <option key={dept}>{dept}</option>
                  ))}
              </select>

              <label>Employees</label>
              <input
                type="number"
                placeholder="Enter employees count"
                value={formData.employees}
                onChange={(e) =>
                  setFormData({ ...formData, employees: e.target.value })
                }
              />

              <button type="submit" className="save-btn">
                <FaSave /> {editingData ? "Update" : "Save"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}