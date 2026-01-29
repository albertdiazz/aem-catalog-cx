const CONFIG = {
  animationDelay: 100,
  scrollThreshold: 0.1,
  navScrollClass: 'scrolled'
};

function init() {
  setupHeader();
  setupAnimations();
  setupImageLoading();
  setupSmoothScroll();
  addInteractiveEffects();

  console.log('Adobe EDS Catalog initialized');
}

function setupHeader() {
  const header = document.querySelector('header');
  if (!header) return;

  let lastScroll = 0;

  window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    if (currentScroll > 50) {
      header.classList.add(CONFIG.navScrollClass);
    } else {
      header.classList.remove(CONFIG.navScrollClass);
    }

    lastScroll = currentScroll;
  }, { passive: true });
}

function setupAnimations() {
  const observerOptions = {
    threshold: CONFIG.scrollThreshold,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  const animatedElements = document.querySelectorAll('main > div, main h2, main img');
  animatedElements.forEach((el, index) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;

    observer.observe(el);
  });
}

function setupImageLoading() {
  const images = document.querySelectorAll('main img');

  images.forEach(img => {
    img.classList.add('loading');

    img.addEventListener('load', function() {
      this.classList.remove('loading');
      this.classList.add('loaded');
    });

    if (img.complete) {
      img.classList.remove('loading');
      img.classList.add('loaded');
    }

    img.addEventListener('mousemove', function(e) {
      const rect = this.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const percentX = (x - centerX) / centerX;
      const percentY = (y - centerY) / centerY;

      this.style.transform = `
        translateY(-4px)
        scale(1.01)
        rotateX(${percentY * -2}deg)
        rotateY(${percentX * 2}deg)
      `;
    });

    img.addEventListener('mouseleave', function() {
      this.style.transform = 'translateY(0) scale(1) rotateX(0) rotateY(0)';
    });
  });
}

function setupSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));

      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
}

function addInteractiveEffects() {
  const interactiveElements = document.querySelectorAll('a, button, img');

  interactiveElements.forEach(el => {
    el.addEventListener('mouseenter', function() {
      document.body.style.cursor = 'pointer';
    });

    el.addEventListener('mouseleave', function() {
      document.body.style.cursor = 'default';
    });
  });

  createScrollProgress();
}

function createScrollProgress() {
  const progressBar = document.createElement('div');
  progressBar.className = 'scroll-progress';
  progressBar.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    height: 3px;
    background: linear-gradient(90deg, #e94560, #ff6b8a);
    width: 0%;
    z-index: 9999;
    transition: width 0.1s ease;
  `;

  document.body.appendChild(progressBar);

  window.addEventListener('scroll', () => {
    const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (window.pageYOffset / windowHeight) * 100;
    progressBar.style.width = scrolled + '%';
  }, { passive: true });
}

document.addEventListener('DOMContentLoaded', () => {
  const style = document.createElement('style');
  style.textContent = `
    .visible {
      opacity: 1 !important;
      transform: translateY(0) !important;
    }

    .loaded {
      animation: fadeIn 0.4s ease;
    }

    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    header.scrolled {
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }

    main img {
      transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
      transform-style: preserve-3d;
    }
  `;
  document.head.appendChild(style);
});

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

export { init, setupAnimations, setupImageLoading };