// ================================================
// DASHBOARD.JS - LÓGICA DA ÁREA DO ALUNO
// ================================================

/**
 * Dados Mockados
 */
const mockData = {
  student: {
    name: 'Antonio Augusto',
    course: 'Engenharia de Software',
    semester: '8º Período',
    registration: '221',
    cr: 8.7
  },
  
  provas: [
    {
      data: '25/11/2025',
      materia: 'Engenharia de Software',
      sala: 'Prédio 1 - Sala 20'
    },
    {
      data: '28/11/2025',
      materia: 'Banco de Dados',
      sala: 'Prédio 1 - Sala 15'
    },
    {
      data: '02/12/2025',
      materia: 'Arquitetura de Software',
      sala: 'Prédio 1 - Sala 22'
    },
    {
      data: '05/12/2025',
      materia: 'Inteligência Artificial',
      sala: 'Prédio 1 - Sala 18'
    }
  ],
  
  notas: [
    { disciplina: 'Engenharia de Software', nota: 9.5 },
    { disciplina: 'Banco de Dados', nota: 8.8 },
    { disciplina: 'Arquitetura de Software', nota: 9.2 },
    { disciplina: 'Redes de Computadores', nota: 7.5 },
    { disciplina: 'Inteligência Artificial', nota: 8.0 },
    { disciplina: 'Desenvolvimento Web', nota: 9.8 }
  ],
  
  eventDays: [
    { day: 5, event: 'Entrega TCC' },
    { day: 12, event: 'Prova de Banco de Dados' },
    { day: 18, event: 'Seminário de IA' },
    { day: 25, event: 'Prova de Eng. Software' },
    { day: 28, event: 'Prova de Banco de Dados' }
  ]
};

/**
 * Saudação dinâmica baseada no horário
 */
function updateGreeting() {
  try {
    const greetingElement = document.getElementById('greeting-text');
    if (!greetingElement) return;
    
    const hour = new Date().getHours();
    let greeting = 'Olá';
    
    if (hour >= 5 && hour < 12) {
      greeting = 'Bom dia';
    } else if (hour >= 12 && hour < 18) {
      greeting = 'Boa tarde';
    } else {
      greeting = 'Boa noite';
    }
    
    greetingElement.textContent = greeting;
  } catch (error) {
    console.error('Erro ao atualizar saudação:', error);
  }
}

/**
 * Renderiza a lista de próximas provas
 */
function renderProvas() {
  try {
    const provasList = document.getElementById('provas-list');
    if (!provasList) return;
    
    if (mockData.provas.length === 0) {
      provasList.innerHTML = '<li style="padding: 1rem; text-align: center; color: #6B7280;">Nenhuma prova agendada</li>';
      return;
    }
    
    const provasHTML = mockData.provas.map(prova => `
      <li class="prova-item">
        <div class="prova-item__data">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
            <line x1="16" y1="2" x2="16" y2="6"></line>
            <line x1="8" y1="2" x2="8" y2="6"></line>
            <line x1="3" y1="10" x2="21" y2="10"></line>
          </svg>
          ${prova.data}
        </div>
        <div class="prova-item__materia">${prova.materia}</div>
        <div class="prova-item__sala">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
            <circle cx="12" cy="10" r="3"></circle>
          </svg>
          ${prova.sala}
        </div>
      </li>
    `).join('');
    
    provasList.innerHTML = provasHTML;
  } catch (error) {
    console.error('Erro ao renderizar provas:', error);
  }
}

/**
 * Renderiza a tabela de notas
 */
