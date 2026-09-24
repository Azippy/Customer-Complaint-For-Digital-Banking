import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FileText, Mail, Lock, ArrowRight } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { ErrorAlert } from "../components/ui";

export default function Login() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) navigate("/dashboard", { replace: true });
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
      navigate("/dashboard");
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
            Sign in to manage your complaints
          </p>
        </div>

        <div className="card p-8">
          <h2 className="mb-6 text-xl font-bold text-slate-900">Welcome back</h2>
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
                />
              </div>
            </div>
            <div>
              <label className="label">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="password"
                  className="input pl-10"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>
            {error && <ErrorAlert message={error} />}
            <button type="submit" className="btn-primary w-full" disabled={loading}>
              {loading ? "Signing in..." : "Sign in"}
              {!loading && <ArrowRight className="h-4 w-4" />}
            </button>
          </form>
          <p className="mt-6 text-center text-sm text-slate-500">
            Don't have an account?{" "}
            <Link to="/register" className="font-semibold text-indigo-600 hover:text-indigo-700">
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
