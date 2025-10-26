import { useState, useEffect } from "react";
import axios from "axios";

export default function AdminPage({ user, onLogout }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [stats, setStats] = useState({
    totalUsers: 0,
    customers: 0,
    staff: 0,
    admins: 0
  });

  useEffect(() => {
    fetchAllUsers();
  }, []);

  const fetchAllUsers = async () => {
    setLoading(true);
    setError("");
    
    try {
      const response = await axios.get("http://localhost:8080/api/users/all");
      setUsers(response.data);
      
      // Calculate statistics
      const totalUsers = response.data.length;
      const customers = response.data.filter(u => u.role === "CUSTOMER").length;
      const staff = response.data.filter(u => u.role === "STAFF").length;
      const admins = response.data.filter(u => u.role === "ADMIN").length;
      
      setStats({ totalUsers, customers, staff, admins });
      setLoading(false);
    } catch (err) {
      console.error("Error fetching users:", err);
      setError("Failed to load users. Please ensure your backend is running.");
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId, username) => {
    if (userId === user.id) {
      alert("You cannot delete your own account!");
      return;
    }

    if (window.confirm(`Are you sure you want to delete user "${username}"?`)) {
      try {
        await axios.delete(`http://localhost:8080/api/users/${userId}`);
        alert("User deleted successfully!");
        fetchAllUsers(); // Refresh the list
      } catch (err) {
        console.error("Error deleting user:", err);
        alert("Failed to delete user. Please try again.");
      }
    }
  };

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="dashboard-title">
          <span style={{ fontSize: '28px' }}>☕</span>
          <div>
            <h1>Coffee HUB - Admin Dashboard</h1>
            <span className="role-badge admin">Administrator</span>
          </div>
        </div>
        <div className="user-info">
          <div>
            <div className="welcome-text">Welcome,</div>
            <div className="username">{user.username}</div>
          </div>
          <button className="logout-btn" onClick={onLogout}>
            Logout
          </button>
        </div>
      </header>

      <div className="dashboard-content">
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">👥</div>
            <div className="stat-label">Total Users</div>
            <div className="stat-value">{stats.totalUsers}</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">🛍️</div>
            <div className="stat-label">Customers</div>
            <div className="stat-value">{stats.customers}</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">👔</div>
            <div className="stat-label">Staff Members</div>
            <div className="stat-value">{stats.staff}</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">🔐</div>
            <div className="stat-label">Administrators</div>
            <div className="stat-value">{stats.admins}</div>
          </div>
        </div>

        <div className="content-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2>👥 All Users</h2>
            <button 
              className="submit-btn" 
              style={{ padding: '10px 20px', fontSize: '14px' }}
              onClick={fetchAllUsers}
            >
              🔄 Refresh
            </button>
          </div>

          {loading ? (
            <div className="loading">
              <p>Loading users...</p>
            </div>
          ) : error ? (
            <div className="error-message">
              {error}
            </div>
          ) : users.length > 0 ? (
            <table className="users-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Username</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id}>
                    <td>#{u.id}</td>
                    <td>
                      {u.username}
                      {u.id === user.id && (
                        <span style={{ 
                          marginLeft: '8px', 
                          fontSize: '11px', 
                          background: '#4caf50', 
                          color: 'white', 
                          padding: '2px 6px', 
                          borderRadius: '4px' 
                        }}>
                          YOU
                        </span>
                      )}
                    </td>
                    <td>
                      <span className={`role-badge ${u.role.toLowerCase()}`}>
                        {u.role}
                      </span>
                    </td>
                    <td>
                      <span style={{ color: '#4caf50', fontWeight: 'bold' }}>Active</span>
                    </td>
                    <td>
                      {u.id !== user.id && (
                        <button 
                          className="logout-btn"
                          style={{ padding: '6px 12px', fontSize: '12px' }}
                          onClick={() => handleDeleteUser(u.id, u.username)}
                        >
                          Delete
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="empty-state">
              <div className="empty-state-icon">👥</div>
              <p>No users found</p>
            </div>
          )}
        </div>

        <div className="content-card">
          <h2>📊 System Overview</h2>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
            gap: '20px', 
            marginTop: '20px' 
          }}>
            <div style={{ padding: '20px', background: '#f9f9f9', borderRadius: '10px' }}>
              <div style={{ fontSize: '32px', marginBottom: '10px' }}>💰</div>
              <div style={{ color: '#666', fontSize: '14px', marginBottom: '5px' }}>Today's Revenue</div>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#333' }}>$0.00</div>
            </div>
            <div style={{ padding: '20px', background: '#f9f9f9', borderRadius: '10px' }}>
              <div style={{ fontSize: '32px', marginBottom: '10px' }}>📦</div>
              <div style={{ color: '#666', fontSize: '14px', marginBottom: '5px' }}>Total Orders</div>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#333' }}>0</div>
            </div>
            <div style={{ padding: '20px', background: '#f9f9f9', borderRadius: '10px' }}>
              <div style={{ fontSize: '32px', marginBottom: '10px' }}>⭐</div>
              <div style={{ color: '#666', fontSize: '14px', marginBottom: '5px' }}>Avg Rating</div>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#333' }}>N/A</div>
            </div>
            <div style={{ padding: '20px', background: '#f9f9f9', borderRadius: '10px' }}>
              <div style={{ fontSize: '32px', marginBottom: '10px' }}>☕</div>
              <div style={{ color: '#666', fontSize: '14px', marginBottom: '5px' }}>Menu Items</div>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#333' }}>6</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}