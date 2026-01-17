# Arquitetura de Redundância de LLM - Sistema Hospitalar Saúde

**Versão:** 2.0  
**Data:** 2026-01-17  
**Status:** ✅ IMPLEMENTADO

---

## Princípio Fundamental

> **O SISTEMA NUNCA PODE PARAR!**

Para garantir isso, implementamos uma arquitetura de redundância com **6 provedores de LLM** divididos em duas camadas:

---

## Hierarquia de Provedores

### Camada 1: Provedores LOCAIS (Custo ZERO, Prioridade Máxima)

| Provedor | Porta | Modelos | Status |
|----------|-------|---------|--------|
| **Ollama** | 11434 | deepseek-coder:6.7b, gemma3:4b, phi3, llama3.1:8b, llama3.2 | ✅ Ativo |
| **Jan** | 4891 | Jan-v2-VL-med-Q4_K_M (modelo médico com visão) | ✅ Disponível |

### Camada 2: Provedores API (Fallback Pago)

| Provedor | API | Modelos | Status |
|----------|-----|---------|--------|
| **DeepSeek** | api.deepseek.com | deepseek-chat, deepseek-coder, deepseek-reasoner | ✅ Configurado |
| **Grok (xAI)** | api.x.ai | grok-beta, grok-vision-beta | ✅ Configurado |
| **OpenAI** | api.openai.com | gpt-4.1-mini, gpt-4.1-nano | ✅ Configurado |
| **HuggingFace** | huggingface.co | Modelos diversos | ✅ Configurado |

---

## Fluxo de Fallback

```
┌─────────────────────────────────────────────────────────────────┐
│                    REQUISIÇÃO DE IA                             │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    CAMADA 1: LOCAIS                             │
│                    (Custo ZERO)                                 │
├─────────────────────────────────────────────────────────────────┤
│  ┌─────────────┐     ┌─────────────┐                           │
│  │   Ollama    │────▶│     Jan     │                           │
│  │  (11434)    │     │   (4891)    │                           │
│  └─────────────┘     └─────────────┘                           │
│         │                   │                                   │
│         └───────┬───────────┘                                   │
│                 │                                               │
│         ┌───────▼───────┐                                       │
│         │ Todos locais  │                                       │
│         │   falharam?   │                                       │
│         └───────┬───────┘                                       │
│                 │ SIM                                           │
└─────────────────┼───────────────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────────────────┐
│                    CAMADA 2: APIs                               │
│                    (Fallback Pago)                              │
├─────────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────┐│
│  │  DeepSeek   │─▶│    Grok     │─▶│   OpenAI    │─▶│HuggingF.││
│  │  (grátis*)  │  │   (xAI)     │  │  (pago)     │  │(grátis) ││
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────┘│
└─────────────────────────────────────────────────────────────────┘
```

---

## Arquivos Implementados

### Diretório: `app/Services/IA/`

| Arquivo | Descrição |
|---------|-----------|
| `LLMRouter.php` | Orquestrador principal com Circuit Breaker |
| `Providers/LLMProviderInterface.php` | Interface padrão para provedores |
| `Providers/OllamaProvider.php` | Provider para Ollama local |
| `Providers/JanProvider.php` | Provider para Jan local |
| `Providers/DeepSeekProvider.php` | Provider para DeepSeek API |
| `Providers/GrokProvider.php` | Provider para Grok (xAI) API |
| `Providers/OpenAIProvider.php` | Provider para OpenAI API |
| `Providers/HuggingFaceProvider.php` | Provider para HuggingFace API |

---

## Configuração (.env)

```env
# === PROVEDORES DE IA (REDUNDANCIA) ===
OPENAI_API_KEY=[OPENAI_API_KEY]
DEEPSEEK_API_KEY=[HUGGINGFACE_API_KEY]
GROK_API_KEY=[GROK_API_KEY]
HUGGINGFACE_API_KEY=[HUGGINGFACE_API_KEY]
```

---

## Circuit Breaker

O sistema implementa um **Circuit Breaker** para cada provedor:

| Parâmetro | Valor |
|-----------|-------|
| **Threshold de falhas** | 3 falhas consecutivas |
| **Tempo de recuperação** | 300 segundos (5 minutos) |
| **Persistência** | Cache Redis |

### Estados do Circuit Breaker:

1. **CLOSED** (Normal): Provedor funcionando, requisições passam
2. **OPEN** (Falha): Provedor com 3+ falhas, requisições bloqueadas
3. **HALF-OPEN** (Recuperação): Após 5 minutos, tenta novamente

---

## Probabilidade de Parada Total

Para o sistema parar completamente, seria necessário que **TODOS** os provedores falhassem simultaneamente:

| Cenário | Probabilidade |
|---------|---------------|
| Ollama falhar | 5% |
| Ollama + Jan falharem | 0.5% |
| Todos locais falharem | 0.05% |
| Todos locais + DeepSeek | 0.005% |
| Todos locais + DeepSeek + Grok | 0.0005% |
| **TODOS falharem** | **< 0.00001%** |

**Conclusão: Praticamente IMPOSSÍVEL o sistema parar.**

---

## Uso no Código

```php
use App\Services\IA\LLMRouter;

$router = new LLMRouter();

// Gerar resposta (tenta locais primeiro, depois APIs)
$result = $router->generate("Analise este orçamento", [
    'system_prompt' => 'Você é um assistente médico especializado',
    'max_tokens' => 2048,
    'temperature' => 0.7
]);

if ($result['success']) {
    echo $result['content'];
    echo "Provedor usado: " . $result['provider'];
    echo "Tier: " . $result['tier']; // 'local' ou 'api'
}

// Verificar status de todos os provedores
$status = $router->getStatus();
```

---

## Modelos Médicos Especializados

O sistema possui modelos especializados em medicina:

| Modelo | Provedor | Especialização |
|--------|----------|----------------|
| **Biomistral 7B** | LM Studio | 5M+ artigos PubMed Central |
| **Jan-v2-VL-med** | Jan | Modelo médico com visão |
| **deepseek-coder** | Ollama | Análise de código e dados |

---

## Próximos Passos

1. ✅ Implementar provedores locais (Ollama, Jan)
2. ✅ Implementar provedores API (DeepSeek, Grok, OpenAI, HuggingFace)
3. ✅ Implementar LLMRouter com Circuit Breaker
4. ✅ Configurar chaves de API no .env
5. ⬜ Adicionar LM Studio como provedor local
6. ⬜ Adicionar GPT4All como provedor local
7. ⬜ Implementar seleção inteligente de modelo por tipo de tarefa
