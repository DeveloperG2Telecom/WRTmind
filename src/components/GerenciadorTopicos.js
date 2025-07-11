import React, { useState } from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faPlus, 
  faEdit, 
  faTrash, 
  faTimes,
  faCheck,
  faFolder,
  faChevronDown,
  faChevronRight
} from '@fortawesome/free-solid-svg-icons';
import { usarNotas } from '../context/NotasContext';
import EditorTexto from './EditorTexto';

const Container = styled.div`
  margin-top: var(--espacamentoGrande);
`;

const TituloSecao = styled.h3`
  color: var(--corTextoPrimaria);
  margin-bottom: var(--espacamentoMedio);
  display: flex;
  align-items: center;
  gap: var(--espacamentoMedio);
`;

const ListaTopicos = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--espacamentoMedio);
`;

const TopicoItem = styled.div`
  border: 2px solid var(--corBordaPrimaria);
  border-radius: var(--bordaRaioMedia);
  background: var(--corFundoTerciaria);
  overflow: hidden;
  transition: all var(--transicaoRapida);

  &:hover {
    border-color: var(--corBordaFoco);
    box-shadow: var(--sombraLeve);
  }
`;

const TopicoHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--espacamentoMedio);
  background: var(--corFundoSecundaria);
  cursor: pointer;
  transition: all var(--transicaoRapida);

  &:hover {
    background: var(--corFundoTerciaria);
  }
`;

const TopicoInfo = styled.div`
  display: flex;
  align-items: center;
  gap: var(--espacamentoMedio);
  flex: 1;
`;

const TopicoIcone = styled.div`
  color: var(--corPrimaria);
  width: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const TopicoTitulo = styled.div`
  font-weight: 600;
  color: var(--corTextoPrimaria);
  flex: 1;
`;

const TopicoDescricao = styled.div`
  font-size: var(--tamanhoFontePequena);
  color: var(--corTextoSecundaria);
  margin-left: var(--espacamentoMedio);
`;

const TopicoAcoes = styled.div`
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

const TopicoConteudo = styled.div`
  padding: var(--espacamentoMedio);
  border-top: 1px solid var(--corBordaPrimaria);
  display: ${props => props.expandido ? 'block' : 'none'};
`;

const FormularioTopico = styled.div`
  padding: var(--espacamentoMedio);
  border: 2px solid var(--corBordaFoco);
  border-radius: var(--bordaRaioMedia);
  background: var(--corFundoSecundaria);
  margin-bottom: var(--espacamentoMedio);
`;

const CampoFormulario = styled.div`
  margin-bottom: var(--espacamentoMedio);
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

const BotaoAdicionar = styled.button`
  display: flex;
  align-items: center;
  gap: var(--espacamentoMedio);
  padding: var(--espacamentoMedio) var(--espacamentoGrande);
  background: var(--corPrimaria);
  color: var(--corTextoClara);
  border: none;
  border-radius: var(--bordaRaioMedia);
  font-size: var(--tamanhoFonteMedia);
  font-weight: 600;
  cursor: pointer;
  transition: all var(--transicaoRapida);

  &:hover {
    background: var(--corSecundaria);
    transform: translateY(-1px);
  }
`;

const MensagemVazio = styled.div`
  text-align: center;
  padding: var(--espacamentoGrande);
  color: var(--corTextoSecundaria);
  font-style: italic;
