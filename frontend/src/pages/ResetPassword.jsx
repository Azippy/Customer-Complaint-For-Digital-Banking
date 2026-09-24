import { useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { FileText, Lock, ArrowLeft } from "lucide-react";
import { authApi } from "../api/client";
import { ErrorAlert, SuccessAlert } from "../components/ui";

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    setLoading(true);
    try {
      const res = await authApi.resetPassword(token, { password });
      setSuccess(res.message);
      setTimeout(() => navigate("/login"), 2500);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-600 shadow-lg shadow-indigo-600/30">
            <FileText className="h-7 w-7 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">ComplaintPortal</h1>
          <p className="mt-1 text-sm text-slate-400">
            Set a new password
          </p>
        </div>

        <div className="card p-8">
          <h2 className="mb-6 text-xl font-bold text-slate-900">Reset password</h2>
          {success ? (
            <div className="space-y-4">
              <SuccessAlert message={success} />
              <p className="text-center text-sm text-slate-500">
                Redirecting to login...
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="label">New password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    type="password"
                    className="input pl-10"
                    placeholder="Min. 8 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={8}
                    disabled={loading}
                  />
                </div>
              </div>
              <div>
                <label className="label">Confirm password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    type="password"
                    className="input pl-10"
                    placeholder="Re-enter password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    minLength={8}
                    disabled={loading}
                  />
                </div>
              </div>
              {error && <ErrorAlert message={error} />}
              <button type="submit" className="btn-primary w-full" disabled={loading}>
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    Resetting password...
                  </span>
                ) : (
                  "Reset password"
                )}
              </button>
            </form>
          )}
          <p className="mt-6 text-center text-sm text-slate-500">
            <Link to="/login" className="font-semibold text-indigo-600 hover:text-indigo-700 inline-flex items-center gap-1">
              <ArrowLeft className="h-4 w-4" /> Back to login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
