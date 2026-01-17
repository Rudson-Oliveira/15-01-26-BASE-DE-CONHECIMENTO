<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Cache;

class ApiConfigController extends Controller
{
    private array $providers = [
        // === LLM / IA ===
        'deepseek' => [
            'name' => 'DeepSeek',
            'description' => 'IA chinesa de alta performance',
            'icon' => 'brain',
            'category' => 'llm',
            'docs_url' => 'https://platform.deepseek.com/docs'
        ],
        'grok' => [
            'name' => 'Grok (xAI)',
            'description' => 'IA da xAI (Elon Musk)',
            'icon' => 'robot',
            'category' => 'llm',
            'docs_url' => 'https://docs.x.ai'
        ],
        'claude' => [
            'name' => 'Claude (Anthropic)',
            'description' => 'IA segura e confiavel',
            'icon' => 'shield',
            'category' => 'llm',
            'docs_url' => 'https://docs.anthropic.com'
        ],
        'llama' => [
            'name' => 'Llama (Meta)',
            'description' => 'IA open-source da Meta',
            'icon' => 'code',
            'category' => 'llm',
            'docs_url' => 'https://llama.meta.com'
        ],
        'openai' => [
            'name' => 'GPT (OpenAI)',
            'description' => 'ChatGPT e GPT-4',
            'icon' => 'sparkles',
            'category' => 'llm',
            'docs_url' => 'https://platform.openai.com/docs'
        ],
        'abacus' => [
            'name' => 'Abacus.AI',
            'description' => 'Plataforma de IA empresarial',
            'icon' => 'calculator',
            'category' => 'llm',
            'docs_url' => 'https://abacus.ai/docs'
        ],
        'gemini' => [
            'name' => 'Gemini (Google)',
            'description' => 'IA multimodal do Google',
            'icon' => 'gem',
            'category' => 'llm',
            'docs_url' => 'https://ai.google.dev/docs'
        ],
        'huggingface' => [
            'name' => 'HuggingFace',
            'description' => 'Hub de modelos open-source',
            'icon' => 'face-smile',
            'category' => 'llm',
            'docs_url' => 'https://huggingface.co/docs'
        ],
        'together' => [
            'name' => 'Together AI',
            'description' => 'Cloud para modelos open-source',
            'icon' => 'users',
            'category' => 'llm',
            'docs_url' => 'https://api.together.xyz'
        ],
        
        // === AUTOMACAO RPA ===
        'uipath' => [
            'name' => 'UiPath',
            'description' => 'Automacao RPA empresarial',
            'icon' => 'cogs',
            'category' => 'rpa',
            'docs_url' => 'https://cloud.uipath.com/hospitalarsaude'
        ],
        
        // === AUTOMACAO NAVEGADOR ===
        'airtop' => [
            'name' => 'Airtop',
            'description' => 'Automacao de navegador com IA',
            'icon' => 'globe',
            'category' => 'browser',
            'docs_url' => 'https://portal.airtop.ai/agents'
        ],
        'playwright' => [
            'name' => 'Playwright',
            'description' => 'Automacao multi-browser',
            'icon' => 'theater-masks',
            'category' => 'browser',
            'docs_url' => 'https://playwright.dev'
        ],
        
        // === ACESSO REMOTO ===
        'getscreen' => [
            'name' => 'Getscreen',
            'description' => 'Acesso remoto ao desktop',
            'icon' => 'desktop',
            'category' => 'remote',
            'docs_url' => 'https://getscreen.me/pt/'
        ],
        'chrome_remote' => [
            'name' => 'Chrome Remote Desktop',
            'description' => 'Acesso remoto via Chrome',
            'icon' => 'chrome',
            'category' => 'remote',
            'docs_url' => 'https://remotedesktop.google.com/access/'
        ],
        
        // === INFRAESTRUTURA ===
        'ngrok' => [
            'name' => 'ngrok',
            'description' => 'Tunel para localhost',
            'icon' => 'network-wired',
            'category' => 'infra',
            'docs_url' => 'https://ngrok.com'
        ],
        'docker' => [
            'name' => 'Docker',
            'description' => 'Containers e orquestracao',
            'icon' => 'docker',
            'category' => 'infra',
            'docs_url' => 'https://www.docker.com'
        ],
        
        // === CODIGO ===
        'github' => [
            'name' => 'GitHub',
            'description' => 'Repositorio e CI/CD',
            'icon' => 'github',
            'category' => 'code',
            'docs_url' => 'https://github.com'
        ],
        'copilot' => [
            'name' => 'GitHub Copilot',
            'description' => 'IA para codigo',
            'icon' => 'magic',
            'category' => 'code',
            'docs_url' => 'https://github.com/features/copilot'
        ]
    ];

