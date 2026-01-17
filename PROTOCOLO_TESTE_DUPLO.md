# Protocolo de Teste Duplo - Backend e Frontend

**Versão:** 1.0.0
**Data:** 17/01/2026
**Autor:** Manus AI

---

## 1. Conceito e Importância

O **Protocolo de Teste Duplo** é uma metodologia de validação que garante que qualquer funcionalidade implementada no sistema seja verificada em duas camadas distintas e complementares: a **lógica de backend** (API, banco de dados, regras de negócio) e a **experiência de frontend** (interface do usuário, usabilidade, feedback visual).

Uma funcionalidade só é considerada **"concluída"** quando ambas as validações são aprovadas. Isso evita cenários comuns de falha, como uma API que funciona perfeitamente mas cuja resposta não é exibida corretamente na tela, ou uma interface bonita que envia dados incorretos para o servidor.

---

## 2. Estrutura do Protocolo

O protocolo é dividido em duas fases sequenciais:

| Fase | Camada | Objetivo | Ferramentas |
|---|---|---|---|
| **Fase 1** | Backend | Validar a lógica de negócio, a integridade dos dados e a resposta da API. | `curl`, Postman, Logs do Laravel, `docker logs` |
| **Fase 2** | Frontend | Validar a experiência do usuário, o fluxo de navegação e o feedback visual. | Navegador (Chrome DevTools), Inspeção Visual |

---

## 3. Exemplo Prático: Validação do Endpoint `/api/ia/orcamento/analyze-complexity`

Vamos usar como exemplo a funcionalidade de **Análise de Complexidade de Paciente**, que foi implementada no módulo de IA.

### Cenário

O endpoint `/api/ia/orcamento/analyze-complexity` recebe dados de um paciente e retorna os scores de complexidade (NEAD, ABEMID, PPS).

---

### Fase 1: Validação de Backend

O objetivo desta fase é garantir que a API receba os dados corretamente, processe a lógica de negócio e retorne a resposta esperada.

#### Passo 1.1: Preparar a Requisição de Teste

Crie um arquivo JSON com os dados de entrada para o teste. Este arquivo simula o que o frontend enviaria.

```json
// Arquivo: test_payload.json
{
  "paciente_id": 12345,
  "diagnostico_principal": "Doença Pulmonar Obstrutiva Crônica (DPOC)",
  "cid": "J44.1",
  "comorbidades": ["Hipertensão Arterial", "Diabetes Mellitus Tipo 2"],
  "idade": 72,
  "nivel_consciencia": "Alerta",
  "suporte_ventilatorio": "Oxigenoterapia",
  "nutricao": "Via Oral",
  "lesoes_pele": false,
  "medicamentos_ev": true
}
```

#### Passo 1.2: Executar a Requisição via `curl`

Execute o comando `curl` para enviar a requisição para a API. Este comando pode ser executado no terminal do seu computador ou via COMET Bridge.

```bash
curl -X POST http://localhost:8888/api/ia/orcamento/analyze-complexity \
  -H "Content-Type: application/json" \
  -d @test_payload.json
```

#### Passo 1.3: Analisar a Resposta da API

A resposta esperada deve conter os scores de complexidade e a classificação do paciente.

**Resposta Esperada (Sucesso - HTTP 200):**

```json
{
  "success": true,
  "data": {
    "paciente_id": 12345,
    "scores": {
      "nead": 78,
      "abemid": 65,
      "pps": 50
    },
    "classificacao": "Alta Complexidade",
    "justificativa": "Paciente idoso com DPOC e múltiplas comorbidades, necessitando de suporte de oxigenoterapia e medicamentos endovenosos.",
    "recomendacoes": [
      "Monitoramento contínuo de saturação de O2",
      "Avaliação nutricional semanal",
      "Fisioterapia respiratória diária"
    ]
  },
  "processado_em": "2026-01-17T04:35:00Z"
}
```

#### Passo 1.4: Checklist de Validação de Backend

| Item de Verificação | Status | Observação |
|---|---|---|
| Requisição retornou HTTP 200? | ✅ | |
| O campo `success` é `true`? | ✅ | |
| Os scores NEAD, ABEMID e PPS estão presentes? | ✅ | |
| Os valores dos scores estão dentro do range esperado (0-100)? | ✅ | |
| A classificação está correta para os scores retornados? | ✅ | |
| O tempo de resposta é aceitável (< 2 segundos)? | ✅ | |

