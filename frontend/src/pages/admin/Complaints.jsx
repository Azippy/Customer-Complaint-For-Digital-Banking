import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Search, Filter, ArrowUpDown } from "lucide-react";
import { adminApi } from "../../api/client";
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
const SORT_OPTIONS = [
  { value: "createdAt", label: "Date Created" },
  { value: "priority", label: "Priority" },
  { value: "status", label: "Status" },
  { value: "title", label: "Title" },
];

export default function AdminComplaints() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [filters, setFilters] = useState({
    status: "",
    category: "",
    priority: "",
    sortBy: "createdAt",
    sortOrder: "desc",
  });

  const fetchComplaints = async () => {
    setLoading(true);
    try {
      const params = { page, limit: 10 };
      if (search) params.search = search;
      if (filters.status) params.status = filters.status;
      if (filters.category) params.category = filters.category;
      if (filters.priority) params.priority = filters.priority;
      params.sortBy = filters.sortBy;
      params.sortOrder = filters.sortOrder;
      const res = await adminApi.complaints(params);
      setData(res);
    } catch {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(1);
      setSearch(searchInput);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchInput]);

  useEffect(() => {
    fetchComplaints();
  }, [page, search, filters.status, filters.category, filters.priority, filters.sortBy, filters.sortOrder]);

  const handleFilterChange = (key, value) => {
    setPage(1);
    setFilters({ ...filters, [key]: value });
  };

  const toggleSortOrder = () => {
    setFilters({ ...filters, sortOrder: filters.sortOrder === "asc" ? "desc" : "asc" });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">All Complaints</h1>
        <p className="text-sm text-slate-500">Manage, assign, and track all complaints</p>
      </div>

      {/* Search + Filters */}
      <div className="card p-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              className="input pl-10"
              placeholder="Search by ID, title, or description..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
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
          <select className="input w-auto" value={filters.sortBy} onChange={(e) => handleFilterChange("sortBy", e.target.value)}>
            {SORT_OPTIONS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>
          <button onClick={toggleSortOrder} className="btn-secondary">
            <ArrowUpDown className="h-4 w-4" /> {filters.sortOrder === "asc" ? "Asc" : "Desc"}
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        {loading ? (
          <Spinner />
        ) : !data?.data?.length ? (
          <EmptyState icon={Filter} title="No complaints found" description="Try adjusting your search or filters." />
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    <th className="px-6 py-3">ID</th>
                    <th className="px-6 py-3">Title</th>
                    <th className="px-6 py-3">Submitted by</th>
                    <th className="px-6 py-3">Status</th>
                    <th className="px-6 py-3">Priority</th>
                    <th className="px-6 py-3">Assigned to</th>
                    <th className="px-6 py-3">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {data.data.map((c) => (
                    <tr key={c._id} className="hover:bg-slate-50">
                      <td className="px-6 py-3">
                        <Link to={`/complaints/${c.complaintId}`} className="font-mono text-xs font-medium text-indigo-600 hover:underline">
                          {c.complaintId}
                        </Link>
                      </td>
                      <td className="max-w-[200px] truncate px-6 py-3 font-medium text-slate-900">
                        <Link to={`/complaints/${c.complaintId}`} className="hover:text-indigo-600">
                          {c.title}
                        </Link>
                      </td>
                      <td className="px-6 py-3 text-slate-600">
                        {c.submittedBy?.firstName} {c.submittedBy?.lastName}
                      </td>
                      <td className="px-6 py-3"><StatusBadge status={c.status} /></td>
                      <td className="px-6 py-3"><PriorityBadge priority={c.priority} /></td>
                      <td className="px-6 py-3 text-slate-600">
                        {c.assignedTo ? `${c.assignedTo.firstName} ${c.assignedTo.lastName}` : "—"}
                      </td>
                      <td className="px-6 py-3 text-xs text-slate-400">
                        {new Date(c.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Pagination pagination={data.pagination} onPageChange={setPage} />
          </>
        )}
      </div>
    </div>
  );
}
