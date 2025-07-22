const fs = require('fs');
const path = require('path');

async function clearLocalData() {
  try {
    console.log('🧹 Limpando dados locais...');
    
    const dataFile = path.join(__dirname, '../data/links.json');
    
    if (fs.existsSync(dataFile)) {
      // Fazer backup do arquivo atual
      const backupFile = path.join(__dirname, '../data/links-backup.json');
      fs.copyFileSync(dataFile, backupFile);
      console.log(`📋 Backup criado: ${backupFile}`);
      
      // Limpar arquivo local
      const emptyData = {
        links: [],
        nextId: 1,
        lastUpdate: new Date().toISOString()
      };
      
      fs.writeFileSync(dataFile, JSON.stringify(emptyData, null, 2));
      console.log('✅ Arquivo local limpo com sucesso');
      console.log('📊 Dados locais: 0 links');
    } else {
      console.log('ℹ️ Arquivo local não encontrado, criando arquivo vazio');
      
      // Criar diretório se não existir
      const dataDir = path.dirname(dataFile);
      if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
      }
      
      // Criar arquivo vazio
      const emptyData = {
        links: [],
        nextId: 1,
        lastUpdate: new Date().toISOString()
      };
      
      fs.writeFileSync(dataFile, JSON.stringify(emptyData, null, 2));
      console.log('✅ Arquivo local criado com sucesso');
    }
    
    console.log('\n🎯 Próximos passos:');
    console.log('1. Reinicie o backend: npm run dev');
    console.log('2. O sistema irá carregar dados do Firebase automaticamente');
    console.log('3. Verifique os logs para confirmar a inicialização');
    
  } catch (error) {
    console.error('❌ Erro ao limpar dados locais:', error.message);
  }
}

clearLocalData(); 