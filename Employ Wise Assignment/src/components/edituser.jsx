import React, { useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const EditUser = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams();
  const user = location.state?.user || {};

  const [formData, setFormData] = useState({
    first_name: user.first_name || "",
    last_name: user.last_name || "",
    email: user.email || "",
  });
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    // Form validation
    if (!formData.first_name || !formData.last_name || !formData.email) {
      setError("Please fill in all fields.");
      return;
    }

    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setError("Please enter a valid email address.");
      return;
    }

    try {
      await axios.put(`https://reqres.in/api/users/${id}`, formData);
      setMessage("User updated successfully!");

      // Store the updated user in localStorage
      const updatedUser = { id: Number(id), ...formData };
      const storedUpdates = JSON.parse(localStorage.getItem("userUpdates")) || {};
      storedUpdates[id] = updatedUser;
      localStorage.setItem("userUpdates", JSON.stringify(storedUpdates));

      setTimeout(() => {
        navigate("/users");
      }, 1000);
    } catch (err) {
      setError("Failed to update user. Please try again.");
      console.error("Error updating user:", err);
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "50px auto", textAlign: "center" }}>
      <h2>Edit User</h2>
      {message && <p style={{ color: "green", marginBottom: "10px" }}>{message}</p>}
      {error && <p style={{ color: "red", marginBottom: "10px" }}>{error}</p>}
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
        <input
          type="text"
          name="first_name"
          placeholder="First Name"
          value={formData.first_name}
          onChange={handleChange}
          required
          style={{ padding: "10px", fontSize: "16px" }}
        />
        <input
          type="text"
          name="last_name"
          placeholder="Last Name"
          value={formData.last_name}
          onChange={handleChange}
          required
          style={{ padding: "10px", fontSize: "16px" }}
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
          style={{ padding: "10px", fontSize: "16px" }}
        />
        <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
          <button
            type="submit"
            style={{
              padding: "10px 20px",
              backgroundColor: "#007bff",
              color: "white",
              border: "none",
              cursor: "pointer",
            }}
          >
            Save Changes
          </button>
          <button
            type="button"
            onClick={() => navigate("/users")}
            style={{
              padding: "10px 20px",
              backgroundColor: "#6c757d",
              color: "white",
              border: "none",
              cursor: "pointer",
            }}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditUser;