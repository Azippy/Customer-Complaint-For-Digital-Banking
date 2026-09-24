import { useState, useEffect } from "react";
import { History } from "lucide-react";
import { auditApi } from "../api/client";
import { Spinner, EmptyState } from "./ui";

const ACTION_ICONS = {
  SUBMITTED: "📝",
  ASSIGNED: "👤",
  REASSIGNED: "🔄",
  STARTED: "🚀",
  COMMENTED: "💬",
  RESOLVED: "✅",
  REJECTED: "❌",
  CLOSED: "📦",
};

export default function StatusTimeline({ complaintMongoId }) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await auditApi.history(complaintMongoId);
        setHistory(res.data || []);
      } catch {
        /* ignore */
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [complaintMongoId]);

  return (
    <div className="card p-6">
      <div className="mb-4 flex items-center gap-2">
        <History className="h-5 w-5 text-indigo-600" />
        <h3 className="text-base font-bold text-slate-900">Activity History</h3>
      </div>

      {loading ? (
        <Spinner />
      ) : history.length === 0 ? (
        <EmptyState icon={History} title="No activity recorded" />
      ) : (
        <ol className="relative space-y-5 border-l-2 border-slate-200 pl-6">
          {history.map((log) => (
            <li key={log._id} className="relative">
              <span className="absolute -left-[31px] flex h-6 w-6 items-center justify-center rounded-full bg-white ring-2 ring-slate-200 text-xs">
                {ACTION_ICONS[log.action] || "•"}
              </span>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm font-semibold text-slate-900">
                  {log.user?.firstName} {log.user?.lastName}
                </span>
                <span className="rounded-full bg-indigo-50 px-2 py-0.5 text-xs font-medium text-indigo-600">
                  {log.action}
                </span>
                {log.oldStatus && log.newStatus && (
                  <span className="text-xs text-slate-400">
                    {log.oldStatus} → {log.newStatus}
                  </span>
                )}
              </div>
              <p className="mt-0.5 text-sm text-slate-600">{log.description}</p>
              <p className="mt-0.5 text-xs text-slate-400">
                {new Date(log.createdAt).toLocaleString()}
              </p>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
