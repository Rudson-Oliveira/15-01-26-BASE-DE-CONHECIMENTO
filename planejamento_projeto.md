# Planejamento do Projeto: Sistema Autônomo com IA - Hospitalar Saúde

## Visão Geral

**Objetivo:** Criar um sistema autônomo com IA para a empresa Hospitalar Saúde, onde cada colaborador será um assistente seguindo o organograma. O sistema deve ser objetivo e efetivo, focando em ROI.

**Ambiente:** Docker (todas as alterações devem ser feitas via Docker)

**Foco Inicial:** Setor de Orçamentos

---

## Arquitetura Proposta

### Componentes Principais

```
┌─────────────────────────────────────────────────────────────────────┐
│                         SISTEMA AUTÔNOMO                            │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐             │
│  │   AGENTE    │    │   AGENTE    │    │   AGENTE    │             │
│  │ ORÇAMENTOS  │    │   COMPRAS   │    │  FATURAMENTO│             │
│  └──────┬──────┘    └──────┬──────┘    └──────┬──────┘             │
│         │                  │                  │                     │
│         └──────────────────┼──────────────────┘                     │
│                            │                                        │
│                   ┌────────▼────────┐                               │
│                   │   ORQUESTRADOR  │                               │
│                   │    CENTRAL      │                               │
│                   └────────┬────────┘                               │
│                            │                                        │
│         ┌──────────────────┼──────────────────┐                     │
│         │                  │                  │                     │
│  ┌──────▼──────┐    ┌──────▼──────┐    ┌──────▼──────┐             │
│  │   API DO    │    │   BANCO DE  │    │   BASE DE   │             │
│  │   SISTEMA   │    │    DADOS    │    │ CONHECIMENTO│             │
│  └─────────────┘    └─────────────┘    └─────────────┘             │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### Camadas do Sistema

| Camada | Descrição | Tecnologias Sugeridas |
|--------|-----------|----------------------|
| **Frontend** | Interface de usuário para interação com os agentes | Angular (existente), React (opcional) |
| **Backend** | API e lógica de negócio | Node.js, Python (FastAPI) |
| **Agentes IA** | Assistentes autônomos por setor | LangChain, OpenAI API, Agentes Locais |
| **Base de Conhecimento** | Armazenamento de aprendizado e contexto | Obsidian, Vector DB (Pinecone, ChromaDB) |
| **Orquestrador** | Coordenação entre agentes | Python, n8n, ou similar |
| **Docker** | Containerização de todos os componentes | Docker, Docker Compose |

---

## Fase 1: Agente de Orçamentos

### Funcionalidades Prioritárias

| Prioridade | Funcionalidade | Descrição | ROI Esperado |
|------------|----------------|-----------|--------------|
| 1 | **Consulta de Orçamentos** | Agente responde perguntas sobre orçamentos existentes | Redução de tempo de atendimento |
| 2 | **Sugestão de Itens** | Sugestão automática de itens baseada em histórico | Aumento de precisão e velocidade |
| 3 | **Pré-análise de Aprovação** | Análise automática para recomendação de aprovação | Redução de erros e retrabalho |
| 4 | **Geração de Relatórios** | Relatórios automáticos de KPIs | Economia de tempo gerencial |
| 5 | **Atendimento via WhatsApp** | Integração com WhatsApp para consultas | Melhoria no atendimento ao cliente |

### Endpoints da API Necessários

Com base na análise do código-fonte, os seguintes endpoints serão utilizados:

| Endpoint | Método | Descrição |
|----------|--------|-----------|
| `/auth/login` | POST | Autenticação do agente |
| `/orcamentos` | GET | Listar orçamentos |
| `/orcamentos/{id}` | GET | Detalhes de um orçamento |
| `/orcamentos/{id}/itens` | GET/POST | Itens de um orçamento |
| `/tipos-orcamento` | GET | Tipos de orçamento disponíveis |
| `/tiss/cid10` | GET | Códigos CID-10 |
| `/operadora` | GET | Operadoras cadastradas |

---

## Fase 2: Expansão para Outros Setores

Após validação do ROI no setor de orçamentos, expandir para:

1. **Compras** - Automação de pedidos e cotações
2. **Faturamento** - Geração e acompanhamento de faturas
3. **Estoque** - Controle e previsão de demanda
4. **RH** - Recrutamento e gestão de profissionais

---

## Estrutura de Arquivos do Projeto

```
/home/ubuntu/hospitalar_saude_projeto/
├── memoria_projeto.md          # Documentação e memória do projeto
├── planejamento_projeto.md     # Este arquivo - planejamento detalhado
├── docker/
│   ├── docker-compose.yml      # Orquestração dos containers
│   ├── Dockerfile.agent        # Container do agente IA
│   └── Dockerfile.api          # Container da API intermediária
├── agents/
│   ├── orcamentos/
│   │   ├── agent.py            # Lógica do agente de orçamentos
│   │   ├── tools.py            # Ferramentas do agente
│   │   └── prompts.py          # Prompts do agente
│   └── base/
│       ├── base_agent.py       # Classe base para agentes
│       └── knowledge_base.py   # Interface com base de conhecimento
├── api/
│   ├── main.py                 # API intermediária (FastAPI)
│   ├── auth.py                 # Autenticação com o sistema
│   └── routes/
│       └── orcamentos.py       # Rotas de orçamentos
├── knowledge/
│   ├── obsidian/               # Base de conhecimento Obsidian
│   └── vectors/                # Embeddings e vetores
└── scripts/
    ├── backup.py               # Script de backup da memória
    └── sync.py                 # Sincronização de conhecimento
```

---

## Próximos Passos Imediatos

1. [ ] **Obter credenciais de acesso** - Solicitar ao usuário login/senha para autenticação na API
2. [ ] **Criar container Docker base** - Estrutura inicial do projeto em Docker
3. [ ] **Implementar agente de consulta** - Primeiro agente funcional para consultas de orçamentos
4. [ ] **Testar integração com API** - Validar comunicação com o backend existente
5. [ ] **Implementar base de conhecimento** - Estrutura para aprendizado contínuo

---

## Métricas de Sucesso (ROI)

| Métrica | Baseline | Meta | Prazo |
|---------|----------|------|-------|
| Tempo médio de consulta de orçamento | A definir | -50% | 30 dias |
| Erros em orçamentos | A definir | -30% | 60 dias |
| Tempo de aprovação | A definir | -40% | 45 dias |
| Satisfação do usuário | A definir | +20% | 90 dias |

---

## Notas de Implementação

### Restrições Técnicas
- Todas as alterações devem ser feitas via Docker
- O sistema existente não aceita alterações diretas
- Ambiente de desenvolvimento: https://dev.hospitalarsaude.app.br

### Integrações Disponíveis
- API REST do sistema (URL base: `https://dev.hospitalarsaude.app.br/api`)
- Chat com IA existente (pode ser aproveitado)
- Autenticação JWT

### Agentes Locais Disponíveis
- O usuário mencionou ter "muitos agentes locais" que podem ser utilizados para otimizar custos
- Considerar integração com COMET e outros agentes auxiliares

---

## Histórico de Atualizações

| Data | Atualização |
|------|-------------|
| 15/01/2026 | Criação inicial do planejamento |
