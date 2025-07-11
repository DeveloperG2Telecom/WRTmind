import React, { useState, useRef, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBold,
  faItalic,
  faUnderline,
  faStrikethrough,
  faAlignLeft,
  faAlignCenter,
  faAlignRight,
  faAlignJustify,
  faListUl,
  faListOl,
  faQuoteLeft,
  faCode,
  faLink,
  faUnlink,
  faUndo,
  faRedo,
  faPalette,
  faFillDrip,
  faKeyboard
} from '@fortawesome/free-solid-svg-icons';

const EditorContainer = styled.div`
  border: 2px solid var(--corBordaPrimaria);
  border-radius: var(--bordaRaioMedia);
  background: var(--corFundoTerciaria);
  overflow: hidden;
  transition: all var(--transicaoRapida);

  &:focus-within {
    border-color: var(--corBordaFoco);
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }
`;

const BarraFerramentas = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: var(--espacamentoPequeno);
  padding: var(--espacamentoMedio);
  background: var(--corFundoSecundaria);
  border-bottom: 1px solid var(--corBordaPrimaria);
`;

const GrupoFerramentas = styled.div`
  display: flex;
  gap: 2px;
  padding: 2px;
  border-radius: var(--bordaRaioPequena);
  background: var(--corFundoTerciaria);
`;

const BotaoFerramenta = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background: ${props => props.ativo ? 'var(--corPrimaria)' : 'transparent'};
  color: ${props => props.ativo ? 'var(--corTextoClara)' : 'var(--corTextoPrimaria)'};
  border: none;
  border-radius: var(--bordaRaioPequena);
  cursor: pointer;
  transition: all var(--transicaoRapida);
  font-size: var(--tamanhoFontePequena);

  &:hover {
    background: ${props => props.ativo ? 'var(--corSecundaria)' : 'var(--corFundoSecundaria)'};
    transform: scale(1.05);
  }

  &:active {
    transform: scale(0.95);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
`;

const Separador = styled.div`
  width: 1px;
  background: var(--corBordaPrimaria);
  margin: 0 var(--espacamentoPequeno);
`;

const ContainerCores = styled.div`
  position: relative;
  display: inline-block;
`;

const BotaoCor = styled(BotaoFerramenta)`
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 16px;
    height: 16px;
    background: ${props => props.cor || 'currentColor'};
    border-radius: 2px;
    border: 1px solid var(--corBordaPrimaria);
  }
`;

const PainelCores = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  z-index: var(--zIndexDropdown);
  background: var(--corFundoTerciaria);
  border: 1px solid var(--corBordaPrimaria);
  border-radius: var(--bordaRaioMedia);
  padding: var(--espacamentoMedio);
  box-shadow: var(--sombraMedia);
  display: ${props => props.visivel ? 'grid' : 'none'};
  grid-template-columns: repeat(8, 1fr);
  gap: var(--espacamentoPequeno);
  min-width: 200px;
`;

const AmostraCor = styled.button`
  width: 24px;
  height: 24px;
  border: 2px solid var(--corBordaPrimaria);
  border-radius: var(--bordaRaioPequena);
  background: ${props => props.cor};
  cursor: pointer;
  transition: all var(--transicaoRapida);

  &:hover {
    transform: scale(1.2);
    border-color: var(--corPrimaria);
  }
