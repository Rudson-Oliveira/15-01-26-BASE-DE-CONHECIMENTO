# Arquitetura de Redundância de LLM - Sistema Hospitalar Saúde

**Data**: 17/01/2026  
**Versão**: 1.0  
**Objetivo**: Sistema que JAMAIS pode parar - Redundância total de LLM

---

## 1. Inventário Completo de Provedores de LLM

### 1.1 Provedores Locais (Custo Zero, Alta Prioridade)

| Provedor | Porta | Modelos Disponíveis | Status |
|----------|-------|---------------------|--------|
| **Ollama** | 11434 | deepseek-coder:6.7b, gemma3:4b, phi3, llama3.1:8b, llama3.2 | ✅ Online |
| **Jan** | 4891 | Jan-v2-VL-med-Q4_K_M (modelo médico!) | ✅ Online |
| **LM Studio** | 1234 | DeepSeek R1 Distill Qwen 7B, Biomistral 7B | ✅ Disponível |
| **GPT4All** | - | Modelos locais diversos | ✅ Disponível |

### 1.2 Provedores Externos (Custo por Token, Fallback)

| Provedor | API Key | Modelos | Custo Estimado |
|----------|---------|---------|----------------|
| **OpenAI** | OPENAI_API_KEY | gpt-4.1-mini, gpt-4.1-nano | $0.002/1K tokens |
| **HuggingFace** | [HUGGINGFACE_API_KEY] | Inference API | Gratuito/Limitado |
| **Anthropic** | (configurar) | Claude | $0.003/1K tokens |
| **Groq** | (configurar) | Llama, Mixtral | Gratuito/Limitado |

### 1.3 Modelos Especializados Identificados

| Modelo | Especialização | Localização |
|--------|----------------|-------------|
| **Biomistral 7B** | Medicina/Saúde | LM Studio |
| **Jan-v2-VL-med** | Visão + Medicina | Jan |
| **DeepSeek Coder** | Código | Ollama, LM Studio |

---

## 2. Arquitetura de Redundância com LlamaIndex

### 2.1 Diagrama de Fallback

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    SISTEMA DE REDUNDÂNCIA DE LLM                            │
│                    "O SISTEMA JAMAIS PODE PARAR"                            │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                      LLAMAINDEX ROUTER                               │   │
│  │                   (Orquestrador Inteligente)                         │   │
│  └───────────────────────────────┬─────────────────────────────────────┘   │
│                                  │                                          │
│         ┌────────────────────────┼────────────────────────┐                │
│         │                        │                        │                │
│         ▼                        ▼                        ▼                │
│  ┌─────────────┐          ┌─────────────┐          ┌─────────────┐        │
│  │  NÍVEL 1    │          │  NÍVEL 2    │          │  NÍVEL 3    │        │
│  │  LOCAL      │  ──X──►  │  LOCAL      │  ──X──►  │  EXTERNO    │        │
│  │  PRIMÁRIO   │  falha   │  BACKUP     │  falha   │  CLOUD      │        │
│  └──────┬──────┘          └──────┬──────┘          └──────┬──────┘        │
│         │                        │                        │                │
│  ┌──────▼──────┐          ┌──────▼──────┐          ┌──────▼──────┐        │
│  │   Ollama    │          │    Jan      │          │   OpenAI    │        │
│  │  llama3.2   │          │  Jan-med    │          │  gpt-4.1    │        │
│  │  (gratuito) │          │  (gratuito) │          │   (pago)    │        │
│  └─────────────┘          └─────────────┘          └─────────────┘        │
│         │                        │                        │                │
│         │                        │                        │                │
│  ┌──────▼──────┐          ┌──────▼──────┐          ┌──────▼──────┐        │
│  │  LM Studio  │          │   GPT4All   │          │ HuggingFace │        │
│  │  Biomistral │          │   (backup)  │          │  (backup)   │        │
│  │  (gratuito) │          │  (gratuito) │          │  (gratuito) │        │
│  └─────────────┘          └─────────────┘          └─────────────┘        │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 2.2 Ordem de Prioridade (Fallback Chain)

