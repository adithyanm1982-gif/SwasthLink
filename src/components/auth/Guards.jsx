import { Navigate, useLocation, Link } from "react-router-dom";
import { ShieldAlert } from "lucide-react";
import { useApp } from "../../lib/store";
import { Empty } from "../ui";

export function RequireAuth({ children }) {
  const { user } = useApp();
  const loc = useLocation();
  return user ? children : <Navigate to="/login" state={{ from: loc.pathname }} replace />;
}

// Role-based access control on the client. The Express API enforces the same rules server-side.
export function RequireRole({ roles, children }) {
  const { user } = useApp();
  if (user && roles.includes(user.role)) return children;
  return (
    <div className="p-6"><Empty title="Access restricted" hint="Your role does not have permission to open this page."
      action={<Link to="/app" className="mt-2 inline-flex items-center gap-2 border border-black px-4 py-2 text-sm"><ShieldAlert size={14} /> Back to overview</Link>} /></div>
  );
}
