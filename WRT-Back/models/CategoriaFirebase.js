const admin = require('firebase-admin');

class CategoriaFirebase {
  constructor() {
    this.db = admin.firestore();
    this.collection = 'categorias';
    this.ensureCollection();
  }

  async ensureCollection() {
    try {
      // Verificar se a coleção existe
      const snapshot = await this.db.collection(this.collection).limit(1).get();
      console.log(`✅ Coleção '${this.collection}' verificada/estabelecida`);
    } catch (error) {
      console.error('Erro ao verificar/criar coleção de categorias:', error.message);
    }
  }

  // Buscar todas as categorias de um usuário
  async buscarTodasPorUsuario(userId) {
    try {
      const snapshot = await this.db.collection(this.collection)
        .where('userId', '==', userId)
        .where('ativo', '==', true)
        .get();

      // Ordenar no JavaScript em vez de no Firestore
      const categorias = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      return categorias.sort((a, b) => a.nome.localeCompare(b.nome));
    } catch (error) {
      console.error('Erro ao buscar categorias por usuário:', error.message);
      throw error;
    }
  }

  // Buscar categoria por ID
  async buscarPorId(id) {
    try {
      const doc = await this.db.collection(this.collection).doc(id).get();
      if (doc.exists) {
        return {
          id: doc.id,
          ...doc.data()
        };
      }
      return null;
    } catch (error) {
      console.error('Erro ao buscar categoria por ID:', error.message);
      throw error;
    }
  }

  // Criar nova categoria
  async criar(dados) {
    try {
      // Verificar se já existe uma categoria com o mesmo nome para o usuário
      const snapshot = await this.db.collection(this.collection)
        .where('userId', '==', dados.userId)
        .where('nome', '==', dados.nome.trim())
        .where('ativo', '==', true)
        .get();

      if (!snapshot.empty) {
        throw new Error('Já existe uma categoria com este nome');
      }

      const docRef = this.db.collection(this.collection).doc();
      const novaCategoria = {
        id: docRef.id,
        nome: dados.nome.trim(),
        descricao: dados.descricao || '',
        cor: dados.cor || '#667eea',
        userId: dados.userId,
        dataCriacao: new Date().toISOString(),
        dataModificacao: new Date().toISOString(),
        ativo: true
      };

      await docRef.set(novaCategoria);
      return novaCategoria;
    } catch (error) {
      console.error('Erro ao criar categoria:', error.message);
      throw error;
    }
  }

  // Atualizar categoria
  async atualizar(id, dados) {
    try {
      const docRef = this.db.collection(this.collection).doc(id);
      const doc = await docRef.get();

      if (!doc.exists) {
        throw new Error('Categoria não encontrada');
      }

      const categoriaAtual = doc.data();
      
      // Verificar se o nome mudou e se já existe outro com o mesmo nome
      if (dados.nome && dados.nome.trim() !== categoriaAtual.nome) {
        const snapshot = await this.db.collection(this.collection)
          .where('userId', '==', categoriaAtual.userId)
          .where('nome', '==', dados.nome.trim())
          .where('ativo', '==', true)
          .get();

        if (!snapshot.empty) {
          throw new Error('Já existe uma categoria com este nome');
        }
      }

      const dadosAtualizados = {
        ...dados,
        dataModificacao: new Date().toISOString()
      };

      if (dados.nome) {
        dadosAtualizados.nome = dados.nome.trim();
      }

      await docRef.update(dadosAtualizados);
      
      return {
        id: doc.id,
        ...categoriaAtual,
        ...dadosAtualizados
      };
    } catch (error) {
      console.error('Erro ao atualizar categoria:', error.message);
      throw error;
    }
  }

  // Excluir categoria (soft delete)
  async excluir(id) {
    try {
      const docRef = this.db.collection(this.collection).doc(id);
      const doc = await docRef.get();

      if (!doc.exists) {
        throw new Error('Categoria não encontrada');
      }

      await docRef.update({
        ativo: false,
        dataModificacao: new Date().toISOString()
      });

      return { message: 'Categoria excluída com sucesso' };
    } catch (error) {
      console.error('Erro ao excluir categoria:', error.message);
      throw error;
    }
  }

  // Restaurar categoria excluída
  async restaurar(id) {
    try {
      const docRef = this.db.collection(this.collection).doc(id);
      const doc = await docRef.get();

      if (!doc.exists) {
        throw new Error('Categoria não encontrada');
      }

      await docRef.update({
        ativo: true,
        dataModificacao: new Date().toISOString()
      });

      return { message: 'Categoria restaurada com sucesso' };
    } catch (error) {
      console.error('Erro ao restaurar categoria:', error.message);
      throw error;
    }
  }

  // Contar categorias de um usuário
  async contarPorUsuario(userId) {
    try {
      const snapshot = await this.db.collection(this.collection)
        .where('userId', '==', userId)
        .where('ativo', '==', true)
        .get();

      return snapshot.size;
    } catch (error) {
      console.error('Erro ao contar categorias por usuário:', error.message);
      throw error;
    }
  }

  // Buscar categorias excluídas
  async buscarDeletadas(userId) {
    try {
      const snapshot = await this.db.collection(this.collection)
        .where('userId', '==', userId)
        .where('ativo', '==', false)
        .orderBy('nome')
        .get();

      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Erro ao buscar categorias deletadas:', error.message);
      throw error;
    }
  }
}

module.exports = CategoriaFirebase; 