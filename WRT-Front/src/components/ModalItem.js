import React, { useState, useEffect, useRef, useCallback } from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faSave, faTrash, faCheck, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import { useNotasAPIContext } from '../context/NotasAPIContext';
import EditorTexto from './EditorTexto';
import Loading from './Loading';

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: var(--corFundoModal);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: var(--zIndexModal);
  backdrop-filter: blur(5px);
  padding: var(--espacamentoGrande);
`;

const ModalContainer = styled.div`
  background: var(--corFundoTerciaria);
  border-radius: var(--bordaRaioGrande);
  box-shadow: var(--sombraForte);
  width: 100%;
  max-width: 1000px;
  max-height: 85vh;
  overflow: hidden;
  animation: fadeIn 0.3s ease-out;
  display: flex;
  flex-direction: column;
`;

const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--espacamentoMedio);
  border-bottom: 1px solid var(--corBordaPrimaria);
  background: var(--corFundoSecundaria);
  flex-shrink: 0;
`;

const ModalTitle = styled.h2`
  color: var(--corTextoPrimaria);
  font-size: var(--tamanhoFonteExtraGrande);
  margin: 0;
`;

const BotaoFechar = styled.button`
  background: none;
  border: none;
  color: var(--corTextoSecundaria);
  font-size: var(--tamanhoFonteExtraGrande);
  cursor: pointer;
  padding: var(--espacamentoPequeno);
  border-radius: var(--bordaRaioPequena);
  transition: all var(--transicaoRapida);

  &:hover {
    background: var(--corFundoSecundaria);
    color: var(--corTextoPrimaria);
  }
`;

const ModalContent = styled.div`
  padding: var(--espacamentoMedio);
  overflow-y: auto;
  flex: 1;
  min-height: 0;
  max-height: calc(85vh - 80px); /* Altura máxima menos o header */
`;

const FormGroup = styled.div`
  margin-bottom: var(--espacamentoMedio);
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--espacamentoMedio);
  margin-bottom: var(--espacamentoMedio);

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: var(--espacamentoMedio);
  }
`;

const Label = styled.label`
  display: block;
  margin-bottom: var(--espacamentoPequeno);
  color: var(--corTextoPrimaria);
  font-weight: 600;
  font-size: var(--tamanhoFonteMedia);
`;

const Input = styled.input`
  width: 100%;
  padding: var(--espacamentoMedio);
  border: 2px solid var(--corBordaPrimaria);
  border-radius: var(--bordaRaioMedia);
  font-size: var(--tamanhoFonteMedia);
  background: var(--corFundoTerciaria);
  color: var(--corTextoPrimaria);
  transition: all var(--transicaoRapida);

  &:focus {
    outline: none;
    border-color: var(--corBordaFoco);
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }

  &::placeholder {
    color: var(--corTextoTerciaria);
  }
`;

const Select = styled.select`
  width: 100%;
  padding: var(--espacamentoMedio);
  border: 2px solid var(--corBordaPrimaria);
  border-radius: var(--bordaRaioMedia);
  font-size: var(--tamanhoFonteMedia);
  background: var(--corFundoTerciaria);
  color: var(--corTextoPrimaria);
  cursor: pointer;
  transition: all var(--transicaoRapida);

  &:focus {
    outline: none;
    border-color: var(--corBordaFoco);
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }
`;

const Option = styled.option`
  background: var(--corFundoTerciaria);
  color: var(--corTextoPrimaria);
  padding: var(--espacamentoPequeno);
`;



const ModalFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--espacamentoGrande);
  border-top: 1px solid var(--corBordaPrimaria);
  background: var(--corFundoSecundaria);
  flex-shrink: 0;
