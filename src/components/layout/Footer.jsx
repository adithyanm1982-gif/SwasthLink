import { Link } from "react-router-dom";
import Logo from "../common/Logo";

export default function Footer() {
  const col = (title, items) => (
    <div><div className="mono mb-3 !text-zinc-400">{title}</div><ul className="space-y-2 text-sm">{items.map(([to, l]) => <li key={l}><Link className="hover:underline" to={to}>{l}</Link></li>)}</ul></div>
  );
  return (
    <footer className="keep-light mt-16 bg-black text-white">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 md:grid-cols-4">
        <div><Logo light /><p className="mt-3 max-w-xs text-sm text-zinc-400">A unified AI triage and tele-care grid for Chennai, inspired by India's eSanjeevani infrastructure.</p></div>
        {col("Care", [["/doctors", "Find doctors"], ["/emergency", "Emergency triage"], ["/facilities", "Hospitals & labs"]])}
        {col("Account", [["/login", "Log in"], ["/signup", "Sign up"], ["/app", "Dashboard"]])}
        <div><div className="mono mb-3 !text-zinc-400">Helplines</div><ul className="space-y-2 text-sm text-zinc-300"><li>108 Ambulance</li><li>112 Emergency</li><li>104 Health helpline</li><li>14416 Tele-MANAS</li></ul></div>
      </div>
      <div className="border-t border-zinc-800 px-4 py-4 text-center font-mono text-[11px] text-zinc-500">© Swasthlink · Demo platform with mock data. Not a substitute for professional medical advice.</div>
    </footer>
  );
}
