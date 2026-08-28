import { SiteHeader } from "@/components/marketing/SiteHeader";
import { SiteFooter } from "@/components/marketing/SiteFooter";
import { AiAssistant } from "@/components/marketing/AiAssistant";
import { MarketingMain } from "@/components/marketing/MarketingMain";
import { PageTransition } from "@/components/motion/PageTransition";
import { ClientOnly } from "@/components/ui/ClientOnly";
import { AutoPageTranslator } from "@/components/i18n/AutoPageTranslator";
import { TranslationProvider } from "@/components/i18n/TranslationProvider";

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <TranslationProvider>
      <div id="finekarts-marketing-root" className="flex min-h-full w-full max-w-full flex-col overflow-x-clip">
        <SiteHeader />
        <MarketingMain>
          <PageTransition>{children}</PageTransition>
        </MarketingMain>
        <SiteFooter />
        <ClientOnly>
          <AiAssistant />
        </ClientOnly>
        <AutoPageTranslator />
      </div>
    </TranslationProvider>
  );
}
