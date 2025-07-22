const express = require('express');
const { body, validationResult } = require('express-validator');
const NotaFirebase = require('../models/NotaFirebase');

const router = express.Router();
const notaModel = new NotaFirebase();

// Middleware de validação
const validateNota = [
  body('titulo')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Título deve ter entre 1 e 100 caracteres'),
  body('conteudo')
    .trim()
    .isLength({ min: 1 })
    .withMessage('Conteúdo é obrigatório'),
  body('topico')
    .optional()
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('Tópico deve ter entre 1 e 50 caracteres')
];

// GET /api/notas - Listar todas as notas do usuário
router.get('/', async (req, res) => {
  try {
    const userId = req.headers['user-id'];
    if (!userId) {
      return res.status(401).json({ error: 'ID do usuário não fornecido' });
    }
    
    const { topico, ativo, limit = 50, page = 1 } = req.query;
    
    // Construir filtros
    const filtros = {};
    if (topico) filtros.topico = topico;
    if (ativo !== undefined) filtros.ativo = ativo === 'true';
    
    const notas = await notaModel.buscarTodasPorUsuario(userId, filtros);
    const total = await notaModel.contarPorUsuario(userId, filtros);
    
    // Aplicar paginação manual
    const offset = (parseInt(page) - 1) * parseInt(limit);
    const notasPaginadas = notas.slice(offset, offset + parseInt(limit));
    
    res.json({
      notas: notasPaginadas,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Erro ao buscar notas:', error);
    res.status(500).json({ error: 'Erro ao buscar notas' });
  }
});

// GET /api/notas/topicos - Listar todos os tópicos do usuário
router.get('/topicos', async (req, res) => {
  try {
    const userId = req.headers['user-id'];
    if (!userId) {
      return res.status(401).json({ error: 'ID do usuário não fornecido' });
    }
    
    const topicos = await notaModel.buscarTopicos(userId);
    res.json({ topicos });
  } catch (error) {
    console.error('Erro ao buscar tópicos:', error);
    res.status(500).json({ error: 'Erro ao buscar tópicos' });
  }
});

// GET /api/notas/:id - Buscar nota por ID
router.get('/:id', async (req, res) => {
  try {
    const userId = req.headers['user-id'];
    if (!userId) {
      return res.status(401).json({ error: 'ID do usuário não fornecido' });
    }
    
    const nota = await notaModel.buscarPorId(req.params.id, userId);
    
    if (!nota) {
      return res.status(404).json({ error: 'Nota não encontrada' });
    }
    
    res.json({ nota });
  } catch (error) {
    console.error('Erro ao buscar nota:', error);
    res.status(500).json({ error: 'Erro ao buscar nota' });
  }
});

// POST /api/notas - Criar nova nota
router.post('/', validateNota, async (req, res) => {
  try {
    console.log('📝 Recebendo requisição POST para criar nota');
    console.log('📝 Body da requisição:', req.body);
    
    const userId = req.headers['user-id'];
    if (!userId) {
      return res.status(401).json({ error: 'ID do usuário não fornecido' });
    }
    
    // Verificar erros de validação
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('❌ Erros de validação:', errors.array());
      return res.status(400).json({ 
        error: 'Dados inválidos',
        details: errors.array()
      });
    }
    
    const { titulo, conteudo, topico } = req.body;
    console.log('📝 Dados extraídos:', { titulo, conteudo, topico });
    
    const notaSalva = await notaModel.criar({
      titulo,
      conteudo,
      topico: topico || 'Geral', // Usar 'Geral' como padrão se não fornecido
      userId
    });
    
    console.log('✅ Nota criada com sucesso:', notaSalva);
    
    res.status(201).json({ 
      message: 'Nota criada com sucesso',
      nota: notaSalva
    });
  } catch (error) {
    console.error('❌ Erro ao criar nota:', error);
    res.status(500).json({ error: 'Erro interno do servidor', message: error.message });
  }
});

// PUT /api/notas/:id - Atualizar nota
router.put('/:id', validateNota, async (req, res) => {
  try {
    const userId = req.headers['user-id'];
    if (!userId) {
      return res.status(401).json({ error: 'ID do usuário não fornecido' });
    }
    
    // Verificar erros de validação
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        error: 'Dados inválidos',
        details: errors.array()
      });
    }
    
    const { titulo, conteudo, topico } = req.body;
    
    const notaAtualizada = await notaModel.atualizar(req.params.id, {
      titulo,
      conteudo,
      topico: topico || 'Geral' // Usar 'Geral' como padrão se não fornecido
    }, userId);
    
    if (!notaAtualizada) {
      return res.status(404).json({ error: 'Nota não encontrada' });
    }
    
    res.json({ 
      message: 'Nota atualizada com sucesso',
      nota: notaAtualizada
    });
  } catch (error) {
    console.error('Erro ao atualizar nota:', error);
    if (error.message.includes('não encontrada') || error.message.includes('não autorizada')) {
      return res.status(404).json({ error: 'Nota não encontrada' });
    }
    res.status(500).json({ error: 'Erro ao atualizar nota' });
  }
});

// DELETE /api/notas/:id - Deletar nota (soft delete)
router.delete('/:id', async (req, res) => {
  try {
    const userId = req.headers['user-id'];
    if (!userId) {
      return res.status(401).json({ error: 'ID do usuário não fornecido' });
    }
    
    await notaModel.excluir(req.params.id, userId);
    
    res.json({ 
      message: 'Nota deletada com sucesso'
    });
  } catch (error) {
    console.error('Erro ao deletar nota:', error);
    if (error.message.includes('não encontrada') || error.message.includes('não autorizada')) {
      return res.status(404).json({ error: 'Nota não encontrada' });
    }
    res.status(500).json({ error: 'Erro ao deletar nota' });
  }
});

