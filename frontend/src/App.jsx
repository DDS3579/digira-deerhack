import "./App.css";
import { Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "@/components/auth/Login.jsx";
import RegisterUser from "@/components/auth/RegisterUser.jsx";
import RegisterAdmin from "@/components/auth/RegisterAdmin.jsx";
import { BrowserRouter } from "react-router-dom";

function RoleRedirect() {}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registerUser" element={<RegisterUser />} />
        <Route path="/registerAdmin" element={<RegisterAdmin />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
