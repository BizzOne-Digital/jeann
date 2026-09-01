import type { PublicSocialLink } from "@/lib/content/site-settings-public";

const ICONS: Record<string, { label: string; path: string }> = {
  linkedin: {
    label: "LinkedIn",
    path: "M4.98 3.5C4.98 4.88 3.87 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5zM.5 8h4V24H.5V8zm7.5 0h3.8v2.2h.05c.53-1 1.83-2.2 3.77-2.2 4.03 0 4.77 2.65 4.77 6.1V24h-4v-7.1c0-1.7-.03-3.88-2.37-3.88-2.37 0-2.73 1.85-2.73 3.76V24h-4V8z",
  },
  facebook: {
    label: "Facebook",
    path: "M24 12.07C24 5.41 18.63 0 12 0S0 5.41 0 12.07c0 6.02 4.39 11.02 10.13 11.91v-8.4H7.08v-3.5h3.05V9.41c0-3.02 1.79-4.69 4.53-4.69 1.31 0 2.68.23 2.68.23v2.96h-1.51c-1.49 0-1.95.93-1.95 1.88v2.26h3.32l-.53 3.5h-2.79v8.4C19.61 23.09 24 18.09 24 12.07z",
  },
  instagram: {
    label: "Instagram",
    path: "M12 2.16c3.2 0 3.58.01 4.85.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.43.36 1.06.41 2.23.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.25 1.8-.41 2.23-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.43.16-1.06.36-2.23.41-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.8-.25-2.23-.41-.56-.22-.96-.48-1.38-.9-.42-.42-.68-.82-.9-1.38-.16-.43-.36-1.06-.41-2.23-.06-1.27-.07-1.65-.07-4.85s.01-3.58.07-4.85c.05-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.43-.16 1.06-.36 2.23-.41 1.27-.06 1.65-.07 4.85-.07zm0-2.16C8.74 0 8.33.01 7.05.07 5.78.13 4.9.34 4.15.62c-.78.3-1.44.7-2.1 1.36-.66.66-1.06 1.32-1.36 2.1-.28.75-.49 1.63-.55 2.9C.01 8.33 0 8.74 0 12s.01 3.67.07 4.95c.06 1.27.27 2.15.55 2.9.3.78.7 1.44 1.36 2.1.66.66 1.32 1.06 2.1 1.36.75.28 1.63.49 2.9.55 1.28.06 1.69.07 4.95.07s3.67-.01 4.95-.07c1.27-.06 2.15-.27 2.9-.55.78-.3 1.44-.7 2.1-1.36.66-.66 1.06-1.32 1.36-2.1.28-.75.49-1.63.55-2.9.06-1.28.07-1.69.07-4.95s-.01-3.67-.07-4.95c-.06-1.27-.27-2.15-.55-2.9-.3-.78-.7-1.44-1.36-2.1-.66-.66-1.32-1.06-2.1-1.36-.75-.28-1.63-.49-2.9-.55C15.67.01 15.26 0 12 0zM12 5.84a6.16 6.16 0 100 12.32 6.16 6.16 0 000-12.32zm0 10.16a4 4 0 110-8 4 4 0 010 8zm6.41-11.85a1.44 1.44 0 11-2.88 0 1.44 1.44 0 012.88 0z",
  },
  youtube: {
    label: "YouTube",
    path: "M23.5 6.2a3 3 0 00-2.12-2.14C19.55 3.5 12 3.5 12 3.5s-7.55 0-9.38.56A3 3 0 00.5 6.2 31.6 31.6 0 000 12a31.6 31.6 0 00.5 5.8 3 3 0 002.12 2.14c1.83.56 9.38.56 9.38.56s7.55 0 9.38-.56a3 3 0 002.12-2.14A31.6 31.6 0 0024 12a31.6 31.6 0 00-.5-5.8zM9.75 15.57V8.43L15.82 12l-6.07 3.57z",
  },
  x: {
    label: "X",
    path: "M18.9 2.25h3.68l-8.04 9.19L24 21.75h-7.41l-5.8-7.58-6.64 7.58H.67l8.6-9.83L0 2.25h7.59l5.24 6.93 6.07-6.93zm-1.29 17.52h2.04L6.49 4.41H4.28L17.61 19.77z",
  },
};

function normalizePlatform(platform: string): string {
  const key = platform.trim().toLowerCase();
  if (key === "twitter") return "x";
  return key;
}

export function SocialLinks({
  links,
  className = "",
  iconClassName = "h-5 w-5",
}: {
  links: PublicSocialLink[];
  className?: string;
  iconClassName?: string;
}) {
  const visible = links.filter((link) => link.url?.trim());
  if (visible.length === 0) return null;

  return (
    <div className={`flex flex-wrap items-center gap-3 ${className}`}>
      {visible.map((link) => {
        const platform = normalizePlatform(link.platform);
        const icon = ICONS[platform];
        const label = link.label || icon?.label || link.platform;
        return (
          <a
            key={`${platform}-${link.url}`}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-md border border-white/20 px-3 py-2 text-sm text-white/80 transition hover:border-[#e89a2d] hover:text-white"
            aria-label={label}
          >
            {icon ? (
              <svg viewBox="0 0 24 24" className={iconClassName} fill="currentColor" aria-hidden>
                <path d={icon.path} />
              </svg>
            ) : null}
            <span>{label}</span>
          </a>
        );
      })}
    </div>
  );
}
