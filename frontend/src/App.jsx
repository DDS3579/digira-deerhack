import "./App.css";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "@/components/auth/Login.jsx";
import RegisterUser from "@/components/auth/RegisterUser.jsx";
import RegisterAdmin from "@/components/auth/RegisterAdmin.jsx";
import { BrowserRouter } from "react-router-dom";
import AdminLayout from "./components/layout/AdminLayout";
import AdminDashboard from "./components/admin/AdminDashboard";
import ViewComplaints from "./components/admin/ViewComplaints";
import Samachar from "./components/admin/Samachar";
import Events from "./components/admin/Events";
import CreateEvent from "./components/admin/CreateEvent";
import HelpRequests from "./components/admin/HelpRequests";
import LostFound from "./components/admin/LostFound";
import Invitations from "./components/admin/Invitations";
import AdminProfile from "./components/admin/AdminProfile";
import UserLayout from "./components/layout/UserLayout";
import Dashboard from "./components/user/Dashboard";
import UserSamachar from "./components/user/UserSamachar";
import UserLostFound from "./components/user/UserLostFound";
import UserInvitation from "./components/user/UserInvitation";
import AddProblem from "./components/user/AddProblem";
import AskHelp from "./components/user/AskHelp";
import SendRequest from "./components/user/SendRequest";
import UserHelpRequests from "./components/user/UserHelpRequests";
import UserProfile from "./components/user/UserProfile";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registerUser" element={<RegisterUser />} />
        <Route path="/registerAdmin" element={<RegisterAdmin />} />
        
        {/* Admin Routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="complaints" element={<ViewComplaints />} />
          <Route path="samachar" element={<Samachar />} />
          <Route path="events" element={<Events />} />
          <Route path="events/create" element={<CreateEvent />} />
          <Route path="help-requests" element={<HelpRequests />} />
          <Route path="lost-found" element={<LostFound />} />
          <Route path="invitations" element={<Invitations />} />
          <Route path="profile" element={<AdminProfile />} />
        </Route>

        {/* User Routes */}
        <Route path="/user" element={<UserLayout />}>
          <Route index element={<Navigate to="/user/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="samachar" element={<UserSamachar />} />
          <Route path="lost-found" element={<UserLostFound />} />
          <Route path="invitation" element={<UserInvitation />} />
          <Route path="add-problem" element={<AddProblem />} />
          <Route path="ask-help" element={<AskHelp />} />
          <Route path="send-request" element={<SendRequest />} />
          <Route path="help-requests" element={<UserHelpRequests />} />
          <Route path="profile" element={<UserProfile />} />
        </Route>
        
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
