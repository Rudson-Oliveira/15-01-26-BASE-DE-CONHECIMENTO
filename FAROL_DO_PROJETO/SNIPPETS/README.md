# 💻 Snippets de Código

Esta seção contém snippets de código prontos para uso, cobrindo as operações mais comuns da arquitetura.

---

## 1. Conexão com Banco de Dados MySQL

**Origem:** `SISTEMA-AUTONOMO-31-12-25/backend/api/budget_api.py`

```python
import mysql.connector
from mysql.connector import Error

DB_CONFIG = {
    'host': 'hospitalar_db',  # Nome do serviço no docker-compose
    'port': 3306,
    'database': 'hospitalar',
    'user': 'root',
    'password': 'password'
}

def get_db_connection():
    try:
        connection = mysql.connector.connect(**DB_CONFIG)
        return connection
    except Error as e:
        print(f"Erro ao conectar ao MySQL: {e}")
        return None

# Uso:
conn = get_db_connection()
if conn:
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM orcamentos LIMIT 10")
    records = cursor.fetchall()
    print(records)
    cursor.close()
    conn.close()
```

---

## 2. Execução Remota de PowerShell via COMET Bridge

**Origem:** `obsidian-agente/agent/comet_bridge.py`

```python
import requests

COMET_URL = "https://charmless-maureen-subadministratively.ngrok-free.dev/exec"
API_KEY = "heDuf3s4Y_EXwISRm2q2O1UPgi0zWbskf4_suT3cdus"

headers = {
    "Authorization": f"Bearer {API_KEY}",
    "Content-Type": "application/json"
}

def execute_remote_command(command: str):
    data = {"command": command}
    try:
        response = requests.post(COMET_URL, headers=headers, json=data, timeout=60)
        response.raise_for_status() # Lança exceção para códigos de erro HTTP
        return response.json()["output"]
    except requests.exceptions.RequestException as e:
        print(f"Erro na requisição: {e}")
        return None

# Uso:
output = execute_remote_command("Get-Service -Name 'Docker*' | Select-Object Status, Name")
if output:
    print(output)

```

---

## 3. Análise de Imagem com Vision Server (LLaVA)

**Origem:** `obsidian-agente/vision_server.py`

```python
import requests
import base64

VISION_SERVER_URL = "http://localhost:5003/analyze"

def analyze_image(image_path: str, prompt: str):
    try:
        with open(image_path, "rb") as image_file:
            encoded_string = base64.b64encode(image_file.read()).decode('utf-8')
        
        data = {
            "image": encoded_string,
            "prompt": prompt
        }
        
        response = requests.post(VISION_SERVER_URL, json=data)
        response.raise_for_status()
        
        return response.json()["analysis"]
    except Exception as e:
        print(f"Erro ao analisar imagem: {e}")
        return None

# Uso:
# Supondo que você tenha uma imagem 'documento.png' no mesmo diretório
analysis = analyze_image("documento.png", "Extraia o nome do paciente e o valor total deste orçamento.")
if analysis:
    print(analysis)

```
