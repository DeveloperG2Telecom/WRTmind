# WRTmind - Sistema de Gerenciamento de Projetos e Links

## 📋 Descrição

O WRTmind é uma aplicação web moderna e intuitiva para gerenciamento de projetos, anotações, reuniões e links. Desenvolvido em React com uma interface elegante e responsiva, o sistema oferece uma experiência completa de organização e produtividade.

## ✨ Funcionalidades Principais

### 🔗 Links (Tela Principal)
- **Grade Compacta 7x3**: Visualização em grade otimizada para links
- **Adição Dinâmica**: Botão para adicionar novos links automaticamente
- **Campos Específicos**: URL e URL do ícone com preview em tempo real
- **Categorização**: Organização por categorias personalizáveis
- **Drag & Drop**: Reordenação manual dos links
- **Busca e Filtros**: Sistema de busca e ordenação avançada

### 📊 Projetos
- **Gerenciamento Completo**: Criação, edição e exclusão de projetos
- **Tópicos Personalizáveis**: Seções customizáveis dentro dos projetos
- **Editor Rico**: Conteúdo rico com formatação avançada
- **Status e Prioridades**: Controle de status e níveis de prioridade
- **Categorização**: Organização por categorias

### 📝 Anotações
- **Editor de Texto Rico**: Formatação avançada de conteúdo
- **Categorização**: Organização por categorias
- **Busca Avançada**: Sistema de busca por título e conteúdo
- **Ordenação**: Múltiplas opções de ordenação

### 👥 Reuniões
- **Agendamento**: Criação e gerenciamento de reuniões
- **Status Tracking**: Controle de status das reuniões
- **Prioridades**: Definição de níveis de prioridade
- **Categorização**: Organização por tipos de reunião

### ⚙️ Configurações
- **Gerenciamento de Categorias**: Adicionar, editar e remover categorias
- **Gerenciamento de Tópicos**: Personalizar tópicos para projetos
- **Persistência**: Configurações salvas automaticamente

## 🚀 Tecnologias Utilizadas

- **React 19.1.0**: Framework principal
- **Styled Components 6.1.19**: Estilização CSS-in-JS
- **FontAwesome**: Ícones e elementos visuais
- **LocalStorage**: Persistência de dados local
- **Context API**: Gerenciamento de estado global
- **React Hooks**: useState, useEffect, useContext

## 📦 Instalação

### Pré-requisitos
- Node.js (versão 14 ou superior)
- npm ou yarn

### Passos para Instalação

1. **Clone o repositório**
   ```bash
   git clone [URL_DO_REPOSITORIO]
   cd wrtmind-react
   ```

2. **Instale as dependências**
   ```bash
   npm install
   ```

3. **Inicie o servidor de desenvolvimento**
   ```bash
   npm start
   ```

4. **Acesse a aplicação**
   ```
   http://localhost:3000
   ```

## 🎯 Como Usar

### Links (Tela Principal)
1. **Adicionar Link**: Clique no botão "Novo" ou use Ctrl+N
2. **Preencher Dados**: 
   - Título do link
   - URL de destino
   - URL do ícone (com preview automático)
   - Categoria (opcional)
3. **Salvar**: Clique em "Salvar" para adicionar o link
4. **Visualizar**: Clique no link para abrir em nova aba
5. **Editar/Excluir**: Use os botões de ação nos cards

### Projetos
1. **Navegar**: Clique em "Projetos" no menu lateral
2. **Criar Projeto**: Use o botão "Novo" ou Ctrl+N
3. **Gerenciar Tópicos**: Adicione seções personalizadas
4. **Editor Rico**: Use a barra de ferramentas para formatação
5. **Salvar**: Os dados são salvos automaticamente

### Anotações
1. **Navegar**: Clique em "Anotações" no menu lateral
2. **Criar Anotação**: Use o botão "Novo" ou Ctrl+N
3. **Editor Rico**: Formatação avançada disponível
4. **Categorizar**: Selecione uma categoria apropriada

### Reuniões
1. **Navegar**: Clique em "Reuniões" no menu lateral
2. **Agendar**: Crie novas reuniões com detalhes
3. **Status**: Acompanhe o progresso das reuniões
4. **Prioridades**: Defina níveis de importância

