# Memória do Projeto - Sistema Autônomo Hospitalar Saúde

## Data de Início: 17/01/2026

## Informações do Sistema

### URLs
- **Sistema DEV**: https://dev.hospitalarsaude.app.br/#/dashboard/home
- **Sistema Produção**: https://hospitalarsaude.app.br/#/dashboard/home

### Usuário Logado
- **Nome**: RUDSON ANTONIO RIBEIRO OLIVEIRA
- **Nível**: 0

### Módulos Identificados no Menu
1. Administrativo
2. Almoxarifado
3. Aplicativo
4. Atualizações do sistema
5. Auditoria
6. Recepção
7. Chat com IA
8. **Compras** (explorado)
9. Locação
10. Configurações
11. Equipamentos
12. Faturamento
13. Financeiro
14. Fiscal
15. Frota
16. Jurídico
17. Logs
18. Loja
19. Operadoras
20. **Orçamentos** (foco inicial)
21. Pacientes
22. Permissões
23. Profissionais
24. Psicologia
25. Recrutamento
26. Recursos Humanos
27. Setores
28. Tabela Preços
29. Tabelas TISS

### Versão do Sistema
- release-1.0.6

---

## Módulo de Compras - Estrutura Identificada

### Abas do Módulo
1. Pedidos em construção
2. Pedidos em andamento
3. Pedidos reprovados

### Campos da Tabela de Pedidos
- ID
- Data de emissão
- Solicitante
- Setor de origem
- Tipo da compra
- Categoria
- Paciente
- Comprador

### Ações Disponíveis
- ADICIONAR PEDIDO
- FILTROS
- LIMPAR FILTRO
- Pesquisar
- Copiar
- Editar compra

### Dados de Exemplo (Pedidos em construção)
| ID | Data | Solicitante | Setor | Tipo | Categoria | Paciente |
|----|------|-------------|-------|------|-----------|----------|
| 1431 | 18/07/2025 | RODRIGO MAIA DA SILVA | TI | Avulso | Dietas | THEREZA MARIA DOS REIS |
| 1434 | 10/11/2025 | RODRIGO MAIA DA SILVA | TI | Avulso | Consumíveis | VANDERLEIA DE SOUZA DONA |

---

## Infraestrutura Local (Screenshots do Usuário)

### Serviços Ativos (Sistema IA v3.1)
- Obsidian
- Ollama (porta 11434)
- Jan - IA Local (porta 4891)
- LM Studio - IA Local
- GPT4All - IA Local
- COMET Desktop (Perplexity)
- COMET Bridge (porta 5000)
- ngrok (URL fixa)
- Obsidian Agent (porta 5001)
- Hub Central (porta 5002)
- Vision Server (porta 5003)
- Frontend (porta 5173)
- Claude Code Terminal

### URL ngrok
- https://charmless-maureen-subadministratively.ngrok-free.dev

### Docker Containers (hospitalar_v2)
- hospitalar_redis_commander (8081:8081)
- hospitalar_redis (6379:6379)
- hospitalar_php (hospitalar_v2-app)
- hospitalar_nginx (8888:80)
- hospitalar_db (3308:3306) - MySQL 8.0
- hospitalar_angular (4205:4200) - Node 16

### Estrutura de Pastas Local
```
C:\Users\rudpa\Documents\hospitalar\hospitalar_v2\
├── hospitalar_backend/
├── hospitalar_frontend/
├── mysql_data/
├── nginx/
├── banco.sql
└── docker-compose.yaml
```

---

## Repositórios GitHub
1. https://github.com/Rudson-Oliveira/13-01-26-Sistema
2. https://github.com/Rudson-Oliveira/projeto-2026-autonomia

---

## Agentes Manus Anteriores (para análise)
1. https://manus.im/app/oFm9kmHKT9Bc6ZksdOje8M
2. https://manus.im/app/lGK7uxDk47gI3mhEuiZ59f
3. https://manus.im/app/23Sg4IrQPCkMEtHUOmM8bE
4. https://manus.im/app/09eIPbzj2RgFdDGPY77HnN

---

