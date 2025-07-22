const express = require('express');
const router = express.Router();
const LinkFirebase = require('../models/LinkFirebase');
const LinkPersistent = require('../models/LinkPersistent');

// Instância do modelo Firebase
const linkModel = new LinkFirebase();

// Garantir que a coleção existe
async function ensureCollection() {
  try {
    await linkModel.ensureCollection();
  } catch (error) {
    console.error('Erro ao garantir coleção:', error.message);
  }
}

// Inicializar coleção na primeira requisição
let initialized = false;
async function initializeIfNeeded() {
  if (!initialized) {
    await ensureCollection();
    initialized = true;
  }
}

// GET /api/links - Buscar todos os links do usuário
router.get('/', async (req, res) => {
  try {
    await initializeIfNeeded();
    const userId = req.headers['user-id'];
    
    if (!userId) {
      return res.status(401).json({ error: 'ID do usuário não fornecido' });
    }
    
    const links = await linkModel.buscarTodosPorUsuario(userId);
    res.json({ links });
  } catch (error) {
    console.error('Erro ao buscar links:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// GET /api/links/pendencias - Verificar se há pendências (sempre false agora)
router.get('/pendencias', async (req, res) => {
  res.json({ 
    temPendencias: false,
    quantidade: 0 
  });
});

// PUT /api/links/posicoes - Atualizar posições
router.put('/posicoes', async (req, res) => {
  try {
    await initializeIfNeeded();
    
    const userId = req.headers['user-id'];
    if (!userId) {
      return res.status(401).json({ error: 'ID do usuário não fornecido' });
    }
    
    const { posicoes } = req.body;
    if (!Array.isArray(posicoes)) {
      return res.status(400).json({ error: 'Posições devem ser um array' });
    }

    // Validar estrutura dos dados de posição
    for (const item of posicoes) {
      if (!item.id || typeof item.posicao !== 'number' || item.posicao < 0) {
        return res.status(400).json({ 
          error: 'Cada item deve ter id (string) e posicao (número não negativo)' 
        });
      }
    }

    await linkModel.atualizarPosicoes(posicoes, userId);
    res.json({ message: 'Posições atualizadas com sucesso' });
  } catch (error) {
    console.error('Erro ao atualizar posições:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// GET /api/links/:id - Buscar link por ID
router.get('/:id', async (req, res) => {
  try {
    await initializeIfNeeded();
    const userId = req.headers['user-id'];
    
    if (!userId) {
      return res.status(401).json({ error: 'ID do usuário não fornecido' });
    }
    
    const link = await linkModel.buscarPorId(req.params.id, userId);
    if (!link) {
      return res.status(404).json({ error: 'Link não encontrado' });
    }
    res.json({ link });
  } catch (error) {
    console.error('Erro ao buscar link:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// POST /api/links - Criar novo link
router.post('/', async (req, res) => {
  try {
    await initializeIfNeeded();
    
    const userId = req.headers['user-id'];
    if (!userId) {
      return res.status(401).json({ error: 'ID do usuário não fornecido' });
    }
    
    const { nome, urlIcone, urlDestino, posicao } = req.body;

    // Validar dados
    const erros = LinkPersistent.validarDados({ nome, urlIcone, urlDestino, posicao });
    if (erros.length > 0) {
      return res.status(400).json({ 
        error: 'Dados inválidos', 
        details: erros 
      });
    }

    const novoLink = await linkModel.criar({ 
      nome, 
      urlIcone, 
      urlDestino, 
      posicao, 
      userId 
    });
    res.status(201).json({ link: novoLink });
  } catch (error) {
    console.error('Erro ao criar link:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// PUT /api/links/:id - Atualizar link
router.put('/:id', async (req, res) => {
  try {
    await initializeIfNeeded();
    
    const userId = req.headers['user-id'];
    if (!userId) {
      return res.status(401).json({ error: 'ID do usuário não fornecido' });
    }
    
    const { nome, urlIcone, urlDestino, posicao } = req.body;

    // Validar dados
    const erros = LinkPersistent.validarDados({ nome, urlIcone, urlDestino, posicao });
    if (erros.length > 0) {
      return res.status(400).json({ 
        error: 'Dados inválidos', 
        details: erros 
      });
    }

    const linkAtualizado = await linkModel.atualizar(req.params.id, { 
      nome, urlIcone, urlDestino, posicao 
    }, userId);
    res.json({ link: linkAtualizado });
  } catch (error) {
    console.error('Erro ao atualizar link:', error);
    if (error.message.includes('não encontrado') || error.message.includes('não autorizado')) {
      return res.status(404).json({ error: 'Link não encontrado' });
    }
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// DELETE /api/links/:id - Excluir link
router.delete('/:id', async (req, res) => {
  try {
    await initializeIfNeeded();
    const userId = req.headers['user-id'];
    
    if (!userId) {
      return res.status(401).json({ error: 'ID do usuário não fornecido' });
    }
    
    await linkModel.excluir(req.params.id, userId);
    res.json({ message: 'Link excluído com sucesso' });
  } catch (error) {
    console.error('Erro ao excluir link:', error);
    if (error.message.includes('não encontrado') || error.message.includes('não autorizado')) {
      return res.status(404).json({ error: 'Link não encontrado' });
    }
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// POST /api/links/sincronizar-manual - Sincronização manual (sempre sucesso agora)
router.post('/sincronizar-manual', async (req, res) => {
  try {
    await initializeIfNeeded();
    const userId = req.headers['user-id'];
    
    if (!userId) {
      return res.status(401).json({ error: 'ID do usuário não fornecido' });
    }
    
    const links = await linkModel.buscarTodosPorUsuario(userId);
    
    res.json({
      success: true,
      message: 'Sincronização concluída com sucesso',
      links: links,
      total: links.length,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Erro na sincronização manual:', error);
    res.status(500).json({ 
      error: 'Erro na sincronização',
      details: error.message 
    });
  }
});

module.exports = router; 