### Configurações
1. **Acessar**: Clique no ícone de engrenagem no menu lateral
2. **Categorias**: Gerencie categorias para todos os tipos
3. **Tópicos**: Personalize tópicos para projetos
4. **Salvar**: Alterações são aplicadas automaticamente

## ⌨️ Atalhos de Teclado

- **Ctrl/Cmd + N**: Criar novo item
- **ESC**: Fechar modais
- **Enter**: Salvar formulários (quando focado)

## 🎨 Interface e Design

### Design System
- **Cores**: Paleta moderna com tons de azul e roxo
- **Tipografia**: Fonte Inter para melhor legibilidade
- **Espaçamentos**: Sistema consistente de espaçamentos
- **Bordas**: Bordas arredondadas para visual moderno
- **Sombras**: Sistema de sombras para profundidade

### Responsividade
- **Desktop**: Layout otimizado para telas grandes
- **Tablet**: Adaptação para telas médias
- **Mobile**: Interface responsiva para dispositivos móveis

### Animações
- **Transições Suaves**: Animações CSS para melhor UX
- **Feedback Visual**: Hover effects e estados ativos
- **Loading States**: Indicadores de carregamento

## 📁 Estrutura do Projeto

```
src/
├── components/          # Componentes React
│   ├── App.js          # Componente principal
│   ├── MenuLateral.js  # Menu de navegação
│   ├── ListaItens.js   # Lista de itens
│   ├── ModalItem.js    # Modal de criação/edição
│   ├── ModalVisualizar.js # Modal de visualização
│   ├── CardItem.js     # Cards de itens
│   ├── Loading.js      # Componente de carregamento
│   ├── Configuracoes.js # Modal de configurações
│   ├── EditorTexto.js  # Editor de texto rico
│   └── GerenciadorTopicos.js # Gerenciador de tópicos
├── context/            # Context API
│   └── NotasContext.js # Contexto principal
├── styles/             # Estilos globais
│   └── GlobalStyles.js # Estilos CSS globais
├── utils/              # Utilitários
│   └── formatacao.js   # Funções de formatação
└── index.js            # Ponto de entrada
```

## 🔧 Configuração e Personalização

### Variáveis CSS
O projeto utiliza um sistema de variáveis CSS para fácil personalização:

```css
:root {
  --corPrimaria: #667eea;
  --corSecundaria: #764ba2;
  --corFundoPrincipal: #f8fafc;
  --corTextoPrimaria: #1e293b;
  /* ... outras variáveis */
}
```

### LocalStorage
Os dados são persistidos automaticamente no localStorage:
- `wrtmind_dados`: Dados principais da aplicação
- Configurações de categorias e tópicos
- Estado da interface (menu recolhido, etc.)

## 🚀 Deploy

### Build para Produção
```bash
npm run build
```

### Servidor de Produção
```bash
npm install -g serve
serve -s build
```

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 👨‍💻 Desenvolvimento

### Scripts Disponíveis
- `npm start`: Inicia o servidor de desenvolvimento
- `npm run build`: Cria build de produção
- `npm test`: Executa testes
- `npm run eject`: Ejecta do Create React App

### Estrutura de Dados

#### Link
```javascript
{
  id: "string",
  titulo: "string",
  url: "string",
  urlIcone: "string",
  categoria: "string",
  dataCriacao: "ISO string",
  dataAtualizacao: "ISO string",
  ordem: "number"
}
```

#### Projeto
```javascript
{
  id: "string",
  titulo: "string",
  conteudo: "string",
  categoria: "string",
  status: "string",
  prioridade: "string",
  topicos: "array",
  dataCriacao: "ISO string",
  dataAtualizacao: "ISO string",
  ordem: "number"
}
```

## 🐛 Problemas Conhecidos

- Nenhum problema crítico identificado
- Sistema estável e funcional

## 🔮 Roadmap

- [ ] Exportação de dados
- [ ] Temas personalizáveis
- [ ] Sincronização em nuvem
- [ ] Notificações push
- [ ] Integração com calendário
- [ ] API REST para backend

## 📞 Suporte

Para suporte ou dúvidas, abra uma issue no repositório do projeto.

---

**WRTmind** - Organize sua vida digital de forma inteligente! 🚀
