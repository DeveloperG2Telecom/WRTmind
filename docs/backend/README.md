# WRTmind Backend

Backend API para o projeto WRTmind - Sistema de Gerenciamento de Notas.

## 🚀 Funcionalidades

- **CRUD de Notas**: Criar, ler, atualizar e deletar notas
- **Gerenciamento de Tópicos**: Organizar notas por tópicos
- **Soft Delete**: Deletar e restaurar notas
- **Paginação**: Suporte a paginação nas consultas
- **Validação**: Validação robusta de dados
- **Segurança**: Middleware de segurança implementado

## 📋 Pré-requisitos

- Node.js (versão 14 ou superior)
- Firebase Project (Firestore Database)
- npm ou yarn

## 🛠️ Instalação

1. **Clone o repositório e navegue para o diretório do backend:**
   ```bash
   cd WRT-Back
   ```

2. **Instale as dependências:**
   ```bash
   npm install
   ```

3. **Configure o Firebase:**
   - Siga o guia em `FIREBASE-SETUP.md`
   - Configure as variáveis de ambiente no arquivo `config.env`

4. **Configure as variáveis de ambiente:**
   - Copie o arquivo `config.env` para `.env`
   - Ajuste as configurações do Firebase conforme necessário

5. **Inicie o servidor:**
   ```bash
   # Desenvolvimento
   npm run dev
   
   # Produção
   npm start
   ```

## 🔧 Configuração

### Variáveis de Ambiente

Crie um arquivo `.env` baseado no `config.env`:

```env
PORT=5000
NODE_ENV=development
FIREBASE_PROJECT_ID=seu-projeto-firebase
FIREBASE_DATABASE_URL=https://seu-projeto-firebase.firebaseio.com
FRONTEND_URL=http://localhost:3000
```

## 📚 API Endpoints

### Notas

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/api/notas` | Listar todas as notas |
| GET | `/api/notas/topicos` | Listar todos os tópicos |
| GET | `/api/notas/:id` | Buscar nota por ID |
| POST | `/api/notas` | Criar nova nota |
| PUT | `/api/notas/:id` | Atualizar nota |
| DELETE | `/api/notas/:id` | Deletar nota (soft delete) |
| PATCH | `/api/notas/:id/restore` | Restaurar nota deletada |

### Health Check

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/api/health` | Verificar status da API |

## 📝 Exemplos de Uso

### Criar uma nota
```bash
curl -X POST http://localhost:5000/api/notas \
  -H "Content-Type: application/json" \
  -d '{
    "titulo": "Minha primeira nota",
    "conteudo": "Conteúdo da nota aqui...",
    "topico": "Trabalho"
  }'
```

### Listar notas
```bash
curl http://localhost:5000/api/notas
```

### Buscar notas por tópico
```bash
curl "http://localhost:5000/api/notas?topico=Trabalho"
```

## 🔄 Persistência e Sincronização

- O backend utiliza um arquivo local (JSON) como cache e fila de pendências.
- Ao iniciar, sempre puxa os dados do Firebase e sobrescreve o local.
- Alterações locais (criar, editar, excluir) são marcadas como pendentes e sincronizadas automaticamente com o Firebase.
- Após sincronização bem-sucedida, a flag de pendente é removida.
- O endpoint `/api/links` reflete sempre o estado mais atualizado (local + Firebase).

## 🏗️ Estrutura do Projeto

```
WRT-Back/
├── config/
│   └── firebase.js          # Configuração do Firebase
├── middleware/
│   └── security.js          # Middleware de segurança
├── models/
│   └── NotaFirebase.js     # Modelo de dados da nota (Firebase)
├── routes/
│   └── notas.js            # Rotas da API
├── scripts/
│   └── migrate-to-firebase.js # Script de migração
├── server.js               # Arquivo principal do servidor
├── package.json            # Dependências do projeto
├── FIREBASE-SETUP.md       # Guia de configuração do Firebase
└── README.md               # Documentação
```

## 🔒 Segurança

- **Helmet**: Headers de segurança
- **CORS**: Configuração de Cross-Origin
- **Rate Limiting**: Proteção contra ataques de força bruta
- **Validação**: Validação de entrada com express-validator
- **Sanitização**: Remoção de caracteres perigosos

## 🧪 Testes

Para executar os testes:
```bash
npm test
```

## 📦 Scripts Disponíveis

- `npm start`: Inicia o servidor em produção
- `npm run dev`: Inicia o servidor em modo desenvolvimento com nodemon
- `npm test`: Executa os testes
- `npm run migrate`: Executa a migração do MongoDB para Firebase

## 🤝 Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes. 