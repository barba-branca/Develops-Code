/**
 * DEVELOPS CODE - Frontend Refactored
 * Following Clean Code and SOLID principles.
 */

// --- FAQ Module ---
const FAQModule = (() => {
  const init = () => {
    const faqItems = document.querySelectorAll('.faq-item');
    const faqQuestions = document.querySelectorAll('.faq-q');

    faqQuestions.forEach(btn => {
      // Remove Materialize effects as per original code
      btn.classList.remove('waves-effect', 'waves-light', 'waves-dark', 'waves-teal');
      btn.addEventListener('click', () => toggleFaq(btn, faqItems));
    });
  };

  const toggleFaq = (btn, allItems) => {
    const currentItem = btn.closest('.faq-item');
    const isOpen = currentItem.classList.contains('open');

    allItems.forEach(item => item.classList.remove('open'));

    if (!isOpen) {
      currentItem.classList.add('open');
    }
  };

  return { init };
})();

// --- Navigation Module ---
const NavigationModule = (() => {
  const getElements = () => ({
    mainNav: document.getElementById('main-nav'),
    mobileNavEl: document.getElementById('mobile-nav'),
    hamburgerBtn: document.getElementById('hamburger-btn'),
    toggleHint: document.getElementById('toggle-hint')
  });

  const init = () => {
    const elements = getElements();
    initSidenav(elements);
    initScrollEvent(elements);
    initResizeEvent(elements);
    initLinkClicks(elements);
  };

  const initSidenav = (elements) => {
    const { mobileNavEl, hamburgerBtn } = elements;
    if (!mobileNavEl) return;

    M.Sidenav.init(mobileNavEl, {
      edge: 'left',
      draggable: true,
      onOpenStart: () => handleSidenavOpen(elements),
      onCloseEnd: () => handleSidenavClose(elements)
    });

    hamburgerBtn.addEventListener('click', () => toggleSidenav(mobileNavEl));
  };

  const toggleSidenav = (mobileNavEl) => {
    const instance = M.Sidenav.getInstance(mobileNavEl);
    if (!instance) return;
    instance.isOpen ? instance.close() : instance.open();
  };

  const handleSidenavOpen = (elements) => {
    const { hamburgerBtn, mainNav } = elements;
    hamburgerBtn.classList.add('open');
    mainNav.classList.add('nav-hidden');
    showToggleHint(elements.toggleHint);
  };

  const handleSidenavClose = (elements) => {
    const { hamburgerBtn, mainNav } = elements;
    hamburgerBtn.classList.remove('open');
    mainNav.classList.remove('nav-hidden');
    hideToggleHint(elements.toggleHint);
  };

  const showToggleHint = (toggleHint) => {
    if (!toggleHint) return;
    toggleHint.classList.add('visible');
    clearTimeout(toggleHint.hideTimer);
    toggleHint.hideTimer = setTimeout(() => toggleHint.classList.remove('visible'), 3200);
  };

  const hideToggleHint = (toggleHint) => {
    if (!toggleHint) return;
    clearTimeout(toggleHint.hideTimer);
    toggleHint.classList.remove('visible');
  };

  const initScrollEvent = ({ mainNav }) => {
    window.addEventListener('scroll', () => {
      if (!mainNav) return;
      mainNav.style.background = window.scrollY > 50 ? 'rgba(10,22,40,0.98)' : 'var(--navy)';
    });
  };

  const initResizeEvent = ({ mobileNavEl }) => {
    window.addEventListener('resize', () => {
      const instance = M.Sidenav.getInstance(mobileNavEl);
      if (instance && window.innerWidth > 1024 && instance.isOpen) {
        instance.close();
      }
    });
  };

  const initLinkClicks = ({ mobileNavEl }) => {
    if (!mobileNavEl) return;
    mobileNavEl.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        const instance = M.Sidenav.getInstance(mobileNavEl);
        if (instance && instance.isOpen) instance.close();
      });
    });
  };

  return { init };
})();

// --- Scroll Reveal Module ---
const RevealModule = (() => {
  const init = () => {
    const reveals = document.querySelectorAll('.reveal');
    if (reveals.length === 0) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          setTimeout(() => entry.target.classList.add('visible'), index * 80);
        }
      });
    }, { threshold: 0.1 });

    reveals.forEach(el => observer.observe(el));
  };

  return { init };
})();

// --- Particles Module ---
const ParticlesModule = (() => {
  const init = () => {
    const container = document.getElementById('particles');
    if (!container) return;

    const colors = ['#2d7dd2', '#4dd9e8', '#1a4a8a', '#5ab4e8'];
    const particleCount = 20;

    for (let i = 0; i < particleCount; i++) {
      container.appendChild(createParticle(colors));
    }
  };

  const createParticle = (colors) => {
    const p = document.createElement('div');
    p.className = 'particle';
    const size = Math.random() * 10 + 4;

    p.style.cssText = `
      left: ${Math.random() * 100}%;
      width: ${size}px;
      height: ${size}px;
      background: ${colors[Math.floor(Math.random() * colors.length)]};
      animation-duration: ${Math.random() * 15 + 10}s;
      animation-delay: ${Math.random() * 10}s;
      border-radius: ${Math.random() > 0.5 ? '50%' : '2px'};
    `;
    return p;
  };

  return { init };
})();

// --- Form Module ---
const FormModule = (() => {
  const init = () => {
    const contactForm = document.getElementById('contact-form');
    if (!contactForm) return;

    contactForm.addEventListener('submit', handleFormSubmit);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const submitBtn = document.getElementById('submit-btn');
    const statusEl = document.getElementById('form-status');

    const originalBtnContent = submitBtn.innerHTML;
    setLoadingState(submitBtn, statusEl, true);

    // Mocking API call since backend is removed
    try {
      await mockApiCall(new FormData(form));
      showStatus(statusEl, 'Mensagem enviada com sucesso! Entraremos em contato.', 'success');
      form.reset();
    } catch (error) {
      showStatus(statusEl, error.message || 'Erro ao enviar mensagem.', 'error');
    } finally {
      setLoadingState(submitBtn, statusEl, false, originalBtnContent);
    }
  };

  const setLoadingState = (btn, status, isLoading, originalContent = '') => {
    if (!btn || !status) return;
    btn.disabled = isLoading;
    if (isLoading) {
      btn.innerHTML = 'Enviando...';
      status.innerHTML = '';
      status.className = 'form-status';
    } else {
      btn.innerHTML = originalContent;
    }
  };

  const showStatus = (el, message, type) => {
    if (!el) return;
    el.innerHTML = message;
    el.className = `form-status status-${type}`;
  };

  const mockApiCall = (formData) => {
    return new Promise((resolve) => {
      console.log('Form data submitted (Mock):', Object.fromEntries(formData.entries()));
      setTimeout(resolve, 1500);
    });
  };

  return { init };
})();

// --- Main Initialization ---
document.addEventListener('DOMContentLoaded', () => {
  FAQModule.init();
  NavigationModule.init();
  RevealModule.init();
  ParticlesModule.init();
  FormModule.init();
});
