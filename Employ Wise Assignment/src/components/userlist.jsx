import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
    }
  }, [navigate]);


  useEffect(() => {
    fetchUsers(page);
  }, [page]);

  const fetchUsers = async (pageNum) => {
    try {
      const response = await axios.get(`https://reqres.in/api/users?page=${pageNum}`);
      const apiUsers = response.data.data;

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
      setUsers(users.filter((user) => user.id !== id));
      setFilteredUsers(filteredUsers.filter((user) => user.id !== id));
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
    localStorage.removeItem("userUpdates"); 
    navigate("/");
  };

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>User List</h2>
        <button
          onClick={handleLogout}
          className="btn btn-danger"
        >
          Logout
        </button>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}
      
      <div className="mb-4">
        <input
          type="text"
          className="form-control"
          placeholder="Search by name..."
          value={searchTerm}
          onChange={handleSearch}
        />
      </div>

      {filteredUsers.length === 0 ? (
        <p className="text-center">No users found.</p>
      ) : (
        <>
          <div className="table-responsive mb-4">
            <table className="table table-bordered table-hover">
              <thead className="table-light">
                <tr>
                  <th className="text-center">Avatar</th>
                  <th>First Name</th>
                  <th>Last Name</th>
                  <th>Email</th>
                  <th className="text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id}>
                    <td className="text-center">
                      <img src={user.avatar} alt="Avatar" width="50" className="rounded-circle" />
                    </td>
                    <td>
                      {user.first_name}
                    </td>
                    <td>
                       {user.last_name}
                    </td>
                    <td>{user.email}</td>
                    <td className="text-center">
                      <button
                        onClick={() => handleEdit(user)}
                        className="btn btn-primary btn-sm me-2"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(user.id)}
                        className="btn btn-danger btn-sm"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="d-flex justify-content-center align-items-center">
            <button
              onClick={() => setPage(page - 1)}
              disabled={page === 1}
              className={`btn ${page === 1 ? 'btn-secondary' : 'btn-primary'} me-2`}
            >
              Previous
            </button>
            <span className="mx-3">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage(page + 1)}
              disabled={page === totalPages}
              className={`btn ${page === totalPages ? 'btn-secondary' : 'btn-primary'} ms-2`}
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