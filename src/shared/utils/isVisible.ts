export function isVisible(el: HTMLElement | null): boolean {
  if (!el || !el.isConnected) return false;

  // If there are no boxes, it's effectively not laid out (display:none or similar)
  const rects = el.getClientRects();
  if (rects.length === 0) return false;

  // Self styles
  const self = getComputedStyle(el);
  if (self.visibility === 'hidden' || self.display === 'none' || parseFloat(self.opacity) === 0) {
    return false;
  }

  // Ancestors that can hide layout/paint
  let cur: HTMLElement | null = el.parentElement;
  while (cur) {
    const s = getComputedStyle(cur);
    // content-visibility can suppress paint and return zero rects on descendants
    if (s.display === 'none' || s.visibility === 'hidden' || s.contentVisibility === 'hidden') {
      return false;
    }
    cur = cur.parentElement;
  }

  // Final transformed box size (transforms can affect client rects)
  const r = el.getBoundingClientRect();
  return r.width > 0 && r.height > 0;
}
