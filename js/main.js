function scrollHeader() {
  try {
    const header = document.getElementById('header');
    if (!header) return;
    const isInternalPage = document.body.classList.contains('page-internal');
    const shouldAddClass = isInternalPage || window.scrollY >= 10;
    header.classList.toggle('header--scrolled', shouldAddClass);
  } catch (error) {
    console.error('Erro no scrollHeader:', error);
  }
}

function initSmoothScroll() {
  try {
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
          const header = document.getElementById('header');
          const headerOffset = header ? header.offsetHeight : 0;
          const elementPosition = targetElement.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
          window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
        }
      });
    });
  } catch (error) {
    console.error('Erro ao inicializar smooth scroll:', error);
  }
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
    cards.forEach(card => io.observe(card));
  } catch (error) {
    console.error('Erro no card observer:', error);
  }
}

function updateFooterYear() {
  try {
    const currentYear = new Date().getFullYear();
    const yearElement = document.getElementById('footer-year');
    if (yearElement) {
      yearElement.textContent = currentYear;
    }
  } catch (error) {
    console.error('Erro ao atualizar ano do rodapé:', error);
  }
}

function typeWriterEffect() {
  const el = document.querySelector('.typewriter');
  if (!el) return;
  const text = el.getAttribute('data-text');
  el.textContent = '';
  let i = 0;
  function type() {
    if (i < text.length) {
      el.textContent += text.charAt(i);
      i++;
      setTimeout(type, 100);
    }
  }
  setTimeout(type, 500);
}

function initCourseCarousel() {
  try {
    document.querySelectorAll('.course-carousel').forEach(function (carousel) {
      const track = carousel.querySelector('.course-track');
      const btnPrev = carousel.querySelector('.carousel-button--prev');
      const btnNext = carousel.querySelector('.carousel-button--next');
      if (!track) return;
      const scrollAmount = Math.round(track.clientWidth * 0.7);
      if (btnPrev) {
        btnPrev.addEventListener('click', function () { 
          track.scrollBy({ left: -scrollAmount, behavior: 'smooth' }); 
        });
      }
      if (btnNext) {
        btnNext.addEventListener('click', function () { 
          track.scrollBy({ left: scrollAmount, behavior: 'smooth' }); 
        });
      }
      track.addEventListener('keydown', function (e) {
        if (e.key === 'ArrowRight') { 
          e.preventDefault(); 
          track.scrollBy({ left: 220, behavior: 'smooth' }); 
        }
        if (e.key === 'ArrowLeft') { 
          e.preventDefault(); 
          track.scrollBy({ left: -220, behavior: 'smooth' }); 
        }
      });
    });
  } catch (error) {
    console.error('Erro ao inicializar carrossel de cursos:', error);
  }
}

document.addEventListener('DOMContentLoaded', function () {
  try {
    scrollHeader();
    initSmoothScroll();
    initCardObserver();
    initCourseCarousel();
    updateFooterYear();
    typeWriterEffect();
    const vagasGrid = document.getElementById('vagas-grid');
    if (vagasGrid) {
      allVagasCards = Array.from(document.querySelectorAll('.vaga-card'));
      filteredVagasCards = [...allVagasCards];
      initFilters();
      initSearch();
      initSort();
      initPagination();
      initModal();
      initCandidaturaModal();
      showPage(1);
    }
  } catch (error) {
    console.error('Erro na inicialização principal:', error);
  }
});

window.addEventListener('scroll', scrollHeader);

const ITEMS_PER_PAGE = 6;
let currentPage = 1;
let currentSort = 'recente';
let allVagasCards = [];
let filteredVagasCards = [];

function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

function initFilters() {
  const filterTags = document.querySelectorAll('.filter-tag');
  filterTags.forEach(tag => {
    tag.addEventListener('click', function() {
      const parentGroup = this.closest('.filter-tags');
      parentGroup.querySelectorAll('.filter-tag').forEach(btn => {
        btn.classList.remove('is-active');
        btn.setAttribute('aria-pressed', 'false');
      });
      this.classList.add('is-active');
      this.setAttribute('aria-pressed', 'true');
      applyFilters();
    });
  });
}

function initSearch() {
  const searchInput = document.getElementById('search-input');
  if (!searchInput) return;
  const debouncedSearch = debounce(() => {
    applyFilters();
  }, 300);
  searchInput.addEventListener('input', debouncedSearch);
}

