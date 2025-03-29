import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    fetchUsers(page);
  }, [page]);

  useEffect(() => {
    if (location.state?.updatedUser) {
      const { updatedUser, userId } = location.state;

      // Merge the updated user into the existing list
      setUsers((prevUsers) => {
        return prevUsers.map((user) =>
          user.id === userId ? { ...user, ...updatedUser } : user
        );
      });

      setFilteredUsers((prevUsers) => {
        return prevUsers.map((user) =>
          user.id === userId ? { ...user, ...updatedUser } : user
        );
      });

      // Clear location state after updating
      navigate("/users", { replace: true, state: null });
    }
  }, [location.state, navigate]);

  const fetchUsers = async (page) => {
    try {
      const response = await axios.get(`https://reqres.in/api/users?page=${page}`);
      const newUsers = response.data.data;

      // Preserve updates while fetching fresh data
      setUsers((prevUsers) => {
        const updatedUsers = prevUsers.map((prevUser) => {
          const newUser = newUsers.find((user) => user.id === prevUser.id);
          return newUser ? { ...newUser, ...prevUser } : prevUser;
        });

        return updatedUsers.length > 0 ? updatedUsers : newUsers;
      });

      setFilteredUsers(newUsers);
      setTotalPages(response.data.total_pages);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);
    setFilteredUsers(
      users.filter((user) =>
        `${user.first_name} ${user.last_name}`.toLowerCase().includes(value)
      )
    );
  };

  const handleEdit = (user) => {
    navigate(`/edituser/${user.id}`, { state: { user } });
  };

  const handleDelete = (id) => {
    setFilteredUsers(filteredUsers.filter((user) => user.id !== id));
  };

  return (
    <div className="container">
      <h2>User List</h2>
      <input
        type="text"
        placeholder="Search by name..."
        value={searchTerm}
        onChange={handleSearch}
        style={{ marginBottom: "10px", padding: "5px" }}
      />
      <table border="1">
        <thead>
          <tr>
            <th>Avatar</th>
            <th>Name</th>
            <th>Email</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map((user) => (
            <tr key={user.id}>
              <td><img src={user.avatar} alt="Avatar" width="50" /></td>
              <td>{user.first_name} {user.last_name}</td>
              <td>{user.email}</td>
              <td>
                <button onClick={() => handleEdit(user)} style={{ marginRight: "5px" }}>
                  Edit
                </button>
                <button onClick={() => handleDelete(user.id)} style={{ backgroundColor: "red", color: "white" }}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div>
        <button onClick={() => setPage(page - 1)} disabled={page === 1}>
          Previous
        </button>
        <span> Page {page} of {totalPages} </span>
        <button onClick={() => setPage(page + 1)} disabled={page === totalPages}>
          Next
        </button>
      </div>
    </div>
  );
};

export default UserList;
