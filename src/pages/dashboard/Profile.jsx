import { useState } from "react";
import { useApp } from "../../lib/store";
import { PageHeader, Card, Field, Input, Select, Button } from "../../components/ui";
import HealthIdCard from "../../components/features/HealthIdCard";
import { LANGS } from "../../lib/i18n";
import { downloadJSON } from "../../lib/utils";

export default function Profile() {
  const { user, setUser, lang, setLang, appts, records, orders, reset, toast } = useApp();
  const [name, setName] = useState(user.name); const [email, setEmail] = useState(user.email || "");
  const [pref, setPref] = useState({ sms: true, mail: false, voice: true });
  return (
    <>
      <PageHeader title="Profile & settings" sub={`Signed in as ${user.role}${user.facility ? " at " + user.facility : ""}`} />
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="space-y-3 p-5"><b>Account</b>
          <Field label="Display name"><Input value={name} onChange={(e) => setName(e.target.value)} /></Field><Field label="Email"><Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} /></Field>
          <Field label="Language"><Select value={lang} onChange={(e) => setLang(e.target.value)}>{Object.entries(LANGS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}</Select></Field>
          <Button onClick={() => { setUser({ ...user, name: name.trim() || user.name, email }); toast("Profile saved", "ok"); }}>Save changes</Button></Card>
        <div className="space-y-6">
          {user.role === "patient" && <HealthIdCard user={user} />}
          <Card className="p-5"><b>Notifications</b>{[["sms", "SMS alerts"], ["mail", "Email updates"], ["voice", "Voice assistant"]].map(([k, l]) => (
            <label key={k} className="flex items-center justify-between border-b border-zinc-200 py-3 text-sm last:border-0">{l}<input type="checkbox" className="h-4 w-4 accent-black" checked={pref[k]} onChange={() => setPref({ ...pref, [k]: !pref[k] })} /></label>))}</Card>
          <Card className="space-y-3 p-5"><b>Privacy & security</b><p className="text-sm text-zinc-600">Sessions use a short-lived JWT over HTTPS. Download or erase the data stored in this browser.</p>
            <div className="flex flex-wrap gap-2"><Button v="outline" onClick={() => downloadJSON("swasthlink-data.json", { user, appts, records, orders })}>Download my data</Button><Button v="danger" onClick={() => { reset(); toast("Local data erased"); }}>Erase local data</Button></div></Card>
        </div>
      </div>
    </>
  );
}
