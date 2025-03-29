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

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`https://reqres.in/api/users/${id}`, formData);
      setMessage("User updated successfully!");

      setTimeout(() => {
        navigate("/users", { state: { updatedUser: formData, userId: Number(id) } });
      }, 1000);
    } catch (error) {
      setMessage("Failed to update user.");
    }
  };

  return (
    <div className="container">
      <h2>Edit User</h2>
      {message && <p>{message}</p>}
      <form onSubmit={handleSubmit}>
        <input type="text" name="first_name" value={formData.first_name} onChange={handleChange} required />
        <input type="text" name="last_name" value={formData.last_name} onChange={handleChange} required />
        <input type="email" name="email" value={formData.email} onChange={handleChange} required />
        <button type="submit">Save Changes</button>
        <button type="button" onClick={() => navigate("/users")}>Cancel</button>
      </form>
    </div>
  );
};

export default EditUser;
