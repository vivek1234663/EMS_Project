import { useEffect, useMemo, useState } from "react";
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
import jsPDF from "jspdf";
import API from "../api/api";
import "./Salary.css";

export default function Salary() {
  const [salaries, setSalaries] = useState([]);
  const [loading, setLoading] = useState(false);
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
    hra: "",
    medicalAllowance: "",
    travelAllowance: "",
    bonus: "",
    pf: "",
    healthInsurance: "",
    professionalTax: "",
    deductions: "",
    status: "Pending",
  });

  const normalizeSalary = (item) => ({
    ...item,
    employee: item.employee || item.employeeName || "N/A",
    employeeId: item.employeeId || item.id || "N/A",
    department: item.department || "N/A",
    designation: item.designation || "N/A",
    basic: Number(item.basic || item.basicSalary || 0),
    workingDays: Number(item.workingDays || 30),
    presentDays: Number(item.presentDays || 0),
    performance: Number(item.performance || 0),
    hra: Number(item.hra || 0),
    medicalAllowance: Number(item.medicalAllowance || 0),
    travelAllowance: Number(item.travelAllowance || 0),
    bonus: Number(item.bonus || 0),
    pf: Number(item.pf || 0),
    healthInsurance: Number(item.healthInsurance || 0),
    professionalTax: Number(item.professionalTax || 0),
    deductions: Number(item.deductions || 0),
    status: item.status || item.paymentStatus || "Pending",
  });

  const fetchSalaries = async () => {
    try {
      setLoading(true);
      const res = await API.get("/salary");
      const data = Array.isArray(res.data) ? res.data : [];
      setSalaries(data.map(normalizeSalary));
    } catch (error) {
      console.error("Salary fetch error:", error);
      alert("Salary records load nahi ho rahe. Backend check karo.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSalaries();
  }, []);

  const getAttendancePay = (item) => {
    const basic = Number(item.basic || 0);
    const workingDays = Number(item.workingDays || 1);
    const presentDays = Number(item.presentDays || 0);
    return Math.round((basic / workingDays) * presentDays);
  };

  const getGrossSalary = (item) => {
    return (
      getAttendancePay(item) +
      Number(item.hra || 0) +
      Number(item.medicalAllowance || 0) +
      Number(item.travelAllowance || 0) +
      Number(item.bonus || 0)
    );
  };

  const getTotalDeduction = (item) => {
    return (
      Number(item.pf || 0) +
      Number(item.healthInsurance || 0) +
      Number(item.professionalTax || 0) +
      Number(item.deductions || 0)
    );
  };

  const calcNetSalary = (item) => {
    return Math.round(getGrossSalary(item) - getTotalDeduction(item));
  };

  const filteredSalaries = useMemo(() => {
    return salaries.filter((item) => {
      const keyword = search.toLowerCase();

      const matchSearch =
        String(item.employee || "").toLowerCase().includes(keyword) ||
        String(item.employeeId || "").toLowerCase().includes(keyword) ||
        String(item.department || "").toLowerCase().includes(keyword);

      const matchStatus =
        statusFilter === "All Status" || item.status === statusFilter;

      return matchSearch && matchStatus;
    });
  }, [salaries, search, statusFilter]);

  const totalPaid = salaries
    .filter((item) => item.status === "Paid")
    .reduce((sum, item) => sum + calcNetSalary(item), 0);

  const averageSalary =
    salaries.length > 0
      ? Math.round(
          salaries.reduce((sum, item) => sum + calcNetSalary(item), 0) /
            salaries.length
        )
      : 0;

  const highestSalary =
    salaries.length > 0
      ? Math.max(...salaries.map((item) => calcNetSalary(item)))
      : 0;

  const pendingCount = salaries.filter(
    (item) => item.status === "Pending"
  ).length;

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
      hra: "",
      medicalAllowance: "",
      travelAllowance: "",
      bonus: "",
      pf: "",
      healthInsurance: "",
      professionalTax: "",
      deductions: "",
      status: "Pending",
    });
    setEditData(null);
  };

  const handleSubmit = async (e) => {
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

    const payload = {
      employeeId: form.employeeId,
      employeeName: form.employee,
      department: form.department,
      designation: form.designation,
      basicSalary: Number(form.basic),
      workingDays: Number(form.workingDays),
      presentDays: Number(form.presentDays),
      performance: Number(form.performance || 0),
      hra: Number(form.hra || 0),
      medicalAllowance: Number(form.medicalAllowance || 0),
      travelAllowance: Number(form.travelAllowance || 0),
      bonus: Number(form.bonus || 0),
      pf: Number(form.pf || 0),
      healthInsurance: Number(form.healthInsurance || 0),
      professionalTax: Number(form.professionalTax || 0),
      deductions: Number(form.deductions || 0),
      paymentStatus: form.status,
    };

    try {
      if (editData) {
        await API.put(`/salary/${editData.id}`, payload);
        alert("Salary updated successfully");
      } else {
        await API.post("/salary", payload);
        alert("Salary added successfully");
      }

      resetForm();
      fetchSalaries();
    } catch (error) {
      console.error("Salary save error:", error);
      alert("Salary save nahi ho raha. Backend fields check karo.");
    }
  };

  const handleEdit = (item) => {
    setEditData(item);
    setForm({
      employeeId: item.employeeId || "",
      employee: item.employee || "",
      department: item.department || "",
      designation: item.designation || "",
      basic: item.basic || "",
      workingDays: item.workingDays || "",
      presentDays: item.presentDays || "",
      performance: item.performance || "",
      hra: item.hra || "",
      medicalAllowance: item.medicalAllowance || "",
      travelAllowance: item.travelAllowance || "",
      bonus: item.bonus || "",
      pf: item.pf || "",
      healthInsurance: item.healthInsurance || "",
      professionalTax: item.professionalTax || "",
      deductions: item.deductions || "",
      status: item.status || "Pending",
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this salary record?")) return;

    try {
      await API.delete(`/salary/${id}`);
      alert("Salary deleted successfully");
      fetchSalaries();
    } catch (error) {
      console.error("Salary delete error:", error);
      alert("Salary delete nahi ho raha. Backend check karo.");
    }
  };

  const downloadSlip = (item) => {
    const salary = normalizeSalary(item);
    const doc = new jsPDF();

    const companyName = "Employee Management System Pvt. Ltd.";
    const attendancePay = getAttendancePay(salary);
    const grossSalary = getGrossSalary(salary);
    const totalDeduction = getTotalDeduction(salary);
    const netSalary = calcNetSalary(salary);

    doc.setFontSize(18);
    doc.text(companyName, 20, 18);

    doc.setFontSize(14);
    doc.text("Salary Slip", 20, 30);

    doc.setFontSize(10);
    doc.text(`Generated Date: ${new Date().toLocaleDateString("en-IN")}`, 145, 30);

    doc.line(20, 36, 190, 36);

    doc.setFontSize(12);
    doc.text("Employee Details", 20, 48);

    doc.setFontSize(10);
    doc.text(`Employee Name: ${salary.employee}`, 20, 60);
    doc.text(`Employee ID: ${salary.employeeId}`, 110, 60);
    doc.text(`Department: ${salary.department}`, 20, 70);
    doc.text(`Designation: ${salary.designation}`, 110, 70);
    doc.text(`Working Days: ${salary.workingDays}`, 20, 80);
    doc.text(`Present Days: ${salary.presentDays}`, 110, 80);

    doc.line(20, 88, 190, 88);

    doc.setFontSize(12);
    doc.text("Earnings", 20, 100);
    doc.text("Deductions", 110, 100);

    doc.setFontSize(10);
    doc.text(`Basic Salary: Rs. ${salary.basic}`, 20, 112);
    doc.text(`Attendance Pay: Rs. ${attendancePay}`, 20, 122);
    doc.text(`HRA: Rs. ${salary.hra}`, 20, 132);
    doc.text(`Medical Allowance: Rs. ${salary.medicalAllowance}`, 20, 142);
    doc.text(`Travel Allowance: Rs. ${salary.travelAllowance}`, 20, 152);
    doc.text(`Bonus: Rs. ${salary.bonus}`, 20, 162);

    doc.text(`PF Amount: Rs. ${salary.pf}`, 110, 112);
    doc.text(`Health Insurance: Rs. ${salary.healthInsurance}`, 110, 122);
    doc.text(`Professional Tax: Rs. ${salary.professionalTax}`, 110, 132);
    doc.text(`Other Deductions: Rs. ${salary.deductions}`, 110, 142);

    doc.line(20, 172, 190, 172);

    doc.setFontSize(11);
    doc.text(`Gross Salary: Rs. ${grossSalary}`, 20, 184);
    doc.text(`Total Deduction: Rs. ${totalDeduction}`, 110, 184);

    doc.setFontSize(14);
    doc.text(`Net Salary: Rs. ${netSalary}`, 20, 200);

    doc.setFontSize(11);
    doc.text(`Payment Status: ${salary.status}`, 20, 214);

    doc.line(20, 226, 190, 226);

    doc.setFontSize(10);
    doc.text("Authorized Signature", 20, 244);
    doc.text("This is a computer generated salary slip.", 20, 260);

    doc.save(`${salary.employee || "employee"}-salary-slip.pdf`);
  };

  const downloadExcel = () => {
    const csv =
      "Employee ID,Employee,Department,Designation,Basic,HRA,Medical Allowance,Travel Allowance,Bonus,PF,Health Insurance,Professional Tax,Deductions,Gross Salary,Net Salary,Status\n" +
      salaries
        .map(
          (item) =>
            `${item.employeeId},${item.employee},${item.department},${item.designation},${item.basic},${item.hra || 0},${item.medicalAllowance || 0},${item.travelAllowance || 0},${item.bonus || 0},${item.pf || 0},${item.healthInsurance || 0},${item.professionalTax || 0},${item.deductions || 0},${getGrossSalary(item)},${calcNetSalary(item)},${item.status}`
        )
        .join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");

    a.href = url;
    a.download = "salary-list.csv";
    a.click();

    URL.revokeObjectURL(url);
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
            <input type="number" placeholder="HRA Amount" value={form.hra} onChange={(e) => setForm({ ...form, hra: e.target.value })} />
            <input type="number" placeholder="Medical Allowance" value={form.medicalAllowance} onChange={(e) => setForm({ ...form, medicalAllowance: e.target.value })} />
            <input type="number" placeholder="Travel Allowance" value={form.travelAllowance} onChange={(e) => setForm({ ...form, travelAllowance: e.target.value })} />
            <input type="number" placeholder="Bonus" value={form.bonus} onChange={(e) => setForm({ ...form, bonus: e.target.value })} />
            <input type="number" placeholder="PF Amount" value={form.pf} onChange={(e) => setForm({ ...form, pf: e.target.value })} />
            <input type="number" placeholder="Health Insurance" value={form.healthInsurance} onChange={(e) => setForm({ ...form, healthInsurance: e.target.value })} />
            <input type="number" placeholder="Professional Tax" value={form.professionalTax} onChange={(e) => setForm({ ...form, professionalTax: e.target.value })} />
            <input type="number" placeholder="Other Deductions" value={form.deductions} onChange={(e) => setForm({ ...form, deductions: e.target.value })} />

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
                <input placeholder="Search employee..." value={search} onChange={(e) => setSearch(e.target.value)} />
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
                  <th>Gross</th>
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

                    <td>₹{Number(item.basic || 0).toLocaleString()}</td>
                    <td>₹{getGrossSalary(item).toLocaleString()}</td>
                    <td>₹{getTotalDeduction(item).toLocaleString()}</td>
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
                    <td colSpan="8" className="no-data">
                      {loading ? "Loading..." : "No salary record found"}
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
            <p><b>HRA:</b> ₹{viewData.hra || 0}</p>
            <p><b>Medical Allowance:</b> ₹{viewData.medicalAllowance || 0}</p>
            <p><b>Travel Allowance:</b> ₹{viewData.travelAllowance || 0}</p>
            <p><b>Bonus:</b> ₹{viewData.bonus || 0}</p>
            <p><b>PF:</b> ₹{viewData.pf || 0}</p>
            <p><b>Health Insurance:</b> ₹{viewData.healthInsurance || 0}</p>
            <p><b>Professional Tax:</b> ₹{viewData.professionalTax || 0}</p>
            <p><b>Other Deductions:</b> ₹{viewData.deductions || 0}</p>
            <p><b>Gross Salary:</b> ₹{getGrossSalary(viewData)}</p>
            <p><b>Total Deduction:</b> ₹{getTotalDeduction(viewData)}</p>
            <p><b>Net Salary:</b> ₹{calcNetSalary(viewData)}</p>
            <p><b>Status:</b> {viewData.status}</p>
          </div>
        </div>
      )}
    </div>
  );
}