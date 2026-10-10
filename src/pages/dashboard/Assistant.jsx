import { useEffect, useRef, useState } from "react";
import { PanelLeft, Sparkles, Volume2, VolumeX } from "lucide-react";
import { useApp } from "../../lib/store";
import useChats from "../../lib/useChats";
import ChatSidebar from "../../components/chat/ChatSidebar";
import ChatMessage, { Typing } from "../../components/chat/ChatMessage";
import ChatComposer from "../../components/chat/ChatComposer";
import WelcomeScreen from "../../components/chat/WelcomeScreen";

export default function Assistant() {
  const { user } = useApp();
  const c = useChats(user.id || user.name);
  const [drawer, setDrawer] = useState(false); const [speak, setSpeak] = useState(false);
  const end = useRef(); const was = useRef(false);
  const msgs = c.active?.messages || [];
  const first = (user.name || "there").split(" ")[0];

  useEffect(() => { end.current?.scrollIntoView({ block: "end" }); }, [msgs.length, c.busy, c.activeId]);
  // Read the newest reply aloud when the toggle is on.
  useEffect(() => {
    if (was.current && !c.busy && speak && "speechSynthesis" in window) { const last = msgs[msgs.length - 1]; if (last?.r === "ai") speechSynthesis.speak(new SpeechSynthesisUtterance(last.text)); }
    was.current = c.busy;
  }, [c.busy]);

  return (
    <div className="-m-4 flex h-[calc(100dvh-56px)] overflow-hidden sm:-m-6">
      <ChatSidebar chats={c.chats} activeId={c.activeId} select={c.select} newChat={c.newChat} remove={c.remove} clearAll={c.clearAll} open={drawer} onClose={() => setDrawer(false)} />
      <section className="flex min-w-0 flex-1 flex-col bg-white">
        <header className="flex items-center justify-between border-b border-zinc-200 px-4 py-2.5">
          <div className="flex items-center gap-2">
            <button className="rounded-md p-1.5 hover:bg-zinc-100 md:hidden" onClick={() => setDrawer(true)} aria-label="Open chat history"><PanelLeft size={18} /></button>
            <span className="flex items-center gap-2 font-semibold"><Sparkles size={16} /> Swasthlink Assistant</span>
            <span className="hidden rounded-full border border-zinc-300 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-zinc-600 sm:inline">Health guidance</span>
          </div>
          <button className="rounded-md p-1.5 hover:bg-zinc-100" onClick={() => setSpeak(!speak)} aria-pressed={speak} aria-label="Read replies aloud" title="Read replies aloud">{speak ? <Volume2 size={18} /> : <VolumeX size={18} />}</button>
        </header>
        <div className="thin-scroll flex-1 overflow-y-auto">
          {msgs.length === 0 ? <WelcomeScreen name={first} onPick={c.send} /> : (
            <div className="mx-auto w-full max-w-3xl space-y-6 px-4 py-6">
              {msgs.map((m) => <ChatMessage key={m.id} m={m} />)}
              {c.busy && <Typing />}
              <div ref={end} />
            </div>
          )}
        </div>
        <ChatComposer onSend={c.send} busy={c.busy} />
      </section>
    </div>
  );
}
