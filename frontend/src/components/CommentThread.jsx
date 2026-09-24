import { useState, useEffect } from "react";
import { MessageSquare, Send } from "lucide-react";
import { commentApi } from "../api/client";
import { Spinner, EmptyState, ErrorAlert } from "./ui";
import { useAuth } from "../context/AuthContext";

export default function CommentThread({ complaintMongoId }) {
  const { user } = useAuth();
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const fetchComments = async () => {
    try {
      setLoading(true);
      const res = await commentApi.list(complaintMongoId);
      setComments(res.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [complaintMongoId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    setSubmitting(true);
    setError("");
    try {
      await commentApi.create(complaintMongoId, message);
      setMessage("");
      fetchComments();
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="card p-6">
      <div className="mb-4 flex items-center gap-2">
        <MessageSquare className="h-5 w-5 text-indigo-600" />
        <h3 className="text-base font-bold text-slate-900">Comments</h3>
        <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-500">
          {comments.length}
        </span>
      </div>

      <form onSubmit={handleSubmit} className="mb-5">
        <textarea
          className="input min-h-[80px] resize-y"
          placeholder="Write a comment..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          maxLength={5000}
        />
        {error && <div className="mt-2"><ErrorAlert message={error} /></div>}
        <div className="mt-2 flex justify-end">
          <button type="submit" className="btn-primary" disabled={submitting || !message.trim()}>
            <Send className="h-4 w-4" />
            {submitting ? "Sending..." : "Post Comment"}
          </button>
        </div>
      </form>

      {loading ? (
        <Spinner />
      ) : comments.length === 0 ? (
        <EmptyState
          icon={MessageSquare}
          title="No comments yet"
          description="Be the first to add a comment to this complaint."
        />
      ) : (
        <div className="space-y-4">
          {comments.map((comment) => {
            const isOwn = comment.user?._id === user?._id;
            return (
              <div
                key={comment._id}
                className={`flex gap-3 ${isOwn ? "flex-row-reverse" : ""}`}
              >
                <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-indigo-100 text-sm font-semibold text-indigo-700">
                  {comment.user?.firstName?.[0]?.toUpperCase() || "?"}
                </div>
                <div className={`max-w-[80%] ${isOwn ? "text-right" : ""}`}>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-slate-900">
                      {comment.user?.firstName} {comment.user?.lastName}
                    </span>
                    <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-500">
                      {comment.user?.role}
                    </span>
                    <span className="text-xs text-slate-400">
                      {new Date(comment.createdAt).toLocaleString()}
                    </span>
                  </div>
                  <div
                    className={`mt-1 inline-block rounded-lg px-4 py-2.5 text-sm ${
                      isOwn
                        ? "bg-indigo-600 text-white"
                        : "bg-slate-100 text-slate-700"
                    }`}
                  >
                    {comment.message}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
