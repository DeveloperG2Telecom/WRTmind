const { initializeFirebase, getFirestore } = require('../config/firebase');

async function migrateLinksToFirebase() {
  try {
    console.log('🔄 Iniciando migração dos links para Firebase...');
    
    // Para desenvolvimento, vamos usar dados em memória por enquanto
    console.log('ℹ️ Modo de desenvolvimento: usando dados em memória');
    console.log('ℹ️ Os links serão salvos no Firebase quando configurado corretamente');
    
    // Dados de exemplo que serão usados
    const linksMock = [
      {
        id: "1",
        nome: "Google",
        urlIcone: "https://www.google.com/favicon.ico",
        urlDestino: "https://www.google.com",
        posicao: 0,
        dataCriacao: new Date().toISOString(),
        dataModificacao: new Date().toISOString(),
        ativo: true
      },
      {
        id: "2",
        nome: "YouTube",
        urlIcone: "https://www.youtube.com/favicon.ico",
        urlDestino: "https://www.youtube.com",
        posicao: 1,
        dataCriacao: new Date().toISOString(),
        dataModificacao: new Date().toISOString(),
        ativo: true
      },
      {
        id: "3",
        nome: "GitHub",
        urlIcone: "https://github.com/favicon.ico",
        urlDestino: "https://github.com",
        posicao: 2,
        dataCriacao: new Date().toISOString(),
        dataModificacao: new Date().toISOString(),
        ativo: true
      }
    ];
    
    console.log(`📊 ${linksMock.length} links preparados para uso`);
    console.log('✅ Links configurados com sucesso!');
    
    console.log('\n📋 Próximos passos:');
    console.log('1. Teste a API de links: curl http://localhost:5000/api/links');
    console.log('2. Inicie o backend: npm run dev');
    console.log('3. Teste o frontend para confirmar que está funcionando');
    console.log('4. Para usar Firebase real, configure as credenciais de serviço');
    
    return linksMock;
    
  } catch (error) {
    console.error('❌ Erro durante a migração:', error.message);
    process.exit(1);
  }
}

// Executar migração se chamado diretamente
if (require.main === module) {
  migrateLinksToFirebase();
}

module.exports = migrateLinksToFirebase; 