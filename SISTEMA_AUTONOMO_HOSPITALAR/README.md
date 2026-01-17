# Sistema Autônomo Hospitalar Saúde

## Visão Geral

Sistema de automação hospitalar com IA integrada, projetado para eliminar tarefas repetitivas e tornar a empresa mais competitiva.

## Estrutura do Diretório

```
SISTEMA_AUTONOMO_HOSPITALAR/
├── docs/                    # Documentação completa do projeto
│   ├── memoria_sistema.md   # Memória persistente do sistema
│   ├── ARQUITETURA_*.md     # Documentos de arquitetura
│   ├── CHECKLIST_*.md       # Checklists de implementação
│   └── ROADMAP_*.md         # Roadmaps do projeto
├── php_files/               # Arquivos PHP do backend Laravel
│   ├── LLMRouter.php        # Orquestrador de LLM com fallback
│   ├── *Provider.php        # Providers de LLM (Ollama, Jan, etc.)
│   └── ApiConfigController.php  # Controller de configuração de APIs
├── scripts/                 # Scripts de automação
│   └── backup_restauracao.sh    # Script de backup e restauração
└── backups/                 # Diretório de backups
```

## Sistema de Backup e Restauração

### Comandos Disponíveis

```bash
# Criar backup completo
./scripts/backup_restauracao.sh backup

# Listar backups disponíveis
./scripts/backup_restauracao.sh list

# Restaurar backup específico
./scripts/backup_restauracao.sh restore backup_20260117_120000.tar.gz

# Verificar status do sistema
./scripts/backup_restauracao.sh status

# Sincronizar com GitHub
./scripts/backup_restauracao.sh sync
```

### O que é incluído no backup

- Documentação completa (arquivos .md)
- Arquivos PHP do backend (Services, Controllers, Providers)
- Arquivos TypeScript do frontend (Components)
- Dump do banco de dados MySQL

## Arquitetura de Redundância de LLM

O sistema utiliza múltiplos provedores de LLM com fallback automático:

| Prioridade | Provedor | Tipo | Custo |
|------------|----------|------|-------|
| 1 | Ollama | Local | Grátis |
| 2 | Jan | Local | Grátis |
| 3 | DeepSeek | API | Grátis |
| 4 | Grok | API | Pago |
| 5 | OpenAI | API | Pago |
| 6 | HuggingFace | API | Grátis |

## Conexão com o Sistema

- **COMET Bridge**: https://manus-comet-hospital.ngrok-free.dev
- **VisionAI**: https://visionai-khprjuve.manus.space

## Contato

Desenvolvido por Manus AI para Hospitalar Saúde.
