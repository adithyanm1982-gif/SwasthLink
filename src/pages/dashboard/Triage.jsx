import TriagePanel from "../../components/features/TriagePanel";
import { PageHeader } from "../../components/ui";

export default function Triage() {
  return (<><PageHeader title="Emergency triage" sub="Select symptoms, confirm the level and dispatch. For life-threatening cases call 108." /><TriagePanel /></>);
}
