const mongoose = require('mongoose');

const notaSchema = new mongoose.Schema({
  titulo: {
    type: String,
    required: [true, 'Título é obrigatório'],
    trim: true,
    maxlength: [100, 'Título não pode ter mais de 100 caracteres']
  },
  conteudo: {
    type: String,
    required: [true, 'Conteúdo é obrigatório'],
    trim: true
  },
  topico: {
    type: String,
    required: [true, 'Tópico é obrigatório'],
    trim: true,
    maxlength: [50, 'Tópico não pode ter mais de 50 caracteres']
  },
  dataCriacao: {
    type: Date,
    default: Date.now
  },
  dataModificacao: {
    type: Date,
    default: Date.now
  },
  ativo: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true,
  versionKey: false
});

// Middleware para atualizar dataModificacao
notaSchema.pre('save', function(next) {
  this.dataModificacao = new Date();
  next();
});

// Índices para melhor performance
notaSchema.index({ topico: 1, ativo: 1 });
notaSchema.index({ dataCriacao: -1 });

module.exports = mongoose.model('Nota', notaSchema); 