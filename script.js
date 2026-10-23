/* ========================================
   script.js — Portfólio João Silva
   ======================================== */

(() => {
  'use strict';

  /* ----------------------------------------
     1. CURSOR PERSONALIZADO
     ---------------------------------------- */
  const dot  = document.getElementById('cursorDot');
  const ring = document.getElementById('cursorRing');

  let mouseX = 0, mouseY = 0;
  let ringX  = 0, ringY  = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    // O dot segue instantaneamente
    dot.style.left = `${mouseX}px`;
    dot.style.top  = `${mouseY}px`;
  });

  // O ring segue com easing suave
  function animateRing() {
    ringX += (mouseX - ringX) * 0.12;
    ringY += (mouseY - ringY) * 0.12;

    ring.style.left = `${ringX}px`;
    ring.style.top  = `${ringY}px`;

    requestAnimationFrame(animateRing);
  }
  animateRing();

  // Efeito hover em links e botões (delegação para capturar elementos dinâmicos)
  document.addEventListener('mouseover', (e) => {
    if (e.target.closest('a, button')) {
      ring.classList.add('hover');
      dot.classList.add('hover');
    }
  });
  document.addEventListener('mouseout', (e) => {
    if (e.target.closest('a, button')) {
      ring.classList.remove('hover');
      dot.classList.remove('hover');
    }
  });

  /* ----------------------------------------
     2. NAVEGAÇÃO — scroll shrink + link ativo
     ---------------------------------------- */
  const nav      = document.getElementById('nav');
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav__link');

  function onScroll() {
    const scrollY = window.scrollY;

    // Shrink nav
    nav.classList.toggle('scrolled', scrollY > 50);

    // Highlight active link
    sections.forEach((section) => {
      const top    = section.offsetTop - 120;
      const bottom = top + section.offsetHeight;
      const id     = section.getAttribute('id');

      navLinks.forEach((link) => {
        if (link.getAttribute('href') === `#${id}`) {
          if (scrollY >= top && scrollY < bottom) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        }
      });
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });

  /* ----------------------------------------
     3. MENU MOBILE (hambúrguer)
     ---------------------------------------- */
  const navToggle = document.getElementById('navToggle');
  const navMenu   = document.getElementById('navMenu');

  navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('active');
    navMenu.classList.toggle('open');
  });

  // Fechar menu ao clicar em um link
  navLinks.forEach((link) => {
    link.addEventListener('click', () => {
      navToggle.classList.remove('active');
      navMenu.classList.remove('open');
    });
  });

  /* ----------------------------------------
     4. MODO CLARO / ESCURO
     ---------------------------------------- */
  const themeToggle = document.getElementById('themeToggle');
  const root = document.documentElement;

  // Verificar preferência salva
  const savedTheme = localStorage.getItem('portfolio-theme');
  if (savedTheme) {
    root.setAttribute('data-theme', savedTheme);
  }

  themeToggle.addEventListener('click', () => {
    const current = root.getAttribute('data-theme');
    const next = current === 'light' ? 'dark' : 'light';

    root.setAttribute('data-theme', next);
    localStorage.setItem('portfolio-theme', next);
  });

  /* ----------------------------------------
     5. PARTÍCULAS DECORATIVAS
     ---------------------------------------- */
  const particlesContainer = document.getElementById('heroParticles');
  const particleCount = 18;

  for (let i = 0; i < particleCount; i++) {
    const p = document.createElement('div');
    p.classList.add('particle');

    const size = Math.random() * 6 + 3;
    p.style.width  = `${size}px`;
    p.style.height = `${size}px`;
    p.style.left   = `${Math.random() * 100}%`;
    p.style.top    = `${Math.random() * 100}%`;
    p.style.animationDuration = `${Math.random() * 6 + 5}s`;
    p.style.animationDelay    = `${Math.random() * 4}s`;

    // Alternar entre azul e verde
    if (Math.random() > 0.5) {
      p.style.background = 'var(--clr-accent)';
    }

    particlesContainer.appendChild(p);
  }

  /* ----------------------------------------
     6. INTERATIVIDADE DO HERO (ref: Bruno Simon)
     Mouse parallax sutil no conteúdo
     ---------------------------------------- */
  const heroContent = document.querySelector('.hero__content');

  document.addEventListener('mousemove', (e) => {
    const xPercent = (e.clientX / window.innerWidth  - 0.5) * 2;
    const yPercent = (e.clientY / window.innerHeight - 0.5) * 2;

    heroContent.style.transform =
      `translate(${xPercent * 8}px, ${yPercent * 5}px)`;
  });

  /* ----------------------------------------
     7. SCROLL REVEAL — IntersectionObserver
     (ref: Jacek Jeznach — animações de entrada)
     ---------------------------------------- */
  const revealElements = document.querySelectorAll('.scroll-reveal');

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
  );

  revealElements.forEach((el) => revealObserver.observe(el));

  /* ----------------------------------------
     8. FORMULÁRIO DE CONTATO — Validação visual
     ---------------------------------------- */
  const form         = document.getElementById('contactForm');
  const nameInput    = document.getElementById('formName');
  const emailInput   = document.getElementById('formEmail');
  const messageInput = document.getElementById('formMessage');
  const successMsg   = document.getElementById('formSuccess');

  function validateField(input, condition) {
    const group = input.closest('.form-group');
    if (!condition) {
      group.classList.add('error');
      group.classList.remove('success');
      return false;
    }
    group.classList.remove('error');
    group.classList.add('success');
    return true;
  }

  // Validação em tempo real ao sair do campo
  nameInput.addEventListener('blur', () => {
    validateField(nameInput, nameInput.value.trim().length >= 2);
  });

  emailInput.addEventListener('blur', () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    validateField(emailInput, emailRegex.test(emailInput.value.trim()));
  });

  messageInput.addEventListener('blur', () => {
    validateField(messageInput, messageInput.value.trim().length >= 10);
  });

  // Limpar erro ao digitar
  [nameInput, emailInput, messageInput].forEach((input) => {
    input.addEventListener('input', () => {
      input.closest('.form-group').classList.remove('error');
    });
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const isNameValid    = validateField(nameInput,    nameInput.value.trim().length >= 2);
    const isEmailValid   = validateField(emailInput,   emailRegex.test(emailInput.value.trim()));
    const isMessageValid = validateField(messageInput, messageInput.value.trim().length >= 10);

    if (isNameValid && isEmailValid && isMessageValid) {
      // Simular envio (sem backend)
      successMsg.classList.add('visible');
      form.reset();

      // Limpar estados de sucesso dos campos
      document.querySelectorAll('.form-group').forEach((g) => {
        g.classList.remove('success');
      });

      // Esconder mensagem após 5s
      setTimeout(() => {
        successMsg.classList.remove('visible');
      }, 5000);
    }
  });
})();

