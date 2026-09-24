import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Bell, CheckCheck, BellOff } from "lucide-react";
import { notificationApi } from "../api/client";
import { Spinner, EmptyState, useToast } from "../components/ui";

const NOTIFICATION_ICONS = {
  COMPLAINT_SUBMITTED: "📝",
  COMPLAINT_ASSIGNED: "👤",
  COMPLAINT_STARTED: "🚀",
  COMPLAINT_COMMENTED: "💬",
  COMPLAINT_RESOLVED: "✅",
  COMPLAINT_REJECTED: "❌",
  COMPLAINT_CLOSED: "📦",
  SYSTEM: "🔔",
};

export default function Notifications() {
  const { show, Toast } = useToast();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  const fetchNotifications = async () => {
    try {
      const params = { limit: 50 };
      if (filter === "unread") params.unreadOnly = "true";
      const res = await notificationApi.list(params);
      setNotifications(res.data || []);
      setUnreadCount(res.unreadCount || 0);
    } catch {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, [filter]);

  const handleMarkAllRead = async () => {
    try {
      await notificationApi.markAllRead();
      show("All notifications marked as read");
      fetchNotifications();
    } catch (err) {
      show(err.message, "error");
    }
  };

  const handleMarkRead = async (id) => {
    try {
      await notificationApi.markRead(id);
      fetchNotifications();
    } catch {
    }
  };

  return (
    <div className="space-y-6">
      <Toast />
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Notifications</h1>
          <p className="text-sm text-slate-500">
            {unreadCount > 0 ? `${unreadCount} unread notification${unreadCount > 1 ? "s" : ""}` : "You're all caught up"}
          </p>
        </div>
        <div className="flex gap-2">
          <select
            className="input w-auto"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="all">All</option>
            <option value="unread">Unread only</option>
          </select>
          {unreadCount > 0 && (
            <button className="btn-secondary" onClick={handleMarkAllRead}>
              <CheckCheck className="h-4 w-4" /> Mark all read
            </button>
          )}
        </div>
      </div>

      <div className="card overflow-hidden">
        {loading ? (
          <Spinner />
        ) : notifications.length === 0 ? (
          <EmptyState icon={BellOff} title="No notifications" description="You have no notifications yet." />
        ) : (
          <div className="divide-y divide-slate-100">
            {notifications.map((n) => (
              <div
                key={n._id}
                className={`flex items-start gap-3 px-6 py-4 ${
                  !n.isRead ? "bg-indigo-50/40" : ""
                }`}
              >
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-slate-100 text-lg">
                  {NOTIFICATION_ICONS[n.type] || "🔔"}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-slate-900">{n.title}</p>
                    {!n.isRead && (
                      <span className="h-2 w-2 rounded-full bg-indigo-500" />
                    )}
                  </div>
                  <p className="text-sm text-slate-600">{n.message}</p>
                  <div className="mt-1 flex items-center gap-3">
                    <span className="text-xs text-slate-400">
                      {new Date(n.createdAt).toLocaleString()}
                    </span>
                    {n.complaint && (
                      <Link
                        to={`/complaints/${n.complaint.complaintId}`}
                        className="text-xs font-medium text-indigo-600 hover:underline"
                      >
                        View complaint →
                      </Link>
                    )}
                  </div>
                </div>
                {!n.isRead && (
                  <button
                    onClick={() => handleMarkRead(n._id)}
                    className="flex-shrink-0 rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                    title="Mark as read"
                  >
                    <CheckCheck className="h-4 w-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
