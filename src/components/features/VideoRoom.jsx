import { useEffect, useRef, useState } from "react";
import { JitsiMeeting } from "@jitsi/react-sdk";
import { ExternalLink } from "lucide-react";
import { Spinner } from "../ui";

const DOMAIN = import.meta.env.VITE_JITSI_DOMAIN || "meet.jit.si";

// Jitsi Meet video consultation. Room names are unguessable per appointment.
export default function VideoRoom({ room, user, onEnd }) {
  const [slow, setSlow] = useState(false);
  const ready = useRef(false);
  useEffect(() => { const t = setTimeout(() => !ready.current && setSlow(true), 12000); return () => clearTimeout(t); }, []);
  return (
    <div>
      <JitsiMeeting
        domain={DOMAIN} roomName={room}
        userInfo={{ displayName: user.name, email: user.email || "" }}
        configOverwrite={{ prejoinPageEnabled: false, startWithAudioMuted: true, disableDeepLinking: true, subject: "Swasthlink Consultation" }}
        interfaceConfigOverwrite={{ MOBILE_APP_PROMO: false, SHOW_JITSI_WATERMARK: false }}
        onApiReady={() => { ready.current = true; setSlow(false); }}
        onReadyToClose={onEnd}
        getIFrameRef={(n) => { n.style.height = "560px"; n.style.width = "100%"; n.style.border = "1px solid rgb(var(--c-black))"; }}
        spinner={() => <div className="grid h-[560px] place-items-center border border-black"><Spinner label="Connecting to secure video room" /></div>}
      />
      {slow && <p className="mt-2 text-sm text-zinc-600">Taking long? <a className="inline-flex items-center gap-1 underline" href={`https://${DOMAIN}/${room}`} target="_blank" rel="noreferrer">Open the room in a new tab <ExternalLink size={12} /></a></p>}
    </div>
  );
}
