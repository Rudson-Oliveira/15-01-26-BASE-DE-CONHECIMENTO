<?php

namespace App\Services\IA\Providers;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class HuggingFaceProvider implements LLMProviderInterface
{
    private string $apiKey;
    private string $defaultModel;

    public function __construct()
    {
        $this->apiKey = env('HUGGINGFACE_API_KEY', '');
        $this->defaultModel = 'mistralai/Mistral-7B-Instruct-v0.2';
    }

    public function generate(string $prompt, array $options = []): array
    {
        if (empty($this->apiKey)) {
            return ['success' => false, 'error' => 'HuggingFace API key not configured'];
        }

        $model = $options['model'] ?? $this->defaultModel;
        $startTime = microtime(true);

        try {
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

            return ['success' => false, 'error' => 'HuggingFace request failed: ' . $response->status()];
        } catch (\Exception $e) {
            Log::warning('HuggingFaceProvider error', ['error' => $e->getMessage()]);
            return ['success' => false, 'error' => $e->getMessage()];
        }
    }

    public function isHealthy(): bool
    {
        return !empty($this->apiKey);
    }

    public function getName(): string { return 'huggingface'; }
    public function getModels(): array { return ['mistralai/Mistral-7B-Instruct-v0.2', 'meta-llama/Llama-2-7b-chat-hf']; }
}
