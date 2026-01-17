# Plano de Integração: VisionAI Executivo

**Data**: 17/01/2026  
**Versão**: 1.0  
**Objetivo**: Transformar o VisionAI em um assistente que **executa ações**, não apenas explica

---

## 1. Mudança de Paradigma: De Explicativo para Executivo

### Modelo Atual (Explicativo)
```
Usuário: "como faço cadastro de paciente?"
Assistente: "Para cadastrar, siga os passos: 1. Acesse o módulo... 2. Clique em..."
Resultado: Usuário precisa fazer manualmente
```

### Modelo Novo (Executivo)
```
Usuário: "cadastre o paciente João Silva, CPF 123.456.789-00"
Assistente: "Executando cadastro do paciente João Silva..."
[Navegador executa automaticamente]
Assistente: "✅ Paciente João Silva cadastrado com sucesso! ID: 12345"
Resultado: Ação executada automaticamente
```

---

## 2. Arquitetura do Assistente Executivo

### Diagrama de Fluxo

```
┌─────────────────────────────────────────────────────────────────────────┐
│                        FLUXO DE EXECUÇÃO                                │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ┌──────────────┐                                                       │
│  │   USUÁRIO    │                                                       │
│  │  (Chat/Voz)  │                                                       │
│  └──────┬───────┘                                                       │
│         │ "cadastre paciente João Silva"                                │
│         ▼                                                               │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │                    PROCESSADOR DE INTENÇÃO                        │  │
│  │  1. Identifica AÇÃO: cadastrar_paciente                          │  │
│  │  2. Extrai DADOS: nome="João Silva", cpf="123.456.789-00"        │  │
│  │  3. Valida PERMISSÃO: usuário pode cadastrar?                    │  │
│  │  4. Define ESTRATÉGIA: API ou Automação de Browser               │  │
│  └──────────────────────────────────────────────────────────────────┘  │
│         │                                                               │
│         ▼                                                               │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │                      EXECUTOR DE AÇÕES                            │  │
│  │                                                                   │  │
│  │  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐           │  │
│  │  │  VIA API    │    │ VIA BROWSER │    │ VIA CANAIS  │           │  │
│  │  │  (Backend)  │    │ (Automação) │    │ (Email/WA)  │           │  │
│  │  └──────┬──────┘    └──────┬──────┘    └──────┬──────┘           │  │
│  │         │                  │                  │                   │  │
│  │         └──────────────────┼──────────────────┘                   │  │
│  │                            │                                      │  │
│  └────────────────────────────┼──────────────────────────────────────┘  │
│                               ▼                                         │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │                    FEEDBACK AO USUÁRIO                            │  │
│  │  "✅ Paciente João Silva cadastrado! ID: 12345"                  │  │
│  │  [Navegador mostra tela do paciente cadastrado]                  │  │
│  └──────────────────────────────────────────────────────────────────┘  │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Camadas de Execução

### 3.1 Camada 1: Execução via API (Preferencial)

Quando existe um endpoint de API, usar diretamente para máxima velocidade e confiabilidade.

| Ação | Endpoint | Método |
|------|----------|--------|
| Cadastrar paciente | `/api/pacientes` | POST |
| Criar orçamento | `/api/orcamentos` | POST |
| Analisar complexidade | `/api/ia/orcamento/analyze-complexity` | POST |
| Sugerir itens | `/api/ia/orcamento/suggest-items` | POST |
| Calcular orçamento | `/api/ia/orcamento/calculate` | POST |

### 3.2 Camada 2: Execução via Browser (Fallback)

Quando não há API disponível, automatizar o navegador embutido.

```javascript
// Exemplo: Navegar para módulo de pacientes e clicar em "Novo"
async function cadastrarPacienteViaBrowser(dados) {
  // 1. Navegar para o módulo
  await navegador.goto('/dashboard/pacientes');
  
  // 2. Clicar em "Novo Paciente"
  await navegador.click('button[aria-label="Novo Paciente"]');
  
  // 3. Preencher formulário
  await navegador.fill('input[name="nome"]', dados.nome);
  await navegador.fill('input[name="cpf"]', dados.cpf);
  await navegador.fill('input[name="dataNascimento"]', dados.dataNascimento);
  
  // 4. Salvar
  await navegador.click('button[type="submit"]');
  
  // 5. Aguardar confirmação
  await navegador.waitForSelector('.toast-success');
  
  return { sucesso: true, mensagem: 'Paciente cadastrado!' };
}
```

### 3.3 Camada 3: Execução via Canais (Email/WhatsApp)

Para ações que envolvem comunicação externa.

| Ação | Canal | Uso |
|------|-------|-----|
| Enviar orçamento para operadora | Email | Anexar PDF do orçamento |
| Notificar paciente | WhatsApp | Mensagem de confirmação |
| Solicitar aprovação | Email | Link para aprovação |
| Alertar equipe | WhatsApp | Notificação urgente |

---

## 4. Comandos Especiais do Chat

### 4.1 Comandos de Orçamento

| Comando | Descrição | Ação Executada |
|---------|-----------|----------------|
| `/orcamento novo [paciente]` | Criar novo orçamento | Abre formulário, preenche paciente, aguarda itens |
| `/orcamento [id]` | Abrir orçamento existente | Navega para o orçamento e exibe detalhes |
| `/orcamento calcular` | Calcular orçamento atual | Chama API de cálculo e atualiza valores |
| `/orcamento enviar [email]` | Enviar orçamento | Gera PDF e envia por email |
| `/orcamento aprovar [id]` | Aprovar orçamento | Atualiza status para aprovado |

### 4.2 Comandos de Análise de IA

| Comando | Descrição | Ação Executada |
|---------|-----------|----------------|
| `/complexidade [paciente]` | Analisar complexidade | Calcula NEAD/ABEMID/PPS e exibe scores |
| `/sugerir [diagnóstico]` | Sugerir itens | Lista materiais/medicamentos recomendados |
| `/prever [id]` | Prever aprovação | Calcula probabilidade de aprovação |
| `/otimizar [id]` | Otimizar preços | Sugere ajustes de margem |

### 4.3 Comandos de Navegação

| Comando | Descrição | Ação Executada |
|---------|-----------|----------------|
| `/ir pacientes` | Ir para módulo | Navega para /dashboard/pacientes |
| `/ir orcamentos` | Ir para módulo | Navega para /dashboard/orcamentos |
| `/ir financeiro` | Ir para módulo | Navega para /dashboard/financeiro |
| `/buscar [termo]` | Buscar no sistema | Executa busca global |

### 4.4 Comandos de Comunicação

| Comando | Descrição | Ação Executada |
|---------|-----------|----------------|
| `/email [destinatário] [assunto]` | Enviar email | Abre composer, preenche, envia |
| `/whatsapp [número] [mensagem]` | Enviar WhatsApp | Envia mensagem via API |
| `/notificar [equipe] [mensagem]` | Notificar equipe | Envia para grupo definido |

---

## 5. Especificação Técnica dos Comandos de Orçamento

### 5.1 Comando: `/orcamento novo [paciente]`

**Entrada do Usuário**:
```
/orcamento novo João Silva
```

**Processamento**:
```javascript
async function comandoOrcamentoNovo(pacienteNome) {
  // 1. Buscar paciente no banco
  const paciente = await api.get(`/api/pacientes?nome=${pacienteNome}`);
  
  if (!paciente) {
    return { erro: `Paciente "${pacienteNome}" não encontrado. Deseja cadastrar?` };
  }
  
  // 2. Analisar complexidade automaticamente
  const complexidade = await api.post('/api/ia/orcamento/analyze-complexity', {
    paciente_id: paciente.id
  });
  
  // 3. Sugerir itens baseado no diagnóstico
  const sugestoes = await api.post('/api/ia/orcamento/suggest-items', {
    paciente_id: paciente.id,
    diagnostico: paciente.diagnostico_principal
  });
  
  // 4. Navegar para formulário de orçamento
  await navegador.goto(`/dashboard/orcamentos/novo?paciente=${paciente.id}`);
  
  // 5. Preencher automaticamente
  await navegador.fill('select[name="paciente"]', paciente.id);
  
  // 6. Retornar feedback
  return {
    sucesso: true,
    mensagem: `Orçamento iniciado para ${paciente.nome}`,
    complexidade: complexidade.data,
    sugestoes: sugestoes.data.items,
    navegador: 'Formulário de orçamento aberto'
  };
}
```

**Resposta ao Usuário**:
```
✅ Orçamento iniciado para João Silva

