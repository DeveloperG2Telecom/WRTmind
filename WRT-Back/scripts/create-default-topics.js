const admin = require('firebase-admin');
const path = require('path');

// Inicializar Firebase Admin SDK
const serviceAccountPath = process.env.GOOGLE_APPLICATION_CREDENTIALS || './wrtmin-service-account.json';

try {
  const serviceAccount = require(path.resolve(serviceAccountPath));
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
  console.log('✅ Firebase Admin SDK inicializado');
} catch (error) {
  console.error('❌ Erro ao inicializar Firebase Admin SDK:', error.message);
  process.exit(1);
}

const db = admin.firestore();
const topicosCollection = 'topicos';

async function createDefaultTopics() {
  try {
    console.log('🔄 Criando tópicos predefinidos...');
    
    // Primeiro, vamos verificar se já existem usuários
    const usersSnapshot = await db.collection('users').get();
    
    if (usersSnapshot.empty) {
      console.log('❌ Nenhum usuário encontrado. Crie um usuário primeiro.');
      return;
    }
    
    // Pegar o primeiro usuário para criar os tópicos
    const firstUser = usersSnapshot.docs[0];
    const userData = firstUser.data();
    const userId = firstUser.id;
    
    console.log(`👤 Usando usuário: ${userData.nome} (${userData.email})`);
    
    // Tópicos predefinidos
    const topicosPredefinidos = [
      {
        nome: 'Mapeamento',
        descricao: 'Notas relacionadas a mapeamentos e processos',
        cor: '#667eea'
      },
      {
        nome: 'G2 Office',
        descricao: 'Notas relacionadas ao G2 Office',
        cor: '#764ba2'
      },
      {
        nome: 'Unit',
        descricao: 'Notas relacionadas a unidades e departamentos',
        cor: '#f093fb'
      },
      {
        nome: 'Rede',
        descricao: 'Notas relacionadas a redes e conectividade',
        cor: '#4facfe'
      }
    ];
    
    let createdCount = 0;
    let skippedCount = 0;
    
    for (const topicoData of topicosPredefinidos) {
      try {
        // Verificar se o tópico já existe
        const existingSnapshot = await db.collection(topicosCollection)
          .where('userId', '==', userId)
          .where('nome', '==', topicoData.nome)
          .get();
        
        if (!existingSnapshot.empty) {
          console.log(`⚠️ Tópico "${topicoData.nome}" já existe`);
          skippedCount++;
          continue;
        }
        
        // Criar o tópico
        const docRef = db.collection(topicosCollection).doc();
        const novoTopico = {
          id: docRef.id,
          nome: topicoData.nome,
          descricao: topicoData.descricao,
          cor: topicoData.cor,
          userId: userId,
          dataCriacao: new Date().toISOString(),
          dataModificacao: new Date().toISOString(),
          ativo: true
        };
        
        await docRef.set(novoTopico);
        createdCount++;
        console.log(`✅ Tópico "${topicoData.nome}" criado com sucesso`);
        
      } catch (error) {
        console.error(`❌ Erro ao criar tópico "${topicoData.nome}":`, error.message);
      }
    }
    
    console.log('\n📋 Resumo da criação de tópicos:');
    console.log(`   Tópicos criados: ${createdCount}`);
    console.log(`   Tópicos já existentes: ${skippedCount}`);
    console.log(`   Total processados: ${topicosPredefinidos.length}`);
    
    if (createdCount > 0) {
      console.log('\n🎉 Tópicos predefinidos criados com sucesso!');
      console.log('   Agora você pode criar notas usando esses tópicos.');
    }
    
  } catch (error) {
    console.error('❌ Erro geral:', error.message);
  } finally {
    process.exit(0);
  }
}

// Executar o script
createDefaultTopics(); 