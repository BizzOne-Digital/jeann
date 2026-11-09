import { IntermediaryDashboard } from "@/components/portal/IntermediaryDashboard";

export const dynamic = "force-dynamic";

export default function BrokerDashboard() {
  return <IntermediaryDashboard kind="broker" />;
}
