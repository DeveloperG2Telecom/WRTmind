import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faSave, faTrash } from '@fortawesome/free-solid-svg-icons';
import { usarNotas } from '../context/NotasContext';
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
  padding: var(--espacamentoMedio);
`;

const ModalContainer = styled.div`
  background: var(--corFundoTerciaria);
  border-radius: var(--bordaRaioGrande);
  box-shadow: var(--sombraForte);
  width: 100%;
  max-width: 1000px;
  max-height: 90vh;
  overflow: hidden;
  animation: fadeIn 0.3s ease-out;
  display: flex;
  flex-direction: column;
`;

const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--espacamentoGrande);
  border-bottom: 1px solid var(--corBordaPrimaria);
  background: var(--corFundoSecundaria);
  flex-shrink: 0;
`;

const ModalTitle = styled.h2`
  color: var(--corTextoPrimaria);
  font-size: var(--tamanhoFonteTitulo);
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
  padding: var(--espacamentoGrande);
  overflow-y: auto;
  flex: 1;
  min-height: 0;
`;

const FormGroup = styled.div`
  margin-bottom: var(--espacamentoGrande);
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--espacamentoGrande);
  margin-bottom: var(--espacamentoGrande);

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

const BotaoExcluir = styled(BotaoAcao)`
  background: var(--corErro);
  color: var(--corTextoClara);

  &:hover:not(:disabled) {
    background: #c82333;
    transform: translateY(-2px);
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

const ModalItem = ({ 
  visivel, 
  tipo, 
  item = null, 
  onSalvar, 
  onExcluir, 
  onFechar,
  carregando = false 
}) => {
  const { categorias } = usarNotas();
  
  const [formData, setFormData] = useState({
    titulo: '',
    categoria: '',
    conteudo: '',
    status: '',
    prioridade: '',
    url: '', // Para links
    urlIcone: '' // Para links
  });

  useEffect(() => {
    if (item) {
      setFormData({
        titulo: item.titulo || '',
        categoria: item.categoria || '',
        conteudo: item.conteudo || '',
        status: item.status || '',
        prioridade: item.prioridade || '',
        url: item.url || '',
        urlIcone: item.urlIcone || item.icone || ''
      });
    } else {
      setFormData({
        titulo: '',
        categoria: '',
        conteudo: '',
        status: '',
        prioridade: '',
        url: '',
        urlIcone: ''
      });
    }
  }, [item, visivel]);

  const validarFormulario = () => {
    if (!formData.titulo.trim()) {
      alert('Por favor, preencha o título.');
      return false;
    }
    
    if (tipo === 'link') {
      if (!formData.url.trim()) {
        alert('Por favor, preencha a URL.');
        return false;
      }
      if (!formData.urlIcone.trim()) {
        alert('Por favor, preencha a URL do ícone.');
        return false;
      }
    }
    
    return true;
  };

  const handleSalvar = () => {
    if (validarFormulario()) {
      onSalvar(formData);
    }
  };

  const handleExcluir = () => {
    if (window.confirm('Tem certeza que deseja excluir este item?')) {
      onExcluir();
    }
  };

  const handleInputChange = (campo, valor) => {
    setFormData(prev => ({
      ...prev,
      [campo]: valor
    }));
  };

  const obterTituloModal = () => {
    return item ? `Editar ${tipo}` : `Novo ${tipo}`;
  };

  const obterCategorias = () => {
    return categorias.filter(cat => cat.tipo === tipo);
  };

  const obterStatus = () => {
    if (tipo === 'projeto') {
      return [
        { valor: 'pendente', label: 'Pendente' },
        { valor: 'em_andamento', label: 'Em Andamento' },
        { valor: 'concluido', label: 'Concluído' },
        { valor: 'cancelado', label: 'Cancelado' }
      ];
    } else if (tipo === 'reuniao') {
      return [
        { valor: 'agendada', label: 'Agendada' },
        { valor: 'em_andamento', label: 'Em Andamento' },
        { valor: 'concluida', label: 'Concluída' },
        { valor: 'cancelada', label: 'Cancelada' }
      ];
    }
    return [];
  };

  const obterPrioridades = () => {
    if (tipo === 'projeto' || tipo === 'reuniao') {
      return [
        { valor: 'baixa', label: 'Baixa' },
        { valor: 'media', label: 'Média' },
        { valor: 'alta', label: 'Alta' }
      ];
    }
    return [];
  };

  if (!visivel) return null;

  return (
    <ModalOverlay onClick={onFechar}>
      <ModalContainer onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <ModalTitle>{obterTituloModal()}</ModalTitle>
          <BotaoFechar onClick={onFechar}>
            <FontAwesomeIcon icon={faTimes} />
          </BotaoFechar>
        </ModalHeader>

        <ModalContent>
          <FormGroup>
            <Label>Título *</Label>
            <Input
              type="text"
              value={formData.titulo}
              onChange={(e) => handleInputChange('titulo', e.target.value)}
              placeholder={`Digite o título do ${tipo}...`}
            />
          </FormGroup>

          <FormGrid>
            <FormGroup>
              <Label>Categoria</Label>
              <Select
                value={formData.categoria}
                onChange={(e) => handleInputChange('categoria', e.target.value)}
              >
                <Option value="">Selecione uma categoria</Option>
                {obterCategorias().map(categoria => (
                  <Option key={categoria.id} value={categoria.id}>
                    {categoria.nome}
                  </Option>
                ))}
              </Select>
            </FormGroup>

            {tipo === 'link' && (
              <FormGroup>
                <Label>URL *</Label>
                <Input
                  type="url"
                  value={formData.url}
                  onChange={(e) => handleInputChange('url', e.target.value)}
                  placeholder="https://exemplo.com"
                />
              </FormGroup>
            )}

            {tipo === 'link' && (
              <FormGroup>
                <Label>URL do Ícone *</Label>
                <Input
                  type="url"
                  value={formData.urlIcone}
                  onChange={(e) => handleInputChange('urlIcone', e.target.value)}
                  placeholder="https://exemplo.com/icone.png"
                />
              </FormGroup>
            )}

            {(tipo === 'projeto' || tipo === 'reuniao') && (
              <FormGroup>
                <Label>Status</Label>
                <Select
                  value={formData.status}
                  onChange={(e) => handleInputChange('status', e.target.value)}
                >
                  <Option value="">Selecione um status</Option>
                  {obterStatus().map(status => (
                    <Option key={status.valor} value={status.valor}>
                      {status.label}
                    </Option>
                  ))}
                </Select>
              </FormGroup>
            )}

            {(tipo === 'projeto' || tipo === 'reuniao') && (
              <FormGroup>
                <Label>Prioridade</Label>
                <Select
                  value={formData.prioridade}
                  onChange={(e) => handleInputChange('prioridade', e.target.value)}
                >
                  <Option value="">Selecione uma prioridade</Option>
                  {obterPrioridades().map(prioridade => (
                    <Option key={prioridade.valor} value={prioridade.valor}>
                      {prioridade.label}
                    </Option>
                  ))}
                </Select>
              </FormGroup>
            )}
          </FormGrid>

          {tipo !== 'link' && (
            <FormGroup>
              <Label>Conteúdo</Label>
              <EditorTexto
                valor={formData.conteudo}
                onChange={(valor) => handleInputChange('conteudo', valor)}
                placeholder={`Digite o conteúdo do ${tipo}...`}
                alturaMinima="200px"
                alturaMaxima="400px"
              />
            </FormGroup>
          )}

          {tipo === 'link' && formData.urlIcone && (
            <FormGroup>
              <Label>Preview do Ícone</Label>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--espacamentoMedio)',
                padding: 'var(--espacamentoMedio)',
                background: 'var(--corFundoSecundaria)',
                borderRadius: 'var(--bordaRaioMedia)',
                border: '1px solid var(--corBordaPrimaria)'
              }}>
                <img 
                  src={formData.urlIcone} 
                  alt="Preview"
                  style={{
                    width: '32px',
                    height: '32px',
                    objectFit: 'contain',
                    borderRadius: 'var(--bordaRaioPequena)'
                  }}
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
                <span style={{ color: 'var(--corTextoSecundaria)', fontSize: 'var(--tamanhoFontePequena)' }}>
                  {formData.titulo || 'Nome do link'}
                </span>
              </div>
            </FormGroup>
          )}
        </ModalContent>

        <ModalFooter>
          <div>
            {item && (
              <BotaoExcluir onClick={handleExcluir}>
                <FontAwesomeIcon icon={faTrash} />
                Excluir
              </BotaoExcluir>
            )}
          </div>
          
          <div style={{ display: 'flex', gap: 'var(--espacamentoMedio)' }}>
            <BotaoCancelar onClick={onFechar}>
              Cancelar
            </BotaoCancelar>
            <BotaoSalvar onClick={handleSalvar} disabled={carregando}>
              <FontAwesomeIcon icon={faSave} />
              {carregando ? 'Salvando...' : 'Salvar'}
            </BotaoSalvar>
          </div>
        </ModalFooter>
      </ModalContainer>
    </ModalOverlay>
  );
};

export default ModalItem; 