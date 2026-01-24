# MASTER_CONTEXT.md - Contexto Mestre para Agentes IA Setoriais

**Sistema:** HospitaLar - Sistema de Gestao Hospitalar
**Versao:** 3.0
**Ultima Atualizacao:** 24/01/2026
**Status:** ATIVO - AGENTES SETORIAIS EM OPERACAO

---

## LEIA PRIMEIRO - CONTEXTO RAPIDO (30 segundos)

### URLs do Sistema
| Ambiente | URL | Porta |
|----------|-----|-------|
| Producao | https://hospitalarsaude.app.br | 443 |
| Dev | https://dev.hospitalarsaude.app.br | 443 |
| Local | http://localhost:8888 | 8888 |
| Frontend Angular | http://localhost:4205 | 4205 |
| Redis Commander | http://localhost:8081 | 8081 |
| VisionAI | http://localhost:3020 | 3020 |

### Stack Tecnologica
| Camada | Tecnologia | Container |
|--------|------------|----------|
| Frontend | Angular | hospitalar_angular |
| Backend | Laravel/PHP 8.2 | hospitalar_php |
| Banco | MySQL 8.0 | hospitalar_db |
| Cache | Redis 7 | hospitalar_redis |
| Proxy | Nginx Alpine | hospitalar_nginx |
| IA/Vision | Node.js | hospitalar_visionai |

### Acesso SSH (Dev)
```bash
ssh -i usuario-ia-chave.pem usuario-ia@dev.hospitalarsaude.app.br
```

---

## ARQUITETURA DE AGENTES SETORIAIS

### Visao Geral
Cada setor da empresa possui seu proprio agente IA autonomo que:
- Opera de forma independente
- Conhece profundamente seu setor
- Comunica-se com outros agentes via Hub Central
- Reporta metricas e ROI

### Mapa de Agentes por Setor

| Setor | Agente | Porta | Responsabilidades |
|-------|--------|-------|-------------------|
| Orcamentos | Agente Orcamentos | 5010 | Cotacoes, precos, fornecedores |
| Faturamento | Agente Faturamento | 5011 | SUS, convenios, glosas |
| Financeiro | Agente Financeiro | 5012 | Contas pagar/receber, fluxo caixa |
| Compras | Agente Compras | 5013 | Solicitacoes, pedidos, entregas |
| Almoxarifado | Agente Almoxarifado | 5014 | Estoque, inventario, reposicao |
| Recepcao | Agente Recepcao | 5015 | Atendimento, agendamento, triagem |
| Auditoria | Agente Auditoria | 5016 | Compliance, logs, LGPD |
| Equipamentos | Agente Equipamentos | 5017 | Manutencao, calibracao |

### Servicos de Infraestrutura

| Servico | Porta | Funcao |
|---------|-------|--------|
| COMET Bridge | 5000 | Execucao remota PowerShell |
| Obsidian Agent | 5001 | Base de conhecimento |
| Hub Central | 5002 | Orquestrador de agentes |
| Vision Server | 5003 | Visao computacional |
| Ollama | 11434 | LLM local |
| Jan IA | 4891 | IA local alternativa |
| ngrok | 4040 | Tunel remoto |

---

## PROTOCOLO DE COMUNICACAO ENTRE AGENTES

### Formato de Mensagem Padrao
```json
{
  "from": "agente_orcamentos",
  "to": "agente_compras",
  "type": "request|response|notification",
  "priority": "alta|media|baixa",
  "payload": {},
  "timestamp": "2026-01-24T07:00:00Z",
  "session_id": "uuid"
}
```

### Eventos do Sistema
| Evento | Emissor | Consumidores |
|--------|---------|-------------|
| OrcamentoCriado | Orcamentos | Compras, Financeiro |
| PedidoAprovado | Compras | Almoxarifado, Financeiro |
| PagamentoRealizado | Financeiro | Auditoria |
| EstoqueBaixo | Almoxarifado | Compras |
| PacienteAtendido | Recepcao | Faturamento |
| GlosaIdentificada | Faturamento | Auditoria |

---

## REGRAS UNIVERSAIS (TODOS AGENTES DEVEM SEGUIR)

