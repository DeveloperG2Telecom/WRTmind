import React, { useState } from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faLock, faEnvelope, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

const AuthContainer = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, var(--corPrimaria) 0%, var(--corSecundaria) 100%);
  padding: 20px;
`;

const AuthCard = styled.div`
  background: white;
  border-radius: var(--bordaRaioGrande);
  box-shadow: var(--sombraForte);
  padding: 40px;
  width: 100%;
  max-width: 400px;
  animation: fadeIn 0.5s ease-out;
`;

const Logo = styled.div`
  text-align: center;
  margin-bottom: 30px;
  
  h1 {
    color: var(--corPrimaria);
    font-size: 2rem;
    font-weight: bold;
    margin: 0;
  }
  
  p {
    color: var(--corTextoSecundaria);
    margin: 5px 0 0 0;
  }
`;

const TabContainer = styled.div`
  display: flex;
  margin-bottom: 30px;
  border-bottom: 2px solid var(--corBordaPrimaria);
`;

const Tab = styled.button`
  flex: 1;
  padding: 15px;
  background: none;
  border: none;
  font-size: var(--tamanhoFonteGrande);
  font-weight: bold;
  color: ${props => props['data-active'] ? 'var(--corPrimaria)' : 'var(--corTextoSecundaria)'};
  border-bottom: 2px solid ${props => props['data-active'] ? 'var(--corPrimaria)' : 'transparent'};
  cursor: pointer;
  transition: all var(--transicaoMedia);
  
  &:hover {
    color: var(--corPrimaria);
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const FormGroup = styled.div`
  position: relative;
`;

const Input = styled.input`
  width: 100%;
  padding: 15px 15px 15px 45px;
  border: 2px solid var(--corBordaPrimaria);
  border-radius: var(--bordaRaioMedia);
  font-size: var(--tamanhoFonteMedia);
  transition: all var(--transicaoMedia);
  
  &:focus {
    outline: none;
    border-color: var(--corPrimaria);
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }
  
  &::placeholder {
    color: var(--corTextoTerciaria);
  }
`;

const IconWrapper = styled.div`
  position: absolute;
  left: 15px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--corTextoTerciaria);
  z-index: 1;
`;

const PasswordToggle = styled.button`
  position: absolute;
  right: 15px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: var(--corTextoTerciaria);
  cursor: pointer;
  z-index: 1;
  
  &:hover {
    color: var(--corPrimaria);
  }
`;

const SubmitButton = styled.button`
  width: 100%;
  padding: 15px;
  background: var(--corPrimaria);
  color: white;
  border: none;
  border-radius: var(--bordaRaioMedia);
  font-size: var(--tamanhoFonteGrande);
  font-weight: bold;
  cursor: pointer;
  transition: all var(--transicaoMedia);
  
  &:hover {
    background: var(--corSecundaria);
    transform: translateY(-2px);
    box-shadow: var(--sombraHover);
  }
  
  &:disabled {
    background: var(--corTextoTerciaria);
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

const ErrorMessage = styled.div`
  background: var(--corErro);
  color: white;
  padding: 10px;
  border-radius: var(--bordaRaioMedia);
  font-size: var(--tamanhoFonteMedia);
  text-align: center;
`;

const SuccessMessage = styled.div`
  background: var(--corSucesso);
  color: white;
  padding: 10px;
  border-radius: var(--bordaRaioMedia);
  font-size: var(--tamanhoFonteMedia);
  text-align: center;
`;

const LoadingSpinner = styled.div`
  display: inline-block;
  width: 20px;
  height: 20px;
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: white;
  animation: spin 1s ease-in-out infinite;
  margin-right: 10px;
`;

const AuthScreen = ({ onLogin }) => {
  const [activeTab, setActiveTab] = useState('login');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const [loginData, setLoginData] = useState({
    email: '',
    senha: ''
  });
  
  const [cadastroData, setCadastroData] = useState({
    nome: '',
    email: '',
    senha: '',
    confirmarSenha: ''
  });

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginData),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess('Login realizado com sucesso!');
        // Salvar dados do usuário no localStorage
        localStorage.setItem('user', JSON.stringify(data.usuario));
        // Chamar callback de login
        setTimeout(() => {
          onLogin(data.usuario);
        }, 1000);
      } else {
        setError(data.error || 'Erro ao fazer login');
      }
    } catch (error) {
      setError('Erro de conexão. Verifique se o servidor está rodando.');
    } finally {
      setLoading(false);
    }
  };

  const handleCadastro = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    // Validar senhas
    if (cadastroData.senha !== cadastroData.confirmarSenha) {
      setError('As senhas não coincidem');
      setLoading(false);
      return;
    }
    
    if (cadastroData.senha.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/auth/cadastro', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nome: cadastroData.nome,
          email: cadastroData.email,
          senha: cadastroData.senha
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess('Cadastro realizado com sucesso! Faça login para continuar.');
        // Limpar formulário
        setCadastroData({
          nome: '',
          email: '',
          senha: '',
          confirmarSenha: ''
        });
        // Mudar para aba de login
        setTimeout(() => {
          setActiveTab('login');
          setSuccess('');
        }, 2000);
      } else {
        setError(data.error || 'Erro ao fazer cadastro');
      }
    } catch (error) {
      setError('Erro de conexão. Verifique se o servidor está rodando.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (form, field, value) => {
    if (form === 'login') {
      setLoginData(prev => ({ ...prev, [field]: value }));
    } else {
      setCadastroData(prev => ({ ...prev, [field]: value }));
    }
    // Limpar mensagens ao digitar
    setError('');
    setSuccess('');
  };

  return (
    <AuthContainer>
      <AuthCard>
        <Logo>
          <h1>WRTmind</h1>
          <p>Organize suas ideias e links</p>
        </Logo>

        <TabContainer>
          <Tab 
            data-active={activeTab === 'login'} 
            onClick={() => setActiveTab('login')}
          >
            Login
          </Tab>
          <Tab 
            data-active={activeTab === 'cadastro'} 
            onClick={() => setActiveTab('cadastro')}
          >
            Cadastro
          </Tab>
        </TabContainer>

        {error && <ErrorMessage>{error}</ErrorMessage>}
        {success && <SuccessMessage>{success}</SuccessMessage>}

        {activeTab === 'login' ? (
          <Form onSubmit={handleLogin}>
            <FormGroup>
              <IconWrapper>
                <FontAwesomeIcon icon={faEnvelope} />
              </IconWrapper>
              <Input
                type="email"
                placeholder="Email"
                value={loginData.email}
                onChange={(e) => handleInputChange('login', 'email', e.target.value)}
                autoComplete="email"
                required
              />
            </FormGroup>

            <FormGroup>
              <IconWrapper>
                <FontAwesomeIcon icon={faLock} />
              </IconWrapper>
              <Input
                type={showPassword ? 'text' : 'password'}
                placeholder="Senha"
                value={loginData.senha}
                onChange={(e) => handleInputChange('login', 'senha', e.target.value)}
                autoComplete="current-password"
                required
              />
              <PasswordToggle
                type="button"
                onClick={() => setShowPassword(!showPassword)}
              >
                <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
              </PasswordToggle>
            </FormGroup>

            <SubmitButton type="submit" disabled={loading}>
              {loading && <LoadingSpinner />}
              {loading ? 'Entrando...' : 'Entrar'}
            </SubmitButton>
          </Form>
        ) : (
          <Form onSubmit={handleCadastro}>
            <FormGroup>
              <IconWrapper>
                <FontAwesomeIcon icon={faUser} />
              </IconWrapper>
              <Input
                type="text"
                placeholder="Nome completo"
                value={cadastroData.nome}
                onChange={(e) => handleInputChange('cadastro', 'nome', e.target.value)}
                autoComplete="name"
                required
              />
            </FormGroup>

            <FormGroup>
              <IconWrapper>
                <FontAwesomeIcon icon={faEnvelope} />
              </IconWrapper>
              <Input
                type="email"
                placeholder="Email"
                value={cadastroData.email}
                onChange={(e) => handleInputChange('cadastro', 'email', e.target.value)}
                autoComplete="email"
                required
              />
            </FormGroup>

            <FormGroup>
              <IconWrapper>
                <FontAwesomeIcon icon={faLock} />
              </IconWrapper>
              <Input
                type={showPassword ? 'text' : 'password'}
                placeholder="Senha"
                value={cadastroData.senha}
                onChange={(e) => handleInputChange('cadastro', 'senha', e.target.value)}
                autoComplete="new-password"
                required
              />
              <PasswordToggle
                type="button"
                onClick={() => setShowPassword(!showPassword)}
              >
                <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
              </PasswordToggle>
            </FormGroup>

            <FormGroup>
              <IconWrapper>
                <FontAwesomeIcon icon={faLock} />
              </IconWrapper>
              <Input
                type={showPassword ? 'text' : 'password'}
                placeholder="Confirmar senha"
                value={cadastroData.confirmarSenha}
                onChange={(e) => handleInputChange('cadastro', 'confirmarSenha', e.target.value)}
                required
              />
            </FormGroup>

            <SubmitButton type="submit" disabled={loading}>
              {loading && <LoadingSpinner />}
              {loading ? 'Cadastrando...' : 'Cadastrar'}
            </SubmitButton>
          </Form>
        )}
      </AuthCard>
    </AuthContainer>
  );
};

export default AuthScreen; 