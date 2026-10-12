/**
 * MANOFICA — Interactions & Moteur de page minimaliste
 */

(function () {
  'use strict';

  // 1. Année dynamique
  const yearEl = document.getElementById('year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  // 1b. Header flottant avec effet de verre au défilement
  const siteHeader = document.getElementById('siteHeader');
  function handleScroll() {
    if (!siteHeader) return;
    if (window.scrollY > 40) {
      siteHeader.classList.add('header-scrolled');
    } else {
      siteHeader.classList.remove('header-scrolled');
    }
  }
  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  // 2. Menu mobile épuré
  const burgerBtn = document.getElementById('burgerBtn');
  const mobileNav = document.getElementById('mobileNav');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');

  function toggleMobileNav() {
    if (!mobileNav || !burgerBtn) return;
    const isOpen = mobileNav.classList.toggle('active');
    burgerBtn.setAttribute('aria-expanded', String(isOpen));
    mobileNav.setAttribute('aria-hidden', String(!isOpen));
    document.body.classList.toggle('drawer-open', isOpen);
  }

  function closeMobileNav() {
    if (!mobileNav || !burgerBtn) return;
    mobileNav.classList.remove('active');
    burgerBtn.setAttribute('aria-expanded', 'false');
    mobileNav.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('drawer-open');
  }

  if (burgerBtn) burgerBtn.addEventListener('click', toggleMobileNav);
  mobileLinks.forEach(link => link.addEventListener('click', closeMobileNav));

  // 3. Navigation par onglets dans le menu
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.menu-tab-content');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetTab = btn.getAttribute('data-tab');

      tabBtns.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');

      tabContents.forEach(content => {
        if (content.getAttribute('data-content') === targetTab) {
          content.classList.add('active');
        } else {
          content.classList.remove('active');
        }
      });
    });
  });

  // 4. Formulaire de réservation épuré
  const resForm = document.getElementById('resForm');
  const resConfirmMsg = document.getElementById('resConfirmMsg');
  const resConfirmText = document.getElementById('resConfirmText');
  const fDate = document.getElementById('fDate');

  if (fDate) {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    fDate.min = `${yyyy}-${mm}-${dd}`;
    fDate.value = `${yyyy}-${mm}-${dd}`;
  }

  if (resForm) {
    resForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('fName').value.trim();
      const phone = document.getElementById('fPhone').value.trim();
      const service = document.getElementById('fService').value === 'midi' ? 'Déjeuner' : 'Dîner';
      const time = document.getElementById('fTime').value;
      const guests = document.getElementById('fGuests').value;

      if (!name || !phone) {
        alert('Veuillez renseigner votre nom et votre numéro de téléphone.');
        return;
      }

      if (resConfirmMsg && resConfirmText) {
        resConfirmText.textContent = `Table demandée au nom de ${name} pour ${guests} convive(s) (${service} à ${time}). Notre équipe vous contactera au ${phone} pour confirmer.`;
        resConfirmMsg.style.display = 'block';
        resForm.style.display = 'none';
      }
    });
  }

  // 5. Gestion adaptative de la Galerie (2 colonnes sur mobile, 3 sur desktop, 4 sur grand écran)
  // Galerie Masonry 3D & Mobile Story Swipe
  const galleryFlex = document.getElementById('galleryMasonry');
  const galleryCounter = document.getElementById('galleryCounter');
  if (galleryFlex) {
    const allGalleryItems = Array.from(galleryFlex.querySelectorAll('.gallery-masonry-item'));
    let activeMode = '';

    function initTilt() {
      const isTouchDevice = window.matchMedia('(hover: none), (pointer: coarse)').matches;
      if (isTouchDevice) {
        galleryFlex.querySelectorAll('.gallery-card-3d').forEach(card => {
          card.style.transform = '';
          card.onmousemove = null;
          card.onmouseenter = null;
          card.onmouseleave = null;
        });
        return;
      }

      const masonryCards = galleryFlex.querySelectorAll('.gallery-card-3d');
      masonryCards.forEach(card => {
        let bounds = null;
        let targetRotX = 0;
        let targetRotY = 0;
        let currentRotX = 0;
        let currentRotY = 0;
        let rafId = null;

        function updateSpring() {
          currentRotX += (targetRotX - currentRotX) * 0.14;
          currentRotY += (targetRotY - currentRotY) * 0.14;

          card.style.transform = `perspective(1000px) rotateX(${currentRotX.toFixed(2)}deg) rotateY(${currentRotY.toFixed(2)}deg)`;

          if (Math.abs(targetRotX - currentRotX) > 0.05 || Math.abs(targetRotY - currentRotY) > 0.05) {
            rafId = requestAnimationFrame(updateSpring);
          } else {
            card.style.transform = targetRotX === 0 ? '' : `perspective(1000px) rotateX(${targetRotX}deg) rotateY(${targetRotY}deg)`;
            rafId = null;
          }
        }

        card.onmouseenter = () => {
          bounds = card.getBoundingClientRect();
        };

        card.onmousemove = (e) => {
          if (!bounds) bounds = card.getBoundingClientRect();
          const mouseX = e.clientX - bounds.left;
          const mouseY = e.clientY - bounds.top;

          const normX = (mouseX / bounds.width) - 0.5;
          const normY = (mouseY / bounds.height) - 0.5;

          targetRotX = -normY * 14;
          targetRotY = normX * 14;

          if (!rafId) {
            rafId = requestAnimationFrame(updateSpring);
          }
        };

        card.onmouseleave = () => {
          bounds = null;
          targetRotX = 0;
          targetRotY = 0;
          if (!rafId) {
            rafId = requestAnimationFrame(updateSpring);
          }
        };
      });
    }

    function layoutGallery() {
      const width = window.innerWidth;

      if (width < 768) {
        if (activeMode === 'mobile') return;
        activeMode = 'mobile';
        galleryFlex.innerHTML = '';
        allGalleryItems.forEach(item => {
          galleryFlex.appendChild(item);
        });
        initTilt();
      } else if (width < 1024) {
        if (activeMode === 'tablet') return;
        activeMode = 'tablet';
        galleryFlex.innerHTML = '';
        const col1 = document.createElement('div');
        col1.className = 'gallery-masonry-col';
        const col2 = document.createElement('div');
        col2.className = 'gallery-masonry-col';

        allGalleryItems.slice(0, 8).forEach(item => col1.appendChild(item));
        allGalleryItems.slice(8, 16).forEach(item => col2.appendChild(item));

        galleryFlex.appendChild(col1);
        galleryFlex.appendChild(col2);
        initTilt();
      } else {
        if (activeMode === 'desktop') return;
        activeMode = 'desktop';
        galleryFlex.innerHTML = '';
        const cols = [];
        for (let i = 0; i < 4; i++) {
          const col = document.createElement('div');
          col.className = 'gallery-masonry-col';
          cols.push(col);
          galleryFlex.appendChild(col);
        }

        cols[0].append(...allGalleryItems.slice(0, 4));
        cols[1].append(...allGalleryItems.slice(4, 8));
        cols[2].append(...allGalleryItems.slice(8, 12));
        cols[3].append(...allGalleryItems.slice(12, 16));
        initTilt();
      }
    }

    // Indicateur de swipe story tactile sur mobile
    if (galleryCounter) {
      galleryFlex.addEventListener('scroll', () => {
        if (window.innerWidth >= 768) return;
        const scrollLeft = galleryFlex.scrollLeft;
        const firstCard = galleryFlex.querySelector('.gallery-masonry-item');
        const cardWidth = (firstCard ? firstCard.offsetWidth : 300) + 16;
        const currentIdx = Math.min(allGalleryItems.length, Math.max(1, Math.round(scrollLeft / cardWidth) + 1));
        galleryCounter.textContent = `Glisser pour explorer · ${currentIdx} / ${allGalleryItems.length}`;
      }, { passive: true });
    }

    layoutGallery();

    let resizeDebounce;
    window.addEventListener('resize', () => {
      clearTimeout(resizeDebounce);
      resizeDebounce = setTimeout(layoutGallery, 100);
    }, { passive: true });
  }

})();


