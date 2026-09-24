import { useAuth } from "../context/AuthContext";
import { User, Mail, Shield, Calendar } from "lucide-react";

export default function Profile() {
  const { user } = useAuth();

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Profile</h1>
        <p className="text-sm text-slate-500">Your account information</p>
      </div>

      <div className="card p-8">
        <div className="flex items-center gap-4">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-indigo-100 text-2xl font-bold text-indigo-700">
            {user?.firstName?.[0]?.toUpperCase()}
            {user?.lastName?.[0]?.toUpperCase()}
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              {user?.firstName} {user?.lastName}
            </h2>
            <p className="text-sm text-slate-500">{user?.email}</p>
          </div>
        </div>

        <div className="mt-6 space-y-4">
          <ProfileRow icon={User} label="Full Name" value={`${user?.firstName} ${user?.lastName}`} />
          <ProfileRow icon={Mail} label="Email" value={user?.email} />
          <ProfileRow
            icon={Shield}
            label="Role"
            value={
              <span className="inline-flex items-center rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-600">
                {user?.role}
              </span>
            }
          />
          <ProfileRow
            icon={Calendar}
            label="Member Since"
            value={user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : "—"}
          />
          <ProfileRow
            icon={Shield}
            label="Account Status"
            value={
              <span className="inline-flex items-center rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-600">
                {user?.isActive ? "Active" : "Inactive"}
              </span>
            }
          />
        </div>
      </div>
    </div>
  );
}

function ProfileRow({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center justify-between border-b border-slate-100 pb-3">
      <div className="flex items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100">
          <Icon className="h-4 w-4 text-slate-500" />
        </div>
        <span className="text-sm font-medium text-slate-500">{label}</span>
      </div>
      <span className="text-sm font-semibold text-slate-900">{value}</span>
    </div>
  );
}
