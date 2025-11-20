
// ================================================
// MAIN.JS - FUNCIONALIDADES PRINCIPAIS DO SITE
// ================================================

/**
 * Adiciona ou remove classe de scroll no header
 */
function scrollHeader() {
  try {
    const header = document.getElementById('header');
    if (!header) return;
    
    // Em páginas internas, manter sempre o fundo azul
    const isInternalPage = document.body.classList.contains('page-internal');
    
    if (isInternalPage) {
      // Sempre manter a classe header--scrolled em páginas internas
      header.classList.add('header--scrolled');
    } else {
      // Comportamento normal para a home (adiciona/remove conforme scroll)
      if (window.scrollY >= 10) {
        header.classList.add('header--scrolled');
      } else {
        header.classList.remove('header--scrolled');
      }
    }
  } catch (error) {
    console.error('Erro no scrollHeader:', error);
  }
}

/**
 * Retorna a altura do header para calcular offsets
 * @returns {number} Altura do header em pixels
 */
function getHeaderOffset() {
  try {
    const header = document.getElementById('header');
    return header ? header.offsetHeight : 0;
  } catch (error) {
    console.error('Erro ao obter altura do header:', error);
    return 0;
  }
}

/**
 * Scroll suave para posição específica
 * @param {number} top - Posição Y para scroll
 */
function smoothScrollToPosition(top) {
  try {
    window.scrollTo({ top, behavior: 'smooth' });
  } catch (error) {
    console.error('Erro no scroll suave:', error);
    // Fallback para navegadores antigos
    window.scrollTo(0, top);
  }
}

/**
 * Inicializa scroll suave para âncoras
 */
function initSmoothScroll() {
  try {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        const targetId = this.getAttribute('href');

        // Ignorar links vazios ou desabilitados
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
  } catch (error) {
    console.error('Erro ao inicializar smooth scroll:', error);
  }
}

/**
 * Observa cards para animação de entrada (reveal on scroll)
 */
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
    }, { 
      root: null, 
      rootMargin: '0px', 
      threshold: 0.12 
    });
    
    cards.forEach(card => io.observe(card));
  } catch (error) {
    console.error('Erro no card observer:', error);
  }
}

/**
 * Atualiza o ano no rodapé dinamicamente
 */
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

/**
 * Inicializa o carrossel de cursos
 */
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

      // Navegação por teclado quando o track está focado
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

/**
 * Inicialização principal
 */
