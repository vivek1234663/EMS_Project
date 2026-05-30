import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1>404</h1>
        <p>Page not found</p>
        <Link to="/dashboard">
          <button>Back to Dashboard</button>
        </Link>
      </div>
    </div>
  );
}