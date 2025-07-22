import React from 'react';
import styled, { keyframes, css } from 'styled-components';

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const pulse = keyframes`
  0% { box-shadow: 0 0 0 0 rgba(0, 191, 255, 0.7); }
  70% { box-shadow: 0 0 0 16px rgba(0, 191, 255, 0); }
  100% { box-shadow: 0 0 0 0 rgba(0, 191, 255, 0); }
`;

const SpinnerContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 180px;
  width: 100%;
`;

const Spinner = styled.div`
  width: ${props => props.tamanho || '64px'};
  height: ${props => props.tamanho || '64px'};
  border: ${props => props.tamanho ? '2px' : '8px'} solid #e0e0e0;
  border-top: ${props => props.tamanho ? '2px' : '8px'} solid #00bfff;
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
  ${props => !props.tamanho && css`
    animation: ${spin} 1s linear infinite, ${pulse} 1.2s infinite;
    margin-bottom: 18px;
    box-shadow: 0 0 0 0 rgba(0, 191, 255, 0.7);
  `}
`;

const LoadingText = styled.div`
  color: #00bfff;
  font-size: 1.2rem;
  font-weight: bold;
  letter-spacing: 1px;
  text-align: center;
`;

const Loading = ({ texto = 'Carregando...', tamanho }) => {
  // Se tamanho for especificado, renderiza apenas o spinner (para botões)
  if (tamanho) {
    return <Spinner tamanho={tamanho} />;
  }

  // Caso contrário, renderiza o loading completo (para páginas)
  return (
    <SpinnerContainer>
      <Spinner />
      <LoadingText>{texto}</LoadingText>
    </SpinnerContainer>
  );
};

export default Loading; 