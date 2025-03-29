import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Check for token on component mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
    }
  }, [navigate]);

  // Fetch users when page changes
  useEffect(() => {
    fetchUsers(page);
  }, [page]);

  const fetchUsers = async (pageNum) => {
    try {
      const response = await axios.get(`https://reqres.in/api/users?page=${pageNum}`);
      const apiUsers = response.data.data;

      // Merge with locally stored updates
      const storedUpdates = JSON.parse(localStorage.getItem("userUpdates")) || {};
      const mergedUsers = apiUsers.map((user) => {
        return storedUpdates[user.id] ? { ...user, ...storedUpdates[user.id] } : user;
      });

      setUsers(mergedUsers);
      setFilteredUsers(mergedUsers);
      setTotalPages(response.data.total_pages);
      setError("");
    } catch (err) {
      setError("Failed to fetch users. Please try again.");
      console.error("Error fetching users:", err);
    }
  };

  // Handle search
  useEffect(() => {
    if (searchTerm) {
      const filtered = users.filter((user) =>
        `${user.first_name} ${user.last_name}`.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredUsers(filtered);
    } else {
      setFilteredUsers(users);
    }
  }, [searchTerm, users]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleEdit = (user) => {
    navigate(`/edituser/${user.id}`, { state: { user } });
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`https://reqres.in/api/users/${id}`);
      // Update UI after successful deletion
      setUsers(users.filter((user) => user.id !== id));
      setFilteredUsers(filteredUsers.filter((user) => user.id !== id));

      // Remove the deleted user from localStorage
      const storedUpdates = JSON.parse(localStorage.getItem("userUpdates")) || {};
      delete storedUpdates[id];
      localStorage.setItem("userUpdates", JSON.stringify(storedUpdates));
    } catch (err) {
      setError("Failed to delete user. Please try again.");
      console.error("Error deleting user:", err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userUpdates"); // Clear user updates on logout
    navigate("/");
  };

  return (
    <div style={{ maxWidth: "800px", margin: "20px auto", padding: "20px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <h2>User List</h2>
        <button
          onClick={handleLogout}
          style={{
            padding: "8px 16px",
            backgroundColor: "#dc3545",
            color: "white",
            border: "none",
            cursor: "pointer",
          }}
        >
          Logout
        </button>
      </div>
      {error && <p style={{ color: "red", marginBottom: "10px" }}>{error}</p>}
      <input
        type="text"
        placeholder="Search by name..."
        value={searchTerm}
        onChange={handleSearch}
        style={{ width: "100%", padding: "10px", marginBottom: "20px", fontSize: "16px" }}
      />
      {filteredUsers.length === 0 ? (
        <p>No users found.</p>
      ) : (
        <>
          <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "20px" }}>
            <thead>
              <tr style={{ backgroundColor: "#f1f1f1" }}>
                <th style={{ padding: "10px", border: "1px solid #ddd" }}>Avatar</th>
                <th style={{ padding: "10px", border: "1px solid #ddd" }}>Name</th>
                <th style={{ padding: "10px", border: "1px solid #ddd" }}>Email</th>
                <th style={{ padding: "10px", border: "1px solid #ddd" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id}>
                  <td style={{ padding: "10px", border: "1px solid #ddd", textAlign: "center" }}>
                    <img src={user.avatar} alt="Avatar" width="50" style={{ borderRadius: "50%" }} />
                  </td>
                  <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                    {user.first_name} {user.last_name}
                  </td>
                  <td style={{ padding: "10px", border: "1px solid #ddd" }}>{user.email}</td>
                  <td style={{ padding: "10px", border: "1px solid #ddd", textAlign: "center" }}>
                    <button
                      onClick={() => handleEdit(user)}
                      style={{
                        padding: "5px 10px",
                        marginRight: "5px",
                        backgroundColor: "#007bff",
                        color: "white",
                        border: "none",
                        cursor: "pointer",
                      }}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(user.id)}
                      style={{
                        padding: "5px 10px",
                        backgroundColor: "#dc3545",
                        color: "white",
                        border: "none",
                        cursor: "pointer",
                      }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div style={{ textAlign: "center" }}>
            <button
              onClick={() => setPage(page - 1)}
              disabled={page === 1}
              style={{
                padding: "8px 16px",
                marginRight: "10px",
                backgroundColor: page === 1 ? "#ccc" : "#007bff",
                color: "white",
                border: "none",
                cursor: page === 1 ? "not-allowed" : "pointer",
              }}
            >
              Previous
            </button>
            <span style={{ margin: "0 10px" }}>
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage(page + 1)}
              disabled={page === totalPages}
              style={{
                padding: "8px 16px",
                backgroundColor: page === totalPages ? "#ccc" : "#007bff",
                color: "white",
                border: "none",
                cursor: page === totalPages ? "not-allowed" : "pointer",
              }}
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default UserList;