import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { useNotasAPI } from '../hooks/useNotasAPI';

// Criar contexto
const NotasAPIContext = createContext();

// Hook para usar o contexto
export const useNotasAPIContext = () => {
  const contexto = useContext(NotasAPIContext);
  if (!contexto) {
    throw new Error('useNotasAPIContext deve ser usado dentro de um NotasAPIProvider');
  }
  return contexto;
};

// Provider do contexto
export const NotasAPIProvider = ({ children }) => {
  const [categoriaAtiva, setCategoriaAtiva] = useState('anotacoes');
  const [menuRecolhido, setMenuRecolhido] = useState(false);
  const [termoBusca, setTermoBusca] = useState('');
  const [ordenacao, setOrdenacao] = useState('dataCriacao');

  // Usar o hook da API
  const {
    notas,
    categorias,
    carregando,
    erro,
    carregarNotas,
    carregarCategorias,
    criarNota,
    atualizarNota,
    deletarNota,
    restaurarNota,
    buscarNotaPorId,
    filtrarPorCategoria,
    buscarPorTermo,
    limparErro,
    notasAtivas,
    notasDeletadas,
    adicionarCategoria,
    editarCategoria,
    removerCategoria
  } = useNotasAPI();

  // Filtrar e ordenar notas usando useMemo para otimização
  const notasFiltradas = useMemo(() => {
    // Só executar se notasAtivas mudou
    if (!notasAtivas || notasAtivas.length === 0) {
      return [];
    }

    let notasParaFiltrar = [...notasAtivas]; // Criar cópia para não mutar o original

    // Filtrar por categoria ativa (tópico específico)
    if (categoriaAtiva && categoriaAtiva !== 'anotacoes') {
      notasParaFiltrar = notasParaFiltrar.filter(nota => nota.topico === categoriaAtiva);
    }

    // Filtrar por termo de busca
    if (termoBusca && termoBusca.trim()) {
      const termo = termoBusca.toLowerCase().trim();
      notasParaFiltrar = notasParaFiltrar.filter(nota =>
        nota.titulo.toLowerCase().includes(termo) ||
        nota.conteudo.toLowerCase().includes(termo)
      );
    }

    // Ordenar
    switch (ordenacao) {
      case 'dataCriacao':
        notasParaFiltrar.sort((a, b) => 
          new Date(b.dataCriacao) - new Date(a.dataCriacao)
        );
        break;
      case 'dataModificacao':
        notasParaFiltrar.sort((a, b) => 
          new Date(b.dataModificacao) - new Date(a.dataModificacao)
        );
        break;
      case 'titulo':
        notasParaFiltrar.sort((a, b) => 
          a.titulo.localeCompare(b.titulo)
        );
        break;
      case 'topico':
        notasParaFiltrar.sort((a, b) => 
          a.topico.localeCompare(b.topico)
        );
        break;
      default:
        break;
    }

    return notasParaFiltrar;
  }, [notasAtivas, categoriaAtiva, termoBusca, ordenacao]);

  // Funções para gerenciar notas
  const adicionarNota = async (nota) => {
    try {
      const novaNota = await criarNota(nota);
      return novaNota;
    } catch (error) {
      console.error('Erro ao adicionar nota:', error);
      throw error;
    }
  };

  const editarNota = async (id, nota) => {
    try {
      const notaAtualizada = await atualizarNota(id, nota);
      return notaAtualizada;
    } catch (error) {
      console.error('Erro ao editar nota:', error);
      throw error;
    }
  };

  const excluirNota = async (id) => {
    try {
      await deletarNota(id);
    } catch (error) {
      console.error('Erro ao excluir nota:', error);
      throw error;
    }
  };

  const visualizarNota = async (id) => {
    try {
      const nota = await buscarNotaPorId(id);
      return nota;
    } catch (error) {
      console.error('Erro ao buscar nota:', error);
      throw error;
    }
  };

  const filtrarPorCategoriaEspecifica = async (categoria) => {
    try {
      const notasFiltradas = await filtrarPorCategoria(categoria);
      return notasFiltradas;
    } catch (error) {
      console.error('Erro ao filtrar por categoria:', error);
      throw error;
    }
  };

  const buscarNotas = async (termo) => {
    try {
      const resultados = await buscarPorTermo(termo);
      return resultados;
    } catch (error) {
      console.error('Erro ao buscar notas:', error);
      throw error;
    }
  };

  // Funções de interface
  const definirCategoriaAtiva = (categoria) => {
    setCategoriaAtiva(categoria);
  };

  const alternarMenu = () => {
    setMenuRecolhido(!menuRecolhido);
  };

  const definirTermoBusca = (termo) => {
    setTermoBusca(termo);
  };

  const definirOrdenacao = (novaOrdenacao) => {
    setOrdenacao(novaOrdenacao);
  };

  const recarregarDados = async () => {
    try {
      await carregarNotas({ ativo: true });
      await carregarCategorias();
    } catch (error) {
      console.error('Erro ao recarregar dados:', error);
    }
  };





  // Estatísticas
  const estatisticas = {
    totalNotas: notasAtivas ? notasAtivas.length : 0,
    totalCategorias: categorias ? categorias.length : 0,
    notasDeletadas: notasDeletadas ? notasDeletadas.length : 0,
    notasPorCategoria: categorias ? categorias.map(categoria => ({
      categoria: categoria.nome,
      quantidade: notasAtivas ? notasAtivas.filter(nota => nota.topico === categoria.nome).length : 0
    })) : []
  };

  const valor = {
    // Estado
    notas: notasFiltradas,
    todasAsNotas: notas,
    categorias,
    carregando,
    erro,
    categoriaAtiva,
    menuRecolhido,
    termoBusca,
    ordenacao,
    estatisticas,

    // Ações de CRUD
    adicionarNota,
    editarNota,
    excluirNota,
    visualizarNota,
    restaurarNota,

    // Ações de gerenciamento de categorias
    adicionarCategoria,
    editarCategoria,
    removerCategoria,

    // Ações de filtro e busca
    filtrarPorCategoria: filtrarPorCategoriaEspecifica,
    buscarNotas,
    recarregarDados,

    // Ações de interface
    definirCategoriaAtiva,
    alternarMenu,
    definirTermoBusca,
    definirOrdenacao,
    limparErro,

    // Utilitários
    notasAtivas,
    notasDeletadas
  };

  return (
    <NotasAPIContext.Provider value={valor}>
      {children}
    </NotasAPIContext.Provider>
  );
}; 