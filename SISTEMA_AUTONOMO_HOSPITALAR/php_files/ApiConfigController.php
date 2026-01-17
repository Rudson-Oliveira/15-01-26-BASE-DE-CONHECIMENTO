<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Facades\Log;

class ApiConfigController extends Controller
{
    private array $providers = [
        'deepseek' => [
            'name' => 'DeepSeek',
            'description' => 'IA chinesa de alta performance',
            'icon' => 'brain',
            'docs_url' => 'https://platform.deepseek.com/docs'
        ],
        'grok' => [
            'name' => 'Grok (xAI)',
            'description' => 'IA da xAI (Elon Musk)',
            'icon' => 'robot',
            'docs_url' => 'https://docs.x.ai'
        ],
        'claude' => [
            'name' => 'Claude (Anthropic)',
            'description' => 'IA segura e confiavel',
            'icon' => 'shield',
            'docs_url' => 'https://docs.anthropic.com'
        ],
        'llama' => [
            'name' => 'Llama (Meta)',
            'description' => 'IA open-source da Meta',
            'icon' => 'code',
            'docs_url' => 'https://llama.meta.com'
        ],
        'openai' => [
            'name' => 'GPT (OpenAI)',
            'description' => 'ChatGPT e GPT-4',
            'icon' => 'sparkles',
            'docs_url' => 'https://platform.openai.com/docs'
        ],
        'abacus' => [
            'name' => 'Abacus.AI',
            'description' => 'Plataforma de IA empresarial',
            'icon' => 'calculator',
            'docs_url' => 'https://abacus.ai/docs'
        ],
        'gemini' => [
            'name' => 'Gemini (Google)',
            'description' => 'IA multimodal do Google',
            'icon' => 'gem',
            'docs_url' => 'https://ai.google.dev/docs'
        ],
        'huggingface' => [
            'name' => 'HuggingFace',
            'description' => 'Hub de modelos open-source',
            'icon' => 'face-smile',
            'docs_url' => 'https://huggingface.co/docs'
        ]
    ];