| Prioridade | Provedor | Modelo | Custo | Latência | Uso |
|------------|----------|--------|-------|----------|-----|
| 1 | Ollama | llama3.2 | $0 | ~2s | Padrão |
| 2 | Ollama | deepseek-coder:6.7b | $0 | ~3s | Código |
| 3 | Jan | Jan-v2-VL-med | $0 | ~2s | Medicina |
| 4 | LM Studio | Biomistral 7B | $0 | ~3s | Medicina |
| 5 | LM Studio | DeepSeek R1 | $0 | ~4s | Análise |
| 6 | GPT4All | Local | $0 | ~3s | Backup |
| 7 | HuggingFace | Inference API | $0* | ~5s | Cloud gratuito |
| 8 | OpenAI | gpt-4.1-mini | $$ | ~1s | Cloud pago |
| 9 | OpenAI | gpt-4.1-nano | $ | ~0.5s | Cloud rápido |

---

## 3. Implementação com LlamaIndex

### 3.1 Estrutura do Projeto

```
hospitalar_backend/
├── app/
│   └── Services/
│       └── IA/
│           ├── IAOrcamentoService.php      # Existente
│           ├── LLMRouter.php               # NOVO - Router de fallback
│           ├── Providers/
│           │   ├── OllamaProvider.php      # NOVO
│           │   ├── JanProvider.php         # NOVO
│           │   ├── LMStudioProvider.php    # NOVO
│           │   ├── GPT4AllProvider.php     # NOVO
│           │   ├── HuggingFaceProvider.php # NOVO
│           │   └── OpenAIProvider.php      # NOVO
│           └── CircuitBreaker.php          # NOVO - Proteção
```

### 3.2 Código do LLMRouter (PHP)

