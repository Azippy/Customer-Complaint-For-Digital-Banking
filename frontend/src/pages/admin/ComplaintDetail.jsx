import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, UserPlus, XCircle } from "lucide-react";
import { adminApi } from "../../api/client";
import {
  Spinner,
  ErrorAlert,
  Modal,
  useToast,
} from "../../components/ui";
import ComplaintInfo from "../../components/ComplaintInfo";
import CommentThread from "../../components/CommentThread";
import StatusTimeline from "../../components/StatusTimeline";

export default function AdminComplaintDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { show, Toast } = useToast();
  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [handlers, setHandlers] = useState([]);
  const [assignModal, setAssignModal] = useState(false);
  const [rejectModal, setRejectModal] = useState(false);
  const [selectedHandler, setSelectedHandler] = useState("");
  const [rejectReason, setRejectReason] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  const fetchComplaint = async () => {
    try {
      const res = await adminApi.complaint(id);
      setComplaint(res.complaint);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchHandlers = async () => {
    try {
      const res = await adminApi.handlers();
      setHandlers(res.data || []);
    } catch {
    }
  };

  useEffect(() => {
    fetchComplaint();
  }, [id]);

  const handleAssign = async () => {
    if (!selectedHandler) return;
    setActionLoading(true);
    try {
      const res = await adminApi.assign(id, selectedHandler);
      setComplaint(res.complaint);
      setAssignModal(false);
      show("Complaint assigned successfully");
    } catch (err) {
      show(err.message, "error");
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async () => {
    if (!rejectReason.trim()) return;
    setActionLoading(true);
    try {
      const res = await adminApi.reject(id, rejectReason);
      setComplaint(res.complaint);
      setRejectModal(false);
      setRejectReason("");
      show("Complaint rejected");
    } catch (err) {
      show(err.message, "error");
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) return <Spinner label="Loading complaint..." />;
  if (error) return <ErrorAlert message={error} />;

  const canAssign = complaint.status === "PENDING";
  const canReject = complaint.status === "PENDING";

  return (
    <div className="space-y-6">
      <Toast />
      <div className="flex flex-wrap items-center justify-between gap-3">
        <button onClick={() => navigate(-1)} className="btn-secondary">
          <ArrowLeft className="h-4 w-4" /> Back
        </button>
        {(canAssign || canReject) && (
          <div className="flex gap-2">
            {canAssign && (
              <button
                className="btn-primary"
                onClick={() => {
                  fetchHandlers();
                  setAssignModal(true);
                }}
              >
                <UserPlus className="h-4 w-4" /> Assign
              </button>
            )}
            {canReject && (
              <button className="btn-danger" onClick={() => setRejectModal(true)}>
                <XCircle className="h-4 w-4" /> Reject
              </button>
            )}
          </div>
        )}
      </div>

      <ComplaintInfo complaint={complaint} />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <CommentThread complaintMongoId={complaint._id} />
        <StatusTimeline complaintMongoId={complaint._id} />
      </div>

      {/* Assign Modal */}
      <Modal open={assignModal} onClose={() => setAssignModal(false)} title="Assign Complaint">
        <p className="mb-4 text-sm text-slate-500">
          Select a handler to assign this complaint to.
        </p>
        {handlers.length === 0 ? (
          <p className="py-4 text-center text-sm text-slate-400">No handlers available.</p>
        ) : (
          <div className="space-y-2">
            {handlers.map((h) => (
              <label
                key={h._id}
                className={`flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition-colors ${
                  selectedHandler === h._id
                    ? "border-indigo-500 bg-indigo-50"
                    : "border-slate-200 hover:bg-slate-50"
                }`}
              >
                <input
                  type="radio"
                  name="handler"
                  value={h._id}
                  checked={selectedHandler === h._id}
                  onChange={(e) => setSelectedHandler(e.target.value)}
                  className="h-4 w-4 text-indigo-600"
                />
                <div>
                  <p className="text-sm font-medium text-slate-900">
                    {h.firstName} {h.lastName}
                  </p>
                  <p className="text-xs text-slate-400">{h.email}</p>
                </div>
              </label>
            ))}
          </div>
        )}
        <div className="mt-5 flex justify-end gap-2">
          <button className="btn-secondary" onClick={() => setAssignModal(false)}>Cancel</button>
          <button className="btn-primary" disabled={!selectedHandler || actionLoading} onClick={handleAssign}>
            {actionLoading ? "Assigning..." : "Confirm Assign"}
          </button>
        </div>
      </Modal>

      {/* Reject Modal */}
      <Modal open={rejectModal} onClose={() => setRejectModal(false)} title="Reject Complaint">
        <p className="mb-4 text-sm text-slate-500">
          Provide a reason for rejecting this complaint.
        </p>
        <textarea
          className="input min-h-[100px] resize-y"
          placeholder="Enter rejection reason..."
          value={rejectReason}
          onChange={(e) => setRejectReason(e.target.value)}
        />
        <div className="mt-5 flex justify-end gap-2">
          <button className="btn-secondary" onClick={() => setRejectModal(false)}>Cancel</button>
          <button className="btn-danger" disabled={!rejectReason.trim() || actionLoading} onClick={handleReject}>
            {actionLoading ? "Rejecting..." : "Confirm Reject"}
          </button>
        </div>
      </Modal>
    </div>
  );
}
