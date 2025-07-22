import React, { createContext, useContext, useReducer, useEffect } from 'react';

// Estado inicial
const estadoInicial = {
  projetos: [],
  anotacoes: [],
  reunioes: [],
  links: [], // Nova categoria de links
  categoriaAtiva: 'links', // Links como categoria padrão
  menuRecolhido: false,
  carregando: false,
  termoBusca: '',
  ordenacao: 'dataCriacao',
  categorias: [
    // Categorias de Links
    { id: 1, nome: 'Trabalho', tipo: 'link' },
    { id: 2, nome: 'Pessoal', tipo: 'link' },
    { id: 3, nome: 'Estudo', tipo: 'link' },
    { id: 4, nome: 'Entretenimento', tipo: 'link' },
    { id: 5, nome: 'Ferramentas', tipo: 'link' },
    // Categorias de Projetos
    { id: 6, nome: 'Trabalho', tipo: 'projeto' },
    { id: 7, nome: 'Pessoal', tipo: 'projeto' },
    { id: 8, nome: 'Estudo', tipo: 'projeto' },
    { id: 9, nome: 'Saúde', tipo: 'projeto' },
    { id: 10, nome: 'Finanças', tipo: 'projeto' },
    // Categorias de Anotações
    { id: 11, nome: 'Ideias', tipo: 'anotacao' },
    { id: 12, nome: 'Lembretes', tipo: 'anotacao' },
    { id: 13, nome: 'Receitas', tipo: 'anotacao' },
    { id: 14, nome: 'Dicas', tipo: 'anotacao' },
    { id: 15, nome: 'Notas', tipo: 'anotacao' },
    // Categorias de Reuniões
    { id: 16, nome: 'Equipe', tipo: 'reuniao' },
    { id: 17, nome: 'Cliente', tipo: 'reuniao' },
    { id: 18, nome: 'Planejamento', tipo: 'reuniao' },
    { id: 19, nome: 'Revisão', tipo: 'reuniao' },
    { id: 20, nome: 'Apresentação', tipo: 'reuniao' }
  ],
  topicos: [
    // Tópicos padrão para projetos
    { id: 1, nome: 'Acessos', descricao: 'Credenciais e informações de acesso' },
    { id: 2, nome: 'Hardware', descricao: 'Marca e modelo de equipamentos' },
    { id: 3, nome: 'Localização', descricao: 'Coordenadas e endereços' },
    { id: 4, nome: 'Links', descricao: 'URLs e referências importantes' },
    { id: 5, nome: 'Configurações', descricao: 'Configurações técnicas' },
    { id: 6, nome: 'Documentação', descricao: 'Documentos e manuais' },
    { id: 7, nome: 'Contatos', descricao: 'Pessoas e empresas relacionadas' },
    { id: 8, nome: 'Cronograma', descricao: 'Prazos e marcos do projeto' }
  ]
};

// Tipos de ações
const TIPOS_ACAO = {
  ADICIONAR_PROJETO: 'ADICIONAR_PROJETO',
  ATUALIZAR_PROJETO: 'ATUALIZAR_PROJETO',
  REMOVER_PROJETO: 'REMOVER_PROJETO',
  ADICIONAR_ANOTACAO: 'ADICIONAR_ANOTACAO',
  ATUALIZAR_ANOTACAO: 'ATUALIZAR_ANOTACAO',
  REMOVER_ANOTACAO: 'REMOVER_ANOTACAO',
  ADICIONAR_REUNIAO: 'ADICIONAR_REUNIAO',
  ATUALIZAR_REUNIAO: 'ATUALIZAR_REUNIAO',
  REMOVER_REUNIAO: 'REMOVER_REUNIAO',
  ADICIONAR_LINK: 'ADICIONAR_LINK',
  ATUALIZAR_LINK: 'ATUALIZAR_LINK',
  REMOVER_LINK: 'REMOVER_LINK',
  DEFINIR_CATEGORIA_ATIVA: 'DEFINIR_CATEGORIA_ATIVA',
  ALTERNAR_MENU: 'ALTERNAR_MENU',
  DEFINIR_CARREGANDO: 'DEFINIR_CARREGANDO',
  DEFINIR_TERMO_BUSCA: 'DEFINIR_TERMO_BUSCA',
  DEFINIR_ORDENACAO: 'DEFINIR_ORDENACAO',
  REORDENAR_ITENS: 'REORDENAR_ITENS',
  CARREGAR_DADOS: 'CARREGAR_DADOS',
  ADICIONAR_CATEGORIA: 'ADICIONAR_CATEGORIA',
  REMOVER_CATEGORIA: 'REMOVER_CATEGORIA',
  EDITAR_CATEGORIA: 'EDITAR_CATEGORIA',
  ADICIONAR_TOPICO: 'ADICIONAR_TOPICO',
  REMOVER_TOPICO: 'REMOVER_TOPICO',
  EDITAR_TOPICO: 'EDITAR_TOPICO',
  ADICIONAR_SECAO_PROJETO: 'ADICIONAR_SECAO_PROJETO',
  REMOVER_SECAO_PROJETO: 'REMOVER_SECAO_PROJETO',
  EDITAR_SECAO_PROJETO: 'EDITAR_SECAO_PROJETO'
};

