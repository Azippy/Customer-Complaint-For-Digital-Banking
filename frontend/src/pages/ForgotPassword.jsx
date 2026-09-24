import { useState } from "react";
import { Link } from "react-router-dom";
import { FileText, Mail, ArrowRight, ArrowLeft } from "lucide-react";
import { authApi } from "../api/client";
import { ErrorAlert, SuccessAlert } from "../components/ui";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      const res = await authApi.forgotPassword({ email });
      setSuccess(res.message);
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
            Reset your password
          </p>
        </div>

        <div className="card p-8">
          <h2 className="mb-2 text-xl font-bold text-slate-900">Forgot password</h2>
          <p className="mb-6 text-sm text-slate-500">
            Enter your email address and we'll send you a link to reset your password.
          </p>
          {success ? (
            <div className="space-y-4">
              <SuccessAlert message={success} />
              <Link
                to="/login"
                className="btn-primary w-full flex items-center justify-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" /> Back to login
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="label">Email address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    type="email"
                    className="input pl-10"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={loading}
                  />
                </div>
              </div>
              {error && <ErrorAlert message={error} />}
              <button type="submit" className="btn-primary w-full" disabled={loading}>
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    Sending link...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    Send reset link <ArrowRight className="h-4 w-4" />
                  </span>
                )}
              </button>
            </form>
          )}
          <p className="mt-6 text-center text-sm text-slate-500">
            Remember your password?{" "}
            <Link to="/login" className="font-semibold text-indigo-600 hover:text-indigo-700">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