```php
<?php

namespace App\Services\IA;

use App\Services\IA\Providers\OllamaProvider;
use App\Services\IA\Providers\JanProvider;
use App\Services\IA\Providers\LMStudioProvider;
use App\Services\IA\Providers\OpenAIProvider;
use App\Services\IA\Providers\HuggingFaceProvider;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Cache;

/**
 * Router de LLM com Fallback Automático
 * 
 * OBJETIVO: O sistema JAMAIS pode parar
 * 
 * Ordem de prioridade:
 * 1. Ollama (local, gratuito)
 * 2. Jan (local, gratuito, especializado em medicina)
 * 3. LM Studio (local, gratuito)
 * 4. HuggingFace (cloud, gratuito limitado)
 * 5. OpenAI (cloud, pago - último recurso)
 */
class LLMRouter
{
    private array $providers = [];
    private array $circuitBreakers = [];
    
    public function __construct()
    {
        // Inicializar provedores na ordem de prioridade
        $this->providers = [
            'ollama' => new OllamaProvider(),
            'jan' => new JanProvider(),
            'lmstudio' => new LMStudioProvider(),
            'huggingface' => new HuggingFaceProvider(),
            'openai' => new OpenAIProvider(),
        ];
        
        // Inicializar circuit breakers
        foreach (array_keys($this->providers) as $name) {
            $this->circuitBreakers[$name] = [
                'failures' => 0,
                'last_failure' => null,
                'is_open' => false,
            ];
        }
    }
    
    /**
     * Enviar prompt com fallback automático
     */
    public function generate(string $prompt, array $options = []): array
    {
        $taskType = $options['task_type'] ?? 'general';
        $maxRetries = $options['max_retries'] ?? 3;
        $lastError = null;
        
        // Selecionar provedores baseado no tipo de tarefa
        $providerOrder = $this->getProviderOrder($taskType);
        
        foreach ($providerOrder as $providerName) {
            // Verificar circuit breaker
            if ($this->isCircuitOpen($providerName)) {
                Log::info("LLMRouter: Circuit breaker aberto para {$providerName}, pulando...");
                continue;
            }
            
            try {
                $provider = $this->providers[$providerName];
                
                Log::info("LLMRouter: Tentando {$providerName}...");
                
                $result = $provider->generate($prompt, $options);
                
                if ($result['success']) {
                    // Resetar circuit breaker em caso de sucesso
                    $this->resetCircuitBreaker($providerName);
                    
                    return [
                        'success' => true,
                        'content' => $result['content'],
                        'provider' => $providerName,
                        'model' => $result['model'] ?? 'unknown',
                        'fallback_used' => $providerName !== $providerOrder[0],
                        'latency' => $result['latency'] ?? 0,
                    ];
                }
                
                throw new \Exception($result['error'] ?? 'Resposta inválida');
                
            } catch (\Exception $e) {
                $lastError = $e->getMessage();
                Log::warning("LLMRouter: Falha em {$providerName}: {$lastError}");
                
                // Registrar falha no circuit breaker
                $this->recordFailure($providerName);
            }
        }
        
        // Se todos falharam
        Log::error("LLMRouter: TODOS os provedores falharam!");
        
        return [
            'success' => false,
            'content' => null,
            'error' => "Todos os provedores de IA falharam. Último erro: {$lastError}",
            'fallback_used' => true,
        ];
    }
    
    /**
     * Obter ordem de provedores baseado no tipo de tarefa
     */
    private function getProviderOrder(string $taskType): array
    {
        switch ($taskType) {
            case 'medical':
            case 'clinical':
                // Para tarefas médicas, priorizar modelos especializados
                return ['jan', 'lmstudio', 'ollama', 'huggingface', 'openai'];
                
            case 'code':
            case 'programming':
                // Para código, priorizar DeepSeek
                return ['ollama', 'lmstudio', 'jan', 'huggingface', 'openai'];
                
            case 'analysis':
            case 'budget':
                // Para análise de orçamentos
                return ['ollama', 'jan', 'lmstudio', 'openai', 'huggingface'];
                
            default:
                // Ordem padrão
                return ['ollama', 'jan', 'lmstudio', 'huggingface', 'openai'];
        }
    }
    
    /**
     * Verificar se circuit breaker está aberto
     */
    private function isCircuitOpen(string $provider): bool
    {
        $cb = $this->circuitBreakers[$provider];
        
        if (!$cb['is_open']) {
            return false;
        }
        
        // Verificar se já passou tempo suficiente para tentar novamente (30 segundos)
        if ($cb['last_failure'] && (time() - $cb['last_failure']) > 30) {
            $this->circuitBreakers[$provider]['is_open'] = false;
            $this->circuitBreakers[$provider]['failures'] = 0;
            return false;
        }
        
        return true;
    }
    
    /**
     * Registrar falha no circuit breaker
     */
    private function recordFailure(string $provider): void
    {
        $this->circuitBreakers[$provider]['failures']++;
        $this->circuitBreakers[$provider]['last_failure'] = time();
        
        // Abrir circuit breaker após 3 falhas consecutivas
        if ($this->circuitBreakers[$provider]['failures'] >= 3) {
            $this->circuitBreakers[$provider]['is_open'] = true;
            Log::warning("LLMRouter: Circuit breaker ABERTO para {$provider}");
        }
    }
    
    /**
     * Resetar circuit breaker
     */
    private function resetCircuitBreaker(string $provider): void
    {
        $this->circuitBreakers[$provider] = [
            'failures' => 0,
            'last_failure' => null,
            'is_open' => false,
        ];
    }
    
    /**
     * Health check de todos os provedores
     */
    public function healthCheck(): array
    {
        $status = [];
        
        foreach ($this->providers as $name => $provider) {
            try {
                $isHealthy = $provider->isHealthy();
                $status[$name] = [
                    'status' => $isHealthy ? 'online' : 'offline',
                    'circuit_breaker' => $this->circuitBreakers[$name]['is_open'] ? 'open' : 'closed',
                    'failures' => $this->circuitBreakers[$name]['failures'],
                ];
            } catch (\Exception $e) {
                $status[$name] = [
                    'status' => 'error',
                    'error' => $e->getMessage(),
                ];
            }
        }
        
        return $status;
    }
}
```

