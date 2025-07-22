const express = require('express');
const router = express.Router();

// GET /api/sync/status - Status de sincronização (sempre ok)
router.get('/status', async (req, res) => {
  try {
    res.json({
      status: 'active',
      lastSync: {
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        type: 'success',
        message: 'Sistema funcionando normalmente',
        details: {}
      },
      lastDatabaseChange: {
        timestamp: new Date().toISOString(),
        message: 'Sistema operacional',
        details: {}
      },
      stats: {
        total: 1,
        errors: 0,
        success: 1,
        databaseChanges: 0,
        info: 0
      }
    });
  } catch (error) {
    console.error('Erro ao buscar status:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// GET /api/sync/logs - Logs de sincronização (sempre vazio)
router.get('/logs', async (req, res) => {
  try {
    res.json({
      logs: [],
      total: 0
    });
  } catch (error) {
    console.error('Erro ao buscar logs:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// POST /api/sync/limpar-logs - Limpar logs (sempre sucesso)
router.post('/limpar-logs', async (req, res) => {
  try {
    res.json({
      success: true,
      message: 'Logs limpos com sucesso'
    });
  } catch (error) {
    console.error('Erro ao limpar logs:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// GET /api/sync/last-database-change - Última alteração no banco
router.get('/last-database-change', async (req, res) => {
  try {
    res.json({
      success: true,
      lastDatabaseChange: {
        timestamp: new Date().toISOString(),
        message: 'Sistema operacional',
        details: {}
      },
      message: 'Sistema funcionando normalmente'
    });
  } catch (error) {
    console.error('Erro ao buscar última alteração:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

module.exports = router; 