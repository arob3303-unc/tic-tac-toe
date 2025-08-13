import React, { useState } from "react";
import "./LoginModal.css";

export default function LoginModal({ onLogin }) {
    const [isCreating, setIsCreating] = useState(false);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirm, setConfirm] = useState("");

    const handleSubmit = async () => {
        if (isCreating && password !== confirm) {
            alert("Passwords do not match!");
            return;
        }

        const url = isCreating ? "http://localhost:5000/register" : "http://localhost:5000/login";
        const res = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password }),
        });
        const data = await res.json();
        if (data.success) {
            onLogin(data.username);
        } else {
            alert(data.message || "Login/Register failed")
        }
    };

    return (
    <div className="modal">
      <div className="modal-box">
        <h2>{isCreating ? "Create Account" : "Login"}</h2>
        <input
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {isCreating && (
          <input
            placeholder="Confirm Password"
            type="password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
          />
        )}
        <button onClick={handleSubmit}>
          {isCreating ? "Create Account" : "Login"}
        </button>
        <p onClick={() => setIsCreating(!isCreating)}>
          {isCreating ? "Have an account? Login" : "Create Account"}
        </p>
      </div>
    </div>
  );
}