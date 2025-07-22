const LinkPersistent = require('../models/LinkPersistent');
const LinkFirebase = require('../models/LinkFirebase');

// Array para armazenar logs de sincronização
let syncLogs = [];
const MAX_LOGS = 100; // Manter apenas os últimos 100 logs

// Variável para rastrear a última alteração confirmada no banco
let lastDatabaseChange = null;

// Cache para controlar frequência de requisições
let lastSyncTime = 0;
let lastFirebaseRead = 0;
let syncInProgress = false;
const MIN_SYNC_INTERVAL = 2000; // 2 segundos mínimo entre sincronizações manuais
const MIN_FIREBASE_READ_INTERVAL = 30000; // 30 segundos mínimo entre leituras do Firebase

// Função para adicionar log
function addSyncLog(type, message, details = {}) {
  const log = {
    id: Date.now().toString(),
    timestamp: new Date().toISOString(),
    type, // 'success', 'error', 'info', 'database_change'
    message,
    details
  };
  
  // Se for uma alteração confirmada no banco, registrar
  if (type === 'database_change') {
    lastDatabaseChange = {
      timestamp: log.timestamp,
      message: message,
      details: details
    };
    console.log(`🗄️ ALTERAÇÃO CONFIRMADA NO BANCO: ${message}`);
  }
  
  syncLogs.unshift(log); // Adicionar no início
  
  // Manter apenas os últimos MAX_LOGS
  if (syncLogs.length > MAX_LOGS) {
    syncLogs = syncLogs.slice(0, MAX_LOGS);
  }
  
  console.log(`[${log.timestamp}] ${type.toUpperCase()}: ${message}`);
}

// Função para buscar logs
function getSyncLogs() {
  return syncLogs;
}

// Função para obter a última alteração confirmada no banco
function getLastDatabaseChange() {
  return lastDatabaseChange;
}

// Função para limpar logs
function clearSyncLogs() {
  syncLogs = [];
  lastDatabaseChange = null;
  addSyncLog('info', 'Logs de sincronização limpos');
}

// Função para verificar se pode sincronizar
function canSync(localModel = null) {
  const now = Date.now();
  const timeSinceLastSync = now - lastSyncTime;
  
  if (syncInProgress) {
    addSyncLog('info', 'Sincronização já em andamento, ignorando nova requisição');
    return false;
  }
  
  // Se há pendências, permitir sincronização imediata
  let temPendencias = false;
  
  if (localModel) {
    // Usar a instância passada como parâmetro
    temPendencias = localModel.links && localModel.links.some(l => l && l.pendente);
  } else {
    // Fallback: criar instância temporária apenas para verificação
    const LinkPersistent = require('../models/LinkPersistent');
    const tempModel = new LinkPersistent(true);
    temPendencias = tempModel.links && tempModel.links.some(l => l && l.pendente);
  }
  
  if (temPendencias) {
    addSyncLog('info', 'Pendências detectadas, permitindo sincronização imediata');
    return true;
  }
  
  if (timeSinceLastSync < MIN_SYNC_INTERVAL) {
    const remainingTime = Math.ceil((MIN_SYNC_INTERVAL - timeSinceLastSync) / 1000);
    addSyncLog('info', `Sincronização muito recente, aguardando ${remainingTime}s`);
    return false;
  }
  
  return true;
}

// Função para verificar se pode ler do Firebase
function canReadFromFirebase() {
  const now = Date.now();
  const timeSinceLastRead = now - lastFirebaseRead;
  
  if (timeSinceLastRead < MIN_FIREBASE_READ_INTERVAL) {
    const remainingTime = Math.ceil((MIN_FIREBASE_READ_INTERVAL - timeSinceLastRead) / 1000);
    addSyncLog('info', `Leitura do Firebase muito recente, aguardando ${remainingTime}s`);
    return false;
  }
  
  return true;
}

