require('dotenv').config();
const connectDB = require('./config/database');
const Nota = require('./models/Nota');

const dadosExemplo = [
  {
    titulo: 'Bem-vindo ao WRTmind',
    conteudo: 'Esta é sua primeira nota no WRTmind! Use este sistema para organizar suas ideias, anotações e pensamentos de forma eficiente. Você pode criar notas, organizá-las por tópicos e gerenciar tudo de forma simples e intuitiva.',
    topico: 'Geral'
  },
  {
    titulo: 'Como usar o sistema',
    conteudo: '1. Crie novas notas usando o botão "+"\n2. Organize suas notas por tópicos\n3. Use a busca para encontrar notas rapidamente\n4. Edite ou delete notas conforme necessário\n5. Mantenha suas ideias organizadas!',
    topico: 'Dicas'
  },
  {
    titulo: 'Ideias para projetos futuros',
    conteudo: '- Sistema de tags para melhor organização\n- Exportação de notas em diferentes formatos\n- Compartilhamento de notas\n- Sincronização em nuvem\n- Interface mobile responsiva',
    topico: 'Desenvolvimento'
  },
  {
    titulo: 'Lista de tarefas da semana',
    conteudo: 'Segunda: Reunião com equipe\nTerça: Revisar documentação\nQuarta: Implementar novas funcionalidades\nQuinta: Testes de qualidade\nSexta: Deploy e documentação final',
    topico: 'Trabalho'
  },
  {
    titulo: 'Receita de bolo de chocolate',
    conteudo: 'Ingredientes:\n- 2 xícaras de farinha\n- 1 xícara de açúcar\n- 3 ovos\n- 1/2 xícara de óleo\n- 1 xícara de leite\n- 1/2 xícara de cacau\n\nModo de preparo:\n1. Misture os ingredientes secos\n2. Adicione os líquidos\n3. Asse por 30 minutos',
    topico: 'Receitas'
  },
  {
    titulo: 'Livros para ler este ano',
    conteudo: '1. "O Poder do Hábito" - Charles Duhigg\n2. "Atomic Habits" - James Clear\n3. "Deep Work" - Cal Newport\n4. "The Pragmatic Programmer" - Andrew Hunt\n5. "Clean Code" - Robert C. Martin',
    topico: 'Leitura'
  },
  {
    titulo: 'Metas pessoais 2024',
    conteudo: '- Aprender uma nova linguagem de programação\n- Fazer exercícios 3x por semana\n- Ler 12 livros\n- Economizar 20% do salário\n- Viajar para 2 países diferentes',
    topico: 'Pessoal'
  },
  {
    titulo: 'Comandos Git úteis',
    conteudo: 'git status - Ver status do repositório\ngit add . - Adicionar todas as mudanças\ngit commit -m "mensagem" - Fazer commit\ngit push - Enviar para repositório remoto\ngit pull - Baixar mudanças do remoto\ngit branch - Listar branches\ngit checkout -b nova-branch - Criar nova branch',
    topico: 'Desenvolvimento'
  },
  {
    titulo: 'Dicas de produtividade',
    conteudo: '- Use a técnica Pomodoro (25min trabalho, 5min pausa)\n- Organize suas tarefas por prioridade\n- Elimine distrações durante o trabalho\n- Faça pausas regulares\n- Use ferramentas de automação',
    topico: 'Dicas'
  },
  {
    titulo: 'Plano de estudos JavaScript',
    conteudo: 'Semana 1: Fundamentos básicos\nSemana 2: Funções e escopo\nSemana 3: Arrays e objetos\nSemana 4: Promises e async/await\nSemana 5: DOM manipulation\nSemana 6: Frameworks (React/Vue)',
    topico: 'Estudos'
  }
];

const popularBanco = async () => {
  try {
    // Conectar ao banco
    await connectDB();
    
    // Limpar dados existentes
    await Nota.deleteMany({});
    console.log('🗑️ Dados anteriores removidos');
    
    // Inserir dados de exemplo
    const notasCriadas = await Nota.insertMany(dadosExemplo);
    console.log(`✅ ${notasCriadas.length} notas criadas com sucesso`);
    
    // Mostrar estatísticas
    const totalNotas = await Nota.countDocuments();
    const topicos = await Nota.distinct('topico');
    
    console.log('\n📊 Estatísticas:');
    console.log(`- Total de notas: ${totalNotas}`);
    console.log(`- Tópicos criados: ${topicos.join(', ')}`);
    
    console.log('\n🎉 Banco de dados populado com sucesso!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Erro ao popular banco:', error);
    process.exit(1);
  }
};

// Executar se chamado diretamente
if (require.main === module) {
  popularBanco();
}

module.exports = popularBanco; 