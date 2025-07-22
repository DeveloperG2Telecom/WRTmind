const express = require('express');
const { body, validationResult } = require('express-validator');
const TopicoFirebase = require('../models/TopicoFirebase');

const router = express.Router();
const topicoModel = new TopicoFirebase();

// Middleware para inicializar se necessário
const initializeIfNeeded = async () => {
  try {
    await topicoModel.ensureCollection();
  } catch (error) {
    console.error('Erro ao inicializar coleção de tópicos:', error);
  }
};

// Validações
const validateTopico = [
  body('nome')
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('Nome deve ter entre 1 e 50 caracteres'),
  body('descricao')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('Descrição deve ter no máximo 200 caracteres'),
  body('cor')
    .optional()
    .matches(/^#[0-9A-F]{6}$/i)
    .withMessage('Cor deve ser um código hexadecimal válido (ex: #667eea)')
];

// GET /api/topicos - Buscar todos os tópicos do usuário
router.get('/', async (req, res) => {
  try {
    await initializeIfNeeded();
    const userId = req.headers['user-id'];
    if (!userId) {
      return res.status(401).json({ error: 'ID do usuário não fornecido' });
    }
    
    const topicos = await topicoModel.buscarTodosPorUsuario(userId);
    res.json({ topicos });
  } catch (error) {
    console.error('Erro ao buscar tópicos:', error);
    res.status(500).json({ error: 'Erro ao buscar tópicos' });
  }
});

// GET /api/topicos/deletados - Buscar tópicos deletados
router.get('/deletados', async (req, res) => {
  try {
    await initializeIfNeeded();
    const userId = req.headers['user-id'];
    if (!userId) {
      return res.status(401).json({ error: 'ID do usuário não fornecido' });
    }
    
    const topicos = await topicoModel.buscarDeletados(userId);
    res.json({ topicos });
  } catch (error) {
    console.error('Erro ao buscar tópicos deletados:', error);
    res.status(500).json({ error: 'Erro ao buscar tópicos deletados' });
  }
});

// GET /api/topicos/:id - Buscar tópico por ID
router.get('/:id', async (req, res) => {
  try {
    await initializeIfNeeded();
    const userId = req.headers['user-id'];
    if (!userId) {
      return res.status(401).json({ error: 'ID do usuário não fornecido' });
    }
    
    const topico = await topicoModel.buscarPorId(req.params.id, userId);
    if (!topico) {
      return res.status(404).json({ error: 'Tópico não encontrado' });
    }
    
    res.json({ topico });
  } catch (error) {
    console.error('Erro ao buscar tópico:', error);
    res.status(500).json({ error: 'Erro ao buscar tópico' });
  }
});

// POST /api/topicos - Criar novo tópico
router.post('/', validateTopico, async (req, res) => {
  try {
    await initializeIfNeeded();
    
    // Verificar erros de validação
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        error: 'Dados inválidos',
        details: errors.array()
      });
    }

    const userId = req.headers['user-id'];
    if (!userId) {
      return res.status(401).json({ error: 'ID do usuário não fornecido' });
    }

    const { nome, descricao, cor } = req.body;
    const topicoSalvo = await topicoModel.criar({
      nome,
      descricao,
      cor,
      userId
    });
    
    res.status(201).json({ 
      message: 'Tópico criado com sucesso',
      topico: topicoSalvo
    });
  } catch (error) {
    console.error('Erro ao criar tópico:', error);
    if (error.message.includes('Já existe um tópico')) {
      return res.status(409).json({ error: error.message });
    }
    res.status(500).json({ error: 'Erro ao criar tópico' });
  }
});

// PUT /api/topicos/:id - Atualizar tópico
router.put('/:id', validateTopico, async (req, res) => {
  try {
    await initializeIfNeeded();
    
    // Verificar erros de validação
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        error: 'Dados inválidos',
        details: errors.array()
      });
    }

    const userId = req.headers['user-id'];
    if (!userId) {
      return res.status(401).json({ error: 'ID do usuário não fornecido' });
    }

    const { nome, descricao, cor } = req.body;
    const topicoAtualizado = await topicoModel.atualizar(req.params.id, {
      nome,
      descricao,
      cor
    }, userId);
    
    res.json({ 
      message: 'Tópico atualizado com sucesso',
      topico: topicoAtualizado
    });
  } catch (error) {
    console.error('Erro ao atualizar tópico:', error);
    if (error.message.includes('não encontrado') || error.message.includes('não autorizado')) {
      return res.status(404).json({ error: 'Tópico não encontrado' });
    }
    if (error.message.includes('Já existe um tópico')) {
      return res.status(409).json({ error: error.message });
    }
    res.status(500).json({ error: 'Erro ao atualizar tópico' });
  }
});

// DELETE /api/topicos/:id - Deletar tópico
router.delete('/:id', async (req, res) => {
  try {
    await initializeIfNeeded();
    const userId = req.headers['user-id'];
    if (!userId) {
      return res.status(401).json({ error: 'ID do usuário não fornecido' });
    }
    
    const topico = await topicoModel.excluir(req.params.id, userId);
    
    res.json({ 
      message: 'Tópico deletado com sucesso',
      topico
    });
  } catch (error) {
    console.error('Erro ao deletar tópico:', error);
    if (error.message.includes('não encontrado') || error.message.includes('não autorizado')) {
      return res.status(404).json({ error: 'Tópico não encontrado' });
    }
    res.status(500).json({ error: 'Erro ao deletar tópico' });
  }
});

// PATCH /api/topicos/:id/restore - Restaurar tópico deletado
router.patch('/:id/restore', async (req, res) => {
  try {
    await initializeIfNeeded();
    const userId = req.headers['user-id'];
    if (!userId) {
      return res.status(401).json({ error: 'ID do usuário não fornecido' });
    }
    
    const topico = await topicoModel.restaurar(req.params.id, userId);
    
    res.json({ 
      message: 'Tópico restaurado com sucesso',
      topico
    });
  } catch (error) {
    console.error('Erro ao restaurar tópico:', error);
    if (error.message.includes('não encontrado') || error.message.includes('não autorizado')) {
      return res.status(404).json({ error: 'Tópico não encontrado' });
    }
    res.status(500).json({ error: 'Erro ao restaurar tópico' });
  }
});

module.exports = router; 