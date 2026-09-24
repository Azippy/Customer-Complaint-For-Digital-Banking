import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Play, CheckCircle } from "lucide-react";
import { handlerApi } from "../../api/client";
import {
  Spinner,
  ErrorAlert,
  Modal,
  useToast,
} from "../../components/ui";
import ComplaintInfo from "../../components/ComplaintInfo";
import CommentThread from "../../components/CommentThread";
import StatusTimeline from "../../components/StatusTimeline";

export default function HandlerComplaintDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { show, Toast } = useToast();
  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [resolveModal, setResolveModal] = useState(false);
  const [resolution, setResolution] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    handlerApi
      .complaint(id)
      .then((res) => setComplaint(res.complaint))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  const handleStart = async () => {
    setActionLoading(true);
    try {
      const res = await handlerApi.startProgress(id);
      setComplaint(res.complaint);
      show("Complaint is now in progress");
    } catch (err) {
      show(err.message, "error");
    } finally {
      setActionLoading(false);
    }
  };

  const handleResolve = async () => {
    if (!resolution.trim()) return;
    setActionLoading(true);
    try {
      const res = await handlerApi.resolve(id, resolution);
      setComplaint(res.complaint);
      setResolveModal(false);
      setResolution("");
      show("Complaint resolved successfully");
    } catch (err) {
      show(err.message, "error");
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) return <Spinner label="Loading complaint..." />;
  if (error) return <ErrorAlert message={error} />;

  const canStart = complaint.status === "ASSIGNED";
  const canResolve = complaint.status === "IN_PROGRESS";

  return (
    <div className="space-y-6">
      <Toast />
      <div className="flex flex-wrap items-center justify-between gap-3">
        <button onClick={() => navigate(-1)} className="btn-secondary">
          <ArrowLeft className="h-4 w-4" /> Back
        </button>
        {(canStart || canResolve) && (
          <div className="flex gap-2">
            {canStart && (
              <button className="btn-primary" disabled={actionLoading} onClick={handleStart}>
                <Play className="h-4 w-4" /> Start Working
              </button>
            )}
            {canResolve && (
              <button className="btn-success" onClick={() => setResolveModal(true)}>
                <CheckCircle className="h-4 w-4" /> Resolve
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

      {/* Resolve Modal */}
      <Modal open={resolveModal} onClose={() => setResolveModal(false)} title="Resolve Complaint">
        <p className="mb-4 text-sm text-slate-500">
          Provide a resolution summary for this complaint.
        </p>
        <textarea
          className="input min-h-[120px] resize-y"
          placeholder="Describe how the complaint was resolved..."
          value={resolution}
          onChange={(e) => setResolution(e.target.value)}
        />
        <div className="mt-5 flex justify-end gap-2">
          <button className="btn-secondary" onClick={() => setResolveModal(false)}>Cancel</button>
          <button className="btn-success" disabled={!resolution.trim() || actionLoading} onClick={handleResolve}>
            {actionLoading ? "Resolving..." : "Confirm Resolution"}
          </button>
        </div>
      </Modal>
    </div>
  );
}
