import React from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--espacamentoExtraGrande);
  min-height: 400px;
  text-align: center;
`;

const Spinner = styled.div`
  font-size: 2rem;
  color: var(--corPrimaria);
  margin-bottom: var(--espacamentoGrande);
  animation: spin 1s linear infinite;

  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
`;

const LoadingText = styled.p`
  color: var(--corTextoSecundaria);
  font-size: var(--tamanhoFonteMedia);
  margin: 0;
`;

const LoadingSubtext = styled.p`
  color: var(--corTextoTerciaria);
  font-size: var(--tamanhoFontePequena);
  margin: var(--espacamentoPequeno) 0 0 0;
`;

const NotasLoading = ({ mensagem = 'Carregando notas...', subMensagem = 'Aguarde um momento' }) => {
  return (
    <LoadingContainer>
      <Spinner>
        <FontAwesomeIcon icon={faSpinner} />
      </Spinner>
      <LoadingText>{mensagem}</LoadingText>
      <LoadingSubtext>{subMensagem}</LoadingSubtext>
    </LoadingContainer>
  );
};

export default NotasLoading; 