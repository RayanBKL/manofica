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
  const galleryFlex = document.getElementById('galleryMasonry');
  if (galleryFlex) {
    const allGalleryItems = Array.from(galleryFlex.querySelectorAll('.gallery-masonry-item'));
    let activeColumnCount = -1;

    function initTilt() {
      const isTouchDevice = window.matchMedia('(hover: none), (pointer: coarse)').matches;
      if (isTouchDevice) return;

      const masonryCards = document.querySelectorAll('.gallery-card-3d');
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

          targetRotX = -normY * 16;
          targetRotY = normX * 16;

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

    function updateGalleryColumns() {
      const width = window.innerWidth;
      let targetColumns = 2; // Sur smartphone : 2 colonnes côte-à-côte (Masonry tactile Pinterest)
      if (width >= 1200) {
        targetColumns = 4;
      } else if (width >= 768) {
        targetColumns = 3;
      }

      if (targetColumns === activeColumnCount) return;
      activeColumnCount = targetColumns;

      galleryFlex.innerHTML = '';
      const cols = [];
      for (let i = 0; i < targetColumns; i++) {
        const col = document.createElement('div');
        col.className = 'gallery-masonry-col';
        cols.push(col);
        galleryFlex.appendChild(col);
      }

      allGalleryItems.forEach((item, index) => {
        cols[index % targetColumns].appendChild(item);
      });

      initTilt();
    }

    updateGalleryColumns();

    let resizeDebounce;
    window.addEventListener('resize', () => {
      clearTimeout(resizeDebounce);
      resizeDebounce = setTimeout(updateGalleryColumns, 120);
    }, { passive: true });
  }

})();


