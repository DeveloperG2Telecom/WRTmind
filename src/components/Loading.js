import React from 'react';
import styled from 'styled-components';

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--espacamentoExtraGrande);
  min-height: ${props => props.alturaMinima || '200px'};
  width: 100%;
`;

const Spinner = styled.div`
  display: inline-block;
  width: ${props => props.tamanho || '40px'};
  height: ${props => props.tamanho || '40px'};
  border: 3px solid var(--corBordaPrimaria);
  border-radius: var(--bordaRaioCircular);
  border-top-color: var(--corPrimaria);
  animation: spin 1s linear infinite;
  margin-bottom: var(--espacamentoMedio);
`;

const TextoLoading = styled.p`
  color: var(--corTextoSecundaria);
  font-size: var(--tamanhoFonteMedia);
  margin: 0;
  text-align: center;
`;

const LoadingOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: var(--corFundoModal);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: var(--zIndexLoading);
  backdrop-filter: blur(2px);
`;

const LoadingInline = styled.div`
  display: inline-flex;
  align-items: center;
  gap: var(--espacamentoPequeno);
  color: var(--corTextoSecundaria);
  font-size: var(--tamanhoFontePequena);
`;

const SpinnerPequeno = styled.div`
  width: 16px;
  height: 16px;
  border: 2px solid var(--corBordaPrimaria);
  border-radius: var(--bordaRaioCircular);
  border-top-color: var(--corPrimaria);
  animation: spin 1s linear infinite;
`;

const Loading = ({ 
  texto = 'Carregando...', 
  tamanho = '40px', 
  alturaMinima = '200px',
  tipo = 'centro',
  overlay = false 
}) => {
  if (overlay) {
    return (
      <LoadingOverlay>
        <LoadingContainer>
          <Spinner tamanho={tamanho} />
          <TextoLoading>{texto}</TextoLoading>
        </LoadingContainer>
      </LoadingOverlay>
    );
  }

  if (tipo === 'inline') {
    return (
      <LoadingInline>
        <SpinnerPequeno />
        <span>{texto}</span>
      </LoadingInline>
    );
  }

  return (
    <LoadingContainer alturaMinima={alturaMinima}>
      <Spinner tamanho={tamanho} />
      <TextoLoading>{texto}</TextoLoading>
    </LoadingContainer>
  );
};

export default Loading; 