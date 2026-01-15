# 🏗️ Infraestrutura: Docker Mega Ultra v6.0

**Origem:** `hospitalar-docker-upgrade`

## 1. Descrição

Este componente define uma infraestrutura Docker completa e pronta para produção, utilizando `docker-compose` com profiles para gerenciamento inteligente de recursos. É a base recomendada para o deploy de qualquer novo sistema ou serviço.

## 2. Principais Serviços

| Serviço | Porta | Função |
|---|---|---|
| **Traefik** | 8082 | Proxy reverso e balanceador de carga |
| **Portainer** | 9000 | Interface de gerenciamento Docker |
| **Grafana** | 3001 | Dashboards de monitoramento |
| **Prometheus** | 9090 | Coleta de métricas |
| **Loki** | 3100 | Agregação de logs |
| **Ollama** | 11434 | Execução de LLMs locais |
| **MySQL** | 3308 | Banco de dados relacional |
| **Redis** | 6379 | Cache em memória |

## 3. Como Utilizar

Para iniciar a infraestrutura completa, utilize o seguinte comando:

```bash
docker compose -f docker-compose-mega-ultra.yml --profile full up -d
```

Para um deploy mais otimizado, utilize os profiles:

```bash
# Apenas serviços essenciais e monitoramento
docker compose -f docker-compose-mega-ultra.yml \
  --profile always-on \
  --profile monitoring \
  up -d
```

## 4. Código Fonte Reutilizável

O arquivo `docker-compose-mega-ultra.yml` pode ser encontrado no repositório `hospitalar-docker-upgrade` e serve como um template robusto para novas configurações de infraestrutura.
