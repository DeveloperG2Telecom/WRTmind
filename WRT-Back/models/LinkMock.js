// Modelo mock para links de atalho
class LinkMock {
  constructor() {
    this.links = [
      {
        id: "1",
        nome: "Google",
        urlIcone: "https://www.google.com/favicon.ico",
        urlDestino: "https://www.google.com",
        posicao: 0,
        dataCriacao: new Date().toISOString(),
        dataModificacao: new Date().toISOString(),
        ativo: true
      },
      {
        id: "2",
        nome: "YouTube",
        urlIcone: "https://www.youtube.com/favicon.ico",
        urlDestino: "https://www.youtube.com",
        posicao: 1,
        dataCriacao: new Date().toISOString(),
        dataModificacao: new Date().toISOString(),
        ativo: true
      },
      {
        id: "3",
        nome: "GitHub",
        urlIcone: "https://github.com/favicon.ico",
        urlDestino: "https://github.com",
        posicao: 2,
        dataCriacao: new Date().toISOString(),
        dataModificacao: new Date().toISOString(),
        ativo: true
      }
    ];
    this.nextId = 4;
  }

  // Buscar todos os links ativos
  async buscarTodos() {
    return this.links.filter(link => link.ativo);
  }

  // Buscar link por ID
  async buscarPorId(id) {
    return this.links.find(link => link.id === id && link.ativo);
  }

  // Criar novo link
  async criar(dados) {
    const novoLink = {
      id: this.nextId.toString(),
      nome: dados.nome,
      urlIcone: dados.urlIcone,
      urlDestino: dados.urlDestino,
      posicao: dados.posicao || this.links.filter(l => l.ativo).length,
      dataCriacao: new Date().toISOString(),
      dataModificacao: new Date().toISOString(),
      ativo: true
    };

    this.links.push(novoLink);
    this.nextId++;
    return novoLink;
  }

  // Atualizar link
  async atualizar(id, dados) {
    const linkIndex = this.links.findIndex(link => link.id === id);
    if (linkIndex === -1) {
      throw new Error('Link não encontrado');
    }

    this.links[linkIndex] = {
      ...this.links[linkIndex],
      nome: dados.nome,
      urlIcone: dados.urlIcone,
      urlDestino: dados.urlDestino,
      posicao: dados.posicao !== undefined ? dados.posicao : this.links[linkIndex].posicao,
      dataModificacao: new Date().toISOString()
    };

    return this.links[linkIndex];
  }

  // Excluir link (soft delete)
  async excluir(id) {
    const linkIndex = this.links.findIndex(link => link.id === id);
    if (linkIndex === -1) {
      throw new Error('Link não encontrado');
    }

    this.links[linkIndex].ativo = false;
    this.links[linkIndex].dataModificacao = new Date().toISOString();
    
    return true;
  }

  // Atualizar posições de múltiplos links
  async atualizarPosicoes(posicoes) {
    for (const { id, posicao } of posicoes) {
      const linkIndex = this.links.findIndex(link => link.id === id);
      if (linkIndex !== -1) {
        this.links[linkIndex].posicao = posicao;
        this.links[linkIndex].dataModificacao = new Date().toISOString();
      }
    }
    return true;
  }

  // Validar dados do link
  validarDados(dados) {
    const erros = [];

    if (!dados.nome || dados.nome.trim().length === 0) {
      erros.push('Nome é obrigatório');
    }

    if (!dados.urlIcone || dados.urlIcone.trim().length === 0) {
      erros.push('URL do ícone é obrigatória');
    }

    if (!dados.urlDestino || dados.urlDestino.trim().length === 0) {
      erros.push('URL de destino é obrigatória');
    }

    // Validar URLs
    try {
      if (dados.urlIcone) new URL(dados.urlIcone);
    } catch {
      erros.push('URL do ícone deve ser uma URL válida');
    }

    try {
      if (dados.urlDestino) new URL(dados.urlDestino);
    } catch {
      erros.push('URL de destino deve ser uma URL válida');
    }

    return erros;
  }
}

module.exports = new LinkMock(); 