import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, CheckCircle } from "lucide-react";
import { userComplaintApi } from "../../api/client";
import { Spinner, ErrorAlert, useToast } from "../../components/ui";
import ComplaintInfo from "../../components/ComplaintInfo";
import CommentThread from "../../components/CommentThread";
import StatusTimeline from "../../components/StatusTimeline";

export default function UserComplaintDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { show, Toast } = useToast();
  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);
  const [closing, setClosing] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    userComplaintApi
      .get(id)
      .then((res) => setComplaint(res.complaint))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  const handleClose = async () => {
    if (!confirm("Are you sure you want to close this complaint?")) return;
    setClosing(true);
    try {
      const res = await userComplaintApi.close(id);
      setComplaint(res.complaint);
      show("Complaint closed successfully");
    } catch (err) {
      show(err.message, "error");
    } finally {
      setClosing(false);
    }
  };

  if (loading) return <Spinner label="Loading complaint..." />;
  if (error) return <ErrorAlert message={error} />;

  return (
    <div className="space-y-6">
      <Toast />
      <div className="flex items-center justify-between">
        <button onClick={() => navigate(-1)} className="btn-secondary">
          <ArrowLeft className="h-4 w-4" /> Back
        </button>
        {complaint.status === "RESOLVED" && (
          <button onClick={handleClose} className="btn-success" disabled={closing}>
            <CheckCircle className="h-4 w-4" />
            {closing ? "Closing..." : "Close Complaint"}
          </button>
        )}
      </div>

      <ComplaintInfo complaint={complaint} />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <CommentThread complaintMongoId={complaint._id} />
        <StatusTimeline complaintMongoId={complaint._id} />
      </div>
    </div>
  );
}
