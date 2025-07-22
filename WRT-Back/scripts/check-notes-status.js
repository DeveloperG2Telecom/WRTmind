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

async function checkNotesStatus() {
  try {
    console.log('🔄 Verificando status das notas no banco de dados...');
    
    // Buscar todas as notas
    const snapshot = await db.collection(notesCollection).get();
    
    if (snapshot.empty) {
      console.log('ℹ️ Nenhuma nota encontrada na coleção');
      return;
    }
    
    console.log(`📊 Total de notas encontradas: ${snapshot.size}`);
    
    let withUserId = 0;
    let withoutUserId = 0;
    let activeNotes = 0;
    let inactiveNotes = 0;
    let favoritedNotes = 0;
    let pinnedNotes = 0;
    let defaultUserIdNotes = 0;
    const userIds = new Set();
    
    // Analisar cada nota
    snapshot.docs.forEach(doc => {
      const noteData = doc.data();
      
      // Contar por status ativo/inativo
      if (noteData.ativo === false) {
        inactiveNotes++;
      } else {
        activeNotes++;
      }
      
      // Contar por userId
      if (noteData.userId) {
        withUserId++;
        userIds.add(noteData.userId);
        
        if (noteData.userId === 'default-user-id') {
          defaultUserIdNotes++;
        }
      } else {
        withoutUserId++;
      }
      
      // Contar favoritas e fixadas
      if (noteData.favorito) {
        favoritedNotes++;
      }
      if (noteData.fixado) {
        pinnedNotes++;
      }
    });
    
    console.log('\n📋 Status das Notas:');
    console.log(`   Notas com userId: ${withUserId}`);
    console.log(`   Notas sem userId: ${withoutUserId}`);
    console.log(`   Notas ativas: ${activeNotes}`);
    console.log(`   Notas inativas: ${inactiveNotes}`);
    console.log(`   Notas favoritas: ${favoritedNotes}`);
    console.log(`   Notas fixadas: ${pinnedNotes}`);
    console.log(`   Notas com userId padrão: ${defaultUserIdNotes}`);
    
    if (userIds.size > 0) {
      console.log(`\n👥 Usuários únicos encontrados: ${userIds.size}`);
      console.log('   IDs dos usuários:');
      Array.from(userIds).forEach(userId => {
        console.log(`   - ${userId}`);
      });
    }
    
    if (withoutUserId > 0) {
      console.log('\n⚠️ ATENÇÃO:');
      console.log(`   ${withoutUserId} notas não possuem userId`);
      console.log('   Execute: npm run add-userid-notes');
    }
    
    if (defaultUserIdNotes > 0) {
      console.log('\n⚠️ ATENÇÃO:');
      console.log(`   ${defaultUserIdNotes} notas possuem userId padrão`);
      console.log('   Execute: npm run assign-userid-notes <userId>');
    }
    
  } catch (error) {
    console.error('❌ Erro ao verificar status:', error.message);
  } finally {
    process.exit(0);
  }
}

// Executar o script
checkNotesStatus(); 