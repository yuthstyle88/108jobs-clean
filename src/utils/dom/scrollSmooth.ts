export function scrollToElementById(id: string, offset: number = 0) {
  const element = document.getElementById(id);
  if (element) {
    const top = element.getBoundingClientRect().top + window.pageYOffset + offset;
    window.scrollTo({
      top,
      behavior: 'smooth',
    });
  }
}
