import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  PlusCircle,
  Loader,
  UserCheck,
} from "lucide-react";
import { userDashboardApi } from "../../api/client";
import { StatCard, Spinner, EmptyState, StatusBadge, PriorityBadge } from "../../components/ui";

export default function UserDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    userDashboardApi
      .dashboard()
      .then(setData)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Spinner label="Loading dashboard..." />;

  const stats = data?.statistics || {};

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
          <p className="text-sm text-slate-500">Track your complaints at a glance</p>
        </div>
        <Link to="/complaints/new" className="btn-primary">
          <PlusCircle className="h-4 w-4" /> New Complaint
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard icon={FileText} label="Total" value={stats.total || 0} color="indigo" />
        <StatCard icon={Clock} label="Pending" value={stats.pending || 0} color="amber" />
        <StatCard icon={UserCheck} label="Assigned" value={stats.assigned || 0} color="blue" />
        <StatCard icon={Loader} label="In Progress" value={stats.inProgress || 0} color="violet" />
      </div>
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
        <StatCard icon={CheckCircle} label="Resolved" value={stats.resolved || 0} color="green" />
        <StatCard icon={XCircle} label="Rejected" value={stats.rejected || 0} color="red" />
        <StatCard icon={CheckCircle} label="Closed" value={stats.closed || 0} color="slate" />
      </div>

      <div className="card overflow-hidden">
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <h2 className="text-base font-bold text-slate-900">Recent Complaints</h2>
          <Link to="/complaints" className="text-sm font-semibold text-indigo-600 hover:text-indigo-700">
            View all →
          </Link>
        </div>
        {!data?.recentComplaints?.length ? (
          <EmptyState
            icon={FileText}
            title="No complaints yet"
            description="Submit your first complaint to get started."
            action={
              <Link to="/complaints/new" className="btn-primary">
                <PlusCircle className="h-4 w-4" /> New Complaint
              </Link>
            }
          />
        ) : (
          <div className="divide-y divide-slate-100">
            {data.recentComplaints.map((c) => (
              <Link
                key={c._id}
                to={`/complaints/${c.complaintId}`}
                className="flex items-center justify-between px-6 py-3.5 hover:bg-slate-50"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs text-indigo-600">{c.complaintId}</span>
                    <StatusBadge status={c.status} />
                    <PriorityBadge priority={c.priority} />
                  </div>
                  <p className="mt-1 truncate text-sm font-medium text-slate-900">{c.title}</p>
                </div>
                <span className="ml-4 flex-shrink-0 text-xs text-slate-400">
                  {new Date(c.createdAt).toLocaleDateString()}
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
