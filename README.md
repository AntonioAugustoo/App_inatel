# 🎓 Hub de Carreiras — Inatel

Website institucional do Instituto Nacional de Telecomunicações (Inatel) com página de vagas interativa.

## 📋 Sobre o Projeto

Este projeto é um site institucional moderno e responsivo para o Inatel, desenvolvido com HTML5, CSS3 e JavaScript vanilla. Inclui funcionalidades de filtros interativos, busca de vagas e design acessível.

## 🚀 Tecnologias Utilizadas

- **HTML5** - Estrutura semântica
- **CSS3** - Estilização com variáveis CSS e Grid/Flexbox
- **JavaScript ES6+** - Funcionalidades interativas
- **Google Fonts** - Tipografia (Inter)

## 📁 Estrutura do Projeto

```
App_inatel/
├── css/
│   ├── index.css          # Estilos principais
│   └── vagas.css          # Estilos específicos da página de vagas
├── data/
│   └── vagas.json         # Dados estruturados das vagas
├── html/
│   ├── index.html         # Página principal
│   └── vagas.html         # Página de vagas
├── images/
│   └── png/
│       └── logo.png       # Logo do Inatel
├── js/
│   ├── main.js            # Scripts principais
│   └── vagas.js           # Scripts da página de vagas
└── README.md
```

## ✨ Funcionalidades

### Página Principal
- ✅ Hero section com imagem de fundo
- ✅ Navegação suave entre seções
- ✅ Carrossel de cursos (7 cursos de engenharia)
- ✅ Cards animados com Intersection Observer
- ✅ Footer responsivo e acessível

### Página de Vagas
- ✅ Busca de vagas com debounce
- ✅ Filtros múltiplos (Modo, Tipo, Área)
- ✅ Contador dinâmico de vagas
- ✅ Mensagem de "nenhuma vaga encontrada"
- ✅ Design responsivo

## 🎨 Design

- **Paleta de Cores**: Azul Inatel (#0051A5, #00A3E0)
- **Tipografia**: Inter (Google Fonts)
- **Layout**: Grid e Flexbox responsivos
- **Animações**: Transições suaves e scroll reveal

## 🔧 Melhorias Implementadas

### Performance
- ✅ Debounce na busca (300ms)
- ✅ Intersection Observer para animações lazy
- ✅ Preconnect para Google Fonts

### Acessibilidade
- ✅ Navegação por teclado no carrossel
- ✅ Labels ARIA adequados
- ✅ Contraste de cores WCAG AA

### SEO
- ✅ Meta tags completas (description, keywords)
- ✅ Open Graph tags
- ✅ Twitter Card tags
- ✅ Estrutura semântica HTML5

### Código
- ✅ JSDoc em todas as funções
- ✅ Tratamento de erros com try-catch
- ✅ Variáveis CSS organizadas
- ✅ Código comentado e documentado

## 🚦 Como Usar

1. Clone o repositório:
```bash
git clone https://github.com/AntonioAugustoo/App_inatel.git
```

2. Abra `html/index.html` em seu navegador

Ou use um servidor local:
```bash
# Com Python 3
python -m http.server 8000

# Com Node.js (http-server)
npx http-server
```

## 📱 Responsividade

O site é totalmente responsivo e otimizado para:
- 📱 Mobile (< 768px)
- 💻 Tablet (768px - 1024px)
- 🖥️ Desktop (> 1024px)

## ⚙️ Configuração

Variáveis CSS principais em `css/index.css`:
```css
--color-primary: #0051A5;
--color-secondary: #00A3E0;
--container-width: 1200px;
--header-height: 120px;
```

## 🐛 Bugs Conhecidos

Nenhum bug crítico identificado no momento.

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
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