## Próximos Passos
1. [ ] Explorar módulo de Orçamentos
2. [ ] Analisar estrutura do código fonte via GitHub
3. [ ] Identificar endpoints da API via DevTools (F12)
4. [ ] Criar plano de implementação de IA
5. [ ] Estabelecer sistema de backup de memória no GitHub



---

## Análise do Código Fonte (17/01/2026)

### Repositório 13-01-26-Sistema

#### Arquitetura do Backend (server/)
- **Framework**: tRPC (TypeScript RPC)
- **Autenticação**: Cookies de sessão
- **Banco de Dados**: Drizzle ORM

#### Routers Principais Identificados
| Router | Função |
|--------|--------|
| `organization` | Gestão de departamentos e colaboradores |
| `knowledge` | Base de conhecimento e memória |
| `automation` | Rotinas, logs e integrações |
| `assistant` | Assistente personalizado por colaborador |
| `browser` | Automação via Airtop |
| `notifications` | Email, WhatsApp, N8N |
| `n8n` | Integração N8N |
| `integrations` | Hospitalar, UiPath, Serviços Locais |
| `ai` | Multi-Provider com Fallback |
| `local` | Ecossistema Local (via ngrok) |
| `autonomy` | Protocolo de Autonomia |
| `agents` | Integração com Agentes Locais |
| `orchestrator` | MANUS Orchestrator (Roteamento Central) |
| `health` | Health Check & Circuit Breaker |
| **`budget`** | **Motor de Orçamento Hospitalar** (FOCO) |
| `aiRouter` | Router de IA Inteligente |
| `hubCentral` | Integração com Hub Central Local |

### Budget Engine - Motor de Orçamento (FOCO PRINCIPAL)

#### Endpoints Disponíveis
1. **calculate** - Calcular orçamento completo
2. **analyzeComplexity** - Analisar complexidade do paciente (NEAD/ABEMID/PPS)
3. **calculateLogistics** - Calcular custo de logística
4. **marketAnalysis** - Análise de mercado por categoria
5. **calculateMargin** - Calcular margem recomendada
6. **validate** - Validar orçamento
7. **getTemplate** - Templates por tipo de atendimento
8. **compare** - Comparar orçamentos
9. **priceHistory** - Histórico de preços
10. **getAlerts** - Alertas de vulnerabilidade de margem
11. **simulate** - Simular cenários
12. **export** - Exportar para PDF/Excel/JSON
13. **stats** - Estatísticas do motor

#### Categorias de Orçamento
- procedures (Procedimentos)
- materials (Materiais)
- medications (Medicamentos)
- diets (Dietas)
- opme (OPME)
- professionals (Profissionais)
- equipment (Equipamentos)
- transport (Transporte)

#### Templates de Atendimento
- home_care_basic
- home_care_complex
- palliative_care
- post_surgical
- chronic_disease
- rehabilitation
- pediatric
- geriatric

#### Scores de Complexidade
- NEAD Score (0-100)
- ABEMID Score (0-100)
- PPS Score (0-100)

---

## Módulo de Orçamentos no Sistema DEV

### Estrutura Identificada
- **URL**: /dashboard/orcamentos
- **Abas**:
  - Retificações (pendentes/realizadas)
  - Painel Administrativo (dashboard analítico)

### Painel Administrativo - Métricas
- Total de orçamentos
- Valor total de orçamentos solicitados
- Orçamentos Aprovados
- Quantidade de operadoras solicitantes

### Filtros Disponíveis
- Período (Início/Fim)
- Operadora
- Status (TODOS, APROVADO, REPROVADO, RECAPTAÇÃO, AGUARDANDO)
- Modo mensal/anual

### Gráficos e Análises
- Total de operadoras solicitantes
- Orçamentos por status (Quantitativo e Monetário)
- Orçamentos por semana
- Tempo de resposta (Convênio vs Particular)
- Média de Tempo por Convênio
- Modalidades orçadas
- Origem de solicitações