// Redutor
function notasReducer(estado, acao) {
  switch (acao.tipo) {
    case TIPOS_ACAO.ADICIONAR_PROJETO:
      return {
        ...estado,
        projetos: [acao.payload, ...estado.projetos]
      };

    case TIPOS_ACAO.ATUALIZAR_PROJETO:
      return {
        ...estado,
        projetos: estado.projetos.map(projeto =>
          projeto.id === acao.payload.id ? acao.payload : projeto
        )
      };

    case TIPOS_ACAO.REMOVER_PROJETO:
      return {
        ...estado,
        projetos: estado.projetos.filter(projeto => projeto.id !== acao.payload)
      };

    case TIPOS_ACAO.ADICIONAR_ANOTACAO:
      return {
        ...estado,
        anotacoes: [acao.payload, ...estado.anotacoes]
      };

    case TIPOS_ACAO.ATUALIZAR_ANOTACAO:
      return {
        ...estado,
        anotacoes: estado.anotacoes.map(anotacao =>
          anotacao.id === acao.payload.id ? acao.payload : anotacao
        )
      };

    case TIPOS_ACAO.REMOVER_ANOTACAO:
      return {
        ...estado,
        anotacoes: estado.anotacoes.filter(anotacao => anotacao.id !== acao.payload)
      };

    case TIPOS_ACAO.ADICIONAR_REUNIAO:
      return {
        ...estado,
        reunioes: [acao.payload, ...estado.reunioes]
      };

    case TIPOS_ACAO.ATUALIZAR_REUNIAO:
      return {
        ...estado,
        reunioes: estado.reunioes.map(reuniao =>
          reuniao.id === acao.payload.id ? acao.payload : reuniao
        )
      };

    case TIPOS_ACAO.REMOVER_REUNIAO:
      return {
        ...estado,
        reunioes: estado.reunioes.filter(reuniao => reuniao.id !== acao.payload)
      };

    case TIPOS_ACAO.ADICIONAR_LINK:
      return {
        ...estado,
        links: [acao.payload, ...estado.links]
      };

    case TIPOS_ACAO.ATUALIZAR_LINK:
      return {
        ...estado,
        links: estado.links.map(link =>
          link.id === acao.payload.id ? acao.payload : link
        )
      };

    case TIPOS_ACAO.REMOVER_LINK:
      return {
        ...estado,
        links: estado.links.filter(link => link.id !== acao.payload)
      };

    case TIPOS_ACAO.DEFINIR_CATEGORIA_ATIVA:
      return {
        ...estado,
        categoriaAtiva: acao.payload
      };

    case TIPOS_ACAO.ALTERNAR_MENU:
      return {
        ...estado,
        menuRecolhido: !estado.menuRecolhido
      };

    case TIPOS_ACAO.DEFINIR_CARREGANDO:
      return {
        ...estado,
        carregando: acao.payload
      };

    case TIPOS_ACAO.DEFINIR_TERMO_BUSCA:
      return {
        ...estado,
        termoBusca: acao.payload
      };

    case TIPOS_ACAO.DEFINIR_ORDENACAO:
      return {
        ...estado,
        ordenacao: acao.payload
      };

    case TIPOS_ACAO.REORDENAR_ITENS:
      return {
        ...estado,
        [acao.payload.categoria]: acao.payload.itens
      };

    case TIPOS_ACAO.CARREGAR_DADOS:
      return {
        ...estado,
        ...acao.payload
      };

    case TIPOS_ACAO.ADICIONAR_CATEGORIA:
      return {
        ...estado,
        categorias: [...estado.categorias, acao.payload]
      };

    case TIPOS_ACAO.REMOVER_CATEGORIA:
      return {
        ...estado,
        categorias: estado.categorias.filter(
          (categoria, index) => index !== acao.payload.index
        )
      };

    case TIPOS_ACAO.EDITAR_CATEGORIA:
      return {
        ...estado,
        categorias: estado.categorias.map((categoria, index) =>
          index === acao.payload.index ? acao.payload.categoria : categoria
        )
      };

    case TIPOS_ACAO.ADICIONAR_TOPICO:
      return {
        ...estado,
        topicos: [...estado.topicos, acao.payload]
      };

    case TIPOS_ACAO.REMOVER_TOPICO:
      return {
        ...estado,
        topicos: estado.topicos.filter(
          (topico, index) => index !== acao.payload.index
        )
      };

    case TIPOS_ACAO.EDITAR_TOPICO:
      return {
        ...estado,
        topicos: estado.topicos.map((topico, index) =>
          index === acao.payload.index ? acao.payload.topico : topico
        )
      };

    case TIPOS_ACAO.ADICIONAR_SECAO_PROJETO:
      return {
        ...estado,
        projetos: estado.projetos.map(projeto =>
          projeto.id === acao.payload.projetoId ? {
            ...projeto,
            topicos: [...projeto.topicos, acao.payload.topico]
          } : projeto
        )
      };

    case TIPOS_ACAO.REMOVER_SECAO_PROJETO:
      return {
        ...estado,
        projetos: estado.projetos.map(projeto =>
          projeto.id === acao.payload.projetoId ? {
            ...projeto,
            topicos: projeto.topicos.filter(
              (topico, index) => index !== acao.payload.topicoIndex
            )
          } : projeto
        )
      };

    case TIPOS_ACAO.EDITAR_SECAO_PROJETO:
      return {
        ...estado,
        projetos: estado.projetos.map(projeto =>
          projeto.id === acao.payload.projetoId ? {
            ...projeto,
            topicos: projeto.topicos.map((topico, index) =>
              index === acao.payload.topicoIndex ? acao.payload.topico : topico
            )
          } : projeto
        )
      };

    default:
      return estado;
  }
}

