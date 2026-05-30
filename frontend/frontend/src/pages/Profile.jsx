import { useAuth } from "../context/AuthContext";

export default function Profile() {
  const { user } = useAuth();

  return (
    <div className="page">
      <h1>Profile</h1>

      <div className="details-card">
        <h2>{user?.name || "Admin User"}</h2>
        <p><b>Email:</b> {user?.email || "admin@gmail.com"}</p>
        <p><b>Role:</b> {user?.role || "ADMIN"}</p>
      </div>
    </div>
  );
}