document.addEventListener('DOMContentLoaded', function () {
  try {
    // Aplicar estado inicial do header
    scrollHeader();

    // Inicializar funcionalidades comuns
    initSmoothScroll();
    initCardObserver();
    initCourseCarousel();
    updateFooterYear();

    // Inicializar funcionalidades específicas da página de vagas
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

// Listener para scroll
window.addEventListener('scroll', scrollHeader);

// ========================================
// LÓGICA DA PÁGINA DE VAGAS
// ========================================

// ================================================
// VAGAS.JS - LÃ“GICA ESPECÃFICA DA PÃGINA DE VAGAS
// ================================================

// ===================================
// 1. VARIÃVEIS DE ESTADO
// ===================================

let currentPage = 1;
const itemsPerPage = 6;
let allVagasCards = [];
let filteredVagasCards = [];


// ===================================
// 2. UTILITÃRIOS
// ===================================

/**
 * Debounce: Atrasa a execuÃ§Ã£o de uma funÃ§Ã£o atÃ© que ela pare de ser chamada
 * por um determinado perÃ­odo de tempo.
 * @param {Function} func - FunÃ§Ã£o a ser executada
 * @param {number} wait - Tempo de espera em milissegundos
 * @returns {Function} - FunÃ§Ã£o com debounce aplicado
 */
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


// ===================================
// 3. INICIALIZAÇÃO (REMOVIDA - CONSOLIDADA NO INÍCIO DO ARQUIVO)
// ===================================


// ===================================
// 4. SISTEMA DE FILTROS
// ===================================

/**
 * Inicializa os filtros de tags (modo, tipo, Ã¡rea)
 */
function initFilters() {
  const filterTags = document.querySelectorAll('.filter-tag');
  filterTags.forEach(tag => {
    tag.addEventListener('click', function() {
      const parentGroup = this.closest('.filter-tags');
      // Remover estado ativo de todos os botÃµes do grupo e atualizar aria-pressed
      parentGroup.querySelectorAll('.filter-tag').forEach(btn => {
        btn.classList.remove('is-active');
        btn.setAttribute('aria-pressed', 'false');
      });
      // Ativar botÃ£o clicado e atualizar aria-pressed
      this.classList.add('is-active');
      this.setAttribute('aria-pressed', 'true');
      // Re-aplicar filtros
      applyFilters();
    });
  });
}

/**
 * Inicializa a barra de busca com debounce
 */
function initSearch() {
  const searchInput = document.getElementById('search-input');
  if (!searchInput) return;

  const debouncedSearch = debounce(() => {
    applyFilters();
  }, 300);
  
  searchInput.addEventListener('input', debouncedSearch);
}

/**
 * Aplica todos os filtros ativos e atualiza a lista de vagas exibidas
 */
function applyFilters() {
  const searchInput = document.getElementById('search-input');
  const searchTerm = searchInput ? searchInput.value.toLowerCase().trim() : '';
  
  // Ler filtros ativos
  const modoAtivo = document.querySelector('[data-filter="modo"] .filter-tag.is-active')?.getAttribute('data-value');
  const tipoAtivo = document.querySelector('[data-filter="tipo"] .filter-tag.is-active')?.getAttribute('data-value');
  const areaAtiva = document.querySelector('[data-filter="area"] .filter-tag.is-active')?.getAttribute('data-value');
  
  // Filtrar a lista principal
  filteredVagasCards = allVagasCards.filter(card => {
    const modo = card.getAttribute('data-modo');
    const tipo = card.getAttribute('data-tipo');
    const area = card.getAttribute('data-area');
    const titulo = card.querySelector('.card__title')?.textContent.toLowerCase() || '';
    const descricao = card.querySelector('.card__description')?.textContent.toLowerCase() || '';
    
    const modoMatch = modoAtivo === 'todos' || modo === modoAtivo;
    const tipoMatch = tipoAtivo === 'todos' || tipo === tipoAtivo;
    const areaMatch = areaAtiva === 'todos' || areaAtiva === 'todas' || area === areaAtiva;
    const searchMatch = searchTerm === '' || titulo.includes(searchTerm) || descricao.includes(searchTerm);
    
    return modoMatch && tipoMatch && areaMatch && searchMatch;
  });
  
  // Voltar para a pÃ¡gina 1 sempre que filtrar
  showPage(1);
}


// ===================================
// 5. SISTEMA DE ORDENAÃ‡ÃƒO
// ===================================

/**
 * Inicializa o select de ordenaÃ§Ã£o
 */
function initSort() {
  const sortSelect = document.getElementById('sort-select');
  if (!sortSelect) return;

  sortSelect.addEventListener('change', function() {
    sortVagas(this.value);
  });
}

/**
 * Ordena as vagas filtradas de acordo com o critÃ©rio selecionado
 * @param {string} sortType - Tipo de ordenaÃ§Ã£o: 'recente', 'antiga', 'alfabetica', 'tipo'
 */
function sortVagas(sortType) {
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
        
        // Se forem do mesmo tipo, ordenar alfabeticamente
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
  showPage(1); // Re-renderiza a pÃ¡gina 1 com a nova ordem
}


// ===================================
// 6. SISTEMA DE PAGINAÃ‡ÃƒO E RENDERIZAÃ‡ÃƒO
// ===================================

/**
 * Inicializa os botÃµes de paginaÃ§Ã£o
 */
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
      const totalPages = Math.ceil(filteredVagasCards.length / itemsPerPage);
      if (currentPage < totalPages) {
        showPage(currentPage + 1);
        scrollToVagasList();
      }
    });
  }
}

/**
 * Exibe a pÃ¡gina especificada de vagas
 * @param {number} page - NÃºmero da pÃ¡gina a ser exibida
 */
