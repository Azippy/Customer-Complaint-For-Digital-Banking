import { useState, useEffect } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  FileText,
  PlusCircle,
  Bell,
  User,
  LogOut,
  Menu,
  X,
  Shield,
  Wrench,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { notificationApi } from "../api/client";

const NAV_ITEMS = {
  USER: [
    { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { to: "/complaints", label: "My Complaints", icon: FileText },
    { to: "/complaints/new", label: "New Complaint", icon: PlusCircle },
    { to: "/notifications", label: "Notifications", icon: Bell },
    { to: "/profile", label: "Profile", icon: User },
  ],
  ADMIN: [
    { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { to: "/complaints", label: "All Complaints", icon: FileText },
    { to: "/notifications", label: "Notifications", icon: Bell },
    { to: "/profile", label: "Profile", icon: User },
  ],
  HANDLER: [
    { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { to: "/complaints", label: "Assigned Complaints", icon: FileText },
    { to: "/notifications", label: "Notifications", icon: Bell },
    { to: "/profile", label: "Profile", icon: User },
  ],
};

const ROLE_ICONS = {
  ADMIN: Shield,
  HANDLER: Wrench,
  USER: User,
};

export default function Layout({ children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const items = NAV_ITEMS[user?.role] || [];
  const RoleIcon = ROLE_ICONS[user?.role] || User;

  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    let active = true;
    const fetchUnread = async () => {
      try {
        const res = await notificationApi.list({ limit: 1 });
        if (active) setUnreadCount(res.unreadCount || 0);
      } catch {
        /* ignore */
      }
    };
    fetchUnread();
    const interval = setInterval(fetchUnread, 30000);
    return () => {
      active = false;
      clearInterval(interval);
    };
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-slate-900/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col bg-slate-900 transition-transform lg:static lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-16 items-center gap-2.5 px-6">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-600">
            <FileText className="h-5 w-5 text-white" />
          </div>
          <span className="text-lg font-bold text-white">ComplaintPortal</span>
        </div>

        <nav className="flex-1 space-y-1 px-3 py-4">
          {items.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === "/complaints"}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-indigo-600 text-white"
                      : "text-slate-400 hover:bg-slate-800 hover:text-white"
                  }`
                }
              >
                <Icon className="h-5 w-5" />
                {item.label}
                {item.label === "Notifications" && unreadCount > 0 && (
                  <span className="ml-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1.5 text-xs font-bold text-white">
                    {unreadCount > 99 ? "99+" : unreadCount}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>

        <div className="border-t border-slate-800 p-4">
          <div className="flex items-center gap-3 rounded-lg px-2 py-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-700">
              <RoleIcon className="h-4 w-4 text-slate-300" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-white">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="truncate text-xs text-slate-400">{user?.role}</p>
            </div>
            <button
              onClick={handleLogout}
              className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white"
              title="Logout"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Mobile top bar */}
        <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-4 lg:hidden">
          <button
            onClick={() => setSidebarOpen(true)}
            className="rounded-lg p-2 text-slate-600 hover:bg-slate-100"
          >
            <Menu className="h-5 w-5" />
          </button>
          <span className="font-bold text-slate-900">ComplaintPortal</span>
          <div className="w-9" />
        </header>

        <main className="flex-1 overflow-y-auto p-4 lg:p-8">{children}</main>
      </div>

      {/* Mobile close button when sidebar open */}
      {sidebarOpen && (
        <button
          className="fixed right-4 top-4 z-50 rounded-lg bg-white p-2 shadow-lg lg:hidden"
          onClick={() => setSidebarOpen(false)}
        >
          <X className="h-5 w-5 text-slate-600" />
        </button>
      )}
    </div>
  );
}
