//
// Originally from https://ui.shadcn.com/
// Diverges from upstream pending shadcn-ui/ui#8739 — rewritten to use
// useSyncExternalStore so it doesn't trip react-hooks/set-state-in-effect.
// TODO: Check if/when the shadcn issue is resolved and probably use their implementation instead.
//
import * as React from "react";

const MOBILE_BREAKPOINT = 768;

let mql: MediaQueryList | undefined;

function getMql(): MediaQueryList {
  if (mql == null) {
    mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
  }
  return mql;
}

function subscribe(callback: () => void): () => void {
  const m = getMql();
  m.addEventListener("change", callback);
  return (): void => m.removeEventListener("change", callback);
}

function getSnapshot(): boolean {
  return getMql().matches;
}

export function useIsMobile(): boolean {
  return React.useSyncExternalStore(subscribe, getSnapshot, () => false);
}
