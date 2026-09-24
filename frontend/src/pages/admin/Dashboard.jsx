import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FileText,
  Clock,
  Loader,
  CheckCircle,
  XCircle,
  PackageCheck,
  AlertTriangle,
  UserCheck,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { adminApi } from "../../api/client";
import { StatCard, Spinner, StatusBadge, PriorityBadge } from "../../components/ui";

const PIE_COLORS = ["#6366f1", "#0ea5e9", "#8b5cf6", "#f59e0b", "#10b981", "#ef4444", "#64748b"];

export default function AdminDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminApi
      .dashboard()
      .then(setData)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Spinner label="Loading dashboard..." />;

  const stats = data?.statistics || {};
  const categoryData = (data?.complaintsByCategory || []).map((d) => ({
    name: d._id,
    count: d.count,
  }));
  const priorityData = (data?.complaintsByPriority || []).map((d) => ({
    name: d._id,
    count: d.count,
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Admin Dashboard</h1>
        <p className="text-sm text-slate-500">Overview of all complaints and system health</p>
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
        <StatCard icon={PackageCheck} label="Closed" value={stats.closed || 0} color="slate" />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="card p-6">
          <h3 className="mb-4 text-base font-bold text-slate-900">Complaints by Category</h3>
          {categoryData.length > 0 ? (
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={categoryData}>
                <XAxis dataKey="name" tick={{ fontSize: 12 }} stroke="#94a3b8" />
                <YAxis tick={{ fontSize: 12 }} stroke="#94a3b8" allowDecimals={false} />
                <Tooltip
                  contentStyle={{
                    borderRadius: "8px",
                    border: "1px solid #e2e8f0",
                    fontSize: "13px",
                  }}
                />
                <Bar dataKey="count" fill="#6366f1" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="py-10 text-center text-sm text-slate-400">No data yet</p>
          )}
        </div>

        <div className="card p-6">
          <h3 className="mb-4 text-base font-bold text-slate-900">Complaints by Priority</h3>
          {priorityData.length > 0 ? (
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie
                  data={priorityData}
                  dataKey="count"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={90}
                  innerRadius={50}
                  paddingAngle={2}
                >
                  {priorityData.map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    borderRadius: "8px",
                    border: "1px solid #e2e8f0",
                    fontSize: "13px",
                  }}
                />
                <Legend wrapperStyle={{ fontSize: "12px" }} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="py-10 text-center text-sm text-slate-400">No data yet</p>
          )}
        </div>
      </div>

      {/* Handler workload */}
      {data?.handlerWorkload?.length > 0 && (
        <div className="card p-6">
          <h3 className="mb-4 text-base font-bold text-slate-900">Handler Workload</h3>
          <div className="space-y-3">
            {data.handlerWorkload.map((h) => (
              <div key={h.handlerId} className="flex items-center gap-4">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-100 text-sm font-semibold text-indigo-700">
                  {h.name?.[0]?.toUpperCase()}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-900">{h.name}</p>
                  <p className="text-xs text-slate-400">{h.email}</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-32 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full bg-indigo-500"
                      style={{ width: `${Math.min(h.activeComplaints * 20, 100)}%` }}
                    />
                  </div>
                  <span className="w-8 text-sm font-semibold text-slate-700">
                    {h.activeComplaints}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Overdue complaints */}
      {data?.overdueComplaints?.length > 0 && (
        <div className="card overflow-hidden">
          <div className="flex items-center gap-2 border-b border-slate-200 px-6 py-4">
            <AlertTriangle className="h-5 w-5 text-amber-500" />
            <h3 className="text-base font-bold text-slate-900">Overdue Complaints</h3>
            <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-700">
              {data.overdueComplaints.length}
            </span>
          </div>
          <div className="divide-y divide-slate-100">
            {data.overdueComplaints.map((c) => (
              <Link key={c._id} to={`/complaints/${c.complaintId}`} className="block px-6 py-3.5 hover:bg-slate-50">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-mono text-xs text-indigo-600">{c.complaintId}</span>
                    <p className="text-sm font-medium text-slate-900">{c.title}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <StatusBadge status={c.status} />
                    <PriorityBadge priority={c.priority} />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Recent complaints */}
      <div className="card overflow-hidden">
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <h3 className="text-base font-bold text-slate-900">Recent Complaints</h3>
          <Link to="/complaints" className="text-sm font-semibold text-indigo-600 hover:text-indigo-700">
            View all →
          </Link>
        </div>
        <div className="divide-y divide-slate-100">
          {(data?.recentComplaints || []).map((c) => (
            <Link key={c._id} to={`/complaints/${c.complaintId}`} className="block px-6 py-3.5 hover:bg-slate-50">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs text-indigo-600">{c.complaintId}</span>
                    <StatusBadge status={c.status} />
                    <PriorityBadge priority={c.priority} />
                  </div>
                  <p className="mt-1 text-sm font-medium text-slate-900">{c.title}</p>
                  <p className="text-xs text-slate-400">
                    by {c.submittedBy?.firstName} {c.submittedBy?.lastName}
                  </p>
                </div>
                <span className="text-xs text-slate-400">{new Date(c.createdAt).toLocaleDateString()}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
