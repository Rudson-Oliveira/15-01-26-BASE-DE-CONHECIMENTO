<?php

namespace App\Services\IA;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Facades\Log;
use App\Services\IA\Providers\OllamaProvider;
use App\Services\IA\Providers\JanProvider;
use App\Services\IA\Providers\DeepSeekProvider;
use App\Services\IA\Providers\GrokProvider;
use App\Services\IA\Providers\OpenAIProvider;
use App\Services\IA\Providers\HuggingFaceProvider;

class LLMRouter
{
    private array $localProviders = [];
    private array $apiProviders = [];
    private array $circuitBreakers = [];
    private int $failureThreshold = 3;
    private int $recoveryTime = 300;

    public function __construct()
    {
        $this->initializeProviders();
    }

    private function initializeProviders(): void
    {
        // Provedores locais (sempre disponíveis, custo zero)
        $this->localProviders = [
            'ollama' => new OllamaProvider(),
            'jan' => new JanProvider()
        ];

        // Provedores de API (carregados do banco de dados)
        $this->loadApiProvidersFromDatabase();
    }

    private function loadApiProvidersFromDatabase(): void
    {
        try {
            $configs = Cache::remember('api_configs', 300, function () {
                return DB::table('api_configs')
                    ->where('is_active', true)
                    ->whereNotNull('api_key')
                    ->get();
            });

            foreach ($configs as $config) {
                $apiKey = $this->decryptApiKey($config->api_key);
                if (!$apiKey) continue;

                switch ($config->provider) {
                    case 'deepseek':
                        $this->apiProviders['deepseek'] = new DeepSeekProvider($apiKey);
                        break;
                    case 'grok':
                        $this->apiProviders['grok'] = new GrokProvider($apiKey);
                        break;
                    case 'openai':
                        $this->apiProviders['openai'] = new OpenAIProvider($apiKey);
                        break;
                    case 'huggingface':
                        $this->apiProviders['huggingface'] = new HuggingFaceProvider($apiKey);
                        break;
                }
            }
        } catch (\Exception $e) {
            Log::warning('Erro ao carregar provedores de API do banco: ' . $e->getMessage());
            // Fallback para variáveis de ambiente
            $this->loadApiProvidersFromEnv();
        }
    }

    private function loadApiProvidersFromEnv(): void
    {
        if ($key = env('DEEPSEEK_API_KEY')) {
            $this->apiProviders['deepseek'] = new DeepSeekProvider($key);
        }
        if ($key = env('GROK_API_KEY')) {
            $this->apiProviders['grok'] = new GrokProvider($key);
        }
        if ($key = env('OPENAI_API_KEY')) {
            $this->apiProviders['openai'] = new OpenAIProvider($key);
        }
        if ($key = env('HUGGINGFACE_API_KEY')) {
            $this->apiProviders['huggingface'] = new HuggingFaceProvider($key);
        }
    }

    private function decryptApiKey(string $encryptedKey): ?string
    {
        try {
            return Crypt::decryptString($encryptedKey);
        } catch (\Exception $e) {
            return null;
        }
    }

    public function generate(string $prompt, array $options = []): array
    {
        // Tentar provedores locais primeiro (custo zero)
        foreach ($this->localProviders as $name => $provider) {
            if ($this->isCircuitOpen($name)) {
                Log::debug("LLMRouter: Circuit breaker aberto para $name, pulando...");
                continue;
            }

            try {
                $result = $provider->generate($prompt, $options);
                if ($result['success']) {
                    $this->recordSuccess($name);
                    return array_merge($result, [
                        'provider' => $name,
                        'tier' => 'local'
                    ]);
                }
            } catch (\Exception $e) {
                $this->recordFailure($name);
                Log::warning("LLMRouter: Falha no provedor local $name: " . $e->getMessage());
            }
        }

        // Tentar provedores de API (fallback pago)
        foreach ($this->apiProviders as $name => $provider) {
            if ($this->isCircuitOpen($name)) {
                Log::debug("LLMRouter: Circuit breaker aberto para $name, pulando...");
                continue;
            }

            try {
                $result = $provider->generate($prompt, $options);
                if ($result['success']) {
                    $this->recordSuccess($name);
                    return array_merge($result, [
                        'provider' => $name,
                        'tier' => 'api'
                    ]);
                }
            } catch (\Exception $e) {
                $this->recordFailure($name);
                Log::warning("LLMRouter: Falha no provedor API $name: " . $e->getMessage());
            }
        }

        return [
            'success' => false,
            'error' => 'Todos os provedores de LLM falharam',
            'provider' => null,
            'tier' => null
        ];
    }

    private function isCircuitOpen(string $provider): bool
    {
        $key = "circuit_breaker:$provider";
        $state = Cache::get($key);

        if (!$state) return false;

        if ($state['failures'] >= $this->failureThreshold) {
            if (time() - $state['last_failure'] > $this->recoveryTime) {
                Cache::forget($key);
                return false;
            }
            return true;
        }

        return false;
    }

    private function recordSuccess(string $provider): void
    {
        Cache::forget("circuit_breaker:$provider");
    }

    private function recordFailure(string $provider): void
    {
        $key = "circuit_breaker:$provider";
        $state = Cache::get($key, ['failures' => 0, 'last_failure' => 0]);
        $state['failures']++;
        $state['last_failure'] = time();
        Cache::put($key, $state, $this->recoveryTime * 2);
    }

    public function getStatus(): array
    {
        $status = [
            'local' => [],
            'api' => []
        ];

        foreach ($this->localProviders as $name => $provider) {
            $status['local'][$name] = [
                'available' => $provider->isAvailable(),
                'circuit_open' => $this->isCircuitOpen($name)
            ];
        }

        foreach ($this->apiProviders as $name => $provider) {
            $status['api'][$name] = [
                'configured' => true,
                'circuit_open' => $this->isCircuitOpen($name)
            ];
        }

        return $status;
    }

    public function refreshProviders(): void
    {
        Cache::forget('api_configs');
        $this->apiProviders = [];
        $this->loadApiProvidersFromDatabase();
    }
}
