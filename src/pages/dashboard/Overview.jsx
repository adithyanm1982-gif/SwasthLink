import { Link } from "react-router-dom";
import { CalendarDays, FileText, Pill, Bell, Users, Bed, Siren, ClipboardList } from "lucide-react";
import { useApp } from "../../lib/store";
import { PageHeader, Stat, Card, Button, Badge, Empty } from "../../components/ui";
import HealthIdCard from "../../components/features/HealthIdCard";
import { dayLabel } from "../../lib/utils";

export default function Overview() {
  const { user, appts, records, orders, alerts } = useApp();
  const up = appts.filter((a) => a.status === "Booked").sort((a, b) => a.date.localeCompare(b.date));
  const open = alerts.filter((a) => !a.ack).length;
  const stats = {
    patient: [[CalendarDays, "Upcoming visits", up.length], [FileText, "Records", records.length], [Pill, "Orders", orders.length]],
    guest: [[Siren, "Triage levels", 3], [FileText, "Tools available", 5], [Bell, "Support", "24x7"]],
    worker: [[ClipboardList, "In queue", up.length], [Bell, "Open alerts", open], [Users, "Facility", user.facility ? "Linked" : "None"]],
    authority: [[Bed, "Open alerts", open], [CalendarDays, "Appointments", appts.length], [Users, "Facility", user.facility ? "Linked" : "None"]],
  }[user.role];
  const quick = { patient: [["/doctors", "Book a doctor"], ["/app/assistant", "Ask the assistant"], ["/app/reports", "Analyze a report"], ["/app/triage", "Emergency triage"]], guest: [["/app/assistant", "Ask the assistant"], ["/app/triage", "Emergency triage"], ["/app/pharmacy", "Order medicines"]], worker: [["/app/queue", "Open patient queue"], ["/app/alerts", "View alerts"], ["/app/reports", "Analyze a report"]], authority: [["/app/analytics", "View analytics"], ["/app/staff", "Manage staff"], ["/app/capacity", "Update capacity"], ["/app/alerts", "Alerts & fleet"]] }[user.role];
  return (
    <>
      <PageHeader title={`Welcome, ${user.name}`} sub={user.facility ? `Signed in at ${user.facility}` : "Your Swasthlink workspace"} />
      <div className="grid gap-4 sm:grid-cols-3">{stats.map(([I, l, v]) => <Stat key={l} icon={I} label={l} value={v} />)}</div>
      <div className="mt-4 flex flex-wrap gap-2">{quick.map(([to, l]) => <Link key={to} to={to}><Button v="outline">{l}</Button></Link>)}</div>
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        {(user.role === "patient" || user.role === "worker") && (
          <Card className="p-4"><b>{user.role === "worker" ? "Today's consultations" : "Upcoming appointments"}</b>
            <div className="mt-3 divide-y divide-zinc-200">{up.slice(0, 4).map((a) => (
              <div key={a.id} className="flex items-center justify-between py-2 text-sm"><div><div className="font-medium">{user.role === "worker" ? a.patientName : a.doctorName}</div><div className="text-zinc-600">{dayLabel(a.date)} · {a.time} · {a.field}</div></div><Badge>{a.mode}</Badge></div>))}
              {!up.length && <Empty title="Nothing scheduled" hint="Book a consultation to see it here." />}</div></Card>)}
        {user.role === "patient" && <HealthIdCard user={user} />}
        {user.role === "guest" && <Card className="p-4"><b>You are browsing as a guest</b><p className="mt-2 text-sm text-zinc-600">Create an account to book doctors, keep health records and join video consultations.</p><Link to="/signup"><Button className="mt-3">Create account</Button></Link></Card>}
        {user.role === "authority" && <Card className="p-4"><b>Facility summary</b><p className="mt-2 text-sm text-zinc-600">{user.facility || "No facility linked"}. Use Capacity to publish bed availability and Alerts to respond to triage dispatches.</p></Card>}
      </div>
    </>
  );
}
