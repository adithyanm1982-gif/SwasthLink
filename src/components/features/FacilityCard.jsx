import { MapPin, Phone, Clock, BedDouble, Navigation } from "lucide-react";
import { Badge, Card } from "../ui";

export default function FacilityCard({ f }) {
  const map = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(f.name + " " + f.area + " Chennai")}`;
  return (
    <Card className="lift flex flex-col gap-2 p-4">
      <div className="flex items-start justify-between gap-2"><b className="leading-tight">{f.name}</b><Badge>{f.kind}</Badge></div>
      <div className="space-y-1 text-sm text-zinc-700">
        <div className="flex items-center gap-2"><MapPin size={14} /> {f.area}, Chennai</div>
        <div className="flex items-center gap-2"><Clock size={14} /> {f.hours}</div>
        {f.beds > 0 && <div className="flex items-center gap-2"><BedDouble size={14} /> {f.beds} beds · {f.icu} ICU</div>}
      </div>
      <div className="mt-auto flex gap-2 pt-2">
        <a className="flex flex-1 items-center justify-center gap-2 border border-black px-3 py-1.5 text-sm hover:bg-zinc-100" href={`tel:${f.phone.replace(/[^+\d]/g, "")}`}><Phone size={14} /> Call</a>
        <a className="flex flex-1 items-center justify-center gap-2 border border-black px-3 py-1.5 text-sm hover:bg-zinc-100" href={map} target="_blank" rel="noreferrer"><Navigation size={14} /> Directions</a>
      </div>
    </Card>
  );
}
