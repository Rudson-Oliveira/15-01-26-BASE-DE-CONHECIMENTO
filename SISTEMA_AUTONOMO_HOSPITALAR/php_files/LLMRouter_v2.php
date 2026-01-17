<?php

namespace App\Services\IA;

use App\Services\IA\Providers\OllamaProvider;
use App\Services\IA\Providers\JanProvider;
use App\Services\IA\Providers\OpenAIProvider;
use App\Services\IA\Providers\HuggingFaceProvider;
use App\Services\IA\Providers\DeepSeekProvider;
use App\Services\IA\Providers\GrokProvider;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Cache;

class LLMRouter
{
    private array $localProviders = [];
    private array $apiProviders = [];
    private array $circuitBreaker = [];
    private int $failureThreshold = 3;
    private int $recoveryTime = 300;

    public function __construct()
    {
        // Provedores LOCAIS (custo zero, prioridade máxima)
        $this->localProviders = [
            'ollama' => new OllamaProvider(),
            'jan' => new JanProvider(),
        ];

        // Provedores API (custo, fallback)
        $this->apiProviders = [
            'deepseek' => new DeepSeekProvider(),
            'grok' => new GrokProvider(),
            'openai' => new OpenAIProvider(),
            'huggingface' => new HuggingFaceProvider(),
        ];

        $this->loadCircuitBreakerState();
    }

    public function generate(string $prompt, array $options = []): array
    {
        $startTime = microtime(true);
        $attempts = [];

        // FASE 1: Tentar provedores LOCAIS primeiro
        Log::info('[LLMRouter] Iniciando com provedores LOCAIS');
        foreach ($this->localProviders as $name => $provider) {
            if ($this->isCircuitOpen($name)) {
                $attempts[] = ['provider' => $name, 'status' => 'circuit_open'];
                Log::warning("[LLMRouter] Circuit breaker aberto para: $name");
                continue;
            }

            if (!$provider->isAvailable()) {
                $attempts[] = ['provider' => $name, 'status' => 'unavailable'];
                continue;
            }

            try {
                Log::info("[LLMRouter] Tentando provedor LOCAL: $name");
                $result = $provider->generate($prompt, $options);

                if ($result['success']) {
                    $this->recordSuccess($name);
                    $result['attempts'] = $attempts;
                    $result['latency_ms'] = round((microtime(true) - $startTime) * 1000);
                    $result['tier'] = 'local';
                    Log::info("[LLMRouter] Sucesso com provedor LOCAL: $name");
                    return $result;
                }

                $this->recordFailure($name);
                $attempts[] = ['provider' => $name, 'status' => 'failed', 'error' => $result['error'] ?? 'unknown'];

            } catch (\Exception $e) {
                $this->recordFailure($name);
                $attempts[] = ['provider' => $name, 'status' => 'exception', 'error' => $e->getMessage()];
                Log::error("[LLMRouter] Excecao em $name: " . $e->getMessage());
            }
        }

        // FASE 2: Tentar provedores API como fallback
        Log::info('[LLMRouter] Provedores locais falharam, tentando APIs externas');
        foreach ($this->apiProviders as $name => $provider) {
            if ($this->isCircuitOpen($name)) {
                $attempts[] = ['provider' => $name, 'status' => 'circuit_open'];
                continue;
            }

            if (!$provider->isAvailable()) {
                $attempts[] = ['provider' => $name, 'status' => 'unavailable'];
                continue;
            }

            try {
                Log::info("[LLMRouter] Tentando provedor API: $name");
                $result = $provider->generate($prompt, $options);

                if ($result['success']) {
                    $this->recordSuccess($name);
                    $result['attempts'] = $attempts;
                    $result['latency_ms'] = round((microtime(true) - $startTime) * 1000);
                    $result['tier'] = 'api';
                    Log::info("[LLMRouter] Sucesso com provedor API: $name");
                    return $result;
                }

                $this->recordFailure($name);
                $attempts[] = ['provider' => $name, 'status' => 'failed', 'error' => $result['error'] ?? 'unknown'];

            } catch (\Exception $e) {
                $this->recordFailure($name);
                $attempts[] = ['provider' => $name, 'status' => 'exception', 'error' => $e->getMessage()];
                Log::error("[LLMRouter] Excecao em $name: " . $e->getMessage());
            }
        }

        // Todos os provedores falharam
        Log::critical('[LLMRouter] TODOS os provedores falharam!');
        return [
            'success' => false,
            'error' => 'Todos os provedores de IA falharam',
            'attempts' => $attempts,
            'latency_ms' => round((microtime(true) - $startTime) * 1000)
        ];
    }

    public function getStatus(): array
    {
        $status = [
            'local' => [],
            'api' => [],
            'circuit_breaker' => $this->circuitBreaker
        ];

        foreach ($this->localProviders as $name => $provider) {
            $status['local'][$name] = [
                'available' => $provider->isAvailable(),
                'circuit_open' => $this->isCircuitOpen($name),
                'models' => $provider->getModels()
            ];
        }

        foreach ($this->apiProviders as $name => $provider) {
            $status['api'][$name] = [
                'available' => $provider->isAvailable(),
                'circuit_open' => $this->isCircuitOpen($name),
                'models' => $provider->getModels()
            ];
        }

        return $status;
    }

    private function isCircuitOpen(string $provider): bool
    {
        if (!isset($this->circuitBreaker[$provider])) {
            return false;
        }

        $state = $this->circuitBreaker[$provider];

        if ($state['failures'] >= $this->failureThreshold) {
            if (time() - $state['last_failure'] > $this->recoveryTime) {
                $this->circuitBreaker[$provider]['failures'] = 0;
                $this->saveCircuitBreakerState();
                return false;
            }
            return true;
        }

        return false;
    }

    private function recordFailure(string $provider): void
    {
        if (!isset($this->circuitBreaker[$provider])) {
            $this->circuitBreaker[$provider] = ['failures' => 0, 'successes' => 0, 'last_failure' => 0];
        }

        $this->circuitBreaker[$provider]['failures']++;
        $this->circuitBreaker[$provider]['last_failure'] = time();
        $this->saveCircuitBreakerState();
    }

    private function recordSuccess(string $provider): void
    {
        if (!isset($this->circuitBreaker[$provider])) {
            $this->circuitBreaker[$provider] = ['failures' => 0, 'successes' => 0, 'last_failure' => 0];
        }

        $this->circuitBreaker[$provider]['successes']++;
        $this->circuitBreaker[$provider]['failures'] = 0;
        $this->saveCircuitBreakerState();
    }

    private function loadCircuitBreakerState(): void
    {
        $this->circuitBreaker = Cache::get('llm_circuit_breaker', []);
    }

    private function saveCircuitBreakerState(): void
    {
        Cache::put('llm_circuit_breaker', $this->circuitBreaker, 3600);
    }
}