📊 Análise de Complexidade:
- NEAD Score: 75/100 (Alta)
- ABEMID Score: 62/100 (Média)
- PPS Score: 40/100 (Cuidados Paliativos)

💊 Itens Sugeridos:
1. Kit de curativos especiais - R$ 450,00
2. Medicação analgésica - R$ 320,00
3. Equipamento de oxigenoterapia - R$ 1.200,00

[Formulário de orçamento aberto no navegador]
Deseja adicionar os itens sugeridos automaticamente?
```

---

### 5.2 Comando: `/complexidade [paciente]`

**Entrada do Usuário**:
```
/complexidade Maria Santos
```

**Processamento**:
```javascript
async function comandoComplexidade(pacienteNome) {
  // 1. Buscar paciente
  const paciente = await api.get(`/api/pacientes?nome=${pacienteNome}`);
  
  // 2. Chamar endpoint de análise
  const resultado = await api.post('/api/ia/orcamento/analyze-complexity', {
    paciente_id: paciente.id,
    incluir_historico: true
  });
  
  // 3. Navegar para ficha do paciente
  await navegador.goto(`/dashboard/pacientes/${paciente.id}`);
  
  return resultado.data;
}
```

**Resposta ao Usuário**:
```
📊 Análise de Complexidade - Maria Santos

