import { useState, useEffect } from "react";

export default function CustomerPage({ user, onLogout }) {
  const [menuItems, setMenuItems] = useState([]);
  const [cart, setCart] = useState([]);
  const [myOrders, setMyOrders] = useState([]);
  const [tableNumber, setTableNumber] = useState("");
  const [specialInstructions, setSpecialInstructions] = useState("");
  const [showCart, setShowCart] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All");

  useEffect(() => {
    fetchMenuItems();
    fetchMyOrders();
  }, []);

  const fetchMenuItems = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/menu/available");
      const data = await response.json();
      setMenuItems(data);
    } catch (error) {
      console.error("Error fetching menu items:", error);
    }
  };

  const fetchMyOrders = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/orders/user/${user.id}`);
      const data = await response.json();
      setMyOrders(data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  const addToCart = (item) => {
    const existingItem = cart.find(cartItem => cartItem.id === item.id);
    if (existingItem) {
      setCart(cart.map(cartItem =>
        cartItem.id === item.id
          ? { ...cartItem, quantity: cartItem.quantity + 1 }
          : cartItem
      ));
    } else {
      setCart([...cart, { ...item, quantity: 1 }]);
    }
  };

  const removeFromCart = (itemId) => {
    setCart(cart.filter(item => item.id !== itemId));
  };

  const updateQuantity = (itemId, newQuantity) => {
    if (newQuantity === 0) {
      removeFromCart(itemId);
    } else {
      setCart(cart.map(item =>
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      ));
    }
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2);
  };

  const handlePlaceOrder = async () => {
    if (!tableNumber) {
      alert("Please select a table number");
      return;
    }

    if (cart.length === 0) {
      alert("Your cart is empty");
      return;
    }

    const orderData = {
      tableNumber: parseInt(tableNumber),
      specialInstructions: specialInstructions,
      orderItems: cart.map(item => ({
        menuItem: { id: item.id },
        quantity: item.quantity
      }))
    };

    try {
      const response = await fetch(`http://localhost:8080/api/orders/create?userId=${user.id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData)
      });

      if (response.ok) {
        alert("Order placed successfully!");
        setCart([]);
        setTableNumber("");
        setSpecialInstructions("");
        setShowCart(false);
        fetchMyOrders();
      } else {
        alert("Failed to place order");
      }
    } catch (error) {
      console.error("Error placing order:", error);
      alert("Error placing order");
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "PENDING": return "#ff9800";
      case "IN_PREPARATION": return "#2196f3";
      case "READY_TO_SERVE": return "#4caf50";
      case "COMPLETED": return "#9e9e9e";
      default: return "#666";
    }
  };

  const categories = ["All", ...new Set(menuItems.map(item => item.category))];
  const filteredItems = selectedCategory === "All"
    ? menuItems
    : menuItems.filter(item => item.category === selectedCategory);

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
          <button
            className="submit-btn"
            onClick={() => setShowCart(!showCart)}
            style={{ marginRight: '15px', position: 'relative' }}
          >
            🛒 Cart ({cart.length})
          </button>
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
        {/* Cart Sidebar */}
        {showCart && (
          <div style={{
            position: 'fixed',
            top: 0,
            right: 0,
            width: '400px',
            height: '100vh',
            background: 'white',
            boxShadow: '-2px 0 10px rgba(0,0,0,0.1)',
            zIndex: 1000,
            padding: '20px',
            overflowY: 'auto'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2>🛒 Your Cart</h2>
              <button onClick={() => setShowCart(false)} style={{ fontSize: '24px', border: 'none', background: 'none', cursor: 'pointer' }}>✕</button>
            </div>

            {cart.length === 0 ? (
              <div className="empty-state">
                <div className="empty-state-icon">🛒</div>
                <p>Your cart is empty</p>
              </div>
            ) : (
              <>
                {cart.map(item => (
                  <div key={item.id} style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '15px',
                    background: '#f9f9f9',
                    borderRadius: '8px',
                    marginBottom: '10px'
                  }}>
                    <div>
                      <div style={{ fontWeight: 'bold' }}>{item.name}</div>
                      <div style={{ color: '#666', fontSize: '14px' }}>${item.price.toFixed(2)}</div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="order-btn" style={{ padding: '5px 10px' }}>-</button>
                      <span>{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="order-btn" style={{ padding: '5px 10px' }}>+</button>
                      <button onClick={() => removeFromCart(item.id)} className="logout-btn" style={{ padding: '5px 10px' }}>✕</button>
                    </div>
                  </div>
                ))}

                <div style={{ marginTop: '20px', padding: '15px', background: '#f0f0f0', borderRadius: '8px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '18px', fontWeight: 'bold', marginBottom: '15px' }}>
                    <span>Total:</span>
                    <span>${getTotalPrice()}</span>
                  </div>

                  <input
                    type="number"
                    placeholder="Table Number (1-20)"
                    value={tableNumber}
                    onChange={(e) => setTableNumber(e.target.value)}
                    min="1"
                    max="20"
                    style={{
                      width: '100%',
                      padding: '10px',
                      marginBottom: '10px',
                      borderRadius: '5px',
                      border: '1px solid #ddd'
                    }}
                  />

                  <textarea
                    placeholder="Special instructions (optional)"
                    value={specialInstructions}
                    onChange={(e) => setSpecialInstructions(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px',
                      marginBottom: '15px',
                      borderRadius: '5px',
                      border: '1px solid #ddd',
                      minHeight: '60px'
                    }}
                  />

                  <button
                    onClick={handlePlaceOrder}
                    className="submit-btn"
                    style={{ width: '100%', padding: '12px' }}
                  >
                    Place Order
                  </button>
                </div>
              </>
            )}
          </div>
        )}

        {/* Stats */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">📦</div>
            <div className="stat-label">My Orders</div>
            <div className="stat-value">{myOrders.length}</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">⏳</div>
            <div className="stat-label">Pending</div>
            <div className="stat-value">{myOrders.filter(o => o.status === 'PENDING').length}</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">🛒</div>
            <div className="stat-label">Cart Items</div>
            <div className="stat-value">{cart.length}</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">💰</div>
            <div className="stat-label">Cart Total</div>
            <div className="stat-value">${getTotalPrice()}</div>
          </div>
        </div>

        {/* Menu */}
        <div className="content-card">
          <h2>🍽️ Our Menu</h2>
          <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' }}>
            {categories.map(category => (
              <button
                key={category}
                className={`toggle-btn ${selectedCategory === category ? 'active' : ''}`}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>

          <div className="menu-grid">
            {filteredItems.map((item) => (
              <div key={item.id} className="menu-item">
                <div className="menu-item-image">{item.emoji}</div>
                <div className="menu-item-content">
                  <div className="menu-item-name">{item.name}</div>
                  <div style={{ color: '#666', fontSize: '12px', marginBottom: '8px' }}>{item.description}</div>
                  <div className="menu-item-price">${item.price.toFixed(2)}</div>
                  <button className="order-btn" onClick={() => addToCart(item)}>
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Orders */}
        <div className="content-card">
          <h2>📋 My Orders</h2>
          {myOrders.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">📭</div>
              <p>No orders yet. Start ordering from our menu above!</p>
            </div>
          ) : (
            <table className="users-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Table</th>
                  <th>Items</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Time</th>
                </tr>
              </thead>
              <tbody>
                {myOrders.map((order) => (
                  <tr key={order.id}>
                    <td><strong>#{order.id}</strong></td>
                    <td>Table {order.tableNumber}</td>
                    <td>{order.orderItems.length} items</td>
                    <td>${order.totalPrice.toFixed(2)}</td>
                    <td>
                      <span style={{
                        padding: '5px 10px',
                        borderRadius: '5px',
                        fontSize: '12px',
                        fontWeight: 'bold',
                        color: 'white',
                        background: getStatusColor(order.status)
                      }}>
                        {order.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td>{new Date(order.orderTime).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}