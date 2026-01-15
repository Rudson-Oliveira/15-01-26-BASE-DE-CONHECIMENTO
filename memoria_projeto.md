# Projeto Sistema Autônomo - Hospitalar Saúde

## Data de Início: 15/01/2026

## Objetivo Principal
Criar um sistema autônomo com IA para a empresa Hospitalar Saúde, onde cada colaborador será um assistente seguindo o organograma. O sistema deve ser objetivo e efetivo, focando em ROI.

## Base de Conhecimento e Aprendizado
- Login e senha do usuário
- Documentos
- Interação com usuário
- Frontend
- Backend
- Banco de dados
- Código fonte
- Email
- Whatsapp
- Servidor

## Restrições
- Não aceita alterações diretas - tudo via Docker
- Ambiente DEV: https://dev.hospitalarsaude.app.br/#/

---

## Análise Inicial do Sistema (15/01/2026)

### Estrutura do Menu Principal (Módulos Identificados)
| ID | Módulo | Descrição |
|----|--------|-----------|
| administrative | Administrativo | Gestão administrativa |
| inventory | Almoxarifado | Controle de estoque |
| app | Aplicativo | Módulo de aplicativo |
| release | Atualizações do sistema | Controle de versões |
| audit | Auditoria | Auditoria de processos |
| recepcao | Recepção | Atendimento inicial |
| ia | Chat com IA | Módulo de IA existente |
| purchases | Compras | Gestão de compras |
| rents | Locação | Gestão de locações |
| settings | Configurações | Configurações do sistema |

### Módulos Adicionais Identificados (via Markdown)
- Equipamentos
- Faturamento
- Financeiro
- Fiscal
- Frota
- Jurídico
- Logs
- Loja
- Operadoras
- **Orçamentos** (FOCO INICIAL)
- Pacientes
- Permissões
- Profissionais
- Psicologia
- Recrutamento
- Recursos Humanos
- Setores
- Tabela Preços
- Tabelas TISS

### Usuário Logado
- Nome: RUDSON ANTONIO RIBEIRO OLIVEIRA
- Nível: 0

### Versão do Sistema
- release-1.0.6

---

## Módulo de Compras - Análise Detalhada

### URL
`https://dev.hospitalarsaude.app.br/#/dashboard/compras/construcao`

### Abas do Módulo
1. Pedidos em construção (tab: nav-construcao-tab)
2. Pedidos em andamento (tab: nav-andamento-tab)
3. Pedidos reprovados (tab: nav-reprovado-tab)

### Funcionalidades
- ADICIONAR PEDIDO
- FILTROS
- LIMPAR FILTRO
- Pesquisar (campo de busca)

### Estrutura da Tabela de Pedidos
| Campo | Descrição |
|-------|-----------|
| ID | Identificador único do pedido |
| Data de emissão | Data/hora de criação |
| Solicitante | Nome do solicitante |
| Setor de origem | Setor que originou o pedido |
| Tipo da compra | Tipo (ex: Avulso) |
| Categoria | Categoria do item (ex: Dietas, Consumíveis) |
| Paciente | Nome do paciente associado |
| Comprador | Responsável pela compra |

### Dados de Exemplo (Pedidos em Construção)
| ID | Data | Solicitante | Setor | Tipo | Categoria | Paciente |
|----|------|-------------|-------|------|-----------|----------|
| 1431 | 18/07/2025 11:26:23 | RODRIGO MAIA DA SILVA | TI | Avulso | Dietas | THEREZA MARIA DOS REIS |
| 1434 | 10/11/2025 14:35:14 | RODRIGO MAIA DA SILVA | TI | Avulso | Consumíveis | VANDERLEIA DE SOUZA DONA |

---

## Próximos Passos
1. [ ] Explorar módulo de Orçamentos (foco inicial do projeto)
2. [ ] Analisar chamadas de API via DevTools
3. [ ] Mapear endpoints do backend
4. [ ] Identificar estrutura do banco de dados
5. [ ] Documentar fluxos de negócio

