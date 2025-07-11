import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faPlus, 
  faEdit, 
  faTrash, 
  faTimes,
  faCheck,
  faGripVertical,
  faExternalLinkAlt
} from '@fortawesome/free-solid-svg-icons';

const Container = styled.div`
  padding: var(--espacamentoGrande);
  min-height: 100vh;
  background: var(--corFundoPrimaria);
`;

const Titulo = styled.h1`
  color: var(--corTextoPrimaria);
  text-align: center;
  margin-bottom: var(--espacamentoGrande);
  font-size: var(--tamanhoFonteExtraGrande);
  font-weight: 700;
`;

const GradeContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  grid-template-rows: repeat(5, 1fr);
  gap: var(--espacamentoGrande);
  max-width: 1200px;
  margin: 0 auto;
  padding: var(--espacamentoGrande);
`;

const IconeItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--espacamentoGrande);
  background: var(--corFundoTerciaria);
  border: 2px solid var(--corBordaPrimaria);
  border-radius: var(--bordaRaioGrande);
  cursor: pointer;
  transition: all var(--transicaoRapida);
  position: relative;
  min-height: 120px;

  &:hover {
    transform: translateY(-5px);
    box-shadow: var(--sombraMedia);
    border-color: var(--corPrimaria);
    background: var(--corFundoSecundaria);
  }

  &.arrastando {
    opacity: 0.5;
    transform: rotate(5deg);
  }

  &.sobre {
    border-color: var(--corSecundaria);
    background: var(--corFundoSecundaria);
  }
`;

const IconeImagem = styled.img`
  width: 48px;
  height: 48px;
  object-fit: contain;
  margin-bottom: var(--espacamentoMedio);
  border-radius: var(--bordaRaioMedia);
  transition: all var(--transicaoRapida);

  ${IconeItem}:hover & {
    transform: scale(1.1);
  }
`;

const IconeTexto = styled.span`
  color: var(--corTextoPrimaria);
  font-size: var(--tamanhoFonteMedia);
  font-weight: 600;
  text-align: center;
  word-break: break-word;
  max-width: 100%;
`;

const AcoesIcone = styled.div`
  position: absolute;
  top: var(--espacamentoPequeno);
  right: var(--espacamentoPequeno);
  display: flex;
  gap: var(--espacamentoPequeno);
  opacity: 0;
  transition: opacity var(--transicaoRapida);

  ${IconeItem}:hover & {
    opacity: 1;
  }
`;

const BotaoAcao = styled.button`
  background: var(--corFundoTerciaria);
  color: var(--corTextoSecundaria);
  border: 1px solid var(--corBordaPrimaria);
  border-radius: var(--bordaRaioPequena);
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all var(--transicaoRapida);
  font-size: var(--tamanhoFontePequena);

  &:hover {
    background: var(--corPrimaria);
    color: var(--corTextoClara);
    border-color: var(--corPrimaria);
    transform: scale(1.1);
  }

  &.danger:hover {
    background: var(--corErro);
    border-color: var(--corErro);
  }
`;

const BotaoAdicionar = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--espacamentoGrande);
  background: var(--corFundoSecundaria);
  border: 2px dashed var(--corBordaPrimaria);
  border-radius: var(--bordaRaioGrande);
  cursor: pointer;
  transition: all var(--transicaoRapida);
  min-height: 120px;

  &:hover {
    border-color: var(--corPrimaria);
    background: var(--corFundoTerciaria);
    transform: translateY(-2px);
  }
`;

const IconeAdicionar = styled.div`
  color: var(--corPrimaria);
  font-size: 48px;
  margin-bottom: var(--espacamentoMedio);
`;

const TextoAdicionar = styled.span`
  color: var(--corTextoSecundaria);
  font-size: var(--tamanhoFonteMedia);
  font-weight: 600;
`;

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
  padding: var(--espacamentoMedio);
`;

const ModalContainer = styled.div`
  background: var(--corFundoTerciaria);
  border-radius: var(--bordaRaioGrande);
  box-shadow: var(--sombraForte);
  width: 100%;
  max-width: 500px;
  overflow: hidden;
  animation: fadeIn 0.3s ease-out;
`;

const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--espacamentoGrande);
  border-bottom: 1px solid var(--corBordaPrimaria);
  background: var(--corFundoSecundaria);
`;

const ModalTitle = styled.h2`
  color: var(--corTextoPrimaria);
  font-size: var(--tamanhoFonteGrande);
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
    background: var(--corFundoTerciaria);
    color: var(--corTextoPrimaria);
  }
`;

const ModalContent = styled.div`
  padding: var(--espacamentoGrande);
