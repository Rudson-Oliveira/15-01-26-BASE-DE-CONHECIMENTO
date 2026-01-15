# 🤖 Agente: Guia Completo de Agentes v2.0

**Origem:** `projeto-2026-autonomia/docs/GUIA_COMPLETO_AGENTES.md`

## 1. Descrição

Este documento é o catálogo central de todos os agentes disponíveis no ecossistema, detalhando suas funções, casos de uso e como orquestrá-los. É a principal referência para qualquer agente que precise delegar uma tarefa.

## 2. Tabela de Agentes

| Agente | Função Específica | Casos de Uso (Quando Usar) |
|---|---|---|
| **MANUS AI** | Orquestração de alto nível, acesso a terminal (Docker, Git), planejamento. | Gerenciamento de repositórios, execução de comandos de sistema, planejamento de tarefas complexas. |
| **COMET Desktop Agent** | Interação direta com interfaces gráficas (navegador), automação de UI. | Automação de processos em sistemas web (n8n, ERPs), preenchimento de formulários. |
| **n8n (Personal Agents)** | Conexão entre APIs, serviços e sistemas, orquestração de fluxos de dados. | Automação de processamento de orçamentos, integração com WhatsApp, envio de notificações. |
| **Ollama (Modelos AI)** | Geração de texto, análise de linguagem natural, sumarização. | Análise de documentos médicos, geração de respostas para pacientes, sumarização de prontuários. |
| **Hub Central** | Ponto central de comunicação entre agentes, roteamento de mensagens. | Sincronização de tarefas entre MANUS e COMET, notificação de eventos críticos. |
| **Obsidian Agent** | Indexação e busca em base de conhecimento, documentação dinâmica. | Criação e atualização automática de documentação, busca de protocolos médicos. |
| **Vision Server** | Análise de imagens médicas, reconhecimento de padrões. | Análise de exames de imagem (raio-x, tomografia), suporte ao diagnóstico. |

## 3. Fluxo de Decisão para Orquestração

1.  **Identificação da Tarefa:** Qual é o objetivo?
    *   Infraestrutura/Estratégia? -> **MANUS AI**
    *   Interação Visual/UI? -> **COMET Desktop Agent**
    *   Fluxo de Dados/APIs? -> **n8n**
    *   Processamento de Linguagem? -> **Ollama**

2.  **Orquestração MANUS + COMET (Obrigatória):**
    *   **MANUS** atua como o orquestrador primário, definindo a estratégia.
    *   **COMET** executa as ações no ambiente Windows, incluindo a interação com o navegador.

## 4. Código Fonte Reutilizável

O documento original `GUIA_COMPLETO_AGENTES.md` no repositório `projeto-2026-autonomia` serve como a fonte da verdade para a operação do sistema e ecossistema de agentes.
