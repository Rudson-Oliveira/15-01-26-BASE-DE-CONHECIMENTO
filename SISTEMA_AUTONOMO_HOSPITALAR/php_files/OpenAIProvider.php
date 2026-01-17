<?php

namespace App\Services\IA\Providers;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

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
            return ['success' => false, 'error' => 'OpenAI API key not configured'];
        }

        $model = $options['model'] ?? $this->defaultModel;
        $startTime = microtime(true);

        try {
            $response = Http::timeout(60)
                ->withHeaders([
                    'Authorization' => "Bearer {$this->apiKey}",
                    'Content-Type' => 'application/json',
                ])
                ->post("{$this->baseUrl}/chat/completions", [
                    'model' => $model,
                    'messages' => [
                        ['role' => 'system', 'content' => $options['system_prompt'] ?? 'Voce e um assistente especializado em gestao hospitalar.'],
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

            return ['success' => false, 'error' => 'OpenAI request failed: ' . $response->status()];
        } catch (\Exception $e) {
            Log::warning('OpenAIProvider error', ['error' => $e->getMessage()]);
            return ['success' => false, 'error' => $e->getMessage()];
        }
    }

    public function isHealthy(): bool
    {
        return !empty($this->apiKey);
    }

    public function getName(): string { return 'openai'; }
    public function getModels(): array { return ['gpt-4.1-mini', 'gpt-4.1-nano', 'gemini-2.5-flash']; }
}
