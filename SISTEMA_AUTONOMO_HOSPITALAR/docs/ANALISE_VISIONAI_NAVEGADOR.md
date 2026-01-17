# Análise do VisionAI - Arquitetura do Navegador

**Data**: 17/01/2026  
**URL**: https://visionai-khprjuve.manus.space/

---

## 1. Estrutura da Interface

O VisionAI é um **navegador inteligente com assistente de IA integrado**, similar ao COMET Perplexity. A interface é dividida em duas áreas principais:

### Área Esquerda: Navegador Embutido (iframe)
- Exibe o sistema Hospitalar Saúde em tempo real
- URL configurável via campo de texto
- Alternância entre ambientes DEV e PROD
- Mostra o dashboard do sistema com:
  - Nível do usuário (0)
  - Painel de Atividades
  - Cronograma
  - Meta do setor
  - Meta pessoal
  - Demandas

### Área Direita: Assistente de Chat
- **Título**: "Assistente Hospitalar - Especializado no sistema"
- Chat interativo com histórico de mensagens
- Campo de entrada: "Pergunte sobre o sistema..."
- Ações rápidas (botões coloridos):
  - 🔵 **Ir para Pacientes**
  - 🟢 **Criar Orçamento**
  - 🟣 **Ver Relatórios**
  - 🟠 **Acessar Financeiro**
  - 🔴 **Buscar Paciente**

---

## 2. Funcionalidades Identificadas

### Barra de Navegação Superior
| Elemento | Função |
|----------|--------|
| Logo Vision AI | Identidade visual |
| Setas (← →) | Navegação histórico |
| Casa (🏠) | Home |
| **Canais** | Gerenciar conversas |
| Refresh (🔄) | Atualizar página |
| Campo URL | Digitar URL manualmente |
| Lupa (🔍) | Buscar |
| **DEV** | Ambiente de desenvolvimento |
| **PROD** | Ambiente de produção |
| Avatar (R) | Usuário logado |

### Indicadores de Status
- "Visualizando: Desenvolvimento" - Mostra ambiente atual
- Contador de notificações (0 🔔 0)

---

## 3. Lógica do Navegador (Padrão COMET Perplexity)

### Arquitetura Conceitual

