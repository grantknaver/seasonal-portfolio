export const scrollTo = (elementId: string): void => {
  const target = document.getElementById(elementId);
  const header = document.querySelector('.q-header');
  const headerHeight = header?.clientHeight ?? 0;

  if (target) {
    const offsetTop = target.getBoundingClientRect().top + window.pageYOffset;
    window.scrollTo({
      top: offsetTop - headerHeight,
      behavior: 'smooth',
    });
  } else {
    console.warn(`Element with id "${elementId}" not found.`);
  }
};
