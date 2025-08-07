export const scrollTo = (elementId: string): void => {
  const target = document.getElementById(elementId);
  console.log('target', target);
  const header = document.querySelector('.q-header');
  console.log('header', header);
  const headerHeight = header?.clientHeight ?? 0;
  console.log('headerHeight', headerHeight);
  if (target) {
    const offsetTop = target.getBoundingClientRect().top + window.pageYOffset;
    console.log('offsetTop', offsetTop);
    window.scrollTo({
      top: offsetTop - headerHeight,
      behavior: 'smooth',
    });
  } else {
    console.warn(`Element with id "${elementId}" not found.`);
  }
};
