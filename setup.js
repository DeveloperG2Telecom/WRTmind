#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Configurando o projeto WRTmind...\n');

// Função para executar comandos
function executarComando(comando, diretorio) {
  try {
    console.log(`📁 Executando em ${diretorio}: ${comando}`);
    execSync(comando, { 
      cwd: diretorio, 
      stdio: 'inherit',
      shell: true 
    });
    return true;
  } catch (error) {
    console.error(`❌ Erro ao executar: ${comando}`);
    return false;
  }
}

// Função para copiar arquivo de configuração
function copiarConfig(origem, destino) {
  try {
    if (fs.existsSync(origem) && !fs.existsSync(destino)) {
      fs.copyFileSync(origem, destino);
      console.log(`✅ Configuração copiada: ${destino}`);
      return true;
    }
    return false;
  } catch (error) {
    console.error(`❌ Erro ao copiar configuração: ${origem} -> ${destino}`);
    return false;
  }
}

// Verificar se Node.js está instalado
try {
  const nodeVersion = execSync('node --version', { encoding: 'utf8' });
  console.log(`✅ Node.js encontrado: ${nodeVersion.trim()}`);
} catch (error) {
  console.error('❌ Node.js não encontrado. Instale o Node.js primeiro.');
  process.exit(1);
}

// Verificar se MongoDB está rodando
try {
  execSync('mongod --version', { stdio: 'ignore' });
  console.log('✅ MongoDB local encontrado');
} catch (error) {
  console.log('ℹ️ Usando MongoDB Atlas (nuvem)');
}

// 1. Configurar Banco de Dados (Arquivado - Migrado para Firebase)
console.log('\n📊 Banco de dados MongoDB arquivado - usando Firebase...');
console.log('ℹ️ A pasta WRT-DB foi movida para archive/');
console.log('ℹ️ O sistema agora usa Firebase como banco principal');

// 2. Configurar Backend
console.log('\n🔧 Configurando backend...');
if (executarComando('npm install', 'WRT-Back')) {
  copiarConfig('WRT-Back/config.env', 'WRT-Back/.env');
  console.log('✅ Backend configurado');
} else {
  console.error('❌ Falha ao configurar backend');
  process.exit(1);
}

// 3. Configurar Frontend
console.log('\n🎨 Configurando frontend...');
if (executarComando('npm install', 'WRT-Front')) {
  copiarConfig('WRT-Front/config.env', 'WRT-Front/.env');
  console.log('✅ Frontend configurado');
} else {
  console.error('❌ Falha ao configurar frontend');
  process.exit(1);
}

// 4. Configurar Firebase (Banco principal)
console.log('\n🔥 Firebase já configurado como banco principal');
console.log('ℹ️ Verifique as configurações em config/firebase.json');

// 5. Próximos passos
console.log('\n🎉 Configuração concluída com sucesso!');
console.log('\n📋 Próximos passos:');
console.log('1. Inicie o backend: cd WRT-Back && npm run dev');
console.log('2. Inicie o frontend: cd WRT-Front && npm start');
console.log('3. Para testar Firebase: node tests/test-firebase.js');
console.log('4. Inicie o frontend: cd WRT-Front && npm start');
console.log('\n🌐 URLs:');
console.log('- Frontend: http://localhost:3000');
console.log('- Backend API: http://localhost:5000/api');
console.log('- Health Check: http://localhost:5000/api/health'); 