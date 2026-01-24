# AGENTE ORCAMENTOS - JOSE DO EGITO
## Contexto do Agente para Setor de Orcamentos

---

## 1. IDENTIFICACAO DO AGENTE
- **Nome:** Jose do Egito
- **Setor:** Orcamentos
- **Sistema:** HospitaLar Saude
- **URL Base:** https://hospitalarsaude.app.br
- **URL Dev:** https://dev.hospitalarsaude.app.br

---

## 2. MAPEAMENTO DO MODULO ORCAMENTOS

### 2.1 ROTAS PRINCIPAIS
| Rota | Descricao |
|------|----------|
| /dashboard/orcamentos/retificado | Lista de orcamentos - Retificacoes |
| /dashboard/orcamentos/dashboard | Painel Administrativo |
| /dashboard/pacientes/orcamentos/itens/{id} | Detalhes do orcamento |

### 2.2 TELA: LISTA DE ORCAMENTOS (Retificacoes)
**URL:** /dashboard/orcamentos/retificado

**Abas:**
- Retificacoes
- Painel Administrativo

**Filtros:**
- Pendentes
- Realizadas

**Colunas da Tabela:**
- Codigo
- Nome
- Periodo
- Finalizado

### 2.3 TELA: PAINEL ADMINISTRATIVO
**URL:** /dashboard/orcamentos/dashboard

**Cards de Metricas:**
- Total de orcamento: 139
- Valor total solicitados: R$ 2.532.478,77
- Orcamentos Aprovados: R$ 297.618,41
- Quantidade de operadoras solicitantes: 13

**Filtros:**
- Inicio (data)
- Fim (data)
- Operadora (select)
- Status (select)

**Graficos:**
- Total de operadoras solicitantes (por valor)
- Orcamentos por status - Quantitativo
- Orcamentos por status - Monetario

**Status disponiveis:**
- Reprovado
- Aprovado
- Aguardando
- Acrescimo
- Recaptacao

### 2.4 TELA: DETALHES DO ORCAMENTO
**URL:** /dashboard/pacientes/orcamentos/itens/{id}

**Cabecalho:**
- Nome do Paciente + " - Orcamento"

**Botoes de Acao:**
1. ADICIONAR ITENS (botao principal azul)
2. Importar orcamento
3. Aprovacao
4. Desconto
5. Observacoes

**Informacoes do Orcamento:**
- Status (Aprovado/Pendente/etc)
- Aprovado por
- Data
- Validade
- Senha
- Guia do prestador
- Guia da operadora
- Numero
- Tipo (Captacao/etc)
- Data inicio
- Data fim
- Data de solicitacao
- Requisicoes
- Aditivos
- Criado por (usuario + data/hora)
- Status de autorizacao

**Cards de Valores:**
- Total original (R$)
- Total original com desconto (R$)
- Total do desconto (R$ e %)
- Total com aditivos de exclusao (R$)

**Secoes:**
- Tipos > Procedimentos
- Observacoes (historico com usuario/data/hora)

---

## 3. FUNCIONALIDADES (MODAIS)

### 3.1 Modal: Observacoes
- Historico de observacoes (usuario, data, hora, texto)
- Editor de texto rico
- Botoes: CANCELAR / ATUALIZAR

### 3.2 Modal: Aplicar Desconto
- Desconto por: Porcentagem % ou Valor R$
- Total original R$
- Novo valor R$
- Desconto % / Desconto R$
- Botoes: CANCELAR / ATUALIZAR

### 3.3 Modal: Aprovacao
- Senha
- Nome (obrigatorio)
- Guia do prestador
- Guia da operadora
- Data de aprovacao (obrigatorio)
- Validade aprovacao
- Status: Deferido | Indeferido | Em aberto
- Botoes: CANCELAR / ATUALIZAR

---

## 4. ENDPOINTS API (INFERIDOS)

Baseado na estrutura Angular SPA:
```
GET  /api/orcamentos
GET  /api/orcamentos/{id}
POST /api/orcamentos
PUT  /api/orcamentos/{id}
PUT  /api/orcamentos/{id}/aprovacao
PUT  /api/orcamentos/{id}/desconto
POST /api/orcamentos/{id}/observacoes
GET  /api/orcamentos/dashboard
```

---

## 5. USUARIOS IDENTIFICADOS
- JENNIFER ORIANA DA ROCHA ROZA (aprovadora)
- DANIEL JOSE BARBOSA LIMA (criador)
- KARINE LETICIA DO NASCIMENTO FUJISHIMA (observadora)
- RAFAELLA FERREIRA GAVA (observadora)

---

## 6. DATA DO MAPEAMENTO
**Data:** 30/12/2025
**Mapeado por:** Jose do Egito (Agente IA)
**Status:** Mapeamento inicial completo
