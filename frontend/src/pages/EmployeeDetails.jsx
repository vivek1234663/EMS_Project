import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../api/api";

export default function EmployeeDetails() {
  const { id } = useParams();
  const [employee, setEmployee] = useState(null);

  useEffect(() => {
    API.get(`/employees/${id}`).then((res) => setEmployee(res.data));
  }, [id]);

  if (!employee) return <div className="page">Loading...</div>;

  return (
    <div className="page">
      <h1>Employee Details</h1>

      <div className="details-card">
        <h2>{employee.name}</h2>
        <p><b>Email:</b> {employee.email}</p>
        <p><b>Phone:</b> {employee.phone}</p>
        <p><b>Department:</b> {employee.department}</p>
        <p><b>Designation:</b> {employee.designation}</p>
        <p><b>Salary:</b> ₹{employee.salary}</p>
        <p><b>Joining Date:</b> {employee.joiningDate}</p>
        <p><b>Status:</b> {employee.status}</p>
      </div>
    </div>
  );
}