// PATCH /api/notas/:id/restore - Restaurar nota deletada
router.patch('/:id/restore', async (req, res) => {
  try {
    const userId = req.headers['user-id'];
    if (!userId) {
      return res.status(401).json({ error: 'ID do usuário não fornecido' });
    }
    
    const nota = await notaModel.restaurar(req.params.id, userId);
    
    res.json({ 
      message: 'Nota restaurada com sucesso',
      nota
    });
  } catch (error) {
    console.error('Erro ao restaurar nota:', error);
    if (error.message.includes('não encontrada') || error.message.includes('não autorizada')) {
      return res.status(404).json({ error: 'Nota não encontrada' });
    }
    res.status(500).json({ error: 'Erro ao restaurar nota' });
  }
});

// PATCH /api/notas/:id/favorito - Alternar favorito
router.patch('/:id/favorito', async (req, res) => {
  try {
    const userId = req.headers['user-id'];
    if (!userId) {
      return res.status(401).json({ error: 'ID do usuário não fornecido' });
    }
    
    const nota = await notaModel.alternarFavorito(req.params.id, userId);
    
    res.json({ 
      message: `Nota ${nota.favorito ? 'adicionada aos' : 'removida dos'} favoritos`,
      nota
    });
  } catch (error) {
    console.error('Erro ao alternar favorito:', error);
    if (error.message.includes('não encontrada') || error.message.includes('não autorizada')) {
      return res.status(404).json({ error: 'Nota não encontrada' });
    }
    res.status(500).json({ error: 'Erro ao alternar favorito' });
  }
});

// PATCH /api/notas/:id/fixado - Alternar fixado
router.patch('/:id/fixado', async (req, res) => {
  try {
    const userId = req.headers['user-id'];
    if (!userId) {
      return res.status(401).json({ error: 'ID do usuário não fornecido' });
    }
    
    const nota = await notaModel.alternarFixado(req.params.id, userId);
    
    res.json({ 
      message: `Nota ${nota.fixado ? 'fixada' : 'desfixada'}`,
      nota
    });
  } catch (error) {
    console.error('Erro ao alternar fixado:', error);
    if (error.message.includes('não encontrada') || error.message.includes('não autorizada')) {
      return res.status(404).json({ error: 'Nota não encontrada' });
    }
    res.status(500).json({ error: 'Erro ao alternar fixado' });
  }
});

// PUT /api/notas/:id/ordenacao - Atualizar ordenação
router.put('/:id/ordenacao', async (req, res) => {
  try {
    const userId = req.headers['user-id'];
    if (!userId) {
      return res.status(401).json({ error: 'ID do usuário não fornecido' });
    }
    
    const { ordenacao } = req.body;
    if (typeof ordenacao !== 'number' || ordenacao < 0) {
      return res.status(400).json({ error: 'Ordenação deve ser um número não negativo' });
    }
    
    const nota = await notaModel.atualizarOrdenacao(req.params.id, userId, ordenacao);
    
    res.json({ 
      message: 'Ordenação atualizada com sucesso',
      nota
    });
  } catch (error) {
    console.error('Erro ao atualizar ordenação:', error);
    if (error.message.includes('não encontrada') || error.message.includes('não autorizada')) {
      return res.status(404).json({ error: 'Nota não encontrada' });
    }
    res.status(500).json({ error: 'Erro ao atualizar ordenação' });
  }
});

// PUT /api/notas/ordenacoes - Atualizar múltiplas ordenações
router.put('/ordenacoes', async (req, res) => {
  try {
    const userId = req.headers['user-id'];
    if (!userId) {
      return res.status(401).json({ error: 'ID do usuário não fornecido' });
    }
    
    const { ordenacoes } = req.body;
    if (!Array.isArray(ordenacoes)) {
      return res.status(400).json({ error: 'Ordenações devem ser um array' });
    }

    // Validar estrutura dos dados de ordenação
    for (const item of ordenacoes) {
      if (!item.id || typeof item.ordenacao !== 'number' || item.ordenacao < 0) {
        return res.status(400).json({ 
          error: 'Cada item deve ter id (string) e ordenacao (número não negativo)' 
        });
      }
    }

    await notaModel.atualizarMultiplasOrdenacoes(ordenacoes, userId);
    res.json({ message: 'Ordenações atualizadas com sucesso' });
  } catch (error) {
    console.error('Erro ao atualizar ordenações:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// GET /api/notas/favoritas - Buscar notas favoritas
router.get('/favoritas', async (req, res) => {
  try {
    const userId = req.headers['user-id'];
    if (!userId) {
      return res.status(401).json({ error: 'ID do usuário não fornecido' });
    }
    
    const notas = await notaModel.buscarFavoritas(userId);
    res.json({ notas });
  } catch (error) {
    console.error('Erro ao buscar notas favoritas:', error);
    res.status(500).json({ error: 'Erro ao buscar notas favoritas' });
  }
});

// GET /api/notas/fixadas - Buscar notas fixadas
router.get('/fixadas', async (req, res) => {
  try {
    const userId = req.headers['user-id'];
    if (!userId) {
      return res.status(401).json({ error: 'ID do usuário não fornecido' });
    }
    
    const notas = await notaModel.buscarFixadas(userId);
    res.json({ notas });
  } catch (error) {
    console.error('Erro ao buscar notas fixadas:', error);
    res.status(500).json({ error: 'Erro ao buscar notas fixadas' });
  }
});

module.exports = router; 