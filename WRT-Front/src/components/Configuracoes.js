import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faTimes, 
  faPlus, 
  faEdit, 
  faTrash, 
  faCheck,
  faCog,
  faTags,
  faFolder,
  faSync,
  faEye,
  faTrashAlt,
  faPlay
} from '@fortawesome/free-solid-svg-icons';
import { useNotasAPIContext } from '../context/NotasAPIContext';
import { syncAPI, linksAPI } from '../config/api';

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: var(--zIndexModal);
  padding: var(--espacamentoMedio);
`;

const ModalContent = styled.div`
  background: var(--corFundoTerciaria);
  border-radius: var(--bordaRaioMedia);
  padding: var(--espacamentoGrande);
  max-width: 600px;
  width: 100%;
  max-height: 80vh;
  overflow-y: auto;
  position: relative;
  box-shadow: var(--sombraForte);
`;

const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--espacamentoGrande);
  padding-bottom: var(--espacamentoMedio);
  border-bottom: 1px solid var(--corBordaPrimaria);
`;

const ModalTitle = styled.h2`
  color: var(--corTextoPrimaria);
  margin: 0;
  display: flex;
  align-items: center;
  gap: var(--espacamentoMedio);
`;

const BotaoFechar = styled.button`
  background: none;
  border: none;
  color: var(--corTextoSecundaria);
  font-size: var(--tamanhoFonteTitulo);
  cursor: pointer;
  padding: var(--espacamentoPequeno);
  border-radius: var(--bordaRaioMedia);
  transition: all var(--transicaoRapida);

  &:hover {
    background: var(--corFundoSecundaria);
    color: var(--corTextoPrimaria);
  }
`;

const ModalBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--espacamentoGrande);
`;

const AbaContainer = styled.div`
  display: flex;
  gap: var(--espacamentoPequeno);
  margin-bottom: var(--espacamentoMedio);
  border-bottom: 1px solid var(--corBordaPrimaria);
`;

const Aba = styled.button`
  background: ${props => props.ativa ? 'var(--corPrimaria)' : 'var(--corFundoSecundaria)'};
  color: ${props => props.ativa ? 'var(--corTextoClara)' : 'var(--corTextoPrimaria)'};
  border: none;
  border-radius: var(--bordaRaioMedia) var(--bordaRaioMedia) 0 0;
  padding: var(--espacamentoPequeno) var(--espacamentoMedio);
  cursor: pointer;
  font-size: var(--tamanhoFonteMedia);
  font-weight: bold;
  transition: all var(--transicaoRapida);

  &:hover {
    background: var(--corPrimaria);
  }
`;

// Estilos para o modal de logs de sincronização
const SyncLogsModal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding: var(--espacamentoMedio);
`;

const SyncLogsContent = styled.div`
  background: var(--corFundoTerciaria);
  border-radius: var(--bordaRaioMedia);
  padding: var(--espacamentoGrande);
  max-width: 800px;
  width: 100%;
  max-height: 80vh;
  overflow-y: auto;
  position: relative;
  box-shadow: var(--sombraForte);
`;

const SyncLogsHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--espacamentoGrande);
  padding-bottom: var(--espacamentoMedio);
  border-bottom: 1px solid var(--corBordaPrimaria);
`;

const SyncLogsTitle = styled.h3`
  color: var(--corTextoPrimaria);
  margin: 0;
  display: flex;
  align-items: center;
  gap: var(--espacamentoMedio);
`;

const SyncLogsActions = styled.div`
  display: flex;
  gap: var(--espacamentoPequeno);
  margin-bottom: var(--espacamentoMedio);
`;

const SyncLogsList = styled.div`
  max-height: 400px;
  overflow-y: auto;
  border: 1px solid var(--corBordaPrimaria);
  border-radius: var(--bordaRaioMedia);
  background: var(--corFundoPrimaria);
`;

const SyncLogItem = styled.div`
  padding: var(--espacamentoMedio);
  border-bottom: 1px solid var(--corBordaPrimaria);
  display: flex;
  align-items: flex-start;
  gap: var(--espacamentoMedio);

  &:last-child {
    border-bottom: none;
  }

  ${props => {
    switch (props.type) {
      case 'error':
        return `
          background: rgba(220, 53, 69, 0.1);
          border-left: 4px solid #dc3545;
        `;
      case 'success':
        return `
          background: rgba(40, 167, 69, 0.1);
          border-left: 4px solid #28a745;
        `;
      case 'info':
        return `
          background: rgba(0, 123, 255, 0.1);
          border-left: 4px solid #007bff;
        `;
      default:
        return '';
    }
  }}