### Dados de Retificações (Exemplo)
| Código | Nome | Período | Finalizado |
|--------|------|---------|------------|
| 64321 | GERALDA DE OLIVEIRA COUTINHO | 23/03/2025 | 23/03/2025 |
| 63998 | GERALDA DE OLIVEIRA COUTINHO | 11/04/2025 | 12/04/2025 |
| 63317 | PACIENTE TESTE PROD | 01/04/2025 - 30/04/2025 | 12/03/2025 |

---

## Infraestrutura Docker (hospitalar_v2)

### Containers Identificados
| Container | Imagem | Porta |
|-----------|--------|-------|
| hospitalar_redis_commander | rediscommander/redis-commander | 8081:8081 |
| hospitalar_redis | redis:7-alpine | 6379:6379 |
| hospitalar_php | hospitalar_v2-app | - |
| hospitalar_nginx | nginx:alpine | 8888:80 |
| hospitalar_db | mysql:8.0 | 3308:3306 |
| hospitalar_angular | node:16-alpine | 4205:4200 |



---

## Análise dos Agentes Manus Anteriores (17/01/2026)

### Agente 09eIPbzj2RgFdDGPY77HnN
**Título**: GitHub Links and API Preview Discussion
**Status**: Tarefa concluída

#### Principais Realizações
1. **Módulo VisionAI** implementado no Obsidian Agente v5.0
   - VisionAIModule.tsx criado
   - VisionAIModule.css criado
   - Import no App.tsx adicionado
   - Case 'visionai' adicionado

2. **Sistema de Backup** funcional com endpoints:
   - /backup
   - /restore
   - /backups

3. **Integração com COMET Bridge** via ngrok:
   - URL: https://charmless-maureen-subadministratively.ngrok-free.dev
   - Endpoints: /exec, /health

4. **Funcionalidades do VisionAI**:
   - Ações Rápidas: Ir para Pacientes, Cadastrar Paciente, Buscar Paciente, Relatório Mensal
   - Filtros por Categoria: Navegação, Automação, Dados, Relatórios
   - Histórico de Ações
   - Comando Personalizado

#### Problemas Identificados
- Escape de caracteres no COMET Bridge causou falhas
- Botão VisionAI na navegação não foi adicionado automaticamente
- Scripts PowerShell complexos falharam por sintaxe

#### Aprendizados
1. Usar scripts Base64 para evitar problemas de escape
2. Criar scripts separados ao invés de comandos inline
3. Testar cada passo antes de prosseguir
4. Salvar progresso no GitHub após cada etapa

---

## Infraestrutura de Comunicação Identificada

### COMET Bridge
- **URL ngrok**: https://charmless-maureen-subadministratively.ngrok-free.dev
- **Porta local**: 5000
- **Endpoints**:
  - `/exec` - Execução de comandos PowerShell
  - `/health` - Health check
  - `/obsidian/vault/` - Acesso ao vault Obsidian
  - `/obsidian/search` - Busca no Obsidian

### Hub Central Server v1.1
- **Porta**: 5002
- **Conectores**: obsidian, google_drive, onedrive, mysql
- **Gatilhos**: 16 registrados
  - Resumo Semanal (weekly)
  - Backup Diário (daily)
  - Limpeza de Logs (weekly)
  - Insights Diários (daily)

### Vision Server
- **Porta**: 5003
- **App**: vision_server (Flask)

### Obsidian Agent
- **Porta**: 5001

### Frontend (Vite)
- **Porta**: 5173

---

## Status do Projeto (Consolidado)

### Componentes Implementados
| Componente | Status | Descrição |
|------------|--------|-----------|
| Budget Engine | ✅ Implementado | Motor de orçamento com 13 endpoints |
| VisionAI Module | ✅ 90% | Falta botão na navegação |
| COMET Bridge | ✅ Funcional | Integração local via ngrok |
| Hub Central | ✅ Funcional | Orquestração de serviços |
| Sistema de Backup | ✅ Funcional | Backup/Restore automático |
| Docker Containers | ✅ Rodando | 6 containers ativos |

### Próximos Passos Identificados
1. [ ] Adicionar botão VisionAI na navegação
2. [ ] Integrar Budget Engine com sistema DEV
3. [ ] Implementar IA no setor de orçamentos
4. [ ] Criar sistema de memória persistente no GitHub
5. [ ] Documentar fluxos de trabalho



