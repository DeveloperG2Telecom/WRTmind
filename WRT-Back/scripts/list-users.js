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
const usersCollection = 'users';

async function listUsers() {
  try {
    console.log('🔄 Buscando usuários cadastrados...');
    
    // Buscar todos os usuários
    const snapshot = await db.collection(usersCollection).get();
    
    if (snapshot.empty) {
      console.log('ℹ️ Nenhum usuário encontrado na coleção');
      return;
    }
    
    console.log(`📊 Encontrados ${snapshot.size} usuários:\n`);
    
    // Listar cada usuário
    snapshot.forEach(doc => {
      const userData = doc.data();
      console.log(`👤 Usuário ID: ${doc.id}`);
      console.log(`   Nome: ${userData.nome}`);
      console.log(`   Email: ${userData.email}`);
      console.log(`   Data de criação: ${userData.dataCriacao}`);
      console.log(`   Ativo: ${userData.ativo ? 'Sim' : 'Não'}`);
      console.log('   ---');
    });
    
    console.log('\n💡 Para atribuir links a um usuário específico, use:');
    console.log('   npm run assign-userid-links <userId>');
    
  } catch (error) {
    console.error('❌ Erro:', error.message);
  } finally {
    process.exit(0);
  }
}

// Executar o script
listUsers(); 