function showPage(page) {
  currentPage = page;
  const totalPages = Math.ceil(filteredVagasCards.length / itemsPerPage);
  const paginationContainer = document.getElementById('pagination');
  const noResults = document.getElementById('no-results');
  const countSpan = document.getElementById('vagas-count');

  // 1. Esconder TUDO primeiro (reset)
  allVagasCards.forEach(card => card.style.display = 'none');

  // 2. Verificar se hÃ¡ resultados
  if (filteredVagasCards.length === 0) {
    if (paginationContainer) paginationContainer.style.display = 'none';
    if (noResults) noResults.style.display = 'block';
    if (countSpan) countSpan.textContent = '0';
    return; 
  }

  // 3. Calcular quais exibir
  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const vagasToShow = filteredVagasCards.slice(startIndex, endIndex);

  // 4. Exibir as vagas da pÃ¡gina
  vagasToShow.forEach(card => {
    card.style.display = 'flex';
  });

  // 5. Atualizar UI de controle
  if (noResults) noResults.style.display = 'none';
  if (countSpan) countSpan.textContent = filteredVagasCards.length;

  // 6. Controle da PaginaÃ§Ã£o - ESCONDE se houver 6 ou menos vagas
  if (paginationContainer) {
    paginationContainer.style.display = (filteredVagasCards.length > 6) ? 'flex' : 'none';
  }
  
  updatePaginationButtons(totalPages);
}

/**
 * Atualiza o estado dos botÃµes de paginaÃ§Ã£o (habilitado/desabilitado)
 * @param {number} totalPages - NÃºmero total de pÃ¡ginas
 */
function updatePaginationButtons(totalPages) {
  const prevButton = document.getElementById('prev-page');
  const nextButton = document.getElementById('next-page');
  const currentSpan = document.getElementById('current-page');
  const totalSpan = document.getElementById('total-pages');

  if (currentSpan) currentSpan.textContent = currentPage;
  if (totalSpan) totalSpan.textContent = totalPages || 1; // Evita "0"

  if (prevButton) prevButton.disabled = currentPage === 1;
  if (nextButton) nextButton.disabled = currentPage >= totalPages || totalPages === 0;
}

/**
 * Faz scroll suave atÃ© a lista de vagas
 */
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


// ===================================
// 7. MODAL DE DETALHES DA VAGA
// ===================================

/**
 * Inicializa o modal de detalhes (eventos de abertura/fechamento)
 */
function initModal() {
  const modalOverlay = document.getElementById('modal-overlay');
  const modalClose = document.getElementById('modal-close');
  const modalCloseBtn = document.getElementById('modal-close-btn');
  
  // Fechar modal ao clicar no X
  if (modalClose) {
    modalClose.addEventListener('click', closeModal);
  }
  
  // Fechar modal ao clicar no botÃ£o Fechar
  if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', closeModal);
  }
  
  // Fechar modal ao clicar fora do conteÃºdo
  if (modalOverlay) {
    modalOverlay.addEventListener('click', function(e) {
      if (e.target === modalOverlay) {
        closeModal();
      }
    });
  }
  
  // Fechar modal com tecla ESC
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      closeModal();
    }
  });
  
  // Adicionar evento de click em todos os botÃµes "Ver detalhes"
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

/**
 * Abre o modal de detalhes da vaga com as informaÃ§Ãµes do card clicado
 * @param {HTMLElement} vagaCard - Elemento do card da vaga
 */
