# Análise Consolidada do Sistema Hospitalar

**Data:** 17/01/2026  
**Conexão:** COMET Bridge v2.0 via ngrok (manus-comet-hospital.ngrok-free.dev)

---

## 1. Infraestrutura Docker

| Container | Imagem | Porta | Status | CPU |
|-----------|--------|-------|--------|-----|
| hospitalar_v2 | - | - | ✅ Running | 1.19% |
| hospitalar_redis_commander | rediscommander/redis-commander | 8081:8081 | ✅ Running | 0% |
| hospitalar_redis | redis:7-alpine | 6379:6379 | ✅ Running | 0.41% |
| hospitalar_php | hospitalar_v2-app | - | ✅ Running | 0% |
| hospitalar_nginx | nginx:alpine | 8888:80 | ✅ Running | 0% |
| hospitalar_db | mysql:8.0 | 3308:3306 | ✅ Running | 0.78% |
| hospitalar_angular | node:16-alpine | 4205:4200 | ⚪ Stopped | 0% |

**Recursos do Sistema:**
- RAM: 5.18 GB
- CPU: 4.84%
- Disco: 29.10 GB usado (limite 1006.85 GB)

---

## 2. Estrutura do Backend (Laravel/PHP)

### Diretório Principal
```
C:\Users\rudpa\Documents\hospitalar\hospitalar_v2\hospitalar_backend\
├── app/                 # Código da aplicação
├── bootstrap/           # Inicialização
├── config/              # Configurações
├── database/            # Migrations e seeds
├── public/              # Arquivos públicos
├── resources/           # Views e assets
├── routes/              # Rotas da API
├── storage/             # Arquivos de storage
├── tests/               # Testes
├── vendor/              # Dependências
├── .env                 # Variáveis de ambiente
├── composer.json        # Dependências PHP
├── Dockerfile           # Container Docker
└── banco.sql            # Dump do banco (5.7 GB)
```

### Arquivo de Rotas (api.php)
- **Tamanho:** 121.483 bytes
- **Controllers de Orçamento identificados:**
  - `DashboardOrcamentoController`
  - `TipoOrcamentoController`
  - `PacienteOrcamentoController`
  - `PacienteOrcamentoCondicaoController`
  - `OrcamentoDescontoController`
  - `OrcamentoPlanoTerapeuticoController`
  - `SetorTipoOrcamentoController`
  - `ModalidadeOrcamentoController`
  - `MotivoReprovacaoOrcamentoController`
  - `OrigemSolicitacaoOrcamentoController`

---

## 3. Controller de Orçamentos (PacienteOrcamentoController)

### Informações Gerais
- **Arquivo:** `app/Http/Controllers/Paciente/Orcamento/PacienteOrcamentoController.php`
- **Tamanho:** 108.405 bytes
- **Framework:** Laravel

### Services Utilizados
- `PacienteOrcamentoService`
- `FaturamentoService`
- `ConvenioService`
- `TipoItemService`
- `AwsS3StorageService`
- `PacienteTotalOrcamentoService`
- `PacienteStatusService`

### Models Utilizados
- `PacienteOrcamento`
- `PacienteOrcamentoItem`
- `PacienteOrcamentoFrequency`
- `PacienteOrcamentoCondicao`
- `PacienteResponsavel`
- `ContaReceber`
- `CentroCusto`
- `PlanoConta`

### Métodos Públicos Identificados

| Método | Descrição |
|--------|-----------|
| `index` | Listar orçamentos |
| `indexDash` | Dashboard de orçamentos |
| `store` | Criar novo orçamento |
| `storeItem` | Adicionar item ao orçamento |
| `importItems` | Importar itens em lote |
| `duplicateById` | Duplicar orçamento existente |
| `show` | Exibir orçamento específico |
| `periodicityBimonthlyItem` | Periodicidade bimestral |
| `generateRequisition` | Gerar requisição |
| `printPDF` | Imprimir PDF do orçamento |
| `showByPatientId` | Buscar por paciente |
| `update` | Atualizar orçamento |
| `validateTotalReceivable` | Validar total a receber |
| `storeReceivable` | Registrar conta a receber |
| `updateFinishedService` | Atualizar serviço finalizado |
| `updateObs` | Atualizar observações |
| `updateItem` | Atualizar item |
| `updateApproval` | Atualizar aprovação |
| `updateAuthorizationStatus` | Atualizar status de autorização |
| `updateParentItemsByAdditive` | Atualizar itens por aditivo |
| `storeFilesByAdditive` | Anexar arquivos ao aditivo |
| `destroyFile` | Remover arquivo |
| `updateFrequencyItemsByAdditive` | Atualizar frequência por aditivo |
| `deleteFrequencyChange` | Remover alteração de frequência |
| `discountByItemId` | Aplicar desconto por item |
| `destroy` | Excluir orçamento |
| `destroyItem` | Excluir item |
| `destroyItemByAdditive` | Excluir item por aditivo |

