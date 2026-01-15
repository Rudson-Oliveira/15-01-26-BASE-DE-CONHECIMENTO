# 💻 Snippet: Script de Verificação de Agentes

**Origem:** `projeto-2026-autonomia/scripts/verificar_agentes.py`

## 1. Descrição

Este script Python é uma ferramenta de diagnóstico completa para verificar o status de todos os componentes do ecossistema de agentes. Ele verifica containers Docker, portas de rede, modelos Ollama, serviços HTTP e a conexão com o ngrok.

## 2. Como Utilizar

O script foi projetado para ser executado remotamente através do COMET Bridge.

**Comando para Execução via COMET V2.0:**

```
py: exec(open('verificar_agentes.py').read())
```

Alternativamente, o conteúdo do script pode ser copiado e colado no terminal do COMET com o prefixo `py:`.

## 3. Funcionalidades

- **`verificar_docker()`:** Checa o status dos containers `n8n`, `ollama-hospitalar`, etc.
- **`verificar_portas()`:** Testa a conexão com as portas dos principais serviços (N8N, Ollama, COMET, etc.).
- **`verificar_ollama()`:** Lista os modelos de linguagem disponíveis no servidor Ollama.
- **`verificar_servicos()`:** Faz requisições HTTP para os endpoints de saúde dos serviços.
- **`verificar_ngrok()`:** Confirma que o COMET Bridge está acessível publicamente via ngrok.

## 4. Código Fonte Reutilizável

O script `verificar_agentes.py` é um excelente exemplo de como criar ferramentas de diagnóstico para um sistema distribuído. Ele pode ser adaptado para incluir novos serviços e verificações à medida que o sistema evolui.