// Inicialização: Puxar dados do Firebase para o local
async function initializeFromFirebase() {
  try {
    addSyncLog('info', 'Iniciando carregamento inicial do Firebase');
    
    const localModel = new LinkPersistent(false); // Não carregar dados automaticamente
    localModel.loadData(); // Carregar dados explicitamente
    
    // Tentar usar Firebase
    let firebaseModel;
    try {
      firebaseModel = new LinkFirebase();
    } catch (error) {
      addSyncLog('error', 'Firebase não disponível na inicialização', {
        error: error.message
      });
      return false;
    }

    // Buscar todos os dados do Firebase
    const firebaseLinks = await firebaseModel.buscarTodos();
    addSyncLog('info', `Firebase: ${firebaseLinks.length} links encontrados`);

    // Limpar dados locais existentes e carregar do Firebase
    localModel.links = [];
    localModel.nextId = 1;
    
    let carregados = 0;
    for (const fbLink of firebaseLinks) {
      try {
        // Criar link local com dados do Firebase
        await localModel.criar({
          id: fbLink.id,
          nome: fbLink.nome,
          urlIcone: fbLink.urlIcone,
          urlDestino: fbLink.urlDestino,
          posicao: fbLink.posicao,
          dataCriacao: fbLink.dataCriacao,
          dataModificacao: fbLink.dataModificacao
        });
        carregados++;
      } catch (error) {
        addSyncLog('error', `Erro ao carregar link ${fbLink.id}: ${error.message}`);
      }
    }
    
    // Salvar dados carregados
    localModel.saveData();
    
    if (carregados > 0) {
      addSyncLog('success', `Inicialização concluída: ${carregados} links carregados do Firebase`, {
        totalFirebase: firebaseLinks.length,
        totalLocal: carregados
      });
    } else {
      addSyncLog('info', 'Inicialização concluída: Nenhum link para carregar', {
        totalFirebase: firebaseLinks.length,
        totalLocal: 0
      });
    }

    return true;
  } catch (error) {
    addSyncLog('error', `Erro na inicialização do Firebase: ${error.message}`, {
      error: error.message,
      stack: error.stack
    });
    return false;
  }
}

// Sincronização: Firebase → Local (Firebase é a fonte primária)
async function syncFromFirebaseToLocal() {
  try {
    const localModel = new LinkPersistent(false); // Não carregar dados automaticamente
    localModel.loadData(); // Carregar dados explicitamente
    
    // Tentar usar Firebase
    let firebaseModel;
    try {
      firebaseModel = new LinkFirebase();
    } catch (error) {
      addSyncLog('info', 'Firebase não disponível, mantendo dados locais', {
        error: error.message
      });
      return false;
    }

    const firebaseLinks = await firebaseModel.buscarTodos();
    
    // Como o JSON local foi limpo, vamos carregar todos os dados do Firebase
    // O JSON local agora serve apenas como buffer temporário
    let carregados = 0;
    
    // Limpar dados locais existentes e carregar do Firebase
    localModel.links = [];
    localModel.nextId = 1;
    
    for (const fbLink of firebaseLinks) {
      try {
        // Criar link local com dados do Firebase SEM marcar como pendente
        const linkLocal = {
          id: fbLink.id,
          nome: fbLink.nome,
          urlIcone: fbLink.urlIcone,
          urlDestino: fbLink.urlDestino,
          posicao: fbLink.posicao,
          dataCriacao: fbLink.dataCriacao,
          dataModificacao: fbLink.dataModificacao,
          ativo: true,
          pendente: false // NÃO pendente quando carregado do Firebase
        };
        
        localModel.links.push(linkLocal);
        carregados++;
      } catch (error) {
        addSyncLog('error', `Erro ao carregar link ${fbLink.id}: ${error.message}`);
      }
    }
    
    // Salvar dados carregados
    localModel.saveData();
    
    if (carregados > 0) {
      addSyncLog('success', `Firebase → Local: ${carregados} links carregados do Firebase`, {
        carregados,
        totalFirebase: firebaseLinks.length,
        totalLocal: carregados
      });
    } else {
      addSyncLog('info', 'Firebase → Local: Nenhum link para carregar', {
        totalFirebase: firebaseLinks.length,
        totalLocal: 0
      });
    }

    return true;
  } catch (error) {
    addSyncLog('error', `Erro na sincronização Firebase → Local: ${error.message}`, {
      error: error.message,
      stack: error.stack
    });
    return false;
  }
}

