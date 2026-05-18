const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

document.querySelectorAll('.fade-in, .fade-in-left, .fade-in-right, .scale-in').forEach(el => observer.observe(el));

let headerParallax = document.getElementById('headerBg');
let statsBar = document.getElementById('statsBar');
let statsAnimated = false;
let counterAnimated = false;

window.addEventListener('scroll', function() {
  const scrollY = window.pageYOffset;
  if (headerParallax) {
    headerParallax.style.transform = 'translateY(' + (scrollY * 0.4) + 'px)';
  }

  if (!statsAnimated) {
    const statsRect = statsBar.getBoundingClientRect();
    if (statsRect.top < window.innerHeight * 0.8) {
      statsAnimated = true;
      animateStats();
    }
  }

  if (!counterAnimated) {
    const counters = document.querySelectorAll('.counter-val');
    if (counters.length > 0) {
      const counterRect = counters[0].getBoundingClientRect();
      if (counterRect.top < window.innerHeight * 0.8) {
        counterAnimated = true;
        animateCounters();
      }
    }
  }
});

function animateStats() {
  const numbers = document.querySelectorAll('.stats-bar-number');
  numbers.forEach((num, idx) => {
    setTimeout(() => {
      num.classList.add('animated');
      const target = parseInt(num.getAttribute('data-target'));
      animateValue(num, 0, target, 1500);
    }, idx * 150);
  });
  const labels = document.querySelectorAll('.stats-bar-label');
  labels.forEach((lbl, idx) => {
    setTimeout(() => {
      lbl.classList.add('animated');
    }, idx * 150 + 200);
  });
}

function animateValue(element, start, end, duration) {
  let startTime = null;
  function step(timestamp) {
    if (!startTime) startTime = timestamp;
    const progress = Math.min((timestamp - startTime) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    element.textContent = Math.floor(eased * (end - start) + start);
    if (progress < 1) {
      requestAnimationFrame(step);
    } else {
      element.textContent = end;
    }
  }
  requestAnimationFrame(step);
}

function animateCounters() {
  const counters = document.querySelectorAll('.counter-val');
  counters.forEach((counter, idx) => {
    setTimeout(() => {
      const target = parseInt(counter.getAttribute('data-target'));
      animateValue(counter, 0, target, 2000);
    }, idx * 200);
  });
}

const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const mobileNav = document.getElementById('mobileNav');
const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

mobileMenuBtn.addEventListener('click', function() {
  this.classList.toggle('active');
  mobileNav.classList.toggle('active');
  document.body.style.overflow = mobileNav.classList.contains('active') ? 'hidden' : '';
});

mobileNavLinks.forEach(link => {
  link.addEventListener('click', function() {
    mobileMenuBtn.classList.remove('active');
    mobileNav.classList.remove('active');
    document.body.style.overflow = '';
  });
});

const tabBtns = document.querySelectorAll('.tab-btn');
tabBtns.forEach(btn => {
  btn.addEventListener('click', function() {
    tabBtns.forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
    this.classList.add('active');
    const tabId = this.getAttribute('data-tab');
    document.getElementById(tabId).classList.add('active');
  });
});

const accordionItems = document.querySelectorAll('.accordion-item');
accordionItems.forEach(item => {
  const header = item.querySelector('.accordion-header');
  header.addEventListener('click', function() {
    const isActive = item.classList.contains('active');
    accordionItems.forEach(i => i.classList.remove('active'));
    if (!isActive) {
      item.classList.add('active');
    }
  });
});

let currentSlide = 0;
const sliderTrack = document.getElementById('sliderTrack');
const sliderSlides = document.querySelectorAll('.slider-slide');
const totalSlides = sliderSlides.length;
const dotsContainer = document.getElementById('sliderDots');

for (let i = 0; i < totalSlides; i++) {
  const dot = document.createElement('button');
  dot.classList.add('slider-dot');
  if (i === 0) dot.classList.add('active');
  dot.addEventListener('click', () => goToSlide(i));
  dot.setAttribute('aria-label', 'Слайд ' + (i + 1));
  dotsContainer.appendChild(dot);
}

function updateSlider() {
  sliderTrack.style.transform = 'translateX(-' + (currentSlide * 100) + '%)';
  document.querySelectorAll('.slider-dot').forEach((dot, idx) => {
    dot.classList.toggle('active', idx === currentSlide);
  });
}

function moveSlider(direction) {
  currentSlide = (currentSlide + direction + totalSlides) % totalSlides;
  updateSlider();
}

function goToSlide(index) {
  currentSlide = index;
  updateSlider();
}

let autoSlideInterval = setInterval(() => {
  moveSlider(1);
}, 5000);

const sliderWrapper = document.querySelector('.slider-wrapper');
sliderWrapper.addEventListener('mouseenter', () => clearInterval(autoSlideInterval));
sliderWrapper.addEventListener('mouseleave', () => {
  autoSlideInterval = setInterval(() => moveSlider(1), 5000);
});

let touchStartX = 0;
let touchEndX = 0;
sliderWrapper.addEventListener('touchstart', (e) => {
  touchStartX = e.changedTouches[0].screenX;
  clearInterval(autoSlideInterval);
}, { passive: true });

sliderWrapper.addEventListener('touchend', (e) => {
  touchEndX = e.changedTouches[0].screenX;
  const diff = touchStartX - touchEndX;
  if (Math.abs(diff) > 50) {
    moveSlider(diff > 0 ? 1 : -1);
  }
  autoSlideInterval = setInterval(() => moveSlider(1), 5000);
}, { passive: true });

function openModal(imgElement, caption) {
  const modal = document.getElementById('modalOverlay');
  const modalImg = document.getElementById('modalImage');
  const modalCaption = document.getElementById('modalCaption');
  modalImg.src = imgElement.src;
  modalImg.alt = imgElement.alt;
  modalCaption.textContent = caption;
  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeModal(event) {
  if (event.target === document.getElementById('modalOverlay') || event.target.closest('.modal-close')) {
    document.getElementById('modalOverlay').classList.remove('active');
    document.body.style.overflow = '';
  }
}

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    document.getElementById('modalOverlay').classList.remove('active');
    document.body.style.overflow = '';
  }
});

