type Elementish = Element | NodeListOf<Element> | Element[] | null | undefined;

// Flatten + filter into a clean Element[]
export function flattenElements(items: ReadonlyArray<Elementish>): Element[] {
  const out: Element[] = [];
  for (const item of items) {
    if (!item) continue;
    if (item instanceof Element) {
      out.push(item);
    } else {
      // NodeListOf<Element> or Element[]
      out.push(...Array.from(item).filter((el): el is Element => el instanceof Element));
    }
  }
  return out;
}
