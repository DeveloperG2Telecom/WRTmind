# 🔐 Configuração do MongoDB Atlas

Este guia explica como configurar o MongoDB Atlas para o projeto WRTmind.

## 📋 Pré-requisitos

- Conta no MongoDB Atlas
- Cluster criado no MongoDB Atlas
- String de conexão do seu cluster

## 🚀 Configuração Rápida

### 1. Execute o Script de Configuração

```bash
node configure-db.js
```

### 2. Digite sua Senha

Quando solicitado, digite a senha do seu usuário MongoDB Atlas.

### 3. Verificação Automática

O script irá:
- ✅ Configurar a string de conexão
- ✅ Testar a conexão com o banco
- ✅ Copiar configurações para arquivos .env

## 🔧 Configuração Manual

Se preferir configurar manualmente:

### 1. Edite os Arquivos de Configuração

**WRT-DB/.env:**
```env
MONGODB_URI=mongodb+srv://wrtMind:<sua_senha>@wrtdatabase.y4pkcrg.mongodb.net/wrtmind
NODE_ENV=development
```

**WRT-Back/.env:**
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb+srv://wrtMind:<sua_senha>@wrtdatabase.y4pkcrg.mongodb.net/wrtmind
FRONTEND_URL=http://localhost:3000
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### 2. Substitua `<sua_senha>` pela sua senha real

## 🧪 Testando a Conexão

### Opção 1: Script Automático
```bash
node configure-db.js
```

### Opção 2: Teste Manual
```bash
cd WRT-DB
npm start
```

## 📊 Populando o Banco

Após configurar a conexão:

```bash
cd WRT-DB
npm run seed
```

Este comando irá:
- Conectar ao MongoDB Atlas
- Criar 10 notas de exemplo
- Organizar por diferentes tópicos

## 🔍 Verificando a Conexão

### Via API
```bash
curl http://localhost:5000/api/health
```

### Via MongoDB Compass
Use a string de conexão:
```
mongodb+srv://wrtMind:<sua_senha>@wrtdatabase.y4pkcrg.mongodb.net/wrtmind
```

## ⚠️ Troubleshooting

### Erro de Conexão
- Verifique se a senha está correta
- Confirme se o IP está liberado no MongoDB Atlas
- Verifique se o cluster está ativo

### Erro de Autenticação
- Confirme o nome do usuário (wrtMind)
- Verifique se o usuário tem permissões adequadas
- Teste a conexão no MongoDB Compass

### Erro de Rede
- Verifique sua conexão com a internet
- Confirme se não há firewall bloqueando
- Teste com uma conexão diferente

## 🔒 Segurança

- ✅ Nunca commite senhas no Git
- ✅ Use variáveis de ambiente
- ✅ Mantenha a string de conexão segura
- ✅ Configure IP whitelist no MongoDB Atlas

## 📞 Suporte

Se encontrar problemas:

1. Verifique os logs de erro
2. Teste a conexão manualmente
3. Confirme as configurações do MongoDB Atlas
4. Entre em contato com a equipe

---

**String de Conexão Base:**
```
mongodb+srv://wrtMind:<db_password>@wrtdatabase.y4pkcrg.mongodb.net/wrtmind
``` 