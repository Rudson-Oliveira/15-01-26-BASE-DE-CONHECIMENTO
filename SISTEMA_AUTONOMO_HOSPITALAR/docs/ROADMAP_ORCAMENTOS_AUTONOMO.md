# Roadmap - Sistema Autônomo de Orçamentos
## Hospitalar Saúde - Projeto 2026

**Data**: 17/01/2026  
**Versão**: 1.0  
**Objetivo**: Empresa praticamente autônoma, começando pelo setor de orçamentos

---

## 1. Visão Geral do Projeto

### Objetivo Principal
Retirar todas as tarefas repetidas da empresa, tornando-a mais competitiva. Cada colaborador será representado por um agente de IA seguindo o organograma da empresa.

### Princípio de Otimização
> **NÃO recriar, NÃO reescrever, NÃO duplicar** - Utilizar componentes já existentes e apenas integrá-los.

---

## 2. Inventário de Componentes Existentes (NÃO RECRIAR)

### 2.1 Backend - Repositório 13-01-26-Sistema

| Componente | Arquivo | Linhas | Status |
|------------|---------|--------|--------|
| **Budget Engine** | `server/services/budget-engine.ts` | 782 | ✅ Completo |
| **AI Router** | `server/services/ai-router.ts` | ~500 | ✅ 9 provedores |
| **Hub Central Adapter** | `server/services/hub-central-adapter.ts` | ~300 | ✅ Completo |
| **Orchestrator BullMQ** | `server/services/orchestrator-bullmq.ts` | ~400 | ✅ Completo |
| **Circuit Breaker** | `server/services/circuit-breaker.ts` | ~200 | ✅ Completo |
| **Vision Services** | `server/services/vision-*.ts` | 8 arquivos | ✅ Completo |

### 2.2 Frontend - VisionAI

| Componente | Status | Observação |
|------------|--------|------------|
| VisionAIModule.tsx | ✅ Criado | Obsidian Agente v5.0 |
| VisionAIModule.css | ✅ Criado | Estilos aplicados |
| Integração App.tsx | ✅ Feito | Case 'visionai' adicionado |
| Botão na navegação | ⚠️ Pendente | Precisa adicionar |

### 2.3 Infraestrutura Local

| Serviço | Porta | Status |
|---------|-------|--------|
| COMET Bridge | 5000 | ✅ Ativo |
| Obsidian Agent | 5001 | ✅ Ativo |
| Hub Central | 5002 | ✅ Ativo |
| Vision Server | 5003 | ✅ Ativo |
| Ollama | 11434 | ✅ Ativo |
| Jan IA | 4891 | ✅ Ativo |

### 2.4 Laravel Backend (hospitalar_v2)

| Componente | Status | Observação |
|------------|--------|------------|
| IAOrcamentoController | ✅ Instalado | 8 endpoints |
| IAOrcamentoService | ✅ Instalado | Lógica de IA |
| IAServiceProvider | ✅ Registrado | config/app.php |
| Rotas de IA | ✅ Incluídas | routes/api.php |
| Endpoint /api/ia/health | ✅ Testado | Operacional |

---

## 3. Arquitetura de Redundância

### 3.1 Camadas de Acesso ao Sistema

