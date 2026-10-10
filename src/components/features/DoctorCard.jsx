import { Link } from "react-router-dom";
import { Star, MapPin, Clock } from "lucide-react";
import { Badge, Button, Card } from "../ui";
import { initials, inr } from "../../lib/utils";

export default function DoctorCard({ d }) {
  return (
    <Card className="flex flex-col gap-3 p-4 lift">
      <div className="flex gap-3">
        <div className="grid h-14 w-14 shrink-0 place-items-center bg-black font-semibold text-white">{initials(d.name)}</div>
        <div className="min-w-0">
          <Link to={`/doctors/${d.id}`} className="block truncate font-semibold hover:underline">{d.name}</Link>
          <div className="text-sm text-zinc-600">{d.field} · {d.exp} yrs</div>
          <div className="mt-1 flex items-center gap-1 text-xs"><Star size={12} fill="currentColor" /> {d.rating}</div>
        </div>
      </div>
      <div className="space-y-1 text-sm text-zinc-700">
        <div className="flex items-center gap-2"><MapPin size={14} /> <span className="truncate">{d.facility}, {d.area}</span></div>
        <div className="flex items-center gap-2"><Clock size={14} /> {d.langs.join(", ")}</div>
      </div>
      <div className="mt-auto flex items-center justify-between border-t border-zinc-200 pt-3">
        <div><div className="font-semibold">{inr(d.fee)}</div><Badge tone={d.status === "On-Duty" ? "ok" : "neutral"}>{d.status}</Badge></div>
        <Link to={`/doctors/${d.id}`}><Button>Book</Button></Link>
      </div>
    </Card>
  );
}
