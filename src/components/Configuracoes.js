import React, { useState } from 'react';
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
  faFolder
} from '@fortawesome/free-solid-svg-icons';
import { usarNotas } from '../context/NotasContext';

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
    color: var(--corTextoClara);
  }

  &:focus {
    outline: none;
  }
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

const DescricaoTopico = styled.p`
  color: var(--corTextoSecundaria);
  font-size: var(--tamanhoFontePequena);
  margin-top: var(--espacamentoPequeno);
`;

const Configuracoes = ({ visivel, onFechar }) => {
  const { 
    categorias, 
    topicos,
    adicionarCategoria, 
    removerCategoria, 
    editarCategoria,
    adicionarTopico,
    removerTopico,
    editarTopico
  } = usarNotas();

  const [abaAtiva, setAbaAtiva] = useState('categorias');
  const [editandoCategoria, setEditandoCategoria] = useState(null);
  const [editandoTopico, setEditandoTopico] = useState(null);
  const [formCategoria, setFormCategoria] = useState({ nome: '', tipo: 'projeto' });
  const [formTopico, setFormTopico] = useState({ nome: '', descricao: '' });

  const handleAdicionarCategoria = () => {
    if (formCategoria.nome.trim()) {
      const novaCategoria = {
        id: Date.now(),
        nome: formCategoria.nome.trim(),
        tipo: formCategoria.tipo
      };
      adicionarCategoria(novaCategoria);
      setFormCategoria({ nome: '', tipo: 'projeto' });
    }
  };

  const handleEditarCategoria = (index) => {
    const categoria = categorias[index];
    setEditandoCategoria(index);
    setFormCategoria({ nome: categoria.nome, tipo: categoria.tipo });
  };

  const handleSalvarCategoria = () => {
    if (formCategoria.nome.trim()) {
      editarCategoria(editandoCategoria, {
        ...categorias[editandoCategoria],
        nome: formCategoria.nome.trim(),
        tipo: formCategoria.tipo
      });
      setEditandoCategoria(null);
      setFormCategoria({ nome: '', tipo: 'projeto' });
    }
  };

  const handleCancelarCategoria = () => {
    setEditandoCategoria(null);
    setFormCategoria({ nome: '', tipo: 'projeto' });
  };

  const handleRemoverCategoria = (index) => {
    if (window.confirm('Tem certeza que deseja remover esta categoria?')) {
      removerCategoria(index);
    }
  };

  const handleAdicionarTopico = () => {
    if (formTopico.nome.trim()) {
      const novoTopico = {
        id: Date.now(),
        nome: formTopico.nome.trim(),
        descricao: formTopico.descricao.trim()
      };
      adicionarTopico(novoTopico);
      setFormTopico({ nome: '', descricao: '' });
    }
  };

  const handleEditarTopico = (index) => {
    const topico = topicos[index];
    setEditandoTopico(index);
    setFormTopico({ nome: topico.nome, descricao: topico.descricao });
  };

  const handleSalvarTopico = () => {
    if (formTopico.nome.trim()) {
      editarTopico(editandoTopico, {
        ...topicos[editandoTopico],
        nome: formTopico.nome.trim(),
        descricao: formTopico.descricao.trim()
      });
      setEditandoTopico(null);
      setFormTopico({ nome: '', descricao: '' });
    }
  };

  const handleCancelarTopico = () => {
    setEditandoTopico(null);
    setFormTopico({ nome: '', descricao: '' });
  };

  const handleRemoverTopico = (index) => {
    if (window.confirm('Tem certeza que deseja remover este tópico?')) {
      removerTopico(index);
    }
  };

  const categoriasPorTipo = {
    projeto: categorias.filter(cat => cat.tipo === 'projeto'),
    anotacao: categorias.filter(cat => cat.tipo === 'anotacao'),
    reuniao: categorias.filter(cat => cat.tipo === 'reuniao')
  };

  if (!visivel) return null;

  return (
    <Overlay onClick={onFechar}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <ModalTitle>
            <FontAwesomeIcon icon={faCog} />
            Configurações
          </ModalTitle>
          <BotaoFechar onClick={onFechar}>
            <FontAwesomeIcon icon={faTimes} />
          </BotaoFechar>
        </ModalHeader>

        <ModalBody>
          <AbaContainer>
            <Aba 
              ativa={abaAtiva === 'categorias'} 
              onClick={() => setAbaAtiva('categorias')}
            >
              <FontAwesomeIcon icon={faTags} />
              Categorias
            </Aba>
            <Aba 
              ativa={abaAtiva === 'topicos'} 
              onClick={() => setAbaAtiva('topicos')}
            >
              <FontAwesomeIcon icon={faFolder} />
              Tópicos
            </Aba>
          </AbaContainer>

          {abaAtiva === 'categorias' && (
            <SecaoConfiguracao>
              <SecaoTitulo>Gerenciar Categorias</SecaoTitulo>
              
              <FormularioAdicionar>
                <CampoFormulario>
                  <Label>Nome da Categoria *</Label>
                  <Input
                    type="text"
                    value={formCategoria.nome}
                    onChange={(e) => setFormCategoria(prev => ({ ...prev, nome: e.target.value }))}
                    placeholder="Digite o nome da categoria..."
                  />
                </CampoFormulario>
                
                <CampoFormulario>
                  <Label>Tipo</Label>
                  <Select
                    value={formCategoria.tipo}
                    onChange={(e) => setFormCategoria(prev => ({ ...prev, tipo: e.target.value }))}
                  >
                    <option value="projeto">Projeto</option>
                    <option value="anotacao">Anotação</option>
                    <option value="reuniao">Reunião</option>
                  </Select>
                </CampoFormulario>

                <ContainerBotoes>
                  {editandoCategoria !== null ? (
                    <>
                      <BotaoCancelar onClick={handleCancelarCategoria}>
                        <FontAwesomeIcon icon={faTimes} />
                        Cancelar
                      </BotaoCancelar>
                      <BotaoSalvar onClick={handleSalvarCategoria}>
                        <FontAwesomeIcon icon={faCheck} />
                        Salvar
                      </BotaoSalvar>
                    </>
                  ) : (
                    <BotaoAdicionar onClick={handleAdicionarCategoria}>
                      <FontAwesomeIcon icon={faPlus} />
                      Adicionar Categoria
                    </BotaoAdicionar>
                  )}
                </ContainerBotoes>
              </FormularioAdicionar>

              <ListaCategorias>
                {Object.entries(categoriasPorTipo).map(([tipo, cats]) => (
                  cats.length > 0 && (
                    <SecaoCategoria key={tipo}>
                      <SecaoCategoriaTitulo>
                        {tipo === 'projeto' ? 'Projetos' : tipo === 'anotacao' ? 'Anotações' : 'Reuniões'}
                      </SecaoCategoriaTitulo>
                      {cats.map((categoria, index) => {
                        const indiceGlobal = categorias.findIndex(cat => cat.id === categoria.id);
                        return (
                          <ItemCategoria key={categoria.id}>
                            <NomeCategoria>{categoria.nome}</NomeCategoria>
                            <AcoesCategoria>
                              <BotaoAcao onClick={() => handleEditarCategoria(indiceGlobal)}>
                                <FontAwesomeIcon icon={faEdit} size="sm" />
                              </BotaoAcao>
                              <BotaoAcao 
                                variant="danger" 
                                onClick={() => handleRemoverCategoria(indiceGlobal)}
                              >
                                <FontAwesomeIcon icon={faTrash} size="sm" />
                              </BotaoAcao>
                            </AcoesCategoria>
                          </ItemCategoria>
                        );
                      })}
                    </SecaoCategoria>
                  )
                ))}
              </ListaCategorias>
            </SecaoConfiguracao>
          )}

          {abaAtiva === 'topicos' && (
            <SecaoConfiguracao>
              <SecaoTitulo>Gerenciar Tópicos</SecaoTitulo>
              <SecaoDescricao>
                Os tópicos são seções personalizáveis que podem ser adicionadas aos projetos para organizar melhor as informações.
              </SecaoDescricao>
              
              <FormularioAdicionar>
                <CampoFormulario>
                  <Label>Nome do Tópico *</Label>
                  <Input
                    type="text"
                    value={formTopico.nome}
                    onChange={(e) => setFormTopico(prev => ({ ...prev, nome: e.target.value }))}
                    placeholder="Ex: Acessos, Hardware, Localização..."
                  />
                </CampoFormulario>
                
                <CampoFormulario>
                  <Label>Descrição</Label>
                  <Input
                    type="text"
                    value={formTopico.descricao}
                    onChange={(e) => setFormTopico(prev => ({ ...prev, descricao: e.target.value }))}
                    placeholder="Breve descrição do tópico..."
                  />
                </CampoFormulario>

                <ContainerBotoes>
                  {editandoTopico !== null ? (
                    <>
                      <BotaoCancelar onClick={handleCancelarTopico}>
                        <FontAwesomeIcon icon={faTimes} />
                        Cancelar
                      </BotaoCancelar>
                      <BotaoSalvar onClick={handleSalvarTopico}>
                        <FontAwesomeIcon icon={faCheck} />
                        Salvar
                      </BotaoSalvar>
                    </>
                  ) : (
                    <BotaoAdicionar onClick={handleAdicionarTopico}>
                      <FontAwesomeIcon icon={faPlus} />
                      Adicionar Tópico
                    </BotaoAdicionar>
                  )}
                </ContainerBotoes>
              </FormularioAdicionar>

              <ListaCategorias>
                {topicos.map((topico, index) => (
                  <ItemCategoria key={topico.id}>
                    <div>
                      <NomeCategoria>{topico.nome}</NomeCategoria>
                      {topico.descricao && (
                        <DescricaoTopico>{topico.descricao}</DescricaoTopico>
                      )}
                    </div>
                    <AcoesCategoria>
                      <BotaoAcao onClick={() => handleEditarTopico(index)}>
                        <FontAwesomeIcon icon={faEdit} size="sm" />
                      </BotaoAcao>
                      <BotaoAcao 
                        variant="danger" 
                        onClick={() => handleRemoverTopico(index)}
                      >
                        <FontAwesomeIcon icon={faTrash} size="sm" />
                      </BotaoAcao>
                    </AcoesCategoria>
                  </ItemCategoria>
                ))}
              </ListaCategorias>
            </SecaoConfiguracao>
          )}
        </ModalBody>
      </ModalContent>
    </Overlay>
  );
};

export default Configuracoes; 