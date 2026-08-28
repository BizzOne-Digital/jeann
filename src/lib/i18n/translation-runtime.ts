/** Lightweight store so translation progress does not re-render the whole marketing tree. */

let translating = false;
let degraded = false;
const listeners = new Set<() => void>();

function notify() {
  listeners.forEach((listener) => listener());
}

export function setTranslating(value: boolean) {
  if (translating === value) return;
  translating = value;
  notify();
}

export function getTranslating() {
  return translating;
}

export function setTranslationDegraded(value: boolean) {
  if (degraded === value) return;
  degraded = value;
  notify();
}

export function getTranslationDegraded() {
  return degraded;
}

export function subscribeTranslating(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}
