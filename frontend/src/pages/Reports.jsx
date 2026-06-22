import { useEffect, useMemo, useState } from "react";
import {
  FaChartPie,
  FaUsers,
  FaCalendarCheck,
  FaMoneyBillWave,
  FaDownload,
  FaSearch,
  FaEye,
  FaTimes,
  FaFileAlt,
  FaTrophy,
} from "react-icons/fa";
import API from "../api/api";
import "./Reports.css";

export default function Reports() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("All Reports");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [viewData, setViewData] = useState(null);
  const [activeReport, setActiveReport] = useState("Employee");

  const reportTypes = [
    "All Reports",
    "Employee",
    "Attendance",
    "Salary",
    "Performance",
  ];

  const statuses = ["All Status", "Completed"];

  const formatDate = () => {
    return new Date().toLocaleDateString("en-IN");
  };

  const fetchReports = async () => {
    try {
      setLoading(true);

      const [employeesRes, attendanceRes, salaryRes, performanceRes] =
        await Promise.all([
          API.get("/reports/employees"),
          API.get("/reports/attendance"),
          API.get("/reports/salary"),
          API.get("/reports/performance"),
        ]);

      const employeeData = Array.isArray(employeesRes.data)
        ? employeesRes.data
        : [];

      const attendanceData = Array.isArray(attendanceRes.data)
        ? attendanceRes.data
        : [];

      const salaryData = Array.isArray(salaryRes.data) ? salaryRes.data : [];

      const performanceData = Array.isArray(performanceRes.data)
        ? performanceRes.data
        : [];

      const finalReports = [
        {
          id: "RPT-EMP-001",
          title: "Employee Report",
          type: "Employee",
          department: "All Departments",
          month: "All",
          generatedBy: "Admin",
          totalRecords: employeeData.length,
          status: "Completed",
          createdAt: formatDate(),
          rawData: employeeData,
        },
        {
          id: "RPT-ATT-001",
          title: "Attendance Report",
          type: "Attendance",
          department: "All Departments",
          month: "All",
          generatedBy: "Admin",
          totalRecords: attendanceData.length,
          status: "Completed",
          createdAt: formatDate(),
          rawData: attendanceData,
        },
        {
          id: "RPT-SAL-001",
          title: "Salary Report",
          type: "Salary",
          department: "All Departments",
          month: "All",
          generatedBy: "Admin",
          totalRecords: salaryData.length,
          status: "Completed",
          createdAt: formatDate(),
          rawData: salaryData,
        },
        {
          id: "RPT-PER-001",
          title: "Performance Report",
          type: "Performance",
          department: "All Departments",
          month: "All",
          generatedBy: "Admin",
          totalRecords: performanceData.length,
          status: "Completed",
          createdAt: formatDate(),
          rawData: performanceData,
        },
      ];

      setReports(finalReports);
    } catch (error) {
      console.error("Reports fetch error:", error);
      alert("Reports load nahi ho rahe. Backend APIs check karo.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const filteredReports = useMemo(() => {
    return reports.filter((item) => {
      const keyword = search.toLowerCase();

      const matchSearch =
        String(item.id || "").toLowerCase().includes(keyword) ||
        String(item.title || "").toLowerCase().includes(keyword) ||
        String(item.department || "").toLowerCase().includes(keyword) ||
        String(item.generatedBy || "").toLowerCase().includes(keyword) ||
        String(item.type || "").toLowerCase().includes(keyword);

      const matchType =
        typeFilter === "All Reports" || item.type === typeFilter;

      const matchStatus =
        statusFilter === "All Status" || item.status === statusFilter;

      return matchSearch && matchType && matchStatus;
    });
  }, [reports, search, typeFilter, statusFilter]);

  const completedReports = reports.filter(
    (item) => item.status === "Completed"
  ).length;

  const pendingReports = reports.filter(
    (item) => item.status === "Pending"
  ).length;

  const totalRecords = reports.reduce(
    (sum, item) => sum + Number(item.totalRecords || 0),
    0
  );

  const getReportCountByType = (type) => {
    const report = reports.find((item) => item.type === type);
    return report ? report.totalRecords : 0;
  };

  const getActiveReportData = () => {
    const report = reports.find((item) => item.type === activeReport);
    return report?.rawData || [];
  };

  const downloadReport = (item) => {
    const content = `
Report ID: ${item.id}
Title: ${item.title}
Type: ${item.type}
Department: ${item.department}
Month: ${item.month}
Generated By: ${item.generatedBy}
Total Records: ${item.totalRecords}
Status: ${item.status}
Created At: ${item.createdAt}

Data:
${JSON.stringify(item.rawData, null, 2)}
`;

    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `${item.title || "report"}.txt`;
    a.click();

    URL.revokeObjectURL(url);
  };

  const downloadCSV = () => {
    const csv =
      "Report ID,Title,Type,Department,Month,Generated By,Total Records,Status,Created At\n" +
      reports
        .map(
          (item) =>
            `${item.id || ""},${item.title || ""},${item.type || ""},${
              item.department || ""
            },${item.month || ""},${item.generatedBy || ""},${
              item.totalRecords || 0
            },${item.status || ""},${item.createdAt || ""}`
        )
        .join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "all-reports.csv";
    a.click();

    URL.revokeObjectURL(url);
  };

  const downloadActiveCSV = () => {
    const activeData = getActiveReportData();

    if (activeData.length === 0) {
      alert("No data available to download");
      return;
    }

    const headers = Object.keys(activeData[0]).join(",");

    const rows = activeData
      .map((item) =>
        Object.values(item)
          .map((value) => `"${value ?? ""}"`)
          .join(",")
      )
      .join("\n");

    const csv = `${headers}\n${rows}`;

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `${activeReport}-report.csv`;
    a.click();

    URL.revokeObjectURL(url);
  };

  const getTypeClass = (type) => {
    if (type === "Employee") return "report-type employee";
    if (type === "Attendance") return "report-type attendance";
    if (type === "Salary") return "report-type salary";
    if (type === "Performance") return "report-type performance";
    return "report-type";
  };

  const renderActiveTableHeaders = () => {
    const activeData = getActiveReportData();

    if (activeData.length === 0) return null;

    return Object.keys(activeData[0]).map((key) => <th key={key}>{key}</th>);
  };

  const renderActiveTableRows = () => {
    const activeData = getActiveReportData();

    if (activeData.length === 0) {
      return (
        <tr>
          <td colSpan="10">No {activeReport} data found</td>
        </tr>
      );
    }

    return activeData.map((row, index) => (
      <tr key={row.id || index}>
        {Object.values(row).map((value, i) => (
          <td key={i}>{String(value ?? "-")}</td>
        ))}
      </tr>
    ));
  };

  return (
    <div className="reports-page">
      <div className="reports-header">
        <div>
          <h1>Reports Management</h1>
          <span></span>
          <p>Analyze employees, attendance, salary and performance reports.</p>
        </div>

        <button onClick={downloadCSV}>
          <FaDownload /> Export Reports
        </button>
      </div>

      <div className="reports-stats">
        <div className="report-card blue">
          <FaFileAlt />
          <div>
            <h2>{reports.length}</h2>
            <p>Total Reports</p>
          </div>
        </div>

        <div className="report-card green">
          <FaChartPie />
          <div>
            <h2>{completedReports}</h2>
            <p>Completed Reports</p>
          </div>
        </div>

        <div className="report-card orange">
          <FaCalendarCheck />
          <div>
            <h2>{pendingReports}</h2>
            <p>Pending Reports</p>
          </div>
        </div>

        <div className="report-card purple">
          <FaUsers />
          <div>
            <h2>{totalRecords}</h2>
            <p>Total Records</p>
          </div>
        </div>
      </div>

      <div className="reports-summary-grid">
        <div
          className={
            activeReport === "Employee"
              ? "summary-box active-summary"
              : "summary-box"
          }
          onClick={() => setActiveReport("Employee")}
        >
          <div className="summary-icon employee">
            <FaUsers />
          </div>
          <div>
            <h3>Employee Report</h3>
            <p>{getReportCountByType("Employee")} employees available.</p>
          </div>
        </div>

        <div
          className={
            activeReport === "Attendance"
              ? "summary-box active-summary"
              : "summary-box"
          }
          onClick={() => setActiveReport("Attendance")}
        >
          <div className="summary-icon attendance">
            <FaCalendarCheck />
          </div>
          <div>
            <h3>Attendance Report</h3>
            <p>{getReportCountByType("Attendance")} attendance records.</p>
          </div>
        </div>

        <div
          className={
            activeReport === "Salary"
              ? "summary-box active-summary"
              : "summary-box"
          }
          onClick={() => setActiveReport("Salary")}
        >
          <div className="summary-icon salary">
            <FaMoneyBillWave />
          </div>
          <div>
            <h3>Salary Report</h3>
            <p>{getReportCountByType("Salary")} salary records.</p>
          </div>
        </div>

        <div
          className={
            activeReport === "Performance"
              ? "summary-box active-summary"
              : "summary-box"
          }
          onClick={() => setActiveReport("Performance")}
        >
          <div className="summary-icon performance">
            <FaTrophy />
          </div>
          <div>
            <h3>Performance Report</h3>
            <p>{getReportCountByType("Performance")} performance records.</p>
          </div>
        </div>
      </div>

      <div className="report-detail-section">
        <div className="detail-section-header">
          <div>
            <h2>{activeReport} Detailed Report</h2>
            <p>Live report data based on backend records.</p>
          </div>

          <button onClick={downloadActiveCSV}>
            <FaDownload /> Download {activeReport}
          </button>
        </div>

        <div className="detail-grid">
          <div className="detail-card">
            <h3>Total {activeReport} Records</h3>
            <p>{getReportCountByType(activeReport)}</p>
          </div>

          <div className="detail-card">
            <h3>Status</h3>
            <p>Completed</p>
          </div>

          <div className="detail-card">
            <h3>Generated By</h3>
            <p>Admin</p>
          </div>

          <div className="detail-card">
            <h3>Created At</h3>
            <p>{formatDate()}</p>
          </div>
        </div>

        <div className="mini-report-table">
          <table>
            <thead>
              <tr>{renderActiveTableHeaders()}</tr>
            </thead>
            <tbody>{renderActiveTableRows()}</tbody>
          </table>
        </div>
      </div>

      <div className="reports-table-card">
        <div className="reports-table-header">
          <div>
            <h2>Generated Reports</h2>
            <p>
              {loading
                ? "Loading reports..."
                : `${filteredReports.length} reports found`}
            </p>
          </div>

          <div className="reports-tools">
            <div className="reports-search">
              <FaSearch />
              <input
                placeholder="Search reports..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
            >
              {reportTypes.map((type) => (
                <option key={type}>{type}</option>
              ))}
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              {statuses.map((status) => (
                <option key={status}>{status}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="reports-table-wrap">
          <table>
            <thead>
              <tr>
                <th>Report ID</th>
                <th>Title</th>
                <th>Type</th>
                <th>Department</th>
                <th>Month</th>
                <th>Generated By</th>
                <th>Records</th>
                <th>Status</th>
                <th>Created At</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredReports.length > 0 ? (
                filteredReports.map((item) => (
                  <tr key={item.id}>
                    <td>{item.id}</td>
                    <td className="report-title">{item.title}</td>
                    <td>
                      <span className={getTypeClass(item.type)}>
                        {item.type}
                      </span>
                    </td>
                    <td>{item.department}</td>
                    <td>{item.month}</td>
                    <td>{item.generatedBy}</td>
                    <td>
                      <span className="record-pill">{item.totalRecords}</span>
                    </td>
                    <td>
                      <span className="report-status completed">
                        {item.status}
                      </span>
                    </td>
                    <td>{item.createdAt}</td>
                    <td>
                      <div className="reports-actions">
                        <button
                          className="view"
                          onClick={() => setViewData(item)}
                        >
                          <FaEye />
                        </button>

                        <button
                          className="download"
                          onClick={() => downloadReport(item)}
                        >
                          <FaDownload />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="10" className="no-report">
                    {loading ? "Loading..." : "No report found"}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {viewData && (
        <div className="report-modal-overlay">
          <div className="report-modal">
            <div className="report-modal-header">
              <h2>Report Details</h2>
              <button onClick={() => setViewData(null)}>
                <FaTimes />
              </button>
            </div>

            <div className="report-details">
              <p>
                <b>Report ID:</b> {viewData.id}
              </p>
              <p>
                <b>Title:</b> {viewData.title}
              </p>
              <p>
                <b>Type:</b> {viewData.type}
              </p>
              <p>
                <b>Department:</b> {viewData.department}
              </p>
              <p>
                <b>Month:</b> {viewData.month}
              </p>
              <p>
                <b>Generated By:</b> {viewData.generatedBy}
              </p>
              <p>
                <b>Total Records:</b> {viewData.totalRecords}
              </p>
              <p>
                <b>Status:</b> {viewData.status}
              </p>
              <p>
                <b>Created At:</b> {viewData.createdAt}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}