const admin = require('firebase-admin');

class NotaFirebase {
  constructor() {
    if (!admin.apps.length) {
      throw new Error('Firebase Admin não inicializado');
    }
    this.db = admin.firestore();
    this.collection = 'notas';
  }

  // Garantir que a coleção existe
  async ensureCollection() {
    try {
      const docRef = this.db.collection(this.collection).doc('temp');
      await docRef.set({ exists: true, timestamp: new Date() });
      await docRef.delete();
      return true;
    } catch (error) {
      console.error('Erro ao verificar/criar coleção de notas:', error.message);
      return false;
    }
  }

  // Buscar todas as notas de um usuário
  async buscarTodasPorUsuario(userId, filtros = {}) {
    try {
      let query = this.db.collection(this.collection)
        .where('userId', '==', userId)
        .where('ativo', '==', true);

      // Aplicar filtros
      if (filtros.topico) {
        query = query.where('topico', '==', filtros.topico);
      }
      if (filtros.favorito !== undefined) {
        query = query.where('favorito', '==', filtros.favorito);
      }
      if (filtros.fixado !== undefined) {
        query = query.where('fixado', '==', filtros.fixado);
      }

      const snapshot = await query.get();
      const notas = [];
      snapshot.forEach(doc => {
        notas.push({
          id: doc.id,
          ...doc.data()
        });
      });

      // Ordenar: primeiro fixadas, depois por ordenação, depois por data de criação
      return notas.sort((a, b) => {
        // Primeiro: fixadas no topo
        if (a.fixado && !b.fixado) return -1;
        if (!a.fixado && b.fixado) return 1;
        
        // Segundo: por ordenação (menor número primeiro)
        if (a.ordenacao !== b.ordenacao) {
          return (a.ordenacao || 0) - (b.ordenacao || 0);
        }
        
        // Terceiro: por data de criação (mais recente primeiro)
        return new Date(b.dataCriacao) - new Date(a.dataCriacao);
      });
    } catch (error) {
      console.error('Erro ao buscar notas do usuário:', error.message);
      return [];
    }
  }

  // Buscar nota por ID (apenas do usuário)
  async buscarPorId(id, userId) {
    try {
      const doc = await this.db.collection(this.collection).doc(id).get();
      if (doc.exists) {
        const nota = {
          id: doc.id,
          ...doc.data()
        };
        
        // Verificar se a nota pertence ao usuário
        if (nota.userId === userId && nota.ativo) {
          return nota;
        }
      }
      return null;
    } catch (error) {
      console.error('Erro ao buscar nota por ID:', error.message);
      return null;
    }
  }

  // Criar nova nota
  async criar(dados) {
    try {
      console.log('📝 NotaFirebase.criar - Dados recebidos:', dados);
      
      const docRef = this.db.collection(this.collection).doc();
      console.log('📝 NotaFirebase.criar - ID gerado:', docRef.id);
      
      const novaNota = {
        id: docRef.id,
        titulo: dados.titulo,
        conteudo: dados.conteudo,
        topico: dados.topico || 'Geral',
        userId: dados.userId,
        favorito: dados.favorito || false,
        fixado: dados.fixado || false,
        ordenacao: dados.ordenacao || 0,
        dataCriacao: new Date().toISOString(),
        dataModificacao: new Date().toISOString(),
        ativo: true
      };
      
      console.log('📝 NotaFirebase.criar - Nota a ser salva:', novaNota);
      
      await docRef.set(novaNota);
      console.log('✅ NotaFirebase.criar - Nota salva com sucesso no Firestore');
      
      return novaNota;
    } catch (error) {
      console.error('❌ NotaFirebase.criar - Erro:', error.message);
      throw error;
    }
  }

  // Atualizar nota
  async atualizar(id, dados, userId) {
    try {
      // Verificar se a nota pertence ao usuário
      const notaExistente = await this.buscarPorId(id, userId);
      if (!notaExistente) {
        throw new Error('Nota não encontrada ou não autorizada');
      }

      const docRef = this.db.collection(this.collection).doc(id);
      const dadosAtualizados = {
        ...dados,
        dataModificacao: new Date().toISOString()
      };
      
      await docRef.update(dadosAtualizados);
      return { id, ...dadosAtualizados };
    } catch (error) {
      console.error('Erro ao atualizar nota:', error.message);
      throw error;
    }
  }

  // Excluir nota (soft delete)
  async excluir(id, userId) {
    try {
      // Verificar se a nota pertence ao usuário
      const notaExistente = await this.buscarPorId(id, userId);
      if (!notaExistente) {
        throw new Error('Nota não encontrada ou não autorizada');
      }

      await this.db.collection(this.collection).doc(id).update({
        ativo: false,
        dataModificacao: new Date().toISOString()
      });
      return true;
    } catch (error) {
      console.error('Erro ao excluir nota:', error.message);
      throw error;
    }
  }

