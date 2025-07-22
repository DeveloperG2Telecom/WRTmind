# Configuração do Firebase para WRTmind

Este guia explica como configurar o Firebase para substituir o MongoDB no projeto WRTmind.

## 1. Criar Projeto no Firebase

1. Acesse [Firebase Console](https://console.firebase.google.com/)
2. Clique em "Adicionar projeto"
3. Digite o nome do projeto (ex: `wrtmind-app`)
4. Siga os passos para criar o projeto

## 2. Configurar Firestore Database

1. No console do Firebase, vá para "Firestore Database"
2. Clique em "Criar banco de dados"
3. Escolha "Iniciar no modo de teste" (para desenvolvimento)
4. Escolha a localização do banco (recomendado: `us-central1`)

## 3. Configurar Autenticação de Serviço

### Opção 1: Usando Service Account Key (Recomendado para produção)

1. No console do Firebase, vá para "Configurações do projeto" > "Contas de serviço"
2. Clique em "Gerar nova chave privada"
3. Baixe o arquivo JSON
4. Copie o conteúdo do arquivo JSON
5. No arquivo `config.env`, descomente a linha `FIREBASE_SERVICE_ACCOUNT_KEY` e cole o JSON:

```env
FIREBASE_SERVICE_ACCOUNT_KEY={"type":"service_account","project_id":"seu-projeto",...}
```

### Opção 2: Usando Application Default Credentials (Para desenvolvimento local)

1. Instale o Google Cloud CLI: https://cloud.google.com/sdk/docs/install
2. Execute: `gcloud auth application-default login`
3. Configure o projeto: `gcloud config set project SEU_PROJECT_ID`

## 4. Configurar Variáveis de Ambiente

Atualize o arquivo `config.env`:

```env
# Configurações do Firebase
FIREBASE_PROJECT_ID=seu-projeto-firebase
FIREBASE_DATABASE_URL=https://seu-projeto-firebase.firebaseio.com
# FIREBASE_SERVICE_ACCOUNT_KEY={"type":"service_account",...}
```

## 5. Regras de Segurança do Firestore

Configure as regras de segurança no console do Firebase:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Permitir leitura e escrita para todas as operações (apenas para desenvolvimento)
    match /{document=**} {
      allow read, write: if true;
    }
    
    // Para produção, configure regras mais restritivas:
    // match /notas/{notaId} {
    //   allow read, write: if request.auth != null;
    // }
  }
}
```

## 6. Estrutura dos Dados

O Firestore criará automaticamente a coleção `notas` com a seguinte estrutura:

```javascript
{
  "id": "auto-generated-id",
  "titulo": "Título da nota",
  "conteudo": "Conteúdo da nota",
  "topico": "Categoria/Tópico",
  "dataCriacao": "2024-01-01T00:00:00.000Z",
  "dataModificacao": "2024-01-01T00:00:00.000Z",
  "ativo": true
}
```

## 7. Testar a Configuração

1. Instale as dependências: `npm install`
2. Execute o servidor: `npm run dev`
3. Teste a API: `GET http://localhost:5000/api/health`

## 8. Migração de Dados (Opcional)

Se você tem dados no MongoDB que deseja migrar:

1. Exporte os dados do MongoDB
2. Use o script de migração (criar se necessário)
3. Importe os dados para o Firestore

## 9. Diferenças Importantes

### MongoDB vs Firestore:

- **IDs**: Firestore usa IDs auto-gerados, não ObjectIds
- **Consultas**: Firestore tem limitações diferentes para consultas complexas
- **Índices**: Firestore cria índices automaticamente
- **Transações**: Firestore suporta transações, mas com sintaxe diferente

### Limitações do Firestore:

- Máximo de 1MB por documento
- Máximo de 20.000 documentos por consulta
- Limitações em consultas com múltiplos campos

## 10. Troubleshooting

### Erro: "Firebase App named '[DEFAULT]' already exists"
- O Firebase já foi inicializado. Isso é normal em desenvolvimento.

### Erro: "Permission denied"
- Verifique as regras de segurança do Firestore
- Verifique as credenciais de autenticação

### Erro: "Project not found"
- Verifique se o `FIREBASE_PROJECT_ID` está correto
- Verifique se você tem acesso ao projeto

## 11. Próximos Passos

1. Configure autenticação de usuários (se necessário)
2. Implemente regras de segurança mais restritivas
3. Configure backup automático
4. Monitore o uso e custos no console do Firebase 