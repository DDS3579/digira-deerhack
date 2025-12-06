import "./App.css";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "@/components/auth/Login.jsx";
import RegisterUser from "@/components/auth/RegisterUser.jsx";
import RegisterAdmin from "@/components/auth/RegisterAdmin.jsx";
import { BrowserRouter } from "react-router-dom";
// import AdminLayout from "./components/layout/AdminLayout";
// import AdminDashboard from "./components/admin/AdminDashboard";
// import ViewComplaints from "./components/admin/ViewComplaints";
// import Samachar from "./components/admin/Samachar";
// import Events from "./components/admin/Events";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registerUser" element={<RegisterUser />} />
        <Route path="/registerAdmin" element={<RegisterAdmin />} />
        
        {/* Admin Routes */}
        {/* <Route path="/admin" element={<AdminLayout />}> */}
          {/* <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="complaints" element={<ViewComplaints />} />
          <Route path="samachar" element={<Samachar />} /> */}
          {/* <Route path="events" element={<Events />} /> */}
        {/* </Route> */}
        
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