`;

const BotaoAcao = styled.button`
  display: flex;
  align-items: center;
  gap: var(--espacamentoPequeno);
  padding: var(--espacamentoMedio) var(--espacamentoGrande);
  border: none;
  border-radius: var(--bordaRaioMedia);
  font-size: var(--tamanhoFonteMedia);
  font-weight: 600;
  cursor: pointer;
  transition: all var(--transicaoRapida);

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const BotaoSalvar = styled(BotaoAcao)`
  background: var(--corPrimaria);
  color: var(--corTextoClara);

  &:hover:not(:disabled) {
    background: var(--corSecundaria);
    transform: translateY(-2px);
  }
`;

const BotaoExcluir = styled.button`
  background: var(--corErro);
  color: var(--corTextoClara);
  border: none;
  padding: var(--espacamentoMedio) var(--espacamentoGrande);
  border-radius: var(--bordaRaioMedia);
  font-size: var(--tamanhoFonteMedia);
  font-weight: 600;
  cursor: pointer;
  transition: all var(--transicaoRapida);
  display: flex;
  align-items: center;
  gap: var(--espacamentoPequeno);

  &:hover {
    background: var(--corErroHover);
    transform: translateY(-1px);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

const BotaoCancelar = styled(BotaoAcao)`
  background: var(--corTextoSecundaria);
  color: var(--corTextoClara);

  &:hover:not(:disabled) {
    background: var(--corTextoPrimaria);
    transform: translateY(-2px);
  }
`;

const MensagemErro = styled.div`
  color: var(--corErro);
  font-size: var(--tamanhoFontePequena);
  margin-top: var(--espacamentoPequeno);
`;

const ContainerBotoes = styled.div`
  display: flex;
  gap: var(--espacamentoMedio);
`;

const StatusIndicator = styled.div`
  display: flex;
  align-items: center;
  gap: var(--espacamentoPequeno);
  font-size: var(--tamanhoFontePequena);
  color: var(--corTextoSecundaria);
  margin-left: auto;
  margin-right: var(--espacamentoMedio);
`;

const StatusText = styled.span`
  color: ${props => {
    if (props.status === 'salvando') return 'var(--corAviso)';
    if (props.status === 'salvo') return 'var(--corSucesso)';
    if (props.status === 'erro') return 'var(--corErro)';
    return 'var(--corTextoSecundaria)';
  }};
