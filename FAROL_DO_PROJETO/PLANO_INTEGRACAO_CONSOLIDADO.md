# 🚀 Plano de Integração Consolidado - Sistema Autônomo v8.0

**Data:** 15 de Janeiro de 2026  
**Objetivo:** Unificar todos os componentes em um único sistema (`13-01-26-Sistema`)  
**Tempo Estimado:** 7-10 dias

---

## 🎯 Fases da Integração

### Fase 1: Conexão com Agentes Locais (1 dia)

**Objetivo:** Garantir que o backend TypeScript se comunique com todos os agentes Python.

1.  **Atualizar `agents-integration.ts`:**
    - Adicionar endpoints para Hub Central (:5002), Vision Server (:5003).
    - Implementar health check automático que verifica todos os 13 agentes.
2.  **Criar Wrapper para Hub Central:**
    - Criar `server/services/hub-central-adapter.ts`.
    - Implementar métodos para `get_triggers`, `get_connectors`, etc.
3.  **Testar Conexão via COMET Bridge:**
    - Criar teste em `server/__tests__/e2e-agents-connection.test.ts`.
    - Validar que o backend consegue se comunicar com todos os agentes.

### Fase 2: Orquestrador Central (2 dias)

**Objetivo:** Implementar o cérebro do sistema, capaz de gerenciar tarefas complexas.

1.  **Expandir `orchestrator.ts`:**
    - Integrar `BullMQ` para criar uma fila de tarefas persistente com Redis.
    - Definir tipos de jobs: `process_budget`, `analyze_image`, `send_report`.
2.  **Integrar com Hub Central:**
    - Usar o `hub-central-adapter.ts` para delegar tarefas aos agentes Python.
    - Ex: `orchestrator` recebe job -> chama `Hub Central` -> `Hub Central` aciona `Obsidian Agent`.
3.  **Implementar Resiliência:**
    - Adicionar retry automático (3 tentativas) com backoff exponencial para jobs falhos.
    - Implementar `Circuit Breaker` para evitar sobrecarregar serviços instáveis.
4.  **Criar Dashboard de Monitoramento:**
    - Adicionar uma nova página no frontend para visualizar a fila do BullMQ.
    - Mostrar status dos jobs (ativo, completo, falho).

### Fase 3: Motor de Orçamento (2 dias)

**Objetivo:** Implementar a principal lógica de negócio do sistema.

1.  **Criar `server/services/budget-engine.ts`:**
    - Implementar a lógica de `LOGICA_ORCAMENTO_HOSPITALAR.md`.
    - Cruzamento com tabelas de convênios, análise de mercado, etc.
2.  **Integrar com `hospitalar-adapter.ts`:**
    - Usar o adaptador para buscar dados de pacientes e planos.
    - Salvar o orçamento finalizado no sistema Hospitalar.
3.  **Criar Alertas de Margem:**
    - Calcular a margem de lucro para cada item.
    - Se a margem for < 20%, disparar um evento para o `Orchestrator` notificar o usuário.

### Fase 4: Router de IA Inteligente (1 dia)

**Objetivo:** Otimizar custos de API de LLMs.

1.  **Criar `server/services/ai-router.ts`:**
    - Implementar a lógica de roteamento por complexidade da tarefa.
2.  **Definir Estratégia de Roteamento:**
    - **Baixa Complexidade (e.g., formatar texto):** Usar `Ollama` (local, custo zero).
    - **Média Complexidade (e.g., resumir e-mail):** Usar `Gemini Flash` (baixo custo).
    - **Alta Complexidade (e.g., análise de contrato):** Usar `Claude 3.5 Sonnet` ou `GPT-4o`.
3.  **Configurar Fallbacks:**
    - Se um modelo falhar, tentar o próximo na hierarquia.
    - Ex: `Ollama` falha -> tenta `Gemini Flash` -> tenta `Claude`.

### Fase 5: Docker Unificado (1 dia)

**Objetivo:** Criar um ambiente de produção completo e portátil.

1.  **Criar `docker-compose.yml` Unificado:**
    - Mesclar o `docker-compose.yaml` do `projeto-2026-autonomia` com o `docker-compose-mega-ultra.yml` do `hospitalar-docker-upgrade`.
    - Incluir todos os 16+ serviços (backend, frontend, db, n8n, ollama, traefik, etc.).
2.  **Configurar Profiles (dev/prod):**
    - Criar profiles para iniciar apenas os serviços necessários para cada ambiente.
    - Ex: `docker compose --profile dev up`.
3.  **Adicionar Traefik como Reverse Proxy:**
    - Configurar o Traefik para gerenciar o acesso a todos os serviços.
    - Habilitar HTTPS com certificados automáticos do Let's Encrypt.

---

## ✅ Checklist de Sucesso

- [ ] Todos os 13+ agentes se comunicam via Orquestrador Central.
- [ ] Um novo orçamento pode ser criado de ponta a ponta, usando o Motor de Orçamento.
- [ ] O Router de IA está funcionando e otimizando custos.
- [ ] O sistema completo pode ser iniciado com um único comando `docker compose up`.
- [ ] O Farol do Projeto está 100% atualizado com a nova arquitetura.