function applyFilters() {
  const searchInput = document.getElementById('search-input');
  if (!searchInput) return;
  const searchTerm = searchInput.value.toLowerCase().trim();
  const getFilterValue = (filterName) => {
    const activeBtn = document.querySelector(`[data-filter="${filterName}"] .filter-tag.is-active`);
    return activeBtn ? activeBtn.getAttribute('data-value') : 'todos';
  };
  const modoAtivo = getFilterValue('modo');
  const tipoAtivo = getFilterValue('tipo');
  const areaAtiva = getFilterValue('area');
  filteredVagasCards = allVagasCards.filter(card => {
    const modo = card.getAttribute('data-modo');
    const tipo = card.getAttribute('data-tipo');
    const area = card.getAttribute('data-area');
    const tituloEl = card.querySelector('.card__title');
    const descEl = card.querySelector('.card__description');
    const titulo = tituloEl ? tituloEl.textContent.toLowerCase() : '';
    const descricao = descEl ? descEl.textContent.toLowerCase() : '';
    const modoMatch = modoAtivo === 'todos' || modo === modoAtivo;
    const tipoMatch = tipoAtivo === 'todos' || tipo === tipoAtivo;
    const areaMatch = areaAtiva === 'todos' || areaAtiva === 'todas' || area === areaAtiva;
    const searchMatch = searchTerm === '' || titulo.includes(searchTerm) || descricao.includes(searchTerm);
    return modoMatch && tipoMatch && areaMatch && searchMatch;
  });
  if (currentSort) {
    sortVagas(currentSort);
  } else {
    showPage(1);
  }
}

function initSort() {
  const sortSelect = document.getElementById('sort-select');
  if (!sortSelect) return;
  sortSelect.addEventListener('change', function() {
    sortVagas(this.value);
  });
}

function sortVagas(sortType) {
  currentSort = sortType;
  filteredVagasCards.sort((a, b) => {
    switch (sortType) {
      case 'recente':
        const dateA = new Date(a.getAttribute('data-date') || '2025-01-01');
        const dateB = new Date(b.getAttribute('data-date') || '2025-01-01');
        return dateB - dateA;
      case 'antiga':
        const dateA2 = new Date(a.getAttribute('data-date') || '2025-01-01');
        const dateB2 = new Date(b.getAttribute('data-date') || '2025-01-01');
        return dateA2 - dateB2;
      case 'alfabetica':
        const titleA = a.querySelector('.card__title')?.textContent.trim() || '';
        const titleB = b.querySelector('.card__title')?.textContent.trim() || '';
        return titleA.localeCompare(titleB);
      case 'tipo':
        const tipoOrder = { 'efetivo': 1, 'estagio': 2, 'banco': 3 };
        const tipoA = a.getAttribute('data-tipo') || '';
        const tipoB = b.getAttribute('data-tipo') || '';
        const tipoComparison = (tipoOrder[tipoA] || 999) - (tipoOrder[tipoB] || 999);
        if (tipoComparison === 0) {
          const titleA = a.querySelector('.card__title')?.textContent.trim() || '';
          const titleB = b.querySelector('.card__title')?.textContent.trim() || '';
          return titleA.localeCompare(titleB);
        }
        return tipoComparison;
      default:
        return 0;
    }
  });
  showPage(1);
}

function initPagination() {
  const prevButton = document.getElementById('prev-page');
  const nextButton = document.getElementById('next-page');
  if (prevButton) {
    prevButton.addEventListener('click', () => {
      if (currentPage > 1) {
        showPage(currentPage - 1);
        scrollToVagasList();
      }
    });
  }
  if (nextButton) {
    nextButton.addEventListener('click', () => {
      const totalPages = Math.ceil(filteredVagasCards.length / ITEMS_PER_PAGE);
      if (currentPage < totalPages) {
        showPage(currentPage + 1);
        scrollToVagasList();
      }
    });
  }
}