---

## Linha do Tempo do Projeto
- 15/01/2026: Início da análise do sistema


---

## Módulo de Orçamentos - Análise Detalhada (FOCO INICIAL)

### URL
`https://dev.hospitalarsaude.app.br/#/dashboard/orcamentos/retificado`

### Abas do Módulo
1. **Retificações** (tab: nav-retificado-tab) - Aba atual
2. **Painel Administrativo** (tab: nav-dashboard-tab)

### Sub-filtros
- Pendentes
- Realizadas

### Funcionalidades
- Pesquisar (campo de busca)
- Ordenação por colunas (Código, Finalizado)

### Estrutura da Tabela de Orçamentos
| Campo | Descrição |
|-------|-----------|
| Código | Identificador único do orçamento |
| Nome | Nome do paciente |
| Período | Período do orçamento (data início à data fim) |
| Finalizado | Data de finalização |

### Dados de Exemplo (Retificações)
| Código | Nome | Período | Finalizado |
|--------|------|---------|------------|
| 64321 | GERALDA DE OLIVEIRA COUTINHO | 23/03/2025 à 23/03/2025 | 23/03/2025 |
| 63998 | GERALDA DE OLIVEIRA COUTINHO | 11/04/2025 à 11/04/2025 | 12/04/2025 |
| 63317 | PACIENTE TESTE PROD | 01/04/2025 à 30/04/2025 | 12/03/2025 |
| 63001 | THIAGO BRUNO ALBINO | 25/02/2025 à 25/02/2025 | 25/02/2025 |
| 62935 | OLIVIA DE CASTRO NARCISO | 23/02/2025 à 23/02/2025 | 23/02/2025 |
| 61568 | JANILTON DA SILVA ARAUJO | 01/12/2024 à 31/12/2024 | 31/12/2024 |
| 59185 | JOVINO MARTINS | 07/10/2024 à 07/10/2024 | 07/10/2024 |
| 58866 | MARIA ODETE GUIDO | 28/09/2024 à 28/09/2024 | 28/09/2024 |

**Total de registros:** 8

### Ações Disponíveis
- Detalhes (ícone em cada linha)

---

## Análise Técnica - Próximos Passos

### Para Análise de API (DevTools)
1. [ ] Capturar chamadas de rede (Network tab)
2. [ ] Identificar endpoints de API
3. [ ] Mapear estrutura de requisições/respostas
4. [ ] Documentar autenticação (tokens, headers)



---

## Estrutura de um Orçamento Individual

### URL Padrão
`https://dev.hospitalarsaude.app.br/#/dashboard/pacientes/orcamentos/itens/{CODIGO}`

### Exemplo: Orçamento 64321 - GERALDA DE OLIVEIRA COUTINHO

### Abas/Funcionalidades do Orçamento
1. **ADICIONAR ITENS** - Adicionar novos itens ao orçamento
2. **Importar orçamento** - Importar de outro orçamento
3. **Aprovação** - Gerenciar aprovação
4. **Desconto** - Aplicar descontos
5. **Observações** - Adicionar observações
6. **Condições de pagamento** - Definir condições
7. **Orçamento retificado** - Versão retificada

### Campos do Orçamento
| Campo | Valor Exemplo | Descrição |
|-------|---------------|-----------|
| Status | Aprovado | Status atual do orçamento |
| Aprovado por | RODRIGO MAIA DA SILVA | Responsável pela aprovação |
| Data | 24/07/2025 | Data da aprovação |
| Validade | - | Validade do orçamento |
| Senha | 1234 | Senha de autorização |
| guia do prestador | - | Número da guia do prestador |
| guia da operadora | - | Número da guia da operadora |
| Número | - | Número do orçamento |
| Tipo | Captação | Tipo do orçamento |
| Data início | 23/03/2025 | Data de início |
| Data fim | 23/03/2025 | Data de término |
| Data de solicitação | 23/03/2025 18:11:00 | Data/hora da solicitação |
| Requisições | - | Requisições associadas |
| Aditivos | - | Aditivos ao orçamento |

