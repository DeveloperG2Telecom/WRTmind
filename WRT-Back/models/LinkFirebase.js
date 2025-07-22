const admin = require('firebase-admin');

class LinkFirebase {
  constructor() {
    if (!admin.apps.length) {
      throw new Error('Firebase Admin não inicializado');
    }
    this.db = admin.firestore();
    this.collection = 'links';
  }

  // Garantir que a coleção existe
  async ensureCollection() {
    try {
      const docRef = this.db.collection(this.collection).doc('temp');
      await docRef.set({ exists: true, timestamp: new Date() });
      await docRef.delete();
      return true;
    } catch (error) {
      console.error('Erro ao verificar/criar coleção:', error.message);
      return false;
    }
  }

  // Buscar todos os links de um usuário
  async buscarTodosPorUsuario(userId) {
    try {
      const snapshot = await this.db.collection(this.collection)
        .where('userId', '==', userId)
        .where('ativo', '==', true)
        .get();
      const links = [];
      snapshot.forEach(doc => {
        links.push({
          id: doc.id,
          ...doc.data()
        });
      });
      return links.sort((a, b) => (a.posicao || 0) - (b.posicao || 0));
    } catch (error) {
      console.error('Erro ao buscar links do usuário:', error.message);
      return [];
    }
  }

  // Buscar link por ID (apenas do usuário)
  async buscarPorId(id, userId) {
    try {
      const doc = await this.db.collection(this.collection).doc(id).get();
      if (doc.exists) {
        const link = {
          id: doc.id,
          ...doc.data()
        };
        
        // Verificar se o link pertence ao usuário
        if (link.userId === userId && link.ativo) {
          return link;
        }
      }
      return null;
    } catch (error) {
      console.error('Erro ao buscar link por ID:', error.message);
      return null;
    }
  }

  // Criar novo link
  async criar(dados) {
    try {
      const docRef = this.db.collection(this.collection).doc();
      const novoLink = {
        id: docRef.id,
        nome: dados.nome,
        urlIcone: dados.urlIcone,
        urlDestino: dados.urlDestino,
        posicao: dados.posicao || 0,
        userId: dados.userId,
        dataCriacao: new Date().toISOString(),
        dataModificacao: new Date().toISOString(),
        ativo: true
      };
      
      await docRef.set(novoLink);
      return novoLink;
    } catch (error) {
      console.error('Erro ao criar link:', error.message);
      throw error;
    }
  }

  // Atualizar link
  async atualizar(id, dados, userId) {
    try {
      // Verificar se o link pertence ao usuário
      const linkExistente = await this.buscarPorId(id, userId);
      if (!linkExistente) {
        throw new Error('Link não encontrado ou não autorizado');
      }

      const docRef = this.db.collection(this.collection).doc(id);
      const dadosAtualizados = {
        ...dados,
        dataModificacao: new Date().toISOString()
      };
      
      await docRef.update(dadosAtualizados);
      return { id, ...dadosAtualizados };
    } catch (error) {
      console.error('Erro ao atualizar link:', error.message);
      throw error;
    }
  }

  // Excluir link (soft delete)
  async excluir(id, userId) {
    try {
      // Verificar se o link pertence ao usuário
      const linkExistente = await this.buscarPorId(id, userId);
      if (!linkExistente) {
        throw new Error('Link não encontrado ou não autorizado');
      }

      await this.db.collection(this.collection).doc(id).update({
        ativo: false,
        dataModificacao: new Date().toISOString()
      });
      return true;
    } catch (error) {
      console.error('Erro ao excluir link:', error.message);
      throw error;
    }
  }

  // Atualizar posições
  async atualizarPosicoes(posicoes, userId) {
    try {
      const batch = this.db.batch();
      
      for (const { id, posicao } of posicoes) {
        // Verificar se o link pertence ao usuário
        const linkExistente = await this.buscarPorId(id, userId);
        if (!linkExistente) {
          throw new Error(`Link ${id} não encontrado ou não autorizado`);
        }

        const docRef = this.db.collection(this.collection).doc(id);
        batch.update(docRef, { 
          posicao, 
          dataModificacao: new Date().toISOString() 
        });
      }
      
      await batch.commit();
      return true;
    } catch (error) {
      console.error('Erro ao atualizar posições:', error.message);
      throw error;
    }
  }
}

module.exports = LinkFirebase; 