### 3.3 Provider Base (Interface)

```php
<?php

namespace App\Services\IA\Providers;

interface LLMProviderInterface
{
    public function generate(string $prompt, array $options = []): array;
    public function isHealthy(): bool;
    public function getName(): string;
    public function getModels(): array;
}
```

### 3.4 Ollama Provider

```php
<?php

namespace App\Services\IA\Providers;

use Illuminate\Support\Facades\Http;

class OllamaProvider implements LLMProviderInterface
{
    private string $baseUrl;
    private string $defaultModel;
    
    public function __construct()
    {
        $this->baseUrl = env('OLLAMA_URL', 'http://localhost:11434');
        $this->defaultModel = env('OLLAMA_MODEL', 'llama3.2');
    }
    
    public function generate(string $prompt, array $options = []): array
    {
        $model = $options['model'] ?? $this->defaultModel;
        $startTime = microtime(true);
        
        $response = Http::timeout(60)->post("{$this->baseUrl}/api/generate", [
            'model' => $model,
            'prompt' => $prompt,
            'system' => $options['system_prompt'] ?? '',
            'stream' => false,
        ]);
        
        $latency = (microtime(true) - $startTime) * 1000;
        
        if ($response->successful()) {
            $data = $response->json();
            return [
                'success' => true,
                'content' => $data['response'] ?? '',
                'model' => $model,
                'latency' => $latency,
            ];
        }
        
        return [
            'success' => false,
            'error' => 'Ollama request failed: ' . $response->status(),
        ];
    }
    
    public function isHealthy(): bool
    {
        try {
            $response = Http::timeout(5)->get("{$this->baseUrl}/api/tags");
            return $response->successful();
        } catch (\Exception $e) {
            return false;
        }
    }
    
    public function getName(): string
    {
        return 'ollama';
    }
    
    public function getModels(): array
    {
        try {
            $response = Http::timeout(5)->get("{$this->baseUrl}/api/tags");
            if ($response->successful()) {
                $data = $response->json();
                return array_column($data['models'] ?? [], 'name');
            }
        } catch (\Exception $e) {}
        
        return [];
    }
}
```

### 3.5 Jan Provider

```php
<?php

namespace App\Services\IA\Providers;

use Illuminate\Support\Facades\Http;

class JanProvider implements LLMProviderInterface
{
    private string $baseUrl;
    private string $defaultModel;
    
    public function __construct()
    {
        $this->baseUrl = env('JAN_URL', 'http://localhost:4891');
        $this->defaultModel = env('JAN_MODEL', 'Jan-v2-VL-med-Q4_K_M');
    }
    
    public function generate(string $prompt, array $options = []): array
    {
        $model = $options['model'] ?? $this->defaultModel;
        $startTime = microtime(true);
        
        // Jan usa API compatível com OpenAI
        $response = Http::timeout(60)->post("{$this->baseUrl}/v1/chat/completions", [
            'model' => $model,
            'messages' => [
                ['role' => 'system', 'content' => $options['system_prompt'] ?? 'Você é um assistente médico especializado.'],
                ['role' => 'user', 'content' => $prompt],
            ],
            'temperature' => $options['temperature'] ?? 0.7,
            'max_tokens' => $options['max_tokens'] ?? 2048,
        ]);
        
        $latency = (microtime(true) - $startTime) * 1000;
        
        if ($response->successful()) {
            $data = $response->json();
            return [
                'success' => true,
                'content' => $data['choices'][0]['message']['content'] ?? '',
                'model' => $model,
                'latency' => $latency,
            ];
        }
        
        return [
            'success' => false,
            'error' => 'Jan request failed: ' . $response->status(),
        ];
    }
    
    public function isHealthy(): bool
    {
        try {
            $response = Http::timeout(5)->get("{$this->baseUrl}/v1/models");
            return $response->successful() || $response->status() === 401; // 401 = server running but needs auth
        } catch (\Exception $e) {
            return false;
        }
    }
    
    public function getName(): string
    {
        return 'jan';
    }
    
    public function getModels(): array
    {
        return ['Jan-v2-VL-med-Q4_K_M'];
    }
}
```