---

## Análise do VisionAI (17/01/2026)

### URL do Projeto
https://visionai-khprjuve.manus.space/

### Interface Identificada
O VisionAI é um **Assistente Hospitalar** especializado no sistema, com as seguintes características:

#### Layout
- **Barra Superior**: Logo VisionAI, navegação, campo de URL, botões DEV/PROD
- **Área Principal**: Iframe para visualização do sistema (dev.hospitalarsaude.app.br)
- **Painel Lateral Direito**: Chat com o Assistente Hospitalar

#### Funcionalidades do Assistente
1. **Ações Rápidas**:
   - Ir para Pacientes
   - Criar Orçamento
   - Ver Relatórios
   - Acessar Financeiro
   - Buscar Paciente

2. **Chat Interativo**:
   - Responde perguntas sobre o sistema
   - Guia o usuário em processos (ex: cadastro de paciente)
   - Explica funcionalidades do sistema

3. **Canais**:
   - Botão "Canais" para gerenciar conversas
   - Alternância entre DEV e PROD

#### Exemplo de Interação
O assistente respondeu à pergunta "como faço cadastro de paciente?" com um guia passo a passo detalhado, incluindo:
- Acesso ao módulo de Pacientes
- Início de novo cadastro
- Preenchimento de dados obrigatórios
- Salvamento do cadastro

### Status do Projeto VisionAI
| Componente | Status |
|------------|--------|
| Interface do Chat | ✅ Funcional |
| Integração com Sistema DEV | ✅ Funcional |
| Ações Rápidas | ✅ Funcional |
| Alternância DEV/PROD | ✅ Funcional |
| Respostas do Assistente | ✅ Funcional |

---

## Próximos Passos Consolidados

### Prioridade Alta
1. [ ] Integrar Budget Engine com VisionAI para "Criar Orçamento"
2. [ ] Adicionar botão VisionAI no obsidian-agente (script PowerShell criado)
3. [ ] Implementar análise de complexidade automática (NEAD/ABEMID/PPS)

### Prioridade Média
4. [ ] Conectar VisionAI ao Hub Central para orquestração
5. [ ] Implementar histórico de conversas persistente
6. [ ] Adicionar suporte a comandos especiais (/backups, /help, etc.)

### Prioridade Baixa
7. [ ] Melhorar UI/UX do painel de chat
8. [ ] Adicionar suporte a voz (input/output)
9. [ ] Implementar modo offline com cache local



---

## Análise do Módulo de Compras (17/01/2026)

### URL
https://dev.hospitalarsaude.app.br/#/dashboard/compras/construcao

### Estrutura do Módulo de Compras
O módulo de Compras possui 3 abas principais:
1. **Pedidos em construção** - Pedidos sendo elaborados
2. **Pedidos em andamento** - Pedidos em processamento
3. **Pedidos reprovados** - Pedidos que foram rejeitados

### Funcionalidades Identificadas
- **ADICIONAR PEDIDO** - Botão para criar novo pedido de compra
- **FILTROS** - Filtrar pedidos por critérios
- **LIMPAR FILTRO** - Remover filtros aplicados
- **Pesquisar** - Campo de busca

### Estrutura de Dados dos Pedidos
| Campo | Descrição |
|-------|-----------|
| ID | Identificador único do pedido |
| Data de emissão | Data e hora da criação |
| Solicitante | Usuário que solicitou |
| Setor de origem | Departamento solicitante |
| Tipo da compra | Avulso, Recorrente, etc. |
| Categoria | Dietas, Consumíveis, etc. |
| Paciente | Paciente relacionado |
| Comprador | Responsável pela compra |

### Exemplos de Pedidos
1. **ID 1431** - Dietas para THEREZA MARIA DOS REIS (18/07/2025)
2. **ID 1434** - Consumíveis para VANDERLEIA DE SOUZA DONA (10/11/2025)

