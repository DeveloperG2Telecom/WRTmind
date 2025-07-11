import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faProjectDiagram, 
  faStickyNote, 
  faUsers,
  faCheckCircle,
  faTimes,
  faLink
} from '@fortawesome/free-solid-svg-icons';
import { NotasProvider, usarNotas } from './context/NotasContext';
import GlobalStyles from './styles/GlobalStyles';
import MenuLateral from './components/MenuLateral';
import ListaItens from './components/ListaItens';
import ModalItem from './components/ModalItem';
import ModalVisualizar from './components/ModalVisualizar';
import Configuracoes from './components/Configuracoes';
import Loading from './components/Loading';

const AppContainer = styled.div`
  display: flex;
  min-height: 100vh;
  background: var(--corFundoPrincipal);
`;

const MainContent = styled.main`
  flex: 1;
  margin-left: ${props => props.menuRecolhido ? 'var(--larguraMenuRecolhido)' : 'var(--larguraMenu)'};
  transition: margin-left var(--transicaoMedia);
  overflow-x: hidden;
`;

const NotificationContainer = styled.div`
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: var(--zIndexTooltip);
  display: flex;
  flex-direction: column;
  gap: var(--espacamentoMedio);
`;

const Notification = styled.div`
  background: ${props => props.tipo === 'erro' ? 'var(--corErro)' : 'var(--corSucesso)'};
  color: white;
  padding: var(--espacamentoMedio) var(--espacamentoGrande);
  border-radius: var(--bordaRaioMedia);
  box-shadow: var(--sombraMedia);
  display: flex;
  align-items: center;
  gap: var(--espacamentoMedio);
  font-weight: 500;
  animation: slideIn 0.3s ease-out;
  max-width: 400px;
  word-wrap: break-word;

  &.fade-out {
    animation: slideOut 0.3s ease-in;
  }
`;

const NotificationIcon = styled.div`
  flex-shrink: 0;
`;

const NotificationText = styled.span`
  flex: 1;
`;

const NotificationClose = styled.button`
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  padding: var(--espacamentoPequeno);
  border-radius: var(--bordaRaioPequena);
  transition: background var(--transicaoRapida);
  flex-shrink: 0;

  &:hover {
    background: rgba(255, 255, 255, 0.2);
  }
`;

