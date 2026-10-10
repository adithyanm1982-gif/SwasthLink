import { useEffect, useRef, useState } from "react";
import { Mic, ArrowUp } from "lucide-react";
import { cn } from "../../lib/utils";

export default function ChatComposer({ onSend, busy }) {
  const [text, setText] = useState(""); const [listen, setListen] = useState(false); const [note, setNote] = useState("");
  const ta = useRef(); const rec = useRef();
  useEffect(() => { const el = ta.current; if (!el) return; el.style.height = "auto"; el.style.height = Math.min(el.scrollHeight, 160) + "px"; }, [text]);
  const submit = () => { if (!text.trim() || busy) return; onSend(text); setText(""); };
  const voice = () => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) return setNote("Voice input is not supported in this browser. Use Chrome or Edge.");
    if (listen) return rec.current?.stop();
    const r = new SR(); r.lang = "en-IN";
    r.onresult = (e) => setText((t) => (t ? t + " " : "") + e.results[0][0].transcript);
    r.onend = () => setListen(false); r.onerror = () => setListen(false);
    rec.current = r; setNote(""); setListen(true); r.start();
  };
  return (
    <div className="px-4 pb-4 pt-2">
      <div className="mx-auto max-w-3xl">
        <div className="flex items-end gap-1 rounded-3xl border border-zinc-300 bg-white p-2 shadow-sm transition-colors focus-within:border-black">
          <button type="button" onClick={voice} aria-label="Voice input" aria-pressed={listen}
            className={cn("grid h-9 w-9 shrink-0 place-items-center rounded-full", listen ? "bg-red-600 text-white" : "text-zinc-600 hover:bg-zinc-100")}><Mic size={18} /></button>
          <textarea ref={ta} rows={1} aria-label="Message" value={text} onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); submit(); } }}
            placeholder={listen ? "Listening…" : "Describe your symptoms or ask a health question"}
            className="max-h-40 flex-1 resize-none bg-transparent px-2 py-2 text-sm outline-none placeholder:text-zinc-400" />
          <button type="button" onClick={submit} disabled={busy || !text.trim()} aria-label="Send"
            className="press grid h-9 w-9 shrink-0 place-items-center rounded-full bg-black text-white disabled:opacity-30"><ArrowUp size={18} /></button>
        </div>
        {note && <p className="mt-2 text-center text-xs text-red-600">{note}</p>}
        <p className="mt-2 text-center text-[11px] text-zinc-500">Swasthlink gives general guidance, not a diagnosis. In an emergency call 108.</p>
      </div>
    </div>
  );
}
