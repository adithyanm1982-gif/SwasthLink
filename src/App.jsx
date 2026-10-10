import { Suspense, useEffect } from "react";
import { lazyPage } from "./lib/lazyPage";
import { Routes, Route, Navigate } from "react-router-dom";
import PublicLayout from "./components/layout/PublicLayout";
import DashboardLayout from "./components/layout/DashboardLayout";
import { RequireAuth, RequireRole } from "./components/auth/Guards";
import { PageSkeleton } from "./components/ui";
import Toasts from "./components/common/Toasts";
import ErrorBoundary from "./components/common/ErrorBoundary";
import { NAV } from "./lib/nav";

import Home from "./pages/public/Home";
import NotFound from "./pages/public/NotFound";
import Login from "./pages/public/Login";
import Signup from "./pages/public/Signup";

// Public pages other than Home and auth are code-split; dashboard pages are lazy too.
const Doctors = lazyPage(() => import("./pages/public/Doctors"));
const DoctorProfile = lazyPage(() => import("./pages/public/DoctorProfile"));
const Facilities = lazyPage(() => import("./pages/public/Facilities"));
const Emergency = lazyPage(() => import("./pages/public/Emergency"));
const PAGES = {
  overview: lazyPage(() => import("./pages/dashboard/Overview")), assistant: lazyPage(() => import("./pages/dashboard/Assistant")),
  triage: lazyPage(() => import("./pages/dashboard/Triage")), appointments: lazyPage(() => import("./pages/dashboard/Appointments")),
  consult: lazyPage(() => import("./pages/dashboard/Consult")), reports: lazyPage(() => import("./pages/dashboard/Reports")),
  pharmacy: lazyPage(() => import("./pages/dashboard/Pharmacy")), labs: lazyPage(() => import("./pages/dashboard/Labs")),
  records: lazyPage(() => import("./pages/dashboard/Records")), queue: lazyPage(() => import("./pages/dashboard/Queue")),
  analytics: lazyPage(() => import("./pages/dashboard/Analytics")), staff: lazyPage(() => import("./pages/dashboard/Staff")),
  capacity: lazyPage(() => import("./pages/dashboard/Capacity")), alerts: lazyPage(() => import("./pages/dashboard/Alerts")),
  profile: lazyPage(() => import("./pages/dashboard/Profile")),
};

const ALL = [Doctors, DoctorProfile, Facilities, Emergency, ...Object.values(PAGES)];

// Used by main.jsx: load the code for the page in the address bar BEFORE the first render,
// so refreshing or opening a deep link never flashes a loading skeleton.
export function preloadFor(path) {
  const seg = path.split("/").filter(Boolean);
  let page = null;
  if (seg[0] === "doctors") page = seg[1] ? DoctorProfile : Doctors;
  else if (seg[0] === "facilities") page = Facilities;
  else if (seg[0] === "emergency") page = Emergency;
  else if (seg[0] === "app") { const n = NAV.find((x) => (x.path === "" ? !seg[1] : x.path.split("/")[0] === seg[1])); page = n && PAGES[n.key]; }
  return page ? page.preload().catch(() => {}) : Promise.resolve();
}

export default function App() {
  // Start downloading every page right after first paint so each click renders instantly.
  useEffect(() => { const run = () => ALL.forEach((p) => p.preload().catch(() => {})); const id = setTimeout(run, 50); return () => clearTimeout(id); }, []);
  return (
    <ErrorBoundary>
      <Suspense fallback={<PageSkeleton />}>
        <Routes>
          <Route element={<PublicLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/doctors" element={<Doctors />} />
            <Route path="/doctors/:id" element={<DoctorProfile />} />
            <Route path="/facilities" element={<Facilities />} />
            <Route path="/emergency" element={<Emergency />} />
            <Route path="*" element={<NotFound />} />
          </Route>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/app" element={<RequireAuth><DashboardLayout /></RequireAuth>}>
            {NAV.map((n) => {
              const Page = PAGES[n.key];
              const el = <RequireRole roles={n.roles}><Page /></RequireRole>;
              return n.path === "" ? <Route key={n.key} index element={el} /> : <Route key={n.key} path={n.path} element={el} />;
            })}
            <Route path="*" element={<Navigate to="/app" replace />} />
          </Route>
        </Routes>
      </Suspense>
      <Toasts />
    </ErrorBoundary>
  );
}
