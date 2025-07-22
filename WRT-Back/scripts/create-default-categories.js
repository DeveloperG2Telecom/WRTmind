const admin = require('firebase-admin');

// Inicializar Firebase Admin
const serviceAccount = require('../wrtmin-service-account.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();
const categoriasCollection = 'categorias';

async function createDefaultCategories() {
  try {
    console.log('🚀 Iniciando criação das categorias padrão...');
    
    // Verificar se existem usuários
    const usersSnapshot = await db.collection('users').limit(1).get();
    if (usersSnapshot.empty) {
      console.log('❌ Nenhum usuário encontrado. Crie um usuário primeiro.');
      return;
    }

    // Pegar o primeiro usuário
    const firstUser = usersSnapshot.docs[0];
    const userId = firstUser.id;
    console.log(`✅ Usando usuário: ${firstUser.data().nome} (${userId})`);

    // Categorias predefinidas
    const categoriasPredefinidas = [
      {
        nome: 'Mapeamento',
        descricao: 'Notas relacionadas a mapeamentos de processos, fluxos e documentação de sistemas',
        cor: '#667eea'
      },
      {
        nome: 'G2 Office',
        descricao: 'Notas relacionadas ao G2 Office, configurações e funcionalidades',
        cor: '#764ba2'
      },
      {
        nome: 'Unit',
        descricao: 'Notas relacionadas a unidades, departamentos e estruturas organizacionais',
        cor: '#f093fb'
      },
      {
        nome: 'Rede',
        descricao: 'Notas relacionadas a redes, conectividade, infraestrutura e comunicação',
        cor: '#4facfe'
      }
    ];

    console.log('📝 Criando categorias padrão...');
    let categoriasCriadas = 0;

    for (const categoriaData of categoriasPredefinidas) {
      // Verificar se a categoria já existe para este usuário
      const existingSnapshot = await db.collection(categoriasCollection)
        .where('userId', '==', userId)
        .where('nome', '==', categoriaData.nome)
        .where('ativo', '==', true)
        .get();

      if (!existingSnapshot.empty) {
        console.log(`⚠️  Categoria "${categoriaData.nome}" já existe para o usuário`);
        continue;
      }

      // Criar nova categoria
      const docRef = db.collection(categoriasCollection).doc();
      const novaCategoria = {
        id: docRef.id,
        nome: categoriaData.nome,
        descricao: categoriaData.descricao,
        cor: categoriaData.cor,
        userId: userId,
        dataCriacao: new Date().toISOString(),
        dataModificacao: new Date().toISOString(),
        ativo: true
      };

      await docRef.set(novaCategoria);
      categoriasCriadas++;
      console.log(`✅ Categoria "${categoriaData.nome}" criada com sucesso`);
    }

    console.log(`\n🎉 Processo concluído!`);
    console.log(`📊 Categorias criadas: ${categoriasCriadas}`);
    console.log(`👤 Usuário: ${firstUser.data().nome}`);
    console.log(`🆔 User ID: ${userId}`);
    console.log(`\n💡 Agora você pode criar notas usando essas categorias.`);

  } catch (error) {
    console.error('❌ Erro ao criar categorias padrão:', error);
  } finally {
    process.exit(0);
  }
}

createDefaultCategories(); 