const contactForm = document.getElementById('contactForm');
const nameInput = document.getElementById('nameInput');
const emailInput = document.getElementById('emailInput');
const phoneInput = document.getElementById('phoneInput');
const messageInput = document.getElementById('messageInput');
const submitBtn = document.getElementById('submitBtn');
const successMsg = document.getElementById('successMsg');

function setFieldError(groupId, isError) {
  const group = document.getElementById(groupId);
  if (isError) {
    group.classList.add('error');
  } else {
    group.classList.remove('error');
    group.classList.add('success');
  }
}

nameInput.addEventListener('blur', function() {
  if (this.value.trim().length < 2) {
    setFieldError('nameGroup', true);
  } else {
    setFieldError('nameGroup', false);
  }
});

emailInput.addEventListener('blur', function() {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(this.value.trim())) {
    setFieldError('emailGroup', true);
  } else {
    setFieldError('emailGroup', false);
  }
});

phoneInput.addEventListener('blur', function() {
  if (this.value.trim() && this.value.trim().length < 7) {
    setFieldError('phoneGroup', true);
  } else {
    setFieldError('phoneGroup', false);
  }
});

messageInput.addEventListener('blur', function() {
  if (this.value.trim().length < 5) {
    setFieldError('messageGroup', true);
  } else {
    setFieldError('messageGroup', false);
  }
});

contactForm.addEventListener('submit', function(e) {
  e.preventDefault();
  let isValid = true;

  if (nameInput.value.trim().length < 2) {
    setFieldError('nameGroup', true);
    isValid = false;
  } else {
    setFieldError('nameGroup', false);
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(emailInput.value.trim())) {
    setFieldError('emailGroup', true);
    isValid = false;
  } else {
    setFieldError('emailGroup', false);
  }

  if (phoneInput.value.trim() && phoneInput.value.trim().length < 7) {
    setFieldError('phoneGroup', true);
    isValid = false;
  } else {
    setFieldError('phoneGroup', false);
  }

  if (messageInput.value.trim().length < 5) {
    setFieldError('messageGroup', true);
    isValid = false;
  } else {
    setFieldError('messageGroup', false);
  }

  if (!isValid) return;

  submitBtn.classList.add('loading');

  setTimeout(() => {
    submitBtn.classList.remove('loading');
    successMsg.classList.add('active');
    contactForm.reset();
    document.querySelectorAll('.form-group').forEach(g => {
      g.classList.remove('success', 'error');
    });

    setTimeout(() => {
      successMsg.classList.remove('active');
    }, 5000);
  }, 2000);
});

const navLinks = document.querySelectorAll('.header-nav-links a');
navLinks.forEach(link => {
  link.addEventListener('click', function(e) {
    const targetId = this.getAttribute('href');
    const targetEl = document.querySelector(targetId);
    if (targetEl) {
      targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});