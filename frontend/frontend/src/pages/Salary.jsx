import { useState } from "react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaEye,
  FaDownload,
  FaMoneyBillWave,
  FaUsers,
  FaClock,
  FaCheckCircle,
  FaFilePdf,
} from "react-icons/fa";
import "./Salary.css";

const initialData = [
  {
    id: 1,
    employeeId: "EMP001",
    name: "Vivek Srivastava",
    department: "IT Department",
    designation: "Full Stack Developer",
    basicSalary: 40000,
    workingDays: 26,
    presentDays: 24,
    performanceScore: 92,
    allowances: 2000,
    deductions: 1500,
    paymentStatus: "Paid",
    paymentDate: "2026-05-30",
  },
  {
    id: 2,
    employeeId: "EMP002",
    name: "Rahul Sharma",
    department: "IT Department",
    designation: "Backend Developer",
    basicSalary: 35000,
    workingDays: 26,
    presentDays: 23,
    performanceScore: 81,
    allowances: 1500,
    deductions: 1200,
    paymentStatus: "Pending",
    paymentDate: "",
  },
];

const emptyForm = {
  employeeId: "",
  name: "",
  department: "",
  designation: "",
  basicSalary: "",
  workingDays: "",
  presentDays: "",
  performanceScore: "",
  allowances: "",
  deductions: "",
  paymentStatus: "Pending",
  paymentDate: "",
};

