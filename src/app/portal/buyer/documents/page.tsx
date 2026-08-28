import { PortalPage } from "@/components/portal/PortalPage";
import { BuyerLoiUploadPanel } from "@/components/portal/BuyerLoiUploadPanel";

export default function DocumentsPage() {
  return (
    <PortalPage
      title="Documents"
      description="Upload your Letter of Intent and view document status by transaction."
    >
      <BuyerLoiUploadPanel />
    </PortalPage>
  );
}
