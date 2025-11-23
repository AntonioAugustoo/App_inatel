# 🎓 Hub de Carreiras — Inatel

Website institucional do Instituto Nacional de Telecomunicações (Inatel) com sistema completo de vagas e área do aluno.

## 📋 Sobre o Projeto

Este projeto é um site institucional moderno e responsivo para o Inatel, desenvolvido com HTML5, CSS3 e JavaScript vanilla. Inclui página inicial institucional, sistema de vagas com filtros interativos e dashboard do aluno com dados acadêmicos.

## 🚀 Tecnologias Utilizadas

- **HTML5** - Estrutura semântica e acessível
- **CSS3** - Estilização com variáveis CSS, Grid/Flexbox e animações
- **JavaScript ES6+** - Funcionalidades interativas e validação de formulários
- **Google Fonts** - Tipografia (Inter)

## 📁 Estrutura do Projeto

```
App_inatel/
├── css/
│   └── index.css          # Todos os estilos do projeto (unificado)
├── html/
│   ├── index.html         # Página inicial institucional
│   ├── vagas.html         # Página de vagas com filtros
│   └── dashboard.html     # Dashboard do aluno
├── images/
│   └── png/
│       └── logo.png       # Logo do Inatel
├── js/
│   ├── main.js            # Scripts principais + lógica de vagas
│   └── dashboard.js       # Scripts do dashboard do aluno
└── README.md
```

## ✨ Funcionalidades

### 🏠 Página Principal (index.html)
- Hero section com imagem de fundo e overlay
- Navegação suave entre seções com scroll offset
- Carrossel de cursos (7 cursos de engenharia)
- Cards animados com Intersection Observer
- Header transparente no topo, azul ao rolar
- Footer completo com links organizados

### 💼 Página de Vagas (vagas.html)
- **Busca inteligente** com debounce (300ms)
- **Filtros múltiplos**: Modo de trabalho, Tipo de vaga, Área de atuação
- **Ordenação**: Mais recentes, Título (A-Z), Área
- **Paginação**: 6 vagas por página
- **Modal de detalhes**: Informações completas da vaga
- **Formulário de candidatura** com validação em tempo real:
  - Validação de email (regex)
  - Validação de telefone (10-11 dígitos)
  - Validação de nome completo (mínimo 2 palavras)
  - Feedback visual de erros com aria-invalid
- **Contador dinâmico** de vagas encontradas
- **Mensagem de "nenhuma vaga encontrada"**
- **Notificação de sucesso** animada após candidatura
- **100% acessível** com ARIA, navegação por teclado e leitores de tela

### 📊 Dashboard do Aluno (dashboard.html)
- **Saudação personalizada** com horário do dia
- **Calendário de provas** com próximas avaliações
- **Notas e disciplinas** por período
- **Gráfico de presença** (donut chart CSS puro)
- **Gráfico de horas complementares** (progress bar)
- **Dados mockados** para demonstração
- Layout em grid responsivo

## 🎨 Design System

### Paleta de Cores
```css
--color-primary: #0051A5;        /* Azul Inatel */
--color-primary-light: #0066CC;
--color-secondary: #00A3E0;      /* Azul claro */
--color-accent: #00D4FF;         /* Cyan */
--color-error: #ef4444;          /* Vermelho (erros) */
--color-error-dark: #dc2626;
--color-success: #10b981;        /* Verde (sucesso) */
```

### Tipografia
- **Fonte**: Inter (Google Fonts)
- **Pesos**: 400 (Regular), 500 (Medium), 600 (SemiBold), 700 (Bold)


## 🎯 Acessibilidade

O projeto segue as diretrizes WCAG 2.1 nível AA:
- ✅ Navegação completa por teclado
- ✅ Indicadores de foco visíveis (outline 2px)
- ✅ Atributos ARIA (roles, labels, pressed, invalid)
- ✅ Labels ocultos para leitores de tela (.sr-only)
- ✅ Contraste de cores adequado
- ✅ Mensagens de erro com role="alert"
- ✅ Modais com aria-modal e gerenciamento de foco

## 🚦 Como Usar

1. Clone o repositório:
```bash
git clone https://github.com/AntonioAugustoo/App_inatel.git
cd App_inatel
```


use um servidor local:
```bash
# Com Python 3
python -m http.server 8000

# Com Node.js (http-server)
npx http-server
```

## 📱 Responsividade

O site é totalmente responsivo e otimizado para:
- 📱 **Mobile** (< 640px)
- 📱 **Mobile Large** (640px - 768px)
- 💻 **Tablet** (768px - 1024px)
- 🖥️ **Desktop** (> 1024px)

Breakpoints principais:
```css
@media (max-width: 640px)  { /* Mobile */ }
@media (max-width: 768px)  { /* Tablet */ }
@media (max-width: 1024px) { /* Desktop pequeno */ }
```


## � Otimizações

- **CSS unificado**: Todos os estilos em um único arquivo (menos requisições HTTP)
- **JavaScript consolidado**: Lógica global + vagas em `main.js`
- **Debounce na busca**: Reduz chamadas durante digitação
- **Lazy animations**: Intersection Observer para animações sob demanda
- **Preconnect**: Fonts carregadas mais rapidamente
- **Variáveis CSS**: Fácil manutenção e consistência visual

## 🐛 Bugs Conhecidos

Nenhum bug crítico identificado no momento.

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/MinhaFeature`)
3. Commit suas mudanças (`git commit -m 'Adiciona MinhaFeature'`)
4. Push para a branch (`git push origin feature/MinhaFeature`)
5. Abra um Pull Request

## 📝 Licença

Este projeto é de propriedade do Instituto Nacional de Telecomunicações - Inatel.

## 👨‍💻 Autor

**Antonio Augusto**
- GitHub: [@AntonioAugustoo](https://github.com/AntonioAugustoo)

## 🙏 Agradecimentos

- Inatel - Instituto Nacional de Telecomunicações
- Unsplash - Imagens utilizadas no site
- Google Fonts - Tipografia Inter

---

Desenvolvido com ❤️ para o Inatel
