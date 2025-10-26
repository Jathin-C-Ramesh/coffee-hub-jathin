import { useState } from "react";
import axios from "axios";

export default function Login({ setUser }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    // Validation
    if (!username.trim() || !password.trim()) {
      setMessage("Please fill in all fields");
      setMessageType("error");
      setLoading(false);
      return;
    }

    try {
      // REMOVED the hardcoded role: "CUSTOMER" - let backend determine the role
      const res = await axios.post("http://localhost:8080/api/users/login", {
        username: username.trim(),
        password: password
      });

      console.log("Login response:", res.data); // Debug log to see what role is returned

      setMessage("Login successful!");
      setMessageType("success");

      // Set user after a brief delay to show success message
      setTimeout(() => {
        setUser(res.data);
      }, 500);

    } catch (err) {
      console.error("Login error:", err);
      const errorMessage = err.response?.data || err.message || "Login failed. Please check your credentials.";
      setMessage(errorMessage);
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="auth-form" onSubmit={handleLogin}>
      <div className="form-group">
        <label htmlFor="username">Username</label>
        <input
          id="username"
          type="text"
          placeholder="Enter your username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          disabled={loading}
          autoComplete="username"
        />
      </div>

      <div className="form-group">
        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={loading}
          autoComplete="current-password"
        />
      </div>

      <button
        type="submit"
        className="submit-btn"
        disabled={loading}
      >
        {loading ? "Logging in..." : "Login"}
      </button>

      {message && (
        <div className={`message ${messageType}`}>
          {message}
        </div>
      )}
    </form>
  );
}