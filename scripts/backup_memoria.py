#!/usr/bin/env python3
"""
Script de Backup Automático da Memória do Projeto
Hospitalar Saúde - Sistema Autônomo com IA

Este script cria backups timestamped dos arquivos de memória e planejamento
do projeto, garantindo a persistência do conhecimento adquirido.
"""

import os
import shutil
from datetime import datetime
from pathlib import Path

# Configurações
PROJECT_DIR = Path("/home/ubuntu/hospitalar_saude_projeto")
BACKUP_DIR = PROJECT_DIR / "backups"
FILES_TO_BACKUP = [
    "memoria_projeto.md",
    "planejamento_projeto.md",
]

def create_backup():
    """Cria um backup timestamped dos arquivos do projeto."""
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    backup_folder = BACKUP_DIR / timestamp
    
    # Criar diretório de backup
    backup_folder.mkdir(parents=True, exist_ok=True)
    
    backed_up = []
    for filename in FILES_TO_BACKUP:
        source = PROJECT_DIR / filename
        if source.exists():
            dest = backup_folder / filename
            shutil.copy2(source, dest)
            backed_up.append(filename)
            print(f"✓ Backup criado: {filename}")
        else:
            print(f"⚠ Arquivo não encontrado: {filename}")
    
    # Criar arquivo de metadados
    metadata_file = backup_folder / "backup_metadata.txt"
    with open(metadata_file, "w") as f:
        f.write(f"Backup criado em: {datetime.now().isoformat()}\n")
        f.write(f"Arquivos incluídos:\n")
        for file in backed_up:
            f.write(f"  - {file}\n")
    
    print(f"\n✓ Backup completo salvo em: {backup_folder}")
    return backup_folder

def cleanup_old_backups(max_backups=10):
    """Remove backups antigos, mantendo apenas os mais recentes."""
    if not BACKUP_DIR.exists():
        return
    
    backups = sorted([d for d in BACKUP_DIR.iterdir() if d.is_dir()], reverse=True)
    
    if len(backups) > max_backups:
        for old_backup in backups[max_backups:]:
            shutil.rmtree(old_backup)
            print(f"✗ Backup antigo removido: {old_backup.name}")

def list_backups():
    """Lista todos os backups disponíveis."""
    if not BACKUP_DIR.exists():
        print("Nenhum backup encontrado.")
        return []
    
    backups = sorted([d for d in BACKUP_DIR.iterdir() if d.is_dir()], reverse=True)
    
    if not backups:
        print("Nenhum backup encontrado.")
        return []
    
    print("\n📁 Backups disponíveis:")
    print("-" * 50)
    for i, backup in enumerate(backups, 1):
        metadata_file = backup / "backup_metadata.txt"
        if metadata_file.exists():
            with open(metadata_file, "r") as f:
                first_line = f.readline().strip()
            print(f"{i}. {backup.name} - {first_line}")
        else:
            print(f"{i}. {backup.name}")
    print("-" * 50)
    
    return backups

def restore_backup(backup_name):
    """Restaura um backup específico."""
    backup_folder = BACKUP_DIR / backup_name
    
    if not backup_folder.exists():
        print(f"Backup não encontrado: {backup_name}")
        return False
    
    for filename in FILES_TO_BACKUP:
        source = backup_folder / filename
        if source.exists():
            dest = PROJECT_DIR / filename
            shutil.copy2(source, dest)
            print(f"✓ Restaurado: {filename}")
    
    print(f"\n✓ Backup restaurado de: {backup_folder}")
    return True

if __name__ == "__main__":
    import sys
    
    if len(sys.argv) > 1:
        command = sys.argv[1].lower()
        
        if command == "backup":
            create_backup()
            cleanup_old_backups()
        elif command == "list":
            list_backups()
        elif command == "restore" and len(sys.argv) > 2:
            restore_backup(sys.argv[2])
        else:
            print("Uso: python backup_memoria.py [backup|list|restore <nome>]")
    else:
        # Comportamento padrão: criar backup
        create_backup()
        cleanup_old_backups()
