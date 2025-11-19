import { scroll } from 'quasar';

const { getScrollTarget, setVerticalScrollPosition } = scroll;

// export const scrollToElement = (elementId: string): void => {
//   const el = document.getElementById(elementId);
//   if (!el) {
//     console.warn(`Element with id "${elementId}" not found.`);
//     return;
//   }

//   const container = getScrollTarget(el);

//   const elTop = el.getBoundingClientRect().top;
//   const containerTop =
//     container === window ? 0 : (container as Element).getBoundingClientRect().top;

//   const currentScroll =
//     container === window ? window.pageYOffset : (container as Element).scrollTop;

//   // 🔹 Fixed header offset
//   const header = document.querySelector('.q-header') as HTMLElement;
//   const headerHeight = header?.offsetHeight ?? 0;
//   const extraOffset = 0; // small margin below header

//   // final scroll target
//   console.log('currentScro  const target = currentScroll + (elTop - containerTop) - headerHeight - extraOffset;

//   try {
//     setVerticalScrollPosition(container, target, 500);
// ailed scroll attempt', err);
//     // fallback: still usable with header offset
//     el.scrollIntoView({ behavior: 'smooth', block: 'start' });
//     window.scrollBy({ top: -(headerHeight + extraOffset), behavior: 'smooth' });
//   }

//   document.body.classList.remove('q-body--prevent-scroll');
// };

export const scrollToElement = (elementId: string): Promise<number | null> => {
  return new Promise((resolve) => {
    const el = document.getElementById(elementId);
    if (!el) {
      console.warn(`Element with id "${elementId}" not found.`);
      resolve(null);
      return;
    }

    const container = getScrollTarget(el);

    const elTop = el.getBoundingClientRect().top;
    const containerTop =
      container === window ? 0 : (container as Element).getBoundingClientRect().top;

    const currentScroll =
      container === window ? window.pageYOffset : (container as Element).scrollTop;

    // 🔹 Fixed header offset
    const header = document.querySelector('.q-header') as HTMLElement;
    const headerHeight = header?.offsetHeight ?? 0;
    const extraOffset = 0;

    // final scroll target
    const target = currentScroll + (elTop - containerTop) - headerHeight - extraOffset;

    try {
      // perform scroll
      setVerticalScrollPosition(container, target, 500);
    } catch (err) {
      console.warn('Failed scroll attempt', err);

      // fallback behavior
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      window.scrollBy({ top: -(headerHeight + extraOffset), behavior: 'smooth' });
    }

    // ensure Quasar scroll lock is released
    document.body.classList.remove('q-body--prevent-scroll');

    // Resolve after the animation should have completed
    setTimeout(() => resolve(target), 500);
  });
};
