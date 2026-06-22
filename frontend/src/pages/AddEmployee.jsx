import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";
import "./AddEmployee.css";

export default function AddEmployee() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    department: "",
    designation: "",
    salary: "",
    joiningDate: "",
    status: "Active",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !form.name ||
      !form.email ||
      !form.department ||
      !form.designation
    ) {
      alert("Please fill all required fields");
      return;
    }

    try {
      setLoading(true);

      await API.post("/employees", {
        ...form,
        salary: Number(form.salary),
      });

      alert("Employee added successfully");

      navigate("/employees");
    } catch (error) {
      console.error(error);
      alert(
        error?.response?.data?.message ||
          "Failed to add employee"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <h1>Add Employee</h1>

      <form className="form-card" onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Employee Name"
          value={form.name}
          onChange={handleChange}
          required
        />

        <input
          type="email"
          name="email"
          placeholder="Email Address"
          value={form.email}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="phone"
          placeholder="Phone Number"
          value={form.phone}
          onChange={handleChange}
        />

        <input
          type="text"
          name="department"
          placeholder="Department"
          value={form.department}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="designation"
          placeholder="Designation"
          value={form.designation}
          onChange={handleChange}
          required
        />

        <input
          type="number"
          name="salary"
          placeholder="Salary"
          value={form.salary}
          onChange={handleChange}
        />

        <input
          type="date"
          name="joiningDate"
          value={form.joiningDate}
          onChange={handleChange}
        />

        <select
          name="status"
          value={form.status}
          onChange={handleChange}
        >
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>

        <button type="submit" disabled={loading}>
          {loading ? "Saving..." : "Save Employee"}
        </button>
      </form>
    </div>
  );
}