┌─────────────────────────────────────────┐
│ NEAD Score:   ████████░░ 82/100 (Alta)  │
│ ABEMID Score: ██████░░░░ 58/100 (Média) │
│ PPS Score:    ████░░░░░░ 35/100 (Baixo) │
└─────────────────────────────────────────┘

📋 Fatores Identificados:
- Dependência total para AVDs
- Uso de dispositivos invasivos (sonda)
- Necessidade de curativos complexos
- Suporte ventilatório noturno

💰 Impacto no Orçamento:
- Categoria recomendada: Home Care Complexo
- Margem sugerida: 18-22%
- Risco de glosa: Baixo (12%)

[Ficha do paciente aberta no navegador]
```

---

### 5.3 Comando: `/orcamento calcular`

**Entrada do Usuário**:
```
/orcamento calcular
```

**Processamento**:
```javascript
async function comandoOrcamentoCalcular() {
  // 1. Capturar contexto do navegador (orçamento atual)
  const contexto = await navegador.getContext();
  const orcamentoId = contexto.orcamentoAtual;
  
  // 2. Chamar endpoint de cálculo
  const resultado = await api.post('/api/ia/orcamento/calculate', {
    orcamento_id: orcamentoId
  });
  
  // 3. Atualizar valores no formulário
  await navegador.fill('input[name="valor_total"]', resultado.data.valor_total);
  await navegador.fill('input[name="margem"]', resultado.data.margem);
  
  return resultado.data;
}
```

**Resposta ao Usuário**:
```
✅ Orçamento #12345 calculado!

💰 Resumo Financeiro:
┌────────────────────────────────────────┐
│ Custo Total:        R$ 15.450,00       │
│ Margem Aplicada:    18%                │
│ Valor Final:        R$ 18.231,00       │
│ Lucro Estimado:     R$ 2.781,00        │
└────────────────────────────────────────┘

📊 Breakdown por Categoria:
- Materiais:      R$ 4.200,00 (23%)
- Medicamentos:   R$ 3.800,00 (21%)
- Profissionais:  R$ 6.500,00 (36%)
- Equipamentos:   R$ 2.950,00 (16%)
- Logística:      R$ 781,00 (4%)

⚠️ Alertas:
- Margem de medicamentos abaixo do ideal (15%)
- Considerar renegociar fornecedor de materiais

[Valores atualizados no formulário]
```

---

## 6. Integração com Canais (Email/WhatsApp)

### 6.1 Fluxo de Envio de Orçamento por Email

```
Usuário: "/orcamento enviar operadora@convenio.com.br"

Assistente:
1. Gera PDF do orçamento atual
2. Prepara email com template padrão
3. Anexa PDF
4. Envia via integração de email
5. Registra envio no histórico

