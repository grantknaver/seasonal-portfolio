// import { type TopicName } from '../constants/topicName';

// export const scrollToElement = (elementId: TopicName): void => {
//   setTimeout(() => {
//     const target = document.getElementById(elementId);
//     const header = document.querySelector('.q-header');
//     const headerHeight = header?.clientHeight ?? 0;
//     const scrollableContainers = [
//       document.scrollingElement,
//       document.querySelector('.q-page-container'),
//       document.querySelector('.q-page'),
//       window,
//     ];

//     if (target) {
//       const offsetTop = target.offsetTop + window.pageYOffset;
//       for (const container of scrollableContainers) {
//         if (container && 'scrollTo' in container) {
//           try {
//             container.scrollTo({
//               top: offsetTop - headerHeight,
//               behavior: 'smooth',
//             });
//           } catch (err) {
//             console.warn('Failed scroll attempt', err);
//           }
//         }
//       }
//       document.body.classList.remove('q-body--prevent-scroll');
//     } else {
//       console.warn(`Element with id "${elementId}" not found.`);
//     }
//   }, 2000);
// };

import { scroll } from 'quasar';
import { type TopicName } from '../constants/topicName';

const { getScrollTarget, setVerticalScrollPosition } = scroll;

export const scrollToElement = (elementId: TopicName): void => {
  const el = document.getElementById(elementId);
  if (!el) {
    console.warn(`Element with id "${elementId}" not found.`);
    return;
  }

  const container = getScrollTarget(el);

  // positions in viewport
  const elTop = el.getBoundingClientRect().top;
  const containerTop =
    container === window ? 0 : (container as Element).getBoundingClientRect().top;

  // current scroll of the container
  const currentScroll =
    container === window ? window.pageYOffset : (container as Element).scrollTop;

  // optional header offset (skip if you use CSS scroll-margin-top)
  // const header = document.querySelector('.q-header') as HTMLElement;
  // const headerHeight = header?.clientHeight ?? 0;

  const target = currentScroll + (elTop - containerTop);

  try {
    setVerticalScrollPosition(container, target, 500);
  } catch (err) {
    console.warn('Failed scroll attempt', err);
    // works great if you added .anchor { scroll-margin-top: 72px }
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  document.body.classList.remove('q-body--prevent-scroll');
};