function openModal(vagaCard) {
  const modalOverlay = document.getElementById('modal-overlay');
  
  // Extrair dados da vaga com fallbacks robustos
  const tipo = vagaCard.getAttribute('data-tipo') || 'efetivo';
  const titulo = vagaCard.getAttribute('data-titulo') || vagaCard.querySelector('.card__title')?.textContent.trim() || 'Vaga nÃ£o especificada';
  const localizacao = vagaCard.getAttribute('data-localizacao') || vagaCard.querySelector('.card__description')?.textContent.trim() || 'LocalizaÃ§Ã£o nÃ£o especificada';
  const descricao = vagaCard.getAttribute('data-descricao') || 'Estamos buscando profissionais talentosos para integrar nosso time. Entre em contato conosco para mais informaÃ§Ãµes sobre esta oportunidade.';
  const requisitosStr = vagaCard.getAttribute('data-requisitos') || '';
  const beneficiosStr = vagaCard.getAttribute('data-beneficios') || '';
  
  // Converter strings em arrays (separados por |)
  const requisitos = requisitosStr ? requisitosStr.split('|').filter(r => r.trim()) : [];
  const beneficios = beneficiosStr ? beneficiosStr.split('|').filter(b => b.trim()) : [];
  
  // Atualizar conteÃºdo do modal
  const modalTag = document.getElementById('modal-tag');
  const modalTitle = document.getElementById('modal-title');
  const modalLocation = document.getElementById('modal-location');
  const modalDescription = document.getElementById('modal-description');
  const modalRequirements = document.getElementById('modal-requirements');
  const modalBenefits = document.getElementById('modal-benefits');
  
  // Tag de tipo de vaga
  if (modalTag) {
    modalTag.textContent = tipo === 'estagio' ? 'EstÃ¡gio' : tipo === 'efetivo' ? 'Efetivo' : 'Banco de Talentos';
    modalTag.className = 'modal-tag';
  }
  
  // TÃ­tulo
  if (modalTitle) {
    modalTitle.textContent = titulo;
  }
  
  // LocalizaÃ§Ã£o (limpar Ã­cone SVG se existir)
  if (modalLocation) {
    // Manter apenas o texto, removendo possÃ­veis elementos SVG
    const locationText = localizacao.replace(/<svg[^>]*>.*?<\/svg>/gi, '').trim();
    const textNode = modalLocation.childNodes[modalLocation.childNodes.length - 1];
    if (textNode && textNode.nodeType === Node.TEXT_NODE) {
      textNode.textContent = ' ' + locationText;
    } else {
      // Se nÃ£o houver nÃ³ de texto, criar um novo
      const svg = modalLocation.querySelector('svg');
      if (svg) {
        svg.nextSibling ? svg.nextSibling.textContent = ' ' + locationText : modalLocation.appendChild(document.createTextNode(' ' + locationText));
      }
    }
  }
  
  // DescriÃ§Ã£o
  if (modalDescription) {
    modalDescription.textContent = descricao;
  }
  
  // Requisitos
  if (modalRequirements) {
    if (requisitos.length > 0) {
      modalRequirements.innerHTML = requisitos.map(req => `<li>${req.trim()}</li>`).join('');
    } else {
      modalRequirements.innerHTML = '<li>Entre em contato para mais informaÃ§Ãµes</li>';
    }
  }
  
  // BenefÃ­cios
  if (modalBenefits) {
    if (beneficios.length > 0) {
      modalBenefits.innerHTML = beneficios.map(ben => `<li>${ben.trim()}</li>`).join('');
    } else {
      modalBenefits.innerHTML = '<li>Entre em contato para mais informaÃ§Ãµes</li>';
    }
  }
  
  // Mostrar modal
  if (modalOverlay) {
    modalOverlay.classList.add('active');
    document.body.style.overflow = 'hidden'; // Prevenir scroll do body
  }
}

/**
 * Fecha o modal de detalhes da vaga
 */
function closeModal() {
  const modalOverlay = document.getElementById('modal-overlay');
  if (modalOverlay) {
    modalOverlay.classList.remove('active');
    document.body.style.overflow = ''; // Restaurar scroll do body
  }
}


// ===================================
// 8. MODAL DE CANDIDATURA
// ===================================

/**
 * Inicializa o modal de candidatura (formulÃ¡rio e eventos)
 */
