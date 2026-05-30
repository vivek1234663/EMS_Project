import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../api/api";

export default function EditEmployee() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    department: "",
    designation: "",
    salary: "",
    joiningDate: "",
    status: "",
  });

  useEffect(() => {
    API.get(`/employees/${id}`).then((res) => setForm(res.data));
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    await API.put(`/employees/${id}`, form);

    navigate("/employees");
  };

  return (
    <div className="page">
      <h1>Edit Employee</h1>

      <form onSubmit={handleSubmit}>
        {Object.keys(form).map((key) => (
          <input
            key={key}
            placeholder={key}
            value={form[key] || ""}
            onChange={(e) => setForm({ ...form, [key]: e.target.value })}
          />
        ))}

        <button>Update Employee</button>
      </form>
    </div>
  );
}