// Sincronização: Local → Firebase (enviar pendências)
async function syncFromLocalToFirebase(localModel = null) {
  try {
    addSyncLog('info', 'Iniciando sincronização Local → Firebase');
    console.log('🔍 syncFromLocalToFirebase - Iniciando');
    
    // Se não foi passado um modelo, criar um novo
    if (!localModel) {
      console.log('🔍 syncFromLocalToFirebase - Criando nova instância do modelo');
      const LinkPersistent = require('../models/LinkPersistent');
      localModel = new LinkPersistent(true); // Carregar dados automaticamente
    } else {
      console.log('🔍 syncFromLocalToFirebase - Usando instância passada como parâmetro');
    }
    
    console.log(`🔍 syncFromLocalToFirebase - Total de links no modelo: ${localModel.links ? localModel.links.length : 0}`);
    
    // Verificar links pendentes
    const linksPendentes = localModel.links ? localModel.links.filter(l => l && l.pendente) : [];
    console.log(`🔍 syncFromLocalToFirebase - Links pendentes encontrados: ${linksPendentes.length}`);
    
    if (linksPendentes.length === 0) {
      console.log('🔍 syncFromLocalToFirebase - Nenhum link pendente, retornando');
      addSyncLog('info', 'Nenhum link pendente para sincronizar');
      return true;
    }
    
    console.log(`🔄 Sincronizando ${linksPendentes.length} links locais para Firebase...`);
    
    // Tentar usar Firebase
    let firebaseModel;
    try {
      firebaseModel = new LinkFirebase();
    } catch (error) {
      addSyncLog('error', 'Firebase não disponível para sincronização', {
        error: error.message
      });
      return false;
    }
    
    // 1. ENVIAR TODOS OS LINKS LOCAIS PARA FIREBASE
    let enviados = 0;
    let criados = 0;
    let atualizados = 0;
    let excluidos = 0;
    
    for (const localLink of linksPendentes) { // Iterar apenas os links pendentes
      try {
        if (localLink && localLink.ativo) {
          // Verificar se o link já existe no Firebase
          const existingLink = await firebaseModel.buscarPorId(localLink.id);
          
          if (existingLink) {
            // Atualizar link existente
            await firebaseModel.atualizar(localLink.id, localLink);
            atualizados++;
            addSyncLog('database_change', `Link "${localLink.nome}" ATUALIZADO no Firebase`, {
              id: localLink.id,
              nome: localLink.nome,
              operacao: 'atualizacao',
              timestamp: new Date().toISOString()
            });
            console.log(`✅ Link "${localLink.nome}" ATUALIZADO no Firebase`);
          } else {
            // Criar novo link
            await firebaseModel.criar(localLink);
            criados++;
            addSyncLog('database_change', `Link "${localLink.nome}" CRIADO no Firebase`, {
              id: localLink.id,
              nome: localLink.nome,
              operacao: 'criacao',
              timestamp: new Date().toISOString()
            });
            console.log(`✅ Link "${localLink.nome}" CRIADO no Firebase`);
          }
          enviados++;
        }
      } catch (error) {
        addSyncLog('error', `Erro ao sincronizar link ${localLink.id}: ${error.message}`);
      }
    }
    
    // 2. VERIFICAR EXCLUSÕES (links que existem no Firebase mas não no local)
    try {
      const firebaseLinks = await firebaseModel.buscarTodos();
      const localIds = localModel.links.map(l => l.id);
      
      for (const fbLink of firebaseLinks) {
        if (!localIds.includes(fbLink.id)) {
          // Link existe no Firebase mas não no local = foi excluído
          await firebaseModel.excluir(fbLink.id);
          excluidos++;
          addSyncLog('database_change', `Link "${fbLink.nome}" EXCLUÍDO do Firebase`, {
            id: fbLink.id,
            nome: fbLink.nome,
            operacao: 'exclusao',
            timestamp: new Date().toISOString()
          });
          console.log(`🗑️ Link "${fbLink.nome}" EXCLUÍDO do Firebase`);
        }
      }
    } catch (error) {
      addSyncLog('warning', `Erro ao verificar exclusões: ${error.message}`);
    }
    
    // 3. REMOVER FLAG PENDENTE dos links sincronizados
    // O JSON local mantém os links mas sem flag pendente
    console.log('🔍 syncFromLocalToFirebase - Removendo flags pendente...');
    let flagsRemovidas = 0;
    for (const link of localModel.links) {
      if (link && link.pendente) {
        link.pendente = false; // Remover flag pendente após sincronização
        flagsRemovidas++;
        console.log(`🔍 syncFromLocalToFirebase - Flag pendente removida do link: ${link.nome}`);
      }
    }
    console.log(`🔍 syncFromLocalToFirebase - Total de flags removidas: ${flagsRemovidas}`);
    localModel.saveData(); // Salvar alterações
    console.log('🔍 syncFromLocalToFirebase - Dados salvos no arquivo');
    
    // Registrar resumo das alterações no banco
    if (criados > 0 || atualizados > 0 || excluidos > 0) {
      addSyncLog('database_change', `ALTERAÇÕES CONFIRMADAS NO BANCO: ${criados} criados, ${atualizados} atualizados, ${excluidos} excluídos`, {
        criados,
        atualizados,
        excluidos,
        total: criados + atualizados + excluidos,
        timestamp: new Date().toISOString()
      });
    }
    
    addSyncLog('success', `Sincronização Local → Firebase concluída: ${enviados} links processados, flags pendente removidas`, {
      enviados,
      criados,
      atualizados,
      excluidos,
      totalLocal: localModel.links.length
    });
    
    console.log(`✅ Sincronização Local → Firebase concluída. ${enviados} links processados.`);
    console.log(`📊 Resumo: ${criados} criados, ${atualizados} atualizados, ${excluidos} excluídos`);
    console.log(`🧹 Flags pendente removidas dos links sincronizados`);
    
    return true;
  } catch (error) {
    addSyncLog('error', `Erro na sincronização Local → Firebase: ${error.message}`);
    console.error('❌ Erro na sincronização Local → Firebase:', error);
    return false;
  }
}

