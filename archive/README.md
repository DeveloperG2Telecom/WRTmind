# 📦 Arquivo - WRTmind

Esta pasta contém componentes do sistema que foram arquivados durante a reorganização.

## 📁 Conteúdo Arquivado

### `/WRT-DB/`
**Status**: ARQUIVADO - Migrado para Firebase

**Motivo**: O sistema foi migrado do MongoDB para Firebase como banco principal.

**Conteúdo**:
- Configurações do MongoDB
- Modelos de dados
- Scripts de seed
- Configurações de conexão

**⚠️ Importante**: 
- Este código não é mais usado no sistema atual
- Mantido apenas para referência histórica
- Os scripts de configuração foram atualizados para refletir a migração

## 🔄 Histórico de Migração

### De MongoDB para Firebase
- **Data**: 21/07/2025
- **Motivo**: Simplificação da arquitetura e melhor integração
- **Impacto**: Sistema mais simples e escalável

### Scripts Atualizados
- `setup.js` - Agora foca no Firebase
- `configure-db.js` - Marcado como arquivado
- `package.json` - Scripts atualizados

## 🎯 Como Restaurar (se necessário)

Se precisar restaurar o MongoDB:

1. Mova `archive/WRT-DB/` de volta para o diretório raiz
2. Atualize os scripts de configuração
3. Configure as variáveis de ambiente do MongoDB
4. Execute `npm install` na pasta WRT-DB

**⚠️ Nota**: Isso não é recomendado, pois o sistema atual está otimizado para Firebase. 