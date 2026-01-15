# 🤖 Agente: COMET Bridge v1.0

**Origem:** `obsidian-agente`

## 1. Descrição

O COMET Bridge é um componente **crítico** da arquitetura. Ele atua como uma ponte segura entre a nuvem (Manus AI) e o ambiente de desktop local, expondo o PowerShell como uma API REST. Isso permite a execução remota de qualquer comando no computador do usuário.

## 2. Principais Funcionalidades

- **Execução Remota:** Permite que agentes em nuvem executem comandos PowerShell no ambiente local.
- **Segurança:** Acesso protegido por API Key (Bearer Token).
- **Simplicidade:** Uma API com um único endpoint principal (`/exec`).

## 3. Como Utilizar

Para executar um comando remotamente, um agente deve fazer uma requisição POST para o endpoint `/exec` do COMET Bridge, que está exposto via ngrok.

**Exemplo de Snippet (Python):**

```python
import requests

COMET_URL = "https://charmless-maureen-subadministratively.ngrok-free.dev/exec"
API_KEY = "heDuf3s4Y_EXwISRm2q2O1UPgi0zWbskf4_suT3cdus"

headers = {
    "Authorization": f"Bearer {API_KEY}",
    "Content-Type": "application/json"
}

data = {
    "command": "Get-Process | Sort-Object CPU -Descending | Select-Object -First 5"
}

response = requests.post(COMET_URL, headers=headers, json=data)

if response.status_code == 200:
    print(response.json()["output"])
else:
    print(f"Erro: {response.json()['error']}")

```

## 4. Código Fonte Reutilizável

O código completo do COMET Bridge está no arquivo `agent/comet_bridge.py` do repositório `obsidian-agente`. É um microserviço Flask de ~35 linhas, extremamente leve e eficiente.
