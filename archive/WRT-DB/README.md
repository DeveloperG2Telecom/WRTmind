# WRT-DB - Banco de Dados MongoDB

Banco de dados MongoDB para o projeto WRTmind - Sistema de Gerenciamento de Notas.

## 🚀 Funcionalidades

- **Modelo de Notas**: Schema completo para gerenciamento de notas
- **Índices Otimizados**: Performance otimizada para consultas
- **Validação**: Validação robusta de dados
- **Timestamps**: Controle automático de datas de criação e modificação

## 📋 Pré-requisitos

- Node.js (versão 14 ou superior)
- MongoDB (versão 4.4 ou superior)
- npm ou yarn

## 🛠️ Instalação

1. **Instale as dependências:**
   ```bash
   npm install
   ```

2. **Configure as variáveis de ambiente:**
   - Copie o arquivo `config.env` para `.env`
   - Ajuste as configurações conforme necessário

3. **Certifique-se de que o MongoDB está rodando:**
   ```bash
   # Local
   mongod
   
   # Ou use MongoDB Atlas
   ```

## 🔧 Configuração

### Variáveis de Ambiente

Crie um arquivo `.env` baseado no `config.env`:

```env
MONGODB_URI=mongodb://localhost:27017/wrtmind
NODE_ENV=development
```

## 📊 Modelo de Dados

### Nota Schema

```javascript
{
  titulo: String (obrigatório, max 100 chars),
  conteudo: String (obrigatório),
  topico: String (obrigatório, max 50 chars),
  dataCriacao: Date (automático),
  dataModificacao: Date (automático),
  ativo: Boolean (padrão: true)
}
```

## 🗃️ Populando o Banco

Para popular o banco com dados de exemplo:

```bash
npm run seed
```

Este comando irá:
- Limpar dados existentes
- Inserir 10 notas de exemplo
- Criar diferentes tópicos
- Mostrar estatísticas do banco

## 📦 Scripts Disponíveis

- `npm start`: Inicia o banco de dados
- `npm run dev`: Inicia em modo desenvolvimento com nodemon
- `npm run seed`: Popula o banco com dados de exemplo

## 🏗️ Estrutura do Projeto

```
WRT-DB/
├── config/
│   └── database.js          # Configuração de conexão
├── models/
│   └── Nota.js             # Modelo de dados
├── index.js                # Arquivo principal
├── seed.js                 # Script para popular banco
├── package.json            # Dependências
└── README.md               # Documentação
```

## 🔍 Índices Criados

- `topico + ativo`: Para consultas por tópico
- `dataCriacao`: Para ordenação por data

## 🧪 Testes

Para executar os testes:
```bash
npm test
```

## 📄 Licença

Este projeto está sob a licença MIT. 