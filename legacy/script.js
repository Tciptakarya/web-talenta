  // Header scroll state
  const header = document.getElementById('siteHeader');
  const toTop = document.getElementById('toTop');
  window.addEventListener('scroll', () => {
    const scrolled = window.scrollY > 40;
    header.classList.toggle('is-scrolled', scrolled);
    toTop.classList.toggle('show', window.scrollY > 600);
  });

  // Mobile menu toggle
  const menuToggle = document.getElementById('menuToggle');
  const mainNav = document.getElementById('mainNav');
  const menuIcon = document.getElementById('menuIcon');
  const mobileClose = document.createElement('button');
  mobileClose.type = 'button';
  mobileClose.className = 'mobile-nav-close';
  mobileClose.setAttribute('aria-label', 'Tutup menu');
  mobileClose.innerHTML = '&times;';
  mainNav.prepend(mobileClose);
  const iconMenu = '<line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>';
  const iconClose = '<line x1="6" y1="6" x2="18" y2="18"/><line x1="6" y1="18" x2="18" y2="6"/>';
  const closeMenu = () => {
    mainNav.classList.remove('open');
    menuIcon.innerHTML = iconMenu;
    menuToggle.setAttribute('aria-label', 'Buka menu');
  };
  menuToggle.addEventListener('click', () => {
    const isOpen = mainNav.classList.toggle('open');
    menuIcon.innerHTML = isOpen ? iconClose : iconMenu;
    menuToggle.setAttribute('aria-label', isOpen ? 'Tutup menu' : 'Buka menu');
  });
  mobileClose.addEventListener('click', closeMenu);
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  // Back to top
  toTop.addEventListener('click', () => window.scrollTo({top:0, behavior:'smooth'}));

  // Service horizontal scroll arrows
  const serviceGrid = document.querySelector('.service-grid');
  const scrollLeft = document.querySelector('.scroll-left');
  const scrollRight = document.querySelector('.scroll-right');
  if (serviceGrid && scrollLeft && scrollRight) {
    const updateArrows = () => {
      scrollLeft.disabled = serviceGrid.scrollLeft <= 0;
      scrollRight.disabled = serviceGrid.scrollLeft + serviceGrid.clientWidth >= serviceGrid.scrollWidth - 1;
    };
    scrollLeft.addEventListener('click', () => {
      serviceGrid.scrollBy({left: -310, behavior:'smooth'});
    });
    scrollRight.addEventListener('click', () => {
      serviceGrid.scrollBy({left: 310, behavior:'smooth'});
    });
    serviceGrid.addEventListener('scroll', updateArrows);
    window.addEventListener('resize', updateArrows);
    updateArrows();
  }

  // Reveal on scroll
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const revealEls = document.querySelectorAll('.reveal');
  if (prefersReduced) {
    revealEls.forEach(el => el.classList.add('is-visible'));
  } else {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.14 });
    revealEls.forEach(el => io.observe(el));
  }

  // Contact form to WhatsApp
  const form = document.getElementById('contactForm');
  const status = document.getElementById('formStatus');
  form.addEventListener('submit', function(e){
    e.preventDefault();
    const name = document.getElementById('fname').value.trim();
    const email = document.getElementById('femail').value.trim();
    const message = document.getElementById('fmsg').value.trim();
    const whatsappText = `Halo Talenta Cipta Karya,\n\nNama: ${name}\nEmail: ${email}\nPesan: ${message}`;
    const whatsappUrl = `https://wa.me/628119700322?text=${encodeURIComponent(whatsappText)}`;
    window.open(whatsappUrl, '_blank', 'noopener');
    status.classList.add('is-visible');
    form.reset();
    setTimeout(() => status.classList.remove('is-visible'), 5000);
  });

  // Gallery lightbox
  const lightbox = document.getElementById('imageLightbox');
  const lightboxImage = document.getElementById('lightboxImage');
  const lightboxCaption = document.getElementById('lightboxCaption');
  const lightboxClose = document.getElementById('lightboxClose');
  let lastFocusedGalleryItem = null;

  const closeLightbox = () => {
    if (lightbox.hidden) return;
    lightbox.hidden = true;
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('lightbox-open');
    lightboxImage.src = '';
    if (lastFocusedGalleryItem) lastFocusedGalleryItem.focus();
  };

  document.querySelectorAll('.gallery-item').forEach(item => {
    const image = item.querySelector('img');
    if (!image) return;

    const caption = item.querySelector('.gallery-caption');
    const imageCaption = caption ? caption.textContent.trim() : image.alt;
    item.tabIndex = 0;
    item.setAttribute('role', 'button');
    item.setAttribute('aria-label', `Perbesar foto: ${imageCaption}`);

    const openLightbox = () => {
      lastFocusedGalleryItem = item;
      lightboxImage.src = image.currentSrc || image.src;
      lightboxImage.alt = image.alt;
      lightboxCaption.textContent = imageCaption;
      lightbox.hidden = false;
      lightbox.setAttribute('aria-hidden', 'false');
      document.body.classList.add('lightbox-open');
      lightboxClose.focus();
    };

    item.addEventListener('click', openLightbox);
    item.addEventListener('keydown', event => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        openLightbox();
      }
    });
  });

  lightboxClose.addEventListener('click', closeLightbox);
  lightbox.querySelector('.lightbox-backdrop').addEventListener('click', closeLightbox);
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') closeLightbox();
  });
