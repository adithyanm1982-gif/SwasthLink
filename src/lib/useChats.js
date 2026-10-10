import { useState } from "react";
import { usePersisted } from "./store";
import { askAI } from "./api";
import { uid } from "./utils";

// Chat history for the AI assistant. Conversations are saved per user in this browser.
export default function useChats(ownerId) {
  const [chats, setChats] = usePersisted("swl-chats-" + ownerId, []);
  const [activeId, setActiveId] = useState(null);
  const [busy, setBusy] = useState(false);
  const active = chats.find((c) => c.id === activeId) || null;
  const append = (id, m) => setChats((l) => l.map((c) => (c.id === id ? { ...c, updated: Date.now(), messages: [...c.messages, m] } : c)));

  const send = async (text) => {
    const q = text.trim();
    if (!q || busy) return;
    const msg = { id: uid("m"), r: "me", text: q };
    const prior = active?.messages || [];
    let id = activeId;
    if (!id) {
      id = uid("CHAT");
      setChats((l) => [{ id, title: q.length > 42 ? q.slice(0, 42) + "…" : q, updated: Date.now(), messages: [msg] }, ...l]);
      setActiveId(id);
    } else append(id, msg);
    setBusy(true);
    try {
      const res = await askAI([...prior, msg].map((m) => ({ role: m.r === "me" ? "user" : "assistant", content: m.text })));
      append(id, { id: uid("m"), r: "ai", ...res });
    } catch {
      append(id, { id: uid("m"), r: "ai", text: "I could not reach the assistant. Please try again, or call 108 in an emergency." });
    } finally { setBusy(false); }
  };
  const remove = (id) => { setChats((l) => l.filter((c) => c.id !== id)); if (id === activeId) setActiveId(null); };
  const clearAll = () => { setChats([]); setActiveId(null); };
  return { chats, active, activeId, busy, send, newChat: () => setActiveId(null), select: setActiveId, remove, clearAll };
}
