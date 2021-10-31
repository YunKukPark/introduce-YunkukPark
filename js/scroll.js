const scrollbuttons = {
  logo: document.querySelector('#logo-button'),
  linkedIn: document.querySelector('#linked-in-button'),
  contact: document.querySelector('#contact-button'),
};

scrollbuttons.logo.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});
