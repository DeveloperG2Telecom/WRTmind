const admin = require('firebase-admin');

class TopicoFirebase {
  constructor() {
    if (!admin.apps.length) {
      throw new Error('Firebase Admin não inicializado');
    }
    this.db = admin.firestore();
    this.collection = 'topicos';
  }

  // Garantir que a coleção existe
  async ensureCollection() {
    try {
      const docRef = this.db.collection(this.collection).doc('_init');
      await docRef.set({ 
        createdAt: new Date().toISOString(),
        initialized: true 
      });
    } catch (error) {
      console.error('Erro ao inicializar coleção de tópicos:', error.message);
    }
  }

  // Buscar todos os tópicos de um usuário
  async buscarTodosPorUsuario(userId) {
    try {
      const snapshot = await this.db.collection(this.collection)
        .where('userId', '==', userId)
        .where('ativo', '==', true)
        .orderBy('nome')
        .get();

      const topicos = [];
      snapshot.forEach(doc => {
        topicos.push({
          id: doc.id,
          ...doc.data()
        });
      });

      return topicos;
    } catch (error) {
      console.error('Erro ao buscar tópicos do usuário:', error.message);
      return [];
    }
  }

  // Buscar tópico por ID
  async buscarPorId(id, userId) {
    try {
      const doc = await this.db.collection(this.collection).doc(id).get();
      if (doc.exists) {
        const topico = {
          id: doc.id,
          ...doc.data()
        };
        
        // Verificar se o tópico pertence ao usuário
        if (topico.userId === userId) {
          return topico;
        }
      }
      return null;
    } catch (error) {
      console.error('Erro ao buscar tópico por ID:', error.message);
      return null;
    }
  }

  // Criar novo tópico
  async criar(dados) {
    try {
      // Verificar se já existe um tópico com o mesmo nome para o usuário
      const topicosExistentes = await this.buscarTodosPorUsuario(dados.userId);
      const topicoExistente = topicosExistentes.find(t => 
        t.nome.toLowerCase() === dados.nome.toLowerCase()
      );
      
      if (topicoExistente) {
        throw new Error('Já existe um tópico com este nome');
      }

      const docRef = this.db.collection(this.collection).doc();
      const novoTopico = {
        id: docRef.id,
        nome: dados.nome.trim(),
        descricao: dados.descricao || '',
        cor: dados.cor || '#667eea',
        userId: dados.userId,
        dataCriacao: new Date().toISOString(),
        dataModificacao: new Date().toISOString(),
        ativo: true
      };
      
      await docRef.set(novoTopico);
      return novoTopico;
    } catch (error) {
      console.error('Erro ao criar tópico:', error.message);
      throw error;
    }
  }

  // Atualizar tópico
  async atualizar(id, dados, userId) {
    try {
      const topicoExistente = await this.buscarPorId(id, userId);
      if (!topicoExistente) {
        throw new Error('Tópico não encontrado ou não autorizado');
      }

      // Se o nome foi alterado, verificar se já existe outro tópico com o mesmo nome
      if (dados.nome && dados.nome !== topicoExistente.nome) {
        const topicosExistentes = await this.buscarTodosPorUsuario(userId);
        const topicoComMesmoNome = topicosExistentes.find(t => 
          t.id !== id && t.nome.toLowerCase() === dados.nome.toLowerCase()
        );
        
        if (topicoComMesmoNome) {
          throw new Error('Já existe um tópico com este nome');
        }
      }

      const dadosAtualizados = {
        ...dados,
        dataModificacao: new Date().toISOString()
      };

      await this.db.collection(this.collection).doc(id).update(dadosAtualizados);
      
      return {
        ...topicoExistente,
        ...dadosAtualizados
      };
    } catch (error) {
      console.error('Erro ao atualizar tópico:', error.message);
      throw error;
    }
  }

  // Excluir tópico (soft delete)
  async excluir(id, userId) {
    try {
      const topicoExistente = await this.buscarPorId(id, userId);
      if (!topicoExistente) {
        throw new Error('Tópico não encontrado ou não autorizado');
      }

      await this.db.collection(this.collection).doc(id).update({
        ativo: false,
        dataModificacao: new Date().toISOString()
      });

      return { ...topicoExistente, ativo: false };
    } catch (error) {
      console.error('Erro ao excluir tópico:', error.message);
      throw error;
    }
  }

  // Restaurar tópico
  async restaurar(id, userId) {
    try {
      const doc = await this.db.collection(this.collection).doc(id).get();
      if (!doc.exists) {
        throw new Error('Tópico não encontrado');
      }

      const topico = {
        id: doc.id,
        ...doc.data()
      };

      if (topico.userId !== userId) {
        throw new Error('Tópico não autorizado');
      }

      await this.db.collection(this.collection).doc(id).update({
        ativo: true,
        dataModificacao: new Date().toISOString()
      });

      return { ...topico, ativo: true };
    } catch (error) {
      console.error('Erro ao restaurar tópico:', error.message);
      throw error;
    }
  }

  // Contar tópicos de um usuário
  async contarPorUsuario(userId, filtros = {}) {
    try {
      let query = this.db.collection(this.collection)
        .where('userId', '==', userId)
        .where('ativo', '==', true);

      const snapshot = await query.get();
      return snapshot.size;
    } catch (error) {
      console.error('Erro ao contar tópicos:', error.message);
      return 0;
    }
  }

  // Buscar tópicos deletados
  async buscarDeletados(userId) {
    try {
      const snapshot = await this.db.collection(this.collection)
        .where('userId', '==', userId)
        .where('ativo', '==', false)
        .orderBy('dataModificacao', 'desc')
        .get();

      const topicos = [];
      snapshot.forEach(doc => {
        topicos.push({
          id: doc.id,
          ...doc.data()
        });
      });

      return topicos;
    } catch (error) {
      console.error('Erro ao buscar tópicos deletados:', error.message);
      return [];
    }
  }
}

module.exports = TopicoFirebase; 