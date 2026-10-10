import { Phone } from "lucide-react";
import TriagePanel from "../../components/features/TriagePanel";

const LINES = [["108", "Ambulance"], ["112", "National emergency"], ["102", "Mother & child ambulance"], ["104", "Health helpline"], ["14416", "Tele-MANAS mental health"]];
export default function Emergency() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <h1 className="text-3xl font-semibold tracking-tight">Emergency triage</h1>
      <p className="mt-1 text-sm text-zinc-600">If life is at risk, call 108 first. Use this page to alert a hospital and assign an ambulance.</p>
      <div className="my-6 grid gap-px border border-black bg-black sm:grid-cols-5">{LINES.map(([n, l]) => (
        <a key={n} href={`tel:${n}`} className="flex items-center gap-3 bg-white p-4 hover:bg-zinc-100"><Phone size={18} className="text-red-600" /><div><div className="font-mono text-xl">{n}</div><div className="text-xs text-zinc-600">{l}</div></div></a>))}</div>
      <TriagePanel />
    </div>
  );
}
