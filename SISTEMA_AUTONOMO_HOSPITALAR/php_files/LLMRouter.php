<?php

namespace App\Services\IA;

use App\Services\IA\Providers\OllamaProvider;
use App\Services\IA\Providers\JanProvider;
use App\Services\IA\Providers\OpenAIProvider;
use App\Services\IA\Providers\HuggingFaceProvider;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;

class LLMRouter
{
    private array $providers = [];
    private array $providerOrder = ['ollama', 'jan', 'openai', 'huggingface'];
    private int $circuitBreakerThreshold = 3;
    private int $circuitBreakerTimeout = 300;

    public function __construct()
    {
        $this->providers = [
            'ollama' => new OllamaProvider(),
            'jan' => new JanProvider(),
            'openai' => new OpenAIProvider(),
            'huggingface' => new HuggingFaceProvider(),
        ];
    }

    public function generate(string $prompt, array $options = []): array
    {
        $errors = [];
        foreach ($this->providerOrder as $providerName) {
            if ($this->isCircuitOpen($providerName)) continue;
            $result = $this->tryProvider($providerName, $prompt, $options);
            if ($result['success']) {
                $result['provider'] = $providerName;
                return $result;
            }
            $errors[] = "{$providerName}: " . ($result['error'] ?? 'Error');
        }
        return ['success' => false, 'error' => 'All providers failed', 'details' => $errors];
    }

    private function tryProvider(string $name, string $prompt, array $options): array
    {
        try {
            $result = $this->providers[$name]->generate($prompt, $options);
            $result['success'] ? $this->resetCircuit($name) : $this->recordFailure($name);
            return $result;
        } catch (\Exception $e) {
            $this->recordFailure($name);
            return ['success' => false, 'error' => $e->getMessage()];
        }
    }

    private function isCircuitOpen(string $p): bool { return Cache::get("llm_cb_{$p}", 0) >= $this->circuitBreakerThreshold; }
    private function recordFailure(string $p): void { Cache::put("llm_cb_{$p}", Cache::get("llm_cb_{$p}", 0) + 1, $this->circuitBreakerTimeout); }
    private function resetCircuit(string $p): void { Cache::forget("llm_cb_{$p}"); }

    public function getHealthStatus(): array
    {
        $status = [];
        foreach ($this->providers as $name => $provider) {
            $status[$name] = ['healthy' => $provider->isHealthy(), 'circuit_open' => $this->isCircuitOpen($name)];
        }
        return $status;
    }
}
