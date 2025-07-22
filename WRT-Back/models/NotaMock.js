// Modelo Mock para desenvolvimento
class NotaMock {
  constructor() {
    this.notas = [
      {
        id: '1',
        titulo: 'Bem-vindo ao WRTmind',
        conteudo: 'Esta é sua primeira nota. Use o botão "+" para criar novas notas e organize-as por tópicos.',
        topico: 'Geral',
        dataCriacao: new Date(),
        dataModificacao: new Date(),
        ativo: true
      },
      {
        id: '2',
        titulo: 'Como usar o sistema',
        conteudo: '1. Clique em "+" para criar uma nova nota\n2. Organize suas notas por tópicos\n3. Use a busca para encontrar notas rapidamente\n4. Edite ou exclua notas conforme necessário',
        topico: 'Ajuda',
        dataCriacao: new Date(Date.now() - 86400000),
        dataModificacao: new Date(Date.now() - 86400000),
        ativo: true
      }
    ];
    this.nextId = 3;
  }

  // Criar nova nota
  async create(notaData) {
    try {
      console.log('📝 Criando nota com dados:', notaData);
      
      const nota = {
        id: this.nextId.toString(),
        titulo: notaData.titulo,
        conteudo: notaData.conteudo,
        topico: notaData.topico || 'Geral',
        dataCriacao: new Date(),
        dataModificacao: new Date(),
        ativo: true
      };

      console.log('📝 Nota criada:', nota);
      
      this.notas.push(nota);
      this.nextId++;
      
      console.log('📝 Total de notas:', this.notas.length);
      
      return nota;
    } catch (error) {
      console.error('❌ Erro ao criar nota no modelo:', error);
      throw error;
    }
  }

  // Buscar todas as notas com filtros
  async findAll(filters = {}, pagination = {}) {
    let notasFiltradas = this.notas.filter(nota => nota.ativo);

    // Aplicar filtros
    if (filters.topico) {
      notasFiltradas = notasFiltradas.filter(nota => nota.topico === filters.topico);
    }
    if (filters.ativo !== undefined) {
      notasFiltradas = notasFiltradas.filter(nota => nota.ativo === filters.ativo);
    }

    // Ordenar por data de criação (mais recente primeiro)
    notasFiltradas.sort((a, b) => new Date(b.dataCriacao) - new Date(a.dataCriacao));

    // Aplicar paginação
    if (pagination.limit) {
      const offset = pagination.offset || 0;
      notasFiltradas = notasFiltradas.slice(offset, offset + pagination.limit);
    }

    return notasFiltradas;
  }

  // Buscar nota por ID
  async findById(id) {
    return this.notas.find(nota => nota.id === id) || null;
  }

  // Atualizar nota
  async update(id, updateData) {
    const index = this.notas.findIndex(nota => nota.id === id);
    if (index === -1) return null;

    this.notas[index] = {
      ...this.notas[index],
      ...updateData,
      dataModificacao: new Date()
    };

    return this.notas[index];
  }

  // Soft delete (marcar como inativo)
  async softDelete(id) {
    const index = this.notas.findIndex(nota => nota.id === id);
    if (index === -1) return null;

    this.notas[index].ativo = false;
    this.notas[index].dataModificacao = new Date();

    return this.notas[index];
  }

  // Restaurar nota
  async restore(id) {
    const index = this.notas.findIndex(nota => nota.id === id);
    if (index === -1) return null;

    this.notas[index].ativo = true;
    this.notas[index].dataModificacao = new Date();

    return this.notas[index];
  }

  // Buscar tópicos únicos
  async getTopicos() {
    const topicos = new Set();
    this.notas.forEach(nota => {
      if (nota.ativo && nota.topico) {
        topicos.add(nota.topico);
      }
    });
    return Array.from(topicos).sort();
  }

  // Contar total de documentos
  async count(filters = {}) {
    let notasFiltradas = this.notas.filter(nota => nota.ativo);

    if (filters.topico) {
      notasFiltradas = notasFiltradas.filter(nota => nota.topico === filters.topico);
    }
    if (filters.ativo !== undefined) {
      notasFiltradas = notasFiltradas.filter(nota => nota.ativo === filters.ativo);
    }

    return notasFiltradas.length;
  }
}

module.exports = NotaMock; 