`;

const AreaTexto = styled.div`
  min-height: 200px;
  max-height: 500px;
  padding: var(--espacamentoMedio);
  outline: none;
  overflow-y: auto;
  font-size: var(--tamanhoFonteMedia);
  line-height: 1.6;
  color: var(--corTextoPrimaria);
  
  /* Forçar direção LTR */
  direction: ltr !important;
  text-align: left !important;
  unicode-bidi: normal !important;
  writing-mode: horizontal-tb !important;
  
  &[contenteditable="true"] {
    direction: ltr !important;
    text-align: left !important;
  }

  &[contenteditable="true"]:empty:before {
    content: attr(placeholder);
    color: var(--corTextoTerciaria);
    pointer-events: none;
    direction: ltr !important;
    text-align: left !important;
  }

  /* Estilos para elementos formatados */
  strong, b {
    font-weight: bold;
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

  p {
    margin: 0;
    padding: 0;
  }

  blockquote {
    border-left: 4px solid var(--corPrimaria);
    margin: var(--espacamentoMedio) 0;
    padding-left: var(--espacamentoMedio);
    font-style: italic;
    color: var(--corTextoSecundaria);
  }

  code {
    background: var(--corFundoSecundaria);
    padding: 2px 6px;
    border-radius: var(--bordaRaioPequena);
    font-family: 'Courier New', monospace;
    font-size: 0.9em;
  }

  pre {
    background: var(--corFundoSecundaria);
    padding: var(--espacamentoMedio);
    border-radius: var(--bordaRaioMedia);
    overflow-x: auto;
  }

  ul, ol {
    margin: var(--espacamentoMedio) 0;
    padding-left: var(--espacamentoGrande);
  }

  a {
    color: var(--corPrimaria);
    text-decoration: none;
  }

  a:hover {
    color: var(--corSecundaria);
  }
`;

const coresTexto = [
  '#000000', '#ffffff', '#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff',
  '#800000', '#008000', '#000080', '#808000', '#800080', '#008080', '#808080', '#c0c0c0',
  '#ffa500', '#ffc0cb', '#dda0dd', '#90ee90', '#87ceeb', '#f0e68c', '#ffb6c1', '#add8e6'
];

const coresFundo = [
  'transparent', '#ffffff', '#ffebee', '#e8f5e8', '#e3f2fd', '#fff8e1', '#fce4ec', '#f3e5f5',
  '#e0f2f1', '#fff3e0', '#f1f8e9', '#e8eaf6', '#fafafa', '#f5f5f5', '#eeeeee', '#e0e0e0'
];

const EditorTexto = ({ 
  valor, 
  onChange, 
  placeholder = 'Digite seu texto aqui...',
  alturaMinima = '200px',
  alturaMaxima = '500px',
  usarTextarea = false
}) => {
  const [coresTextoVisivel, setCoresTextoVisivel] = useState(false);
  const [coresFundoVisivel, setCoresFundoVisivel] = useState(false);
  const [historico, setHistorico] = useState([]);
  const [indiceHistorico, setIndiceHistorico] = useState(-1);
  const [usarTextareaFallback, setUsarTextareaFallback] = useState(usarTextarea);
  const editorRef = useRef(null);
  const valorInternoRef = useRef('');

  // Função para alternar para textarea se necessário
  const alternarParaTextarea = () => {
    setUsarTextareaFallback(true);
  };

  useEffect(() => {
    if (editorRef.current && valor !== valorInternoRef.current) {
      editorRef.current.innerHTML = valor || '';
      valorInternoRef.current = valor || '';
    }
  }, [valor]);

  const executarComando = (comando, valor = null) => {
    document.execCommand(comando, false, valor);
    editorRef.current?.focus();
    salvarHistorico();
  };

  const salvarHistorico = useCallback(() => {
    if (editorRef.current) {
      const novoEstado = editorRef.current.innerHTML;
      
      // Só atualizar se o conteúdo realmente mudou
      if (novoEstado !== valorInternoRef.current) {
        valorInternoRef.current = novoEstado;
        
        const novoHistorico = historico.slice(0, indiceHistorico + 1);
        novoHistorico.push(novoEstado);
        
        setHistorico(novoHistorico);
        setIndiceHistorico(novoHistorico.length - 1);
        
        if (onChange) {
          onChange(novoEstado);
        }
      }
    }
  }, [historico, indiceHistorico, onChange]);

  const desfazer = () => {
    if (indiceHistorico > 0) {
      const novoIndice = indiceHistorico - 1;
      setIndiceHistorico(novoIndice);
      if (editorRef.current) {
        const estadoAnterior = historico[novoIndice];
        editorRef.current.innerHTML = estadoAnterior;
        valorInternoRef.current = estadoAnterior;
        if (onChange) {
          onChange(estadoAnterior);
        }
      }
    }
  };

  const refazer = () => {
    if (indiceHistorico < historico.length - 1) {
      const novoIndice = indiceHistorico + 1;
      setIndiceHistorico(novoIndice);
      if (editorRef.current) {
        const proximoEstado = historico[novoIndice];
        editorRef.current.innerHTML = proximoEstado;
        valorInternoRef.current = proximoEstado;
        if (onChange) {
          onChange(proximoEstado);
        }
      }
    }
  };

  const aplicarCorTexto = (cor) => {
    executarComando('foreColor', cor);
    setCoresTextoVisivel(false);
  };

  const aplicarCorFundo = (cor) => {
    if (cor === 'transparent') {
      executarComando('hiliteColor', 'transparent');
    } else {
      executarComando('hiliteColor', cor);
    }
    setCoresFundoVisivel(false);
  };

  const inserirLink = () => {
    const url = prompt('Digite a URL:');
    if (url) {
      executarComando('createLink', url);
    }
  };

  const removerLink = () => {
    executarComando('unlink');
  };

  const podeDesfazer = indiceHistorico > 0;
  const podeRefazer = indiceHistorico < historico.length - 1;

  return (
    <EditorContainer>
      {!usarTextareaFallback ? (
        <>
          <BarraFerramentas>
            <GrupoFerramentas>
              <BotaoFerramenta
                onClick={desfazer}
                disabled={!podeDesfazer}
                title="Desfazer"
              >
                <FontAwesomeIcon icon={faUndo} />
              </BotaoFerramenta>
              <BotaoFerramenta
                onClick={refazer}
                disabled={!podeRefazer}
                title="Refazer"
              >
                <FontAwesomeIcon icon={faRedo} />
              </BotaoFerramenta>
            </GrupoFerramentas>

            <Separador />

            <GrupoFerramentas>
              <BotaoFerramenta
                onClick={() => executarComando('bold')}
                title="Negrito"
              >
                <FontAwesomeIcon icon={faBold} />
              </BotaoFerramenta>
              <BotaoFerramenta
                onClick={() => executarComando('italic')}
                title="Itálico"
              >
                <FontAwesomeIcon icon={faItalic} />
              </BotaoFerramenta>
              <BotaoFerramenta
                onClick={() => executarComando('underline')}
                title="Sublinhado"
              >
                <FontAwesomeIcon icon={faUnderline} />
              </BotaoFerramenta>
              <BotaoFerramenta
                onClick={() => executarComando('strikeThrough')}
                title="Tachado"
              >
                <FontAwesomeIcon icon={faStrikethrough} />
              </BotaoFerramenta>
            </GrupoFerramentas>

            <Separador />

            <GrupoFerramentas>
              <BotaoFerramenta
                onClick={() => executarComando('justifyLeft')}
                title="Alinhar à Esquerda"
              >
                <FontAwesomeIcon icon={faAlignLeft} />
              </BotaoFerramenta>
              <BotaoFerramenta
                onClick={() => executarComando('justifyCenter')}
                title="Centralizar"
              >
                <FontAwesomeIcon icon={faAlignCenter} />
              </BotaoFerramenta>
              <BotaoFerramenta
                onClick={() => executarComando('justifyRight')}
                title="Alinhar à Direita"
              >
                <FontAwesomeIcon icon={faAlignRight} />
              </BotaoFerramenta>
              <BotaoFerramenta
                onClick={() => executarComando('justifyFull')}
                title="Justificar"
              >
                <FontAwesomeIcon icon={faAlignJustify} />
              </BotaoFerramenta>
            </GrupoFerramentas>

            <Separador />

            <GrupoFerramentas>
              <BotaoFerramenta
                onClick={() => executarComando('insertUnorderedList')}
                title="Lista Não Ordenada"
              >
                <FontAwesomeIcon icon={faListUl} />
              </BotaoFerramenta>
              <BotaoFerramenta
                onClick={() => executarComando('insertOrderedList')}
                title="Lista Ordenada"
              >
                <FontAwesomeIcon icon={faListOl} />
              </BotaoFerramenta>
              <BotaoFerramenta
                onClick={() => executarComando('formatBlock', '<blockquote>')}
                title="Citação"
              >
                <FontAwesomeIcon icon={faQuoteLeft} />
              </BotaoFerramenta>
              <BotaoFerramenta
                onClick={() => executarComando('formatBlock', '<pre>')}
                title="Código"
              >
                <FontAwesomeIcon icon={faCode} />
              </BotaoFerramenta>
            </GrupoFerramentas>

            <Separador />

            <GrupoFerramentas>
              <BotaoFerramenta
                onClick={inserirLink}
                title="Inserir Link"
              >
                <FontAwesomeIcon icon={faLink} />
              </BotaoFerramenta>
              <BotaoFerramenta
                onClick={removerLink}
                title="Remover Link"
              >
                <FontAwesomeIcon icon={faUnlink} />
              </BotaoFerramenta>
            </GrupoFerramentas>

            <Separador />

            <ContainerCores>
              <BotaoCor
                onClick={() => setCoresTextoVisivel(!coresTextoVisivel)}
                title="Cor do Texto"
              >
                <FontAwesomeIcon icon={faPalette} />
              </BotaoCor>
              <PainelCores visivel={coresTextoVisivel}>
                {coresTexto.map(cor => (
                  <AmostraCor
                    key={cor}
                    cor={cor}
                    onClick={() => aplicarCorTexto(cor)}
                    title={cor}
                  />
                ))}
              </PainelCores>
            </ContainerCores>

            <ContainerCores>
              <BotaoCor
                onClick={() => setCoresFundoVisivel(!coresFundoVisivel)}
                title="Cor de Fundo"
              >
                <FontAwesomeIcon icon={faFillDrip} />
              </BotaoCor>
              <PainelCores visivel={coresFundoVisivel}>
                {coresFundo.map(cor => (
                  <AmostraCor
                    key={cor}
                    cor={cor}
                    onClick={() => aplicarCorFundo(cor)}
                    title={cor === 'transparent' ? 'Transparente' : cor}
                  />
                ))}
              </PainelCores>
            </ContainerCores>

            <BotaoFerramenta
              onClick={alternarParaTextarea}
              title="Alternar para Textarea"
            >
              <FontAwesomeIcon icon={faKeyboard} />
            </BotaoFerramenta>
          </BarraFerramentas>

          <AreaTexto
            ref={editorRef}
            contentEditable={!usarTextareaFallback}
            placeholder={placeholder}
            onInput={salvarHistorico}
            onBlur={salvarHistorico}
            style={{ 
              minHeight: alturaMinima, 
              maxHeight: alturaMaxima
            }}
          />
        </>
      ) : (
        <textarea
          ref={editorRef}
          value={valor || ''}
          onChange={(e) => {
            const novoValor = e.target.value;
            if (novoValor !== valorInternoRef.current) {
              valorInternoRef.current = novoValor;
              onChange && onChange(novoValor);
            }
          }}
          placeholder={placeholder}
          style={{
            width: '100%',
            minHeight: alturaMinima,
            maxHeight: alturaMaxima,
            padding: 'var(--espacamentoMedio)',
            border: '2px solid var(--corBordaPrimaria)',
            borderRadius: 'var(--bordaRaioMedia)',
            fontSize: 'var(--tamanhoFonteMedia)',
            lineHeight: '1.6',
            color: 'var(--corTextoPrimaria)',
            backgroundColor: 'var(--corFundoTerciaria)',
            direction: 'ltr',
            textAlign: 'left',
            resize: 'vertical',
            outline: 'none'
          }}
        />
      )}
    </EditorContainer>
  );
};

export default EditorTexto; 