function renderNotas() {
  try {
    const notasTable = document.getElementById('notas-table');
    if (!notasTable) return;
    
    if (mockData.notas.length === 0) {
      notasTable.innerHTML = '<div style="padding: 1rem; text-align: center; color: #6B7280;">Nenhuma nota disponível</div>';
      return;
    }
    
    const notasHTML = mockData.notas.map(nota => {
      // Determinar classe baseada na nota
      let notaClass = 'nota-row__valor';
      let progressClass = 'nota-row__progress-bar';
      
      if (nota.nota > 9) {
        notaClass += ' nota-row__valor--high';
        progressClass += ' nota-row__progress-bar--high';
      } else if (nota.nota >= 7) {
        notaClass += ' nota-row__valor--mid';
        progressClass += ' nota-row__progress-bar--mid';
      } else if (nota.nota >= 6) {
        progressClass += ' nota-row__progress-bar--alert';
      } else {
        notaClass += ' nota-row__valor--low';
        progressClass += ' nota-row__progress-bar--low';
      }
      
      // Calcular porcentagem (nota de 0 a 10)
      const percentage = (nota.nota / 10) * 100;
      
      return `
        <div class="nota-row">
          <div class="nota-row__top">
            <span class="nota-row__disciplina">${nota.disciplina}</span>
            <span class="${notaClass}">${nota.nota.toFixed(1)}</span>
          </div>
          <div class="nota-row__progress">
            <div class="${progressClass}" style="width: ${percentage}%"></div>
          </div>
        </div>
      `;
    }).join('');
    
    notasTable.innerHTML = notasHTML;
  } catch (error) {
    console.error('Erro ao renderizar notas:', error);
  }
}

/**
 * Renderiza o calendário do mês atual
 */
function renderCalendario() {
  try {
    const calendarioElement = document.getElementById('calendario');
    const currentMonthElement = document.getElementById('current-month');
    
    if (!calendarioElement) return;
    
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    const today = now.getDate();
    
    // Atualizar o título do mês
    const monthNames = [
      'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
      'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ];
    
    if (currentMonthElement) {
      currentMonthElement.textContent = `${monthNames[month]} ${year}`;
    }
    
    // Primeiro dia do mês (0 = domingo, 6 = sábado)
    const firstDay = new Date(year, month, 1).getDay();
    
    // Último dia do mês
    const lastDate = new Date(year, month + 1, 0).getDate();
    
    // Cabeçalho dos dias da semana
    const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
    let calendarHTML = '';
    
    // Adicionar cabeçalho
    weekDays.forEach(day => {
      calendarHTML += `<div class="calendario__header">${day}</div>`;
    });
    
    // Adicionar células vazias antes do primeiro dia
    for (let i = 0; i < firstDay; i++) {
      calendarHTML += '<div class="calendario__day calendario__day--empty"></div>';
    }
    
    // Adicionar os dias do mês
    for (let day = 1; day <= lastDate; day++) {
      let dayClass = 'calendario__day';
      let eventName = '';
      
      // Marcar o dia de hoje
      if (day === today) {
        dayClass += ' calendario__day--today';
      }
      
      // Marcar dias com eventos e pegar o nome do evento
      const eventData = mockData.eventDays.find(e => e.day === day);
      if (eventData) {
        dayClass += ' calendario__day--event';
        eventName = eventData.event;
      }
      
      // Adicionar atributo data-event para o tooltip
      const dataEventAttr = eventName ? ` data-event="${eventName}"` : '';
      
      calendarHTML += `<div class="${dayClass}"${dataEventAttr}>${day}</div>`;
    }
    
    calendarioElement.innerHTML = calendarHTML;
  } catch (error) {
    console.error('Erro ao renderizar calendário:', error);
  }
}

/**
 * Inicialização quando o DOM estiver pronto
 */
document.addEventListener('DOMContentLoaded', function() {
  try {
    // Atualizar saudação baseada no horário
    updateGreeting();
    
    // Renderizar widgets com dados mockados
    renderProvas();
    renderNotas();
    renderCalendario();
    
    // Listener para o botão de menu do usuário (futuro)
    const userMenuBtn = document.getElementById('user-menu-btn');
    if (userMenuBtn) {
      userMenuBtn.addEventListener('click', function() {
        console.log('Menu do usuário clicado - Funcionalidade futura');
      });
    }
    
  } catch (error) {
    console.error('Erro na inicialização do dashboard:', error);
  }
});
