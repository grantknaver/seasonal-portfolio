import { onMounted, onUnmounted, ref } from 'vue';
import { getCustomCssVar } from './getCustomCssVar';

export const vw = () => Math.max(document.documentElement.clientWidth, window.innerWidth || 0);

function getViewportWidth() {
  return Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
}

export function useViewport() {
  const width = ref(getViewportWidth());
  const height = ref(window.innerHeight);

  function update() {
    width.value = getViewportWidth();
    height.value = window.innerHeight;
  }

  onMounted(() => window.addEventListener('resize', update));
  onUnmounted(() => window.removeEventListener('resize', update));

  const xsBreakpoint = +getCustomCssVar('breakpoint-xs').slice(0, -2);
  const smBreakpoint = +getCustomCssVar('breakpoint-sm').slice(0, -2);
  const mdBreakpoint = +getCustomCssVar('breakpoint-md').slice(0, -2);
  const lgBreakpoint = +getCustomCssVar('breakpoint-lg').slice(0, -2);
  const xlBreakpoint = +getCustomCssVar('breakpoint-xl').slice(0, -2);

  return { width, height, xsBreakpoint, smBreakpoint, mdBreakpoint, lgBreakpoint, xlBreakpoint };
}
