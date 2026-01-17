# Planejamento e Roadmap - Autonomia Hospitalar Saúde

**Versão:** 1.0.0
**Data:** 17/01/2026
**Autor:** Manus AI

---

## 1. Status Atual do Projeto (Escala 0-5)

| Componente | Status | Escala | Observações |
|---|---|---|---|
| **Infraestrutura Docker** | ✅ 6/7 Containers Ativos | 4/5 | O container `hospitalar_angular` está parado. Todos os outros estão operacionais. |
| **Conexão Local (COMET)** | ✅ Conectado e Estável | 5/5 | Conexão via `manus-comet-hospital.ngrok-free.dev` está 100% funcional. |
| **Backend (Laravel)** | ✅ Operacional | 5/5 | O sistema principal está rodando e acessível. |
| **Módulo de IA (Laravel)** | ⚠️ **Parcialmente Instalado** | 2/5 | Arquivos copiados, mas **não registrados** no `config/app.php` e `routes/api.php`. |
| **Frontend (Angular)** | ❌ **Inoperante** | 0/5 | O container `hospitalar_angular` está parado, tornando a interface inacessível. |
| **Base de Conhecimento** | ✅ Completa e Atualizada | 5/5 | Documentação de arquitetura, backup e protocolos está no GitHub. |

---

## 2. Diagnóstico: O Que Falta para Concluir?

O projeto está em um estágio avançado, mas **não está funcional** devido a duas falhas críticas de configuração no backend e uma falha na inicialização do frontend.

### Falhas Críticas:

1.  **Módulo de IA Não Registrado**: O `IAServiceProvider` não foi adicionado ao `config/app.php`. Sem isso, o Laravel não sabe que o módulo existe, resultando em **erro 404** em todas as rotas de IA.
2.  **Rotas de IA Não Incluídas**: O arquivo `routes/ia_routes.php` não foi incluído no `routes/api.php`. As rotas da API de IA não estão sendo carregadas.
3.  **Frontend Angular Parado**: O container `hospitalar_angular` não está rodando, o que impede qualquer teste de interface.

---

## 3. Roadmap para Conclusão, Teste e Produção (Estimativa: 4 Horas)

Este roadmap detalha os passos necessários para levar o projeto do estado atual para um ambiente de produção funcional.

### Fase 1: Correção e Finalização da Instalação (1 Hora)

| Tarefa | Descrição | Status |
|---|---|---|
| **1.1. Registrar Service Provider** | Adicionar `App\Providers\IAServiceProvider::class` ao `config/app.php`. | ⏳ **Pendente** |
| **1.2. Incluir Rotas da IA** | Adicionar `require __DIR__ . '/ia_routes.php';` ao final do `routes/api.php`. | ⏳ **Pendente** |
| **1.3. Limpar Cache do Laravel** | Executar `php artisan config:clear` e `php artisan route:clear` no container `hospitalar_php`. | ⏳ **Pendente** |
| **1.4. Iniciar Frontend Angular** | Executar `docker start hospitalar_angular` e investigar logs em caso de falha. | ⏳ **Pendente** |

### Fase 2: Teste de Unidade e Integração (1.5 Horas)

| Tarefa | Descrição | Status |
|---|---|---|
| **2.1. Teste de Health Check (Backend)** | Validar o endpoint `/api/ia/health` para garantir que o módulo de IA está respondendo. | ⏳ **Pendente** |
| **2.2. Teste de Funcionalidade (Backend)** | Executar testes via `curl` para os principais endpoints de IA (analyze-complexity, suggest-items). | ⏳ **Pendente** |
| **2.3. Teste de Conectividade (Frontend)** | Garantir que o frontend (`http://localhost:4200`) está acessível e se conecta ao backend. | ⏳ **Pendente** |
| **2.4. Teste de Fluxo Completo (Frontend)** | Executar um caso de uso completo, como "Analisar Complexidade", pela interface do usuário. | ⏳ **Pendente** |

### Fase 3: Preparação para Produção (1.5 Horas)

| Tarefa | Descrição | Status |
|---|---|---|
| **3.1. Revisão de Segurança** | Verificar permissões de arquivos, senhas e chaves de API no `.env`. | ⏳ **Pendente** |
| **3.2. Otimização de Performance** | Habilitar cache de configuração, rotas e views no Laravel (`php artisan optimize`). | ⏳ **Pendente** |
| **3.3. Backup Final** | Realizar um backup completo do banco de dados e dos arquivos de configuração. | ⏳ **Pendente** |
| **3.4. Documentação de Deploy** | Criar um guia `DEPLOY.md` com os passos para implantar o sistema em um novo servidor. | ⏳ **Pendente** |

---

## 4. Fluxograma do Roadmap

```
┌─────────────────────────────────────────────────────────────────┐
│                      STATUS ATUAL (2/5)                         │
│     (Backend OK, Módulo IA Incompleto, Frontend Parado)         │
└───────────────────────────┬─────────────────────────────────────┘
                            │
                            ▼
                ┌───────────────────────────────┐
                │ FASE 1: CORREÇÃO E FINALIZAÇÃO│
                │ (Registrar Módulo, Iniciar NG)│
                └───────────────┬───────────────┘
                                │
                                ▼
                ┌───────────────────────────────┐
                │ FASE 2: TESTE DE INTEGRAÇÃO   │
                │ (Backend API, Frontend UI)    │
                └───────────────┬───────────────┘
                                │
                                ▼
                ┌───────────────────────────────┐
                │ FASE 3: PREPARAÇÃO P/ PRODUÇÃO│
                │ (Segurança, Otimização, Backup)│
                └───────────────┬───────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                  ✅ PROJETO PRONTO PARA DEPLOY                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 5. Conclusão

O projeto está muito próximo da conclusão. As tarefas restantes são, em sua maioria, configurações e testes. A conclusão bem-sucedida da **Fase 1** é crítica e desbloqueará todo o potencial do sistema. A estimativa de **4 horas** é realista para um desenvolvedor experiente concluir todas as fases e testar a aplicação.
