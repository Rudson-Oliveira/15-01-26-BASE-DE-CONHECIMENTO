<?php

namespace App\Services\IA\Providers;

class DeepSeekProvider implements LLMProviderInterface
{
    private string $apiKey;
    private string $baseUrl = 'https://api.deepseek.com/v1';
    private string $model = 'deepseek-chat';

    public function __construct()
    {
        $this->apiKey = env('DEEPSEEK_API_KEY', '');
    }

    public function getName(): string
    {
        return 'deepseek';
    }

    public function isAvailable(): bool
    {
        return !empty($this->apiKey);
    }

    public function generate(string $prompt, array $options = []): array
    {
        if (!$this->isAvailable()) {
            return [
                'success' => false,
                'error' => 'DeepSeek API key not configured'
            ];
        }

        try {
            $systemPrompt = $options['system_prompt'] ?? 'Voce e um assistente medico especializado em home care.';
            $model = $options['model'] ?? $this->model;

            $payload = [
                'model' => $model,
                'messages' => [
                    ['role' => 'system', 'content' => $systemPrompt],
                    ['role' => 'user', 'content' => $prompt]
                ],
                'max_tokens' => $options['max_tokens'] ?? 2048,
                'temperature' => $options['temperature'] ?? 0.7
            ];

            $ch = curl_init($this->baseUrl . '/chat/completions');
            curl_setopt_array($ch, [
                CURLOPT_RETURNTRANSFER => true,
                CURLOPT_POST => true,
                CURLOPT_HTTPHEADER => [
                    'Content-Type: application/json',
                    'Authorization: Bearer ' . $this->apiKey
                ],
                CURLOPT_POSTFIELDS => json_encode($payload),
                CURLOPT_TIMEOUT => 60
            ]);

            $response = curl_exec($ch);
            $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
            curl_close($ch);

            if ($httpCode !== 200) {
                return [
                    'success' => false,
                    'error' => "DeepSeek API error: HTTP $httpCode"
                ];
            }

            $data = json_decode($response, true);
            $content = $data['choices'][0]['message']['content'] ?? '';

            return [
                'success' => true,
                'content' => $content,
                'provider' => $this->getName(),
                'model' => $model,
                'usage' => $data['usage'] ?? []
            ];

        } catch (\Exception $e) {
            return [
                'success' => false,
                'error' => $e->getMessage()
            ];
        }
    }

    public function getModels(): array
    {
        return [
            'deepseek-chat',
            'deepseek-coder',
            'deepseek-reasoner'
        ];
    }
}