function initCandidaturaModal() {
  const btnCandidatar = document.getElementById('btn-candidatar');
  const modalCandidaturaOverlay = document.getElementById('modal-candidatura-overlay');
  const modalCandidaturaClose = document.getElementById('modal-candidatura-close');
  const candidaturaForm = document.getElementById('candidatura-form');
  const telefoneInput = document.getElementById('candidato-telefone');
  
  // Formatar telefone automaticamente
  if (telefoneInput) {
    telefoneInput.addEventListener('input', formatPhoneNumber);
  }
  
  // Adicionar validaÃ§Ã£o em tempo real
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
        showFieldError(this, 'Por favor, informe um email vÃ¡lido');
      } else {
        removeFieldError(this);
      }
    });
  }
  
  if (telefoneInput) {
    telefoneInput.addEventListener('blur', function() {
      if (this.value && !validateTelefone(this.value)) {
        showFieldError(this, 'Por favor, informe um telefone vÃ¡lido (10 ou 11 dÃ­gitos)');
      } else {
        removeFieldError(this);
      }
    });
  }
  
  // Abrir modal de candidatura
  if (btnCandidatar) {
    btnCandidatar.addEventListener('click', () => {
      // Fechar modal de detalhes
      closeModal();
      
      // Pegar o tÃ­tulo da vaga do modal de detalhes
      const modalTitle = document.getElementById('modal-title');
      const vagaTitulo = modalTitle ? modalTitle.textContent : 'Vaga';
      
      // Abrir modal de candidatura com o tÃ­tulo da vaga
      openCandidaturaModal(vagaTitulo);
    });
  }
  
  // Fechar modal de candidatura - botÃ£o X
  if (modalCandidaturaClose) {
    modalCandidaturaClose.addEventListener('click', closeCandidaturaModal);
  }
  
  // Fechar modal de candidatura - clicar fora
  if (modalCandidaturaOverlay) {
    modalCandidaturaOverlay.addEventListener('click', (e) => {
      if (e.target === modalCandidaturaOverlay) {
        closeCandidaturaModal();
      }
    });
  }
  
  // Fechar modal de candidatura - tecla ESC
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalCandidaturaOverlay && modalCandidaturaOverlay.classList.contains('active')) {
      closeCandidaturaModal();
    }
  });
  
  // Enviar formulÃ¡rio
  if (candidaturaForm) {
    candidaturaForm.addEventListener('submit', handleCandidaturaSubmit);
  }
}

/**
 * Formata automaticamente o nÃºmero de telefone conforme o usuÃ¡rio digita
 * @param {Event} e - Evento de input
 */
function formatPhoneNumber(e) {
  let value = e.target.value;
  
  // Remove tudo que nÃ£o Ã© nÃºmero
  value = value.replace(/\D/g, '');
  
  // Formata conforme o usuÃ¡rio digita
  if (value.length <= 10) {
    // Formato: (00) 0000-0000
    value = value.replace(/^(\d{2})(\d)/g, '($1) $2');
    value = value.replace(/(\d{4})(\d)/, '$1-$2');
  } else {
    // Formato: (00) 00000-0000
    value = value.replace(/^(\d{2})(\d)/g, '($1) $2');
    value = value.replace(/(\d{5})(\d)/, '$1-$2');
  }
  
  e.target.value = value;
}

/**
 * Abre o modal de candidatura
 * @param {string} vagaTitulo - TÃ­tulo da vaga para a qual o usuÃ¡rio estÃ¡ se candidatando
 */
