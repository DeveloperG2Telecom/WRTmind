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

async function addUserIdToLinks() {
  try {
    console.log('🔄 Iniciando processo de adição do campo userId aos links...');
    
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
        if (linkData.userId) {
          console.log(`✅ Link ${doc.id} já possui userId: ${linkData.userId}`);
          continue;
        }
        
        // Se não tem userId, adicionar um userId padrão (você pode ajustar conforme necessário)
        // Por enquanto, vou usar um ID padrão para todos os links existentes
        const defaultUserId = 'default-user-id';
        
        await doc.ref.update({
          userId: defaultUserId,
          dataModificacao: new Date().toISOString()
        });
        
        updatedCount++;
        console.log(`✅ Link ${doc.id} atualizado com userId: ${defaultUserId}`);
        
      } catch (error) {
        errorCount++;
        console.error(`❌ Erro ao processar link ${doc.id}:`, error.message);
      }
    }
    
    console.log('\n📋 Resumo do processamento:');
    console.log(`   Total processado: ${processedCount}`);
    console.log(`   Links atualizados: ${updatedCount}`);
    console.log(`   Erros: ${errorCount}`);
    
    if (updatedCount > 0) {
      console.log('\n⚠️ IMPORTANTE:');
      console.log('   Os links existentes foram atualizados com um userId padrão.');
      console.log('   Você deve revisar e atualizar manualmente o userId de cada link');
      console.log('   para o ID correto do usuário proprietário.');
    }
    
  } catch (error) {
    console.error('❌ Erro geral:', error.message);
  } finally {
    process.exit(0);
  }
}

// Executar o script
addUserIdToLinks(); 