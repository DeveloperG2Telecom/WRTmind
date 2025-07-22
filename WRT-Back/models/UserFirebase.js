const admin = require('firebase-admin');
const bcrypt = require('bcryptjs');

class UserFirebase {
  constructor() {
    if (!admin.apps.length) {
      throw new Error('Firebase Admin não inicializado');
    }
    this.db = admin.firestore();
    this.collection = 'users';
  }

  // Garantir que a coleção existe
  async ensureCollection() {
    try {
      const docRef = this.db.collection(this.collection).doc('temp');
      await docRef.set({ exists: true, timestamp: new Date() });
      await docRef.delete();
      return true;
    } catch (error) {
      console.error('Erro ao verificar/criar coleção de usuários:', error.message);
      return false;
    }
  }

  // Buscar usuário por email
  async buscarPorEmail(email) {
    try {
      const snapshot = await this.db.collection(this.collection)
        .where('email', '==', email)
        .limit(1)
        .get();
      
      if (!snapshot.empty) {
        const doc = snapshot.docs[0];
        return {
          id: doc.id,
          ...doc.data()
        };
      }
      return null;
    } catch (error) {
      console.error('Erro ao buscar usuário por email:', error.message);
      return null;
    }
  }

  // Buscar usuário por ID
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
      console.error('Erro ao buscar usuário por ID:', error.message);
      return null;
    }
  }

  // Criar novo usuário
  async criar(dados) {
    try {
      // Verificar se email já existe
      const usuarioExistente = await this.buscarPorEmail(dados.email);
      if (usuarioExistente) {
        throw new Error('Email já cadastrado');
      }

      // Hash da senha
      const saltRounds = 12;
      const senhaHash = await bcrypt.hash(dados.senha, saltRounds);

      const docRef = this.db.collection(this.collection).doc();
      const novoUsuario = {
        id: docRef.id,
        nome: dados.nome,
        email: dados.email.toLowerCase(),
        senha: senhaHash,
        dataCriacao: new Date().toISOString(),
        dataModificacao: new Date().toISOString(),
        ativo: true
      };
      
      await docRef.set(novoUsuario);
      
      // Retornar sem a senha
      const { senha, ...usuarioSemSenha } = novoUsuario;
      return usuarioSemSenha;
    } catch (error) {
      console.error('Erro ao criar usuário:', error.message);
      throw error;
    }
  }

  // Atualizar usuário
  async atualizar(id, dados) {
    try {
      const docRef = this.db.collection(this.collection).doc(id);
      const dadosAtualizados = {
        ...dados,
        dataModificacao: new Date().toISOString()
      };
      
      await docRef.update(dadosAtualizados);
      
      // Retornar dados atualizados sem senha
      const { senha, ...usuarioSemSenha } = dadosAtualizados;
      return { id, ...usuarioSemSenha };
    } catch (error) {
      console.error('Erro ao atualizar usuário:', error.message);
      throw error;
    }
  }

  // Autenticar usuário
  async autenticar(email, senha) {
    try {
      const usuario = await this.buscarPorEmail(email.toLowerCase());
      if (!usuario) {
        return null;
      }

      // Comparar hash da senha
      const senhaValida = await bcrypt.compare(senha, usuario.senha);
      if (senhaValida && usuario.ativo) {
        const { senha, ...usuarioSemSenha } = usuario;
        return usuarioSemSenha;
      }

      return null;
    } catch (error) {
      console.error('Erro ao autenticar usuário:', error.message);
      return null;
    }
  }

  // Excluir usuário (soft delete)
  async excluir(id) {
    try {
      await this.db.collection(this.collection).doc(id).update({
        ativo: false,
        dataModificacao: new Date().toISOString()
      });
      return true;
    } catch (error) {
      console.error('Erro ao excluir usuário:', error.message);
      throw error;
    }
  }
}

module.exports = UserFirebase; 