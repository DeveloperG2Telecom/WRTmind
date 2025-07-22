# Script para iniciar o frontend WRTmind
Write-Host "🚀 Iniciando frontend WRTmind..." -ForegroundColor Green

# Navegar para o diretório do frontend
Set-Location "WRT-Front"

# Verificar se o package.json existe
if (Test-Path "package.json") {
    Write-Host "✅ Package.json encontrado" -ForegroundColor Green
    
    # Instalar dependências se necessário
    if (-not (Test-Path "node_modules")) {
        Write-Host "📦 Instalando dependências..." -ForegroundColor Yellow
        npm install
    }
    
    # Iniciar o servidor de desenvolvimento
    Write-Host "🔄 Iniciando servidor de desenvolvimento..." -ForegroundColor Yellow
    npm start
} else {
    Write-Host "❌ Package.json não encontrado no diretório WRT-Front" -ForegroundColor Red
    Write-Host "💡 Verifique se você está no diretório correto" -ForegroundColor Yellow
} 