// Criar o contexto
const NotasContext = createContext();

// Hook personalizado para usar o contexto
export function usarNotas() {
  const contexto = useContext(NotasContext);
  if (!contexto) {
    throw new Error('usarNotas deve ser usado dentro de um NotasProvider');
  }
  return contexto;
}

// Provider do contexto
export function NotasProvider({ children }) {
  const [estado, dispatch] = useReducer(notasReducer, estadoInicial);

  // Carregar dados do localStorage na inicialização
  useEffect(() => {
    const dadosSalvos = localStorage.getItem('wrtmind_dados');
    if (dadosSalvos) {
      try {
        const dados = JSON.parse(dadosSalvos);
        dispatch({ tipo: TIPOS_ACAO.CARREGAR_DADOS, payload: dados });
      } catch (erro) {
        console.error('Erro ao carregar dados:', erro);
      }
    }
  }, []);

  // Salvar dados no localStorage sempre que o estado mudar
  useEffect(() => {
    const dadosParaSalvar = {
      projetos: estado.projetos,
      anotacoes: estado.anotacoes,
      reunioes: estado.reunioes,
      links: estado.links,
      categoriaAtiva: estado.categoriaAtiva,
      menuRecolhido: estado.menuRecolhido,
      ordenacao: estado.ordenacao,
      categorias: estado.categorias,
      topicos: estado.topicos
    };
    localStorage.setItem('wrtmind_dados', JSON.stringify(dadosParaSalvar));
  }, [estado.projetos, estado.anotacoes, estado.reunioes, estado.links, estado.categoriaAtiva, estado.menuRecolhido, estado.ordenacao, estado.categorias, estado.topicos]);

  // Funções auxiliares
  const adicionarProjeto = (projeto) => {
    const novoProjeto = {
      ...projeto,
      id: Date.now().toString(),
      dataCriacao: new Date().toISOString(),
      dataAtualizacao: new Date().toISOString(),
      ordem: estado.projetos.length,
      topicos: [] // Array vazio de tópicos para novos projetos
    };
    dispatch({ tipo: TIPOS_ACAO.ADICIONAR_PROJETO, payload: novoProjeto });
  };

  const atualizarProjeto = (projeto) => {
    const projetoAtualizado = {
      ...projeto,
      dataAtualizacao: new Date().toISOString()
    };
    dispatch({ tipo: TIPOS_ACAO.ATUALIZAR_PROJETO, payload: projetoAtualizado });
  };

  const removerProjeto = (id) => {
    dispatch({ tipo: TIPOS_ACAO.REMOVER_PROJETO, payload: id });
  };

  const adicionarAnotacao = (anotacao) => {
    const novaAnotacao = {
      ...anotacao,
      id: Date.now().toString(),
      dataCriacao: new Date().toISOString(),
      dataAtualizacao: new Date().toISOString(),
      ordem: estado.anotacoes.length
    };
    dispatch({ tipo: TIPOS_ACAO.ADICIONAR_ANOTACAO, payload: novaAnotacao });
  };

  const atualizarAnotacao = (anotacao) => {
    const anotacaoAtualizada = {
      ...anotacao,
      dataAtualizacao: new Date().toISOString()
    };
    dispatch({ tipo: TIPOS_ACAO.ATUALIZAR_ANOTACAO, payload: anotacaoAtualizada });
  };

  const removerAnotacao = (id) => {
    dispatch({ tipo: TIPOS_ACAO.REMOVER_ANOTACAO, payload: id });
  };

  const adicionarReuniao = (reuniao) => {
    const novaReuniao = {
      ...reuniao,
      id: Date.now().toString(),
      dataCriacao: new Date().toISOString(),
      dataAtualizacao: new Date().toISOString(),
      ordem: estado.reunioes.length
    };
    dispatch({ tipo: TIPOS_ACAO.ADICIONAR_REUNIAO, payload: novaReuniao });
  };

  const atualizarReuniao = (reuniao) => {
    const reuniaoAtualizada = {
      ...reuniao,
      dataAtualizacao: new Date().toISOString()
    };
    dispatch({ tipo: TIPOS_ACAO.ATUALIZAR_REUNIAO, payload: reuniaoAtualizada });
  };

  const removerReuniao = (id) => {
    dispatch({ tipo: TIPOS_ACAO.REMOVER_REUNIAO, payload: id });
  };

  const adicionarLink = (link) => {
    const novoLink = {
      ...link,
      id: Date.now().toString(),
      dataCriacao: new Date().toISOString(),
      dataAtualizacao: new Date().toISOString(),
      ordem: estado.links.length
    };
    dispatch({ tipo: TIPOS_ACAO.ADICIONAR_LINK, payload: novoLink });
  };

  const atualizarLink = (link) => {
    const linkAtualizado = {
      ...link,
      dataAtualizacao: new Date().toISOString()
    };
    dispatch({ tipo: TIPOS_ACAO.ATUALIZAR_LINK, payload: linkAtualizado });
  };

  const removerLink = (id) => {
    dispatch({ tipo: TIPOS_ACAO.REMOVER_LINK, payload: id });
  };

  const definirCategoriaAtiva = (categoria) => {
    dispatch({ tipo: TIPOS_ACAO.DEFINIR_CATEGORIA_ATIVA, payload: categoria });
  };

  const alternarMenu = () => {
    dispatch({ tipo: TIPOS_ACAO.ALTERNAR_MENU });
  };

  const definirCarregando = (carregando) => {
    dispatch({ tipo: TIPOS_ACAO.DEFINIR_CARREGANDO, payload: carregando });
  };

  const definirTermoBusca = (termo) => {
    dispatch({ tipo: TIPOS_ACAO.DEFINIR_TERMO_BUSCA, payload: termo });
  };

  const definirOrdenacao = (ordenacao) => {
    dispatch({ tipo: TIPOS_ACAO.DEFINIR_ORDENACAO, payload: ordenacao });
  };

  const reordenarItens = (categoria, itens) => {
    dispatch({ 
      tipo: TIPOS_ACAO.REORDENAR_ITENS, 
      payload: { categoria, itens } 
    });
  };

  const adicionarCategoria = (categoria) => {
    dispatch({ tipo: TIPOS_ACAO.ADICIONAR_CATEGORIA, payload: categoria });
  };

  const removerCategoria = (index) => {
    dispatch({ tipo: TIPOS_ACAO.REMOVER_CATEGORIA, payload: { index } });
  };

  const editarCategoria = (index, categoria) => {
    dispatch({ tipo: TIPOS_ACAO.EDITAR_CATEGORIA, payload: { index, categoria } });
  };

  const adicionarTopico = (topico) => {
    dispatch({ tipo: TIPOS_ACAO.ADICIONAR_TOPICO, payload: topico });
  };

  const removerTopico = (index) => {
    dispatch({ tipo: TIPOS_ACAO.REMOVER_TOPICO, payload: { index } });
  };

  const editarTopico = (index, topico) => {
    dispatch({ tipo: TIPOS_ACAO.EDITAR_TOPICO, payload: { index, topico } });
  };

  const adicionarSecaoProjeto = (projetoId, topico) => {
    dispatch({ tipo: TIPOS_ACAO.ADICIONAR_SECAO_PROJETO, payload: { projetoId, topico } });
  };

  const removerSecaoProjeto = (projetoId, topicoIndex) => {
    dispatch({ tipo: TIPOS_ACAO.REMOVER_SECAO_PROJETO, payload: { projetoId, topicoIndex } });
  };

  const editarSecaoProjeto = (projetoId, topicoIndex, topico) => {
    dispatch({ tipo: TIPOS_ACAO.EDITAR_SECAO_PROJETO, payload: { projetoId, topicoIndex, topico } });
  };

  // Filtrar e ordenar itens
  const obterItensFiltrados = (categoria) => {
    let itens = [];
    
    switch (categoria) {
      case 'projetos':
        itens = estado.projetos;
        break;
      case 'anotacoes':
        itens = estado.anotacoes;
        break;
      case 'reunioes':
        itens = estado.reunioes;
        break;
      case 'links':
        itens = estado.links;
        break;
      default:
        return [];
    }

    // Filtrar por termo de busca
    if (estado.termoBusca) {
      itens = itens.filter(item =>
        item.titulo.toLowerCase().includes(estado.termoBusca.toLowerCase()) ||
        item.conteudo.toLowerCase().includes(estado.termoBusca.toLowerCase())
      );
    }

    // Ordenar
    switch (estado.ordenacao) {
      case 'dataCriacao':
        itens = [...itens].sort((a, b) => new Date(b.dataCriacao) - new Date(a.dataCriacao));
        break;
      case 'dataAtualizacao':
        itens = [...itens].sort((a, b) => new Date(b.dataAtualizacao) - new Date(a.dataAtualizacao));
        break;
      case 'titulo':
        itens = [...itens].sort((a, b) => a.titulo.localeCompare(b.titulo));
        break;
      case 'ordem':
        itens = [...itens].sort((a, b) => a.ordem - b.ordem);
        break;
      default:
        break;
    }

    return itens;
  };

  const valor = {
    ...estado,
    adicionarProjeto,
    atualizarProjeto,
    removerProjeto,
    adicionarAnotacao,
    atualizarAnotacao,
    removerAnotacao,
    adicionarReuniao,
    atualizarReuniao,
    removerReuniao,
    adicionarLink,
    atualizarLink,
    removerLink,
    definirCategoriaAtiva,
    alternarMenu,
    definirCarregando,
    definirTermoBusca,
    definirOrdenacao,
    reordenarItens,
    obterItensFiltrados,
    adicionarCategoria,
    removerCategoria,
    editarCategoria,
    adicionarTopico,
    removerTopico,
    editarTopico,
    adicionarSecaoProjeto,
    removerSecaoProjeto,
    editarSecaoProjeto
  };

  return (
    <NotasContext.Provider value={valor}>
      {children}
    </NotasContext.Provider>
  );
} 