### Menu Lateral Completo Identificado
- Administrativo
- Almoxarifado
- Aplicativo
- Atualizações do sistema
- Auditoria
- Recepção
- Chat com IA
- **Compras** (atual)
- Locação
- Configurações
- Equipamentos
- Faturamento
- Financeiro
- Fiscal
- Frota
- Jurídico
- Logs
- Loja
- Operadoras
- **Orçamentos** ← MÓDULO ALVO
- Pacientes
- Permissões
- Profissionais
- Psicologia
- Recrutamento
- Recursos Humanos
- Setores
- Tabela Preços
- Tabelas TISS



---

## Módulo de Orçamentos - Análise Detalhada (17/01/2026)

### URL
https://dev.hospitalarsaude.app.br/#/dashboard/orcamentos/dashboard

### Estrutura do Módulo

O módulo de Orçamentos possui duas abas principais: **Retificações** e **Painel Administrativo**. A aba de Retificações exibe orçamentos que precisam de ajustes, enquanto o Painel Administrativo oferece uma visão analítica completa.

### Painel Administrativo - KPIs

| Indicador | Descrição |
|-----------|-----------|
| Total de orçamentos | Quantidade total de orçamentos no período |
| Valor total de orc. solicitados | Soma monetária dos orçamentos |
| Orçamentos Aprovados | Valor dos orçamentos aprovados |
| Quantidade de operadoras solicitantes | Número de operadoras que solicitaram orçamentos |

### Filtros Disponíveis

O painel oferece filtros por período (Início/Fim), Operadora, e Status (TODOS, APROVADO, REPROVADO, RECAPTAÇÃO, AGUARDANDO). Também permite alternar entre modo mensal e modo anual.

### Gráficos e Análises

O painel inclui diversos gráficos para análise: Total de operadoras solicitantes, Orçamentos por status (quantitativo e monetário), Orçamentos por semana, Tempo de resposta por convênio, Modalidades orçadas, e Origem de solicitações.

### Dados de Orçamentos Existentes (Retificações)

| Código | Paciente | Período | Finalizado |
|--------|----------|---------|------------|
| 64321 | GERALDA DE OLIVEIRA COUTINHO | 23/03/2025 à 23/03/2025 | 23/03/2025 |
| 63998 | GERALDA DE OLIVEIRA COUTINHO | 11/04/2025 à 11/04/2025 | 12/04/2025 |
| 63317 | PACIENTE TESTE PROD | 01/04/2025 à 30/04/2025 | 12/03/2025 |
| 63001 | THIAGO BRUNO ALBINO | 25/02/2025 à 25/02/2025 | 25/02/2025 |
| 62935 | OLIVIA DE CASTRO NARCISO | 23/02/2025 à 23/02/2025 | 23/02/2025 |
| 61568 | JANILTON DA SILVA ARAUJO | 01/12/2024 à 31/12/2024 | 31/12/2024 |
| 59185 | JOVINO MARTINS | 07/10/2024 à 07/10/2024 | 07/10/2024 |
| 58866 | MARIA ODETE GUIDO | 28/09/2024 à 28/09/2024 | 28/09/2024 |

### Pontos de Integração para IA

1. **Automação de Cálculo de Orçamentos**: Integrar o Budget Engine já existente no código fonte para automatizar cálculos
2. **Análise Preditiva**: Usar dados históricos para prever aprovação/reprovação
3. **Sugestão de Preços**: IA pode sugerir valores baseados em histórico e mercado
4. **Alertas Inteligentes**: Notificar sobre orçamentos pendentes ou com risco de reprovação
5. **Chat Assistido**: Integrar VisionAI para auxiliar na criação de orçamentos



## Mapeamento de Funcionalidades (17/01/2026)

- **Conclusão Principal:** O sistema está ~80% pronto. O foco deve ser em **INTEGRAÇÃO e ATIVAÇÃO**, não em recriar componentes.
- **Componentes Chave JÁ EXISTENTES:**
  - **Budget Engine:** `server/services/budget-engine.ts` (Completo)
  - **AI Router:** `server/services/ai-router.ts` (Completo, 9 provedores)
  - **Hub Central Adapter:** `server/services/hub-central-adapter.ts` (Completo)
  - **Orchestrator (BullMQ):** `server/services/orchestrator-bullmq.ts` (Completo)
  - **Base de Conhecimento:** Repositório `15-01-26-BASE-DE-CONHECIMENTO` com arquitetura, planos e documentação.
