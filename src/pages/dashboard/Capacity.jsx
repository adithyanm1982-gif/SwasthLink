import { useApp, usePersisted } from "../../lib/store";
import { PageHeader, Card, Button } from "../../components/ui";

const INIT = { Emergency: 12, ICU: 6, "General ward": 94, "Operating theatres": 3, "Isolation rooms": 4 };
export default function Capacity() {
  const { user, toast } = useApp();
  const [d, setD] = usePersisted("swl-cap-" + user.facilityId, INIT);
  const bump = (k, v) => setD({ ...d, [k]: Math.max(0, d[k] + v) });
  return (
    <>
      <PageHeader title="Capacity" sub="Availability is shared with the triage dispatcher."><Button v="outline" onClick={() => { setD(INIT); toast("Reset to defaults"); }}>Reset</Button></PageHeader>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{Object.keys(d).map((k) => (
        <Card key={k} className="p-4"><div className="mono">{k}</div><div className="my-3 text-4xl font-semibold">{d[k]}</div>
          <div className="flex gap-2"><Button v="outline" aria-label={`Decrease ${k}`} onClick={() => bump(k, -1)}>−</Button><Button v="outline" aria-label={`Increase ${k}`} onClick={() => bump(k, 1)}>+</Button></div></Card>))}</div>
    </>
  );
}