function showPage(page) {
  currentPage = page;
  const totalPages = Math.ceil(filteredVagasCards.length / ITEMS_PER_PAGE);
  const paginationContainer = document.getElementById('pagination');
  const noResults = document.getElementById('no-results');
  const countSpan = document.getElementById('vagas-count');
  allVagasCards.forEach(card => card.classList.add('hidden'));
  if (filteredVagasCards.length === 0) {
    if (paginationContainer) paginationContainer.classList.add('hidden');
    if (noResults) noResults.classList.remove('hidden');
    if (countSpan) countSpan.textContent = '0';
    return; 
  }
  const startIndex = (page - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const vagasToShow = filteredVagasCards.slice(startIndex, endIndex);
  vagasToShow.forEach(card => {
    card.classList.remove('hidden');
  });
  if (noResults) noResults.classList.add('hidden');
  if (countSpan) countSpan.textContent = filteredVagasCards.length;
  if (paginationContainer) {
    paginationContainer.classList.toggle('hidden', filteredVagasCards.length <= 6);
  }
  updatePaginationButtons(totalPages);
}

function updatePaginationButtons(totalPages) {
  const prevButton = document.getElementById('prev-page');
  const nextButton = document.getElementById('next-page');
  const currentSpan = document.getElementById('current-page');
  const totalSpan = document.getElementById('total-pages');
  if (currentSpan) currentSpan.textContent = currentPage;
  if (totalSpan) totalSpan.textContent = totalPages || 1;
  if (prevButton) prevButton.disabled = currentPage === 1;
  if (nextButton) nextButton.disabled = currentPage >= totalPages || totalPages === 0;
}

function scrollToVagasList() {
  try {
    const vagasListHeader = document.querySelector('.vagas-list-header');
    if (vagasListHeader) {
      const header = document.getElementById('header');
      const headerOffset = header ? header.offsetHeight : 0;
      const elementPosition = vagasListHeader.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset - 20;
      window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
    }
  } catch (error) {
    console.error('Erro ao fazer scroll para lista:', error);
  }
}

function initModal() {
  const modalOverlay = document.getElementById('modal-overlay');
  const modalClose = document.getElementById('modal-close');
  const modalCloseBtn = document.getElementById('modal-close-btn');
  if (modalClose) {
    modalClose.addEventListener('click', closeModal);
  }
  if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', closeModal);
  }
  if (modalOverlay) {
    modalOverlay.addEventListener('click', function(e) {
      if (e.target === modalOverlay) {
        closeModal();
      }
    });
  }
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      closeModal();
    }
  });
  document.addEventListener('click', function(e) {
    const btn = e.target.closest('.btn-ver-detalhes, .card__link');
    if (btn) {
      e.preventDefault();
      const vagaCard = btn.closest('.vaga-card');
      if (vagaCard) {
        openModal(vagaCard);
      }
    }
  });
}

