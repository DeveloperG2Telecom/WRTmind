import React, { useState } from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faTimes, 
  faEdit, 
  faTrash, 
  faCopy,
  faCalendarAlt,
  faTag,
  faFlag,
  faSignal,
  faUser,
  faClock
} from '@fortawesome/free-solid-svg-icons';
import { usarNotas } from '../context/NotasContext';
import GerenciadorTopicos from './GerenciadorTopicos';
import {
  formatarData,
  formatarCategoria,
  formatarStatus,
  formatarPrioridade,
  obterCorStatus,
  obterCorPrioridade,
  copiarParaClipboard
} from '../utils/formatacao';

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
  max-width: 900px;
  max-height: 90vh;
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
  font-size: var(--tamanhoFonteTitulo);
  margin: 0;
  flex: 1;
  margin-right: var(--espacamentoMedio);
`;

const HeaderActions = styled.div`
  display: flex;
  gap: var(--espacamentoPequeno);
`;

const ActionButton = styled.button`
  display: flex;
  align-items: center;
  gap: var(--espacamentoPequeno);
  padding: var(--espacamentoMedio);
  background: var(--corFundoTerciaria);
  color: var(--corTextoSecundaria);
  border: 1px solid var(--corBordaPrimaria);
  border-radius: var(--bordaRaioMedia);
  font-size: var(--tamanhoFonteMedia);
  font-weight: 500;
  cursor: pointer;
  transition: all var(--transicaoRapida);

  &:hover {
    background: var(--corPrimaria);
    color: var(--corTextoClara);
    border-color: var(--corPrimaria);
    transform: translateY(-2px);
  }

  &.danger:hover {
    background: var(--corErro);
    border-color: var(--corErro);
  }
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
  max-height: calc(90vh - 140px);
`;

const ItemMeta = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: var(--espacamentoMedio);
  margin-bottom: var(--espacamentoGrande);
  padding: var(--espacamentoMedio);
  background: var(--corFundoSecundaria);
  border-radius: var(--bordaRaioMedia);
`;

const Badge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: var(--espacamentoPequeno);
  padding: 6px 16px;
  border-radius: 20px;
  font-size: var(--tamanhoFonteMedia);
  font-weight: 600;
  background: ${props => props.background || 'var(--corFundoSecundaria)'};
  color: ${props => props.color || 'var(--corTextoPrimaria)'};
  border: 1px solid ${props => props.border || 'transparent'};
`;

const ContentSection = styled.div`
  margin-bottom: var(--espacamentoGrande);
`;

const SectionTitle = styled.h3`
  color: var(--corTextoPrimaria);
  font-size: var(--tamanhoFonteGrande);
  margin-bottom: var(--espacamentoMedio);
  padding-bottom: var(--espacamentoPequeno);
  border-bottom: 2px solid var(--corBordaPrimaria);
`;

const ContentDisplay = styled.div`
  background: var(--corFundoSecundaria);
  border: 1px solid var(--corBordaPrimaria);
  border-radius: var(--bordaRaioMedia);
  padding: var(--espacamentoGrande);
  min-height: 200px;
  line-height: 1.8;
  color: var(--corTextoPrimaria);
  font-size: var(--tamanhoFonteMedia);

  /* Estilos para conteúdo HTML */
  h1, h2, h3, h4, h5, h6 {
    color: var(--corTextoPrimaria);
    margin: var(--espacamentoMedio) 0 var(--espacamentoPequeno) 0;
  }

  p {
    margin-bottom: var(--espacamentoMedio);
  }

  ul, ol {
    margin: var(--espacamentoMedio) 0;
    padding-left: var(--espacamentoGrande);
  }

  li {
    margin-bottom: var(--espacamentoPequeno);
  }

  blockquote {
    border-left: 4px solid var(--corPrimaria);
    margin: var(--espacamentoMedio) 0;
    padding-left: var(--espacamentoMedio);
    font-style: italic;
    color: var(--corTextoSecundaria);
  }

  code {
    background: var(--corFundoTerciaria);
    padding: 2px 6px;
    border-radius: var(--bordaRaioPequena);
    font-family: 'Courier New', monospace;
    font-size: 0.9em;
  }

  pre {
    background: var(--corFundoTerciaria);
    padding: var(--espacamentoMedio);
    border-radius: var(--bordaRaioMedia);
    overflow-x: auto;
    margin: var(--espacamentoMedio) 0;
  }

  a {
    color: var(--corPrimaria);
    text-decoration: underline;
  }

  a:hover {
    color: var(--corSecundaria);
  }

  strong, b {
    font-weight: 600;
  }

  em, i {
    font-style: italic;
  }

  u {
    text-decoration: underline;
  }

  s, strike {
    text-decoration: line-through;
  }
`;

const DatesSection = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: var(--espacamentoMedio);
  margin-top: var(--espacamentoGrande);
  padding-top: var(--espacamentoMedio);
  border-top: 1px solid var(--corBordaPrimaria);
`;

const DateItem = styled.div`
  display: flex;
  align-items: center;
  gap: var(--espacamentoMedio);
  padding: var(--espacamentoMedio);
  background: var(--corFundoSecundaria);
  border-radius: var(--bordaRaioMedia);
  font-size: var(--tamanhoFonteMedia);
`;

const DateLabel = styled.span`
  color: var(--corTextoSecundaria);
  font-weight: 500;
  min-width: 80px;
`;

