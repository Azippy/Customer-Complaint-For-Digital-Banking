import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/Layout";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import Notifications from "./pages/Notifications";

import UserDashboard from "./pages/user/Dashboard";
import UserComplaints from "./pages/user/Complaints";
import UserComplaintDetail from "./pages/user/ComplaintDetail";
import CreateComplaint from "./pages/user/CreateComplaint";

import AdminDashboard from "./pages/admin/Dashboard";
import AdminComplaints from "./pages/admin/Complaints";
import AdminComplaintDetail from "./pages/admin/ComplaintDetail";

import HandlerDashboard from "./pages/handler/Dashboard";
import HandlerComplaints from "./pages/handler/Complaints";
import HandlerComplaintDetail from "./pages/handler/ComplaintDetail";

function Dashboard() {
  const { user } = useAuth();
  if (user?.role === "ADMIN") return <AdminDashboard />;
  if (user?.role === "HANDLER") return <HandlerDashboard />;
  return <UserDashboard />;
}

function Complaints() {
  const { user } = useAuth();
  if (user?.role === "ADMIN") return <AdminComplaints />;
  if (user?.role === "HANDLER") return <HandlerComplaints />;
  return <UserComplaints />;
}

function ComplaintDetail() {
  const { user } = useAuth();
  if (user?.role === "ADMIN") return <AdminComplaintDetail />;
  if (user?.role === "HANDLER") return <HandlerComplaintDetail />;
  return <UserComplaintDetail />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route
        path="/*"
        element={
          <ProtectedRoute>
            <Layout>
              <Routes>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/complaints" element={<Complaints />} />
                <Route
                  path="/complaints/new"
                  element={
                    <ProtectedRoute roles={["USER"]}>
                      <CreateComplaint />
                    </ProtectedRoute>
                  }
                />
                <Route path="/complaints/:id" element={<ComplaintDetail />} />
                <Route path="/notifications" element={<Notifications />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="*" element={<Navigate to="/dashboard" replace />} />
              </Routes>
            </Layout>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}