function openModal(vagaCard) {
  const modalOverlay = document.getElementById('modal-overlay');
  const tipo = vagaCard.getAttribute('data-tipo') || 'efetivo';
  const titulo = vagaCard.getAttribute('data-titulo') || vagaCard.querySelector('.card__title')?.textContent.trim() || 'Vaga não especificada';
  const localizacao = vagaCard.getAttribute('data-localizacao') || vagaCard.querySelector('.card__description')?.textContent.trim() || 'Localização não especificada';
  const descricao = vagaCard.getAttribute('data-descricao') || 'Estamos buscando profissionais talentosos para integrar nosso time. Entre em contato conosco para mais informações sobre esta oportunidade.';
  const requisitosStr = vagaCard.getAttribute('data-requisitos') || '';
  const beneficiosStr = vagaCard.getAttribute('data-beneficios') || '';
  const requisitos = requisitosStr ? requisitosStr.split('|').filter(r => r.trim()) : [];
  const beneficios = beneficiosStr ? beneficiosStr.split('|').filter(b => b.trim()) : [];
  const modalTag = document.getElementById('modal-tag');
  const modalTitle = document.getElementById('modal-title');
  const modalLocation = document.getElementById('modal-location');
  const modalDescription = document.getElementById('modal-description');
  const modalRequirements = document.getElementById('modal-requirements');
  const modalBenefits = document.getElementById('modal-benefits');
  if (modalTag) {
    modalTag.textContent = tipo === 'estagio' ? 'Estágio' : tipo === 'efetivo' ? 'Efetivo' : 'Banco de Talentos';
    modalTag.className = 'modal-tag';
  }
  if (modalTitle) {
    modalTitle.textContent = titulo;
  }
  if (modalLocation) {
    const locationText = localizacao.replace(/<svg[^>]*>.*?<\/svg>/gi, '').trim();
    const textNode = modalLocation.childNodes[modalLocation.childNodes.length - 1];
    if (textNode && textNode.nodeType === Node.TEXT_NODE) {
      textNode.textContent = ' ' + locationText;
    } else {
      const svg = modalLocation.querySelector('svg');
      if (svg) {
        svg.nextSibling ? svg.nextSibling.textContent = ' ' + locationText : modalLocation.appendChild(document.createTextNode(' ' + locationText));
      }
    }
  }
  if (modalDescription) {
    modalDescription.textContent = descricao;
  }
  if (modalRequirements) {
    if (requisitos.length > 0) {
      modalRequirements.innerHTML = requisitos.map(req => `<li>${req.trim()}</li>`).join('');
    } else {
      modalRequirements.innerHTML = '<li>Entre em contato para mais informações</li>';
    }
  }
  if (modalBenefits) {
    if (beneficios.length > 0) {
      modalBenefits.innerHTML = beneficios.map(ben => `<li>${ben.trim()}</li>`).join('');
    } else {
      modalBenefits.innerHTML = '<li>Entre em contato para mais informações</li>';
    }
  }
  if (modalOverlay) {
    modalOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
}

function closeModal() {
  const modalOverlay = document.getElementById('modal-overlay');
  if (modalOverlay) {
    modalOverlay.classList.remove('active');
    document.body.style.overflow = '';
  }
}

function initCandidaturaModal() {
  const btnCandidatar = document.getElementById('btn-candidatar');
  const modalCandidaturaOverlay = document.getElementById('modal-candidatura-overlay');
  const modalCandidaturaClose = document.getElementById('modal-candidatura-close');
  const candidaturaForm = document.getElementById('candidatura-form');
  const telefoneInput = document.getElementById('candidato-telefone');
  if (telefoneInput) {
    telefoneInput.addEventListener('input', formatPhoneNumber);
  }
  const nomeInput = document.getElementById('candidato-nome');
  const emailInput = document.getElementById('candidato-email');
  if (nomeInput) {
    nomeInput.addEventListener('blur', function() {
      if (this.value && !validateNomeCompleto(this.value)) {
        showFieldError(this, 'Por favor, informe seu nome completo (nome e sobrenome)');
      } else {
        removeFieldError(this);
      }
    });
  }
  if (emailInput) {
    emailInput.addEventListener('blur', function() {
      if (this.value && !validateEmail(this.value)) {
        showFieldError(this, 'Por favor, informe um email válido');
      } else {
        removeFieldError(this);
      }
    });
  }
  if (telefoneInput) {
    telefoneInput.addEventListener('blur', function() {
      if (this.value && !validateTelefone(this.value)) {
        showFieldError(this, 'Por favor, informe um telefone válido (10 ou 11 dígitos)');
      } else {
        removeFieldError(this);
      }
    });
  }
  const linkedinInput = document.getElementById('candidato-linkedin');
  if (linkedinInput) {
    linkedinInput.addEventListener('blur', function() {
      if (this.value && !validateURL(this.value)) {
        showFieldError(this, 'Por favor, informe uma URL válida (ex: https://linkedin.com/in/seu-perfil)');
      } else {
        removeFieldError(this);
      }
    });
  }
  if (btnCandidatar) {
    btnCandidatar.addEventListener('click', () => {
      closeModal();
      const modalTitle = document.getElementById('modal-title');
      const vagaTitulo = modalTitle ? modalTitle.textContent : 'Vaga';
      openCandidaturaModal(vagaTitulo);
    });
  }
  if (modalCandidaturaClose) {
    modalCandidaturaClose.addEventListener('click', closeCandidaturaModal);
  }
  if (modalCandidaturaOverlay) {
    modalCandidaturaOverlay.addEventListener('click', (e) => {
      if (e.target === modalCandidaturaOverlay) {
        closeCandidaturaModal();
      }
    });
  }
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalCandidaturaOverlay && modalCandidaturaOverlay.classList.contains('active')) {
      closeCandidaturaModal();
    }
  });
  if (candidaturaForm) {
    candidaturaForm.addEventListener('submit', handleCandidaturaSubmit);
  }
}

