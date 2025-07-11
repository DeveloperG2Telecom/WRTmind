// Formatação de data
export const formatarData = (dataString, formato = 'completo') => {
  if (!dataString) return '';
  
  const data = new Date(dataString);
  
  if (isNaN(data.getTime())) return '';
  
  const agora = new Date();
  const diffEmMs = agora - data;
  const diffEmDias = Math.floor(diffEmMs / (1000 * 60 * 60 * 24));
  
  switch (formato) {
    case 'curto':
      return data.toLocaleDateString('pt-BR');
    
    case 'medio':
      return data.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    
    case 'relativo':
      if (diffEmDias === 0) {
        const diffEmHoras = Math.floor(diffEmMs / (1000 * 60 * 60));
        if (diffEmHoras === 0) {
          const diffEmMinutos = Math.floor(diffEmMs / (1000 * 60));
          if (diffEmMinutos === 0) {
            return 'Agora mesmo';
          }
          return `${diffEmMinutos} min atrás`;
        }
        return `${diffEmHoras}h atrás`;
      } else if (diffEmDias === 1) {
        return 'Ontem';
      } else if (diffEmDias < 7) {
        return `${diffEmDias} dias atrás`;
      } else if (diffEmDias < 30) {
        const semanas = Math.floor(diffEmDias / 7);
        return `${semanas} ${semanas === 1 ? 'semana' : 'semanas'} atrás`;
      } else if (diffEmDias < 365) {
        const meses = Math.floor(diffEmDias / 30);
        return `${meses} ${meses === 1 ? 'mês' : 'meses'} atrás`;
      } else {
        const anos = Math.floor(diffEmDias / 365);
        return `${anos} ${anos === 1 ? 'ano' : 'anos'} atrás`;
      }
    
    case 'completo':
    default:
      return data.toLocaleDateString('pt-BR', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
  }
};

// Formatação de texto
export const truncarTexto = (texto, maxLength = 100) => {
  if (!texto) return '';
  
  // Remove tags HTML para contar apenas texto
  const textoLimpo = texto.replace(/<[^>]*>/g, '');
  
  if (textoLimpo.length <= maxLength) {
    return texto;
  }
  
  return textoLimpo.substring(0, maxLength) + '...';
};

export const capitalizarPrimeiraLetra = (texto) => {
  if (!texto) return '';
  return texto.charAt(0).toUpperCase() + texto.slice(1).toLowerCase();
};

export const formatarCategoria = (categoria) => {
  const categorias = {
    // Projetos
    'desenvolvimento': 'Desenvolvimento',
    'design': 'Design',
    'marketing': 'Marketing',
    'vendas': 'Vendas',
    'rh': 'Recursos Humanos',
    'financeiro': 'Financeiro',
    'operacoes': 'Operações',
    'outros': 'Outros',
    
    // Anotações
    'trabalho': 'Trabalho',
    'pessoal': 'Pessoal',
    'estudo': 'Estudo',
    'ideias': 'Ideias',
    'lembretes': 'Lembretes',
    
    // Reuniões
    'equipe': 'Equipe',
    'cliente': 'Cliente',
    'fornecedor': 'Fornecedor',
    'planejamento': 'Planejamento',
    'revisao': 'Revisão'
  };
  
  return categorias[categoria] || capitalizarPrimeiraLetra(categoria);
};

export const formatarStatus = (status) => {
  const statusMap = {
    // Projetos
    'planejamento': 'Planejamento',
    'emAndamento': 'Em Andamento',
    'revisao': 'Em Revisão',
    'concluido': 'Concluído',
    'pausado': 'Pausado',
    'cancelado': 'Cancelado',
    
    // Reuniões
    'agendada': 'Agendada',
    'concluida': 'Concluída',
    'cancelada': 'Cancelada'
  };
  
  return statusMap[status] || capitalizarPrimeiraLetra(status);
};

export const formatarPrioridade = (prioridade) => {
  const prioridades = {
    'baixa': 'Baixa',
    'media': 'Média',
    'alta': 'Alta',
    'urgente': 'Urgente'
  };
  
  return prioridades[prioridade] || capitalizarPrimeiraLetra(prioridade);
};

// Cores para status e prioridade
export const obterCorStatus = (status) => {
  const cores = {
    // Projetos
    'planejamento': '#17a2b8', // Info
    'emAndamento': '#007bff', // Primary
    'revisao': '#ffc107', // Warning
    'concluido': '#28a745', // Success
    'pausado': '#6c757d', // Secondary
    'cancelado': '#dc3545', // Danger
    
    // Reuniões
    'agendada': '#17a2b8',
    'concluida': '#28a745',
    'cancelada': '#dc3545'
  };
  
  return cores[status] || '#6c757d';
};

export const obterCorPrioridade = (prioridade) => {
  const cores = {
    'baixa': '#28a745', // Success
    'media': '#ffc107', // Warning
    'alta': '#fd7e14', // Orange
    'urgente': '#dc3545' // Danger
  };
  
  return cores[prioridade] || '#6c757d';
};

// Validação
export const validarEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

export const validarURL = (url) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

// Geração de IDs únicos
export const gerarId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

// Ordenação
export const ordenarPorData = (a, b, campo = 'dataCriacao', ordem = 'desc') => {
  const dataA = new Date(a[campo]);
  const dataB = new Date(b[campo]);
  
  if (ordem === 'asc') {
    return dataA - dataB;
  }
  return dataB - dataA;
};

export const ordenarPorTexto = (a, b, campo = 'titulo', ordem = 'asc') => {
  const textoA = a[campo].toLowerCase();
  const textoB = b[campo].toLowerCase();
  
  if (ordem === 'desc') {
    return textoB.localeCompare(textoA);
  }
  return textoA.localeCompare(textoB);
};

// Busca
export const buscarTexto = (texto, termo) => {
  if (!texto || !termo) return false;
  
  const textoLimpo = texto.replace(/<[^>]*>/g, '').toLowerCase();
  const termoLimpo = termo.toLowerCase();
  
  return textoLimpo.includes(termoLimpo);
};

// Local Storage
export const salvarNoLocalStorage = (chave, dados) => {
  try {
    localStorage.setItem(chave, JSON.stringify(dados));
    return true;
  } catch (erro) {
    console.error('Erro ao salvar no localStorage:', erro);
    return false;
  }
};

export const carregarDoLocalStorage = (chave, valorPadrao = null) => {
  try {
    const dados = localStorage.getItem(chave);
    return dados ? JSON.parse(dados) : valorPadrao;
  } catch (erro) {
    console.error('Erro ao carregar do localStorage:', erro);
    return valorPadrao;
  }
};

// Debounce para otimizar performance
export const debounce = (funcao, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => funcao.apply(null, args), delay);
  };
};

