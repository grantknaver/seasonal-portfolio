import { ref } from 'vue';
import { getCustomCssVar } from './getCustomCssVar';

export const vw = () => Math.max(document.documentElement.clientWidth, window.innerWidth || 0);

// Helper to safely get viewport width
const getViewportWidth = () =>
  Math.max(document.documentElement.clientWidth, window.innerWidth || 0);

// --- Singleton state ---
const width = ref(typeof window !== 'undefined' ? getViewportWidth() : 0);
const height = ref(typeof window !== 'undefined' ? window.innerHeight : 0);

function update() {
  width.value = getViewportWidth();
  height.value = window.innerHeight;
}

// --- One global resize listener ---
if (typeof window !== 'undefined') {
  window.addEventListener('resize', update);
}

// Optional: handle HMR (Vite dev mode) cleanup
if (import.meta.hot) {
  import.meta.hot.dispose(() => {
    window.removeEventListener('resize', update);
  });
}

// --- Read breakpoints once ---
const xsBreakpoint = +getCustomCssVar('breakpoint-xs').replace('px', '');
const smBreakpoint = +getCustomCssVar('breakpoint-sm').replace('px', '');
const mdBreakpoint = +getCustomCssVar('breakpoint-md').replace('px', '');
const lgBreakpoint = +getCustomCssVar('breakpoint-lg').replace('px', '');
const xlBreakpoint = +getCustomCssVar('breakpoint-xl').replace('px', '');

// --- Composable returns reactive singletons ---
export function useViewport() {
  return {
    width,
    height,
    xsBreakpoint,
    smBreakpoint,
    mdBreakpoint,
    lgBreakpoint,
    xlBreakpoint,
  };
}
