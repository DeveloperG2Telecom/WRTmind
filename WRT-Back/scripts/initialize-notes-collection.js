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
const notesCollection = 'notas';

async function initializeNotesCollection() {
  try {
    console.log('🔄 Iniciando inicialização da coleção de notas...');
    
    // Primeiro, vamos verificar se já existem usuários
    const usersSnapshot = await db.collection('users').get();
    
    if (usersSnapshot.empty) {
      console.log('❌ Nenhum usuário encontrado. Crie um usuário primeiro.');
      return;
    }
    
    // Pegar o primeiro usuário para criar a nota de teste
    const firstUser = usersSnapshot.docs[0];
    const userData = firstUser.data();
    const userId = firstUser.id;
    
    console.log(`👤 Usando usuário: ${userData.nome} (${userData.email})`);
    
    // Verificar se já existem notas
    const notesSnapshot = await db.collection(notesCollection).get();
    
    if (!notesSnapshot.empty) {
      console.log(`ℹ️ Coleção de notas já existe com ${notesSnapshot.size} notas`);
      return;
    }
    
    // Criar uma nota de teste para inicializar a coleção
    const docRef = db.collection(notesCollection).doc();
    const notaTeste = {
      id: docRef.id,
      titulo: 'Nota de Boas-vindas',
      conteudo: 'Bem-vindo ao WRTmind! Esta é sua primeira nota. Você pode editá-la, favoritá-la, fixá-la e organizá-la por tópicos.',
      topico: 'Geral',
      userId: userId,
      favorito: false,
      fixado: true,
      ordenacao: 0,
      dataCriacao: new Date().toISOString(),
      dataModificacao: new Date().toISOString(),
      ativo: true
    };
    
    await docRef.set(notaTeste);
    
    console.log('✅ Coleção de notas inicializada com sucesso!');
    console.log('📝 Nota de teste criada:');
    console.log(`   - ID: ${notaTeste.id}`);
    console.log(`   - Título: ${notaTeste.titulo}`);
    console.log(`   - Usuário: ${userData.nome}`);
    console.log(`   - Fixada: Sim`);
    
    console.log('\n🎉 Agora a coleção "notas" deve aparecer no painel do Firebase!');
    
  } catch (error) {
    console.error('❌ Erro ao inicializar coleção de notas:', error.message);
  } finally {
    process.exit(0);
  }
}

// Executar o script
initializeNotesCollection(); 