### Metadados
- **Criado por:** DIRENE DE FATIMA XAVIER às 18:10:02 do dia 18/04/2025
- **Status de autorização:** Aprovado

### Resumo Financeiro
| Descrição | Valor |
|-----------|-------|
| Total original | R$ 401,14 |
| Total original com desconto | R$ 0,00 |
| Total do desconto | R$ 0,00 (0%) |
| Total com aditivos de exclusão | R$ 401,14 |

### Tipos de Itens
| Tipo | Valor |
|------|-------|
| Materiais e OPME | R$ 266,89 |
| Procedimentos | R$ 134,25 |
| **Total** | **R$ 401,14** |

### Observações
- DIRENE DE FATIMA XAVIER, dia 18/04/2025 às 18:21: "ERRO AO FINALIZAR ORÇAMENTO SEM COLOCAR RETIFICAÇÃO AQUI"



---

## Estrutura de Itens do Orçamento

### Tabela de Itens - Materiais e OPME

| Campo | Descrição |
|-------|-----------|
| Tipo | Categoria do item (Materiais e OPME, Procedimentos) |
| Tuss | Código TUSS do item |
| Descrição | Descrição do produto + Fabricante |
| Qtde | Quantidade |
| Periodicidade | Frequência (Diário, etc.) |
| Qtde total | Quantidade total calculada |
| Valor unitário | Preço unitário |
| Total | Valor total do item |

### Exemplo de Itens
| Tipo | Tuss | Descrição | Qtde | Period. | Qtde Total | V. Unit. | Total |
|------|------|-----------|------|---------|------------|----------|-------|
| Materiais e OPME | 0000020114 | SONDA NASOENTERAL 12FR FLEXIFLO (ABBOTT) | 1,00 | Diário | 1,00 | R$ 256,80 | R$ 256,80 |
| Materiais e OPME | 0000117132 | SERINGA 20ML S/AG.LUER SLIP (DESCARPACK) | 1,00 | Diário | 1,00 | R$ 5,60 | R$ 5,60 |
| Materiais e OPME | 0000018481 | COMPRESSA GAZE ESTRELA 13FIOS 7,5X7,5CM EST.ETO 10UNID. (CREMER) | 1,00 | Diário | 1,00 | R$ 4,49 | R$ 4,49 |

### Ações por Item
- Editar (ícone)
- Excluir (ícone)
- Desconto (ícone)

---

## Padrões de URL Identificados

| Módulo | Padrão de URL |
|--------|---------------|
| Dashboard | `/#/dashboard/home` |
| Compras - Construção | `/#/dashboard/compras/construcao` |
| Compras - Andamento | `/#/dashboard/compras/andamento` |
| Compras - Reprovados | `/#/dashboard/compras/reprovado` |
| Orçamentos - Retificações | `/#/dashboard/orcamentos/retificado` |
| Orçamentos - Painel Admin | `/#/dashboard/orcamentos/dashboard` |
| Orçamento Individual | `/#/dashboard/pacientes/orcamentos/itens/{ID}` |



---

## Módulo Chat com IA - Análise

### URL
`https://dev.hospitalarsaude.app.br/#/dashboard/ia`

### Funcionalidades
- NOVA CONVERSA - Iniciar nova conversa com IA
- Pesquisar - Campo de busca

### Estrutura da Tabela
| Campo | Descrição |
|-------|-----------|
| Título | Título da conversa |
| Status | Status da conversa (Ativa, etc.) |

### Conversas Existentes
| Título | Status |
|--------|--------|
| Saudação Inicial | Ativa |
| Funções da Coordenação Administrativa | Ativa |
| Aguardando... | Ativa |
| Aguardando... | Ativa |
| Aguardando... | Ativa |

