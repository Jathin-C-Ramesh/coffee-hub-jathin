import { useState } from "react";

export default function CustomerPage({ user, onLogout }) {
  const [selectedItem, setSelectedItem] = useState(null);

  // Sample coffee menu
  const coffeeMenu = [
    { id: 1, name: "Espresso", price: 2.50, emoji: "☕" },
    { id: 2, name: "Cappuccino", price: 3.50, emoji: "☕" },
    { id: 3, name: "Latte", price: 4.00, emoji: "🥛" },
    { id: 4, name: "Americano", price: 2.75, emoji: "☕" },
    { id: 5, name: "Mocha", price: 4.50, emoji: "🍫" },
    { id: 6, name: "Cold Brew", price: 3.75, emoji: "🧊" }
  ];

  const handleOrder = (item) => {
    setSelectedItem(item);
    alert(`Order placed for ${item.name}! Total: $${item.price}`);
  };

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="dashboard-title">
          <span style={{ fontSize: '28px' }}>☕</span>
          <div>
            <h1>Coffee HUB</h1>
            <span className="role-badge customer">Customer</span>
          </div>
        </div>
        <div className="user-info">
          <div>
            <div className="welcome-text">Welcome back,</div>
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
            <div className="stat-icon">📦</div>
            <div className="stat-label">My Orders</div>
            <div className="stat-value">0</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">⭐</div>
            <div className="stat-label">Loyalty Points</div>
            <div className="stat-value">0</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">💰</div>
            <div className="stat-label">Total Spent</div>
            <div className="stat-value">$0.00</div>
          </div>
        </div>

        <div className="content-card">
          <h2>☕ Our Coffee Menu</h2>
          <p style={{ color: '#666', marginBottom: '20px' }}>
            Browse our selection of premium coffees
          </p>

          <div className="menu-grid">
            {coffeeMenu.map((item) => (
              <div key={item.id} className="menu-item">
                <div className="menu-item-image">
                  {item.emoji}
                </div>
                <div className="menu-item-content">
                  <div className="menu-item-name">{item.name}</div>
                  <div className="menu-item-price">${item.price.toFixed(2)}</div>
                  <button 
                    className="order-btn"
                    onClick={() => handleOrder(item)}
                  >
                    Order Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="content-card">
          <h2>📋 Recent Orders</h2>
          <div className="empty-state">
            <div className="empty-state-icon">📭</div>
            <p>No orders yet. Start ordering from our menu above!</p>
          </div>
        </div>
      </div>
    </div>
  );
}