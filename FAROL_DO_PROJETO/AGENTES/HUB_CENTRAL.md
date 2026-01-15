# 🤖 Agente: Hub Central v1.1

**Origem:** `obsidian-agente`

## 1. Descrição

O Hub Central é o cérebro da orquestração de agentes locais. Ele é responsável por gerenciar triggers (gatilhos), coordenar a execução de tarefas e conectar-se a diferentes fontes de armazenamento (Obsidian, Google Drive, MySQL).

## 2. Principais Funcionalidades

- **Motor de Execução:** Executa tarefas complexas definidas em Python.
- **Gerenciador de Triggers:** Permite o agendamento de tarefas (ex: resumo semanal, backup diário).
- **Conectores de Armazenamento:** Interface unificada para acessar diferentes fontes de dados.

## 3. Como Utilizar

O Hub Central é projetado para ser o ponto de entrada para a maioria das automações. Um agente externo (como o Manus) deve se comunicar com o Hub Central para solicitar a execução de tarefas ou o agendamento de triggers.

**Exemplo de Interação:**

1. Manus AI recebe uma solicitação do usuário para "gerar o relatório de vendas de ontem".
2. Manus AI envia uma requisição para o endpoint `/execute` do Hub Central.
3. O Hub Central identifica a tarefa "gerar_relatorio_vendas", busca os dados no MySQL através de seu conector, processa as informações e salva o relatório no Google Drive.

## 4. Código Fonte Reutilizável

O código completo do Hub Central está no diretório `hub_central/` do repositório `obsidian-agente`. Os arquivos `execution_engine.py` e `triggers_manager.py` são particularmente importantes para entender a lógica de orquestração.
