// Footer year.
var yr = document.getElementById('yr');
if (yr) yr.textContent = new Date().getFullYear();

// Theme toggle. No stored preference means "follow the system"; clicking pins an
// explicit choice, which the CSS honours over prefers-color-scheme in both
// directions. The pre-paint script in <head> applies the stored value.
(function () {
  var buttons = document.querySelectorAll('.theme-toggle');
  if (!buttons.length) return;

  var media = window.matchMedia('(prefers-color-scheme: dark)');

  function current() {
    var pinned = document.documentElement.getAttribute('data-theme');
    return pinned === 'light' || pinned === 'dark' ? pinned : (media.matches ? 'dark' : 'light');
  }

  function label() {
    var next = current() === 'dark' ? 'light' : 'dark';
    buttons.forEach(function (b) {
      b.setAttribute('aria-label', 'Switch to ' + next + ' theme');
      b.setAttribute('title', 'Switch to ' + next + ' theme');
    });
  }

  buttons.forEach(function (b) {
    b.addEventListener('click', function () {
      var next = current() === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      try { localStorage.setItem('theme', next); } catch (e) {}
      label();
    });
  });

  // Keep the label right when the system flips and nothing is pinned.
  if (media.addEventListener) media.addEventListener('change', label);
  label();
})();

// Smooth in-page navigation that keeps the address bar in step.
//
// The skip link is deliberately NOT handled here. Calling preventDefault on it
// would cancel the anchor's default activation behaviour, which is what moves
// focus and the sequential focus navigation starting point to the target — so
// the link would scroll the page and then leave a keyboard user's focus inside
// the sidebar it exists to bypass. Native navigation is already smooth via
// html{scroll-behavior:smooth}.
//
// `behavior` is likewise left unset: an explicit value other than 'auto' beats
// the computed scroll-behavior property, which would defeat the
// prefers-reduced-motion override in the stylesheet.
(function () {
  var links = document.querySelectorAll('.section-nav a[href^="#"]');
  Array.prototype.forEach.call(links, function (link) {
    link.addEventListener('click', function (event) {
      var hash = link.getAttribute('href');
      var target = document.getElementById(hash.slice(1));
      if (!target) return;
      event.preventDefault();
      target.scrollIntoView({ block: 'start' });
      history.replaceState(null, '', hash);
    });
  });
})();