function openCandidaturaModal(vagaTitulo) {
  const modalCandidaturaOverlay = document.getElementById('modal-candidatura-overlay');
  const candidaturaVagaNome = document.getElementById('candidatura-vaga-nome');
  
  // Definir nome da vaga no modal
  if (candidaturaVagaNome) {
    candidaturaVagaNome.textContent = vagaTitulo;
  }
  
  // Limpar formulÃ¡rio
  const candidaturaForm = document.getElementById('candidatura-form');
  if (candidaturaForm) {
    candidaturaForm.reset();
  }
  
  // Mostrar modal
  if (modalCandidaturaOverlay) {
    modalCandidaturaOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
}

/**
 * Fecha o modal de candidatura
 */
function closeCandidaturaModal() {
  const modalCandidaturaOverlay = document.getElementById('modal-candidatura-overlay');
  if (modalCandidaturaOverlay) {
    modalCandidaturaOverlay.classList.remove('active');
    document.body.style.overflow = '';
  }
}

/**
 * Valida se o email estÃ¡ no formato correto
 * @param {string} email - Email a ser validado
 * @returns {boolean} - true se vÃ¡lido, false caso contrÃ¡rio
 */
function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Valida se o telefone estÃ¡ no formato correto (brasileiro)
 * @param {string} telefone - Telefone a ser validado
 * @returns {boolean} - true se vÃ¡lido, false caso contrÃ¡rio
 */
function validateTelefone(telefone) {
  // Remove caracteres nÃ£o numÃ©ricos
  const numbers = telefone.replace(/\D/g, '');
  // Aceita 10 dÃ­gitos (fixo) ou 11 dÃ­gitos (celular)
  return numbers.length === 10 || numbers.length === 11;
}

/**
 * Valida se o nome tem pelo menos 2 palavras
 * @param {string} nome - Nome completo a ser validado
 * @returns {boolean} - true se vÃ¡lido, false caso contrÃ¡rio
 */
function validateNomeCompleto(nome) {
  const words = nome.trim().split(/\s+/);
  return words.length >= 2 && words.every(word => word.length >= 2);
}

/**
 * Exibe mensagem de erro no campo
 * @param {HTMLElement} input - Campo de input
 * @param {string} message - Mensagem de erro
 */
function showFieldError(input, message) {
  // Remove erro anterior se existir
  removeFieldError(input);
  
  // Adiciona classe de erro ao input e atributo aria-invalid
  input.classList.add('form-input--error');
  input.setAttribute('aria-invalid', 'true');
  
  // Cria elemento de mensagem de erro
  const errorDiv = document.createElement('div');
  errorDiv.className = 'form-error';
  errorDiv.id = `${input.id}-error`;
  errorDiv.setAttribute('role', 'alert');
  errorDiv.textContent = `âš  ${message}`;
  
  // Atualiza aria-describedby do input
  input.setAttribute('aria-describedby', errorDiv.id);
  
  // Insere apÃ³s o input
  input.parentNode.insertBefore(errorDiv, input.nextSibling);
}

/**
 * Remove mensagem de erro do campo
 * @param {HTMLElement} input - Campo de input
 */
function removeFieldError(input) {
  input.classList.remove('form-input--error');
  input.setAttribute('aria-invalid', 'false');
  input.removeAttribute('aria-describedby');
  
  const errorDiv = input.parentNode.querySelector('.form-error');
  if (errorDiv) {
    errorDiv.remove();
  }
}

/**
 * Processa o envio do formulÃ¡rio de candidatura
 * @param {Event} e - Evento de submit do formulÃ¡rio
 */
function handleCandidaturaSubmit(e) {
  e.preventDefault();
  
  // Pegar dados do formulÃ¡rio
  const formData = new FormData(e.target);
  const nome = formData.get('nome');
  const email = formData.get('email');
  const telefone = formData.get('telefone');
  const linkedin = formData.get('linkedin');
  const vagaTitulo = document.getElementById('candidatura-vaga-nome').textContent;
  
  // Pegar elementos dos inputs
  const nomeInput = document.getElementById('candidato-nome');
  const emailInput = document.getElementById('candidato-email');
  const telefoneInput = document.getElementById('candidato-telefone');
  
  // Limpar erros anteriores
  removeFieldError(nomeInput);
  removeFieldError(emailInput);
  removeFieldError(telefoneInput);
  
  let hasError = false;
  
  // Validar nome completo
  if (!validateNomeCompleto(nome)) {
    showFieldError(nomeInput, 'Por favor, informe seu nome completo (nome e sobrenome)');
    hasError = true;
  }
  
  // Validar email
  if (!validateEmail(email)) {
    showFieldError(emailInput, 'Por favor, informe um email vÃ¡lido');
    hasError = true;
  }
  
  // Validar telefone
  if (!validateTelefone(telefone)) {
    showFieldError(telefoneInput, 'Por favor, informe um telefone vÃ¡lido (10 ou 11 dÃ­gitos)');
    hasError = true;
  }
  
  // Se houver erros, nÃ£o enviar
  if (hasError) {
    return;
  }
  
  // Log dos dados (aqui vocÃª pode enviar para um servidor)
  console.log('=== Candidatura Enviada ===');
  console.log('Vaga:', vagaTitulo);
  console.log('Nome:', nome);
  console.log('Email:', email);
  console.log('Telefone:', telefone);
  console.log('LinkedIn:', linkedin || 'NÃ£o informado');
  console.log('===========================');
  
  // Fechar modal
  closeCandidaturaModal();
  
  // Mostrar notificaÃ§Ã£o de sucesso
  showSuccessNotification();
}

/**
 * Exibe notificaÃ§Ã£o de sucesso apÃ³s candidatura enviada
 */
function showSuccessNotification() {
  const notification = document.getElementById('success-notification');
  
  if (notification) {
    // Mostrar notificaÃ§Ã£o
    notification.classList.add('show');
    
    // Esconder automaticamente apÃ³s 4 segundos
    setTimeout(() => {
      notification.classList.remove('show');
    }, 4000);
  }
}