  // Restaurar nota
  async restaurar(id, userId) {
    try {
      const doc = await this.db.collection(this.collection).doc(id).get();
      if (doc.exists) {
        const nota = doc.data();
        if (nota.userId === userId) {
          await this.db.collection(this.collection).doc(id).update({
            ativo: true,
            dataModificacao: new Date().toISOString()
          });
          return { id, ...nota, ativo: true };
        }
      }
      throw new Error('Nota não encontrada ou não autorizada');
    } catch (error) {
      console.error('Erro ao restaurar nota:', error.message);
      throw error;
    }
  }

  // Buscar tópicos de um usuário
  async buscarTopicos(userId) {
    try {
      const snapshot = await this.db.collection(this.collection)
        .where('userId', '==', userId)
        .where('ativo', '==', true)
        .get();
      
      const topicos = new Set();
      snapshot.forEach(doc => {
        const nota = doc.data();
        if (nota.topico) {
          topicos.add(nota.topico);
        }
      });
      
      return Array.from(topicos).sort();
    } catch (error) {
      console.error('Erro ao buscar tópicos:', error.message);
      return [];
    }
  }

  // Contar notas de um usuário
  async contarPorUsuario(userId, filtros = {}) {
    try {
      let query = this.db.collection(this.collection)
        .where('userId', '==', userId)
        .where('ativo', '==', true);

      if (filtros.topico) {
        query = query.where('topico', '==', filtros.topico);
      }
      if (filtros.favorito !== undefined) {
        query = query.where('favorito', '==', filtros.favorito);
      }
      if (filtros.fixado !== undefined) {
        query = query.where('fixado', '==', filtros.fixado);
      }

      const snapshot = await query.get();
      return snapshot.size;
    } catch (error) {
      console.error('Erro ao contar notas:', error.message);
      return 0;
    }
  }

  // Alternar favorito
  async alternarFavorito(id, userId) {
    try {
      const nota = await this.buscarPorId(id, userId);
      if (!nota) {
        throw new Error('Nota não encontrada ou não autorizada');
      }

      const novoFavorito = !nota.favorito;
      await this.db.collection(this.collection).doc(id).update({
        favorito: novoFavorito,
        dataModificacao: new Date().toISOString()
      });

      return { ...nota, favorito: novoFavorito };
    } catch (error) {
      console.error('Erro ao alternar favorito:', error.message);
      throw error;
    }
  }

  // Alternar fixado
  async alternarFixado(id, userId) {
    try {
      const nota = await this.buscarPorId(id, userId);
      if (!nota) {
        throw new Error('Nota não encontrada ou não autorizada');
      }

      const novoFixado = !nota.fixado;
      await this.db.collection(this.collection).doc(id).update({
        fixado: novoFixado,
        dataModificacao: new Date().toISOString()
      });

      return { ...nota, fixado: novoFixado };
    } catch (error) {
      console.error('Erro ao alternar fixado:', error.message);
      throw error;
    }
  }

  // Atualizar ordenação
  async atualizarOrdenacao(id, userId, novaOrdenacao) {
    try {
      const nota = await this.buscarPorId(id, userId);
      if (!nota) {
        throw new Error('Nota não encontrada ou não autorizada');
      }

      await this.db.collection(this.collection).doc(id).update({
        ordenacao: novaOrdenacao,
        dataModificacao: new Date().toISOString()
      });

      return { ...nota, ordenacao: novaOrdenacao };
    } catch (error) {
      console.error('Erro ao atualizar ordenação:', error.message);
      throw error;
    }
  }

  // Atualizar múltiplas ordenações
  async atualizarMultiplasOrdenacoes(ordenacoes, userId) {
    try {
      const batch = this.db.batch();
      
      for (const { id, ordenacao } of ordenacoes) {
        // Verificar se a nota pertence ao usuário
        const nota = await this.buscarPorId(id, userId);
        if (!nota) {
          throw new Error(`Nota ${id} não encontrada ou não autorizada`);
        }

        const docRef = this.db.collection(this.collection).doc(id);
        batch.update(docRef, { 
          ordenacao, 
          dataModificacao: new Date().toISOString() 
        });
      }
      
      await batch.commit();
      return true;
    } catch (error) {
      console.error('Erro ao atualizar múltiplas ordenações:', error.message);
      throw error;
    }
  }

  // Buscar notas favoritas
  async buscarFavoritas(userId) {
    return this.buscarTodasPorUsuario(userId, { favorito: true });
  }

  // Buscar notas fixadas
  async buscarFixadas(userId) {
    return this.buscarTodasPorUsuario(userId, { fixado: true });
  }
}

module.exports = NotaFirebase; 