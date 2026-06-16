import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";

export default function AddEmployee() {
  const navigate = useNavigate();

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
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await API.post("/employees", form);
    navigate("/employees");
  };

  return (
    <div className="page">
      <h1>Add Employee</h1>

      <form className="form-card" onSubmit={handleSubmit}>
        <input name="name" placeholder="Employee Name" onChange={handleChange} />
        <input name="email" placeholder="Email" onChange={handleChange} />
        <input name="phone" placeholder="Phone" onChange={handleChange} />
        <input name="department" placeholder="Department" onChange={handleChange} />
        <input name="designation" placeholder="Designation" onChange={handleChange} />
        <input name="salary" placeholder="Salary" onChange={handleChange} />
        <input type="date" name="joiningDate" onChange={handleChange} />

        <select name="status" onChange={handleChange}>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>

        <button type="submit">Save Employee</button>
      </form>
    </div>
  );
}