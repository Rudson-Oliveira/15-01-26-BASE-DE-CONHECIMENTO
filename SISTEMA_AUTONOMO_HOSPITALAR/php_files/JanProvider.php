<?php

namespace App\Services\IA\Providers;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

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

        try {
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

            return ['success' => false, 'error' => 'Jan request failed: ' . $response->status()];
        } catch (\Exception $e) {
            Log::warning('JanProvider error', ['error' => $e->getMessage()]);
            return ['success' => false, 'error' => $e->getMessage()];
        }
    }

    public function isHealthy(): bool
    {
        try {
            $response = Http::timeout(5)->get("{$this->baseUrl}/v1/models");
            return $response->successful() || $response->status() === 401;
        } catch (\Exception $e) {
            return false;
        }
    }

    public function getName(): string { return 'jan'; }
    public function getModels(): array { return ['Jan-v2-VL-med-Q4_K_M']; }
}
