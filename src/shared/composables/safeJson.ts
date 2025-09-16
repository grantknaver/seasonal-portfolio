export const safeJson = async (r: Response) => {
  try {
    return await r.json();
  } catch {
    return null;
  }
};
