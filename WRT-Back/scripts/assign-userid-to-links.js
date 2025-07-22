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
const linksCollection = 'links';

async function assignUserIdToLinks(targetUserId) {
  try {
    if (!targetUserId) {
      console.error('❌ Por favor, forneça um userId válido');
      console.log('Uso: node scripts/assign-userid-to-links.js <userId>');
      process.exit(1);
    }
    
    console.log(`🔄 Atribuindo userId "${targetUserId}" aos links...`);
    
    // Buscar todos os links existentes
    const snapshot = await db.collection(linksCollection).get();
    
    if (snapshot.empty) {
      console.log('ℹ️ Nenhum link encontrado na coleção');
      return;
    }
    
    console.log(`📊 Encontrados ${snapshot.size} links para processar`);
    
    let processedCount = 0;
    let updatedCount = 0;
    let errorCount = 0;
    
    // Processar cada link
    for (const doc of snapshot.docs) {
      try {
        const linkData = doc.data();
        processedCount++;
        
        // Verificar se já tem userId
        if (linkData.userId && linkData.userId !== 'default-user-id') {
          console.log(`✅ Link ${doc.id} já possui userId válido: ${linkData.userId}`);
          continue;
        }
        
        // Atualizar com o userId especificado
        await doc.ref.update({
          userId: targetUserId,
          dataModificacao: new Date().toISOString()
        });
        
        updatedCount++;
        console.log(`✅ Link ${doc.id} atualizado com userId: ${targetUserId}`);
        
      } catch (error) {
        errorCount++;
        console.error(`❌ Erro ao processar link ${doc.id}:`, error.message);
      }
    }
    
    console.log('\n📋 Resumo do processamento:');
    console.log(`   Total processado: ${processedCount}`);
    console.log(`   Links atualizados: ${updatedCount}`);
    console.log(`   Erros: ${errorCount}`);
    
  } catch (error) {
    console.error('❌ Erro geral:', error.message);
  } finally {
    process.exit(0);
  }
}

// Obter userId dos argumentos da linha de comando
const targetUserId = process.argv[2];

// Executar o script
assignUserIdToLinks(targetUserId); 