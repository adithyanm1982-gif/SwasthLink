import { LayoutDashboard, Bot, ScanText, Siren, CalendarDays, Video, Pill, FlaskConical, FileText, Users, Bed, Bell, Settings, ClipboardList, BarChart3 } from "lucide-react";

export const ROLE_LABEL = { patient: "Patient", authority: "Authority", worker: "Worker / Doctor", guest: "Guest" };
const ALL = ["patient", "guest", "worker", "authority"];
// key maps to a lazy page in App.jsx. roles drives both the sidebar and RBAC route guards.
export const NAV = [
  { key: "overview", path: "", to: "/app", label: "Overview", icon: LayoutDashboard, roles: ALL, end: true },
  { key: "assistant", path: "assistant", to: "/app/assistant", label: "AI Assistant", icon: Bot, roles: ["patient", "guest", "worker"] },
  { key: "triage", path: "triage", to: "/app/triage", label: "Emergency Triage", icon: Siren, roles: ALL },
  { key: "appointments", path: "appointments", to: "/app/appointments", label: "Appointments", icon: CalendarDays, roles: ["patient"] },
  { key: "consult", path: "consult/:id", to: "/app/consult/instant", label: "Video Consult", icon: Video, roles: ["patient", "guest", "worker"] },
  { key: "reports", path: "reports", to: "/app/reports", label: "Report Analyzer", icon: ScanText, roles: ["patient", "guest", "worker"] },
  { key: "pharmacy", path: "pharmacy", to: "/app/pharmacy", label: "Pharmacy", icon: Pill, roles: ["patient", "guest"] },
  { key: "labs", path: "labs", to: "/app/labs", label: "Lab Tests", icon: FlaskConical, roles: ["patient", "guest"] },
  { key: "records", path: "records", to: "/app/records", label: "Health Records", icon: FileText, roles: ["patient"] },
  { key: "queue", path: "queue", to: "/app/queue", label: "Patient Queue", icon: ClipboardList, roles: ["worker"] },
  { key: "analytics", path: "analytics", to: "/app/analytics", label: "Analytics", icon: BarChart3, roles: ["authority"] },
  { key: "staff", path: "staff", to: "/app/staff", label: "Staff", icon: Users, roles: ["authority"] },
  { key: "capacity", path: "capacity", to: "/app/capacity", label: "Capacity", icon: Bed, roles: ["authority"] },
  { key: "alerts", path: "alerts", to: "/app/alerts", label: "Alerts & Fleet", icon: Bell, roles: ["authority", "worker"] },
  { key: "profile", path: "profile", to: "/app/profile", label: "Profile & Settings", icon: Settings, roles: ["patient", "worker", "authority"] },
];
