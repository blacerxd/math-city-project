const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const mobileNav = document.getElementById('mobileNav');

mobileMenuBtn.addEventListener('click', function() {
  this.classList.toggle('active');
  mobileNav.classList.toggle('active');
  document.body.style.overflow = mobileNav.classList.contains('active') ? 'hidden' : '';
});

mobileNav.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', function() {
    mobileMenuBtn.classList.remove('active');
    mobileNav.classList.remove('active');
    document.body.style.overflow = '';
  });
});

const cards = document.querySelectorAll('.card');
const filterTabs = document.querySelectorAll('.filter-tab');
const searchInput = document.getElementById('searchInput');
const searchClear = document.getElementById('searchClear');
const resultsCount = document.getElementById('resultsCount');
const noResults = document.getElementById('noResults');
const cardsGrid = document.getElementById('cardsGrid');

let currentFilter = 'all';
let currentSearch = '';

function updateCounts() {
  const allCards = document.querySelectorAll('.card');
  document.getElementById('countAll').textContent = allCards.length;

  const writers = document.querySelectorAll('.card[data-category="writer"]');
  document.getElementById('countWriter').textContent = writers.length;

  const scientists = document.querySelectorAll('.card[data-category="scientist"]');
  document.getElementById('countScientist').textContent = scientists.length;

  const artists = document.querySelectorAll('.card[data-category="artist"]');
  document.getElementById('countArtist').textContent = artists.length;
}

function applyFilters() {
  let visibleCount = 0;
  let delay = 0;

  cards.forEach((card, index) => {
    const category = card.getAttribute('data-category');
    const name = card.getAttribute('data-name').toLowerCase();
    const desc = card.getAttribute('data-desc').toLowerCase();
    const categoryLabel = card.querySelector('.card-category').textContent.toLowerCase();

    const matchesFilter = currentFilter === 'all' || category === currentFilter;
    const matchesSearch = currentSearch === '' || name.includes(currentSearch) || desc.includes(currentSearch) || categoryLabel.includes(currentSearch);

    const shouldShow = matchesFilter && matchesSearch;

    if (shouldShow) {
      card.classList.remove('hidden', 'fade-out');
      card.style.transitionDelay = (delay * 50) + 'ms';
      card.style.opacity = '1';
      card.style.transform = 'translateY(0)';
      visibleCount++;
      delay++;
    } else {
      card.classList.add('fade-out');
      setTimeout(() => {
        card.classList.add('hidden');
      }, 400);
    }
  });

  setTimeout(() => {
    if (visibleCount === 0) {
      noResults.classList.add('active');
    } else {
      noResults.classList.remove('active');
    }
    resultsCount.innerHTML = 'Показано <span>' + visibleCount + '</span> персон';
  }, 420);
}

filterTabs.forEach(tab => {
  tab.addEventListener('click', function() {
    filterTabs.forEach(t => t.classList.remove('active'));
    this.classList.add('active');
    currentFilter = this.getAttribute('data-filter');
    applyFilters();
  });
});

searchInput.addEventListener('input', function() {
  currentSearch = this.value.toLowerCase().trim();
  searchClear.classList.toggle('visible', this.value.length > 0);
  applyFilters();
});

searchClear.addEventListener('click', function() {
  searchInput.value = '';
  currentSearch = '';
  searchClear.classList.remove('visible');
  applyFilters();
  searchInput.focus();
});

cards.forEach((card, index) => {
  setTimeout(() => {
    card.classList.add('visible');
  }, index * 100 + 600);
});

updateCounts();

document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') {
    mobileMenuBtn.classList.remove('active');
    mobileNav.classList.remove('active');
    document.body.style.overflow = '';
  }
  if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
    searchInput.focus();
  }
});