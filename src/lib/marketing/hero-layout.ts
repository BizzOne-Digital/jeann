/** Shared dark-hero overlay tokens. */

export const HERO_DARK_OVERLAY_WASH = "bg-[rgb(var(--navy-rgb)/0.12)]";

/** Home hero — lighter left wash so commodity imagery stays visible on the right. */
export const HERO_HOME_OVERLAY_HORIZONTAL =
  "linear-gradient(90deg, rgb(var(--navy-rgb) / 0.42) 0%, rgb(var(--navy-rgb) / 0.18) 32%, transparent 58%)";

/**
 * Inner marketing pages — solid navy on the left (~30%) fading to transparent,
 * matching the client reference hero (text band on the left, photo visible on the right).
 */
export const HERO_PAGE_OVERLAY_HORIZONTAL =
  "linear-gradient(90deg, rgb(var(--navy-rgb)) 0%, rgb(var(--navy-rgb) / 0.95) 11%, rgb(var(--navy-rgb) / 0.78) 22%, rgb(var(--navy-rgb) / 0.5) 34%, rgb(var(--navy-rgb) / 0.22) 46%, transparent 62%)";

/** @deprecated Use HERO_HOME_OVERLAY_HORIZONTAL or HERO_PAGE_OVERLAY_HORIZONTAL */
export const HERO_DARK_OVERLAY_HORIZONTAL = HERO_HOME_OVERLAY_HORIZONTAL;

export const HERO_DARK_OVERLAY_BOTTOM =
  "bg-gradient-to-t from-[rgb(var(--navy-rgb)/0.45)] via-transparent to-transparent";

export const MARKETING_HEADER_HEIGHT = "4.75rem";

export const MARKETING_HEADER_HEIGHT_CLASS = "h-[4.75rem]";

export const MARKETING_HERO_HEIGHT_CLASS = "min-h-[min(88svh,720px)]";

export const MARKETING_HERO_SECTION_CLASS = `relative w-full max-w-full overflow-hidden ${MARKETING_HERO_HEIGHT_CLASS}`;

export const MARKETING_HERO_INNER_CLASS =
  "container-page relative flex min-h-[min(88svh,720px)] flex-col justify-center pb-16 pt-[6rem] lg:pb-20 lg:pt-[6.5rem]";
