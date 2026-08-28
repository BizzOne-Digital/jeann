/** Lightweight store so translation progress does not re-render the whole marketing tree. */

let translating = false;
const listeners = new Set<() => void>();

export function setTranslating(value: boolean) {
  if (translating === value) return;
  translating = value;
  listeners.forEach((listener) => listener());
}

export function getTranslating() {
  return translating;
}

export function subscribeTranslating(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}
