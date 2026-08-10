import { SiteHeader } from "@/components/marketing/SiteHeader";
import { SiteFooter } from "@/components/marketing/SiteFooter";
import { AiAssistant } from "@/components/marketing/AiAssistant";
import { MarketingMain } from "@/components/marketing/MarketingMain";
import { PageTransition } from "@/components/motion/PageTransition";

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-full w-full max-w-full flex-col overflow-x-clip">
      <SiteHeader />
      <MarketingMain>
        <PageTransition>{children}</PageTransition>
      </MarketingMain>
      <SiteFooter />
      <AiAssistant />
    </div>
  );
}
