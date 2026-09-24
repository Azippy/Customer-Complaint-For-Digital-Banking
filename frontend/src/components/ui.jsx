import { useState } from "react";
import { ChevronLeft, ChevronRight, X, AlertCircle } from "lucide-react";

const STATUS_STYLES = {
  PENDING: "bg-amber-100 text-amber-700 border-amber-200",
  ASSIGNED: "bg-blue-100 text-blue-700 border-blue-200",
  IN_PROGRESS: "bg-violet-100 text-violet-700 border-violet-200",
  RESOLVED: "bg-green-100 text-green-700 border-green-200",
  REJECTED: "bg-red-100 text-red-700 border-red-200",
  CLOSED: "bg-slate-200 text-slate-600 border-slate-300",
};

const PRIORITY_STYLES = {
  LOW: "bg-slate-100 text-slate-600 border-slate-200",
  MEDIUM: "bg-blue-100 text-blue-700 border-blue-200",
  HIGH: "bg-orange-100 text-orange-700 border-orange-200",
  URGENT: "bg-red-100 text-red-700 border-red-200",
};

const CATEGORY_LABELS = {
  PAYMENT: "Payment",
  ACCOUNT: "Account",
  TECHNICAL: "Technical",
  SERVICE: "Service",
  OTHER: "Other",
};

export function StatusBadge({ status }) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${
        STATUS_STYLES[status] || "bg-slate-100 text-slate-600"
      }`}
    >
      {status?.replace("_", " ")}
    </span>
  );
}

export function PriorityBadge({ priority }) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${
        PRIORITY_STYLES[priority] || "bg-slate-100 text-slate-600"
      }`}
    >
      {priority}
    </span>
  );
}

export function CategoryBadge({ category }) {
  return (
    <span className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-2.5 py-0.5 text-xs font-medium text-slate-600">
      {CATEGORY_LABELS[category] || category}
    </span>
  );
}

export function StatCard({ icon: Icon, label, value, color = "indigo" }) {
  const colorMap = {
    indigo: "bg-indigo-50 text-indigo-600",
    amber: "bg-amber-50 text-amber-600",
    blue: "bg-blue-50 text-blue-600",
    violet: "bg-violet-50 text-violet-600",
    green: "bg-green-50 text-green-600",
    red: "bg-red-50 text-red-600",
    slate: "bg-slate-100 text-slate-600",
  };
  return (
    <div className="card p-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">{label}</p>
          <p className="mt-1 text-3xl font-bold text-slate-900">{value}</p>
        </div>
        {Icon && (
          <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${colorMap[color]}`}>
            <Icon className="h-6 w-6" />
          </div>
        )}
      </div>
    </div>
  );
}

export function Spinner({ label }) {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-indigo-600" />
      {label && <p className="mt-3 text-sm text-slate-500">{label}</p>}
    </div>
  );
}

export function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      {Icon && (
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-100">
          <Icon className="h-7 w-7 text-slate-400" />
        </div>
      )}
      <h3 className="mt-4 text-base font-semibold text-slate-900">{title}</h3>
      {description && (
        <p className="mt-1 max-w-sm text-sm text-slate-500">{description}</p>
      )}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

export function Pagination({ pagination, onPageChange }) {
  if (!pagination || pagination.totalPages <= 1) return null;
  const { page, totalPages, hasNextPage, hasPreviousPage } = pagination;
  return (
    <div className="flex items-center justify-between border-t border-slate-200 px-4 py-3">
      <p className="text-sm text-slate-500">
        Page {page} of {totalPages} · {pagination.total} total
      </p>
      <div className="flex items-center gap-2">
        <button
          className="btn-secondary px-3 py-1.5"
          disabled={!hasPreviousPage}
          onClick={() => onPageChange(page - 1)}
        >
          <ChevronLeft className="h-4 w-4" /> Prev
        </button>
        <button
          className="btn-secondary px-3 py-1.5"
          disabled={!hasNextPage}
          onClick={() => onPageChange(page + 1)}
        >
          Next <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

export function Modal({ open, onClose, title, children }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative z-10 w-full max-w-md card p-6">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-bold text-slate-900">{title}</h3>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

export function ErrorAlert({ message }) {
  if (!message) return null;
  return (
    <div className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
      <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0" />
      <span>{message}</span>
    </div>
  );
}

export function useToast() {
  const [toast, setToast] = useState(null);
  const show = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };
  const Toast = () =>
    toast ? (
      <div className="fixed bottom-6 right-6 z-50 animate-fade-in">
        <div
          className={`flex items-center gap-2 rounded-lg px-4 py-3 text-sm font-medium shadow-lg ${
            toast.type === "success"
              ? "bg-green-600 text-white"
              : "bg-red-600 text-white"
          }`}
        >
          {toast.message}
        </div>
      </div>
    ) : null;
  return { show, Toast };
}
