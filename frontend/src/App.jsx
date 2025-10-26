import { useState } from "react";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import CustomerPage from "./pages/CustomerPage.jsx";
import StaffPage from "./pages/StaffPage.jsx";
import AdminPage from "./pages/AdminPage.jsx";
import "./App.css";

export default function App() {
  const [isLogin, setIsLogin] = useState(true);
  const [user, setUser] = useState(null);

  const handleLogout = () => {
    setUser(null);
    setIsLogin(true);
  };

  if (user) {
    switch (user.role) {
      case "CUSTOMER":
        return <CustomerPage user={user} onLogout={handleLogout} />;
      case "STAFF":
        return <StaffPage user={user} onLogout={handleLogout} />;
      case "ADMIN":
        return <AdminPage user={user} onLogout={handleLogout} />;
      default:
        return (
          <div className="error-container">
            <h2>Unknown Role</h2>
            <button onClick={handleLogout}>Back to Login</button>
          </div>
        );
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="coffee-icon">☕</div>
        <h1 className="brand-title">Coffee HUB</h1>
        <p className="brand-subtitle">Your favorite coffee management system</p>

        <div className="auth-toggle">
          <button
            className={`toggle-btn ${isLogin ? 'active' : ''}`}
            onClick={() => setIsLogin(true)}
          >
            Login
          </button>
          <button
            className={`toggle-btn ${!isLogin ? 'active' : ''}`}
            onClick={() => setIsLogin(false)}
          >
            Register
          </button>
        </div>

        <div className="auth-form-container">
          {isLogin ? <Login setUser={setUser} /> : <Register setUser={setUser} />}
        </div>
      </div>
    </div>
  );
}