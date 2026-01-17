<?php

namespace App\Services\IA\Providers;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

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

        try {
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

            return ['success' => false, 'error' => 'Ollama request failed: ' . $response->status()];
        } catch (\Exception $e) {
            Log::warning('OllamaProvider error', ['error' => $e->getMessage()]);
            return ['success' => false, 'error' => $e->getMessage()];
        }
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

    public function getName(): string { return 'ollama'; }
    public function getModels(): array { return ['llama3.2', 'deepseek-coder:6.7b', 'gemma3:4b', 'phi3']; }
}
