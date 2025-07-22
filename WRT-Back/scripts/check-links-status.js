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

async function checkLinksStatus() {
  try {
    console.log('🔄 Verificando status dos links...');
    
    // Buscar todos os links
    const snapshot = await db.collection(linksCollection).get();
    
    if (snapshot.empty) {
      console.log('ℹ️ Nenhum link encontrado na coleção');
      return;
    }
    
    console.log(`📊 Encontrados ${snapshot.size} links:\n`);
    
    let withUserId = 0;
    let withoutUserId = 0;
    let activeLinks = 0;
    let inactiveLinks = 0;
    
    // Analisar cada link
    snapshot.forEach(doc => {
      const linkData = doc.data();
      
      if (linkData.userId) {
        withUserId++;
        console.log(`✅ Link ${doc.id}: ${linkData.nome} (userId: ${linkData.userId})`);
      } else {
        withoutUserId++;
        console.log(`❌ Link ${doc.id}: ${linkData.nome} (SEM userId)`);
      }
      
      if (linkData.ativo !== false) {
        activeLinks++;
      } else {
        inactiveLinks++;
      }
    });
    
    console.log('\n📋 Resumo:');
    console.log(`   Links com userId: ${withUserId}`);
    console.log(`   Links sem userId: ${withoutUserId}`);
    console.log(`   Links ativos: ${activeLinks}`);
    console.log(`   Links inativos: ${inactiveLinks}`);
    
    if (withoutUserId > 0) {
      console.log('\n⚠️ Links sem userId encontrados!');
      console.log('   Execute: npm run add-userid-links');
      console.log('   Depois: npm run assign-userid-links <userId>');
    }
    
  } catch (error) {
    console.error('❌ Erro:', error.message);
  } finally {
    process.exit(0);
  }
}

// Executar o script
checkLinksStatus(); 