`;

const SyncLogIcon = styled.div`
  color: ${props => {
    switch (props.type) {
      case 'error': return '#dc3545';
      case 'success': return '#28a745';
      case 'info': return '#007bff';
      default: return '#6c757d';
    }
  }};
  font-size: var(--tamanhoFonteMedia);
  margin-top: 2px;
`;

const SyncLogContent = styled.div`
  flex: 1;
`;

const SyncLogMessage = styled.div`
  color: var(--corTextoPrimaria);
  font-weight: 500;
  margin-bottom: var(--espacamentoPequeno);
`;

const SyncLogTimestamp = styled.div`
  color: var(--corTextoSecundaria);
  font-size: var(--tamanhoFontePequena);
`;

const SyncLogDetails = styled.div`
  color: var(--corTextoSecundaria);
  font-size: var(--tamanhoFontePequena);
  margin-top: var(--espacamentoPequeno);
  font-family: monospace;
  background: var(--corFundoSecundaria);
  padding: var(--espacamentoPequeno);
  border-radius: var(--bordaRaioPequena);
  white-space: pre-wrap;
`;

const SyncStatus = styled.div`
  display: flex;
  gap: var(--espacamentoGrande);
  margin-bottom: var(--espacamentoMedio);
  padding: var(--espacamentoMedio);
  background: var(--corFundoSecundaria);
  border-radius: var(--bordaRaioMedia);
`;

const SyncStatusItem = styled.div`
  text-align: center;
`;

const SyncStatusLabel = styled.div`
  color: var(--corTextoSecundaria);
  font-size: var(--tamanhoFontePequena);
  margin-bottom: var(--espacamentoPequeno);
`;

const SyncStatusValue = styled.div`
  color: var(--corTextoPrimaria);
  font-size: var(--tamanhoFonteGrande);
  font-weight: bold;
`;

const SecaoConfiguracao = styled.div`
  background: var(--corFundoTerciaria);
  border-radius: var(--bordaRaioMedia);
  padding: var(--espacamentoGrande);
  box-shadow: var(--sombraLeve);
`;

const SecaoTitulo = styled.h3`
  color: var(--corTextoPrimaria);
  margin-bottom: var(--espacamentoMedio);
  display: flex;
  align-items: center;
  gap: var(--espacamentoMedio);
`;

const SecaoDescricao = styled.p`
  color: var(--corTextoSecundaria);
  margin-bottom: var(--espacamentoMedio);
  font-size: var(--tamanhoFonteMedia);
`;

const FormularioAdicionar = styled.form`
  display: flex;
  flex-direction: column;
  gap: var(--espacamentoMedio);
`;

const CampoFormulario = styled.div`
  display: flex;
  flex-direction: column;
`;

const Label = styled.label`
  color: var(--corTextoPrimaria);
  font-size: var(--tamanhoFonteMedia);
  margin-bottom: var(--espacamentoPequeno);
`;

const Input = styled.input`
  padding: var(--espacamentoMedio);
  border: 2px solid var(--corBordaPrimaria);
  border-radius: var(--bordaRaioMedia);
  font-size: var(--tamanhoFonteMedia);
  background: var(--corFundoTerciaria);
  color: var(--corTextoPrimaria);

  &:focus {
    outline: none;
    border-color: var(--corBordaFoco);
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }
`;

const Select = styled.select`
  padding: var(--espacamentoMedio);
  border: 2px solid var(--corBordaPrimaria);
  border-radius: var(--bordaRaioMedia);
  font-size: var(--tamanhoFonteMedia);
  background: var(--corFundoTerciaria);
  color: var(--corTextoPrimaria);

  &:focus {
    outline: none;
    border-color: var(--corBordaFoco);
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }
`;

const ContainerBotoes = styled.div`
  display: flex;
  gap: var(--espacamentoMedio);
  margin-top: var(--espacamentoMedio);
