// import { scroll } from 'quasar';

// const { getScrollTarget, setVerticalScrollPosition } = scroll;

// export const scrollToElement = (elementId: string): void => {
//   console.log('elementId', elementId);
//   const el = document.getElementById(elementId);
//   if (!el) {
//     console.warn(`Element with id "${elementId}" not found.`);
//     return;
//   }

//   const container = getScrollTarget(el);

//   // how far the element (or container) is from the top of the viewport
//   const elTop = el.getBoundingClientRect().top;
//   const containerTop =
//     container === window ? 0 : (container as Element).getBoundingClientRect().top;

//   // current scroll of the container
//   const currentScroll =
//     container === window ? window.pageYOffset : (container as Element).scrollTop;

//   // optional header offset (skip if you use CSS scroll-margin-top)
//   // const header = document.querySelector('.q-header') as HTMLElement;
//   // const headerHeight = header?.clientHeight ?? 0;

//   const target = currentScroll + (elTop - containerTop);

//   try {
//     setVerticalScrollPosition(container, target, 500);
//   } catch (err) {
//     console.warn('Failed scroll attempt', err);
//     el.scrollIntoView({ behavior: 'smooth', block: 'start' });
//   }

//   document.body.classList.remove('q-body--prevent-scroll');
// };

import { scroll } from 'quasar';

const { getScrollTarget, setVerticalScrollPosition } = scroll;

export const scrollToElement = (elementId: string): void => {
  const el = document.getElementById(elementId);
  if (!el) {
    console.warn(`Element with id "${elementId}" not found.`);
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
  const extraOffset = 0; // small margin below header

  // final scroll target
  const target = currentScroll + (elTop - containerTop) - headerHeight - extraOffset;

  try {
    setVerticalScrollPosition(container, target, 500);
  } catch (err) {
    console.warn('Failed scroll attempt', err);
    // fallback: still usable with header offset
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    window.scrollBy({ top: -(headerHeight + extraOffset), behavior: 'smooth' });
  }

  document.body.classList.remove('q-body--prevent-scroll');
};
