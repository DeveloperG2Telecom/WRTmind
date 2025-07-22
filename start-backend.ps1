# Script para iniciar o backend WRTmind
Write-Host "🚀 Iniciando backend WRTmind..." -ForegroundColor Green

# Navegar para o diretório do backend
Set-Location "WRT-Back"

# Verificar se o package.json existe
if (Test-Path "package.json") {
    Write-Host "✅ Package.json encontrado" -ForegroundColor Green
    
    # Instalar dependências se necessário
    if (-not (Test-Path "node_modules")) {
        Write-Host "📦 Instalando dependências..." -ForegroundColor Yellow
        npm install
    }
    
    # Iniciar o servidor
    Write-Host "🔄 Iniciando servidor..." -ForegroundColor Yellow
    npm start
} else {
    Write-Host "❌ Package.json não encontrado no diretório WRT-Back" -ForegroundColor Red
    Write-Host "💡 Verifique se você está no diretório correto" -ForegroundColor Yellow
} 