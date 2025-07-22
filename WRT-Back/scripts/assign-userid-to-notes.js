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

async function assignUserIdToNotes(targetUserId) {
  try {
    if (!targetUserId) {
      console.error('❌ Erro: userId de destino não fornecido');
      console.log('Uso: node scripts/assign-userid-to-notes.js <userId>');
      process.exit(1);
    }
    
    console.log(`🔄 Iniciando processo de atribuição do userId ${targetUserId} às notas...`);
    
    // Buscar notas que não têm userId ou têm o userId padrão
    const snapshot = await db.collection(notesCollection)
      .where('userId', 'in', [null, 'default-user-id'])
      .get();
    
    if (snapshot.empty) {
      console.log('ℹ️ Nenhuma nota encontrada sem userId ou com userId padrão');
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
        
        await doc.ref.update({
          userId: targetUserId,
          favorito: noteData.favorito || false,
          fixado: noteData.fixado || false,
          ordenacao: noteData.ordenacao || 0,
          dataModificacao: new Date().toISOString()
        });
        
        updatedCount++;
        console.log(`✅ Nota ${doc.id} atribuída ao usuário ${targetUserId}`);
        
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
      console.log(`\n✅ ${updatedCount} notas foram atribuídas ao usuário ${targetUserId}`);
    }
    
  } catch (error) {
    console.error('❌ Erro geral:', error.message);
  } finally {
    process.exit(0);
  }
}

// Obter userId de destino dos argumentos da linha de comando
const targetUserId = process.argv[2];

// Executar o script
assignUserIdToNotes(targetUserId); 