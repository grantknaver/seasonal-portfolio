// import { type TopicName } from '../constants/topicName';

export const scrollToElement = (): void => {
  setTimeout(() => {
    // console.log('elementId', elementId);
    // const bookmark = document.getElementById(elementId);
    // const header = document.querySelector('.q-header');
    // const headerHeight = header?.clientHeight ?? 0;
    const scrollableContainers = [
      document.scrollingElement,
      document.querySelector('.q-page-container'),
      document.querySelector('.q-page'),
      window,
    ];

    // if (bookmark) {
    // const offsetTop = bookmark.offsetTop + window.pageYOffset;
    for (const container of scrollableContainers) {
      if (container && 'scrollTo' in container) {
        try {
          container.scrollTo({
            top: 50,
            behavior: 'smooth',
          });
        } catch (err) {
          console.warn('Failed scroll attempt', err);
        }
      }
    }
    document.body.classList.remove('q-body--prevent-scroll');
    // } else {
    //   console.warn(`Element with id "${elementId}" not found.`);
    // }
  }, 2000);
};
