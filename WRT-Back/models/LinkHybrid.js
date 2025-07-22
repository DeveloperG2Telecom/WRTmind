const { getFirestore } = require('../config/firebase');

class LinkHybrid {
  constructor() {
    this.db = null;
    this.collection = 'links';
    this.useFirebase = false;
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
    
    // Tentar inicializar Firebase
    this.initializeFirebase();
  }

  // Tentar inicializar Firebase
  initializeFirebase() {
    try {
      this.db = getFirestore();
      this.useFirebase = true;
      console.log('✅ Firebase disponível para links');
    } catch (error) {
      console.log('ℹ️ Firebase não disponível, usando dados em memória para links');
      this.useFirebase = false;
    }
  }

  // Validar dados do link
  static validarDados(dados) {
    const erros = [];
    
    if (!dados.nome || dados.nome.trim() === '') {
      erros.push('Nome é obrigatório');
    }
    
    if (!dados.urlIcone || dados.urlIcone.trim() === '') {
      erros.push('URL do ícone é obrigatória');
    } else if (!this.isValidUrl(dados.urlIcone)) {
      erros.push('URL do ícone deve ser uma URL válida');
    }
    
    if (!dados.urlDestino || dados.urlDestino.trim() === '') {
      erros.push('URL de destino é obrigatória');
    } else if (!this.isValidUrl(dados.urlDestino)) {
      erros.push('URL de destino deve ser uma URL válida');
    }
    
    if (dados.posicao !== undefined && (isNaN(dados.posicao) || dados.posicao < 0)) {
      erros.push('Posição deve ser um número não negativo');
    }
    
    return erros;
  }

  // Validar URL
  static isValidUrl(string) {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  }

  // Buscar todos os links ativos
  async buscarTodos() {
    if (this.useFirebase) {
      try {
        const snapshot = await this.db.collection(this.collection)
          .where('ativo', '==', true)
          .orderBy('posicao', 'asc')
          .get();
        
        const links = [];
        snapshot.forEach(doc => {
          links.push({
            id: doc.id,
            ...doc.data()
          });
        });
        
        return links;
      } catch (error) {
        console.error('Erro ao buscar links no Firebase, usando dados em memória:', error);
        this.useFirebase = false;
        return this.buscarTodosMemoria();
      }
    } else {
      return this.buscarTodosMemoria();
    }
  }

  // Buscar todos os links em memória
  buscarTodosMemoria() {
    return this.links.filter(link => link.ativo).sort((a, b) => a.posicao - b.posicao);
  }

  // Buscar link por ID
  async buscarPorId(id) {
    if (this.useFirebase) {
      try {
        const doc = await this.db.collection(this.collection).doc(id).get();
        
        if (!doc.exists) {
          throw new Error('Link não encontrado');
        }
        
        return {
          id: doc.id,
          ...doc.data()
        };
      } catch (error) {
        console.error('Erro ao buscar link no Firebase, usando dados em memória:', error);
        this.useFirebase = false;
        return this.buscarPorIdMemoria(id);
      }
    } else {
      return this.buscarPorIdMemoria(id);
    }
  }

  // Buscar link por ID em memória
  buscarPorIdMemoria(id) {
    const link = this.links.find(link => link.id === id && link.ativo);
    if (!link) {
      throw new Error('Link não encontrado');
    }
    return link;
  }

  // Criar novo link
  async criar(dados) {
    if (this.useFirebase) {
      try {
        const novoLink = {
          nome: dados.nome,
          urlIcone: dados.urlIcone,
          urlDestino: dados.urlDestino,
          posicao: dados.posicao || 0,
          dataCriacao: new Date().toISOString(),
          dataModificacao: new Date().toISOString(),
          ativo: true
        };

        const docRef = await this.db.collection(this.collection).add(novoLink);
        
        return {
          id: docRef.id,
          ...novoLink
        };
      } catch (error) {
        console.error('Erro ao criar link no Firebase, usando dados em memória:', error);
        this.useFirebase = false;
        return this.criarMemoria(dados);
      }
    } else {
      return this.criarMemoria(dados);
    }
  }

