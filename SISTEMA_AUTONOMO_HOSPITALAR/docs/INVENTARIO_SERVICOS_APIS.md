# Inventário de Serviços e APIs - Sistema Hospitalar Saúde

**Data:** 2026-01-17  
**Status:** Documento de Referência

---

## Categorias de Serviços

### 1. Provedores de LLM (Inteligência Artificial)

| Provedor | Tipo | API Key/Credencial | URL | Status |
|----------|------|-------------------|-----|--------|
| **Ollama** | Local | - | localhost:11434 | ✅ Ativo |
| **Jan** | Local | - | localhost:4891 | ✅ Disponível |
| **LM Studio** | Local | - | localhost:1234 | ✅ Disponível |
| **GPT4All** | Local | - | - | ✅ Disponível |
| **DeepSeek** | API | [HUGGINGFACE_API_KEY] | api.deepseek.com | ✅ Configurado |
| **Grok (xAI)** | API | [GROK_API_KEY] | api.x.ai | ✅ Configurado |
| **OpenAI** | API | [OPENAI_API_KEY] | api.openai.com | ✅ Configurado |
| **HuggingFace** | API | [HUGGINGFACE_API_KEY] | huggingface.co | ✅ Configurado |
| **Together AI** | API | (configurar) | api.together.xyz | ⏳ Aguardando |

---

### 2. Automação RPA (UiPath)

| Serviço | URL | Credenciais |
|---------|-----|-------------|
| **UiPath Cloud** | https://cloud.uipath.com/hospitalarsaude | |
| Licença | - | 4579-0379-7019-4236 |
| Robot Token | - | rt_D67B3D5918C4F5A64EC55AF469CAA15B92FA237945C2A90DAB1CA6920752DF15-1 |
| Tenant ID | - | e8e6f0f1-f928-4bbe-aa90-f98326f031b9 |

---

### 3. Acesso Remoto

| Serviço | URL | Credenciais |
|---------|-----|-------------|
| **Getscreen** | https://getscreen.me/pt/ | (configurar) |
| **Chrome Remote Desktop** | https://remotedesktop.google.com/access/ | Extensão: eciohhdfhkkihkiiefldkejohdoghogo |

---

### 4. Automação de Navegador (Airtop)

| Serviço | URL | API Keys |
|---------|-----|----------|
| **Airtop Playground** | https://portal.airtop.ai/studio/playground | |
| **Airtop Agents** | https://portal.airtop.ai/agents | |
| API Key 1 | - | 40988ea7894557c.kEI9Bg63LE6Y0c9xfLCBhpTvj0otUKfQGuKYFPJVd5 |
| API Key 2 | - | 5f6d74b2459ce1e8.MIvVaCqXxBqrcxINlnXaOYn4TQAE3W57NDZLorf3js |

---

### 5. Ferramentas de Automação de Navegador

| Ferramenta | URL | Uso |
|------------|-----|-----|
| **Puppeteer** | https://pptr.dev | Chrome automation |
| **Playwright** | https://playwright.dev | Multi-browser |
| **Selenium** | https://www.selenium.dev | Clássico e robusto |

---

### 6. Infraestrutura / Containers

| Serviço | URL | Uso |
|---------|-----|-----|
| **Docker** | https://www.docker.com | Containers |
| **Portainer** | https://www.portainer.io | Gerenciamento Docker |
| **Grafana** | https://grafana.com | Observabilidade |

---

### 7. Túnel / Exposição Local

| Serviço | URL | Uso |
|---------|-----|-----|
| **ngrok** | https://ngrok.com | Túnel para localhost |
| **COMET Bridge** | https://manus-comet-hospital.ngrok-free.dev | Conexão remota |

---

### 8. Código / Versionamento

| Serviço | URL | Uso |
|---------|-----|-----|
| **GitHub** | https://github.com | Repositório |
| **GitHub Actions** | https://github.com/features/actions | CI/CD |
| **GitHub Copilot** | https://github.com/features/copilot | IA para código |
| **CodeQL** | https://github.com/features/security/code-scanning | Análise de código |

---

### 9. Ferramentas de Teste de API

| Serviço | URL | Uso |
|---------|-----|-----|
| **Hoppscotch** | https://hoppscotch.io/settings | Teste de APIs |

---

## Modo de Espera (Standby Mode)

Para APIs que não estão conectadas, o sistema implementa um **modo de espera**:

1. **Status "Aguardando"**: API configurada mas não conectada
2. **Retry automático**: Sistema tenta reconectar a cada 5 minutos
3. **Notificação**: Quando a API conectar, o sistema notifica e começa a usar
4. **Fallback**: Enquanto aguarda, usa outros provedores disponíveis

### Fluxo de Modo de Espera

```
┌─────────────────────────────────────────────────────────────────┐
│                    API CONFIGURADA                              │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
                    ┌─────────────────┐
                    │  Testar Conexão │
                    └─────────────────┘
                              │
              ┌───────────────┼───────────────┐
              ▼               ▼               ▼
        ┌─────────┐     ┌─────────┐     ┌─────────┐
        │ SUCESSO │     │  FALHA  │     │ TIMEOUT │
        └─────────┘     └─────────┘     └─────────┘
              │               │               │
              ▼               ▼               ▼
        ┌─────────┐     ┌─────────┐     ┌─────────┐
        │  ATIVO  │     │AGUARDANDO│    │AGUARDANDO│
        └─────────┘     └─────────┘     └─────────┘
                              │               │
                              └───────┬───────┘
                                      ▼
                              ┌─────────────┐
                              │ Retry 5 min │
                              └─────────────┘
```

---

## Hierarquia de Fallback Completa

```
REQUISIÇÃO
    │
    ▼
┌─────────────────────────────────────────────────────────────────┐
│ CAMADA 1: LOCAIS (Custo ZERO)                                   │
│ Ollama → Jan → LM Studio → GPT4All                              │
└─────────────────────────────────────────────────────────────────┘
    │ (se todos falharem)
    ▼
┌─────────────────────────────────────────────────────────────────┐
│ CAMADA 2: APIs GRATUITAS/BARATAS                                │
│ DeepSeek → Together AI → HuggingFace                            │
└─────────────────────────────────────────────────────────────────┘
    │ (se todos falharem)
    ▼
┌─────────────────────────────────────────────────────────────────┐
│ CAMADA 3: APIs PREMIUM                                          │
│ Grok → OpenAI → Claude → Gemini                                 │
└─────────────────────────────────────────────────────────────────┘
    │ (se todos falharem)
    ▼
┌─────────────────────────────────────────────────────────────────┐
│ CAMADA 4: AUTOMAÇÃO VISUAL (Último recurso)                     │
│ Airtop → Playwright → Puppeteer → Selenium                      │
└─────────────────────────────────────────────────────────────────┘
```

---

## Próximos Passos

1. ✅ Documentar todos os serviços
2. ⬜ Adicionar novos provedores ao ApiConfigController
3. ⬜ Implementar modo de espera no LLMRouter
4. ⬜ Atualizar interface de configuração
5. ⬜ Testar integração com UiPath
6. ⬜ Testar integração com Airtop