export default function Salary() {
  const [salaries, setSalaries] = useState(initialData);
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState(null);
  const [viewData, setViewData] = useState(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const calculateSalary = (item) => {
    const basicSalary = Number(item.basicSalary) || 0;
    const workingDays = Number(item.workingDays) || 1;
    const presentDays = Number(item.presentDays) || 0;
    const score = Number(item.performanceScore) || 0;
    const allowances = Number(item.allowances) || 0;
    const deductions = Number(item.deductions) || 0;

    const attendancePay = Math.round((basicSalary / workingDays) * presentDays);

    let performanceBonus = 0;

    if (score >= 90) performanceBonus = basicSalary * 0.1;
    else if (score >= 80) performanceBonus = basicSalary * 0.07;
    else if (score >= 70) performanceBonus = basicSalary * 0.05;
    else if (score >= 60) performanceBonus = basicSalary * 0.02;

    performanceBonus = Math.round(performanceBonus);

    const netSalary = attendancePay + performanceBonus + allowances - deductions;

    return {
      attendancePay,
      performanceBonus,
      netSalary,
    };
  };

  const salaryWithCalculation = salaries.map((item) => ({
    ...item,
    ...calculateSalary(item),
  }));

  const filteredSalary = salaryWithCalculation.filter((item) => {
    const keyword = search.toLowerCase();

    const matchSearch =
      item.name.toLowerCase().includes(keyword) ||
      item.employeeId.toLowerCase().includes(keyword) ||
      item.department.toLowerCase().includes(keyword) ||
      item.designation.toLowerCase().includes(keyword);

    const matchStatus =
      statusFilter === "All" || item.paymentStatus === statusFilter;

    return matchSearch && matchStatus;
  });

  const totalPaid = salaryWithCalculation
    .filter((item) => item.paymentStatus === "Paid")
    .reduce((sum, item) => sum + item.netSalary, 0);

  const averageSalary =
    salaryWithCalculation.length === 0
      ? 0
      : Math.round(
          salaryWithCalculation.reduce((sum, item) => sum + item.netSalary, 0) /
            salaryWithCalculation.length
        );

  const pendingPayments = salaryWithCalculation.filter(
    (item) => item.paymentStatus === "Pending"
  ).length;

  const highestSalary =
    salaryWithCalculation.length === 0
      ? 0
      : Math.max(...salaryWithCalculation.map((item) => item.netSalary));

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const resetForm = () => {
    setForm(emptyForm);
    setEditId(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      !form.employeeId ||
      !form.name ||
      !form.department ||
      !form.designation ||
      !form.basicSalary ||
      !form.workingDays ||
      !form.presentDays ||
      !form.performanceScore
    ) {
      alert("Please fill all required fields");
      return;
    }

    const payload = {
      ...form,
      basicSalary: Number(form.basicSalary),
      workingDays: Number(form.workingDays),
      presentDays: Number(form.presentDays),
      performanceScore: Number(form.performanceScore),
      allowances: Number(form.allowances) || 0,
      deductions: Number(form.deductions) || 0,
    };

    if (editId) {
      setSalaries(
        salaries.map((item) =>
          item.id === editId ? { ...payload, id: editId } : item
        )
      );
    } else {
      setSalaries([{ ...payload, id: Date.now() }, ...salaries]);
    }

    resetForm();
  };

  const handleEdit = (item) => {
    setEditId(item.id);
    setForm({
      employeeId: item.employeeId,
      name: item.name,
      department: item.department,
      designation: item.designation,
      basicSalary: item.basicSalary,
      workingDays: item.workingDays,
      presentDays: item.presentDays,
      performanceScore: item.performanceScore,
      allowances: item.allowances,
      deductions: item.deductions,
      paymentStatus: item.paymentStatus,
      paymentDate: item.paymentDate,
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete salary record?")) {
      setSalaries(salaries.filter((item) => item.id !== id));
    }
  };

  const downloadExcel = () => {
    const exportData = salaryWithCalculation.map((item) => ({
      Employee_ID: item.employeeId,
      Name: item.name,
      Department: item.department,
      Designation: item.designation,
      Basic_Salary: item.basicSalary,
      Working_Days: item.workingDays,
      Present_Days: item.presentDays,
      Attendance_Pay: item.attendancePay,
      Performance_Score: item.performanceScore,
      Performance_Bonus: item.performanceBonus,
      Allowances: item.allowances,
      Deductions: item.deductions,
      Net_Salary: item.netSalary,
      Payment_Status: item.paymentStatus,
      Payment_Date: item.paymentDate,
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, "Salary");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const fileData = new Blob([excelBuffer], {
      type: "application/octet-stream",
    });

    saveAs(fileData, "employee-salary.xlsx");
  };

  const downloadSalarySlipPDF = (item) => {
    const doc = new jsPDF();

    doc.setFillColor(37, 99, 235);
    doc.rect(0, 0, 210, 35, "F");

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.text("Employee Salary Slip", 20, 22);

    doc.setTextColor(15, 23, 42);
    doc.setFontSize(12);

    doc.text(`Employee Name: ${item.name}`, 20, 50);
    doc.text(`Employee ID: ${item.employeeId}`, 20, 60);
    doc.text(`Department: ${item.department}`, 20, 70);
    doc.text(`Designation: ${item.designation}`, 20, 80);
    doc.text(`Payment Status: ${item.paymentStatus}`, 20, 90);
    doc.text(`Payment Date: ${item.paymentDate || "Not Paid"}`, 20, 100);

    autoTable(doc, {
      startY: 115,
      head: [["Salary Component", "Amount"]],
      body: [
        ["Basic Salary", `Rs. ${item.basicSalary.toLocaleString()}`],
        ["Working Days", `${item.workingDays}`],
        ["Present Days", `${item.presentDays}`],
        ["Attendance Pay", `Rs. ${item.attendancePay.toLocaleString()}`],
        ["Performance Score", `${item.performanceScore}%`],
        ["Performance Bonus", `Rs. ${item.performanceBonus.toLocaleString()}`],
        ["Allowances", `Rs. ${item.allowances.toLocaleString()}`],
        ["Deductions", `Rs. ${item.deductions.toLocaleString()}`],
        ["Net Salary", `Rs. ${item.netSalary.toLocaleString()}`],
      ],
      headStyles: {
        fillColor: [37, 99, 235],
      },
      styles: {
        fontSize: 11,
      },
    });

    doc.setFontSize(10);
    doc.text(
      "This is a system generated salary slip.",
      20,
      doc.lastAutoTable.finalY + 18
    );

    doc.save(`${item.employeeId}-${item.name}-salary-slip.pdf`);
  };

  return (
    <div className="salary-page">
      <div className="salary-header">
        <div>
          <h1>Salary Management</h1>
          <p>Calculate employee salary based on attendance and performance.</p>
        </div>

        <button className="download-btn" onClick={downloadExcel}>
          <FaDownload />
          Download Excel
        </button>
      </div>

      <div className="salary-cards">
        <div className="salary-card blue">
          <div className="salary-card-icon">
            <FaMoneyBillWave />
          </div>
          <div>
            <h3>₹{totalPaid.toLocaleString()}</h3>
            <p>Total Salary Paid</p>
          </div>
        </div>

        <div className="salary-card green">
          <div className="salary-card-icon">
            <FaUsers />
          </div>
          <div>
            <h3>₹{averageSalary.toLocaleString()}</h3>
            <p>Average Salary</p>
          </div>
        </div>

        <div className="salary-card purple">
          <div className="salary-card-icon">
            <FaCheckCircle />
          </div>
          <div>
            <h3>₹{highestSalary.toLocaleString()}</h3>
            <p>Highest Salary</p>
          </div>
        </div>

        <div className="salary-card orange">
          <div className="salary-card-icon">
            <FaClock />
          </div>
          <div>
            <h3>{pendingPayments}</h3>
            <p>Pending Payments</p>
          </div>
        </div>
      </div>

      <div className="salary-main">
        <form className="salary-form" onSubmit={handleSubmit}>
          <h2>{editId ? "Update Salary" : "Add Salary"}</h2>

          <input
            name="employeeId"
            placeholder="Employee ID"
            value={form.employeeId}
            onChange={handleChange}
          />

          <input
            name="name"
            placeholder="Employee Name"
            value={form.name}
            onChange={handleChange}
          />

          <input
            name="department"
            placeholder="Department"
            value={form.department}
            onChange={handleChange}
          />

          <input
            name="designation"
            placeholder="Designation"
            value={form.designation}
            onChange={handleChange}
          />

          <input
            type="number"
            name="basicSalary"
            placeholder="Basic Salary"
            value={form.basicSalary}
            onChange={handleChange}
          />

          <input
            type="number"
            name="workingDays"
            placeholder="Working Days"
            value={form.workingDays}
            onChange={handleChange}
          />

          <input
            type="number"
            name="presentDays"
            placeholder="Present Days"
            value={form.presentDays}
            onChange={handleChange}
          />

          <input
            type="number"
            name="performanceScore"
            placeholder="Performance Score %"
            value={form.performanceScore}
            onChange={handleChange}
          />

          <input
            type="number"
            name="allowances"
            placeholder="Allowances"
            value={form.allowances}
            onChange={handleChange}
          />

          <input
            type="number"
            name="deductions"
            placeholder="Deductions"
            value={form.deductions}
            onChange={handleChange}
          />

          <select
            name="paymentStatus"
            value={form.paymentStatus}
            onChange={handleChange}
          >
            <option value="Pending">Pending</option>
            <option value="Paid">Paid</option>
          </select>

          <input
            type="date"
            name="paymentDate"
            value={form.paymentDate}
            onChange={handleChange}
          />

          <button type="submit">
            <FaPlus />
            {editId ? "Update Salary" : "Add Salary"}
          </button>

          {editId && (
            <button type="button" className="cancel-btn" onClick={resetForm}>
              Cancel
            </button>
          )}
        </form>

        <div className="salary-table-box">
          <div className="table-top">
            <h2>Salary List</h2>

            <div className="salary-filters">
              <input
                type="text"
                placeholder="Search employee..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="All">All Status</option>
                <option value="Paid">Paid</option>
                <option value="Pending">Pending</option>
              </select>
            </div>
          </div>

          <div className="table-responsive">
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
                {filteredSalary.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <b>{item.name}</b>
                      <span>{item.employeeId}</span>
                    </td>

                    <td>
                      <b>{item.department}</b>
                      <span>{item.designation}</span>
                    </td>

                    <td>₹{item.basicSalary.toLocaleString()}</td>
                    <td>₹{item.attendancePay.toLocaleString()}</td>
                    <td>₹{item.performanceBonus.toLocaleString()}</td>
                    <td>₹{item.deductions.toLocaleString()}</td>

                    <td className="net-salary">
                      ₹{item.netSalary.toLocaleString()}
                    </td>

                    <td>
                      <span
                        className={`salary-status ${item.paymentStatus.toLowerCase()}`}
                      >
                        {item.paymentStatus}
                      </span>
                    </td>

                    <td className="action-buttons">
                      <button
                        className="view-btn"
                        onClick={() => setViewData(item)}
                        title="View Salary Slip"
                      >
                        <FaEye />
                      </button>

                      <button
                        className="edit-btn"
                        onClick={() => handleEdit(item)}
                        title="Edit"
                      >
                        <FaEdit />
                      </button>

                      <button
                        className="delete-btn"
                        onClick={() => handleDelete(item.id)}
                        title="Delete"
                      >
                        <FaTrash />
                      </button>

                      <button
                        className="pdf-btn"
                        onClick={() => downloadSalarySlipPDF(item)}
                        title="Download PDF"
                      >
                        <FaFilePdf />
                      </button>
                    </td>
                  </tr>
                ))}

                {filteredSalary.length === 0 && (
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
        <div className="salary-modal-overlay" onClick={() => setViewData(null)}>
          <div className="salary-modal" onClick={(e) => e.stopPropagation()}>
            <h2>Salary Slip</h2>

            <div className="slip-header">
              <h3>{viewData.name}</h3>
              <p>{viewData.designation}</p>
              <span>{viewData.employeeId}</span>
            </div>

            <div className="slip-row">
              <span>Department</span>
              <b>{viewData.department}</b>
            </div>

            <div className="slip-row">
              <span>Basic Salary</span>
              <b>₹{viewData.basicSalary.toLocaleString()}</b>
            </div>

            <div className="slip-row">
              <span>Working Days</span>
              <b>{viewData.workingDays}</b>
            </div>

            <div className="slip-row">
              <span>Present Days</span>
              <b>{viewData.presentDays}</b>
            </div>

            <div className="slip-row">
              <span>Attendance Pay</span>
              <b>₹{viewData.attendancePay.toLocaleString()}</b>
            </div>

            <div className="slip-row">
              <span>Performance Score</span>
              <b>{viewData.performanceScore}%</b>
            </div>

            <div className="slip-row">
              <span>Performance Bonus</span>
              <b>₹{viewData.performanceBonus.toLocaleString()}</b>
            </div>

            <div className="slip-row">
              <span>Allowances</span>
              <b>₹{viewData.allowances.toLocaleString()}</b>
            </div>

            <div className="slip-row">
              <span>Deductions</span>
              <b>₹{viewData.deductions.toLocaleString()}</b>
            </div>

            <div className="slip-row total">
              <span>Net Salary</span>
              <b>₹{viewData.netSalary.toLocaleString()}</b>
            </div>

            <div className="slip-row">
              <span>Status</span>
              <b>{viewData.paymentStatus}</b>
            </div>

            <div className="modal-actions">
              <button
                className="modal-pdf-btn"
                onClick={() => downloadSalarySlipPDF(viewData)}
              >
                <FaFilePdf />
                Download PDF
              </button>

              <button onClick={() => setViewData(null)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}