**Total de registros:** 5

### Ações por Conversa
- Excluir (ícone)
- Produtos (ícone) - Possivelmente relacionar produtos à conversa

### Observações
O sistema já possui uma integração de IA existente. Isso indica que:
1. Já existe infraestrutura para IA no sistema
2. Há um modelo de dados para conversas
3. Pode haver APIs de IA já implementadas



### Interface do Chat com IA

**URL Padrão:** `https://dev.hospitalarsaude.app.br/#/dashboard/ia/{ID}`

**Elementos da Interface:**
- Título da conversa (header azul)
- Área de mensagens (histórico)
- Campo de input: `textarea#inpQuestion` (placeholder: "Digite sua mensagem...")
- Botão Enviar: `button#button-addon2`

**Formato das Mensagens:**
- Mensagem do usuário: Balão à direita (azul)
- Resposta da IA: Balão à esquerda (branco/cinza)
- Metadados: Nome do usuário + Data/Hora

**Exemplo de Conversa:**
- Usuário: "Olá!" (RUDSON ANTONIO RIBEIRO OLIVEIRA - 12/01/2025 16:41:25)
- IA: "Olá! Como posso ajudar você hoje?"

---

## Arquitetura Técnica Identificada

### Frontend
- **Framework:** Provavelmente Angular ou Vue.js (baseado na estrutura de rotas com hash #/)
- **Roteamento:** Hash-based routing (`/#/dashboard/...`)
- **UI Components:** Bootstrap ou similar (botões, tabelas, modais)

### Padrões de Navegação
- Menu lateral fixo com módulos
- Abas para sub-seções
- Tabelas com paginação
- Ações inline (ícones)

### Identificadores de Elementos
- IDs semânticos: `nav-construcao-tab`, `nav-andamento-tab`, etc.
- IDs de módulos: `administrative`, `inventory`, `purchases`, etc.
- IDs de tabelas: `table-review-purchases`, `table-gpt-chat`



---

## Painel Administrativo de Orçamentos

### URL
`https://dev.hospitalarsaude.app.br/#/dashboard/orcamentos/dashboard`

### KPIs Principais (Cards)
| Indicador | Valor Atual |
|-----------|-------------|
| Total de orçamentos | 0 |
| Valor total de orç. solicitados | R$ 0,00 |
| Orçamentos Aprovados | R$ 0,00 |
| Quantidade de operadoras solicitantes | 0 |

### Filtros Disponíveis
| Filtro | Opções |
|--------|--------|
| Modo | Mensal / Anual |
| Início | Data de início |
| Fim | Data de fim |
| Operadora | Seleção de operadora |
| Status | TODOS, APROVADO, REPROVADO, RECAPTAÇÃO, AGUARDANDO |

### Gráficos e Visualizações
1. **Total de operadoras solicitantes** - Gráfico de barras
2. **Orçamentos por status - Quantitativo** - Gráfico com categorias:
   - Acréscimo
   - Aguardando
   - Aprovado
   - Recaptação
   - Reprovado
3. **Orçamentos por semana** - Gráfico temporal por semanas
4. **Tempo de resposta** - Filtro de tempo de resposta
5. **Modalidades orçadas - Quantitativo** - Gráfico de modalidades
6. **Origem de solicitações** - Filtro de origem

### Funcionalidades de Export
- Download SVG
- Download PNG
- Download CSV

### Tabela de Evolução
| Campo | Descrição |
|-------|-----------|
| Mês/Ano | Período |
| Valor Total | Valor monetário |
| Pacientes | Quantidade de pacientes |
| Evolução sobre o mês anterior | Percentual de evolução |

---

## Resumo da Análise Inicial

### Módulos Prioritários para IA (Setor de Orçamentos)

O sistema de orçamentos possui uma estrutura bem definida com os seguintes componentes principais:

1. **Listagem de Orçamentos** - Tabela com filtros e busca
2. **Detalhes do Orçamento** - Informações completas do paciente e valores
3. **Itens do Orçamento** - Materiais, OPME e Procedimentos com códigos TUSS
4. **Aprovação e Workflow** - Status de aprovação, responsáveis, datas
5. **Painel Administrativo** - KPIs, gráficos e relatórios

### Oportunidades de Automação com IA

| Área | Potencial de Automação |
|------|------------------------|
| Criação de orçamentos | Sugestão automática de itens baseada em histórico |
| Precificação | Análise de preços e sugestão de valores |
| Aprovação | Pré-análise e recomendação de aprovação |
| Relatórios | Geração automática de insights |
| Atendimento | Chat com IA para dúvidas sobre orçamentos |



---

## Arquitetura da API e Endpoints (Análise Dedutiva)

Com base na estrutura do frontend e nos padrões de navegação, a comunicação com o backend provavelmente ocorre por meio de uma API RESTful que retorna dados em formato JSON. A seguir, uma lista de endpoints deduzidos com base na análise do comportamento da aplicação.

### Autenticação

A autenticação provavelmente é baseada em token (como JWT), que é enviado em cada requisição no cabeçalho `Authorization` (por exemplo, `Authorization: Bearer <token>`). O token é obtido durante o processo de login.

### Endpoints de Orçamentos

| Ação | Método HTTP | Endpoint Deduzido | Parâmetros/Payload | Descrição |
|---|---|---|---|---|
| Listar Orçamentos | GET | `/api/orcamentos/retificados` | `?search={termo}&page={numero}` | Retorna uma lista paginada de orçamentos retificados. O parâmetro `search` é usado para a busca. |
| Ver Detalhes | GET | `/api/orcamentos/{ID}` | N/A | Retorna os detalhes completos de um orçamento específico, incluindo informações do paciente, valores e, possivelmente, a lista de itens. |
| Listar Itens | GET | `/api/orcamentos/{ID}/itens` | N/A | Alternativamente, pode haver um endpoint separado para buscar os itens de um orçamento. |
| Adicionar Item | POST | `/api/orcamentos/{ID}/itens` | `{"tuss": "...", "quantidade": ..., ...}` | Adiciona um novo item a um orçamento existente. |
| Atualizar Item | PUT | `/api/orcamentos/{ID}/itens/{ITEM_ID}` | `{"quantidade": ..., ...}` | Atualiza um item específico dentro de um orçamento. |
| Excluir Item | DELETE | `/api/orcamentos/{ID}/itens/{ITEM_ID}` | N/A | Remove um item de um orçamento. |

### Endpoints do Chat com IA

| Ação | Método HTTP | Endpoint Deduzido | Payload | Descrição |
|---|---|---|---|---|
| Listar Conversas | GET | `/api/ia/chats` | N/A | Retorna a lista de conversas do usuário. |
| Ver Conversa | GET | `/api/ia/chats/{ID}` | N/A | Retorna o histórico de mensagens de uma conversa específica. |
| Enviar Mensagem | POST | `/api/ia/chats/{ID}/messages` | `{"text": "..."}` | Envia uma nova mensagem para a IA em uma conversa existente. |
| Nova Conversa | POST | `/api/ia/chats` | `{"title": "..."}` | Inicia uma nova conversa com a IA. |

**Observação:** Estes endpoints são uma dedução baseada em padrões comuns de desenvolvimento de APIs RESTful e no comportamento observado no frontend. A estrutura exata pode variar. O próximo passo será tentar validar esses endpoints por meio de requisições diretas. 


### Validação de Endpoints (Tentativa 1)

- **Ação:** Foi executado um comando `curl` para o endpoint deduzido `https://dev.hospitalarsaude.app.br/api/orcamentos/retificados`.
- **Resultado:** A requisição retornou um erro `404 Not Found`.
- **Conclusão:** A hipótese inicial de que a API está localizada sob o caminho `/api` está incorreta. O servidor web não encontrou o recurso nesse caminho. É necessário um método mais eficaz para descobrir a URL base e os endpoints corretos da API, possivelmente analisando os arquivos JavaScript da aplicação para encontrar as URLs de requisição.


---

## Arquitetura da API e Endpoints (Análise do Código-Fonte)

A análise do arquivo `main.js` revelou a URL base da API e uma lista extensa de endpoints. A URL base da API foi confirmada como:

**`https://dev.hospitalarsaude.app.br/api`**

### Endpoints Identificados

A seguir, uma lista de endpoints identificados no código-fonte, agrupados por funcionalidade:

| Módulo | Endpoints |
|---|---|
| **Autenticação** | `/auth/login`, `/auth/login/google`, `/auth/refresh`, `/esqueceu-senha`, `/token-firebase-web`, `/pessoa/senha/{id}`, `/auth/me`, `/auth/logout`, `/resetar-senha`, `/verify-email/{token}/{id}`, `/verify-2fa` |
| **Orçamentos** | `/orcamentos`, `/orcamentos/retificados`, `/orcamentos/{id}`, `/orcamentos/{id}/itens`, `/tipos-orcamento`, `/tiss/modalidade-orcamento`, `/tiss/origem-solicitacao-orcamento` |
| **Pacientes** | `/paciente-equipamento`, `/paciente-monitoramento-tel`, `/paciente-monitoramento`, `/paciente-profissional-dobra`, `/paciente-convenio`, `/paciente-hpp`, `/paciente-profissional-responsavel`, `/paciente-dispositivo`, `/paciente-plano-terapeutico`, `/paciente-internacao`, `/paciente-sinal-vital`, `/paciente-contrato`, `/paciente-homecare`, `/paciente-intercorrencia` |
| **Tabelas TISS** | `/tiss/motivo-reprovacao-orcamento`, `/tiss/motivo-indeferimentos`, `/tiss/atendimentos`, `/tiss/cbo`, `/tiss/cid10`, `/tiss/motivos-encerramento`, `/tiss/dispositivo`, `/tiss/justificativa-troca-dispositivo`, `/tiss/medidas`, `/tiss/motivo-contratacao`, `/tiss/homecare` |
| **Estoque** | `/estoque/equipamentos`, `/estoque/saida-produtos`, `/estoque/produto`, `/estoque/requisicao-produtos` |
| **Financeiro** | `/financeiro/tabelas/formas-pagamento` |
| **Administrativo** | `/administrativo/demandas`, `/administrativo/demandas-setores`, `/administrativo/demandas-notificacoes` |
| **Outros** | `/meus-avisos`, `/aviso`, `/banco`, `/cidade`, `/cmed`, `/operadora`, `/capacitacao`, `/gamificacao-loja`, `/gamificacao-retiradas`, `/gamificacao`, `/atividade-setor`, `/formulario/modelo` |

### Validação de Endpoints (Tentativa 2)

- **Ação:** Foi executado um comando `curl` para o endpoint público `https://dev.hospitalarsaude.app.br/api/tiss/cid10`.
- **Resultado:** A requisição retornou com sucesso (código 200) e uma lista de códigos CID-10 em formato JSON, confirmando que a API está ativa e acessível.
- **Ação:** Foi executado um comando `curl` para o endpoint `https://dev.hospitalarsaude.app.br/api/orcamentos`.
- **Resultado:** A requisição retornou um erro `401 Unauthorized`, indicando que este é um endpoint protegido e requer autenticação.

### Próximos Passos

Para continuar a análise e interagir com os módulos principais do sistema (como o de orçamentos), é necessário obter acesso autenticado à API. O próximo passo é tentar realizar o login para obter um token de autenticação.
