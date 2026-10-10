import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Camera, CameraOff, Mic, MicOff } from "lucide-react";
import { useApp } from "../../lib/store";
import { PageHeader, Button, Card, Textarea, Field, Input } from "../../components/ui";
import VideoRoom from "../../components/features/VideoRoom";
import { hash } from "../../lib/utils";

export default function Consult() {
  const { id } = useParams(); const nav = useNavigate(); const { user, appts, updateAppt, addRecord, toast } = useApp();
  const appt = appts.find((a) => a.id === id);
  const room = "swasthlink-" + (appt ? id : "instant") + "-" + hash((appt ? id : user.id) + "swl").toString(36);
  const [stage, setStage] = useState("lobby"); const [cam, setCam] = useState(true); const [mic, setMic] = useState(true); const [perm, setPerm] = useState("");
  const [notes, setNotes] = useState(""); const [rx, setRx] = useState(""); const vid = useRef(); const stream = useRef();
  const stop = () => { stream.current?.getTracks().forEach((t) => t.stop()); stream.current = null; };

  useEffect(() => {
    if (stage !== "lobby") return;
    let live = true;
    navigator.mediaDevices?.getUserMedia({ video: cam, audio: mic }).then((s) => { if (!live) return s.getTracks().forEach((t) => t.stop()); stop(); stream.current = s; if (vid.current) vid.current.srcObject = s; setPerm(""); })
      .catch(() => setPerm("Camera or microphone is blocked. You can still join, or allow access in your browser settings."));
    return () => { live = false; };
  }, [stage, cam, mic]);
  useEffect(() => stop, []);

  const end = () => { stop(); setStage("ended"); if (appt && user.role === "worker") updateAppt(appt.id, { status: "Completed" }); };
  const saveRx = () => { if (!rx.trim() && !notes.trim()) return toast("Nothing to save", "alert"); addRecord({ type: "Prescription", title: `Consultation ${appt?.id || "instant"}`, text: `Notes: ${notes}\nPrescription: ${rx}`, by: user.name }); toast("Saved to records", "ok"); };

  if (stage === "ended") return (<Card className="mx-auto max-w-lg p-8 text-center"><h1 className="text-xl font-semibold">Consultation ended</h1><p className="mt-2 text-sm text-zinc-600">Thank you. Your notes and prescriptions are in Health Records.</p>
    <div className="mt-4 flex justify-center gap-2"><Button onClick={() => nav("/app")}>Back to overview</Button><Button v="outline" onClick={() => setStage("lobby")}>Rejoin</Button></div></Card>);

  return (
    <>
      <PageHeader title={appt ? `Consultation with ${user.role === "worker" ? appt.patientName : appt.doctorName}` : "Instant consult room"} sub={appt ? `${appt.date} at ${appt.time}` : "Share the room link with your doctor to start."} />
      {stage === "lobby" ? (
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="border border-black bg-black"><video ref={vid} autoPlay muted playsInline className="aspect-video w-full object-cover" /></div>
          <Card className="space-y-4 p-5"><b>Check your devices</b>
            <div className="flex gap-2"><Button v="outline" onClick={() => setCam(!cam)}>{cam ? <Camera size={14} /> : <CameraOff size={14} />} Camera {cam ? "on" : "off"}</Button><Button v="outline" onClick={() => setMic(!mic)}>{mic ? <Mic size={14} /> : <MicOff size={14} />} Mic {mic ? "on" : "off"}</Button></div>
            {perm && <p className="text-sm text-red-600">{perm}</p>}
            <Field label="Room link"><Input readOnly value={`https://${import.meta.env.VITE_JITSI_DOMAIN || "meet.jit.si"}/${room}`} onFocus={(e) => e.target.select()} /></Field>
            <Button className="w-full py-3" onClick={() => { stop(); setStage("live"); }}>Join secure video room</Button>
            <p className="text-xs text-zinc-500">Video is peer-to-peer through Jitsi Meet and is not recorded by Swasthlink.</p></Card>
        </div>
      ) : (
        <div className="grid gap-6 xl:grid-cols-[1fr_320px]">
          <div><VideoRoom room={room} user={user} onEnd={end} /><Button v="danger" className="mt-3" onClick={end}>End consultation</Button></div>
          <Card className="h-fit space-y-3 p-4"><b>Consultation notes</b>
            <Textarea rows={5} aria-label="Notes" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Symptoms, observations, advice" />
            {user.role === "worker" && <Field label="Prescription"><Textarea rows={4} value={rx} onChange={(e) => setRx(e.target.value)} placeholder="Medicine, dose, duration" /></Field>}
            <Button v="outline" className="w-full" onClick={saveRx}>Save to records</Button></Card>
        </div>
      )}
      <p className="mt-4 text-sm"><Link className="underline" to="/app/appointments">Back to appointments</Link></p>
    </>
  );
}
