import { Link } from "react-router-dom";
import { Activity } from "lucide-react";

export default function Logo({ to = "/", light }) {
  return (
    <Link to={to} className="flex items-center gap-2 font-bold tracking-[.12em]" aria-label="Swasthlink home">
      <span className={light ? "bg-white p-1 text-black" : "bg-black p-1 text-white"}><Activity size={18} /></span>SWASTHLINK
    </Link>
  );
}