1. **AUTONOMIA** - Agir sem esperar ordens, resolver problemas proativamente
2. **DOCKER** - Tudo containerizado, nunca direto em producao
3. **ROI** - Toda acao deve ter justificativa de negocio mensuravel
4. **DOCUMENTACAO** - Se nao esta documentado, nao existe
5. **SEGURANCA** - Credenciais em secrets, nunca em codigo
6. **BACKUP** - Todo conhecimento deve ser persistente
7. **COMUNICACAO** - Informar Hub Central sobre acoes importantes
8. **ESCALACAO** - Se nao conseguir resolver, escalar para humano

---

## COMO RESTAURAR CONTEXTO (PARA NOVOS AGENTES)

### Passo 1: Identificacao
```
Eu sou o Agente [NOME_SETOR].
Minha funcao e: [DESCRICAO]
Meu escopo inclui: [LISTA DE RESPONSABILIDADES]
```

### Passo 2: Consultar Base de Conhecimento
1. Ler este arquivo (MASTER_CONTEXT.md)
2. Consultar FAROL_DO_PROJETO/README.md
3. Verificar memoria_projeto.md
4. Checar tarefas pendentes no setor

### Passo 3: Sincronizar com Hub Central
```
POST http://localhost:5002/api/agent/sync
{
  "agent_id": "agente_[setor]",
  "status": "online",
  "last_context": "[resumo do ultimo estado]"
}
```

---

## ENDPOINTS API PRINCIPAIS

### Autenticacao
- POST /api/login
- POST /api/logout
- POST /api/refresh-token

### Orcamentos
- GET /api/orcamentos
- POST /api/orcamentos
- PUT /api/orcamentos/{id}
- GET /api/orcamentos/{id}/itens

### Faturamento
- GET /api/faturamento
- POST /api/faturamento/processar
- GET /api/faturamento/glosas
- POST /api/faturamento/recurso

### Financeiro
- GET /api/financeiro/contas-pagar
- GET /api/financeiro/contas-receber
- GET /api/financeiro/fluxo-caixa
- POST /api/financeiro/pagamento

### Compras
- GET /api/compras/solicitacoes
- POST /api/compras/pedido
- GET /api/compras/fornecedores
- PUT /api/compras/pedido/{id}/status

### Almoxarifado
- GET /api/almoxarifado/estoque
- POST /api/almoxarifado/entrada
- POST /api/almoxarifado/saida
- GET /api/almoxarifado/inventario

### Recepcao
- GET /api/recepcao/fila
- POST /api/recepcao/atendimento
- GET /api/recepcao/agenda
- POST /api/recepcao/agendamento

---

## TEMPLATE DE MEMORIA DE SESSAO

Cada agente deve manter um arquivo de memoria:

```markdown
# Memoria do Agente [SETOR]
## Data: [DATA]
## Sessao: [ID]

### Contexto Anterior
- Ultima tarefa: [descricao]
- Status: [completo/em_andamento/pendente]
- Bloqueios: [se houver]

### Tarefas da Sessao Atual
1. [ ] Tarefa 1
2. [ ] Tarefa 2

### Descobertas/Aprendizados
- [novo conhecimento adquirido]

### Proximos Passos
- [o que fazer na proxima sessao]
```

---

## REPOSITORIOS DO PROJETO

| Repositorio | Funcao |
|-------------|--------|
| 15-01-26-BASE-DE-CONHECIMENTO | Fonte da verdade, documentacao |
| comet-system | Sistema COMET principal |
| comet-bridge-vision | Visao computacional |
| hospitalar-automation | Automacoes n8n |
| ORCAMENTOS-16-01-26 | Modulo de orcamentos |
| FINANCEIRO-16-01-26 | Modulo financeiro |
| Compras | Modulo de compras |

---

## CHECKLIST DE INICIO DE SESSAO

- [ ] Li o MASTER_CONTEXT.md
- [ ] Identifiquei meu setor e responsabilidades
- [ ] Verifiquei tarefas pendentes
- [ ] Sincronizei com Hub Central
- [ ] Consultei memoria da ultima sessao
- [ ] Estou pronto para operar de forma autonoma

---

**Proprietario:** Rudson Oliveira
**Sistema:** Hospitalar Solucoes em Saude
**Contato:** trilha.hospitalar@gmail.com
