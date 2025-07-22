# 🔥 Firebase Configuration

Esta pasta contém todas as configurações do Firebase para o projeto WRTmind.

## 📁 Estrutura

```
firebase/
├── firebase.json          # Configuração principal do Firebase
├── firestore.rules        # Regras de segurança do Firestore
├── firestore.indexes.json # Índices do Firestore
├── storage.rules          # Regras do Firebase Storage
└── .firebaserc           # Configuração do projeto Firebase
```

## 🚀 Como Usar

### Deploy das Regras
```bash
# Deploy das regras do Firestore
firebase deploy --only firestore:rules

# Deploy dos índices do Firestore
firebase deploy --only firestore:indexes

# Deploy das regras do Storage
firebase deploy --only storage

# Deploy completo
firebase deploy
```

### Emuladores Locais
```bash
# Iniciar emuladores
firebase emulators:start

# Interface dos emuladores
firebase emulators:start --only ui
```

## 📋 Configurações

### Firestore
- **Regras**: Controle de acesso às coleções
- **Índices**: Otimização de consultas por tópico e data

### Storage
- **Regras**: Controle de acesso aos arquivos

### Hosting
- **Build**: `WRT-Front/build`
- **SPA**: Configurado para React Router

## 🔒 Segurança

⚠️ **Importante**: As chaves de serviço do Firebase não estão nesta pasta.
Elas devem ser mantidas em local seguro e não commitadas no repositório.

## 📚 Documentação

- [Firebase Documentation](https://firebase.google.com/docs)
- [Firestore Security Rules](https://firebase.google.com/docs/firestore/security/get-started)
- [Firebase Storage Rules](https://firebase.google.com/docs/storage/security) 