    public function index()
    {
        try {
            $configs = DB::table('api_configs')->get()->keyBy('provider');
            
            $result = [];
            foreach ($this->providers as $key => $provider) {
                $config = $configs->get($key);
                $result[] = [
                    'provider' => $key,
                    'name' => $provider['name'],
                    'description' => $provider['description'],
                    'icon' => $provider['icon'],
                    'docs_url' => $provider['docs_url'],
                    'api_key' => $config ? $this->maskApiKey($config->api_key) : '',
                    'is_configured' => $config && !empty($config->api_key),
                    'is_active' => $config ? (bool)$config->is_active : false,
                    'last_tested' => $config->last_tested ?? null,
                    'last_test_status' => $config->last_test_status ?? null
                ];
            }

            return response()->json([
                'success' => true,
                'data' => $result
            ]);
        } catch (\Exception $e) {
            Log::error('Erro ao listar configs de API: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'error' => 'Erro ao carregar configuracoes'
            ], 500);
        }
    }

    public function update(Request $request, string $provider)
    {
        if (!array_key_exists($provider, $this->providers)) {
            return response()->json([
                'success' => false,
                'error' => 'Provedor invalido'
            ], 400);
        }

        $request->validate([
            'api_key' => 'required|string|min:10',
            'is_active' => 'boolean'
        ]);

        try {
            $encryptedKey = Crypt::encryptString($request->api_key);

            DB::table('api_configs')->updateOrInsert(
                ['provider' => $provider],
                [
                    'api_key' => $encryptedKey,
                    'is_active' => $request->is_active ?? true,
                    'updated_at' => now()
                ]
            );

            // Atualizar .env tambem para compatibilidade
            $this->updateEnvFile($provider, $request->api_key);

            Log::info("API key atualizada para: $provider");

            return response()->json([
                'success' => true,
                'message' => 'Configuracao salva com sucesso'
            ]);
        } catch (\Exception $e) {
            Log::error("Erro ao salvar config de API ($provider): " . $e->getMessage());
            return response()->json([
                'success' => false,
                'error' => 'Erro ao salvar configuracao'
            ], 500);
        }
    }

    public function test(string $provider)
    {
        if (!array_key_exists($provider, $this->providers)) {
            return response()->json([
                'success' => false,
                'error' => 'Provedor invalido'
            ], 400);
        }

        try {
            $config = DB::table('api_configs')->where('provider', $provider)->first();
            
            if (!$config || empty($config->api_key)) {
                return response()->json([
                    'success' => false,
                    'error' => 'API key nao configurada'
                ], 400);
            }

            $apiKey = Crypt::decryptString($config->api_key);
            $testResult = $this->testProvider($provider, $apiKey);

            // Salvar resultado do teste
            DB::table('api_configs')
                ->where('provider', $provider)
                ->update([
                    'last_tested' => now(),
                    'last_test_status' => $testResult['success'] ? 'success' : 'failed'
                ]);

            return response()->json($testResult);
        } catch (\Exception $e) {
            Log::error("Erro ao testar API ($provider): " . $e->getMessage());
            return response()->json([
                'success' => false,
                'error' => 'Erro ao testar conexao'
            ], 500);
        }
    }

    public function toggleActive(Request $request, string $provider)
    {
        try {
            DB::table('api_configs')
                ->where('provider', $provider)
                ->update(['is_active' => $request->is_active]);

            return response()->json([
                'success' => true,
                'message' => 'Status atualizado'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => 'Erro ao atualizar status'
            ], 500);
        }
    }

    private function maskApiKey(string $encryptedKey): string
    {
        try {
            $key = Crypt::decryptString($encryptedKey);
            if (strlen($key) > 8) {
                return substr($key, 0, 4) . '****' . substr($key, -4);
            }
            return '****';
        } catch (\Exception $e) {
            return '****';
        }
    }

    private function testProvider(string $provider, string $apiKey): array
    {
        $endpoints = [
            'openai' => 'https://api.openai.com/v1/models',
            'deepseek' => 'https://api.deepseek.com/v1/models',
            'grok' => 'https://api.x.ai/v1/models',
            'claude' => 'https://api.anthropic.com/v1/messages',
            'gemini' => 'https://generativelanguage.googleapis.com/v1/models',
            'huggingface' => 'https://huggingface.co/api/whoami-v2'
        ];

        $url = $endpoints[$provider] ?? null;
        if (!$url) {
            return ['success' => true, 'message' => 'Provedor nao suporta teste automatico'];
        }

        $ch = curl_init($url);
        curl_setopt_array($ch, [
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_HTTPHEADER => [
                'Authorization: Bearer ' . $apiKey,
                'Content-Type: application/json'
            ],
            CURLOPT_TIMEOUT => 10
        ]);

        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);

        if ($httpCode >= 200 && $httpCode < 300) {
            return ['success' => true, 'message' => 'Conexao bem sucedida'];
        } elseif ($httpCode == 401) {
            return ['success' => false, 'error' => 'API key invalida'];
        } else {
            return ['success' => false, 'error' => "Erro HTTP: $httpCode"];
        }
    }

    private function updateEnvFile(string $provider, string $apiKey): void
    {
        $envKeys = [
            'openai' => 'OPENAI_API_KEY',
            'deepseek' => 'DEEPSEEK_API_KEY',
            'grok' => 'GROK_API_KEY',
            'claude' => 'CLAUDE_API_KEY',
            'gemini' => 'GEMINI_API_KEY',
            'huggingface' => 'HUGGINGFACE_API_KEY',
            'abacus' => 'ABACUS_API_KEY',
            'llama' => 'LLAMA_API_KEY'
        ];

        $envKey = $envKeys[$provider] ?? null;
        if (!$envKey) return;

        $envPath = base_path('.env');
        $content = file_get_contents($envPath);

        if (strpos($content, $envKey) !== false) {
            $content = preg_replace("/^{$envKey}=.*/m", "{$envKey}={$apiKey}", $content);
        } else {
            $content .= "\n{$envKey}={$apiKey}";
        }

        file_put_contents($envPath, $content);
    }
}