`;

const ModalItem = ({ 
  visivel, 
  tipo, 
  item = null, 
  onSalvar, 
  onExcluir, 
  onFechar,
  carregando = false 
}) => {
  const { categorias } = useNotasAPIContext();
  const [formData, setFormData] = useState({
    titulo: '',
    conteudo: '',
    topico: ''
  });

  const [statusSalvamento, setStatusSalvamento] = useState('salvo'); // 'salvo', 'salvando', 'erro'
  const [ultimoSalvamento, setUltimoSalvamento] = useState(null);

  const ultimaModificacaoRef = useRef(null);

  // Inicializar dados do formulário quando item mudar
  useEffect(() => {
    if (item) {
      setFormData({
        titulo: item.titulo || '',
        conteudo: item.conteudo || '',
        topico: item.topico || ''
      });
      setStatusSalvamento('salvo');
      setUltimoSalvamento(new Date());
    } else {
      setFormData({
        titulo: '',
        conteudo: '',
        topico: ''
      });
      setStatusSalvamento('salvo');
      setUltimoSalvamento(null);
    }
  }, [item]);

  // Executar salvamento
  const executarSalvamento = useCallback(async () => {
    if (!validarFormulario()) return;

    console.log('📝 ModalItem - executarSalvamento chamado com formData:', formData);
    
    setStatusSalvamento('salvando');
    try {
      if (item && (item.id || item._id)) {
        // Atualizar nota existente
        const notaId = item.id || item._id;
        console.log('📝 ModalItem - Atualizando nota com ID:', notaId);
        await onSalvar(notaId, formData);
      } else {
        // Criar nova nota
        console.log('📝 ModalItem - Criando nova nota');
        await onSalvar(null, formData);
      }
      setStatusSalvamento('salvo');
      setUltimoSalvamento(new Date());
    } catch (error) {
      console.error('Erro ao salvar automaticamente:', error);
      setStatusSalvamento('erro');
    }
  }, [formData, item, onSalvar]);

  // Auto-save desabilitado - notas só são salvas manualmente
  // useEffect(() => {
  //   // Só agenda auto-save se estiver ativo e houver modificações
  //   if (modificacoes && autoSaveAtivo) {
  //     const timeoutId = setTimeout(() => {
  //       if (modificacoes && validarFormulario()) {
  //         executarSalvamento();
  //       }
  //     }, 2000);
  //     
  //     return () => clearTimeout(timeoutId);
  //   }
  // }, [modificacoes, autoSaveAtivo, executarSalvamento]);

  const validarFormulario = () => {
    return formData.titulo.trim() !== '' && formData.conteudo.trim() !== '';
  };

  const handleSalvar = async () => {
    if (!validarFormulario()) {
      alert('Por favor, preencha o título e o conteúdo da nota.');
      return;
    }

    await executarSalvamento();
  };

  const handleExcluir = () => {
    if (!item || !(item.id || item._id)) {
      alert('Não é possível excluir uma nota que ainda não foi salva.');
      return;
    }

    const confirmacao = window.confirm(
      `Tem certeza que deseja excluir a nota "${item.titulo}"?\n\nEsta ação não pode ser desfeita.`
    );

    if (confirmacao) {
      const notaId = item.id || item._id;
      onExcluir(notaId);
    }
  };

  const handleInputChange = (campo, valor) => {
    setFormData(prev => ({ ...prev, [campo]: valor }));
    ultimaModificacaoRef.current = new Date();
  };

  const obterTituloModal = () => {
    return item ? 'Editar Nota' : 'Nova Nota';
  };

  const obterCategorias = () => {
    // Usar as categorias reais do banco de dados
    return categorias.map(categoria => ({ 
      value: categoria.nome, 
      label: categoria.nome,
      cor: categoria.cor,
      descricao: categoria.descricao
    }));
  };

  const obterStatusText = () => {
    switch (statusSalvamento) {
      case 'salvando':
        return 'Salvando...';
      case 'salvo':
        return ultimoSalvamento ? `Salvo às ${ultimoSalvamento.toLocaleTimeString()}` : 'Salvo';
      case 'erro':
        return 'Erro ao salvar';
      default:
        return '';
    }
  };

  const obterStatusIcon = () => {
    switch (statusSalvamento) {
      case 'salvando':
        return faExclamationTriangle;
      case 'salvo':
        return faCheck;
      case 'erro':
        return faExclamationTriangle;
      default:
        return null;
    }
  };

  if (!visivel) return null;

  return (
    <ModalOverlay onClick={onFechar}>
      <ModalContainer onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <ModalTitle>{obterTituloModal()}</ModalTitle>
          
          <StatusIndicator>
            <StatusText status={statusSalvamento}>
              {obterStatusIcon() && <FontAwesomeIcon icon={obterStatusIcon()} />}
              {obterStatusText()}
            </StatusText>
          </StatusIndicator>

          <BotaoFechar onClick={onFechar}>
            <FontAwesomeIcon icon={faTimes} />
          </BotaoFechar>
        </ModalHeader>

        <ModalContent>
          <FormGrid>
            <FormGroup>
              <Label>Título *</Label>
              <Input
                type="text"
                value={formData.titulo}
                onChange={(e) => handleInputChange('titulo', e.target.value)}
                placeholder="Digite o título da nota..."
              />
            </FormGroup>

            <FormGroup>
              <Label>Tópico</Label>
              <Select
                value={formData.topico}
                onChange={(e) => handleInputChange('topico', e.target.value)}
              >
                <Option value="">Selecione um tópico...</Option>
                {obterCategorias().map(cat => (
                  <Option key={cat.value} value={cat.value}>
                    {cat.label}
                  </Option>
                ))}
              </Select>
              

              
              {/* Lista de categorias disponíveis */}
              {categorias && categorias.length > 0 && (
                <div style={{ 
                  marginTop: 'var(--espacamentoMedio)',
                  fontSize: 'var(--tamanhoFontePequena)',
                  color: 'var(--corTextoSecundaria)'
                }}>
                  <div style={{ marginBottom: 'var(--espacamentoPequeno)' }}>
                    Categorias disponíveis ({categorias ? categorias.length : 0}):
                  </div>
                  <div style={{ 
                    display: 'flex', 
                    flexWrap: 'wrap', 
                    gap: 'var(--espacamentoPequeno)',
                    maxHeight: '100px',
                    overflowY: 'auto'
                  }}>
                    {categorias.map(categoria => (
                      <div 
                        key={categoria.id}
                        style={{ 
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                          padding: '4px 8px',
                          backgroundColor: formData.topico === categoria.nome ? 'var(--corPrimaria)' : 'var(--corFundoTerciaria)',
                          color: formData.topico === categoria.nome ? 'var(--corTextoClara)' : 'var(--corTextoPrimaria)',
                          borderRadius: 'var(--bordaRaioPequena)',
                          border: `1px solid ${formData.topico === categoria.nome ? 'var(--corPrimaria)' : 'var(--corBordaPrimaria)'}`,
                          fontSize: 'var(--tamanhoFontePequena)',
                          cursor: 'pointer',
                          transition: 'all var(--transicaoRapida)',
                          transform: formData.topico === categoria.nome ? 'scale(1.05)' : 'scale(1)'
                        }}
                        onMouseEnter={(e) => {
                          if (formData.topico !== categoria.nome) {
                            e.target.style.backgroundColor = 'var(--corFundoSecundaria)';
                            e.target.style.transform = 'scale(1.02)';
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (formData.topico !== categoria.nome) {
                            e.target.style.backgroundColor = 'var(--corFundoTerciaria)';
                            e.target.style.transform = 'scale(1)';
                          }
                        }}
                        onClick={() => handleInputChange('topico', categoria.nome)}
                        title={categoria.descricao || categoria.nome}
                      >
                        <div 
                          style={{ 
                            width: '8px', 
                            height: '8px', 
                            borderRadius: '50%', 
                            backgroundColor: categoria.cor || '#667eea',
                            border: '1px solid var(--corBordaPrimaria)'
                          }} 
                        />
                        {categoria.nome}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </FormGroup>
          </FormGrid>

          <FormGroup>
            <Label>Conteúdo *</Label>
            <EditorTexto
              valor={formData.conteudo}
              onChange={(valor) => handleInputChange('conteudo', valor)}
              placeholder="Digite o conteúdo da nota..."
              alturaMinima="300px"
              alturaMaxima="600px"
            />
          </FormGroup>


        </ModalContent>

        <ModalFooter>
          <div>
            {item && (item.id || item._id) && (
              <BotaoExcluir onClick={handleExcluir} disabled={carregando}>
                <FontAwesomeIcon icon={faTrash} />
                Excluir Nota
              </BotaoExcluir>
            )}
          </div>

          <div style={{ display: 'flex', gap: 'var(--espacamentoMedio)' }}>
            <BotaoCancelar onClick={onFechar} disabled={carregando}>
              Cancelar
            </BotaoCancelar>
            <BotaoSalvar onClick={handleSalvar} disabled={carregando || !validarFormulario()}>
              {carregando ? (
                <Loading tamanho="14px" />
              ) : (
                <>
                  <FontAwesomeIcon icon={faSave} />
                  Salvar
                </>
              )}
            </BotaoSalvar>
          </div>
        </ModalFooter>
      </ModalContainer>
    </ModalOverlay>
  );
};

export default ModalItem; 