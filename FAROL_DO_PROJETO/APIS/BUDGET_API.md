# 🔌 API: Budget API v1.0

**Origem:** `SISTEMA-AUTONOMO-31-12-25`

## 1. Descrição

A Budget API é um microserviço RESTful completo para a gestão de orçamentos hospitalares. Ela foi construída com FastAPI, o que garante alta performance e documentação automática (Swagger UI).

## 2. Principais Endpoints

| Método | Endpoint | Descrição |
|---|---|---|
| `GET` | `/orcamentos` | Lista todos os orçamentos com filtros |
| `POST` | `/orcamentos` | Cria um novo orçamento com itens |
| `GET` | `/orcamentos/{id}` | Obtém os detalhes de um orçamento |
| `PUT` | `/orcamentos/{id}` | Atualiza o status de um orçamento |
| `DELETE` | `/orcamentos/{id}` | Cancela um orçamento |
| `GET` | `/orcamentos/{id}/pdf` | Gera uma versão em PDF do orçamento |
| `GET` | `/health` | Verifica a saúde da API e do banco de dados |

## 3. Como Utilizar

A API deve ser containerizada e exposta através do Traefik. Qualquer agente ou serviço que precise interagir com os orçamentos deve fazer chamadas para esta API.

**Exemplo de Criação de Orçamento (Python `requests`):**

```python
import requests

BUDGET_API_URL = "http://localhost:8001/orcamentos"

new_budget = {
    "paciente_nome": "João da Silva",
    "paciente_cpf": "123.456.789-00",
    "medico_responsavel": "Dr. House",
    "data_validade": "2026-12-31",
    "itens": [
        {
            "descricao": "Consulta Médica",
            "quantidade": 1,
            "valor_unitario": 350.00,
            "categoria": "Serviços"
        },
        {
            "descricao": "Raio-X do Tórax",
            "quantidade": 1,
            "valor_unitario": 150.00,
            "categoria": "Exames"
        }
    ]
}

response = requests.post(BUDGET_API_URL, json=new_budget)

if response.status_code == 201:
    print("Orçamento criado com sucesso!")
    print(response.json())

```

## 4. Código Fonte Reutilizável

O código completo da API está no arquivo `backend/api/budget_api.py` do repositório `SISTEMA-AUTONOMO-31-12-25`. Ele serve como um excelente template para a criação de novas APIs de microserviços com FastAPI e Pydantic.
