import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Send } from "lucide-react";
import { userComplaintApi } from "../../api/client";
import { ErrorAlert, useToast } from "../../components/ui";

const CATEGORIES = ["PAYMENT", "ACCOUNT", "TECHNICAL", "SERVICE", "OTHER"];
const PRIORITIES = ["LOW", "MEDIUM", "HIGH", "URGENT"];

export default function CreateComplaint() {
  const navigate = useNavigate();
  const { show, Toast } = useToast();
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "PAYMENT",
    priority: "MEDIUM",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await userComplaintApi.create(form);
      show("Complaint submitted successfully");
      navigate(`/complaints/${res.complaint.complaintId}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <Toast />
      <div>
        <button onClick={() => navigate(-1)} className="btn-secondary">
          <ArrowLeft className="h-4 w-4" /> Back
        </button>
      </div>

      <div className="card p-8">
        <h1 className="text-2xl font-bold text-slate-900">New Complaint</h1>
        <p className="mt-1 text-sm text-slate-500">
          Fill in the details below to submit a new complaint.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          <div>
            <label className="label">Title</label>
            <input
              name="title"
              className="input"
              placeholder="Brief summary of the issue"
              value={form.title}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label className="label">Description</label>
            <textarea
              name="description"
              className="input min-h-[140px] resize-y"
              placeholder="Describe your complaint in detail..."
              value={form.description}
              onChange={handleChange}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Category</label>
              <select
                name="category"
                className="input"
                value={form.category}
                onChange={handleChange}
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c.charAt(0) + c.slice(1).toLowerCase()}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="label">Priority</label>
              <select
                name="priority"
                className="input"
                value={form.priority}
                onChange={handleChange}
              >
                {PRIORITIES.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {error && <ErrorAlert message={error} />}

          <button type="submit" className="btn-primary w-full" disabled={loading}>
            <Send className="h-4 w-4" />
            {loading ? "Submitting..." : "Submit Complaint"}
          </button>
        </form>
      </div>
    </div>
  );
}