`;

const CampoFormulario = styled.div`
  margin-bottom: var(--espacamentoGrande);
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
  background: var(--corFundoSecundaria);
  color: var(--corTextoPrimaria);
  transition: all var(--transicaoRapida);

  &:focus {
    outline: none;
    border-color: var(--corBordaFoco);
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }
`;

const ContainerBotoes = styled.div`
  display: flex;
  gap: var(--espacamentoMedio);
  justify-content: flex-end;
`;

const BotaoFormulario = styled.button`
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

const BotaoSalvar = styled(BotaoFormulario)`
  background: var(--corPrimaria);
  color: var(--corTextoClara);

  &:hover:not(:disabled) {
    background: var(--corSecundaria);
  }
`;

const BotaoCancelar = styled(BotaoFormulario)`
  background: var(--corTextoSecundaria);
  color: var(--corTextoClara);

  &:hover:not(:disabled) {
    background: var(--corTextoPrimaria);
  }
`;

const PreviewContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: var(--espacamentoMedio);
  background: var(--corFundoSecundaria);
  border-radius: var(--bordaRaioMedia);
  margin-top: var(--espacamentoMedio);
`;

const PreviewImagem = styled.img`
  width: 32px;
  height: 32px;
  object-fit: contain;
  margin-bottom: var(--espacamentoPequeno);
  border-radius: var(--bordaRaioPequena);
`;

const PreviewTexto = styled.span`
  color: var(--corTextoSecundaria);
  font-size: var(--tamanhoFontePequena);
  text-align: center;