---

## 4. Endpoints de Orçamento na API

### Rotas Identificadas

| Rota | Método | Descrição |
|------|--------|-----------|
| `/paciente-orcamento` | GET | Listar orçamentos |
| `/paciente-orcamento` | POST | Criar orçamento |
| `/paciente-orcamento/{id}` | GET | Exibir orçamento |
| `/paciente-orcamento/{id}` | PUT | Atualizar orçamento |
| `/paciente-orcamento/{id}` | DELETE | Excluir orçamento |
| `/paciente-orcamento/orcamento-dash` | GET | Dashboard |
| `/paciente-orcamento/orcamento/gerar` | POST | Gerar orçamento |
| `/orcamento-desconto` | GET | Listar descontos |
| `/orcamento-plano-terapeutico` | GET | Plano terapêutico |
| `/orcamentos/aprovados-nao-faturados` | GET | Aprovados não faturados |
| `/orcamentos/orcamentos-sem-guia` | GET | Sem guia |
| `/orcamentos/orcamentos-sem-senha` | GET | Sem senha |
| `/orcamentos/orcamentos-emitidos` | GET | Emitidos |
| `/orcamentos/orcamentos-por-periodo` | GET | Por período |
| `/orcamentos/orcamentos-prorrogar` | GET | Para prorrogar |
| `/orcamentos/aditivo-exclusao` | GET | Com aditivo/exclusão |
| `/orcamentos/status-autorizacao` | GET | Por autorização |
| `/orcamentos/orcamentos-convenios` | GET | Por convênio |
| `/orcamentos/orcamentos-valores` | GET | Valores por tipo |
| `/orcamentos/orcamentos-valores-status` | GET | Valores por status |
| `/orcamentos/orcamentos-valores-convenio` | GET | Valores por convênio |
| `/orcamentos/orcamentos-valores-totais` | GET | Valores totais |

---

## 5. Pontos de Integração para IA

### 5.1 Assistente de Criação de Orçamentos
**Endpoint alvo:** `POST /paciente-orcamento`

A IA pode auxiliar na:
- Sugestão de itens baseada no histórico do paciente
- Cálculo automático de valores
- Validação de regras de negócio
- Preenchimento automático de campos

### 5.2 Análise Preditiva de Aprovação
**Endpoint alvo:** `GET /orcamentos/status-autorizacao`

A IA pode:
- Prever probabilidade de aprovação
- Identificar padrões de reprovação
- Sugerir ajustes para aumentar aprovação

### 5.3 Otimização de Preços
**Endpoints alvo:** 
- `GET /orcamentos/orcamentos-valores`
- `GET /orcamentos/orcamentos-valores-convenio`

A IA pode:
- Analisar margens por convênio
- Identificar oportunidades de otimização
- Alertar sobre preços fora do padrão

### 5.4 Automação de Retificações
**Endpoint alvo:** Dashboard de Retificações

A IA pode:
- Identificar retificações recorrentes
- Sugerir correções automáticas
- Aprender com padrões de erro

---

## 6. Agentes Locais Conectados

| Serviço | Porta | Status |
|---------|-------|--------|
| COMET Bridge | 5000 | ✅ Online |
| Obsidian Agent | 5001 | ✅ Online |
| Hub Central | 5002 | ✅ Online |
| Vision Server | 5003 | ✅ Online |
| Jan - IA Local | 4891 | ✅ Online |
| Ollama | 11434 | ✅ Online |

---

## 7. Próximos Passos Recomendados

### Prioridade Alta
1. **Criar endpoint de IA no backend Laravel** - Adicionar rota `/api/ia/orcamento` para integração
2. **Conectar VisionAI ao PacienteOrcamentoController** - Usar o método `store` para criar orçamentos via IA
3. **Implementar análise de complexidade** - Usar Ollama local para análise NEAD/ABEMID

### Prioridade Média
4. **Criar webhook para notificações** - Alertar sobre orçamentos pendentes
5. **Integrar com Hub Central** - Orquestrar tarefas automáticas
6. **Implementar cache Redis** - Otimizar consultas frequentes

### Prioridade Baixa
7. **Adicionar logs de IA** - Registrar interações para aprendizado
8. **Criar dashboard de métricas de IA** - Monitorar efetividade
9. **Implementar feedback loop** - Melhorar sugestões com base em resultados

---

*Documento gerado por Manus AI em 17/01/2026*
