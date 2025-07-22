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

async function addUserIdToNotes() {
  try {
    console.log('🔄 Iniciando processo de adição do campo userId às notas...');
    
    // Buscar todas as notas existentes
    const snapshot = await db.collection(notesCollection).get();
    
    if (snapshot.empty) {
      console.log('ℹ️ Nenhuma nota encontrada na coleção');
      return;
    }
    
    console.log(`📊 Encontradas ${snapshot.size} notas para processar`);
    
    let processedCount = 0;
    let updatedCount = 0;
    let errorCount = 0;
    
    // Processar cada nota
    for (const doc of snapshot.docs) {
      try {
        const noteData = doc.data();
        processedCount++;
        
        // Verificar se já tem userId
        if (noteData.userId) {
          console.log(`✅ Nota ${doc.id} já possui userId: ${noteData.userId}`);
          continue;
        }
        
        // Se não tem userId, adicionar um userId padrão
        const defaultUserId = 'default-user-id';
        
        await doc.ref.update({
          userId: defaultUserId,
          favorito: noteData.favorito || false,
          fixado: noteData.fixado || false,
          ordenacao: noteData.ordenacao || 0,
          dataModificacao: new Date().toISOString()
        });
        
        updatedCount++;
        console.log(`✅ Nota ${doc.id} atualizada com userId: ${defaultUserId}`);
        
      } catch (error) {
        errorCount++;
        console.error(`❌ Erro ao processar nota ${doc.id}:`, error.message);
      }
    }
    
    console.log('\n📋 Resumo do processamento:');
    console.log(`   Total processado: ${processedCount}`);
    console.log(`   Notas atualizadas: ${updatedCount}`);
    console.log(`   Erros: ${errorCount}`);
    
    if (updatedCount > 0) {
      console.log('\n⚠️ IMPORTANTE:');
      console.log('   As notas existentes foram atualizadas com um userId padrão.');
      console.log('   Você deve revisar e atualizar manualmente o userId de cada nota');
      console.log('   para o ID correto do usuário proprietário.');
    }
    
  } catch (error) {
    console.error('❌ Erro geral:', error.message);
  } finally {
    process.exit(0);
  }
}

// Executar o script
addUserIdToNotes(); 