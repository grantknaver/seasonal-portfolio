export async function waitForLayout(el: HTMLElement | null, frames = 8): Promise<boolean> {
  if (!el) return false;
  for (let i = 0; i < frames; i++) {
    await new Promise(requestAnimationFrame);
    if (el.offsetParent !== null && el.offsetHeight > 0 && el.offsetWidth > 0) {
      return true; // layout is ready and visible
    }
  }
  return false;
}
