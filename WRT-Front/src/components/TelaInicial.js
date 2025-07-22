import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faPlus,
  faEdit,
  faTrash,
  faTimes,
  faExternalLinkAlt
} from '@fortawesome/free-solid-svg-icons';
import { linksAPI } from '../config/api';
import Loading from './Loading';

const Container = styled.div`
  padding: 1rem 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const Titulo = styled.h1`
  color: var(--corTextoPrimaria);
  margin-bottom: 1rem;
  font-size: 2.5rem;
  font-weight: 700;
`;

const Subtitulo = styled.p`
  color: var(--corTextoSecundaria);
  margin-bottom: 1.5rem;
  font-size: 1.2rem;
  line-height: 1.6;
`;

const GradeContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 1.5rem;
  margin-top: 1rem;
`;

const IconeItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
  background: var(--corFundoCard);
  border: 2px solid var(--corBordaPrimaria);
  border-radius: var(--bordaRaioMedia);
  cursor: pointer;
  transition: all 0.3s ease;
  min-height: 120px;
  position: relative;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
    border-color: var(--corPrimaria);
  }

  &.arrastando {
    opacity: 0.5;
    transform: rotate(5deg);
  }

  &.sobre {
    border-color: var(--corSecundaria);
    background: var(--corFundoHover);
  }
`;

const IconeImagem = styled.img`
  width: 48px;
  height: 48px;
  margin-bottom: 0.5rem;
  border-radius: var(--bordaRaioPequena);
`;

const IconeTexto = styled.span`
  color: var(--corTextoPrimaria);
  font-size: 0.9rem;
  font-weight: 500;
  text-align: center;
  margin-top: 0.5rem;
`;

const BotaoAdicionar = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
  background: var(--corFundoCard);
  border: 2px dashed var(--corBordaPrimaria);
  border-radius: var(--bordaRaioMedia);
  cursor: pointer;
  transition: all 0.3s ease;
  min-height: 120px;

  &:hover {
    border-color: var(--corPrimaria);
    background: var(--corFundoHover);
    transform: translateY(-2px);
  }

  &.sobre {
    border-color: var(--corPrimaria);
    background: var(--corFundoHover);
    transform: scale(1.05);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  }
`;

const IconeAdicionar = styled.div`
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--corPrimaria);
  border-radius: 50%;
  margin-bottom: 0.5rem;
  color: white;
  font-size: 1.2rem;
`;

const TextoAdicionar = styled.span`
  color: var(--corTextoSecundaria);
  font-size: 0.9rem;
  font-weight: 500;
`;

// Modal styles
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: var(--corFundoCard);
  border-radius: var(--bordaRaioGrande);
  padding: 2rem;
  width: 90%;
  max-width: 500px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
`;

const ModalTitle = styled.h2`
  color: var(--corTextoPrimaria);
  margin: 0;
  font-size: 1.5rem;
`;

const BotaoFechar = styled.button`
  background: none;
  border: none;
  color: var(--corTextoSecundaria);
  font-size: 1.2rem;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: var(--bordaRaioPequena);

  &:hover {
    background: var(--corFundoHover);
    color: var(--corTextoPrimaria);
  }
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const Label = styled.label`
  display: block;
  color: var(--corTextoPrimaria);
  margin-bottom: 0.5rem;
  font-weight: 500;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 2px solid var(--corBordaPrimaria);
  border-radius: var(--bordaRaioPequena);
  background: var(--corFundo);
  color: var(--corTextoPrimaria);
  font-size: 1rem;
  transition: border-color 0.3s ease;

  &:focus {
    outline: none;
    border-color: var(--corPrimaria);
  }
`;

const BotaoSalvar = styled.button`
  background: var(--corPrimaria);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: var(--bordaRaioPequena);
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.3s ease;

  &:hover {
    background: var(--corPrimariaHover);
  }

  &:disabled {
    background: var(--corTextoSecundaria);
    cursor: not-allowed;
  }
`;

const AcoesIcone = styled.div`
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  display: flex;
  gap: 0.25rem;
  opacity: 0;
  transition: opacity 0.3s ease;
`;

const BotaoAcao = styled.button`
  background: var(--corFundoCard);
  border: 1px solid var(--corBordaPrimaria);
  color: var(--corTextoSecundaria);
  padding: 0.25rem;
  border-radius: var(--bordaRaioPequena);
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.8rem;

  &:hover {
    background: var(--corPrimaria);
    color: white;
    border-color: var(--corPrimaria);
  }

  &.danger:hover {
    background: var(--corErro);
    border-color: var(--corErro);
  }
`;

