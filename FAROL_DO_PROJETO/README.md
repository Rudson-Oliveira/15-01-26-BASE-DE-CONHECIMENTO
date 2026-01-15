# 🚢 Farol do Projeto - Base de Conhecimento Consultável

**Versão:** 1.0
**Status:** 🟢 ATIVO

## 1. Objetivo

Este "Farol" serve como uma base de conhecimento centralizada e estruturada, projetada para ser consultada por **qualquer agente de IA** (Manus, COMET, Claude, etc.). O objetivo é guiar o desenvolvimento, promover o reaproveitamento de código e garantir que todas as implementações sigam os melhores caminhos já descobertos, otimizando custos e tempo.

**Ao iniciar uma nova tarefa, um agente deve SEMPRE consultar este Farol primeiro.**

## 2. Como Consultar

Um agente deve navegar pela estrutura de diretórios para encontrar o componente ou padrão relevante. A busca deve seguir a seguinte ordem:

1.  **Consultar o `ÍNDICE DE COMPONENTES`** abaixo para uma navegação rápida.
2.  **Navegar pelos diretórios** para encontrar a documentação específica.
3.  **Buscar por palavras-chave** dentro dos arquivos `.md` para encontrar implementações relevantes.

## 3. Índice de Componentes Reutilizáveis

| Categoria | Componente | Descrição | Caminho Relativo |
|---|---|---|---|
| 🏗️ **Infraestrutura** | **Docker Mega Ultra v6.0** | Stack completa com 16 serviços (Traefik, Grafana, Ollama, etc) | `INFRAESTRUTURA/DOCKER_MEGA_ULTRA.md` |
| 🤖 **Agentes** | **Hub Central v1.1** | Orquestrador de agentes, triggers e storage | `AGENTES/HUB_CENTRAL.md` |
| 🤖 **Agentes** | **COMET Bridge v1.0** | Ponte para execução remota de comandos PowerShell | `AGENTES/COMET_BRIDGE.md` |
| 🤖 **Agentes** | **Vision Server v1.0** | Microserviço de análise de imagem com LLaVA | `AGENTES/VISION_SERVER.md` |
| 🤖 **Agentes** | **Router de IA Inteligente** | Roteador de custo-benefício para LLMs | `AGENTES/ROUTER_IA.md` |
| 🔌 **APIs** | **Budget API v1.0** | API RESTful para gestão de orçamentos | `APIS/BUDGET_API.md` |
| 💻 **Snippets** | **Conexão com Banco MySQL** | Padrão de conexão com `mysql.connector` | `SNIPPETS/DATABASE.md` |
| 💻 **Snippets** | **Requisição de API (Python)** | Padrão para chamadas de API com `requests` | `SNIPPETS/API_REQUEST.md` |
| 💻 **Snippets** | **Comando PowerShell Remoto** | Como executar um comando via COMET Bridge | `SNIPPETS/REMOTE_EXECUTION.md` |

---

## 4. Princípios para Agentes

1.  **REAPROVEITE, NÃO REINVENTE:** Antes de escrever qualquer código, verifique se um componente ou padrão similar já existe neste Farol.
2.  **OTIMIZE PARA CUSTO:** Sempre que possível, utilize recursos locais (Ollama) ou a opção de menor custo (Gemini Flash) antes de escalar para modelos mais caros (Claude/GPT).
3.  **SIGA A ARQUITETURA:** As novas implementações devem ser compatíveis com a [Arquitetura Unificada v7.0](../ARQUITETURA_UNIFICADA_V7.md).
4.  **DOCUMENTO O QUE VOCÊ CRIA:** Se um novo componente reutilizável for criado, ele **DEVE** ser documentado e adicionado a este Farol.