  // Criar link em memória
  criarMemoria(dados) {
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
    if (this.useFirebase) {
      try {
        const linkRef = this.db.collection(this.collection).doc(id);
        const doc = await linkRef.get();
        
        if (!doc.exists) {
          throw new Error('Link não encontrado');
        }

        const dadosAtualizados = {
          nome: dados.nome,
          urlIcone: dados.urlIcone,
          urlDestino: dados.urlDestino,
          dataModificacao: new Date().toISOString()
        };

        if (dados.posicao !== undefined) {
          dadosAtualizados.posicao = dados.posicao;
        }

        await linkRef.update(dadosAtualizados);
        
        return {
          id: doc.id,
          ...doc.data(),
          ...dadosAtualizados
        };
      } catch (error) {
        console.error('Erro ao atualizar link no Firebase, usando dados em memória:', error);
        this.useFirebase = false;
        return this.atualizarMemoria(id, dados);
      }
    } else {
      return this.atualizarMemoria(id, dados);
    }
  }

  // Atualizar link em memória
  atualizarMemoria(id, dados) {
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
    if (this.useFirebase) {
      try {
        const linkRef = this.db.collection(this.collection).doc(id);
        const doc = await linkRef.get();
        
        if (!doc.exists) {
          throw new Error('Link não encontrado');
        }

        await linkRef.update({
          ativo: false,
          dataModificacao: new Date().toISOString()
        });

        return {
          id: doc.id,
          ...doc.data(),
          ativo: false
        };
      } catch (error) {
        console.error('Erro ao excluir link no Firebase, usando dados em memória:', error);
        this.useFirebase = false;
        return this.excluirMemoria(id);
      }
    } else {
      return this.excluirMemoria(id);
    }
  }

  // Excluir link em memória
  excluirMemoria(id) {
    const linkIndex = this.links.findIndex(link => link.id === id);
    if (linkIndex === -1) {
      throw new Error('Link não encontrado');
    }

    this.links[linkIndex].ativo = false;
    this.links[linkIndex].dataModificacao = new Date().toISOString();

    return this.links[linkIndex];
  }

  // Atualizar posições de múltiplos links
  async atualizarPosicoes(posicoes) {
    if (this.useFirebase) {
      try {
        const batch = this.db.batch();
        
        for (const { id, posicao } of posicoes) {
          const linkRef = this.db.collection(this.collection).doc(id);
          batch.update(linkRef, {
            posicao: posicao,
            dataModificacao: new Date().toISOString()
          });
        }
        
        await batch.commit();
      } catch (error) {
        console.error('Erro ao atualizar posições no Firebase, usando dados em memória:', error);
        this.useFirebase = false;
        this.atualizarPosicoesMemoria(posicoes);
      }
    } else {
      this.atualizarPosicoesMemoria(posicoes);
    }
  }

  // Atualizar posições em memória
  atualizarPosicoesMemoria(posicoes) {
    for (const { id, posicao } of posicoes) {
      const linkIndex = this.links.findIndex(link => link.id === id);
      if (linkIndex !== -1) {
        this.links[linkIndex].posicao = posicao;
        this.links[linkIndex].dataModificacao = new Date().toISOString();
      }
    }
  }

  // Contar links ativos
  async contar() {
    if (this.useFirebase) {
      try {
        const snapshot = await this.db.collection(this.collection)
          .where('ativo', '==', true)
          .get();
        
        return snapshot.size;
      } catch (error) {
        console.error('Erro ao contar links no Firebase, usando dados em memória:', error);
        this.useFirebase = false;
        return this.contarMemoria();
      }
    } else {
      return this.contarMemoria();
    }
  }

  // Contar links em memória
  contarMemoria() {
    return this.links.filter(link => link.ativo).length;
  }
}

module.exports = LinkHybrid; 