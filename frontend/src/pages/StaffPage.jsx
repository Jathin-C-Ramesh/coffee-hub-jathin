import { useState, useEffect } from "react";

export default function StaffPage({ user, onLogout }) {
  const [orders, setOrders] = useState([]);
  const [todayStats, setTodayStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    inPreparation: 0,
    readyToServe: 0,
    completedOrders: 0,
    revenue: 0
  });
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 5000); // Auto-refresh every 5 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/orders/all");
      const data = await response.json();
      setOrders(data);
      calculateStats(data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  const calculateStats = (ordersData) => {
    const pending = ordersData.filter(o => o.status === "PENDING").length;
    const inPrep = ordersData.filter(o => o.status === "IN_PREPARATION").length;
    const ready = ordersData.filter(o => o.status === "READY_TO_SERVE").length;
    const completed = ordersData.filter(o => o.status === "COMPLETED").length;
    const totalRevenue = ordersData
      .filter(o => o.status === "COMPLETED")
      .reduce((sum, o) => sum + o.totalPrice, 0);

    setTodayStats({
      totalOrders: ordersData.length,
      pendingOrders: pending,
      inPreparation: inPrep,
      readyToServe: ready,
      completedOrders: completed,
      revenue: totalRevenue
    });
  };

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      const response = await fetch(`http://localhost:8080/api/orders/${orderId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus })
      });

      if (response.ok) {
        fetchOrders();
      } else {
        alert("Failed to update order status");
      }
    } catch (error) {
      console.error("Error updating order status:", error);
      alert("Error updating order status");
    }
  };

  const handleCancelOrder = async (orderId) => {
    if (window.confirm("Are you sure you want to cancel this order?")) {
      await handleUpdateStatus(orderId, "CANCELLED");
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "PENDING": return "#ff9800";
      case "IN_PREPARATION": return "#2196f3";
      case "READY_TO_SERVE": return "#4caf50";
      case "COMPLETED": return "#9e9e9e";
      case "CANCELLED": return "#f44336";
      default: return "#666";
    }
  };

  const getNextStatus = (currentStatus) => {
    const statusFlow = {
      "PENDING": "IN_PREPARATION",
      "IN_PREPARATION": "READY_TO_SERVE",
      "READY_TO_SERVE": "COMPLETED"
    };
    return statusFlow[currentStatus];
  };

  const getNextStatusLabel = (currentStatus) => {
    const labels = {
      "PENDING": "Start Preparing",
      "IN_PREPARATION": "Mark Ready",
      "READY_TO_SERVE": "Complete"
    };
    return labels[currentStatus];
  };

  const filteredOrders = orders.filter(order => {
    if (filter === "all") return true;
    if (filter === "active") return ["PENDING", "IN_PREPARATION", "READY_TO_SERVE"].includes(order.status);
    return order.status === filter.toUpperCase();
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
            <div className="stat-label">Total Orders</div>
            <div className="stat-value">{todayStats.totalOrders}</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">⏳</div>
            <div className="stat-label">Pending</div>
            <div className="stat-value">{todayStats.pendingOrders}</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">🔥</div>
            <div className="stat-label">In Preparation</div>
            <div className="stat-value">{todayStats.inPreparation}</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">✅</div>
            <div className="stat-label">Ready to Serve</div>
            <div className="stat-value">{todayStats.readyToServe}</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">✓</div>
            <div className="stat-label">Completed</div>
            <div className="stat-value">{todayStats.completedOrders}</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">💰</div>
            <div className="stat-label">Revenue</div>
            <div className="stat-value">${todayStats.revenue.toFixed(2)}</div>
          </div>
        </div>

        {/* Orders Management */}
        <div className="content-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
            <h2>📋 Order Management</h2>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <button
                className={`toggle-btn ${filter === 'all' ? 'active' : ''}`}
                onClick={() => setFilter('all')}
              >
                All
              </button>
              <button
                className={`toggle-btn ${filter === 'active' ? 'active' : ''}`}
                onClick={() => setFilter('active')}
              >
                Active
              </button>
              <button
                className={`toggle-btn ${filter === 'pending' ? 'active' : ''}`}
                onClick={() => setFilter('pending')}
              >
                Pending
              </button>
              <button
                className={`toggle-btn ${filter === 'in_preparation' ? 'active' : ''}`}
                onClick={() => setFilter('in_preparation')}
              >
                In Preparation
              </button>
              <button
                className={`toggle-btn ${filter === 'ready_to_serve' ? 'active' : ''}`}
                onClick={() => setFilter('ready_to_serve')}
              >
                Ready
              </button>
              <button
                className={`toggle-btn ${filter === 'completed' ? 'active' : ''}`}
                onClick={() => setFilter('completed')}
              >
                Completed
              </button>
            </div>
          </div>

          {filteredOrders.length > 0 ? (
            <div style={{ overflowX: 'auto' }}>
              <table className="users-table">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>Table</th>
                    <th>Items</th>
                    <th>Total</th>
                    <th>Time</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map((order) => (
                    <tr key={order.id}>
                      <td><strong>#{order.id}</strong></td>
                      <td>{order.user.username}</td>
                      <td>Table {order.tableNumber}</td>
                      <td>
                        <div style={{ fontSize: '12px' }}>
                          {order.orderItems.map((item, idx) => (
                            <div key={idx}>
                              {item.quantity}x {item.menuItem.name}
                            </div>
                          ))}
                        </div>
                      </td>
                      <td>${order.totalPrice.toFixed(2)}</td>
                      <td style={{ fontSize: '12px' }}>
                        {new Date(order.orderTime).toLocaleTimeString()}
                      </td>
                      <td>
                        <span style={{
                          padding: '5px 10px',
                          borderRadius: '5px',
                          fontSize: '12px',
                          fontWeight: 'bold',
                          color: 'white',
                          background: getStatusColor(order.status),
                          whiteSpace: 'nowrap'
                        }}>
                          {order.status.replace('_', ' ')}
                        </span>
                      </td>
                      <td>
                        {order.status !== 'COMPLETED' && order.status !== 'CANCELLED' ? (
                          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                            {getNextStatus(order.status) && (
                              <button
                                className="order-btn"
                                style={{ padding: '6px 12px', fontSize: '12px', whiteSpace: 'nowrap' }}
                                onClick={() => handleUpdateStatus(order.id, getNextStatus(order.status))}
                              >
                                {getNextStatusLabel(order.status)}
                              </button>
                            )}
                            <button
                              className="logout-btn"
                              style={{ padding: '6px 12px', fontSize: '12px' }}
                              onClick={() => handleCancelOrder(order.id)}
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <span style={{
                            color: order.status === 'COMPLETED' ? '#4caf50' : '#f44336',
                            fontWeight: 'bold',
                            fontSize: '12px'
                          }}>
                            {order.status === 'COMPLETED' ? 'Done ✓' : 'Cancelled ✕'}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-state-icon">📭</div>
              <p>No {filter !== 'all' ? filter.replace('_', ' ') : ''} orders at the moment</p>
            </div>
          )}
        </div>

        {/* Order Status Legend */}
        <div className="content-card">
          <h2>📌 Order Status Flow</h2>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '20px',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            borderRadius: '10px',
            color: 'white',
            flexWrap: 'wrap',
            gap: '10px'
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '24px', marginBottom: '5px' }}>⏳</div>
              <div style={{ fontSize: '14px', fontWeight: 'bold' }}>PENDING</div>
              <div style={{ fontSize: '12px', opacity: 0.8 }}>New order received</div>
            </div>
            <div style={{ fontSize: '24px' }}>→</div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '24px', marginBottom: '5px' }}>🔥</div>
              <div style={{ fontSize: '14px', fontWeight: 'bold' }}>IN PREPARATION</div>
              <div style={{ fontSize: '12px', opacity: 0.8 }}>Being prepared</div>
            </div>
            <div style={{ fontSize: '24px' }}>→</div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '24px', marginBottom: '5px' }}>✅</div>
              <div style={{ fontSize: '14px', fontWeight: 'bold' }}>READY TO SERVE</div>
              <div style={{ fontSize: '12px', opacity: 0.8 }}>Ready for delivery</div>
            </div>
            <div style={{ fontSize: '24px' }}>→</div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '24px', marginBottom: '5px' }}>✓</div>
              <div style={{ fontSize: '14px', fontWeight: 'bold' }}>COMPLETED</div>
              <div style={{ fontSize: '12px', opacity: 0.8 }}>Order delivered</div>
            </div>
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
        </div>
      </div>
    </div>
  );
}