# 🧪 Testes - WRTmind

Esta pasta contém os testes do sistema WRTmind.

## 📁 Arquivos de Teste

### `test-firebase.js`
**Propósito**: Testar a conexão e funcionalidades do Firebase

**Como executar**:
```bash
node tests/test-firebase.js
```

**O que testa**:
- Conexão com Firebase
- Autenticação
- Operações básicas do Firestore
- Configurações do projeto

## 🎯 Como Usar

### Executar Testes
```bash
# Testar Firebase
node tests/test-firebase.js

# Executar todos os testes (quando houver mais)
npm test
```

### Adicionar Novos Testes
1. Crie um novo arquivo `.js` na pasta `tests/`
2. Siga o padrão de nomenclatura: `test-[funcionalidade].js`
3. Documente o propósito do teste no arquivo

## 📋 Convenções

- **Nomenclatura**: `test-[funcionalidade].js`
- **Estrutura**: Teste isolado e independente
- **Documentação**: Comentários explicativos no código
- **Logs**: Usar emojis para facilitar identificação

## 🔄 Histórico

### Reorganização (21/07/2025)
- `test-firebase.js` movido de `WRT-Back/` para `tests/`
- Caminhos de importação atualizados
- Documentação criada 