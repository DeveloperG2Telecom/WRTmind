import React, { useState } from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faPlus, 
  faEdit, 
  faTrash, 
  faEye,
  faCopy,
  faExternalLinkAlt,
  faGripVertical,
  faSearch
} from '@fortawesome/free-solid-svg-icons';
import CardItem from './CardItem';
import { copiarParaClipboard } from '../utils/formatacao';

const Container = styled.div`
  padding: var(--espacamentoGrande);
  min-height: 100vh;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--espacamentoGrande);
  flex-wrap: wrap;
  gap: var(--espacamentoMedio);
`;

const TituloSecao = styled.h1`
  color: var(--corTextoPrimaria);
  font-size: var(--tamanhoFonteTitulo);
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: var(--espacamentoMedio);
  margin: 0;
`;

const Contador = styled.span`
  background: var(--corPrimaria);
  color: var(--corTextoClara);
  padding: 4px 12px;
  border-radius: 20px;
  font-size: var(--tamanhoFontePequena);
  font-weight: 600;
`;

const ContainerBotoes = styled.div`
  display: flex;
  gap: var(--espacamentoMedio);
  align-items: center;
`;

const BotaoAcao = styled.button`
  display: flex;
  align-items: center;
  gap: var(--espacamentoPequeno);
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

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

const BotaoSecundario = styled(BotaoAcao)`
  background: var(--corFundoSecundaria);
  color: var(--corTextoPrimaria);
  border: 2px solid var(--corBordaPrimaria);

  &:hover {
    background: var(--corFundoTerciaria);
    border-color: var(--corPrimaria);
  }
`;

const ContainerBusca = styled.div`
  display: flex;
  gap: var(--espacamentoMedio);
  align-items: center;
  flex-wrap: wrap;
`;

const CampoBusca = styled.div`
  position: relative;
  flex: 1;
  min-width: 250px;
`;

const InputBusca = styled.input`
  width: 100%;
  padding: var(--espacamentoMedio) var(--espacamentoGrande);
  padding-left: 40px;
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

  &::placeholder {
    color: var(--corTextoTerciaria);
  }
`;

const IconeBusca = styled.div`
  position: absolute;
  left: var(--espacamentoMedio);
  top: 50%;
  transform: translateY(-50%);
  color: var(--corTextoTerciaria);
`;

const SelectOrdenacao = styled.select`
  padding: var(--espacamentoMedio) var(--espacamentoGrande);
  border: 2px solid var(--corBordaPrimaria);
  border-radius: var(--bordaRaioMedia);
  font-size: var(--tamanhoFonteMedia);
  background: var(--corFundoSecundaria);
  color: var(--corTextoPrimaria);
  cursor: pointer;
  transition: all var(--transicaoRapida);

  &:focus {
    outline: none;
    border-color: var(--corBordaFoco);
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }
`;

const ListaContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--espacamentoMedio);
`;

// Componente específico para grade de links
const GradeLinks = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: var(--espacamentoMedio);
  max-width: 1200px;
  margin: 0 auto;
`;

const LinkItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--espacamentoMedio);
  background: var(--corFundoTerciaria);
  border: 2px solid var(--corBordaPrimaria);
  border-radius: var(--bordaRaioGrande);
  cursor: pointer;
  transition: all var(--transicaoRapida);
  position: relative;
  min-height: 100px;

  &:hover {
    transform: translateY(-3px);
    box-shadow: var(--sombraMedia);
    border-color: var(--corPrimaria);
    background: var(--corFundoSecundaria);
  }
`;

const LinkImagem = styled.img`
  width: 32px;
  height: 32px;
  object-fit: contain;
  margin-bottom: var(--espacamentoPequeno);
  border-radius: var(--bordaRaioPequena);
  transition: all var(--transicaoRapida);

  ${LinkItem}:hover & {
    transform: scale(1.1);
  }
`;

const LinkTexto = styled.span`
  color: var(--corTextoPrimaria);
  font-size: var(--tamanhoFontePequena);
  font-weight: 600;
  text-align: center;
  word-break: break-word;
  max-width: 100%;
`;

const AcoesLink = styled.div`
  position: absolute;
  top: var(--espacamentoPequeno);
  right: var(--espacamentoPequeno);
  display: flex;
  gap: 2px;
  opacity: 0;
  transition: opacity var(--transicaoRapida);

  ${LinkItem}:hover & {
    opacity: 1;
  }
`;

const BotaoAcaoLink = styled.button`
  background: var(--corFundoTerciaria);
  color: var(--corTextoSecundaria);
  border: 1px solid var(--corBordaPrimaria);
  border-radius: var(--bordaRaioPequena);
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all var(--transicaoRapida);
  font-size: 10px;

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

const BotaoAdicionarLink = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--espacamentoMedio);
  background: var(--corFundoSecundaria);
  border: 2px dashed var(--corBordaPrimaria);
  border-radius: var(--bordaRaioGrande);
  cursor: pointer;
  transition: all var(--transicaoRapida);
  min-height: 100px;

  &:hover {
    border-color: var(--corPrimaria);
    background: var(--corFundoTerciaria);
    transform: translateY(-2px);
  }
`;

const IconeAdicionar = styled.div`
  color: var(--corPrimaria);
  font-size: 24px;
  margin-bottom: var(--espacamentoPequeno);
`;

const TextoAdicionar = styled.span`
  color: var(--corTextoSecundaria);
  font-size: var(--tamanhoFontePequena);
  font-weight: 600;
  text-align: center;
`;

const MensagemVazio = styled.div`
  text-align: center;
  padding: var(--espacamentoExtraGrande);
  color: var(--corTextoSecundaria);
  font-style: italic;
  grid-column: 1 / -1;
`;

