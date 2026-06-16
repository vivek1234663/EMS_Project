import { useMemo, useState } from "react";
import {
  FaDownload,
  FaMoneyBillWave,
  FaUsers,
  FaCheckCircle,
  FaClock,
  FaSearch,
  FaEye,
  FaEdit,
  FaTrash,
  FaSave,
  FaTimes,
} from "react-icons/fa";
import "./Salary.css";

const initialSalaries = [
  {
    id: "SAL001",
    employeeId: "EMP001",
    employee: "Vivek Srivastava",
    department: "IT Department",
    designation: "Full Stack Developer",
    basic: 40000,
    workingDays: 26,
    presentDays: 24,
    performance: 90,
    bonus: 4000,
    deductions: 1500,
    status: "Paid",
  },
  {
    id: "SAL002",
    employeeId: "EMP002",
    employee: "Rahul Sharma",
    department: "IT Department",
    designation: "Backend Developer",
    basic: 35000,
    workingDays: 26,
    presentDays: 23,
    performance: 82,
    bonus: 2450,
    deductions: 1200,
    status: "Pending",
  },
];

export default function Salary() {
  const [salaries, setSalaries] = useState(initialSalaries);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [editData, setEditData] = useState(null);
  const [viewData, setViewData] = useState(null);

  const [form, setForm] = useState({
    employeeId: "",
    employee: "",
    department: "",
    designation: "",
    basic: "",
    workingDays: "",
    presentDays: "",
    performance: "",
    bonus: "",
    deductions: "",
    status: "Pending",
  });

  const calcNetSalary = (item) => {
    const attendancePay =
      (Number(item.basic) / Number(item.workingDays || 1)) *
      Number(item.presentDays || 0);

    return Math.round(
      attendancePay + Number(item.bonus || 0) - Number(item.deductions || 0)
    );
  };

  const filteredSalaries = useMemo(() => {
    return salaries.filter((item) => {
      const matchSearch =
        item.employee.toLowerCase().includes(search.toLowerCase()) ||
        item.employeeId.toLowerCase().includes(search.toLowerCase()) ||
        item.department.toLowerCase().includes(search.toLowerCase());

      const matchStatus =
        statusFilter === "All Status" || item.status === statusFilter;

      return matchSearch && matchStatus;
    });
  }, [salaries, search, statusFilter]);

  const totalPaid = salaries
    .filter((item) => item.status === "Paid")
    .reduce((sum, item) => sum + calcNetSalary(item), 0);

  const averageSalary = Math.round(
    salaries.reduce((sum, item) => sum + calcNetSalary(item), 0) /
      salaries.length
  );

  const highestSalary = Math.max(...salaries.map((item) => calcNetSalary(item)));

  const pendingCount = salaries.filter((item) => item.status === "Pending").length;

  const resetForm = () => {
    setForm({
      employeeId: "",
      employee: "",
      department: "",
      designation: "",
      basic: "",
      workingDays: "",
      presentDays: "",
      performance: "",
      bonus: "",
      deductions: "",
      status: "Pending",
    });
    setEditData(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      !form.employeeId ||
      !form.employee ||
      !form.department ||
      !form.designation ||
      !form.basic ||
      !form.workingDays ||
      !form.presentDays
    ) {
      alert("Please fill required fields");
      return;
    }

    if (editData) {
      setSalaries((prev) =>
        prev.map((item) => (item.id === editData.id ? { ...item, ...form } : item))
      );
    } else {
      const newId = `SAL${String(salaries.length + 1).padStart(3, "0")}`;
      setSalaries((prev) => [...prev, { id: newId, ...form }]);
    }

    resetForm();
  };

  const handleEdit = (item) => {
    setEditData(item);
    setForm(item);
  };

  const handleDelete = (id) => {
    if (window.confirm("Delete this salary record?")) {
      setSalaries((prev) => prev.filter((item) => item.id !== id));
    }
  };

  const downloadSlip = (item) => {
    const slip = `
Salary Slip
Employee: ${item.employee}
Employee ID: ${item.employeeId}
Department: ${item.department}
Designation: ${item.designation}
Basic Salary: ₹${item.basic}
Attendance Pay: ₹${Math.round((item.basic / item.workingDays) * item.presentDays)}
Bonus: ₹${item.bonus}
Deductions: ₹${item.deductions}
Net Salary: ₹${calcNetSalary(item)}
Status: ${item.status}
`;
    const blob = new Blob([slip], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${item.employee}-salary-slip.txt`;
    a.click();
  };

  const downloadExcel = () => {
    const csv =
      "Employee ID,Employee,Department,Designation,Basic,Bonus,Deductions,Net Salary,Status\n" +
      salaries
        .map(
          (item) =>
            `${item.employeeId},${item.employee},${item.department},${item.designation},${item.basic},${item.bonus},${item.deductions},${calcNetSalary(item)},${item.status}`
        )
        .join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "salary-list.csv";
    a.click();
  };

  return (
    <div className="salary-page">
      <div className="salary-header">
        <div>
          <h1>Salary Management</h1>
          <span></span>
          <p>Calculate employee salary based on attendance and performance.</p>
        </div>

        <button onClick={downloadExcel}>
          <FaDownload /> Download Excel
        </button>
      </div>

      <div className="salary-stats">
        <div className="salary-card blue">
          <FaMoneyBillWave />
          <div>
            <h2>₹{totalPaid.toLocaleString()}</h2>
            <p>Total Salary Paid</p>
          </div>
        </div>

        <div className="salary-card green">
          <FaUsers />
          <div>
            <h2>₹{averageSalary.toLocaleString()}</h2>
            <p>Average Salary</p>
          </div>
        </div>

        <div className="salary-card purple">
          <FaCheckCircle />
          <div>
            <h2>₹{highestSalary.toLocaleString()}</h2>
            <p>Highest Salary</p>
          </div>
        </div>

        <div className="salary-card orange">
          <FaClock />
          <div>
            <h2>{pendingCount}</h2>
            <p>Pending Payments</p>
          </div>
        </div>
      </div>

      <div className="salary-content">
        <div className="salary-form-card">
          <h2>{editData ? "Edit Salary" : "Add Salary"}</h2>

          <form onSubmit={handleSubmit}>
            <input placeholder="Employee ID" value={form.employeeId} onChange={(e) => setForm({ ...form, employeeId: e.target.value })} />
            <input placeholder="Employee Name" value={form.employee} onChange={(e) => setForm({ ...form, employee: e.target.value })} />
            <input placeholder="Department" value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })} />
            <input placeholder="Designation" value={form.designation} onChange={(e) => setForm({ ...form, designation: e.target.value })} />
            <input type="number" placeholder="Basic Salary" value={form.basic} onChange={(e) => setForm({ ...form, basic: e.target.value })} />
            <input type="number" placeholder="Working Days" value={form.workingDays} onChange={(e) => setForm({ ...form, workingDays: e.target.value })} />
            <input type="number" placeholder="Present Days" value={form.presentDays} onChange={(e) => setForm({ ...form, presentDays: e.target.value })} />
            <input type="number" placeholder="Performance Score %" value={form.performance} onChange={(e) => setForm({ ...form, performance: e.target.value })} />
            <input type="number" placeholder="Bonus" value={form.bonus} onChange={(e) => setForm({ ...form, bonus: e.target.value })} />
            <input type="number" placeholder="Deductions" value={form.deductions} onChange={(e) => setForm({ ...form, deductions: e.target.value })} />

            <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
              <option>Paid</option>
              <option>Pending</option>
            </select>

            <button type="submit">
              <FaSave /> {editData ? "Update Salary" : "Save Salary"}
            </button>

            {editData && (
              <button type="button" className="cancel-btn" onClick={resetForm}>
                <FaTimes /> Cancel
              </button>
            )}
          </form>
        </div>

        <div className="salary-list-card">
          <div className="salary-list-header">
            <h2>Salary List</h2>

            <div className="salary-tools">
              <div className="salary-search">
                <FaSearch />
                <input
                  placeholder="Search employee..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                <option>All Status</option>
                <option>Paid</option>
                <option>Pending</option>
              </select>
            </div>
          </div>

          <div className="salary-table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Employee</th>
                  <th>Department</th>
                  <th>Basic</th>
                  <th>Attendance Pay</th>
                  <th>Bonus</th>
                  <th>Deductions</th>
                  <th>Net Salary</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredSalaries.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <strong>{item.employee}</strong>
                      <small>{item.employeeId}</small>
                    </td>
                    <td>
                      <strong>{item.department}</strong>
                      <small>{item.designation}</small>
                    </td>
                    <td>₹{Number(item.basic).toLocaleString()}</td>
                    <td>
                      ₹
                      {Math.round(
                        (item.basic / item.workingDays) * item.presentDays
                      ).toLocaleString()}
                    </td>
                    <td>₹{Number(item.bonus || 0).toLocaleString()}</td>
                    <td>₹{Number(item.deductions || 0).toLocaleString()}</td>
                    <td className="net">₹{calcNetSalary(item).toLocaleString()}</td>
                    <td>
                      <span className={item.status === "Paid" ? "paid" : "pending"}>
                        {item.status}
                      </span>
                    </td>
                    <td>
                      <div className="salary-actions">
                        <button className="view" onClick={() => setViewData(item)}>
                          <FaEye />
                        </button>
                        <button className="edit" onClick={() => handleEdit(item)}>
                          <FaEdit />
                        </button>
                        <button className="download" onClick={() => downloadSlip(item)}>
                          <FaDownload />
                        </button>
                        <button className="delete" onClick={() => handleDelete(item.id)}>
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

                {filteredSalaries.length === 0 && (
                  <tr>
                    <td colSpan="9" className="no-data">
                      No salary record found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {viewData && (
        <div className="salary-modal-overlay">
          <div className="salary-modal">
            <div className="salary-modal-header">
              <h2>Salary Details</h2>
              <button onClick={() => setViewData(null)}>
                <FaTimes />
              </button>
            </div>

            <p><b>Employee:</b> {viewData.employee}</p>
            <p><b>Employee ID:</b> {viewData.employeeId}</p>
            <p><b>Department:</b> {viewData.department}</p>
            <p><b>Designation:</b> {viewData.designation}</p>
            <p><b>Basic Salary:</b> ₹{viewData.basic}</p>
            <p><b>Bonus:</b> ₹{viewData.bonus}</p>
            <p><b>Deductions:</b> ₹{viewData.deductions}</p>
            <p><b>Net Salary:</b> ₹{calcNetSalary(viewData)}</p>
            <p><b>Status:</b> {viewData.status}</p>
          </div>
        </div>
      )}
    </div>
  );
}