    // Status possíveis: active, standby, error, unconfigured
    private array $statusLabels = [
        'active' => 'Ativo',
        'standby' => 'Aguardando Conexao',
        'error' => 'Erro de Conexao',
        'unconfigured' => 'Nao Configurado'
    ];

    public function index()
    {
        try {
            $configs = DB::table('api_configs')->get()->keyBy('provider');
            
            $result = [];
            $categories = [];
            
            foreach ($this->providers as $key => $provider) {
                $config = $configs->get($key);
                $status = $this->determineStatus($config);
                
                $providerData = [
                    'provider' => $key,
                    'name' => $provider['name'],
                    'description' => $provider['description'],
                    'icon' => $provider['icon'],
                    'category' => $provider['category'],
                    'docs_url' => $provider['docs_url'],
                    'api_key' => $config ? $this->maskApiKey($config->api_key) : '',
                    'is_configured' => $config && !empty($config->api_key),
                    'is_active' => $config ? (bool)$config->is_active : false,
                    'status' => $status,
                    'status_label' => $this->statusLabels[$status],
                    'last_tested' => $config->last_tested ?? null,
                    'last_test_status' => $config->last_test_status ?? null,
                    'retry_count' => $config->retry_count ?? 0,
                    'next_retry' => $config->next_retry ?? null
                ];
                
                $result[] = $providerData;
                
                if (!isset($categories[$provider['category']])) {
                    $categories[$provider['category']] = [];
                }
                $categories[$provider['category']][] = $providerData;
            }

            return response()->json([
                'success' => true,
                'data' => $result,
                'by_category' => $categories,
                'categories' => [
                    'llm' => 'Inteligencia Artificial',
                    'rpa' => 'Automacao RPA',
                    'browser' => 'Automacao Navegador',
                    'remote' => 'Acesso Remoto',
                    'infra' => 'Infraestrutura',
                    'code' => 'Codigo e Versionamento'
                ]
            ]);
        } catch (\Exception $e) {
            Log::error('Erro ao listar configs de API: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'error' => 'Erro ao carregar configuracoes'
            ], 500);
        }
    }

    private function determineStatus($config): string
    {
        if (!$config || empty($config->api_key)) {
            return 'unconfigured';
        }
        
        if (!$config->is_active) {
            return 'standby';
        }
        
        if ($config->last_test_status === 'failed') {
            return 'error';
        }
        
        if ($config->last_test_status === 'success') {
            return 'active';
        }
        
        return 'standby';
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
            'api_key' => 'required|string|min:5',
            'is_active' => 'boolean'
        ]);

        try {
            $encryptedKey = Crypt::encryptString($request->api_key);

            DB::table('api_configs')->updateOrInsert(
                ['provider' => $provider],
                [
                    'api_key' => $encryptedKey,
                    'is_active' => $request->is_active ?? true,
                    'last_test_status' => 'standby',
                    'retry_count' => 0,
                    'updated_at' => now()
                ]
            );

            // Limpar cache para recarregar provedores
            Cache::forget('api_configs');

            // Atualizar .env para compatibilidade
            $this->updateEnvFile($provider, $request->api_key);

            Log::info("API key atualizada para: $provider (modo standby)");

            return response()->json([
                'success' => true,
                'message' => 'Configuracao salva. Aguardando conexao...',
                'status' => 'standby'
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
                    'error' => 'API key nao configurada',
                    'status' => 'unconfigured'
                ], 400);
            }

            $apiKey = Crypt::decryptString($config->api_key);
            $testResult = $this->testProvider($provider, $apiKey);

            // Atualizar status no banco
            $newStatus = $testResult['success'] ? 'success' : 'failed';
            $retryCount = $testResult['success'] ? 0 : ($config->retry_count ?? 0) + 1;
            $nextRetry = $testResult['success'] ? null : now()->addMinutes(5);

            DB::table('api_configs')
                ->where('provider', $provider)
                ->update([
                    'last_tested' => now(),
                    'last_test_status' => $newStatus,
                    'retry_count' => $retryCount,
                    'next_retry' => $nextRetry,
                    'is_active' => $testResult['success']
                ]);

            // Limpar cache
            Cache::forget('api_configs');

            return response()->json([
                'success' => $testResult['success'],
                'message' => $testResult['message'] ?? $testResult['error'] ?? '',
                'status' => $testResult['success'] ? 'active' : 'standby',
                'retry_count' => $retryCount,
                'next_retry' => $nextRetry
            ]);
        } catch (\Exception $e) {
            Log::error("Erro ao testar API ($provider): " . $e->getMessage());
            return response()->json([
                'success' => false,
                'error' => 'Erro ao testar conexao',
                'status' => 'error'
            ], 500);
        }
    }

    public function toggleActive(Request $request, string $provider)
    {
        try {
            DB::table('api_configs')
                ->where('provider', $provider)
                ->update([
                    'is_active' => $request->is_active,
                    'last_test_status' => $request->is_active ? 'standby' : null
                ]);

            Cache::forget('api_configs');

            return response()->json([
                'success' => true,
                'message' => $request->is_active ? 'Modo de espera ativado' : 'Desativado'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => 'Erro ao atualizar status'
            ], 500);
        }
    }

    public function retryAll()
    {
        try {
            $standbyConfigs = DB::table('api_configs')
                ->where('last_test_status', 'failed')
                ->where('next_retry', '<=', now())
                ->get();

            $results = [];
            foreach ($standbyConfigs as $config) {
                $apiKey = Crypt::decryptString($config->api_key);
                $testResult = $this->testProvider($config->provider, $apiKey);
                
                $results[$config->provider] = $testResult['success'];
                
                if ($testResult['success']) {
                    DB::table('api_configs')
                        ->where('provider', $config->provider)
                        ->update([
                            'last_tested' => now(),
                            'last_test_status' => 'success',
                            'is_active' => true,
                            'retry_count' => 0,
                            'next_retry' => null
                        ]);
                } else {
                    DB::table('api_configs')
                        ->where('provider', $config->provider)
                        ->update([
                            'last_tested' => now(),
                            'retry_count' => $config->retry_count + 1,
                            'next_retry' => now()->addMinutes(5)
                        ]);
                }
            }

            Cache::forget('api_configs');

            return response()->json([
                'success' => true,
                'results' => $results
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => 'Erro ao tentar reconectar'
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
            'huggingface' => 'https://huggingface.co/api/whoami-v2',
            'together' => 'https://api.together.xyz/v1/models',
            'airtop' => 'https://api.airtop.ai/v1/status'
        ];

        $url = $endpoints[$provider] ?? null;
        if (!$url) {
            return ['success' => true, 'message' => 'Provedor configurado (teste manual necessario)'];
        }

        $ch = curl_init($url);
        curl_setopt_array($ch, [
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_HTTPHEADER => [
                'Authorization: Bearer ' . $apiKey,
                'Content-Type: application/json'
            ],
            CURLOPT_TIMEOUT => 10,
            CURLOPT_CONNECTTIMEOUT => 5
        ]);

        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        $error = curl_error($ch);
        curl_close($ch);

        if ($error) {
            return ['success' => false, 'error' => "Erro de conexao: $error"];
        }

        if ($httpCode >= 200 && $httpCode < 300) {
            return ['success' => true, 'message' => 'Conexao bem sucedida'];
        } elseif ($httpCode == 401) {
            return ['success' => false, 'error' => 'API key invalida'];
        } elseif ($httpCode == 0) {
            return ['success' => false, 'error' => 'Servidor nao responde'];
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
            'llama' => 'LLAMA_API_KEY',
            'together' => 'TOGETHER_API_KEY',
            'uipath' => 'UIPATH_API_KEY',
            'airtop' => 'AIRTOP_API_KEY'
        ];

        $envKey = $envKeys[$provider] ?? null;
        if (!$envKey) return;

        try {
            $envPath = base_path('.env');
            $content = file_get_contents($envPath);

            if (strpos($content, $envKey) !== false) {
                $content = preg_replace("/^{$envKey}=.*/m", "{$envKey}={$apiKey}", $content);
            } else {
                $content .= "\n{$envKey}={$apiKey}";
            }

            file_put_contents($envPath, $content);
        } catch (\Exception $e) {
            Log::warning("Nao foi possivel atualizar .env para $provider");
        }
    }
}
