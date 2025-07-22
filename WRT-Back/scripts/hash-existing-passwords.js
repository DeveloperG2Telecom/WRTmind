const admin = require('firebase-admin');
const bcrypt = require('bcryptjs');
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

async function hashExistingPasswords() {
  try {
    console.log('🔄 Iniciando processo de hash das senhas existentes...');
    
    // Buscar todos os usuários
    const snapshot = await db.collection(usersCollection).get();
    
    if (snapshot.empty) {
      console.log('ℹ️ Nenhum usuário encontrado na coleção');
      return;
    }
    
    console.log(`📊 Encontrados ${snapshot.size} usuários para processar`);
    
    let processedCount = 0;
    let updatedCount = 0;
    let errorCount = 0;
    let alreadyHashedCount = 0;
    
    // Processar cada usuário
    for (const doc of snapshot.docs) {
      try {
        const userData = doc.data();
        processedCount++;
        
        // Verificar se a senha já está hasheada (bcrypt gera strings de 60 caracteres)
        if (userData.senha && userData.senha.length === 60 && userData.senha.startsWith('$2')) {
          console.log(`✅ Usuário ${doc.id} já possui senha hasheada`);
          alreadyHashedCount++;
          continue;
        }
        
        // Se não tem senha, pular
        if (!userData.senha) {
          console.log(`⚠️ Usuário ${doc.id} não possui senha`);
          continue;
        }
        
        // Hash da senha
        const saltRounds = 12;
        const senhaHash = await bcrypt.hash(userData.senha, saltRounds);
        
        await doc.ref.update({
          senha: senhaHash,
          dataModificacao: new Date().toISOString()
        });
        
        updatedCount++;
        console.log(`✅ Senha do usuário ${doc.id} hasheada com sucesso`);
        
      } catch (error) {
        errorCount++;
        console.error(`❌ Erro ao processar usuário ${doc.id}:`, error.message);
      }
    }
    
    console.log('\n📋 Resumo do processamento:');
    console.log(`   Total processado: ${processedCount}`);
    console.log(`   Senhas hasheadas: ${updatedCount}`);
    console.log(`   Já hasheadas: ${alreadyHashedCount}`);
    console.log(`   Erros: ${errorCount}`);
    
    if (updatedCount > 0) {
      console.log('\n✅ Processo de hash concluído com sucesso!');
      console.log('   As senhas agora estão seguras no banco de dados.');
    }
    
  } catch (error) {
    console.error('❌ Erro geral:', error.message);
  } finally {
    process.exit(0);
  }
}

// Executar o script
hashExistingPasswords(); 