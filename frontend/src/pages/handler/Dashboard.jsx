import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FileText,
  UserCheck,
  Loader,
  CheckCircle,
  Flame,
  ArrowRight,
} from "lucide-react";
import { handlerApi } from "../../api/client";
import {
  StatCard,
  Spinner,
  EmptyState,
  StatusBadge,
  PriorityBadge,
} from "../../components/ui";

export default function HandlerDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    handlerApi
      .dashboard()
      .then(setData)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Spinner label="Loading dashboard..." />;

  const stats = data?.statistics || {};

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Handler Dashboard</h1>
        <p className="text-sm text-slate-500">Your assigned complaints and workload</p>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard icon={FileText} label="Total Assigned" value={stats.totalAssigned || 0} color="indigo" />
        <StatCard icon={UserCheck} label="Assigned" value={stats.assigned || 0} color="blue" />
        <StatCard icon={Loader} label="In Progress" value={stats.inProgress || 0} color="violet" />
        <StatCard icon={CheckCircle} label="Resolved" value={stats.resolved || 0} color="green" />
      </div>

      {/* Urgent complaints */}
      {data?.urgentComplaints?.length > 0 && (
        <div className="card overflow-hidden">
          <div className="flex items-center gap-2 border-b border-slate-200 px-6 py-4">
            <Flame className="h-5 w-5 text-red-500" />
            <h3 className="text-base font-bold text-slate-900">Urgent & High Priority</h3>
          </div>
          <div className="divide-y divide-slate-100">
            {data.urgentComplaints.map((c) => (
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
                  <ArrowRight className="h-4 w-4 text-slate-300" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Recent assignments */}
      <div className="card overflow-hidden">
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <h3 className="text-base font-bold text-slate-900">Recent Assignments</h3>
          <Link to="/complaints" className="text-sm font-semibold text-indigo-600 hover:text-indigo-700">
            View all →
          </Link>
        </div>
        {!data?.recentAssignments?.length ? (
          <EmptyState icon={FileText} title="No assignments yet" description="You have no assigned complaints." />
        ) : (
          <div className="divide-y divide-slate-100">
            {data.recentAssignments.map((c) => (
              <Link key={c._id} to={`/complaints/${c.complaintId}`} className="block px-6 py-3.5 hover:bg-slate-50">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs text-indigo-600">{c.complaintId}</span>
                      <StatusBadge status={c.status} />
                      <PriorityBadge priority={c.priority} />
                    </div>
                    <p className="mt-1 text-sm font-medium text-slate-900">{c.title}</p>
                  </div>
                  <span className="text-xs text-slate-400">
                    {c.assignedAt ? new Date(c.assignedAt).toLocaleDateString() : "—"}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
