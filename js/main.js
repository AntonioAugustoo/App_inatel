
function scrollHeader() {
  const header = document.getElementById('header');
  if (!header) return;
  if (window.scrollY >= 10) header.classList.add('header--scrolled');
  else header.classList.remove('header--scrolled');
}

function getHeaderOffset() {
  const header = document.getElementById('header');
  return header ? header.offsetHeight : 0;
}

function smoothScrollToPosition(top) {
  window.scrollTo({ top, behavior: 'smooth' });
}

function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');

      
      if (!targetId || targetId === '#' || this.getAttribute('aria-disabled') === 'true') {
        e.preventDefault();
        return;
      }

      

      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - getHeaderOffset();
        smoothScrollToPosition(offsetPosition);
      }
    });
  });
}

function initCardObserver() {
  try {
    const cards = document.querySelectorAll('.card');
    if (!cards || cards.length === 0) return;
    const io = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { root: null, rootMargin: '0px', threshold: 0.12 });
    cards.forEach(c => io.observe(c));
  } catch (e) {
    console.error('Reveal observer error:', e);
  }
}

function updateFooterYear() {
  try {
    const y = new Date().getFullYear();
    const el = document.getElementById('footer-year');
    if (el) el.textContent = y;
  } catch (e) {
    console.error('Footer year error:', e);
  }
}

function initCourseCarousel() {
  try {
    document.querySelectorAll('.course-carousel').forEach(function (carousel) {
      var track = carousel.querySelector('.course-track');
      var btnPrev = carousel.querySelector('.carousel-button--prev');
      var btnNext = carousel.querySelector('.carousel-button--next');
      if (!track) return;

      var scrollAmount = Math.round(track.clientWidth * 0.7);

      if (btnPrev) btnPrev.addEventListener('click', function () { track.scrollBy({ left: -scrollAmount, behavior: 'smooth' }); });
      if (btnNext) btnNext.addEventListener('click', function () { track.scrollBy({ left: scrollAmount, behavior: 'smooth' }); });

      // Allow keyboard left/right to navigate when the track is focused
      track.addEventListener('keydown', function (e) {
        if (e.key === 'ArrowRight') { e.preventDefault(); track.scrollBy({ left: 220, behavior: 'smooth' }); }
        if (e.key === 'ArrowLeft') { e.preventDefault(); track.scrollBy({ left: -220, behavior: 'smooth' }); }
      });
    });
  } catch (e) {
    console.error('Course carousel init failed:', e);
  }
}

document.addEventListener('DOMContentLoaded', function () {
  
  scrollHeader();

  
  initSmoothScroll();
  initCardObserver();
  initCourseCarousel();
  updateFooterYear();
});

window.addEventListener('scroll', scrollHeader);


