# 🔗 Mapeamento de Integração - 13-01-26-Sistema

**Data:** 15 de Janeiro de 2026  
**Objetivo:** Conectar todos os componentes dos repositórios anteriores no sistema principal

---

## 📊 Status Atual do 13-01-26-Sistema

| Aspecto | Status | Detalhes |
|---|---|---|
| **Frontend** | ✅ 100% | React + TypeScript + Radix UI |
| **Backend** | ✅ 90% | tRPC + Node.js + 60+ serviços |
| **Testes** | ✅ 95.1% | 796/837 testes passando |
| **Integração Agentes** | 🔄 30% | Iniciado mas incompleto |
| **Orquestrador Central** | ⏳ 0% | Pendente |
| **Motor Orçamento** | ⏳ 0% | Pendente |

---

## 🧩 Componentes Existentes no 13-01-26-Sistema

### Serviços (60+ arquivos em server/services/)

| Serviço | Arquivo | Status |
|---|---|---|
| **Agents Integration** | agents-integration.ts | ✅ Implementado |
| **Browser Automation** | browser-automation.ts | ✅ Implementado |
| **Hospitalar Adapter** | hospitalar-adapter.ts | ✅ Implementado |
| **Hospital Auth** | hospital-auth.ts | ✅ Implementado |
| **N8N Integration** | n8n-integration.ts | ✅ Implementado |
| **N8N Airtop** | n8n-airtop-integration.ts | ✅ Implementado |
| **Ollama Service** | ollama-service.ts | ✅ Implementado |
| **Orchestrator** | orchestrator.ts | ✅ Implementado |
| **Prescription OCR** | prescription-ocr.ts | ✅ Implementado |
| **UIPath Integration** | uipath-integration.ts | ✅ Implementado |
| **Vision API** | vision-api-provider.ts | ✅ Implementado |
| **WhatsApp Web** | whatsapp-web-service.ts | ✅ Implementado |
| **WebSocket Realtime** | websocket-realtime-service.ts | ✅ Implementado |

### Routers (APIs tRPC)

| Router | Arquivo | Endpoints |
|---|---|---|
| **Agents** | agents.ts | Health, Execute, List |
| **AI** | ai.ts | Generate, Analyze |
| **Automation** | automation.ts | Run, Schedule |
| **Browser** | browser.ts | Navigate, Click, Fill |
| **Health** | health.ts | Status, Metrics |
| **Integrations** | integrations.ts | Connect, Sync |
| **N8N** | n8n.ts | Workflows, Webhooks |
| **Orchestrator** | orchestrator.ts | Queue, Execute |

---

## 🔄 Componentes dos Outros Repositórios para Integrar

### De `obsidian-agente` (⭐ CORE)

| Componente | Arquivo Original | Integração Necessária |
|---|---|---|
| **Hub Central v1.1** | hub_server.py | ⏳ Criar wrapper TypeScript |
| **COMET Bridge v1.0** | comet_bridge.py | ⏳ Já funcional via HTTP |
| **Vision Server** | vision_server.py | ⏳ Integrar com vision-api-provider.ts |
| **Intelligent Agent v5.0** | intelligent_agent.py | ⏳ Criar interface TypeScript |
| **Triggers Manager** | triggers_manager.py | ⏳ Integrar com orchestrator.ts |
| **Storage Connectors** | storage_connectors.py | ⏳ Integrar com knowledge.ts |

### De `projeto-2026-autonomia`

| Componente | Arquivo Original | Integração Necessária |
|---|---|---|
| **Guia de Agentes** | GUIA_COMPLETO_AGENTES.md | ✅ Documentação (já no Farol) |
| **Lógica Orçamento** | LOGICA_ORCAMENTO_HOSPITALAR.md | ⏳ Implementar em budget-engine.ts |
| **Script Verificação** | verificar_agentes.py | ⏳ Converter para TypeScript |
| **Docker Compose** | docker-compose.yaml | ⏳ Unificar com hospitalar-docker |

### De `hospitalar-docker-upgrade`