`;

const BotaoAdicionar = styled.button`
  background: var(--corPrimaria);
  color: var(--corTextoClara);
  border: none;
  border-radius: var(--bordaRaioMedia);
  padding: var(--espacamentoMedio);
  display: flex;
  align-items: center;
  gap: var(--espacamentoMedio);
  cursor: pointer;
  transition: all var(--transicaoRapida);
  font-size: var(--tamanhoFonteMedia);

  &:hover {
    background: var(--corSecundaria);
    transform: translateY(-1px);
  }
`;

const BotaoCancelar = styled(BotaoAdicionar)`
  background: var(--corErro);
  color: var(--corTextoClara);

  &:hover {
    background: #d32f2f;
  }
`;

const BotaoSalvar = styled(BotaoAdicionar)`
  background: var(--corSucesso);
  color: var(--corTextoClara);

  &:hover {
    background: #388e3c;
  }
`;

const ListaCategorias = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--espacamentoPequeno);
`;

const SecaoCategoria = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--espacamentoMedio);
  background: var(--corFundoSecundaria);
  border-radius: var(--bordaRaioMedia);
  border: 1px solid var(--corBordaPrimaria);
`;

const SecaoCategoriaTitulo = styled.h4`
  color: var(--corTextoPrimaria);
  margin: 0;
  display: flex;
  align-items: center;
  gap: var(--espacamentoMedio);
`;

const ItemCategoria = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--espacamentoMedio);
  background: var(--corFundoTerciaria);
  border-radius: var(--bordaRaioMedia);
  border: 1px solid var(--corBordaPrimaria);
`;

const NomeCategoria = styled.span`
  flex: 1;
  color: var(--corTextoPrimaria);
  font-size: var(--tamanhoFonteMedia);
`;

const AcoesCategoria = styled.div`
  display: flex;
  gap: var(--espacamentoPequeno);
`;

const BotaoAcao = styled.button`
  background: ${props => props.variant === 'danger' ? 'var(--corErro)' : props.variant === 'success' ? 'var(--corSucesso)' : 'var(--corPrimaria)'};
  color: var(--corTextoClara);
  border: none;
  border-radius: var(--bordaRaioMedia);
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all var(--transicaoRapida);

  &:hover {
    transform: scale(1.05);
    background: ${props => props.variant === 'danger' ? '#d32f2f' : props.variant === 'success' ? '#388e3c' : 'var(--corSecundaria)'};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
`;

const DescricaoCategoria = styled.p`
  color: var(--corTextoSecundaria);
  font-size: var(--tamanhoFontePequena);
  margin-top: var(--espacamentoPequeno);
`;

