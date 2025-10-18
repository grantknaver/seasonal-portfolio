export const nextFrame = (): Promise<void> => {
  // rAF can throttle/stop in background tabs; setTimeout fallback ensures progress.
  return new Promise<void>((resolve) => {
    let done = false;
    const id = setTimeout(() => {
      if (!done) {
        done = true;
        resolve();
      }
    }, 50); // fallback

    requestAnimationFrame(() => {
      if (!done) {
        done = true;
        clearTimeout(id);
        resolve();
      }
    });
  });
};
