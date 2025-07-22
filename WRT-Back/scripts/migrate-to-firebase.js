require('dotenv').config();
const mongoose = require('mongoose');
const { initializeFirebase, getFirestore } = require('../config/firebase');

// Modelo MongoDB (temporário para migração)
const NotaMongo = mongoose.model('Nota', new mongoose.Schema({
  titulo: String,
  conteudo: String,
  topico: String,
  dataCriacao: Date,
  dataModificacao: Date,
  ativo: Boolean
}, { collection: 'notas' }));

async function migrateToFirebase() {
  try {
    console.log('🔄 Iniciando migração do MongoDB para Firebase...');
    
    // Conectar ao MongoDB
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/wrtmind';
    await mongoose.connect(mongoURI);
    console.log('✅ Conectado ao MongoDB');
    
    // Inicializar Firebase
    initializeFirebase();
    const db = getFirestore();
    console.log('✅ Conectado ao Firebase');
    
    // Buscar todas as notas do MongoDB
    const notasMongo = await NotaMongo.find({});
    console.log(`📊 Encontradas ${notasMongo.length} notas no MongoDB`);
    
    if (notasMongo.length === 0) {
      console.log('ℹ️ Nenhuma nota encontrada para migrar');
      return;
    }
    
    // Migrar cada nota
    let migrated = 0;
    let errors = 0;
    
    for (const nota of notasMongo) {
      try {
        // Converter para formato do Firestore
        const notaFirebase = {
          titulo: nota.titulo,
          conteudo: nota.conteudo,
          topico: nota.topico,
          dataCriacao: nota.dataCriacao || new Date(),
          dataModificacao: nota.dataModificacao || new Date(),
          ativo: nota.ativo !== undefined ? nota.ativo : true
        };
        
        // Adicionar ao Firestore
        await db.collection('notas').add(notaFirebase);
        migrated++;
        
        if (migrated % 10 === 0) {
          console.log(`📝 Migradas ${migrated} notas...`);
        }
      } catch (error) {
        console.error(`❌ Erro ao migrar nota ${nota._id}:`, error.message);
        errors++;
      }
    }
    
    console.log('\n🎉 Migração concluída!');
    console.log(`✅ Notas migradas: ${migrated}`);
    console.log(`❌ Erros: ${errors}`);
    
    if (errors > 0) {
      console.log('\n⚠️ Algumas notas não puderam ser migradas. Verifique os erros acima.');
    }
    
  } catch (error) {
    console.error('❌ Erro durante a migração:', error);
  } finally {
    // Fechar conexões
    await mongoose.disconnect();
    console.log('🔌 Conexões fechadas');
    process.exit(0);
  }
}

// Executar migração se o script for chamado diretamente
if (require.main === module) {
  migrateToFirebase();
}

module.exports = migrateToFirebase; 