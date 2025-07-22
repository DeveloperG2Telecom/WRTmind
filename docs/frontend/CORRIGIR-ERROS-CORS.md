# 🔧 Corrigir Erros de CORS

## **❌ Problema Identificado:**

Você está enfrentando erros de CORS (Cross-Origin Resource Sharing):
- `Access to fetch at 'http://localhost:5000/api/links' from origin 'http://localhost:3000' has been blocked by CORS policy`
- `Failed to fetch` errors

## **✅ Soluções Implementadas:**

### **1. CORS Configurado no Backend:**
- ✅ Middleware de segurança atualizado
- ✅ Configuração CORS mais permissiva
- ✅ Suporte a múltiplas origens (localhost:3000, localhost:3001, etc.)
- ✅ Headers corretos configurados

### **2. Ordem dos Middlewares Corrigida:**
- ✅ CORS aplicado ANTES de outros middlewares
- ✅ Helmet configurado para permitir cross-origin
- ✅ Rate limiting mantido

## **🚀 Como Resolver:**

### **Passo 1: Reiniciar o Backend**
```bash
# No terminal, na pasta WRT-Back
cd WRT-Back
npm start
```

### **Passo 2: Verificar se o Backend está Rodando**
- Abra: http://localhost:5000/api/health
- Deve retornar: `{"status":"OK","message":"WRTmind API está funcionando"}`

### **Passo 3: Reiniciar o Frontend**
```bash
# Em outro terminal, na pasta WRT-Front
cd WRT-Front
npm start
```

### **Passo 4: Testar a Conexão**
- Abra o console do navegador (F12)
- Verifique se não há mais erros de CORS
- Teste adicionar/editar links

## **🔍 Verificações Adicionais:**

### **Se o Backend não Iniciar:**
1. Verifique se a porta 5000 está livre
2. Verifique se todas as dependências estão instaladas:
   ```bash
   cd WRT-Back
   npm install
   ```

### **Se o Frontend não Conectar:**
1. Verifique se o backend está rodando na porta 5000
2. Verifique se não há firewall bloqueando
3. Teste a URL: http://localhost:5000/api/health

### **Se Ainda Houver Erros:**
1. Limpe o cache do navegador (Ctrl+F5)
2. Verifique se não há outros processos usando as portas
3. Reinicie ambos os servidores

## **📋 Checklist de Verificação:**

- [ ] Backend rodando na porta 5000
- [ ] Frontend rodando na porta 3000
- [ ] API health check funcionando
- [ ] Sem erros de CORS no console
- [ ] Links carregando corretamente
- [ ] Adicionar/editar links funcionando

## **🛠️ Comandos Úteis:**

### **Verificar Portas em Uso:**
```bash
# Windows
netstat -ano | findstr :5000
netstat -ano | findstr :3000

# Linux/Mac
lsof -i :5000
lsof -i :3000
```

### **Matar Processos:**
```bash
# Windows (substitua PID pelo número do processo)
taskkill /PID PID /F

# Linux/Mac
kill -9 PID
```

### **Reinstalar Dependências:**
```bash
# Backend
cd WRT-Back
rm -rf node_modules package-lock.json
npm install

# Frontend
cd WRT-Front
rm -rf node_modules package-lock.json
npm install
```

## **📞 Se Nada Funcionar:**

1. **Verifique os logs** do backend no terminal
2. **Verifique os logs** do frontend no terminal
3. **Teste a API** diretamente com Postman ou curl
4. **Reinicie o computador** se necessário

## **✅ Status Esperado:**

Após seguir os passos:
- ✅ Backend rodando sem erros
- ✅ Frontend conectando ao backend
- ✅ Links carregando e salvando
- ✅ Reordenação funcionando
- ✅ Sem erros de CORS

**O problema deve estar resolvido!** 🎉 