// clearFirebaseAfterSync não será mais chamado no fluxo principal

// Sincronização bidirecional com cache
async function syncBidirectional(localModel = null) {
  try {
    // Verificar se pode sincronizar
    if (!canSync(localModel)) {
      return; // Retorna silenciosamente
    }
    
    syncInProgress = true;
    lastSyncTime = Date.now();
    
    addSyncLog('info', 'Iniciando sincronização bidirecional');
    
    // 1. PRIMEIRO: Enviar dados locais para Firebase e limpar JSON local
    const localSuccess = await syncFromLocalToFirebase(localModel);
    
    if (!localSuccess) {
      addSyncLog('error', 'Falha na sincronização Local → Firebase');
      return;
    }
    
    // 2. NÃO recarregar dados do Firebase - o JSON local serve apenas como buffer
    // Os dados serão carregados do Firebase apenas quando necessário (próxima operação)
    addSyncLog('success', 'Sincronização Local → Firebase concluída, JSON local mantido como buffer');
    
  } catch (error) {
    addSyncLog('error', `Erro na sincronização bidirecional: ${error.message}`);
    console.error('❌ Erro na sincronização bidirecional:', error);
  } finally {
    syncInProgress = false;
  }
}

// Inicialização do sistema
async function initializeSystem() {
  addSyncLog('info', 'Iniciando sistema de sincronização');
  
  // PRIMEIRO: Verificar e criar coleção no Firebase se necessário
  try {
    addSyncLog('info', 'Verificando coleção "links" no Firebase...');
    
    const firebaseModel = new LinkFirebase();
    const colecaoExiste = await firebaseModel.ensureCollection();
    
    if (colecaoExiste) {
      addSyncLog('success', 'Coleção "links" verificada no Firebase');
    } else {
      addSyncLog('info', 'Coleção "links" não encontrada, será criada automaticamente');
    }
    
    // Tentar inicializar a coleção (cria se não existir)
    try {
      const linksIniciais = await firebaseModel.initializeCollection();
      addSyncLog('success', `Coleção "links" inicializada com ${linksIniciais} links`);
    } catch (error) {
      addSyncLog('warning', `Não foi possível inicializar coleção: ${error.message}`);
    }
    
  } catch (error) {
    addSyncLog('error', `Erro ao verificar/criar coleção Firebase: ${error.message}`, {
      error: error.message
    });
    // Continuar mesmo se Firebase não estiver disponível
  }
  
  // SEGUNDO: Carregar dados do Firebase para local
  const success = await initializeFromFirebase();
  
  if (success) {
    addSyncLog('success', 'Sistema inicializado com dados do Firebase');
  } else {
    addSyncLog('warning', 'Sistema inicializado com dados locais (Firebase indisponível)');
  }
  
  return success;
}

// Iniciar sincronização periódica
function startPeriodicSync(intervalMs = 300000) { // 5 minutos padrão (era 1 minuto)
  addSyncLog('info', `Sincronização periódica ativada a cada ${intervalMs / 1000} segundos`);
  setInterval(syncBidirectional, intervalMs);
  console.log(`⏰ Sincronização periódica ativada a cada ${intervalMs / 1000} segundos.`);
}

// Sincronização manual
async function manualSync(localModel = null) {
  try {
    console.log('🔍 manualSync - Iniciando');
    
    // Verificar se pode sincronizar
    if (!canSync(localModel)) {
      console.log('🔍 manualSync - Sincronização bloqueada por cache');
      return; // Retorna silenciosamente sem erro
    }
    
    syncInProgress = true;
    lastSyncTime = Date.now();
    
    addSyncLog('info', 'Sincronização manual iniciada');
    
    console.log('🔍 manualSync - Chamando syncBidirectional');
    await syncBidirectional(localModel);
    console.log('🔍 manualSync - syncBidirectional concluído');
    
    addSyncLog('success', 'Sincronização manual concluída');
    console.log('✅ manualSync - Concluído com sucesso');
  } catch (error) {
    console.error('❌ manualSync - Erro:', error);
    console.error('❌ manualSync - Stack trace:', error.stack);
    addSyncLog('error', `Erro na sincronização manual: ${error.message}`);
    throw error; // Re-throw para que a rota possa capturar
  } finally {
    syncInProgress = false;
  }
}

module.exports = {
  initializeSystem,
  initializeFromFirebase,
  syncFromFirebaseToLocal,
  syncFromLocalToFirebase,
  syncBidirectional,
  startPeriodicSync,
  manualSync,
  getSyncLogs,
  clearSyncLogs,
  addSyncLog,
  getLastDatabaseChange
};