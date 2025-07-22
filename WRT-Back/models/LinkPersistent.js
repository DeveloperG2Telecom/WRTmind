const fs = require('fs');
const path = require('path');

class LinkPersistent {
  constructor(loadOnInit = false) {
    this.dataFile = path.join(__dirname, '../data/links.json');
    this.links = [];
    this.nextId = 1;
    
    // Criar diretório de dados se não existir
    this.ensureDataDirectory();
    
    // Carregar dados apenas se solicitado
    if (loadOnInit) {
      this.loadData();
    }
  }

  // Garantir que o diretório de dados existe
  ensureDataDirectory() {
    const dataDir = path.dirname(this.dataFile);
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
  }

  // Carregar dados do arquivo
  loadData() {
    try {
      if (fs.existsSync(this.dataFile)) {
        const data = fs.readFileSync(this.dataFile, 'utf8');
        const parsed = JSON.parse(data);
        this.links = parsed.links || [];
        this.nextId = parsed.nextId || 1;
        console.log(`✅ ${this.links.length} links carregados do arquivo local`);
      } else {
        // Arquivo não existe, manter arrays vazios
        this.links = [];
        this.nextId = 1;
        console.log('ℹ️ Arquivo local não encontrado, iniciando com dados vazios');
      }
    } catch (error) {
      console.error('❌ Erro ao carregar dados:', error.message);
      // Usar dados padrão em caso de erro
      this.links = [];
      this.nextId = 1;
    }
  }

  // Inicializar com dados do Firebase
  async initializeFromFirebase(firebaseLinks) {
    try {
      console.log(`🔄 Inicializando com ${firebaseLinks.length} links do Firebase`);
      
      // Limpar dados atuais
      this.links = [];
      this.nextId = 1;
      
      // Copiar dados do Firebase
      for (const fbLink of firebaseLinks) {
        this.links.push({
          ...fbLink,
          id: fbLink.id,
          pendente: false // NÃO pendente quando inicializado do Firebase
        });
      }
      
      // Atualizar nextId
      if (this.links.length > 0) {
        const maxId = Math.max(...this.links.map(l => parseInt(l.id) || 0));
        this.nextId = maxId + 1;
      }
      
      // Salvar no arquivo local
      this.saveData();
      
      console.log(`✅ Inicialização concluída: ${this.links.length} links do Firebase`);
      return true;
    } catch (error) {
      console.error('❌ Erro na inicialização do Firebase:', error.message);
      return false;
    }
  }

  // Salvar dados no arquivo
  saveData() {
    try {
      const data = {
        links: this.links,
        nextId: this.nextId,
        lastUpdate: new Date().toISOString()
      };
      fs.writeFileSync(this.dataFile, JSON.stringify(data, null, 2));
    } catch (error) {
      console.error('❌ Erro ao salvar dados:', error.message);
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

  // Buscar todos os links
  async buscarTodos() {
    // Garantir que this.links seja um array
    if (!this.links || !Array.isArray(this.links)) {
      console.log('⚠️ this.links não está inicializado, retornando array vazio');
      return [];
    }
    
    // Filtrar links ativos e ordenar por posição
    return this.links
      .filter(link => link && link.ativo)
      .sort((a, b) => (a.posicao || 0) - (b.posicao || 0));
  }

  // Buscar link por ID
  async buscarPorId(id) {
    // Garantir que this.links seja um array
    if (!this.links || !Array.isArray(this.links)) {
      throw new Error('Link não encontrado');
    }
    
    const link = this.links.find(link => link && link.id === id && link.ativo);
    if (!link) {
      throw new Error('Link não encontrado');
    }
    return link;
  }

  // Criar novo link
  async criar(dados) {
    // Garantir que this.links seja um array
    if (!this.links || !Array.isArray(this.links)) {
      this.links = [];
    }
    
    const novoLink = {
      id: this.nextId.toString(),
      nome: dados.nome,
      urlIcone: dados.urlIcone,
      urlDestino: dados.urlDestino,
      posicao: dados.posicao || this.links.filter(l => l && l.ativo).length,
      dataCriacao: new Date().toISOString(),
      dataModificacao: new Date().toISOString(),
      ativo: true,
      pendente: true // Sempre pendente ao criar
    };

    this.links.push(novoLink);
    this.nextId++;
    this.saveData();
    
    console.log(`✅ Link "${novoLink.nome}" criado e salvo (pendente)`);
    return novoLink;
  }

  // Atualizar link
  async atualizar(id, dados) {
    // Garantir que this.links seja um array
    if (!this.links || !Array.isArray(this.links)) {
      throw new Error('Link não encontrado');
    }
    
    const linkIndex = this.links.findIndex(link => link && link.id === id);
    if (linkIndex === -1) {
      throw new Error('Link não encontrado');
    }

    this.links[linkIndex] = {
      ...this.links[linkIndex],
      nome: dados.nome,
      urlIcone: dados.urlIcone,
      urlDestino: dados.urlDestino,
      posicao: dados.posicao !== undefined ? dados.posicao : this.links[linkIndex].posicao,
      dataModificacao: new Date().toISOString(),
      pendente: true // Sempre pendente ao editar
    };

    this.saveData();
    console.log(`✅ Link "${this.links[linkIndex].nome}" atualizado e salvo (pendente)`);
    return this.links[linkIndex];
  }

  // Excluir link (hard delete)
  async excluir(id) {
    // Garantir que this.links seja um array
    if (!this.links || !Array.isArray(this.links)) {
      throw new Error('Link não encontrado');
    }
    
    const linkIndex = this.links.findIndex(link => link && link.id === id);
    if (linkIndex === -1) {
      throw new Error('Link não encontrado');
    }

    const nome = this.links[linkIndex].nome;
    this.links.splice(linkIndex, 1); // Remove do array
    this.saveData();
    console.log(`✅ Link "${nome}" removido do array (hard delete)`);
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
    
    this.saveData();
    console.log(`✅ ${posicoes.length} posições atualizadas e salvas`);
  }

  // Contar links ativos
  async contar() {
    return this.links.filter(link => link.ativo).length;
  }

  // Backup dos dados
  async backup() {
    const backupFile = this.dataFile.replace('.json', `_backup_${Date.now()}.json`);
    try {
      fs.copyFileSync(this.dataFile, backupFile);
      console.log(`✅ Backup criado: ${backupFile}`);
      return backupFile;
    } catch (error) {
      console.error('❌ Erro ao criar backup:', error.message);
      throw error;
    }
  }

  // Restaurar dados
  async restore(backupFile) {
    try {
      if (fs.existsSync(backupFile)) {
        const data = fs.readFileSync(backupFile, 'utf8');
        const parsed = JSON.parse(data);
        this.links = parsed.links || [];
        this.nextId = parsed.nextId || 1;
        this.saveData();
        console.log(`✅ Dados restaurados de: ${backupFile}`);
      } else {
        throw new Error('Arquivo de backup não encontrado');
      }
    } catch (error) {
      console.error('❌ Erro ao restaurar dados:', error.message);
      throw error;
    }
  }
}

module.exports = LinkPersistent; 