import { Reveal } from "@/components/motion/Reveal";
import type { VerificationService } from "@/lib/content/verification-content";
import { VERIFICATION_SERVICES } from "@/lib/content/verification-content";

function chunkServices<T>(items: T[], size: number): T[][] {
  const groups: T[][] = [];
  for (let i = 0; i < items.length; i += size) {
    groups.push(items.slice(i, i + size));
  }
  return groups;
}

function VerificationServiceCard({ service }: { service: VerificationService }) {
  return (
    <article className="flex h-full flex-col marketing-box rounded-lg p-6 shadow-sm">
      <p className="text-xs font-semibold tracking-[0.2em] text-[#c88e4a] uppercase">
        Service {service.n}
      </p>
      <h3 className="mt-2 text-base font-semibold text-[#001a3d]">{service.title}</h3>
      <p className="mt-3 text-sm leading-relaxed text-[#444444]">{service.summary}</p>

      {"sections" in service && service.sections ? (
        <ul className="mt-4 space-y-2">
          {service.sections.map((section) => (
            <li key={section.title} className="text-sm leading-relaxed text-[#555555]">
              <span className="font-medium text-[#001a3d]">{section.title}:</span> {section.text}
            </li>
          ))}
        </ul>
      ) : null}

      {"items" in service && service.items && service.items.length > 0 ? (
        <ul className="mt-4 space-y-1.5">
          {service.items.slice(0, 4).map((item) => (
            <li key={item} className="flex gap-2 text-sm leading-relaxed text-[#555555]">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#d4a84b]" />
              {item}
            </li>
          ))}
          {service.items.length > 4 ? (
            <li className="text-xs text-[#888888]">+ {service.items.length - 4} more areas</li>
          ) : null}
        </ul>
      ) : null}

      {"body" in service && service.body ? (
        <p className="mt-3 text-sm leading-relaxed text-[#555555]">{service.body}</p>
      ) : null}

      {"note" in service && service.note ? (
        <p className="mt-4 text-xs leading-relaxed text-[#777777]">{service.note}</p>
      ) : null}
    </article>
  );
}

const SERVICE_GROUPS = chunkServices(VERIFICATION_SERVICES, 3);

export function VerificationServicesSection() {
  return (
    <div id="our-services" className="scroll-mt-24">
      {SERVICE_GROUPS.map((group, groupIndex) => {
        const background = groupIndex % 2 === 0 ? "bg-[#f3f1ec]" : "bg-white";

        return (
          <section key={groupIndex} className={`${background} marketing-section`}>
            <div className="container-page">
              {groupIndex === 0 ? (
                <Reveal>
                  <h2 className="text-2xl font-semibold text-[#001a3d] sm:text-3xl">
                    Our verification services
                  </h2>
                  <p className="mt-3 max-w-3xl text-base text-[#555555]">
                    We help verify whether a company is legally established, operational, licensed,
                    commercially credible and capable of performing the proposed transaction.
                  </p>
                </Reveal>
              ) : null}

              <div
                className={`grid gap-5 ${group.length === 3 ? "md:grid-cols-3" : group.length === 2 ? "md:grid-cols-2" : "md:grid-cols-1"} ${groupIndex === 0 ? "mt-10" : "mt-0"}`}
              >
                {group.map((service, index) => (
                  <Reveal key={service.n} delay={index * 0.05}>
                    <VerificationServiceCard service={service} />
                  </Reveal>
                ))}
              </div>
            </div>
          </section>
        );
      })}
    </div>
  );
}