`;

const TelaInicial = () => {
  const [icones, setIcones] = useState([]);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [editando, setEditando] = useState(null);
  const [formData, setFormData] = useState({
    nome: '',
    urlIcone: '',
    urlDestino: ''
  });
  const [arrastando, setArrastando] = useState(null);
  const [sobre, setSobre] = useState(null);

  // Carregar ícones do localStorage
  useEffect(() => {
    const iconesSalvos = localStorage.getItem('wrtmind_icones_iniciais');
    if (iconesSalvos) {
      try {
        setIcones(JSON.parse(iconesSalvos));
      } catch (error) {
        console.error('Erro ao carregar ícones:', error);
      }
    }
  }, []);

  // Salvar ícones no localStorage
  useEffect(() => {
    localStorage.setItem('wrtmind_icones_iniciais', JSON.stringify(icones));
  }, [icones]);

  const handleAdicionar = () => {
    setEditando(null);
    setFormData({
      nome: '',
      urlIcone: '',
      urlDestino: ''
    });
    setMostrarModal(true);
  };

  const handleEditar = (icone, index) => {
    setEditando(index);
    setFormData({
      nome: icone.nome,
      urlIcone: icone.urlIcone,
      urlDestino: icone.urlDestino
    });
    setMostrarModal(true);
  };

  const handleSalvar = () => {
    if (formData.nome.trim() && formData.urlIcone.trim() && formData.urlDestino.trim()) {
      const novoIcone = {
        id: editando !== null ? icones[editando].id : Date.now(),
        nome: formData.nome.trim(),
        urlIcone: formData.urlIcone.trim(),
        urlDestino: formData.urlDestino.trim()
      };

      if (editando !== null) {
        const novosIcones = [...icones];
        novosIcones[editando] = novoIcone;
        setIcones(novosIcones);
      } else {
        setIcones([...icones, novoIcone]);
      }

      setMostrarModal(false);
      setEditando(null);
      setFormData({ nome: '', urlIcone: '', urlDestino: '' });
    }
  };

  const handleCancelar = () => {
    setMostrarModal(false);
    setEditando(null);
    setFormData({ nome: '', urlIcone: '', urlDestino: '' });
  };

  const handleRemover = (index) => {
    if (window.confirm('Tem certeza que deseja remover este ícone?')) {
      const novosIcones = icones.filter((_, i) => i !== index);
      setIcones(novosIcones);
    }
  };

  const handleClick = (icone) => {
    if (icone.urlDestino) {
      window.open(icone.urlDestino, '_blank');
    }
  };

  // Drag & Drop
  const handleDragStart = (e, index) => {
    setArrastando(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    if (arrastando !== null && arrastando !== index) {
      setSobre(index);
    }
  };

  const handleDragLeave = () => {
    setSobre(null);
  };

  const handleDrop = (e, index) => {
    e.preventDefault();
    if (arrastando !== null && arrastando !== index) {
      const novosIcones = [...icones];
      const [itemMovido] = novosIcones.splice(arrastando, 1);
      novosIcones.splice(index, 0, itemMovido);
      setIcones(novosIcones);
    }
    setArrastando(null);
    setSobre(null);
  };

  const handleDragEnd = () => {
    setArrastando(null);
    setSobre(null);
  };

  const handleInputChange = (campo, valor) => {
    setFormData(prev => ({
      ...prev,
      [campo]: valor
    }));
  };

  // Criar grade 7x5 (35 posições)
  const posicoes = Array.from({ length: 35 }, (_, i) => i);

  return (
    <Container>
      <Titulo>WRTmind</Titulo>
      
      <GradeContainer>
        {posicoes.map((posicao) => {
          const icone = icones[posicao];
          
          if (!icone) {
            // Posição vazia - mostrar botão de adicionar
            return (
              <BotaoAdicionar key={posicao} onClick={handleAdicionar}>
                <IconeAdicionar>
                  <FontAwesomeIcon icon={faPlus} />
                </IconeAdicionar>
                <TextoAdicionar>Adicionar Ícone</TextoAdicionar>
              </BotaoAdicionar>
            );
          }

          return (
            <IconeItem
              key={icone.id}
              className={`${arrastando === posicao ? 'arrastando' : ''} ${sobre === posicao ? 'sobre' : ''}`}
              draggable
              onDragStart={(e) => handleDragStart(e, posicao)}
              onDragOver={(e) => handleDragOver(e, posicao)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, posicao)}
              onDragEnd={handleDragEnd}
              onClick={() => handleClick(icone)}
            >
              <IconeImagem 
                src={icone.urlIcone} 
                alt={icone.nome}
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
              <IconeTexto>{icone.nome}</IconeTexto>
              
              <AcoesIcone onClick={(e) => e.stopPropagation()}>
                <BotaoAcao
                  onClick={() => handleEditar(icone, posicao)}
                  title="Editar"
                >
                  <FontAwesomeIcon icon={faEdit} size="sm" />
                </BotaoAcao>
                <BotaoAcao
                  className="danger"
                  onClick={() => handleRemover(posicao)}
                  title="Remover"
                >
                  <FontAwesomeIcon icon={faTrash} size="sm" />
                </BotaoAcao>
                <BotaoAcao
                  onClick={() => handleClick(icone)}
                  title="Abrir"
                >
                  <FontAwesomeIcon icon={faExternalLinkAlt} size="sm" />
                </BotaoAcao>
              </AcoesIcone>
            </IconeItem>
          );
        })}
      </GradeContainer>

      {mostrarModal && (
        <ModalOverlay onClick={handleCancelar}>
          <ModalContainer onClick={(e) => e.stopPropagation()}>
            <ModalHeader>
              <ModalTitle>
                {editando !== null ? 'Editar Ícone' : 'Adicionar Ícone'}
              </ModalTitle>
              <BotaoFechar onClick={handleCancelar}>
                <FontAwesomeIcon icon={faTimes} />
              </BotaoFechar>
            </ModalHeader>

            <ModalContent>
              <CampoFormulario>
                <Label>Nome do Ícone *</Label>
                <Input
                  type="text"
                  value={formData.nome}
                  onChange={(e) => handleInputChange('nome', e.target.value)}
                  placeholder="Ex: Google, GitHub, LinkedIn..."
                />
              </CampoFormulario>

              <CampoFormulario>
                <Label>URL do Ícone *</Label>
                <Input
                  type="url"
                  value={formData.urlIcone}
                  onChange={(e) => handleInputChange('urlIcone', e.target.value)}
                  placeholder="https://exemplo.com/icone.png"
                />
                {formData.urlIcone && (
                  <PreviewContainer>
                    <PreviewImagem 
                      src={formData.urlIcone} 
                      alt="Preview"
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                    <PreviewTexto>Preview do ícone</PreviewTexto>
                  </PreviewContainer>
                )}
              </CampoFormulario>

              <CampoFormulario>
                <Label>URL de Destino *</Label>
                <Input
                  type="url"
                  value={formData.urlDestino}
                  onChange={(e) => handleInputChange('urlDestino', e.target.value)}
                  placeholder="https://exemplo.com"
                />
              </CampoFormulario>

              <ContainerBotoes>
                <BotaoCancelar onClick={handleCancelar}>
                  <FontAwesomeIcon icon={faTimes} />
                  Cancelar
                </BotaoCancelar>
                <BotaoSalvar onClick={handleSalvar}>
                  <FontAwesomeIcon icon={faCheck} />
                  Salvar
                </BotaoSalvar>
              </ContainerBotoes>
            </ModalContent>
          </ModalContainer>
        </ModalOverlay>
      )}
    </Container>
  );
};

export default TelaInicial; 