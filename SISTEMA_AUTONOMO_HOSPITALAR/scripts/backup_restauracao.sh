#!/bin/bash
# ============================================================
# SCRIPT DE BACKUP E RESTAURAÇÃO - SISTEMA HOSPITALAR SAÚDE
# ============================================================
# Autor: Manus AI
# Data: 2026-01-17
# Versão: 1.0
# ============================================================

set -e

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configurações
BACKUP_DIR="/home/ubuntu/base_conhecimento/SISTEMA_AUTONOMO_HOSPITALAR/backups"
PROJETO_DIR="C:/Users/rudpa/Documents/hospitalar/hospitalar_v2"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
COMET_URL="https://manus-comet-hospital.ngrok-free.dev"

# Função para exibir ajuda
show_help() {
    echo -e "${BLUE}============================================================${NC}"
    echo -e "${BLUE}SISTEMA DE BACKUP E RESTAURAÇÃO - HOSPITALAR SAÚDE${NC}"
    echo -e "${BLUE}============================================================${NC}"
    echo ""
    echo "Uso: $0 [comando] [opções]"
    echo ""
    echo "Comandos:"
    echo "  backup              Criar backup completo do sistema"
    echo "  backup-docs         Criar backup apenas da documentação"
    echo "  backup-code         Criar backup apenas do código"
    echo "  backup-db           Criar backup do banco de dados"
    echo "  restore [arquivo]   Restaurar backup específico"
    echo "  list                Listar backups disponíveis"
    echo "  status              Verificar status do sistema"
    echo "  sync                Sincronizar com GitHub"
    echo ""
    echo "Exemplos:"
    echo "  $0 backup"
    echo "  $0 restore backup_20260117_120000.tar.gz"
    echo "  $0 list"
    echo ""
}

# Função para verificar conexão com COMET Bridge
check_comet() {
    echo -e "${YELLOW}Verificando conexão com COMET Bridge...${NC}"
    response=$(curl -s --max-time 10 -H "ngrok-skip-browser-warning: true" "$COMET_URL/health" 2>/dev/null || echo "error")
    if [[ "$response" == *"error"* ]]; then
        echo -e "${RED}ERRO: COMET Bridge não está acessível${NC}"
        return 1
    fi
    echo -e "${GREEN}COMET Bridge conectado!${NC}"
    return 0
}

