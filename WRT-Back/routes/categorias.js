const express = require('express');
const { body, validationResult } = require('express-validator');
const CategoriaFirebase = require('../models/CategoriaFirebase');

const router = express.Router();
const categoriaModel = new CategoriaFirebase();

// Validação para categoria
const validateCategoria = [
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

// GET /api/categorias - Listar todas as categorias do usuário
router.get('/', async (req, res) => {
  try {
    const userId = req.headers['user-id'];
    if (!userId) {
      return res.status(401).json({ error: 'ID do usuário não fornecido' });
    }

    const categorias = await categoriaModel.buscarTodasPorUsuario(userId);
    res.json({ categorias });
  } catch (error) {
    console.error('Erro ao listar categorias:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// GET /api/categorias/deletadas - Listar categorias excluídas
router.get('/deletadas', async (req, res) => {
  try {
    const userId = req.headers['user-id'];
    if (!userId) {
      return res.status(401).json({ error: 'ID do usuário não fornecido' });
    }

    const categorias = await categoriaModel.buscarDeletadas(userId);
    res.json({ categorias });
  } catch (error) {
    console.error('Erro ao listar categorias deletadas:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// GET /api/categorias/:id - Buscar categoria por ID
router.get('/:id', async (req, res) => {
  try {
    const userId = req.headers['user-id'];
    if (!userId) {
      return res.status(401).json({ error: 'ID do usuário não fornecido' });
    }

    const categoria = await categoriaModel.buscarPorId(req.params.id);
    if (!categoria) {
      return res.status(404).json({ error: 'Categoria não encontrada' });
    }

    // Verificar se a categoria pertence ao usuário
    if (categoria.userId !== userId) {
      return res.status(403).json({ error: 'Acesso negado' });
    }

    res.json({ categoria });
  } catch (error) {
    console.error('Erro ao buscar categoria:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// POST /api/categorias - Criar nova categoria
router.post('/', validateCategoria, async (req, res) => {
  try {
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
    const categoriaSalva = await categoriaModel.criar({ nome, descricao, cor, userId });
    
    res.status(201).json({ 
      message: 'Categoria criada com sucesso', 
      categoria: categoriaSalva 
    });
  } catch (error) {
    console.error('Erro ao criar categoria:', error);
    if (error.message.includes('Já existe uma categoria')) {
      return res.status(409).json({ error: error.message });
    }
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// PUT /api/categorias/:id - Atualizar categoria
router.put('/:id', validateCategoria, async (req, res) => {
  try {
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

    // Verificar se a categoria existe e pertence ao usuário
    const categoriaExistente = await categoriaModel.buscarPorId(req.params.id);
    if (!categoriaExistente) {
      return res.status(404).json({ error: 'Categoria não encontrada' });
    }

    if (categoriaExistente.userId !== userId) {
      return res.status(403).json({ error: 'Acesso negado' });
    }

    const { nome, descricao, cor } = req.body;
    const categoriaAtualizada = await categoriaModel.atualizar(req.params.id, { 
      nome, descricao, cor 
    });
    
    res.json({ 
      message: 'Categoria atualizada com sucesso', 
      categoria: categoriaAtualizada 
    });
  } catch (error) {
    console.error('Erro ao atualizar categoria:', error);
    if (error.message.includes('Já existe uma categoria')) {
      return res.status(409).json({ error: error.message });
    }
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// DELETE /api/categorias/:id - Excluir categoria
router.delete('/:id', async (req, res) => {
  try {
    const userId = req.headers['user-id'];
    if (!userId) {
      return res.status(401).json({ error: 'ID do usuário não fornecido' });
    }

    // Verificar se a categoria existe e pertence ao usuário
    const categoriaExistente = await categoriaModel.buscarPorId(req.params.id);
    if (!categoriaExistente) {
      return res.status(404).json({ error: 'Categoria não encontrada' });
    }

    if (categoriaExistente.userId !== userId) {
      return res.status(403).json({ error: 'Acesso negado' });
    }

    await categoriaModel.excluir(req.params.id);
    res.json({ message: 'Categoria excluída com sucesso' });
  } catch (error) {
    console.error('Erro ao excluir categoria:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// PATCH /api/categorias/:id/restore - Restaurar categoria excluída
router.patch('/:id/restore', async (req, res) => {
  try {
    const userId = req.headers['user-id'];
    if (!userId) {
      return res.status(401).json({ error: 'ID do usuário não fornecido' });
    }

    // Verificar se a categoria existe e pertence ao usuário
    const categoriaExistente = await categoriaModel.buscarPorId(req.params.id);
    if (!categoriaExistente) {
      return res.status(404).json({ error: 'Categoria não encontrada' });
    }

    if (categoriaExistente.userId !== userId) {
      return res.status(403).json({ error: 'Acesso negado' });
    }

    await categoriaModel.restaurar(req.params.id);
    res.json({ message: 'Categoria restaurada com sucesso' });
  } catch (error) {
    console.error('Erro ao restaurar categoria:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

module.exports = router; 