Resposta:
"✅ Orçamento #12345 enviado para operadora@convenio.com.br
📧 Email enviado às 14:32
📎 Anexo: Orcamento_12345_JoaoSilva.pdf (245 KB)
⏱️ Aguardando resposta..."
```

### 6.2 Fluxo de Notificação por WhatsApp

```
Usuário: "/whatsapp 11999998888 Orçamento aprovado, iniciar atendimento"

Assistente:
1. Valida número
2. Formata mensagem
3. Envia via API WhatsApp
4. Confirma entrega

Resposta:
"✅ Mensagem enviada para (11) 99999-8888
📱 Status: Entregue ✓✓
💬 Mensagem: 'Orçamento aprovado, iniciar atendimento'"
```

---

## 7. Mapeamento de Intenções (NLU)

Para comandos em linguagem natural (sem barra), o sistema deve identificar a intenção:

| Frase do Usuário | Intenção Detectada | Ação |
|------------------|-------------------|------|
| "cadastre o paciente João" | `cadastrar_paciente` | Abre formulário, preenche nome |
| "crie um orçamento para Maria" | `criar_orcamento` | Executa `/orcamento novo Maria` |
| "qual a complexidade do paciente 123?" | `analisar_complexidade` | Executa `/complexidade` |
| "envie esse orçamento por email" | `enviar_orcamento_email` | Executa `/orcamento enviar` |
| "calcule o valor total" | `calcular_orcamento` | Executa `/orcamento calcular` |
| "vá para orçamentos" | `navegar` | Executa `/ir orcamentos` |

---

## 8. Endpoints de IA Necessários (Backend Laravel)

### Endpoints Já Implementados

| Endpoint | Status | Uso |
|----------|--------|-----|
| `GET /api/ia/health` | ✅ Funcionando | Health check |
| `POST /api/ia/orcamento/analyze-complexity` | ✅ Criado | Análise NEAD/ABEMID/PPS |
| `POST /api/ia/orcamento/suggest-items` | ✅ Criado | Sugestão de itens |
| `POST /api/ia/orcamento/calculate` | ✅ Criado | Cálculo de orçamento |
| `POST /api/ia/orcamento/predict-approval` | ✅ Criado | Previsão de aprovação |
| `POST /api/ia/orcamento/optimize-prices` | ✅ Criado | Otimização de preços |
| `POST /api/ia/orcamento/chat` | ✅ Criado | Chat com assistente |

### Endpoints Adicionais Necessários

| Endpoint | Descrição | Prioridade |
|----------|-----------|------------|
| `POST /api/ia/execute-action` | Executor genérico de ações | Alta |
| `GET /api/ia/context` | Capturar contexto do navegador | Alta |
| `POST /api/ia/browser/navigate` | Comandar navegação | Média |
| `POST /api/ia/browser/fill` | Preencher formulários | Média |
| `POST /api/ia/browser/click` | Clicar em elementos | Média |

---

## 9. Próximos Passos de Implementação

### Fase 1: Comandos Básicos (2-3 horas)
1. Implementar parser de comandos no VisionAI
2. Conectar comandos `/ir` aos endpoints de navegação
3. Testar navegação automática

### Fase 2: Comandos de Orçamento (4-5 horas)
1. Implementar `/orcamento novo`
2. Implementar `/complexidade`
3. Implementar `/orcamento calcular`
4. Testar fluxo completo

### Fase 3: Integração de Canais (3-4 horas)
1. Conectar `/email` à integração de email
2. Conectar `/whatsapp` à API do WhatsApp
3. Testar envio de orçamentos

### Fase 4: NLU e Linguagem Natural (4-5 horas)
1. Implementar detector de intenções
2. Treinar com exemplos de frases
3. Testar compreensão de linguagem natural

---

## 10. Conclusão

Este plano transforma o VisionAI de um assistente **explicativo** para um assistente **executivo**. O usuário não precisa mais seguir instruções manualmente; o sistema executa as ações automaticamente, usando a combinação de:

1. **API Backend** (quando disponível) - Rápido e confiável
2. **Automação de Browser** (fallback) - Para ações sem API
3. **Integração de Canais** (Email/WhatsApp) - Para comunicação externa

O resultado é um sistema verdadeiramente autônomo que **faz** em vez de apenas **explica**.