# Função para criar backup completo
backup_full() {
    echo -e "${BLUE}============================================================${NC}"
    echo -e "${BLUE}INICIANDO BACKUP COMPLETO${NC}"
    echo -e "${BLUE}============================================================${NC}"
    
    BACKUP_NAME="backup_full_${TIMESTAMP}"
    mkdir -p "$BACKUP_DIR/$BACKUP_NAME"
    
    # Backup da documentação local
    echo -e "${YELLOW}[1/5] Copiando documentação...${NC}"
    cp -r /home/ubuntu/hospitalar_projeto/* "$BACKUP_DIR/$BACKUP_NAME/" 2>/dev/null || true
    
    # Backup dos arquivos PHP via COMET
    if check_comet; then
        echo -e "${YELLOW}[2/5] Baixando arquivos do backend via COMET...${NC}"
        
        # Baixar IAOrcamentoService
        curl -s -H "ngrok-skip-browser-warning: true" \
            -H "Content-Type: application/json" \
            -X POST "$COMET_URL/exec" \
            -d '{"command": "Get-Content \"'"$PROJETO_DIR"'/hospitalar_backend/app/Services/IA/IAOrcamentoService.php\" -Raw"}' \
            | jq -r '.output' > "$BACKUP_DIR/$BACKUP_NAME/IAOrcamentoService.php" 2>/dev/null || true
        
        # Baixar LLMRouter
        curl -s -H "ngrok-skip-browser-warning: true" \
            -H "Content-Type: application/json" \
            -X POST "$COMET_URL/exec" \
            -d '{"command": "Get-Content \"'"$PROJETO_DIR"'/hospitalar_backend/app/Services/IA/LLMRouter.php\" -Raw"}' \
            | jq -r '.output' > "$BACKUP_DIR/$BACKUP_NAME/LLMRouter.php" 2>/dev/null || true
        
        # Baixar ApiConfigController
        curl -s -H "ngrok-skip-browser-warning: true" \
            -H "Content-Type: application/json" \
            -X POST "$COMET_URL/exec" \
            -d '{"command": "Get-Content \"'"$PROJETO_DIR"'/hospitalar_backend/app/Http/Controllers/Api/ApiConfigController.php\" -Raw"}' \
            | jq -r '.output' > "$BACKUP_DIR/$BACKUP_NAME/ApiConfigController.php" 2>/dev/null || true
        
        echo -e "${YELLOW}[3/5] Baixando arquivos do frontend via COMET...${NC}"
        
        # Baixar api-config.component.ts
        curl -s -H "ngrok-skip-browser-warning: true" \
            -H "Content-Type: application/json" \
            -X POST "$COMET_URL/exec" \
            -d '{"command": "Get-Content \"'"$PROJETO_DIR"'/hospitalar_frontend/src/app/dashboard/configuracoes/api-config/api-config.component.ts\" -Raw"}' \
            | jq -r '.output' > "$BACKUP_DIR/$BACKUP_NAME/api-config.component.ts" 2>/dev/null || true
        
        echo -e "${YELLOW}[4/5] Exportando banco de dados...${NC}"
        curl -s -H "ngrok-skip-browser-warning: true" \
            -H "Content-Type: application/json" \
            -X POST "$COMET_URL/exec" \
            -d '{"command": "docker exec hospitalar_db mysqldump -u root -proot hospitalar_saude > /tmp/db_backup.sql 2>&1; Get-Content /tmp/db_backup.sql"}' \
            | jq -r '.output' > "$BACKUP_DIR/$BACKUP_NAME/database.sql" 2>/dev/null || true
    else
        echo -e "${YELLOW}[2-4/5] COMET não disponível, pulando backup remoto...${NC}"
    fi
    
    echo -e "${YELLOW}[5/5] Compactando backup...${NC}"
    cd "$BACKUP_DIR"
    tar -czf "${BACKUP_NAME}.tar.gz" "$BACKUP_NAME"
    rm -rf "$BACKUP_NAME"
    
    echo -e "${GREEN}============================================================${NC}"
    echo -e "${GREEN}BACKUP CONCLUÍDO: ${BACKUP_NAME}.tar.gz${NC}"
    echo -e "${GREEN}Tamanho: $(du -h "${BACKUP_NAME}.tar.gz" | cut -f1)${NC}"
    echo -e "${GREEN}============================================================${NC}"
}

# Função para restaurar backup
restore_backup() {
    BACKUP_FILE="$1"
    
    if [[ -z "$BACKUP_FILE" ]]; then
        echo -e "${RED}ERRO: Especifique o arquivo de backup${NC}"
        echo "Uso: $0 restore <arquivo.tar.gz>"
        list_backups
        return 1
    fi
    
    if [[ ! -f "$BACKUP_DIR/$BACKUP_FILE" ]]; then
        echo -e "${RED}ERRO: Arquivo não encontrado: $BACKUP_FILE${NC}"
        list_backups
        return 1
    fi
    
    echo -e "${BLUE}============================================================${NC}"
    echo -e "${BLUE}INICIANDO RESTAURAÇÃO${NC}"
    echo -e "${BLUE}============================================================${NC}"
    
    # Extrair backup
    echo -e "${YELLOW}[1/4] Extraindo backup...${NC}"
    RESTORE_DIR="$BACKUP_DIR/restore_${TIMESTAMP}"
    mkdir -p "$RESTORE_DIR"
    tar -xzf "$BACKUP_DIR/$BACKUP_FILE" -C "$RESTORE_DIR"
    
    # Verificar conexão COMET
    if check_comet; then
        echo -e "${YELLOW}[2/4] Restaurando arquivos do backend...${NC}"
        
        # Encontrar diretório extraído
        EXTRACTED_DIR=$(ls "$RESTORE_DIR" | head -1)
        
        # Restaurar cada arquivo PHP
        for file in "$RESTORE_DIR/$EXTRACTED_DIR"/*.php; do
            if [[ -f "$file" ]]; then
                filename=$(basename "$file")
                echo -e "  Restaurando $filename..."
                B64=$(base64 -w 0 "$file")
                
                case "$filename" in
                    "IAOrcamentoService.php")
                        TARGET="$PROJETO_DIR/hospitalar_backend/app/Services/IA/IAOrcamentoService.php"
                        ;;
                    "LLMRouter.php")
                        TARGET="$PROJETO_DIR/hospitalar_backend/app/Services/IA/LLMRouter.php"
                        ;;
                    "ApiConfigController.php")
                        TARGET="$PROJETO_DIR/hospitalar_backend/app/Http/Controllers/Api/ApiConfigController.php"
                        ;;
                    *)
                        continue
                        ;;
                esac
                
                curl -s -H "ngrok-skip-browser-warning: true" \
                    -H "Content-Type: application/json" \
                    -X POST "$COMET_URL/exec" \
                    -d "{\"command\": \"[System.IO.File]::WriteAllBytes('${TARGET//\//\\\\}', [System.Convert]::FromBase64String('$B64'))\"}" > /dev/null
            fi
        done
        
        echo -e "${YELLOW}[3/4] Restaurando arquivos do frontend...${NC}"
        for file in "$RESTORE_DIR/$EXTRACTED_DIR"/*.ts; do
            if [[ -f "$file" ]]; then
                filename=$(basename "$file")
                echo -e "  Restaurando $filename..."
                B64=$(base64 -w 0 "$file")
                
                case "$filename" in
                    "api-config.component.ts")
                        TARGET="$PROJETO_DIR/hospitalar_frontend/src/app/dashboard/configuracoes/api-config/api-config.component.ts"
                        ;;
                    *)
                        continue
                        ;;
                esac
                
                curl -s -H "ngrok-skip-browser-warning: true" \
                    -H "Content-Type: application/json" \
                    -X POST "$COMET_URL/exec" \
                    -d "{\"command\": \"[System.IO.File]::WriteAllBytes('${TARGET//\//\\\\}', [System.Convert]::FromBase64String('$B64'))\"}" > /dev/null
            fi
        done
        
        echo -e "${YELLOW}[4/4] Limpando cache do Laravel...${NC}"
        curl -s -H "ngrok-skip-browser-warning: true" \
            -H "Content-Type: application/json" \
            -X POST "$COMET_URL/exec" \
            -d '{"command": "docker exec hospitalar_php php artisan config:clear; docker exec hospitalar_php php artisan cache:clear"}' > /dev/null
    else
        echo -e "${RED}COMET não disponível. Restauração manual necessária.${NC}"
        echo -e "${YELLOW}Arquivos extraídos em: $RESTORE_DIR${NC}"
        return 1
    fi
    
    # Limpar diretório temporário
    rm -rf "$RESTORE_DIR"
    
    echo -e "${GREEN}============================================================${NC}"
    echo -e "${GREEN}RESTAURAÇÃO CONCLUÍDA!${NC}"
    echo -e "${GREEN}============================================================${NC}"
}

# Função para listar backups
list_backups() {
    echo -e "${BLUE}============================================================${NC}"
    echo -e "${BLUE}BACKUPS DISPONÍVEIS${NC}"
    echo -e "${BLUE}============================================================${NC}"
    
    if [[ -d "$BACKUP_DIR" ]]; then
        ls -lh "$BACKUP_DIR"/*.tar.gz 2>/dev/null || echo "Nenhum backup encontrado"
    else
        echo "Diretório de backup não existe"
    fi
}

# Função para verificar status
check_status() {
    echo -e "${BLUE}============================================================${NC}"
    echo -e "${BLUE}STATUS DO SISTEMA${NC}"
    echo -e "${BLUE}============================================================${NC}"
    
    # Verificar COMET
    echo -e "\n${YELLOW}COMET Bridge:${NC}"
    if check_comet; then
        echo -e "${GREEN}  Status: ONLINE${NC}"
    else
        echo -e "${RED}  Status: OFFLINE${NC}"
    fi
    
    # Verificar containers Docker
    echo -e "\n${YELLOW}Containers Docker:${NC}"
    if check_comet; then
        curl -s -H "ngrok-skip-browser-warning: true" \
            -H "Content-Type: application/json" \
            -X POST "$COMET_URL/exec" \
            -d '{"command": "docker ps --format \"{{.Names}}: {{.Status}}\" | Where-Object { $_ -match \"hospitalar\" }"}' \
            | jq -r '.output' 2>/dev/null || echo "Não foi possível verificar"
    fi
    
    # Verificar Ollama
    echo -e "\n${YELLOW}Ollama (LLM Local):${NC}"
    if check_comet; then
        response=$(curl -s -H "ngrok-skip-browser-warning: true" \
            -H "Content-Type: application/json" \
            -X POST "$COMET_URL/exec" \
            -d '{"command": "curl -s http://localhost:11434/api/tags 2>&1"}' \
            | jq -r '.output' 2>/dev/null)
        if [[ "$response" == *"models"* ]]; then
            echo -e "${GREEN}  Status: ONLINE${NC}"
        else
            echo -e "${RED}  Status: OFFLINE${NC}"
        fi
    fi
    
    # Verificar backups
    echo -e "\n${YELLOW}Backups:${NC}"
    backup_count=$(ls "$BACKUP_DIR"/*.tar.gz 2>/dev/null | wc -l)
    echo -e "  Total: $backup_count backups"
    if [[ $backup_count -gt 0 ]]; then
        latest=$(ls -t "$BACKUP_DIR"/*.tar.gz 2>/dev/null | head -1)
        echo -e "  Último: $(basename "$latest")"
    fi
}

# Função para sincronizar com GitHub
sync_github() {
    echo -e "${BLUE}============================================================${NC}"
    echo -e "${BLUE}SINCRONIZANDO COM GITHUB${NC}"
    echo -e "${BLUE}============================================================${NC}"
    
    cd /home/ubuntu/base_conhecimento
    
    git add .
    git commit -m "Backup automático - $(date '+%Y-%m-%d %H:%M:%S')" || echo "Nada para commitar"
    git push origin main || echo "Erro ao fazer push (verifique autenticação)"
    
    echo -e "${GREEN}Sincronização concluída!${NC}"
}

# Main
case "$1" in
    backup)
        backup_full
        ;;
    backup-docs)
        backup_docs
        ;;
    backup-code)
        backup_code
        ;;
    backup-db)
        backup_db
        ;;
    restore)
        restore_backup "$2"
        ;;
    list)
        list_backups
        ;;
    status)
        check_status
        ;;
    sync)
        sync_github
        ;;
    help|--help|-h)
        show_help
        ;;
    *)
        show_help
        ;;
esac
