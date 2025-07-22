# WRTmind - Sistema de Gerenciamento de Notas

Sistema completo de gerenciamento de notas e organização pessoal usando **Firebase**, React e Express.

## 🚀 Tecnologias

- **Backend**: Node.js + Express + Firebase Admin SDK
- **Frontend**: React + Firebase Web SDK
- **Database**: Firebase Firestore
- **Hosting**: Firebase Hosting
- **Storage**: Firebase Storage
- **Authentication**: Firebase Auth (configurável)

## 📋 Pré-requisitos

- Node.js (versão 14 ou superior)
- npm ou yarn
- Firebase CLI (`npm install -g firebase-tools`)
- Conta Google (para Firebase)

## 🛠️ Instalação

1. **Clone o repositório:**
   ```bash
   git clone <repository-url>
   cd WRTmind
   ```

2. **Instale as dependências:**
   ```bash
   npm install
   ```

3. **Configure o Firebase:**
   - Faça login: `firebase login`
   - O projeto já está configurado para `wrtmind`

4. **Configure as variáveis de ambiente:**
   - Backend: `WRT-Back/config.env`
   - Frontend: `WRT-Front/config.env`

## 🚀 Scripts Disponíveis

### Desenvolvimento
```bash
# Rodar backend e frontend simultaneamente
npm run dev

# Rodar apenas o backend
npm run dev:backend

# Rodar apenas o frontend
npm run dev:frontend
```

### Firebase
```bash
# Deploy completo
npm run deploy

# Deploy apenas do hosting
npm run deploy:hosting

# Deploy das regras de segurança
npm run deploy:rules

# Rodar emuladores locais
npm run emulators
```

### Migração
```bash
# Migrar dados do MongoDB para Firebase
npm run migrate
```

## 🔧 Configuração do Firebase

### 1. Firestore Database
- Acesse [Firebase Console](https://console.firebase.google.com/)
- Selecione o projeto `wrtmind`
- Vá para "Firestore Database" e crie o banco

### 2. Regras de Segurança
As regras já estão configuradas em:
- `firebase/firestore.rules` - Regras do Firestore
- `firebase/storage.rules` - Regras do Storage

### 3. Hosting
O frontend será deployado automaticamente em:
- `https://wrtmind.web.app`
- `https://wrtmind.firebaseapp.com`

## 📁 Estrutura do Projeto

```
WRTmind/
├── WRT-Back/                 # Backend (Express + Firebase Admin)
│   ├── config/
│   │   └── firebase.js      # Configuração Firebase Admin
│   ├── models/
│   │   └── NotaFirebase.js  # Modelo Firestore
│   ├── routes/
│   │   └── notas.js         # Rotas da API
│   └── server.js            # Servidor Express
├── WRT-Front/               # Frontend (React + Firebase Web)
│   ├── src/
│   │   ├── config/
│   │   │   └── firebase.js  # Configuração Firebase Web
│   │   └── components/      # Componentes React
│   └── package.json
├── firebase.json            # Configuração Firebase CLI
├── firestore.rules          # Regras de segurança Firestore
├── storage.rules            # Regras de segurança Storage
└── package.json             # Scripts do projeto
```

## 🔒 Segurança

### Regras de Desenvolvimento (atuais)
```javascript
// Permitir todas as operações
allow read, write: if true;
```

### Regras de Produção (recomendadas)
```javascript
// Permitir apenas usuários autenticados
allow read, write: if request.auth != null;
```

## 📚 API Endpoints

### Notas
- `GET /api/notas` - Listar notas
- `GET /api/notas/topicos` - Listar tópicos
- `GET /api/notas/:id` - Buscar nota
- `POST /api/notas` - Criar nota
- `PUT /api/notas/:id` - Atualizar nota
- `DELETE /api/notas/:id` - Deletar nota
- `PATCH /api/notas/:id/restore` - Restaurar nota

## 🚀 Deploy

### Deploy Completo
```bash
npm run deploy
```

### Deploy Parcial
```bash
# Apenas regras de segurança
npm run deploy:rules

# Apenas hosting
npm run deploy:hosting
```

## 🧪 Testes Locais

### Emuladores Firebase
```bash
npm run emulators
```

### Acesso aos Emuladores
- Firestore: `http://localhost:8080`
- Hosting: `http://localhost:5000`
- Auth: `http://localhost:9099`
- Storage: `http://localhost:9199`
- UI: `http://localhost:4000`

## 📊 Monitoramento

- **Firebase Console**: https://console.firebase.google.com/project/wrtmind
- **Analytics**: Configurado automaticamente
- **Performance**: Monitoramento automático

## 🤝 Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT.

## 🆘 Suporte

- **Documentação Firebase**: https://firebase.google.com/docs
- **Firebase Console**: https://console.firebase.google.com
- **Issues**: Abra uma issue no repositório 

## 🔄 Sincronização de Dados

- **Fonte primária:** O Firebase é a fonte principal de dados.
- **Fluxo ao iniciar:** O backend sempre puxa os dados do Firebase e sobrescreve o arquivo local.
- **Alterações locais:** Sempre que um link é criado, editado ou excluído, ele é salvo localmente como pendente e imediatamente sincronizado com o Firebase.
- **Sincronização automática:** A cada 1 minuto, o backend verifica e sincroniza pendências restantes.
- **Sincronização manual:** Pode ser disparada via API ou pelo frontend.
- **Segurança:** Se o backend for reiniciado, apenas os dados já sincronizados com o Firebase serão carregados.
- **Frontend:** Sempre consome a API, nunca lê direto do arquivo local.

### Scripts úteis

```bash
# Limpar dados locais e forçar recarregamento do Firebase
npm run clear-local
``` 