import { createGlobalStyle } from 'styled-components';

const GlobalStyles = createGlobalStyle`
  :root {
    /* Cores */
    --corPrimaria: #667eea;
    --corSecundaria: #764ba2;
    --corSucesso: #4caf50;
    --corErro: #f44336;
    --corAviso: #ff9800;
    --corInfo: #2196f3;
    
    /* Cores de fundo */
    --corFundoPrincipal: #f8fafc;
    --corFundoPrimaria: #f8fafc;
    --corFundoSecundaria: #ffffff;
    --corFundoTerciaria: #f1f5f9;
    --corFundoCard: #ffffff;
    --corFundoModal: rgba(0, 0, 0, 0.5);
    
    /* Cores de texto */
    --corTextoPrimaria: #1e293b;
    --corTextoSecundaria: #64748b;
    --corTextoTerciaria: #94a3b8;
    --corTextoClara: #ffffff;
    
    /* Cores de borda */
    --corBordaPrimaria: #e2e8f0;
    --corBordaSecundaria: #cbd5e1;
    --corBordaFoco: #667eea;
    
    /* Espaçamentos */
    --espacamentoPequeno: 8px;
    --espacamentoMedio: 16px;
    --espacamentoGrande: 24px;
    --espacamentoExtraGrande: 32px;
    
    /* Bordas */
    --bordaRaioPequena: 4px;
    --bordaRaioMedia: 8px;
    --bordaRaioGrande: 12px;
    --bordaRaioExtraGrande: 16px;
    --bordaRaioCircular: 50%;
    
    /* Sombras */
    --sombraLeve: 0 1px 3px rgba(0, 0, 0, 0.1);
    --sombraMedia: 0 4px 6px rgba(0, 0, 0, 0.1);
    --sombraForte: 0 10px 25px rgba(0, 0, 0, 0.15);
    --sombraHover: 0 8px 25px rgba(0, 0, 0, 0.15);
    
    /* Transições */
    --transicaoRapida: 0.15s ease;
    --transicaoMedia: 0.3s ease;
    --transicaoLenta: 0.5s ease;
    
    /* Tamanhos de fonte */
    --tamanhoFontePequena: 12px;
    --tamanhoFonteMedia: 14px;
    --tamanhoFonteGrande: 16px;
    --tamanhoFonteExtraGrande: 20px;
    --tamanhoFonteTitulo: 24px;
    
    /* Layout */
    --larguraMenu: 280px;
    --larguraMenuRecolhido: 80px;
    --alturaHeader: 64px;
    
    /* Z-index */
    --zIndexDropdown: 1000;
    --zIndexTooltip: 1100;
    --zIndexModal: 1200;
    --zIndexOverlay: 1300;
    --zIndexLoading: 1400;
  }

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
      'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
      sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    background: var(--corFundoPrimaria);
    color: var(--corTextoPrimaria);
    line-height: 1.6;
  }

  html {
    scroll-behavior: smooth;
  }

  /* Animações */
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(-20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateX(100%);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }

  @keyframes slideOut {
    from {
      opacity: 1;
      transform: translateX(0);
    }
    to {
      opacity: 0;
      transform: translateX(100%);
    }
  }

  @keyframes scaleIn {
    from {
      opacity: 0;
      transform: scale(0.9);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }

  @keyframes bounce {
    0%, 20%, 53%, 80%, 100% {
      transform: translate3d(0, 0, 0);
    }
    40%, 43% {
      transform: translate3d(0, -8px, 0);
    }
    70% {
      transform: translate3d(0, -4px, 0);
    }
    90% {
      transform: translate3d(0, -2px, 0);
    }
  }

  @keyframes pulse {
    0% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.05);
    }
    100% {
      transform: scale(1);
    }
  }

  @keyframes shake {
    0%, 100% {
      transform: translateX(0);
    }
    10%, 30%, 50%, 70%, 90% {
      transform: translateX(-5px);
    }
    20%, 40%, 60%, 80% {
      transform: translateX(5px);
    }
  }

  /* Animações para a tela inicial */
  @keyframes iconFloat {
    0%, 100% {
      transform: translateY(0px);
    }
    50% {
      transform: translateY(-10px);
    }
  }

  @keyframes iconGlow {
    0%, 100% {
      box-shadow: 0 0 5px rgba(102, 126, 234, 0.3);
    }
    50% {
      box-shadow: 0 0 20px rgba(102, 126, 234, 0.6);
    }
  }

  /* Scrollbar personalizada */
  ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }

  ::-webkit-scrollbar-track {
    background: var(--corFundoSecundaria);
    border-radius: var(--bordaRaioPequena);
  }

  ::-webkit-scrollbar-thumb {
    background: var(--corBordaSecundaria);
    border-radius: var(--bordaRaioPequena);
    transition: background var(--transicaoRapida);
  }

  ::-webkit-scrollbar-thumb:hover {
    background: var(--corTextoTerciaria);
  }

  /* Seleção de texto */
  ::selection {
    background: var(--corPrimaria);
    color: var(--corTextoClara);
  }

  /* Foco global */
  *:focus {
    outline: 2px solid var(--corBordaFoco);
    outline-offset: 2px;
  }

  /* Botões e inputs */
  button, input, textarea, select {
    font-family: inherit;
  }

  /* Links */
  a {
    color: inherit;
    text-decoration: none;
  }

  /* Listas */
  ul, ol {
    list-style: none;
  }

  /* Imagens */
  img {
    max-width: 100%;
    height: auto;
  }

  /* Utilitários */
  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }

  .fade-in {
    animation: fadeIn 0.3s ease-out;
  }

  .scale-in {
    animation: scaleIn 0.3s ease-out;
  }

  .bounce {
    animation: bounce 0.6s ease-out;
  }

  .pulse {
    animation: pulse 2s infinite;
  }

  .shake {
    animation: shake 0.5s ease-in-out;
  }

  /* Responsividade */
  @media (max-width: 768px) {
    :root {
      --espacamentoGrande: 16px;
      --espacamentoExtraGrande: 24px;
      --tamanhoFonteTitulo: 20px;
    }
  }

  @media (max-width: 480px) {
    :root {
      --espacamentoMedio: 12px;
      --espacamentoGrande: 16px;
      --tamanhoFonteGrande: 14px;
      --tamanhoFonteExtraGrande: 18px;
    }
  }
`;

export default GlobalStyles; 