import { User, Calendar, Tag, UserCheck, MessageSquare } from "lucide-react";
import { StatusBadge, PriorityBadge, CategoryBadge } from "./ui";

export default function ComplaintInfo({ complaint }) {
  const submittedBy = complaint.submittedBy;
  const assignedTo = complaint.assignedTo;

  return (
    <div className="card p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-sm font-medium text-indigo-600">
              {complaint.complaintId}
            </span>
            <StatusBadge status={complaint.status} />
            <PriorityBadge priority={complaint.priority} />
            <CategoryBadge category={complaint.category} />
          </div>
          <h2 className="mt-2 text-xl font-bold text-slate-900">
            {complaint.title}
          </h2>
        </div>
      </div>

      <div className="mt-4 rounded-lg bg-slate-50 p-4">
        <p className="whitespace-pre-wrap text-sm leading-relaxed text-slate-700">
          {complaint.description}
        </p>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <InfoRow
          icon={User}
          label="Submitted by"
          value={
            submittedBy
              ? `${submittedBy.firstName} ${submittedBy.lastName}`
              : "—"
          }
          subtext={submittedBy?.email}
        />
        <InfoRow
          icon={UserCheck}
          label="Assigned to"
          value={
            assignedTo
              ? `${assignedTo.firstName} ${assignedTo.lastName}`
              : "Unassigned"
          }
          subtext={assignedTo?.email}
        />
        <InfoRow
          icon={Calendar}
          label="Created"
          value={new Date(complaint.createdAt).toLocaleString()}
        />
        <InfoRow
          icon={Calendar}
          label="Last updated"
          value={new Date(complaint.updatedAt).toLocaleString()}
        />
      </div>

      {complaint.resolution && (
        <div className="mt-4 rounded-lg border border-green-200 bg-green-50 p-4">
          <p className="text-sm font-semibold text-green-700">Resolution</p>
          <p className="mt-1 text-sm text-green-600">{complaint.resolution}</p>
          {complaint.resolvedAt && (
            <p className="mt-2 text-xs text-green-500">
              Resolved on {new Date(complaint.resolvedAt).toLocaleString()}
            </p>
          )}
        </div>
      )}

      {complaint.rejectionReason && (
        <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-4">
          <p className="text-sm font-semibold text-red-700">Rejection Reason</p>
          <p className="mt-1 text-sm text-red-600">
            {complaint.rejectionReason}
          </p>
        </div>
      )}
    </div>
  );
}

function InfoRow({ icon: Icon, label, value, subtext }) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100">
        <Icon className="h-4 w-4 text-slate-500" />
      </div>
      <div>
        <p className="text-xs font-medium text-slate-500">{label}</p>
        <p className="text-sm font-semibold text-slate-900">{value}</p>
        {subtext && <p className="text-xs text-slate-400">{subtext}</p>}
      </div>
    </div>
  );
}
