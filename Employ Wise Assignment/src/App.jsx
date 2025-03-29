import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/login";
import UserList from "./components/userlist";
import EditUser from "./components/edituser";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/users" element={<UserList />} />
        <Route path="/edituser/:id" element={<EditUser />} />
        <Route path="*" element={<h2 style={{ textAlign: "center", marginTop: "50px" }}>404 - Page Not Found</h2>} />
      </Routes>
    </Router>
  );
}

export default App;