**Resultado da Fase 1:** ✅ **APROVADO**

---

### Fase 2: Validação de Frontend

O objetivo desta fase é garantir que o usuário consiga executar a funcionalidade pela interface e que o feedback visual seja claro e correto.

#### Passo 2.1: Acessar a Funcionalidade pela Interface

1.  Abra o navegador e acesse o sistema: `https://dev.hospitalarsaude.app.br`
2.  Faça login com suas credenciais.
3.  Navegue até o módulo de **Orçamentos**.
4.  Selecione um paciente existente ou crie um novo para teste.
5.  Clique no botão **"Analisar Complexidade com IA"** (ou equivalente).

#### Passo 2.2: Preencher o Formulário (se aplicável)

Se a funcionalidade exigir preenchimento de dados adicionais, preencha o formulário com os mesmos dados usados no teste de backend (`test_payload.json`).

#### Passo 2.3: Analisar o Feedback Visual

Após clicar no botão de ação, observe a interface:

| Item de Verificação | Status | Observação |
|---|---|---|
| O botão de ação está visível e clicável? | ✅ | |
| Há um indicador de carregamento (spinner) enquanto a API processa? | ✅ | |
| A mensagem de sucesso/erro é exibida claramente? | ✅ | |
| Os dados retornados (scores, classificação) são exibidos na tela? | ✅ | |
| O layout está correto e sem quebras visuais? | ✅ | |
| O fluxo de navegação é intuitivo? | ✅ | |

#### Passo 2.4: Inspecionar a Requisição no DevTools (F12)

1.  Abra o Chrome DevTools (F12).
2.  Vá para a aba **Network**.
3.  Execute a ação novamente e localize a requisição para `/api/ia/orcamento/analyze-complexity`.
4.  Verifique:
    *   O **Payload** enviado corresponde aos dados do formulário?
    *   A **Response** corresponde ao esperado (igual ao teste de backend)?
    *   O **Status Code** é 200?

**Resultado da Fase 2:** ✅ **APROVADO**

---

## 4. Fluxo de Decisão

```
┌─────────────────────────────────────────────────────────────────┐
│                   INÍCIO DA VALIDAÇÃO                           │
└───────────────────────────┬─────────────────────────────────────┘
                            │
                            ▼
                ┌───────────────────────┐
                │  FASE 1: BACKEND      │
                │  (curl, Postman, Logs)│
                └───────────┬───────────┘
                            │
              ┌─────────────┴─────────────┐
              │                           │
              ▼                           ▼
        ┌───────────┐               ┌───────────┐
        │ APROVADO  │               │ REPROVADO │
        └─────┬─────┘               └─────┬─────┘
              │                           │
              │                           ▼
              │                 ┌─────────────────────┐
              │                 │ CORRIGIR BACKEND    │
              │                 │ (Código, Lógica, BD)│
              │                 └──────────┬──────────┘
              │                            │
              │                            └──────► (Voltar para Fase 1)
              │
              ▼
    ┌───────────────────────┐
    │  FASE 2: FRONTEND     │
    │  (Navegador, DevTools)│
    └───────────┬───────────┘
                │
  ┌─────────────┴─────────────┐
  │                           │
  ▼                           ▼
┌───────────┐           ┌───────────┐
│ APROVADO  │           │ REPROVADO │
└─────┬─────┘           └─────┬─────┘
      │                       │
      │                       ▼
      │             ┌─────────────────────┐
      │             │ CORRIGIR FRONTEND   │
      │             │ (UI, UX, Componentes)│
      │             └──────────┬──────────┘
      │                        │
      │                        └──────► (Voltar para Fase 2)
      │
      ▼
┌─────────────────────────────────────────────────────────────────┐
│               ✅ FUNCIONALIDADE CONCLUÍDA                       │
│               (Pronta para Commit e Deploy)                     │
└─────────────────────────────────────────────────────────────────┘
```

---

## 5. Resumo

O Protocolo de Teste Duplo é uma prática essencial para garantir a qualidade e a confiabilidade do sistema. Ao validar separadamente o backend e o frontend, identificamos e corrigimos problemas de forma isolada, evitando que erros de uma camada contaminem a outra. A aplicação consistente deste protocolo resulta em um sistema mais robusto, com menos bugs em produção e uma melhor experiência para o usuário final.