const Configuracoes = ({ visivel, onFechar }) => {
  const { 
    categorias,
    adicionarCategoria, 
    removerCategoria, 
    editarCategoria,
    recarregarDados
  } = useNotasAPIContext();

  const [abaAtiva, setAbaAtiva] = useState('categorias');
  const [editandoCategoria, setEditandoCategoria] = useState(null);
  const [formCategoria, setFormCategoria] = useState({ nome: '', descricao: '', cor: '#667eea' });
  
  // Estado para logs de sincronização
  const [syncLogsVisible, setSyncLogsVisible] = useState(false);
  const [syncLogs, setSyncLogs] = useState([]);
  const [syncStatus, setSyncStatus] = useState(null);
  const [loadingSync, setLoadingSync] = useState(false);

  // Se não estiver visível, não renderiza nada
  if (!visivel) return null;



  const handleAdicionarCategoria = async () => {
    if (formCategoria.nome.trim()) {
      try {
        const novaCategoria = {
          nome: formCategoria.nome.trim(),
          descricao: formCategoria.descricao.trim(),
          cor: formCategoria.cor || '#667eea'
        };
        await adicionarCategoria(novaCategoria);
        setFormCategoria({ nome: '', descricao: '', cor: '#667eea' });
      } catch (error) {
        console.error('Erro ao adicionar categoria:', error);
        alert('Erro ao adicionar categoria: ' + error.message);
      }
    }
  };

  const handleEditarCategoria = (index) => {
    const categoria = categorias[index];
    setEditandoCategoria(index);
    setFormCategoria({ 
      nome: categoria.nome, 
      descricao: categoria.descricao || '', 
      cor: categoria.cor || '#667eea' 
    });
  };

  const handleSalvarCategoria = async () => {
    if (formCategoria.nome.trim()) {
      try {
        const categoriaAtual = categorias[editandoCategoria];
        const dadosAtualizados = {
          nome: formCategoria.nome.trim(),
          descricao: formCategoria.descricao.trim(),
          cor: formCategoria.cor || '#667eea'
        };
        await editarCategoria(categoriaAtual.id, dadosAtualizados);
        setEditandoCategoria(null);
        setFormCategoria({ nome: '', descricao: '', cor: '#667eea' });
      } catch (error) {
        console.error('Erro ao salvar categoria:', error);
        alert('Erro ao salvar categoria: ' + error.message);
      }
    }
  };

  const handleCancelarCategoria = () => {
    setEditandoCategoria(null);
    setFormCategoria({ nome: '', descricao: '', cor: '#667eea' });
  };

  const handleRemoverCategoria = async (index) => {
    if (window.confirm('Tem certeza que deseja remover esta categoria?')) {
      try {
        const categoria = categorias[index];
        await removerCategoria(categoria.id);
      } catch (error) {
        console.error('Erro ao remover categoria:', error);
        alert('Erro ao remover categoria: ' + error.message);
      }
    }
  };

  // Funções para logs de sincronização
  const carregarLogsSincronizacao = async () => {
    try {
      setLoadingSync(true);
      const [logsResponse, statusResponse] = await Promise.all([
        syncAPI.buscarLogs(),
        syncAPI.buscarStatus()
      ]);
      setSyncLogs(logsResponse.logs || []);
      setSyncStatus(statusResponse);
    } catch (error) {
      console.error('Erro ao carregar logs de sincronização:', error);
    } finally {
      setLoadingSync(false);
    }
  };

  const abrirModalLogs = async () => {
    setSyncLogsVisible(true);
    await carregarLogsSincronizacao();
  };

  const fecharModalLogs = () => {
    setSyncLogsVisible(false);
  };

  const executarSincronizacaoManual = async () => {
    try {
      setLoadingSync(true);
      await syncAPI.sincronizarManual();
      await carregarLogsSincronizacao();
    } catch (error) {
      console.error('Erro ao executar sincronização manual:', error);
    } finally {
      setLoadingSync(false);
    }
  };

  const limparLogs = async () => {
    try {
      await syncAPI.limparLogs();
      await carregarLogsSincronizacao();
    } catch (error) {
      console.error('Erro ao limpar logs:', error);
    }
  };

  const formatarTimestamp = (timestamp) => {
    return new Date(timestamp).toLocaleString('pt-BR');
  };

  const getIconeTipo = (tipo) => {
    switch (tipo) {
      case 'error': return faTimes;
      case 'success': return faCheck;
      case 'info': return faCog;
      default: return faCog;
    }
  };

  const categoriasPorTipo = {
    projeto: categorias.filter(cat => cat.tipo === 'projeto'),
    anotacao: categorias.filter(cat => cat.tipo === 'anotacao'),
    reuniao: categorias.filter(cat => cat.tipo === 'reuniao')
  };

  return (
    <div style={{ padding: 'var(--espacamentoGrande)' }}>
      <div style={{ 
        background: 'var(--corFundoTerciaria)', 
        borderRadius: 'var(--bordaRaioMedia)', 
        padding: 'var(--espacamentoGrande)',
        boxShadow: 'var(--sombraLeve)'
      }}>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          marginBottom: 'var(--espacamentoGrande)',
          paddingBottom: 'var(--espacamentoMedio)',
          borderBottom: '1px solid var(--corBordaPrimaria)'
        }}>
          <h2 style={{ 
            color: 'var(--corTextoPrimaria)', 
            margin: 0,
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--espacamentoMedio)'
          }}>
            <FontAwesomeIcon icon={faCog} />
            Configurações
          </h2>
          {onFechar && (
            <button 
              onClick={onFechar}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--corTextoSecundaria)',
                fontSize: 'var(--tamanhoFonteTitulo)',
                cursor: 'pointer',
                padding: 'var(--espacamentoPequeno)',
                borderRadius: 'var(--bordaRaioMedia)',
                transition: 'all var(--transicaoRapida)'
              }}
            >
              <FontAwesomeIcon icon={faTimes} />
            </button>
          )}
        </div>

        <div style={{ 
          display: 'flex',
          gap: 'var(--espacamentoPequeno)',
          marginBottom: 'var(--espacamentoMedio)',
          borderBottom: '1px solid var(--corBordaPrimaria)'
        }}>
          <button 
            onClick={() => setAbaAtiva('categorias')}
            style={{
              background: abaAtiva === 'categorias' ? 'var(--corPrimaria)' : 'var(--corFundoSecundaria)',
              color: abaAtiva === 'categorias' ? 'var(--corTextoClara)' : 'var(--corTextoPrimaria)',
              border: 'none',
              borderRadius: 'var(--bordaRaioMedia) var(--bordaRaioMedia) 0 0',
              padding: 'var(--espacamentoPequeno) var(--espacamentoMedio)',
              cursor: 'pointer',
              fontSize: 'var(--tamanhoFonteMedia)',
              fontWeight: 'bold',
              transition: 'all var(--transicaoRapida)'
            }}
          >
            <FontAwesomeIcon icon={faTags} />
            Categorias
          </button>
          <button 
            onClick={() => setAbaAtiva('categorias')}
            style={{
              background: abaAtiva === 'categorias' ? 'var(--corPrimaria)' : 'var(--corFundoSecundaria)',
              color: abaAtiva === 'categorias' ? 'var(--corTextoClara)' : 'var(--corTextoPrimaria)',
              border: 'none',
              borderRadius: 'var(--bordaRaioMedia) var(--bordaRaioMedia) 0 0',
              padding: 'var(--espacamentoPequeno) var(--espacamentoMedio)',
              cursor: 'pointer',
              fontSize: 'var(--tamanhoFonteMedia)',
              fontWeight: 'bold',
              transition: 'all var(--transicaoRapida)'
            }}
          >
                          <FontAwesomeIcon icon={faFolder} />
              Categorias
          </button>
          <button 
            onClick={() => setAbaAtiva('sincronizacao')}
            style={{
              background: abaAtiva === 'sincronizacao' ? 'var(--corPrimaria)' : 'var(--corFundoSecundaria)',
              color: abaAtiva === 'sincronizacao' ? 'var(--corTextoClara)' : 'var(--corTextoPrimaria)',
              border: 'none',
              borderRadius: 'var(--bordaRaioMedia) var(--bordaRaioMedia) 0 0',
              padding: 'var(--espacamentoPequeno) var(--espacamentoMedio)',
              cursor: 'pointer',
              fontSize: 'var(--tamanhoFonteMedia)',
              fontWeight: 'bold',
              transition: 'all var(--transicaoRapida)'
            }}
          >
            <FontAwesomeIcon icon={faSync} />
            Sincronização
          </button>
        </div>

        {abaAtiva === 'categorias' && (
          <div>
            <h3>Gerenciar Categorias</h3>
            <p>Funcionalidade de categorias será implementada aqui.</p>
          </div>
        )}

                  {abaAtiva === 'categorias' && (
          <div>
            <SecaoConfiguracao>
              <SecaoTitulo>
                <FontAwesomeIcon icon={faFolder} />
                Gerenciar Categorias
              </SecaoTitulo>
              <SecaoDescricao>
                Crie e gerencie categorias para organizar suas notas. As categorias ajudam a categorizar e encontrar suas notas mais facilmente.
              </SecaoDescricao>

              {/* Formulário para adicionar/editar tópico */}
              <FormularioAdicionar onSubmit={(e) => {
                e.preventDefault();
                if (editandoCategoria !== null) {
                  handleSalvarCategoria();
                } else {
                  handleAdicionarCategoria();
                }
              }}>
                <CampoFormulario>
                  <Label>Nome da Categoria *</Label>
                  <Input
                    type="text"
                    value={formCategoria.nome}
                    onChange={(e) => setFormCategoria({ ...formCategoria, nome: e.target.value })}
                    placeholder="Ex: Trabalho, Pessoal, Projetos..."
                    maxLength={50}
                    required
                  />
                </CampoFormulario>

                <CampoFormulario>
                  <Label>Descrição</Label>
                  <Input
                    type="text"
                    value={formCategoria.descricao}
                    onChange={(e) => setFormCategoria({ ...formCategoria, descricao: e.target.value })}
                    placeholder="Descrição opcional da categoria..."
                    maxLength={200}
                  />
                </CampoFormulario>

                <CampoFormulario>
                  <Label>Cor</Label>
                  <Input
                    type="color"
                    value={formCategoria.cor || '#667eea'}
                    onChange={(e) => setFormCategoria({ ...formCategoria, cor: e.target.value })}
                    style={{ width: '100px', height: '40px' }}
                  />
                </CampoFormulario>

                <ContainerBotoes>
                  {editandoCategoria !== null ? (
                    <>
                      <BotaoSalvar type="submit">
                        <FontAwesomeIcon icon={faCheck} />
                        Salvar Alterações
                      </BotaoSalvar>
                      <BotaoCancelar type="button" onClick={handleCancelarCategoria}>
                        <FontAwesomeIcon icon={faTimes} />
                        Cancelar
                      </BotaoCancelar>
                    </>
                  ) : (
                    <BotaoAdicionar type="submit">
                      <FontAwesomeIcon icon={faPlus} />
                      Adicionar Categoria
                    </BotaoAdicionar>
                  )}
                </ContainerBotoes>
              </FormularioAdicionar>

              {/* Lista de tópicos */}
              <div style={{ marginTop: 'var(--espacamentoGrande)' }}>
                <h4 style={{ color: 'var(--corTextoPrimaria)', marginBottom: 'var(--espacamentoMedio)' }}>
                  Categorias Existentes ({categorias ? categorias.length : 0})
                </h4>
                
                {!categorias || categorias.length === 0 ? (
                  <p style={{ color: 'var(--corTextoSecundaria)', textAlign: 'center', padding: 'var(--espacamentoGrande)' }}>
                    Nenhuma categoria criada ainda. Crie sua primeira categoria acima!
                  </p>
                ) : (
                  <ListaCategorias>
                    {categorias && categorias.map((categoria, index) => (
                      <ItemCategoria key={categoria.id || index}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--espacamentoMedio)', flex: 1 }}>
                          <div 
                            style={{ 
                              width: '20px', 
                              height: '20px', 
                              borderRadius: '50%', 
                              backgroundColor: categoria.cor || '#667eea',
                              border: '2px solid var(--corBordaPrimaria)'
                            }} 
                          />
                          <div style={{ flex: 1 }}>
                            <NomeCategoria>{categoria.nome}</NomeCategoria>
                            {categoria.descricao && (
                              <DescricaoCategoria>{categoria.descricao}</DescricaoCategoria>
                            )}
                          </div>
                        </div>
                        <AcoesCategoria>
                          <BotaoAcao
                            onClick={() => handleEditarCategoria(index)}
                            title="Editar categoria"
                          >
                            <FontAwesomeIcon icon={faEdit} />
                          </BotaoAcao>
                          <BotaoAcao
                            variant="danger"
                            onClick={() => handleRemoverCategoria(index)}
                            title="Remover categoria"
                          >
                            <FontAwesomeIcon icon={faTrash} />
                          </BotaoAcao>
                        </AcoesCategoria>
                      </ItemCategoria>
                    ))}
                  </ListaCategorias>
                )}
              </div>
            </SecaoConfiguracao>
          </div>
        )}

        {abaAtiva === 'sincronizacao' && (
          <div>
            <h3>Sincronização com Firebase</h3>
            <p>Gerencie a sincronização de dados entre dispositivos através do Firebase.</p>
            
            <div style={{ display: 'flex', gap: 'var(--espacamentoMedio)', marginTop: 'var(--espacamentoMedio)' }}>
              <button 
                onClick={abrirModalLogs}
                style={{
                  background: 'var(--corPrimaria)',
                  color: 'var(--corTextoClara)',
                  border: 'none',
                  borderRadius: 'var(--bordaRaioMedia)',
                  padding: 'var(--espacamentoMedio)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--espacamentoMedio)',
                  cursor: 'pointer',
                  transition: 'all var(--transicaoRapida)',
                  fontSize: 'var(--tamanhoFonteMedia)'
                }}
              >
                <FontAwesomeIcon icon={faEye} />
                Ver Logs de Sincronização
              </button>
              <button 
                onClick={executarSincronizacaoManual} 
                disabled={loadingSync}
                style={{
                  background: 'var(--corPrimaria)',
                  color: 'var(--corTextoClara)',
                  border: 'none',
                  borderRadius: 'var(--bordaRaioMedia)',
                  padding: 'var(--espacamentoMedio)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--espacamentoMedio)',
                  cursor: loadingSync ? 'not-allowed' : 'pointer',
                  transition: 'all var(--transicaoRapida)',
                  fontSize: 'var(--tamanhoFonteMedia)',
                  opacity: loadingSync ? 0.5 : 1
                }}
              >
                <FontAwesomeIcon icon={faPlay} />
                {loadingSync ? 'Sincronizando...' : 'Sincronizar Agora'}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modal de Logs de Sincronização */}
      {syncLogsVisible && (
        <SyncLogsModal onClick={fecharModalLogs}>
          <SyncLogsContent onClick={(e) => e.stopPropagation()}>
            <SyncLogsHeader>
              <SyncLogsTitle>
                <FontAwesomeIcon icon={faSync} />
                Logs de Sincronização
              </SyncLogsTitle>
              <BotaoFechar onClick={fecharModalLogs}>
                <FontAwesomeIcon icon={faTimes} />
              </BotaoFechar>
            </SyncLogsHeader>

            {syncStatus && (
              <SyncStatus>
                <SyncStatusItem>
                  <SyncStatusLabel>Total de Logs</SyncStatusLabel>
                  <SyncStatusValue>{syncStatus.stats?.total || 0}</SyncStatusValue>
                </SyncStatusItem>
                <SyncStatusItem>
                  <SyncStatusLabel>Sucessos</SyncStatusLabel>
                  <SyncStatusValue style={{ color: '#28a745' }}>
                    {syncStatus.stats?.success || 0}
                  </SyncStatusValue>
                </SyncStatusItem>
                <SyncStatusItem>
                  <SyncStatusLabel>Erros</SyncStatusLabel>
                  <SyncStatusValue style={{ color: '#dc3545' }}>
                    {syncStatus.stats?.errors || 0}
                  </SyncStatusValue>
                </SyncStatusItem>
                <SyncStatusItem>
                  <SyncStatusLabel>Informações</SyncStatusLabel>
                  <SyncStatusValue style={{ color: '#007bff' }}>
                    {syncStatus.stats?.info || 0}
                  </SyncStatusValue>
                </SyncStatusItem>
              </SyncStatus>
            )}

            <SyncLogsActions>
              <BotaoAdicionar onClick={carregarLogsSincronizacao} disabled={loadingSync}>
                <FontAwesomeIcon icon={faSync} />
                {loadingSync ? 'Carregando...' : 'Atualizar'}
              </BotaoAdicionar>
              <BotaoAdicionar onClick={executarSincronizacaoManual} disabled={loadingSync}>
                <FontAwesomeIcon icon={faPlay} />
                Sincronizar Agora
              </BotaoAdicionar>
              <BotaoCancelar onClick={limparLogs}>
                <FontAwesomeIcon icon={faTrashAlt} />
                Limpar Logs
              </BotaoCancelar>
            </SyncLogsActions>

            <SyncLogsList>
              {loadingSync ? (
                <div style={{ padding: 'var(--espacamentoGrande)', textAlign: 'center' }}>
                  Carregando logs...
                </div>
              ) : syncLogs.length === 0 ? (
                <div style={{ padding: 'var(--espacamentoGrande)', textAlign: 'center', color: 'var(--corTextoSecundaria)' }}>
                  Nenhum log de sincronização encontrado.
                </div>
              ) : (
                syncLogs.map((log) => (
                  <SyncLogItem key={log.id} type={log.type}>
                    <SyncLogIcon type={log.type}>
                      <FontAwesomeIcon icon={getIconeTipo(log.type)} />
                    </SyncLogIcon>
                    <SyncLogContent>
                      <SyncLogMessage>{log.message}</SyncLogMessage>
                      <SyncLogTimestamp>{formatarTimestamp(log.timestamp)}</SyncLogTimestamp>
                      {log.details && Object.keys(log.details).length > 0 && (
                        <SyncLogDetails>
                          {JSON.stringify(log.details, null, 2)}
                        </SyncLogDetails>
                      )}
                    </SyncLogContent>
                  </SyncLogItem>
                ))
              )}
            </SyncLogsList>
          </SyncLogsContent>
        </SyncLogsModal>
      )}
    </div>
  );
};

export default Configuracoes; 