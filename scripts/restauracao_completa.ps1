# Script de Restauração Completa - Autonomia Hospitalar Saúde
# Versão: 1.0.0
# Autor: Manus AI

# --- CONFIGURAÇÕES ---
$BaseDir = "C:\Users\rudpa\Documents"
$AutonomiaRepo = "https://github.com/Rudson-Oliveira/projeto-2026-autonomia.git"
$SistemaRepo = "https://github.com/Rudson-Oliveira/13-01-26-Sistema.git"
$AutonomiaDir = "$BaseDir\projeto-2026-autonomia"
$SistemaDir = "$BaseDir\hospitalar\hospitalar_v2"

# --- FUNÇÕES AUXILIARES ---
function Write-SectionHeader($title) {
    Write-Host "`n============================================"
    Write-Host "  $title"
    Write-Host "============================================`n" -ForegroundColor Green
}

function Check-Command($command) {
    if (Get-Command $command -ErrorAction SilentlyContinue) {
        Write-Host "✅ $command está instalado." -ForegroundColor Green
        return $true
    } else {
        Write-Host "❌ $command não encontrado. Por favor, instale-o e adicione ao PATH." -ForegroundColor Red
        return $false
    }
}

# --- INÍCIO DA EXECUÇÃO ---

# 1. VERIFICAR PRÉ-REQUISITOS
Write-SectionHeader "1. Verificando Pré-requisitos"
$git_ok = Check-Command "git"
$docker_ok = Check-Command "docker"
$python_ok = Check-Command "python"
$ngrok_ok = Check-Command "ngrok"

if (-not ($git_ok -and $docker_ok -and $python_ok -and $ngrok_ok)) {
    Write-Host "`nInstalação abortada. Verifique os pré-requisitos acima." -ForegroundColor Red
    exit
}

# 2. CONFIGURAR TOKEN GITHUB
Write-SectionHeader "2. Configurando Token do GitHub"
$env:GH_TOKEN = Read-Host -Prompt "Por favor, insira seu Token de API do GitHub (ghp_...)"
if (-not $env:GH_TOKEN) {
    Write-Host "Token do GitHub é obrigatório. Abortando." -ForegroundColor Red
    exit
}
Write-Host "✅ Token do GitHub configurado para esta sessão."

# 3. CLONAR REPOSITÓRIOS
Write-SectionHeader "3. Clonando Repositórios do GitHub"
New-Item -ItemType Directory -Force -Path "$BaseDir\hospitalar"

Write-Host "Clonando repositório de autonomia..."
git clone $AutonomiaRepo "$AutonomiaDir"

Write-Host "Clonando repositório do sistema hospitalar..."
git clone $SistemaRepo "$SistemaDir"

# 4. INSTALAR E INICIAR AGENTES LOCAIS
Write-SectionHeader "4. Instalando Agentes Locais (COMET Bridge, ngrok)"
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$AutonomiaDir\scripts'; .\instalar_e_iniciar.ps1"
Write-Host "✅ Scripts de agentes locais iniciados em novas janelas."
Write-Host "Aguarde a inicialização completa do COMET Bridge e do ngrok."
Read-Host -Prompt "Pressione Enter quando as janelas do COMET e ngrok estiverem prontas"

# 5. INICIAR AMBIENTE DOCKER
Write-SectionHeader "5. Iniciando Ambiente Docker do Sistema Hospitalar"
cd $SistemaDir
docker-compose up -d
Write-Host "Aguardando 60 segundos para os containers iniciarem..."
Start-Sleep -Seconds 60
docker ps

# 6. RESTAURAR BANCO DE DADOS
Write-SectionHeader "6. Restaurando Banco de Dados MySQL"
$BackupFile = Read-Host -Prompt "Por favor, insira o caminho completo para o arquivo de backup SQL (ex: C:\backups\backup.sql)"
if (-not (Test-Path $BackupFile)) {
    Write-Host "Arquivo de backup não encontrado. Pulando restauração do banco de dados." -ForegroundColor Yellow
} else {
    $DbPassword = Read-Host -Prompt "Insira a senha root do banco de dados MySQL"
    Write-Host "Restaurando banco de dados... Isso pode levar alguns minutos."
    Get-Content $BackupFile | docker exec -i hospitalar_db mysql -u root -p"$DbPassword" hospitalar_db
    Write-Host "✅ Restauração do banco de dados concluída."
}

# 7. INSTALAR MÓDULO DE IA
Write-SectionHeader "7. Instalando Módulo de IA no Backend Laravel"
cd "$AutonomiaDir\laravel-ia-module"
.\install_ia_module.ps1

Write-Host "`nSiga os passos manuais indicados pela instalação do módulo de IA para finalizar a configuração."

# --- FIM DA EXECUÇÃO ---
Write-SectionHeader "RESTAURAÇÃO CONCLUÍDA!"
Write-Host "Verifique todas as janelas e logs para garantir que não houve erros."
Write-Host "Acesse http://localhost:8888 para validar o sistema."
Read-Host -Prompt "Pressione Enter para fechar esta janela..." 
para fechar..."