| Componente | Arquivo Original | Integração Necessária |
|---|---|---|
| **Docker Mega Ultra v6.0** | docker-compose-mega-ultra.yml | ⏳ Adicionar ao projeto |
| **Profiles Inteligentes** | profiles/ | ⏳ Configurar para dev/prod |
| **Traefik Config** | traefik/ | ⏳ Configurar reverse proxy |

---

## 🚨 Lacunas Críticas Identificadas

### 1. Orquestrador Central (CRÍTICO)
**Status:** Arquivo existe mas está incompleto  
**Arquivo:** `server/routers/orchestrator.ts` (2.9KB)  
**Necessário:**
- Implementar fila de tarefas com BullMQ
- Integrar com Hub Central (Python)
- Criar sistema de retry automático
- Implementar circuit breaker

### 2. Motor de Orçamento (CRÍTICO)
**Status:** Não existe  
**Necessário:**
- Criar `server/services/budget-engine.ts`
- Implementar lógica de `LOGICA_ORCAMENTO_HOSPITALAR.md`
- Integrar com hospitalar-adapter.ts
- Criar cálculo de margens e alertas

### 3. Conexão com Agentes Locais (IMPORTANTE)
**Status:** Parcialmente implementado  
**Arquivo:** `server/services/agents-integration.ts`  
**Necessário:**
- Adicionar conexão com Hub Central (:5002)
- Adicionar conexão com Vision Server (:5003)
- Implementar health check automático
- Criar fallback para agentes offline

### 4. Router de IA Inteligente (IMPORTANTE)
**Status:** Não existe  
**Necessário:**
- Criar `server/services/ai-router.ts`
- Implementar roteamento por complexidade
- Ollama (local) → Gemini Flash → Claude/GPT-4
- Otimizar custos de API

---

## 📋 Plano de Integração Consolidado

### Fase 1: Conexão com Agentes Locais (1 dia)
1. Atualizar `agents-integration.ts` com todos os endpoints
2. Criar wrapper para Hub Central
3. Implementar health check automático
4. Testar conexão via COMET Bridge

### Fase 2: Orquestrador Central (2 dias)
1. Expandir `orchestrator.ts` com BullMQ
2. Integrar com Hub Central para delegação
3. Implementar retry e circuit breaker
4. Criar dashboard de monitoramento

### Fase 3: Motor de Orçamento (2 dias)
1. Criar `budget-engine.ts`
2. Implementar lógica de negócio
3. Integrar com hospitalar-adapter.ts
4. Criar alertas de margem

### Fase 4: Router de IA (1 dia)
1. Criar `ai-router.ts`
2. Implementar roteamento por complexidade
3. Configurar fallbacks
4. Otimizar custos

### Fase 5: Docker Unificado (1 dia)
1. Criar docker-compose unificado
2. Configurar profiles (dev/prod)
3. Adicionar Traefik
4. Testar deploy completo

---

## 🎯 Resultado Esperado

Após a integração completa:

```
┌─────────────────────────────────────────────────────────────┐
│                    13-01-26-SISTEMA                         │
│                  (Sistema Consolidado)                      │
├─────────────────────────────────────────────────────────────┤
│  Frontend React ←→ tRPC APIs ←→ Orquestrador Central       │
│                         ↓                                   │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐         │
│  │ Hub Central │  │ COMET Bridge│  │Vision Server│         │
│  │   (:5002)   │  │   (:5000)   │  │   (:5003)   │         │
│  └─────────────┘  └─────────────┘  └─────────────┘         │
│         ↓                ↓                ↓                 │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐         │
│  │   Ollama    │  │   N8N       │  │  Hospitalar │         │
│  │  (:11434)   │  │  (:5678)    │  │    API      │         │
│  └─────────────┘  └─────────────┘  └─────────────┘         │
│                                                             │
│  Motor de Orçamento ←→ Budget Engine ←→ Alertas            │
│  Router de IA ←→ Ollama → Gemini → Claude (fallback)       │
└─────────────────────────────────────────────────────────────┘
```

**Tempo Total Estimado:** 7-10 dias para integração completa
