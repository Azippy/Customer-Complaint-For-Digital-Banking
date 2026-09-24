import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FileText, Mail, Lock, User, ArrowRight } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { ErrorAlert } from "../components/ui";

export default function Register() {
  const { user, register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) navigate("/dashboard", { replace: true });
  }, [user, navigate]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await register(form);
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
            Create an account to get started
          </p>
        </div>

        <div className="card p-8">
          <h2 className="mb-6 text-xl font-bold text-slate-900">Create account</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">First name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    name="firstName"
                    className="input pl-10"
                    placeholder="John"
                    value={form.firstName}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              <div>
                <label className="label">Last name</label>
                <input
                  name="lastName"
                  className="input"
                  placeholder="Doe"
                  value={form.lastName}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div>
              <label className="label">Email address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  name="email"
                  className="input pl-10"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={handleChange}
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
                  name="password"
                  className="input pl-10"
                  placeholder="Min. 6 characters"
                  value={form.password}
                  onChange={handleChange}
                  required
                  minLength={6}
                />
              </div>
            </div>
            {error && <ErrorAlert message={error} />}
            <button type="submit" className="btn-primary w-full" disabled={loading}>
              {loading ? "Creating account..." : "Create account"}
              {!loading && <ArrowRight className="h-4 w-4" />}
            </button>
          </form>
          <p className="mt-6 text-center text-sm text-slate-500">
            Already have an account?{" "}
            <Link to="/login" className="font-semibold text-indigo-600 hover:text-indigo-700">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