```
┌─────────────────────────────────────────────────────────────────┐
│                      VISION AI BROWSER                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────────────────┐  ┌─────────────────────────────┐  │
│  │    NAVEGADOR (iframe)   │  │    ASSISTENTE IA (Chat)     │  │
│  │                         │  │                             │  │
│  │  - Carrega sistema real │  │  - Responde perguntas       │  │
│  │  - Permite navegação    │  │  - Executa ações rápidas    │  │
│  │  - Captura contexto     │  │  - Guia o usuário           │  │
│  │  - Envia eventos        │  │  - Aprende com interações   │  │
│  │                         │  │                             │  │
│  └───────────┬─────────────┘  └──────────────┬──────────────┘  │
│              │                               │                  │
│              └───────────┬───────────────────┘                  │
│                          │                                      │
│                  ┌───────▼───────┐                              │
│                  │   ORQUESTRADOR │                              │
│                  │   (Hub Central)│                              │
│                  └───────┬───────┘                              │
│                          │                                      │
│         ┌────────────────┼────────────────┐                     │
│         │                │                │                     │
│  ┌──────▼──────┐  ┌──────▼──────┐  ┌──────▼──────┐             │
│  │   Backend   │  │  IA Local   │  │   Banco     │             │
│  │   Laravel   │  │   Ollama    │  │   MySQL     │             │
│  └─────────────┘  └─────────────┘  └─────────────┘             │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Fluxo de Interação

1. **Usuário pergunta** no chat (ex: "como faço cadastro de paciente?")
2. **Assistente analisa** a pergunta e contexto atual do navegador
3. **Resposta gerada** com passos detalhados
4. **Ações rápidas** oferecidas para navegação direta
5. **Navegador atualiza** quando ação é executada

---

## 4. Integração com Sistema Hospitalar

### Dados Visíveis no Dashboard
- **Usuário**: Nível 0
- **Painel de Atividades**: Sem registros na meta do setor
- **Meta Pessoal**: Relatórios #605 (Execução: 26/05/2025 - 27/05/2025)
- **Demandas**: Sem registros
- **Status**: "Todos registros carregados!"

### Comandos Especiais Identificados
O assistente reconhece comandos especiais como `/backups`, embora responda que a funcionalidade não está disponível para usuários finais.

---

## 5. Comparação com COMET Perplexity

| Característica | VisionAI | COMET Perplexity |
|----------------|----------|------------------|
| Navegador embutido | ✅ iframe | ✅ iframe |
| Chat lateral | ✅ Direita | ✅ Direita |
| Ações rápidas | ✅ Botões coloridos | ✅ Sugestões |
| Alternância ambiente | ✅ DEV/PROD | ✅ Múltiplos |
| Histórico de chat | ✅ Persistente | ✅ Persistente |
| Comandos especiais | ✅ /backups | ✅ Vários |
| Contexto do navegador | ✅ Captura URL | ✅ Captura URL |

---

## 6. Oportunidades de Integração

### Para o Módulo de Orçamentos

1. **Ação Rápida "Criar Orçamento"** já existe - precisa conectar aos endpoints de IA
2. **Chat pode chamar** `/api/ia/orcamento/analyze-complexity` quando usuário perguntar sobre complexidade
3. **Navegador pode navegar** automaticamente para `/dashboard/orcamentos` quando solicitado
4. **Contexto do paciente** pode ser capturado do iframe para análise

### Próximos Passos

1. Conectar ações rápidas aos endpoints de IA do Laravel
2. Implementar captura de contexto do iframe
3. Adicionar comandos especiais para orçamentos (/orcamento, /complexidade, /sugerir)
4. Integrar com Hub Central para orquestração de tarefas

---

## 7. Conclusão

O VisionAI já possui a estrutura de navegador inteligente funcional. A lógica é similar ao COMET Perplexity, com navegador embutido + assistente de chat. O sistema está pronto para receber as integrações com os endpoints de IA de orçamentos.

**Status**: ✅ Interface funcional, pendente integração com backend de IA


---

## 8. Módulo de Canais (Monitoramento)

### URL: /communication

O VisionAI possui um módulo completo de **Monitoramento de Canais** que integra múltiplos sistemas de comunicação.

### Status de Conexão

| Canal | Status | Última Verificação |
|-------|--------|-------------------|
| Email | ✅ Conectado | 02:16:54 |
| WhatsApp | ✅ Conectado | 02:16:54 |
| Telegram | ❌ Desconectado | 02:16:54 |

### Métricas do Sistema

| Métrica | Valor |
|---------|-------|
| CPU | 27-35% |
| Memória | 62% |
| Latência | 45ms |
| Uptime | 99.8% |
| Taxa de Erro | 0.2% |
| Mensagens Enviadas | 1234 |
| Mensagens Recebidas | 5678 |

### Funcionalidades de Integração

1. **Email**: Conectar Gmail ou Outlook (suporta 2FA com senha de app)
2. **WhatsApp**: Conectar via QR Code (WhatsApp Web)
3. **Telegram**: Disponível mas desconectado

### Indicadores de Status

- 🟢 Sistema Online
- 🔵 Email Conectado
- 🔵 WhatsApp Pronto

### Implicações para Automação

Este módulo permite que o sistema autônomo:
- Envie notificações de orçamentos via Email e WhatsApp
- Receba solicitações de orçamento via canais de comunicação
- Monitore a saúde do sistema em tempo real
- Alerte sobre problemas de conexão

---

## 9. Arquitetura Completa do VisionAI

```
┌─────────────────────────────────────────────────────────────────┐
│                      VISION AI PLATFORM                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────┐ │
│  │  NAVEGADOR  │  │   CANAIS    │  │     ASSISTENTE IA       │ │
│  │   (iframe)  │  │ (Email/WA)  │  │       (Chat)            │ │
│  └──────┬──────┘  └──────┬──────┘  └───────────┬─────────────┘ │
│         │                │                     │               │
│         └────────────────┼─────────────────────┘               │
│                          │                                      │
│                  ┌───────▼───────┐                              │
│                  │  HUB CENTRAL  │                              │
│                  │  Orquestrador │                              │
│                  └───────┬───────┘                              │
│                          │                                      │
│    ┌─────────────────────┼─────────────────────┐               │
│    │                     │                     │               │
│  ┌─▼───────┐      ┌──────▼──────┐      ┌───────▼───────┐       │
│  │ Backend │      │  IA Local   │      │    Banco      │       │
│  │ Laravel │      │   Ollama    │      │    MySQL      │       │
│  └─────────┘      └─────────────┘      └───────────────┘       │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

Esta arquitetura permite que o sistema autônomo opere em múltiplas frentes:
- **Navegador**: Interação visual com o sistema
- **Canais**: Comunicação com usuários externos
- **Assistente**: Suporte inteligente interno
- **Hub Central**: Orquestração de todas as operações