const TelaInicial = () => {
  const [icones, setIcones] = useState([]);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [editando, setEditando] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);
  const [formData, setFormData] = useState({
    nome: '',
    urlIcone: '',
    urlDestino: ''
  });

  // Drag & Drop state
  const [arrastando, setArrastando] = useState(null);
  const [sobre, setSobre] = useState(null);
  const [reordenando, setReordenando] = useState(false);

  // Carregar links do banco de dados
  const carregarLinks = useCallback(async () => {
    try {
      setCarregando(true);
      setErro(null);
      
      console.log('🔄 Carregando links do banco...');
      const response = await linksAPI.buscarTodos();
      const links = response.links || [];
      console.log('📊 Links carregados:', links.length);
      
      // Converter para o formato esperado pelo componente
      const iconesFormatados = links.map(link => ({
        id: link.id,
        nome: link.nome,
        urlIcone: link.urlIcone,
        urlDestino: link.urlDestino,
        posicao: link.posicao
      }));
      
      setIcones(iconesFormatados);
      console.log('✅ Links atualizados na interface');
    } catch (error) {
      console.error('❌ Erro ao carregar links:', error);
      setErro('Erro ao carregar links de atalho');
    } finally {
      setCarregando(false);
    }
  }, []); // Sem dependências para evitar loops

  // Carregar links apenas uma vez ao montar o componente
  useEffect(() => {
    carregarLinks();
  }, [carregarLinks]); // Usar a função carregarLinks definida acima

  const handleAdicionar = useCallback((posicao = null) => {
    setEditando(null);
    setFormData({ nome: '', urlIcone: '', urlDestino: '' });
    setMostrarModal(true);
    // Se uma posição foi especificada, vamos usá-la
    if (posicao !== null) {
      setEditando({ posicao }); // Usar objeto para indicar posição específica
    }
  }, []);

  const handleClick = useCallback((icone) => {
    window.open(icone.urlDestino, '_blank');
  }, []);

  const handleEditar = useCallback((icone, index) => {
    setEditando(icone.id);
    setFormData({
      nome: icone.nome,
      urlIcone: icone.urlIcone,
      urlDestino: icone.urlDestino
    });
    setMostrarModal(true);
  }, []);

  const handleSalvar = useCallback(async () => {
    if (formData.nome.trim() && formData.urlIcone.trim() && formData.urlDestino.trim()) {
      try {
        // Determinar a posição
        let posicao;
        if (editando && typeof editando === 'object' && editando.posicao !== undefined) {
          // Nova posição específica
          posicao = editando.posicao;
        } else if (editando && typeof editando === 'string') {
          // Editando link existente - manter posição atual
          const linkExistente = icones.find(icon => icon.id === editando);
          posicao = linkExistente ? linkExistente.posicao : icones.length;
        } else {
          // Novo link - encontrar próxima posição vazia ou adicionar ao final
          const posicoesOcupadas = icones.map(icon => icon.posicao).sort((a, b) => a - b);
          posicao = 0;
          for (let i = 0; i < posicoesOcupadas.length; i++) {
            if (posicoesOcupadas[i] !== i) {
              posicao = i;
              break;
            }
            posicao = i + 1;
          }
        }

        const linkData = {
          nome: formData.nome.trim(),
          urlIcone: formData.urlIcone.trim(),
          urlDestino: formData.urlDestino.trim(),
          posicao: posicao
        };

        if (editando && typeof editando === 'string') {
          // Atualizar link existente
          console.log('🔄 Atualizando link existente:', editando);
          await linksAPI.atualizar(editando, linkData);
          console.log('✅ Link atualizado com sucesso');
        } else {
          // Criar novo link
          console.log('🔄 Criando novo link:', linkData);
          await linksAPI.criar(linkData);
          console.log('✅ Link criado com sucesso');
        }

        // Recarregar links do banco
        console.log('🔄 Recarregando links após salvar...');
        await carregarLinks();
        console.log('✅ Links recarregados com sucesso');
        
        setMostrarModal(false);
        setEditando(null);
        setFormData({ nome: '', urlIcone: '', urlDestino: '' });
      } catch (error) {
        console.error('Erro ao salvar link:', error);
        alert('Erro ao salvar link. Tente novamente.');
      }
    }
  }, [formData, editando, icones, carregarLinks]);

  const handleCancelar = useCallback(() => {
    setMostrarModal(false);
    setEditando(null);
    setFormData({ nome: '', urlIcone: '', urlDestino: '' });
  }, []);

  const handleRemover = useCallback(async (index) => {
    const icone = icones.find(icon => icon.posicao === index);
    if (!icone) {
      console.log('❌ Ícone não encontrado para posição:', index);
      return;
    }

    console.log('🔄 Tentando remover ícone:', icone);
    console.log('🆔 ID do ícone:', icone.id);

    if (window.confirm('Tem certeza que deseja remover este ícone?')) {
      try {
        console.log('🗑️ Executando exclusão do link ID:', icone.id);
        await linksAPI.excluir(icone.id);
        console.log('✅ Link excluído com sucesso');
        
        console.log('🔄 Recarregando links após exclusão...');
        await carregarLinks();
        console.log('✅ Links recarregados após exclusão');
      } catch (error) {
        console.error('❌ Erro ao remover link:', error);
        alert('Erro ao remover link. Tente novamente.');
      }
    }
  }, [icones, carregarLinks]);

  // Drag & Drop - Reordenação livre
  const handleDragStart = useCallback((e, index) => {
    setArrastando(index);
    e.dataTransfer.effectAllowed = 'move';
  }, []);

  const handleDragOver = useCallback((e, index) => {
    e.preventDefault();
    if (arrastando !== null && arrastando !== index) {
      setSobre(index);
    }
  }, [arrastando]);

  const handleDragLeave = useCallback(() => {
    setSobre(null);
  }, []);

  const handleDrop = useCallback(async (e, index) => {
    e.preventDefault();
    if (arrastando !== null && arrastando !== index) {
      try {
        setReordenando(true);
        
        // Encontrar o link que está sendo movido
        const linkMovido = icones.find(icon => icon.posicao === arrastando);
        if (!linkMovido) return;

        // Encontrar o link que está na posição de destino (se houver)
        const linkDestino = icones.find(icon => icon.posicao === index);
        
        // Criar nova lista com as posições atualizadas
        const novosIcones = icones.map(icon => {
          if (icon.posicao === arrastando) {
            // Link movido vai para a nova posição
            return { ...icon, posicao: index };
          } else if (linkDestino && icon.posicao === index) {
            // Link que estava na posição de destino vai para a posição do link movido
            return { ...icon, posicao: arrastando };
          }
          return icon;
        });
        
        // Atualizar posições no banco
        const linksComPosicoes = novosIcones.map(icone => ({
          id: icone.id,
          posicao: icone.posicao
        }));
        
        // Salvar no banco
        await linksAPI.atualizarPosicoes(linksComPosicoes);
        
        // Recarregar do banco
        await carregarLinks();
      } catch (error) {
        console.error('Erro ao reordenar links:', error);
        alert('Erro ao reordenar links. Tente novamente.');
      } finally {
        setReordenando(false);
      }
    }
    setArrastando(null);
    setSobre(null);
  }, [arrastando, icones, carregarLinks]);

  const handleDragEnd = useCallback(() => {
    setArrastando(null);
    setSobre(null);
  }, []);

  // Criar grade 7x5 (35 posições)
  const posicoes = Array.from({ length: 35 }, (_, i) => i);

  // Mostrar loading
  if (carregando) {
    return (
      <Container>
        <Loading texto="Carregando links de atalho..." />
      </Container>
    );
  }

  // Mostrar erro
  if (erro) {
    return (
      <Container>
        <div style={{ 
          textAlign: 'center', 
          padding: '50px',
          color: 'var(--corErro)'
        }}>
          <h3>Erro ao carregar links</h3>
          <p>{erro}</p>
          <button 
            onClick={carregarLinks}
            style={{
              padding: '10px 20px',
              background: 'var(--corPrimaria)',
              color: 'white',
              border: 'none',
              borderRadius: 'var(--bordaRaioMedia)',
              cursor: 'pointer',
              marginTop: '20px'
            }}
          >
            Tentar novamente
          </button>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <Titulo>Links de atalho</Titulo>
        <Subtitulo>
          Organize seus links de atalho favoritos. Clique em "Adicionar Ícone" para começar,
          ou arraste e solte para reorganizar
        </Subtitulo>

      <GradeContainer style={{ position: 'relative' }}>
        {reordenando && (
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000,
            borderRadius: 'var(--bordaRaioMedia)'
          }}>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '10px'
            }}>
              <div style={{
                width: '40px',
                height: '40px',
                border: '4px solid var(--corPrimaria)',
                borderTop: '4px solid transparent',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite'
              }}></div>
              <span style={{ color: 'var(--corPrimaria)', fontWeight: 'bold' }}>
                Reposicionando...
              </span>
            </div>
          </div>
        )}
        
        {posicoes.map((posicao) => {
          const icone = icones.find(icon => icon.posicao === posicao);
          
          if (!icone) {
            // Posição vazia - mostrar botão de adicionar
            return (
              <BotaoAdicionar 
                key={`empty-${posicao}`} 
                onClick={() => !reordenando && handleAdicionar(posicao)}
                className={`${sobre === posicao ? 'sobre' : ''}`}
                onDragOver={(e) => !reordenando && handleDragOver(e, posicao)}
                onDragLeave={!reordenando ? handleDragLeave : undefined}
                onDrop={(e) => !reordenando && handleDrop(e, posicao)}
                style={{ 
                  pointerEvents: reordenando ? 'none' : 'auto',
                  opacity: reordenando ? 0.6 : 1
                }}
              >
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
              draggable={!reordenando}
              onDragStart={(e) => !reordenando && handleDragStart(e, posicao)}
              onDragOver={(e) => !reordenando && handleDragOver(e, posicao)}
              onDragLeave={!reordenando ? handleDragLeave : undefined}
              onDrop={(e) => !reordenando && handleDrop(e, posicao)}
              onDragEnd={!reordenando ? handleDragEnd : undefined}
              onClick={() => !reordenando && handleClick(icone)}
              onMouseEnter={(e) => {
                if (!reordenando) {
                  e.currentTarget.querySelector('.acoes-icone').style.opacity = '1';
                }
              }}
              onMouseLeave={(e) => {
                if (!reordenando) {
                  e.currentTarget.querySelector('.acoes-icone').style.opacity = '0';
                }
              }}
              style={{ 
                pointerEvents: reordenando ? 'none' : 'auto',
                opacity: reordenando ? 0.6 : 1
              }}
            >
              <IconeImagem 
                src={icone.urlIcone} 
                alt={icone.nome}
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
              <IconeTexto>{icone.nome}</IconeTexto>
              
              <AcoesIcone className="acoes-icone" onClick={(e) => e.stopPropagation()}>
                <BotaoAcao
                  onClick={() => !reordenando && handleEditar(icone, posicao)}
                  title="Editar"
                  disabled={reordenando}
                  style={{ opacity: reordenando ? 0.5 : 1, cursor: reordenando ? 'not-allowed' : 'pointer' }}
                >
                  <FontAwesomeIcon icon={faEdit} size="sm" />
                </BotaoAcao>
                <BotaoAcao
                  className="danger"
                  onClick={() => !reordenando && handleRemover(posicao)}
                  title="Remover"
                  disabled={reordenando}
                  style={{ opacity: reordenando ? 0.5 : 1, cursor: reordenando ? 'not-allowed' : 'pointer' }}
                >
                  <FontAwesomeIcon icon={faTrash} size="sm" />
                </BotaoAcao>
                <BotaoAcao
                  onClick={() => !reordenando && handleClick(icone)}
                  title="Abrir"
                  disabled={reordenando}
                  style={{ opacity: reordenando ? 0.5 : 1, cursor: reordenando ? 'not-allowed' : 'pointer' }}
                >
                  <FontAwesomeIcon icon={faExternalLinkAlt} size="sm" />
                </BotaoAcao>
              </AcoesIcone>
            </IconeItem>
          );
        })}
      </GradeContainer>

      {/* Modal */}
      {mostrarModal && (
        <ModalOverlay onClick={handleCancelar}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <ModalHeader>
              <ModalTitle>
                {editando && typeof editando === 'string' ? 'Editar Ícone' : 'Adicionar Ícone'}
              </ModalTitle>
              <BotaoFechar onClick={handleCancelar}>
                <FontAwesomeIcon icon={faTimes} />
              </BotaoFechar>
            </ModalHeader>

            <FormGroup>
              <Label>Nome do Ícone</Label>
              <Input
                type="text"
                value={formData.nome}
                onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                placeholder="Ex: Google"
              />
            </FormGroup>

            <FormGroup>
              <Label>URL do Ícone</Label>
              <Input
                type="url"
                value={formData.urlIcone}
                onChange={(e) => setFormData({ ...formData, urlIcone: e.target.value })}
                placeholder="https://exemplo.com/favicon.ico"
              />
            </FormGroup>

            <FormGroup>
              <Label>URL de Destino</Label>
              <Input
                type="url"
                value={formData.urlDestino}
                onChange={(e) => setFormData({ ...formData, urlDestino: e.target.value })}
                placeholder="https://exemplo.com"
              />
            </FormGroup>

            <BotaoSalvar onClick={handleSalvar}>
              {editando && typeof editando === 'string' ? 'Atualizar' : 'Adicionar'}
            </BotaoSalvar>
          </ModalContent>
        </ModalOverlay>
      )}
    </Container>
  );
};

export default TelaInicial; 