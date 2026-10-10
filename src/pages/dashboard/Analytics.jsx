import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid } from "recharts";
import { CalendarDays, Siren, Users, Bed } from "lucide-react";
import { useApp } from "../../lib/store";
import { PageHeader, Stat, Card } from "../../components/ui";

const WEEK = [["Mon", 42], ["Tue", 51], ["Wed", 47], ["Thu", 58], ["Fri", 63], ["Sat", 39], ["Sun", 22]].map(([d, v]) => ({ d, v }));
const TRIAGE = [["W1", 18], ["W2", 24], ["W3", 21], ["W4", 29], ["W5", 26], ["W6", 33]].map(([d, v]) => ({ d, v }));

const TICK = { fill: "currentColor", fontSize: 12 };
const TIP = { background: "rgb(var(--c-white))", border: "1px solid rgb(var(--c-black))", color: "rgb(var(--c-black))" };

export default function Analytics() {
  const { appts, alerts, user } = useApp();
  return (
    <>
      <PageHeader title="Analytics" sub={`${user.facility || "Your facility"} · sample data blended with live activity`} />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"><Stat icon={CalendarDays} label="Appointments" value={appts.length + 322} note="This week" /><Stat icon={Siren} label="Triage alerts" value={alerts.length + 29} note="Last 30 days" /><Stat icon={Users} label="Active staff" value="86" /><Stat icon={Bed} label="Occupancy" value="78%" /></div>
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Card className="p-4"><b>Appointments by day</b><div className="mt-4 h-64"><ResponsiveContainer><BarChart data={WEEK}><CartesianGrid stroke="currentColor" strokeOpacity={0.15} vertical={false} /><XAxis dataKey="d" tick={TICK} /><YAxis tick={TICK} /><Tooltip contentStyle={TIP} /><Bar dataKey="v" fill="currentColor" /></BarChart></ResponsiveContainer></div></Card>
        <Card className="p-4"><b>Triage alerts per week</b><div className="mt-4 h-64"><ResponsiveContainer><LineChart data={TRIAGE}><CartesianGrid stroke="currentColor" strokeOpacity={0.15} vertical={false} /><XAxis dataKey="d" tick={TICK} /><YAxis tick={TICK} /><Tooltip contentStyle={TIP} /><Line dataKey="v" stroke="currentColor" strokeWidth={2} dot={{ r: 3 }} /></LineChart></ResponsiveContainer></div></Card>
      </div>
    </>
  );
}