const ListaItens = ({
  itens,
  tipo,
  titulo,
  icone,
  carregando,
  onNovo,
  onEditar,
  onExcluir,
  onVisualizar,
  onCopiar,
  onReordenar,
  modoOrdenacao = 'manual'
}) => {
  const [termoBusca, setTermoBusca] = useState('');
  const [ordenacao, setOrdenacao] = useState('dataCriacao');

  const handleCopiar = async (item) => {
    const textoParaCopiar = `${item.titulo}\n${item.url || item.conteudo}`;
    const sucesso = await copiarParaClipboard(textoParaCopiar);
    
    if (sucesso && onCopiar) {
      onCopiar('Conteúdo copiado para a área de transferência!');
    }
  };

  const handleClickLink = (link) => {
    if (link.url) {
      window.open(link.url, '_blank');
    }
  };

  // Se for tipo 'link', renderizar grade de links
  if (tipo === 'link') {
    return (
      <Container>
        <Header>
          <TituloSecao>
            <FontAwesomeIcon icon={icone} />
            {titulo}
            <Contador>{itens.length}</Contador>
          </TituloSecao>
          
          <ContainerBotoes>
            <BotaoAcao onClick={onNovo}>
              <FontAwesomeIcon icon={faPlus} />
              Adicionar Link
            </BotaoAcao>
          </ContainerBotoes>
        </Header>

        <ContainerBusca>
          <CampoBusca>
            <IconeBusca>
              <FontAwesomeIcon icon={faSearch} />
            </IconeBusca>
            <InputBusca
              type="text"
              placeholder="Buscar links..."
              value={termoBusca}
              onChange={(e) => setTermoBusca(e.target.value)}
            />
          </CampoBusca>
          
          <SelectOrdenacao
            value={ordenacao}
            onChange={(e) => setOrdenacao(e.target.value)}
          >
            <option value="dataCriacao">Data de Criação</option>
            <option value="dataAtualizacao">Data de Atualização</option>
            <option value="titulo">Título</option>
            <option value="ordem">Ordem Manual</option>
          </SelectOrdenacao>
        </ContainerBusca>

        <GradeLinks>
          {itens.length === 0 ? (
            <MensagemVazio>
              Nenhum link adicionado ainda. Clique em "Adicionar Link" para começar.
            </MensagemVazio>
          ) : (
            <>
              {itens.map((item, index) => (
                <LinkItem key={item.id} onClick={() => handleClickLink(item)}>
                  <LinkImagem 
                    src={item.urlIcone || item.icone} 
                    alt={item.titulo}
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                  <LinkTexto>{item.titulo}</LinkTexto>
                  
                  <AcoesLink onClick={(e) => e.stopPropagation()}>
                    <BotaoAcaoLink
                      onClick={() => onEditar(item)}
                      title="Editar"
                    >
                      <FontAwesomeIcon icon={faEdit} />
                    </BotaoAcaoLink>
                    <BotaoAcaoLink
                      className="danger"
                      onClick={() => onExcluir(item.id)}
                      title="Remover"
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </BotaoAcaoLink>
                    <BotaoAcaoLink
                      onClick={() => handleClickLink(item)}
                      title="Abrir"
                    >
                      <FontAwesomeIcon icon={faExternalLinkAlt} />
                    </BotaoAcaoLink>
                  </AcoesLink>
                </LinkItem>
              ))}
              
              <BotaoAdicionarLink onClick={onNovo}>
                <IconeAdicionar>
                  <FontAwesomeIcon icon={faPlus} />
                </IconeAdicionar>
                <TextoAdicionar>Adicionar</TextoAdicionar>
              </BotaoAdicionarLink>
            </>
          )}
        </GradeLinks>
      </Container>
    );
  }

  // Renderização padrão para outros tipos
  return (
    <Container>
      <Header>
        <TituloSecao>
          <FontAwesomeIcon icon={icone} />
          {titulo}
          <Contador>{itens.length}</Contador>
        </TituloSecao>
        
        <ContainerBotoes>
          <BotaoAcao onClick={onNovo}>
            <FontAwesomeIcon icon={faPlus} />
            Novo {titulo.slice(0, -1)}
          </BotaoAcao>
        </ContainerBotoes>
      </Header>

      <ContainerBusca>
        <CampoBusca>
          <IconeBusca>
            <FontAwesomeIcon icon={faSearch} />
          </IconeBusca>
          <InputBusca
            type="text"
            placeholder={`Buscar ${titulo.toLowerCase()}...`}
            value={termoBusca}
            onChange={(e) => setTermoBusca(e.target.value)}
          />
        </CampoBusca>
        
        <SelectOrdenacao
          value={ordenacao}
          onChange={(e) => setOrdenacao(e.target.value)}
        >
          <option value="dataCriacao">Data de Criação</option>
          <option value="dataAtualizacao">Data de Atualização</option>
          <option value="titulo">Título</option>
          <option value="ordem">Ordem Manual</option>
        </SelectOrdenacao>
      </ContainerBusca>

      <ListaContainer>
        {itens.length === 0 ? (
          <MensagemVazio>
            Nenhum {titulo.slice(0, -1).toLowerCase()} adicionado ainda. Clique em "Novo {titulo.slice(0, -1)}" para começar.
          </MensagemVazio>
        ) : (
          itens.map((item, index) => (
            <CardItem
              key={item.id}
              item={item}
              tipo={tipo}
              onEditar={() => onEditar(item)}
              onExcluir={() => onExcluir(item.id)}
              onVisualizar={() => onVisualizar(item)}
              onCopiar={() => handleCopiar(item)}
            />
          ))
        )}
      </ListaContainer>
    </Container>
  );
};

export default ListaItens; 