const AppContent = () => {
  const {
    categoriaAtiva,
    menuRecolhido,
    carregando,
    obterItensFiltrados,
    adicionarProjeto,
    atualizarProjeto,
    removerProjeto,
    adicionarAnotacao,
    atualizarAnotacao,
    removerAnotacao,
    adicionarReuniao,
    atualizarReuniao,
    removerReuniao,
    adicionarLink,
    atualizarLink,
    removerLink,
    reordenarItens
  } = usarNotas();



  const [modalVisivel, setModalVisivel] = useState(false);
  const [modalVisualizarVisivel, setModalVisualizarVisivel] = useState(false);
  const [itemEditando, setItemEditando] = useState(null);
  const [itemVisualizando, setItemVisualizando] = useState(null);
  const [notificacoes, setNotificacoes] = useState([]);
  const [configuracoesVisivel, setConfiguracoesVisivel] = useState(false);

  // Configurações por categoria
  const configuracaoCategoria = {
    links: {
      titulo: 'Links',
      icone: faLink,
      tipo: 'link',
      adicionar: adicionarLink,
      atualizar: atualizarLink,
      remover: removerLink
    },
    projetos: {
      titulo: 'Projetos',
      icone: faProjectDiagram,
      tipo: 'projeto',
      adicionar: adicionarProjeto,
      atualizar: atualizarProjeto,
      remover: removerProjeto
    },
    anotacoes: {
      titulo: 'Anotações',
      icone: faStickyNote,
      tipo: 'anotacao',
      adicionar: adicionarAnotacao,
      atualizar: atualizarAnotacao,
      remover: removerAnotacao
    },
    reunioes: {
      titulo: 'Reuniões',
      icone: faUsers,
      tipo: 'reuniao',
      adicionar: adicionarReuniao,
      atualizar: atualizarReuniao,
      remover: removerReuniao
    }
  };

  const config = configuracaoCategoria[categoriaAtiva];

  // Obter itens filtrados da categoria atual
  const itens = obterItensFiltrados(categoriaAtiva);

  // Adicionar notificação
  const adicionarNotificacao = (mensagem, tipo = 'sucesso') => {
    const id = Date.now();
    const novaNotificacao = { id, mensagem, tipo };
    
    setNotificacoes(prev => [...prev, novaNotificacao]);
    
    // Remover automaticamente após 5 segundos
    setTimeout(() => {
      removerNotificacao(id);
    }, 5000);
  };

  // Remover notificação
  const removerNotificacao = (id) => {
    setNotificacoes(prev => prev.filter(notif => notif.id !== id));
  };

  // Handlers do modal
  const handleNovo = () => {
    setItemEditando(null);
    setModalVisivel(true);
  };

  const handleEditar = (item) => {
    setItemEditando(item);
    setModalVisivel(true);
  };

  const handleVisualizar = (item) => {
    setItemVisualizando(item);
    setModalVisualizarVisivel(true);
  };

  const handleExcluir = (id) => {
    try {
      config.remover(id);
      adicionarNotificacao(`${config.titulo} excluído com sucesso!`);
    } catch (erro) {
      adicionarNotificacao(`Erro ao excluir ${config.tipo}`, 'erro');
    }
  };

  const handleSalvar = async (dados) => {
    try {
      if (itemEditando) {
        config.atualizar(dados);
        adicionarNotificacao(`${config.titulo} atualizado com sucesso!`);
      } else {
        config.adicionar(dados);
        adicionarNotificacao(`${config.titulo} criado com sucesso!`);
      }
      setModalVisivel(false);
    } catch (erro) {
      adicionarNotificacao(`Erro ao salvar ${config.tipo}`, 'erro');
    }
  };

  const handleReordenar = (novosItens) => {
    try {
      reordenarItens(categoriaAtiva, novosItens);
      adicionarNotificacao('Ordem atualizada com sucesso!');
    } catch (erro) {
      adicionarNotificacao('Erro ao reordenar itens', 'erro');
    }
  };

  const handleCopiar = (mensagem) => {
    adicionarNotificacao(mensagem);
  };

  // Fechar modais
  const fecharModal = () => {
    setModalVisivel(false);
    setItemEditando(null);
  };

  const fecharModalVisualizar = () => {
    setModalVisualizarVisivel(false);
    setItemVisualizando(null);
  };

  const abrirConfiguracoes = () => {
    setConfiguracoesVisivel(true);
  };

  const fecharConfiguracoes = () => {
    setConfiguracoesVisivel(false);
  };

  // Atalhos de teclado
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ctrl/Cmd + N para novo item
      if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
        e.preventDefault();
        handleNovo();
      }
      
      // ESC para fechar modais
      if (e.key === 'Escape') {
        if (modalVisivel) {
          fecharModal();
        }
        if (modalVisualizarVisivel) {
          fecharModalVisualizar();
        }
        if (configuracoesVisivel) {
          fecharConfiguracoes();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [modalVisivel, modalVisualizarVisivel, configuracoesVisivel]);

  if (carregando) {
    return <Loading overlay texto="Carregando aplicação..." />;
  }

  return (
    <AppContainer>
      <MenuLateral onAbrirConfiguracoes={abrirConfiguracoes} />
      
      <MainContent menuRecolhido={menuRecolhido}>
        <ListaItens
          itens={itens}
          tipo={config.tipo}
          titulo={config.titulo}
          icone={config.icone}
          carregando={carregando}
          onNovo={handleNovo}
          onEditar={handleEditar}
          onExcluir={handleExcluir}
          onVisualizar={handleVisualizar}
          onCopiar={handleCopiar}
          onReordenar={handleReordenar}
          modoOrdenacao="manual"
        />
      </MainContent>

      {/* Modal para criar/editar */}
      <ModalItem
        visivel={modalVisivel}
        tipo={config.tipo}
        item={itemEditando}
        onSalvar={handleSalvar}
        onExcluir={handleExcluir}
        onFechar={fecharModal}
        carregando={carregando}
      />

      {/* Modal para visualizar */}
      <ModalVisualizar
        visivel={modalVisualizarVisivel}
        item={itemVisualizando}
        tipo={config.tipo}
        onFechar={fecharModalVisualizar}
        onEditar={handleEditar}
        onExcluir={handleExcluir}
        onCopiar={handleCopiar}
      />

      {/* Modal de configurações */}
      <Configuracoes 
        visivel={configuracoesVisivel} 
        onFechar={fecharConfiguracoes} 
      />

      {/* Notificações */}
      <NotificationContainer>
        {notificacoes.map(notificacao => (
          <Notification key={notificacao.id} tipo={notificacao.tipo}>
            <NotificationIcon>
              <FontAwesomeIcon 
                icon={notificacao.tipo === 'erro' ? faTimes : faCheckCircle} 
              />
            </NotificationIcon>
            <NotificationText>{notificacao.mensagem}</NotificationText>
            <NotificationClose onClick={() => removerNotificacao(notificacao.id)}>
              <FontAwesomeIcon icon={faTimes} />
            </NotificationClose>
          </Notification>
        ))}
      </NotificationContainer>
    </AppContainer>
  );
};

const App = () => {
  return (
    <NotasProvider>
      <GlobalStyles />
      <AppContent />
    </NotasProvider>
  );
};

export default App;