```
┌─────────────────────────────────────────────────────────────────┐
│                    CAMADA DE REDUNDÂNCIA                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐        │
│  │  Vision  │  │ Browser  │  │   MCP    │  │  NGROK   │        │
│  │  Server  │  │ Manus    │  │ Servers  │  │  Tunnel  │        │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘        │
│       │             │             │             │               │
│       └─────────────┴──────┬──────┴─────────────┘               │
│                            │                                    │
│                    ┌───────▼───────┐                            │
│                    │  COMET Bridge │                            │
│                    │   (porta 5000)│                            │
│                    └───────┬───────┘                            │
│                            │                                    │
└────────────────────────────┼────────────────────────────────────┘
                             │
┌────────────────────────────┼────────────────────────────────────┐
│                    CAMADA DE APLICAÇÃO                          │
├────────────────────────────┼────────────────────────────────────┤
│                            │                                    │
│  ┌─────────────────────────▼─────────────────────────┐          │
│  │              Hub Central (porta 5002)             │          │
│  │         Orquestração e Roteamento Central         │          │
│  └───────┬─────────────┬─────────────┬───────────────┘          │
│          │             │             │                          │
│  ┌───────▼───────┐ ┌───▼───┐ ┌───────▼───────┐                  │
│  │   Frontend    │ │Backend│ │ Banco de Dados│                  │
│  │   Angular     │ │Laravel│ │    MySQL      │                  │
│  │  (porta 4200) │ │(nginx)│ │ (porta 3306)  │                  │
│  └───────────────┘ └───────┘ └───────────────┘                  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 3.2 Fluxo de Redundância

| Prioridade | Canal | Uso |
|------------|-------|-----|
| 1 | **MCP Servers** | Acesso direto via protocolo estruturado |
| 2 | **NGROK + COMET Bridge** | Execução de comandos remotos |
| 3 | **Browser Manus** | Navegação e automação visual |
| 4 | **Vision Server** | Análise visual e OCR |
| 5 | **Navegador Local** | Fallback manual |

### 3.3 Fontes de Aprendizado

| Fonte | Tipo | Acesso |
|-------|------|--------|
| **Documentação** | Estático | GitHub, Obsidian |
| **Login do Colaborador** | Dinâmico | Sistema DEV/PROD |
| **Interação com Agente** | Tempo Real | Chat, VisionAI |
| **Backend** | API | Laravel endpoints |
| **Frontend** | Visual | Angular components |
| **Banco de Dados** | Estruturado | MySQL queries |

---

## 4. Etapas para Conclusão do Módulo de Orçamentos

### Fase 1: Infraestrutura (✅ CONCLUÍDA)

| Etapa | Status | Descrição |
|-------|--------|-----------|
| 1.1 | ✅ | COMET Bridge conectado via ngrok |
| 1.2 | ✅ | Docker containers rodando |
| 1.3 | ✅ | Módulo de IA instalado no Laravel |
| 1.4 | ✅ | Endpoint /api/ia/health operacional |
| 1.5 | ✅ | Frontend Angular compilando |

### Fase 2: Integração Backend (⏳ EM ANDAMENTO)

| Etapa | Status | Descrição | Tempo Est. |
|-------|--------|-----------|------------|
| 2.1 | ⏳ | Conectar IAOrcamentoService ao Ollama local | 2h |
| 2.2 | ⬜ | Integrar Budget Engine (TypeScript) com Laravel | 4h |
| 2.3 | ⬜ | Configurar AI Router para fallback multi-provedor | 2h |
| 2.4 | ⬜ | Implementar cache Redis para consultas frequentes | 1h |
| 2.5 | ⬜ | Testar todos os endpoints de IA | 2h |

### Fase 3: Integração Frontend (⬜ PENDENTE)

| Etapa | Status | Descrição | Tempo Est. |
|-------|--------|-----------|------------|
| 3.1 | ⬜ | Adicionar botão VisionAI na navegação | 1h |
| 3.2 | ⬜ | Criar componente de chat no módulo de orçamentos | 3h |
| 3.3 | ⬜ | Integrar ações rápidas (criar, analisar, aprovar) | 2h |
| 3.4 | ⬜ | Implementar feedback visual de IA | 1h |
| 3.5 | ⬜ | Testar fluxo completo de orçamento | 2h |

### Fase 4: Automação de Tarefas (⬜ PENDENTE)

| Etapa | Status | Descrição | Tempo Est. |
|-------|--------|-----------|------------|
| 4.1 | ⬜ | Identificar tarefas repetitivas no setor | 2h |
| 4.2 | ⬜ | Criar workflows automáticos no Hub Central | 4h |
| 4.3 | ⬜ | Implementar notificações inteligentes | 2h |
| 4.4 | ⬜ | Configurar gatilhos de automação | 2h |
| 4.5 | ⬜ | Treinar modelo com dados históricos | 4h |

### Fase 5: Validação e Produção (⬜ PENDENTE)

| Etapa | Status | Descrição | Tempo Est. |
|-------|--------|-----------|------------|
| 5.1 | ⬜ | Protocolo de Teste Duplo (Backend + Frontend) | 4h |
| 5.2 | ⬜ | Testes com usuários reais | 8h |
| 5.3 | ⬜ | Ajustes baseados em feedback | 4h |
| 5.4 | ⬜ | Deploy em produção | 2h |
| 5.5 | ⬜ | Monitoramento e métricas de ROI | Contínuo |

---

## 5. Estimativa de Tempo Total

| Fase | Horas | Status |
|------|-------|--------|
| Fase 1: Infraestrutura | 8h | ✅ Concluída |
| Fase 2: Integração Backend | 11h | ⏳ Em andamento |
| Fase 3: Integração Frontend | 9h | ⬜ Pendente |
| Fase 4: Automação | 14h | ⬜ Pendente |
| Fase 5: Validação | 18h | ⬜ Pendente |
| **TOTAL** | **60h** | **~7-10 dias úteis** |

---

## 6. Checklist de Otimização (Evitar Retrabalho)

### ✅ O que JÁ EXISTE e NÃO deve ser recriado:

- [x] Budget Engine (782 linhas TypeScript)
- [x] AI Router (9 provedores configurados)
- [x] Hub Central Adapter
- [x] Orchestrator BullMQ
- [x] Circuit Breaker
- [x] Vision Services (8 arquivos)
- [x] COMET Bridge v2.0
- [x] VisionAI Module (Obsidian Agente)
- [x] Sistema de Backup/Restore
- [x] Documentação completa (15-01-26-BASE-DE-CONHECIMENTO)

### ⚠️ O que precisa ser INTEGRADO (não recriado):

- [ ] Conectar Budget Engine ao Laravel via API
- [ ] Ativar AI Router no fluxo de orçamentos
- [ ] Integrar VisionAI com endpoints de IA
- [ ] Conectar Hub Central para orquestração
- [ ] Ativar gatilhos automáticos

### ❌ O que NÃO fazer:

- Reescrever Budget Engine
- Recriar AI Router
- Duplicar lógica de orçamento
- Criar nova arquitetura
- Ignorar componentes existentes

---

## 7. Métricas de ROI

### Tarefas Repetitivas a Eliminar

| Tarefa | Tempo Atual | Tempo com IA | Economia |
|--------|-------------|--------------|----------|
| Cálculo de orçamento | 30 min | 2 min | 93% |
| Análise de complexidade | 20 min | 1 min | 95% |
| Sugestão de itens | 15 min | Automático | 100% |
| Previsão de aprovação | Manual | Automático | 100% |
| Otimização de preços | 1h | 5 min | 92% |

### ROI Esperado

- **Redução de tempo**: 80-90% em tarefas de orçamento
- **Aumento de produtividade**: 3-4x por colaborador
- **Redução de erros**: 70-80%
- **Satisfação do cliente**: Respostas mais rápidas

---

## 8. Próximos Passos Imediatos

### Hoje (2-3 horas):

1. **Verificar** compilação do Angular (deve estar pronta)
2. **Testar** endpoint `/api/ia/orcamento/analyze-complexity`
3. **Conectar** Ollama local ao IAOrcamentoService
4. **Validar** fluxo completo de análise

### Esta Semana:

1. Integrar Budget Engine ao Laravel
2. Ativar AI Router com fallback
3. Adicionar botão VisionAI no frontend
4. Criar primeiro workflow automático

### Próxima Semana:

1. Testes com usuários reais
2. Ajustes e otimizações
3. Preparação para produção

---

## 9. Conclusão

O projeto está **70% completo** em termos de componentes. O foco agora é **INTEGRAÇÃO**, não desenvolvimento. Todos os blocos de construção já existem e estão funcionais. A estratégia é conectá-los de forma eficiente para entregar valor rapidamente.

**Princípio Fundamental**: Cada hora investida em integração gera mais ROI do que recriar componentes existentes.