const DateValue = styled.span`
  color: var(--corTextoPrimaria);
  font-weight: 600;
`;

const ModalVisualizar = ({ 
  visivel, 
  item, 
  tipo, 
  onFechar, 
  onEditar, 
  onExcluir,
  onCopiar 
}) => {
  const { categorias } = usarNotas();

  const handleCopiar = async () => {
    if (!item) return;
    
    const textoParaCopiar = `${item.titulo}\n\n${item.conteudo.replace(/<[^>]*>/g, '')}`;
    const sucesso = await copiarParaClipboard(textoParaCopiar);
    
    if (sucesso && onCopiar) {
      onCopiar('Conteúdo copiado para a área de transferência!');
    }
  };

  const renderizarBadges = () => {
    if (!item) return null;

    const badges = [];

    // Badge de categoria
    badges.push(
      <Badge key="categoria" background="var(--corFundoTerciaria)">
        <FontAwesomeIcon icon={faTag} />
        {formatarCategoria(item.categoria)}
      </Badge>
    );

    // Badge de prioridade (apenas para projetos e reuniões)
    if (item.prioridade && (tipo === 'projeto' || tipo === 'reuniao')) {
      badges.push(
        <Badge 
          key="prioridade" 
          background={obterCorPrioridade(item.prioridade)}
          color="white"
        >
          <FontAwesomeIcon icon={faFlag} />
          {formatarPrioridade(item.prioridade)}
        </Badge>
      );
    }

    // Badge de status (apenas para projetos e reuniões)
    if (item.status && (tipo === 'projeto' || tipo === 'reuniao')) {
      badges.push(
        <Badge 
          key="status" 
          background={obterCorStatus(item.status)}
          color="white"
        >
          <FontAwesomeIcon icon={faClock} />
          {formatarStatus(item.status)}
        </Badge>
      );
    }

    return badges;
  };

  if (!visivel || !item) return null;

  const categoria = categorias.find(cat => cat.id === item.categoriaId);
  const dataCriacao = new Date(item.dataCriacao).toLocaleDateString('pt-BR');
  const dataAtualizacao = new Date(item.dataAtualizacao).toLocaleDateString('pt-BR');

  const obterCorPrioridade = (prioridade) => {
    switch (prioridade) {
      case 'alta': return '#f44336';
      case 'media': return '#ff9800';
      case 'baixa': return '#4caf50';
      default: return '#9e9e9e';
    }
  };

  const obterCorStatus = (status) => {
    switch (status) {
      case 'concluido': return '#4caf50';
      case 'em_andamento': return '#2196f3';
      case 'pendente': return '#ff9800';
      case 'cancelado': return '#f44336';
      default: return '#9e9e9e';
    }
  };

  const obterTextoPrioridade = (prioridade) => {
    switch (prioridade) {
      case 'alta': return 'Alta';
      case 'media': return 'Média';
      case 'baixa': return 'Baixa';
      default: return 'Não definida';
    }
  };

  const obterTextoStatus = (status) => {
    switch (status) {
      case 'concluido': return 'Concluído';
      case 'em_andamento': return 'Em Andamento';
      case 'pendente': return 'Pendente';
      case 'cancelado': return 'Cancelado';
      default: return 'Não definido';
    }
  };

  return (
    <ModalOverlay onClick={onFechar}>
      <ModalContainer onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <ModalTitle>{item.titulo}</ModalTitle>
          <HeaderActions>
            <ActionButton onClick={handleCopiar} title="Copiar conteúdo">
              <FontAwesomeIcon icon={faCopy} />
              Copiar
            </ActionButton>
            <ActionButton onClick={() => onEditar(item)} title="Editar">
              <FontAwesomeIcon icon={faEdit} />
              Editar
            </ActionButton>
            <ActionButton 
              onClick={() => onExcluir(item.id)} 
              className="danger"
              title="Excluir"
            >
              <FontAwesomeIcon icon={faTrash} />
              Excluir
            </ActionButton>
            <BotaoFechar onClick={onFechar}>
              <FontAwesomeIcon icon={faTimes} />
            </BotaoFechar>
          </HeaderActions>
        </ModalHeader>

        <ModalContent>
          <ItemMeta>
            {renderizarBadges()}
          </ItemMeta>

          <ContentSection>
            <SectionTitle>Conteúdo</SectionTitle>
            <ContentDisplay 
              dangerouslySetInnerHTML={{ __html: item.conteudo || '<em>Sem conteúdo</em>' }}
            />
          </ContentSection>

          <DatesSection>
            <DateItem>
              <FontAwesomeIcon icon={faCalendarAlt} color="var(--corPrimaria)" />
              <DateLabel>Criado:</DateLabel>
              <DateValue>{formatarData(item.dataCriacao, 'completo')}</DateValue>
            </DateItem>
            
            {item.dataCriacao !== item.dataAtualizacao && (
              <DateItem>
                <FontAwesomeIcon icon={faClock} color="var(--corSecundaria)" />
                <DateLabel>Editado:</DateLabel>
                <DateValue>{formatarData(item.dataAtualizacao, 'completo')}</DateValue>
              </DateItem>
            )}
          </DatesSection>

          {/* Gerenciador de Tópicos apenas para Projetos */}
          {tipo === 'projeto' && (
            <GerenciadorTopicos 
              projeto={item} 
            />
          )}
        </ModalContent>
      </ModalContainer>
    </ModalOverlay>
  );
};

export default ModalVisualizar; 