### 3.6 OpenAI Provider (Fallback Externo)

```php
<?php

namespace App\Services\IA\Providers;

use Illuminate\Support\Facades\Http;

class OpenAIProvider implements LLMProviderInterface
{
    private string $apiKey;
    private string $baseUrl;
    private string $defaultModel;
    
    public function __construct()
    {
        $this->apiKey = env('OPENAI_API_KEY', '');
        $this->baseUrl = env('OPENAI_BASE_URL', 'https://api.openai.com/v1');
        $this->defaultModel = 'gpt-4.1-mini';
    }
    
    public function generate(string $prompt, array $options = []): array
    {
        if (empty($this->apiKey)) {
            return [
                'success' => false,
                'error' => 'OpenAI API key not configured',
            ];
        }
        
        $model = $options['model'] ?? $this->defaultModel;
        $startTime = microtime(true);
        
        $response = Http::timeout(60)
            ->withHeaders([
                'Authorization' => "Bearer {$this->apiKey}",
                'Content-Type' => 'application/json',
            ])
            ->post("{$this->baseUrl}/chat/completions", [
                'model' => $model,
                'messages' => [
                    ['role' => 'system', 'content' => $options['system_prompt'] ?? 'Você é um assistente especializado em gestão hospitalar.'],
                    ['role' => 'user', 'content' => $prompt],
                ],
                'temperature' => $options['temperature'] ?? 0.7,
                'max_tokens' => $options['max_tokens'] ?? 2048,
            ]);
        
        $latency = (microtime(true) - $startTime) * 1000;
        
        if ($response->successful()) {
            $data = $response->json();
            return [
                'success' => true,
                'content' => $data['choices'][0]['message']['content'] ?? '',
                'model' => $model,
                'latency' => $latency,
            ];
        }
        
        return [
            'success' => false,
            'error' => 'OpenAI request failed: ' . $response->status(),
        ];
    }
    
    public function isHealthy(): bool
    {
        return !empty($this->apiKey);
    }
    
    public function getName(): string
    {
        return 'openai';
    }
    
    public function getModels(): array
    {
        return ['gpt-4.1-mini', 'gpt-4.1-nano', 'gemini-2.5-flash'];
    }
}
```

### 3.7 HuggingFace Provider

```php
<?php

namespace App\Services\IA\Providers;

use Illuminate\Support\Facades\Http;

class HuggingFaceProvider implements LLMProviderInterface
{
    private string $apiKey;
    private string $defaultModel;
    
    public function __construct()
    {
        $this->apiKey = env('HUGGINGFACE_API_KEY', '[HUGGINGFACE_API_KEY]');
        $this->defaultModel = 'mistralai/Mistral-7B-Instruct-v0.2';
    }
    
    public function generate(string $prompt, array $options = []): array
    {
        $model = $options['model'] ?? $this->defaultModel;
        $startTime = microtime(true);
        
        $response = Http::timeout(60)
            ->withHeaders([
                'Authorization' => "Bearer {$this->apiKey}",
                'Content-Type' => 'application/json',
            ])
            ->post("https://api-inference.huggingface.co/models/{$model}", [
                'inputs' => $prompt,
                'parameters' => [
                    'max_new_tokens' => $options['max_tokens'] ?? 1024,
                    'temperature' => $options['temperature'] ?? 0.7,
                ],
            ]);
        
        $latency = (microtime(true) - $startTime) * 1000;
        
        if ($response->successful()) {
            $data = $response->json();
            $content = is_array($data) && isset($data[0]['generated_text']) 
                ? $data[0]['generated_text'] 
                : (is_string($data) ? $data : json_encode($data));
                
            return [
                'success' => true,
                'content' => $content,
                'model' => $model,
                'latency' => $latency,
            ];
        }
        
        return [
            'success' => false,
            'error' => 'HuggingFace request failed: ' . $response->status(),
        ];
    }
    
    public function isHealthy(): bool
    {
        return !empty($this->apiKey);
    }
    
    public function getName(): string
    {
        return 'huggingface';
    }
    
    public function getModels(): array
    {
        return [
            'mistralai/Mistral-7B-Instruct-v0.2',
            'meta-llama/Llama-2-7b-chat-hf',
        ];
    }
}
```