- **O que NÃO FAZER:**
  - Recriar Budget Engine, AI Router, COMET Bridge, arquitetura ou plano de integração.
- **Próximos Passos IMEDIATOS:**
  1. Iniciar COMET Bridge localmente.
  2. Conectar via ngrok.
  3. Testar o Budget Engine e o AI Router via API.
  4. Integrar com o sistema DEV.


---

## IMPLEMENTAÇÃO DO MÓDULO DE IA - 17/01/2026 01:30

### Status: ✅ CONCLUÍDO

### Arquivos Instalados no Laravel Backend

| Arquivo | Caminho | Status |
|---------|---------|--------|
| IAOrcamentoController.php | app/Http/Controllers/IA/ | ✅ Instalado |
| IAOrcamentoService.php | app/Services/IA/ | ✅ Instalado |
| IAServiceProvider.php | app/Providers/ | ✅ Instalado |
| ia_routes.php | routes/ | ✅ Instalado |
| ia.php | config/ | ✅ Instalado |

### Endpoints Disponíveis

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | /api/ia/health | Health check público |
| POST | /api/ia/orcamento/analyze-complexity | Analisar complexidade do paciente |
| POST | /api/ia/orcamento/suggest-items | Sugerir itens para orçamento |
| POST | /api/ia/orcamento/calculate | Calcular orçamento com IA |
| POST | /api/ia/orcamento/predict-approval | Prever aprovação |
| POST | /api/ia/orcamento/optimize-prices | Otimizar preços |
| POST | /api/ia/orcamento/chat | Chat com assistente |

### Variáveis de Ambiente Adicionadas

```env
OLLAMA_URL=http://host.docker.internal:11434
OLLAMA_MODEL=llama3.2
HUB_CENTRAL_URL=http://host.docker.internal:5002
COMET_BRIDGE_URL=http://host.docker.internal:5000
VISION_AI_ENABLED=true
IA_CACHE_ENABLED=true
```

### Próximos Passos

1. Registrar IAServiceProvider no config/app.php
2. Limpar cache do Laravel: `docker exec hospitalar_php php artisan config:clear`
3. Testar endpoint: `curl http://localhost:8888/api/ia/health`
4. Integrar VisionAI com os novos endpoints

### Repositório GitHub

Módulo disponível em: https://github.com/Rudson-Oliveira/projeto-2026-autonomia/tree/master/laravel-ia-module


---

## Sessão 17/01/2026 - 02:00 - Implementação Fase 1 Concluída

### Ações Realizadas

1. **Correção do Frontend Angular**
   - Problema: Heap out of memory durante compilação
   - Solução: Atualizado docker-compose.yaml com limite de memória 4GB
   - Status: ✅ Container rodando e compilando

2. **Registro do Módulo de IA no Laravel**
   - IAServiceProvider registrado em config/app.php
   - ia_routes.php incluído em routes/api.php
   - Cache do Laravel limpo
   - Status: ✅ Funcionando

3. **Teste do Endpoint de IA**
   - Endpoint: `/api/ia/health`
   - Resposta: `{"success":true,"data":{"service":"IA Orcamento Service","version":"1.0.0","status":"operational"}}`
   - Status: ✅ Operacional

### Status Final dos Containers

| Container | Status | CPU |
|-----------|--------|-----|
| hospitalar_v2 | ✅ Running | 17.69% |
| hospitalar_angular | ✅ Running (compilando) | 16.24% |
| hospitalar_redis | ✅ Running | 0.62% |
| hospitalar_php | ✅ Running | 0.01% |
| hospitalar_nginx | ✅ Running | 0% |
| hospitalar_db | ✅ Running | 0.82% |

### Conexão COMET Bridge

- URL: https://manus-comet-hospital.ngrok-free.dev
- Status: ✅ Conectado e estável

### Próximos Passos

1. Aguardar compilação do Angular terminar (~5-10 min)
2. Testar frontend em http://localhost:4200
3. Integrar VisionAI com os novos endpoints de IA
4. Testar fluxo completo de orçamento com IA
