export const areElements = (arr: readonly (Element | null)[]): arr is readonly Element[] =>
  arr.every((x): x is Element => x instanceof Element);