---

## 4. Integração com IAOrcamentoService

### 4.1 Atualização do IAOrcamentoService

```php
<?php

// No construtor, adicionar:
private LLMRouter $llmRouter;

public function __construct()
{
    $this->llmRouter = new LLMRouter();
    // ... resto do código
}

// Substituir callOllama por:
private function callLLM(string $prompt, string $systemPrompt = '', string $taskType = 'general'): array
{
    return $this->llmRouter->generate($prompt, [
        'system_prompt' => $systemPrompt,
        'task_type' => $taskType,
    ]);
}
```

---

## 5. Variáveis de Ambiente Necessárias

```env
# Provedores Locais
OLLAMA_URL=http://localhost:11434
OLLAMA_MODEL=llama3.2
JAN_URL=http://localhost:4891
JAN_MODEL=Jan-v2-VL-med-Q4_K_M
LMSTUDIO_URL=http://localhost:1234
LMSTUDIO_MODEL=biomistral-7b

# Provedores Externos (Fallback)
OPENAI_API_KEY=sk-...
HUGGINGFACE_API_KEY=[HUGGINGFACE_API_KEY]

# Configurações de Fallback
LLM_MAX_RETRIES=3
LLM_CIRCUIT_BREAKER_THRESHOLD=3
LLM_CIRCUIT_BREAKER_TIMEOUT=30
```

---

## 6. Monitoramento e Alertas

### 6.1 Endpoint de Health Check

```php
// Adicionar ao IAOrcamentoController
public function llmHealth()
{
    $router = new LLMRouter();
    $status = $router->healthCheck();
    
    $allOnline = collect($status)->every(fn($s) => $s['status'] === 'online');
    $anyOnline = collect($status)->contains(fn($s) => $s['status'] === 'online');
    
    return response()->json([
        'overall_status' => $allOnline ? 'healthy' : ($anyOnline ? 'degraded' : 'critical'),
        'providers' => $status,
        'timestamp' => now()->toIso8601String(),
    ]);
}
```

---

## 7. Resumo da Redundância

| Cenário | Comportamento |
|---------|---------------|
| Ollama online | ✅ Usa Ollama (gratuito, rápido) |
| Ollama offline, Jan online | ✅ Fallback para Jan (gratuito, médico) |
| Ollama + Jan offline | ✅ Fallback para LM Studio (gratuito) |
| Todos locais offline | ✅ Fallback para HuggingFace (gratuito) |
| Todos gratuitos offline | ✅ Fallback para OpenAI (pago) |
| Todos offline | ❌ Retorna erro (improvável) |

**Probabilidade de parada total**: Praticamente zero, pois seria necessário:
1. Ollama falhar E
2. Jan falhar E
3. LM Studio falhar E
4. HuggingFace falhar E
5. OpenAI falhar

---

## 8. Próximos Passos

1. [ ] Criar arquivos PHP dos providers
2. [ ] Instalar no Laravel via COMET Bridge
3. [ ] Configurar variáveis de ambiente
4. [ ] Testar fallback com cada provedor
5. [ ] Implementar monitoramento contínuo
