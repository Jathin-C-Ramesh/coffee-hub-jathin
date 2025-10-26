import { useState, useEffect } from "react";

export default function StaffPage({ user, onLogout }) {
  const [orders, setOrders] = useState([]);
  const [todayStats, setTodayStats] = useState({
    totalOrders: 0,
    completedOrders: 0,
    pendingOrders: 0,
    revenue: 0
  });
  const [filter, setFilter] = useState("all"); // all, pending, completed

  // Sample orders data (in a real app, this would come from API)
  useEffect(() => {
    const sampleOrders = [
      { id: 1, customer: "John Doe", item: "Cappuccino", price: 3.50, status: "Pending", time: "10:30 AM", table: 5 },
      { id: 2, customer: "Jane Smith", item: "Latte", price: 4.00, status: "Completed", time: "10:15 AM", table: 3 },
      { id: 3, customer: "Bob Wilson", item: "Espresso", price: 2.50, status: "Pending", time: "10:45 AM", table: 7 },
      { id: 4, customer: "Alice Brown", item: "Mocha", price: 4.50, status: "Pending", time: "11:00 AM", table: 2 },
      { id: 5, customer: "Charlie Davis", item: "Americano", price: 2.75, status: "Completed", time: "09:45 AM", table: 1 }
    ];

    setOrders(sampleOrders);

    const completed = sampleOrders.filter(o => o.status === "Completed").length;
    const pending = sampleOrders.filter(o => o.status === "Pending").length;
    const totalRevenue = sampleOrders
      .filter(o => o.status === "Completed")
      .reduce((sum, o) => sum + o.price, 0);

    setTodayStats({
      totalOrders: sampleOrders.length,
      completedOrders: completed,
      pendingOrders: pending,
      revenue: totalRevenue
    });
  }, []);

  const handleCompleteOrder = (orderId) => {
    const order = orders.find(o => o.id === orderId);
    if (order) {
      setOrders(orders.map(o =>
        o.id === orderId ? { ...o, status: "Completed" } : o
      ));
      setTodayStats(prev => ({
        ...prev,
        completedOrders: prev.completedOrders + 1,
        pendingOrders: prev.pendingOrders - 1,
        revenue: prev.revenue + order.price
      }));
    }
  };

  const handleCancelOrder = (orderId) => {
    if (window.confirm("Are you sure you want to cancel this order?")) {
      setOrders(orders.filter(o => o.id !== orderId));
      setTodayStats(prev => ({
        ...prev,
        totalOrders: prev.totalOrders - 1,
        pendingOrders: prev.pendingOrders - 1
      }));
    }
  };

  const filteredOrders = orders.filter(order => {
    if (filter === "all") return true;
    return order.status.toLowerCase() === filter;
  });

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="dashboard-title">
          <span style={{ fontSize: '28px' }}>☕</span>
          <div>
            <h1>Coffee HUB - Staff Portal</h1>
            <span className="role-badge staff">Staff</span>
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
        {/* Statistics Cards */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">📊</div>
            <div className="stat-label">Today's Orders</div>
            <div className="stat-value">{todayStats.totalOrders}</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">✅</div>
            <div className="stat-label">Completed</div>
            <div className="stat-value">{todayStats.completedOrders}</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">⏳</div>
            <div className="stat-label">Pending</div>
            <div className="stat-value">{todayStats.pendingOrders}</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">💰</div>
            <div className="stat-label">Revenue</div>
            <div className="stat-value">${todayStats.revenue.toFixed(2)}</div>
          </div>
        </div>

        {/* Orders Management */}
        <div className="content-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2>📋 Order Management</h2>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                className={`toggle-btn ${filter === 'all' ? 'active' : ''}`}
                onClick={() => setFilter('all')}
                style={{ padding: '8px 16px', fontSize: '14px' }}
              >
                All
              </button>
              <button
                className={`toggle-btn ${filter === 'pending' ? 'active' : ''}`}
                onClick={() => setFilter('pending')}
                style={{ padding: '8px 16px', fontSize: '14px' }}
              >
                Pending
              </button>
              <button
                className={`toggle-btn ${filter === 'completed' ? 'active' : ''}`}
                onClick={() => setFilter('completed')}
                style={{ padding: '8px 16px', fontSize: '14px' }}
              >
                Completed
              </button>
            </div>
          </div>

          {filteredOrders.length > 0 ? (
            <table className="users-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Item</th>
                  <th>Price</th>
                  <th>Table</th>
                  <th>Time</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => (
                  <tr key={order.id}>
                    <td><strong>#{order.id}</strong></td>
                    <td>{order.customer}</td>
                    <td>{order.item}</td>
                    <td>${order.price.toFixed(2)}</td>
                    <td>Table {order.table}</td>
                    <td>{order.time}</td>
                    <td>
                      <span className={`role-badge ${order.status === 'Completed' ? 'customer' : 'staff'}`}>
                        {order.status}
                      </span>
                    </td>
                    <td>
                      {order.status === 'Pending' ? (
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button
                            className="order-btn"
                            style={{ padding: '6px 12px', fontSize: '12px' }}
                            onClick={() => handleCompleteOrder(order.id)}
                          >
                            ✓ Complete
                          </button>
                          <button
                            className="logout-btn"
                            style={{ padding: '6px 12px', fontSize: '12px' }}
                            onClick={() => handleCancelOrder(order.id)}
                          >
                            ✕ Cancel
                          </button>
                        </div>
                      ) : (
                        <span style={{ color: '#4caf50', fontWeight: 'bold' }}>Done</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="empty-state">
              <div className="empty-state-icon">📭</div>
              <p>No {filter !== 'all' ? filter : ''} orders at the moment</p>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="content-card">
          <h2>⚡ Quick Actions</h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '15px',
            marginTop: '20px'
          }}>
            <button className="submit-btn" style={{ padding: '15px' }}>
              📞 Call Manager
            </button>
            <button className="submit-btn" style={{ padding: '15px' }}>
              📋 View Menu
            </button>
            <button className="submit-btn" style={{ padding: '15px' }}>
              📊 Sales Report
            </button>
            <button className="submit-btn" style={{ padding: '15px' }}>
              ⚙️ Settings
            </button>
          </div>
        </div>

        {/* Staff Profile */}
        <div className="content-card">
          <h2>👤 My Profile</h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '20px',
            marginTop: '20px'
          }}>
            <div style={{ padding: '20px', background: '#f9f9f9', borderRadius: '10px' }}>
              <div style={{ fontSize: '32px', marginBottom: '10px' }}>👨‍💼</div>
              <p style={{ marginBottom: '10px', color: '#666', fontSize: '14px' }}>Username</p>
              <p style={{ fontSize: '18px', fontWeight: 'bold', color: '#333' }}>{user.username}</p>
            </div>
            <div style={{ padding: '20px', background: '#f9f9f9', borderRadius: '10px' }}>
              <div style={{ fontSize: '32px', marginBottom: '10px' }}>🎭</div>
              <p style={{ marginBottom: '10px', color: '#666', fontSize: '14px' }}>Role</p>
              <p style={{ fontSize: '18px', fontWeight: 'bold', color: '#333' }}>{user.role}</p>
            </div>
            <div style={{ padding: '20px', background: '#f9f9f9', borderRadius: '10px' }}>
              <div style={{ fontSize: '32px', marginBottom: '10px' }}>✅</div>
              <p style={{ marginBottom: '10px', color: '#666', fontSize: '14px' }}>Status</p>
              <p style={{ fontSize: '18px', fontWeight: 'bold', color: '#4caf50' }}>Active</p>
            </div>
            <div style={{ padding: '20px', background: '#f9f9f9', borderRadius: '10px' }}>
              <div style={{ fontSize: '32px', marginBottom: '10px' }}>⏰</div>
              <p style={{ marginBottom: '10px', color: '#666', fontSize: '14px' }}>Shift</p>
              <p style={{ fontSize: '18px', fontWeight: 'bold', color: '#333' }}>Morning</p>
            </div>
          </div>
          <div style={{
            marginTop: '20px',
            padding: '20px',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            borderRadius: '10px',
            color: 'white'
          }}>
            <p style={{ fontSize: '14px', marginBottom: '8px', opacity: 0.9 }}>Shift Hours</p>
            <p style={{ fontSize: '20px', fontWeight: 'bold' }}>8:00 AM - 4:00 PM</p>
            <p style={{ fontSize: '12px', marginTop: '10px', opacity: 0.8 }}>
              You have access to order management and your personal profile only
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}