import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FileText, PlusCircle, Search, Filter } from "lucide-react";
import { userComplaintApi } from "../../api/client";
import {
  StatusBadge,
  PriorityBadge,
  CategoryBadge,
  Spinner,
  EmptyState,
  Pagination,
} from "../../components/ui";

const STATUSES = ["PENDING", "ASSIGNED", "IN_PROGRESS", "RESOLVED", "REJECTED", "CLOSED"];
const CATEGORIES = ["PAYMENT", "ACCOUNT", "TECHNICAL", "SERVICE", "OTHER"];
const PRIORITIES = ["LOW", "MEDIUM", "HIGH", "URGENT"];

export default function UserComplaints() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState({ status: "", category: "", priority: "" });

  const fetchComplaints = async () => {
    setLoading(true);
    try {
      const params = { page, limit: 10 };
      if (filters.status) params.status = filters.status;
      if (filters.category) params.category = filters.category;
      if (filters.priority) params.priority = filters.priority;
      const res = await userComplaintApi.list(params);
      setData(res);
    } catch {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, [page, filters.status, filters.category, filters.priority]);

  const handleFilterChange = (key, value) => {
    setPage(1);
    setFilters({ ...filters, [key]: value });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">My Complaints</h1>
          <p className="text-sm text-slate-500">Manage and track your submitted complaints</p>
        </div>
        <Link to="/complaints/new" className="btn-primary">
          <PlusCircle className="h-4 w-4" /> New Complaint
        </Link>
      </div>

      {/* Filters */}
      <div className="card p-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5 text-sm font-medium text-slate-500">
            <Filter className="h-4 w-4" /> Filter:
          </div>
          <select className="input w-auto" value={filters.status} onChange={(e) => handleFilterChange("status", e.target.value)}>
            <option value="">All Statuses</option>
            {STATUSES.map((s) => <option key={s} value={s}>{s.replace("_", " ")}</option>)}
          </select>
          <select className="input w-auto" value={filters.category} onChange={(e) => handleFilterChange("category", e.target.value)}>
            <option value="">All Categories</option>
            {CATEGORIES.map((c) => <option key={c} value={c}>{c.charAt(0) + c.slice(1).toLowerCase()}</option>)}
          </select>
          <select className="input w-auto" value={filters.priority} onChange={(e) => handleFilterChange("priority", e.target.value)}>
            <option value="">All Priorities</option>
            {PRIORITIES.map((p) => <option key={p} value={p}>{p}</option>)}
          </select>
        </div>
      </div>

      {/* List */}
      <div className="card overflow-hidden">
        {loading ? (
          <Spinner />
        ) : !data?.complaints?.length ? (
          <EmptyState
            icon={FileText}
            title="No complaints found"
            description="Try adjusting your filters or submit a new complaint."
            action={<Link to="/complaints/new" className="btn-primary"><PlusCircle className="h-4 w-4" /> New Complaint</Link>}
          />
        ) : (
          <>
            <div className="divide-y divide-slate-100">
              {data.complaints.map((c) => (
                <Link key={c._id} to={`/complaints/${c.complaintId}`} className="block px-6 py-4 hover:bg-slate-50">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-mono text-xs font-medium text-indigo-600">{c.complaintId}</span>
                        <StatusBadge status={c.status} />
                        <PriorityBadge priority={c.priority} />
                        <CategoryBadge category={c.category} />
                      </div>
                      <p className="mt-1.5 font-semibold text-slate-900">{c.title}</p>
                      <p className="mt-0.5 truncate text-sm text-slate-500">{c.description}</p>
                    </div>
                    <span className="flex-shrink-0 text-xs text-slate-400">
                      {new Date(c.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
            <Pagination pagination={data.pagination} onPageChange={setPage} />
          </>
        )}
      </div>
    </div>
  );
}