// Throttle para otimizar performance
export const throttle = (funcao, delay) => {
  let ultimaExecucao = 0;
  return (...args) => {
    const agora = Date.now();
    if (agora - ultimaExecucao >= delay) {
      funcao.apply(null, args);
      ultimaExecucao = agora;
    }
  };
};

// Copiar para clipboard
export const copiarParaClipboard = async (texto) => {
  try {
    await navigator.clipboard.writeText(texto);
    return true;
  } catch (erro) {
    console.error('Erro ao copiar para clipboard:', erro);
    return false;
  }
};

// Download de arquivo
export const downloadArquivo = (conteudo, nomeArquivo, tipo = 'text/plain') => {
  const blob = new Blob([conteudo], { type: tipo });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = nomeArquivo;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

// Exportar dados
export const exportarDados = (dados, nomeArquivo) => {
  const dadosFormatados = JSON.stringify(dados, null, 2);
  const nomeCompleto = `${nomeArquivo}_${formatarData(new Date(), 'curto')}.json`;
  downloadArquivo(dadosFormatados, nomeCompleto, 'application/json');
};

// Importar dados
export const importarDados = (arquivo) => {
  return new Promise((resolve, reject) => {
    const leitor = new FileReader();
    
    leitor.onload = (evento) => {
      try {
        const dados = JSON.parse(evento.target.result);
        resolve(dados);
      } catch (erro) {
        reject(new Error('Arquivo inválido'));
      }
    };
    
    leitor.onerror = () => {
      reject(new Error('Erro ao ler arquivo'));
    };
    
    leitor.readAsText(arquivo);
  });
}; 