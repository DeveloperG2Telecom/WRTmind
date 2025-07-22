const express = require('express');
const { body, validationResult } = require('express-validator');
const UserFirebase = require('../models/UserFirebase');

const router = express.Router();
const userModel = new UserFirebase();

// Middleware de validação para cadastro
const validateCadastro = [
  body('nome')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Nome deve ter entre 2 e 100 caracteres'),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Email deve ser válido'),
  body('senha')
    .isLength({ min: 6 })
    .withMessage('Senha deve ter pelo menos 6 caracteres')
];

// Middleware de validação para login
const validateLogin = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Email deve ser válido'),
  body('senha')
    .notEmpty()
    .withMessage('Senha é obrigatória')
];

// Garantir que a coleção existe
async function ensureCollection() {
  try {
    await userModel.ensureCollection();
  } catch (error) {
    console.error('Erro ao garantir coleção de usuários:', error.message);
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

// POST /api/auth/cadastro - Cadastrar novo usuário
router.post('/cadastro', validateCadastro, async (req, res) => {
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

    const { nome, email, senha } = req.body;

    const novoUsuario = await userModel.criar({
      nome,
      email,
      senha
    });

    res.status(201).json({
      message: 'Usuário cadastrado com sucesso',
      usuario: novoUsuario
    });
  } catch (error) {
    console.error('Erro ao cadastrar usuário:', error);
    if (error.message.includes('já cadastrado')) {
      return res.status(409).json({ error: 'Email já cadastrado' });
    }
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// POST /api/auth/login - Fazer login
router.post('/login', validateLogin, async (req, res) => {
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

    const { email, senha } = req.body;

    const usuario = await userModel.autenticar(email, senha);
    
    if (!usuario) {
      return res.status(401).json({ error: 'Email ou senha incorretos' });
    }

    res.json({
      message: 'Login realizado com sucesso',
      usuario
    });
  } catch (error) {
    console.error('Erro ao fazer login:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// GET /api/auth/verificar/:id - Verificar se usuário existe
router.get('/verificar/:id', async (req, res) => {
  try {
    await initializeIfNeeded();
    
    const usuario = await userModel.buscarPorId(req.params.id);
    
    if (!usuario) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    res.json({
      usuario: {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
        dataCriacao: usuario.dataCriacao
      }
    });
  } catch (error) {
    console.error('Erro ao verificar usuário:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// PUT /api/auth/perfil/:id - Atualizar perfil do usuário
router.put('/perfil/:id', [
  body('nome')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Nome deve ter entre 2 e 100 caracteres'),
  body('email')
    .optional()
    .isEmail()
    .normalizeEmail()
    .withMessage('Email deve ser válido')
], async (req, res) => {
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

    const { nome, email } = req.body;
    const dadosAtualizados = {};
    
    if (nome) dadosAtualizados.nome = nome;
    if (email) dadosAtualizados.email = email;

    const usuarioAtualizado = await userModel.atualizar(req.params.id, dadosAtualizados);

    res.json({
      message: 'Perfil atualizado com sucesso',
      usuario: usuarioAtualizado
    });
  } catch (error) {
    console.error('Erro ao atualizar perfil:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

module.exports = router; 