`;

const GerenciadorTopicos = ({ projeto }) => {
  const { topicos, adicionarSecaoProjeto, removerSecaoProjeto, editarSecaoProjeto } = usarNotas();
  
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [editando, setEditando] = useState(null);
  const [formData, setFormData] = useState({
    nome: '',
    descricao: '',
    conteudo: ''
  });
  const [topicosExpandidos, setTopicosExpandidos] = useState({});

  const handleAdicionar = () => {
    setMostrarFormulario(true);
    setEditando(null);
    setFormData({
      nome: '',
      descricao: '',
      conteudo: ''
    });
  };

  const handleEditar = (topico, index) => {
    setEditando(index);
    setFormData({
      nome: topico.nome,
      descricao: topico.descricao,
      conteudo: topico.conteudo || ''
    });
  };

  const handleSalvar = () => {
    if (formData.nome.trim()) {
      const novoTopico = {
        id: Date.now(),
        nome: formData.nome.trim(),
        descricao: formData.descricao.trim(),
        conteudo: formData.conteudo,
        dataCriacao: new Date().toISOString(),
        dataAtualizacao: new Date().toISOString()
      };

      if (editando !== null) {
        editarSecaoProjeto(projeto.id, editando, novoTopico);
      } else {
        adicionarSecaoProjeto(projeto.id, novoTopico);
      }

      setMostrarFormulario(false);
      setEditando(null);
      setFormData({ nome: '', descricao: '', conteudo: '' });
    }
  };

  const handleCancelar = () => {
    setMostrarFormulario(false);
    setEditando(null);
    setFormData({ nome: '', descricao: '', conteudo: '' });
  };

  const handleRemover = (index) => {
    if (window.confirm('Tem certeza que deseja remover este tópico?')) {
      removerSecaoProjeto(projeto.id, index);
    }
  };

  const alternarExpansao = (index) => {
    setTopicosExpandidos(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const handleInputChange = (campo, valor) => {
    setFormData(prev => ({
      ...prev,
      [campo]: valor
    }));
  };

  return (
    <Container>
      <TituloSecao>
        <FontAwesomeIcon icon={faFolder} />
        Tópicos do Projeto
      </TituloSecao>

      {mostrarFormulario && (
        <FormularioTopico>
          <CampoFormulario>
            <Label>Nome do Tópico *</Label>
            <Input
              type="text"
              value={formData.nome}
              onChange={(e) => handleInputChange('nome', e.target.value)}
              placeholder="Ex: Acessos, Hardware, Localização..."
            />
          </CampoFormulario>

          <CampoFormulario>
            <Label>Descrição</Label>
            <Input
              type="text"
              value={formData.descricao}
              onChange={(e) => handleInputChange('descricao', e.target.value)}
              placeholder="Breve descrição do tópico..."
            />
          </CampoFormulario>

          <CampoFormulario>
            <Label>Conteúdo</Label>
            <EditorTexto
              valor={formData.conteudo}
              onChange={(valor) => handleInputChange('conteudo', valor)}
              placeholder="Digite o conteúdo do tópico..."
              alturaMinima="200px"
              alturaMaxima="300px"
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
        </FormularioTopico>
      )}

      <ListaTopicos>
        {projeto.topicos && projeto.topicos.length > 0 ? (
          projeto.topicos.map((topico, index) => (
            <TopicoItem key={topico.id}>
              <TopicoHeader onClick={() => alternarExpansao(index)}>
                <TopicoInfo>
                  <TopicoIcone>
                    <FontAwesomeIcon 
                      icon={topicosExpandidos[index] ? faChevronDown : faChevronRight} 
                    />
                  </TopicoIcone>
                  <TopicoTitulo>{topico.nome}</TopicoTitulo>
                  {topico.descricao && (
                    <TopicoDescricao>{topico.descricao}</TopicoDescricao>
                  )}
                </TopicoInfo>
                <TopicoAcoes onClick={(e) => e.stopPropagation()}>
                  <BotaoAcao onClick={() => handleEditar(topico, index)}>
                    <FontAwesomeIcon icon={faEdit} size="sm" />
                  </BotaoAcao>
                  <BotaoAcao 
                    variant="danger" 
                    onClick={() => handleRemover(index)}
                  >
                    <FontAwesomeIcon icon={faTrash} size="sm" />
                  </BotaoAcao>
                </TopicoAcoes>
              </TopicoHeader>
              
              <TopicoConteudo expandido={topicosExpandidos[index]}>
                {topico.conteudo ? (
                  <div dangerouslySetInnerHTML={{ __html: topico.conteudo }} />
                ) : (
                  <MensagemVazio>Nenhum conteúdo adicionado</MensagemVazio>
                )}
              </TopicoConteudo>
            </TopicoItem>
          ))
        ) : (
          <MensagemVazio>
            Nenhum tópico adicionado ainda. Clique em "Adicionar Tópico" para começar.
          </MensagemVazio>
        )}
      </ListaTopicos>

      <BotaoAdicionar onClick={handleAdicionar}>
        <FontAwesomeIcon icon={faPlus} />
        Adicionar Tópico
      </BotaoAdicionar>
    </Container>
  );
};

export default GerenciadorTopicos; 