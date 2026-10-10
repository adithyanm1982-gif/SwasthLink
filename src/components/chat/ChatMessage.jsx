import { useNavigate } from "react-router-dom";
import { Sparkles, Copy, Volume2, AlertTriangle, Phone } from "lucide-react";
import { useApp } from "../../lib/store";

export const Typing = () => (
  <div className="flex gap-3" aria-live="polite" aria-label="Assistant is typing">
    <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-black text-white"><Sparkles size={14} /></div>
    <div className="typing flex items-center gap-1.5 pt-3"><span /><span /><span /></div>
  </div>
);

export default function ChatMessage({ m }) {
  const nav = useNavigate(); const { toast } = useApp();
  if (m.r === "me") {
    return (<div className="flex justify-end"><div className="max-w-[85%] whitespace-pre-wrap rounded-3xl rounded-br-md bg-zinc-100 px-4 py-2.5 text-sm leading-6">{m.text}</div></div>);
  }
  const copy = async () => { try { await navigator.clipboard.writeText(m.text); toast("Copied", "ok"); } catch { toast("Copy failed", "alert"); } };
  const speak = () => { if ("speechSynthesis" in window) { speechSynthesis.cancel(); speechSynthesis.speak(new SpeechSynthesisUtterance(m.text)); } else toast("Read aloud is not supported here", "alert"); };
  return (
    <div className="flex gap-3">
      <div className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-full bg-black text-white"><Sparkles size={14} /></div>
      <div className="min-w-0 flex-1">
        {m.urgent && (
          <div className="mb-3 rounded-xl border border-red-600 p-3">
            <div className="flex items-center gap-2 text-sm font-semibold text-red-600"><AlertTriangle size={16} /> Possible emergency</div>
            <div className="mt-2 flex flex-wrap gap-2">
              <button className="press rounded-full bg-red-600 px-4 py-1.5 text-sm text-white" onClick={() => nav("/app/triage")}>Open emergency triage</button>
              <a href="tel:108" className="press flex items-center gap-1 rounded-full border border-red-600 px-4 py-1.5 text-sm text-red-600"><Phone size={14} /> Call 108</a>
            </div>
          </div>
        )}
        <p className="whitespace-pre-wrap text-sm leading-7">{m.text}</p>
        {m.specialty && !m.urgent && (
          <div className="mt-3 flex flex-wrap gap-2">
            <button className="press rounded-full border border-black px-4 py-1.5 text-sm hover:bg-zinc-100" onClick={() => nav(`/doctors?field=${encodeURIComponent(m.specialty)}`)}>Find {m.specialty} doctors</button>
            <button className="press rounded-full border border-zinc-300 px-4 py-1.5 text-sm hover:border-black" onClick={() => nav("/app/consult/instant")}>Start a video consult</button>
          </div>
        )}
        <div className="mt-2 flex gap-1 text-zinc-500">
          <button className="rounded-md p-1.5 hover:bg-zinc-100 hover:text-black" aria-label="Copy reply" onClick={copy}><Copy size={14} /></button>
          <button className="rounded-md p-1.5 hover:bg-zinc-100 hover:text-black" aria-label="Read reply aloud" onClick={speak}><Volume2 size={14} /></button>
        </div>
      </div>
    </div>
  );
}