function formatPhoneNumber(e) {
  let value = e.target.value;
  value = value.replace(/\D/g, '');
  if (value.length <= 10) {
    value = value.replace(/^(\d{2})(\d)/g, '($1) $2');
    value = value.replace(/(\d{4})(\d)/, '$1-$2');
  } else {
    value = value.replace(/^(\d{2})(\d)/g, '($1) $2');
    value = value.replace(/(\d{5})(\d)/, '$1-$2');
  }
  e.target.value = value;
}

function openCandidaturaModal(vagaTitulo) {
  const modalCandidaturaOverlay = document.getElementById('modal-candidatura-overlay');
  const candidaturaVagaNome = document.getElementById('candidatura-vaga-nome');
  if (candidaturaVagaNome) {
    candidaturaVagaNome.textContent = vagaTitulo;
  }
  const candidaturaForm = document.getElementById('candidatura-form');
  if (candidaturaForm) {
    candidaturaForm.reset();
  }
  if (modalCandidaturaOverlay) {
    modalCandidaturaOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
}

function closeCandidaturaModal() {
  const modalCandidaturaOverlay = document.getElementById('modal-candidatura-overlay');
  if (modalCandidaturaOverlay) {
    modalCandidaturaOverlay.classList.remove('active');
    document.body.style.overflow = '';
  }
}

function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function validateTelefone(telefone) {
  const numbers = telefone.replace(/\D/g, '');
  return numbers.length === 10 || numbers.length === 11;
}

function validateNomeCompleto(nome) {
  const words = nome.trim().split(/\s+/);
  return words.length >= 2 && words.every(word => word.length >= 2);
}

function validateURL(url) {
  try {
    const urlObj = new URL(url);
    return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
  } catch {
    return false;
  }
}

function showFieldError(input, message) {
  removeFieldError(input);
  input.classList.add('form-input--error');
  input.setAttribute('aria-invalid', 'true');
  const errorDiv = document.createElement('div');
  errorDiv.className = 'form-error';
  errorDiv.id = `${input.id}-error`;
  errorDiv.setAttribute('role', 'alert');
  errorDiv.textContent = `⚠ ${message}`;
  input.setAttribute('aria-describedby', errorDiv.id);
  input.parentNode.insertBefore(errorDiv, input.nextSibling);
}

function removeFieldError(input) {
  input.classList.remove('form-input--error');
  input.setAttribute('aria-invalid', 'false');
  input.removeAttribute('aria-describedby');
  const errorDiv = input.parentNode.querySelector('.form-error');
  if (errorDiv) {
    errorDiv.remove();
  }
}

function handleCandidaturaSubmit(e) {
  e.preventDefault();
  const formData = new FormData(e.target);
  const nome = formData.get('nome');
  const email = formData.get('email');
  const telefone = formData.get('telefone');
  const linkedin = formData.get('linkedin');
  const vagaTitulo = document.getElementById('candidatura-vaga-nome').textContent;
  const nomeInput = document.getElementById('candidato-nome');
  const emailInput = document.getElementById('candidato-email');
  const telefoneInput = document.getElementById('candidato-telefone');
  const linkedinInput = document.getElementById('candidato-linkedin');
  removeFieldError(nomeInput);
  removeFieldError(emailInput);
  removeFieldError(telefoneInput);
  if (linkedinInput) removeFieldError(linkedinInput);
  let hasError = false;
  if (!validateNomeCompleto(nome)) {
    showFieldError(nomeInput, 'Por favor, informe seu nome completo (nome e sobrenome)');
    hasError = true;
  }
  if (!validateEmail(email)) {
    showFieldError(emailInput, 'Por favor, informe um email válido');
    hasError = true;
  }
  if (!validateTelefone(telefone)) {
    showFieldError(telefoneInput, 'Por favor, informe um telefone válido (10 ou 11 dígitos)');
    hasError = true;
  }
  if (linkedin && linkedinInput && !validateURL(linkedin)) {
    showFieldError(linkedinInput, 'Por favor, informe uma URL válida');
    hasError = true;
  }
  if (hasError) {
    return;
  }
  closeCandidaturaModal();
  showSuccessNotification();
}

function showSuccessNotification() {
  const notification = document.getElementById('success-notification');
  if (notification) {
    notification.classList.add('show');
    setTimeout(() => {
      notification.classList.remove('show');
    }, 4000);
  }
}
