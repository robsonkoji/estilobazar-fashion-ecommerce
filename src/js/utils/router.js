// Lightweight Client-Side Hash Router for EstiloBazar

let currentRoute = 'home';

export function getRoute() {
  const hash = window.location.hash.replace('#', '').trim();
  if (!hash || hash === '' || hash === '/') return 'home';
  return hash;
}

export function navigateTo(route) {
  window.location.hash = route;
}

export function setupRouter(onRouteChangeCallback) {
  function handleRoute() {
    currentRoute = getRoute();
    updateActiveNavLinks(currentRoute);
    if (onRouteChangeCallback) {
      onRouteChangeCallback(currentRoute);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  window.addEventListener('hashchange', handleRoute);
  // Initial run
  handleRoute();
}

function updateActiveNavLinks(route) {
  const links = document.querySelectorAll('.nav-link, .footer-link, .mega-dropdown-link');
  links.forEach(link => {
    const href = link.getAttribute('href');
    if (href && href.startsWith('#')) {
      const linkRoute = href.replace('#', '').trim();
      if (linkRoute === route || (route === 'home' && (linkRoute === '' || linkRoute === 'home'))) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    }
  });
}
