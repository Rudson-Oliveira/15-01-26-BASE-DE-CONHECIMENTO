# Guia de Backup e Restauração - Autonomia Hospitalar Saúde

**Versão:** 1.0.0
**Data:** 17/01/2026
**Autor:** Manus AI

---

## 1. Visão Geral da Estratégia

Este guia detalha o processo completo para realizar o backup de todos os componentes críticos do sistema e, mais importante, para restaurar todo o ecossistema do zero em uma nova máquina. A estratégia se baseia em três pilares: **Código Versionado (GitHub)**, **Dados Persistentes (Backups SQL)** e **Configuração Automatizada (Scripts PowerShell)**.

### Componentes Críticos para Backup

| Componente | O Que Fazer Backup | Ferramenta/Método |
|---|---|---|
| **Código Fonte** | Todos os repositórios | `git push` regular |
| **Base de Conhecimento** | Repositório `15-01-26-BASE-DE-CONHECIMENTO` | `git push` regular |
| **Banco de Dados** | Dump do banco de dados MySQL `hospitalar_db` | `mysqldump` |
| **Configurações** | Arquivos `.env` e configurações de agentes | Salvos no GitHub (sem senhas) |
| **Workflows N8N** | Exportação dos workflows em JSON | Manual ou via API N8N |

---

## 2. Procedimento de Backup

### 2.1. Backup do Código Fonte e Base de Conhecimento (Contínuo)

Esta é a parte mais simples. **Qualquer alteração** no código ou na documentação deve ser imediatamente commitada e enviada ao GitHub.

```bash
# Exemplo de commit
git add .
git commit -m "feat: Descrição da nova funcionalidade"
git push origin master
```

**Repositórios Principais:**
- `https://github.com/Rudson-Oliveira/13-01-26-Sistema`
- `https://github.com/Rudson-Oliveira/15-01-26-BASE-DE-CONHECIMENTO`
- `https://github.com/Rudson-Oliveira/projeto-2026-autonomia`

### 2.2. Backup do Banco de Dados MySQL (Diário/Semanal)

Este é o backup mais crítico. Deve ser executado regularmente e o arquivo de backup armazenado em um local seguro (ex: Google Drive, S3).

```powershell
# Comando para ser executado no ambiente local, via COMET Bridge
docker exec hospitalar_db mysqldump -u root -pSUA_SENHA_ROOT hospitalar_db > C:\backups\hospitalar_db_backup_%DATE:~-4,4%%DATE:~-10,2%%DATE:~-7,2%.sql
```

**Nota:** Substitua `SUA_SENHA_ROOT` pela senha correta do banco de dados, que pode ser encontrada no arquivo `docker-compose.yaml`.

---

## 3. Procedimento de Restauração Completa (Do Zero)

Este guia assume uma nova máquina Windows com PowerShell de Administrador.

### Passo 1: Instalação dos Pré-requisitos

1.  **Git for Windows:** [https://git-scm.com/download/win](https://git-scm.com/download/win)
2.  **Docker Desktop:** [https://www.docker.com/products/docker-desktop/](https://www.docker.com/products/docker-desktop/)
3.  **Python:** [https://www.python.org/downloads/](https://www.python.org/downloads/) (Marcar a opção "Add Python to PATH")
4.  **ngrok:** [https://ngrok.com/download](https://ngrok.com/download) (Descompacte e adicione ao PATH do sistema)

### Passo 2: Configuração do Token de API do GitHub

Para evitar problemas de autenticação, configure o token de API do GitHub.

```powershell
# Configure seu token pessoal do GitHub
$env:GH_TOKEN="SEU_TOKEN_GITHUB_AQUI"
```

### Passo 3: Clonar o Repositório de Autonomia

Este repositório contém todos os scripts de instalação.

```powershell
cd C:\Users\rudpa\Documents
git clone https://github.com/Rudson-Oliveira/projeto-2026-autonomia.git
```

### Passo 4: Executar o Script de Instalação Universal

Este script irá configurar e iniciar todos os agentes locais (COMET Bridge, ngrok, etc.).

```powershell
# Navegue até a pasta de scripts
cd C:\Users\rudpa\Documents\projeto-2026-autonomia\scripts

# Execute o instalador com permissão de bypass
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
.\instalar_e_iniciar.ps1
```

Ao final, duas janelas serão abertas: uma para o **COMET Bridge** e outra para o **ngrok**. Copie a URL do ngrok (ex: `https://xxxx.ngrok-free.dev`) para usar na comunicação com o Manus.

### Passo 5: Restaurar o Ambiente Docker do Hospitalar

1.  Clone o repositório do sistema `hospitalar_v2`.

    ```powershell
    cd C:\Users\rudpa\Documents\hospitalar
    git clone https://github.com/Rudson-Oliveira/13-01-26-Sistema.git hospitalar_v2
    ```

2.  Inicie os containers Docker.

    ```powershell
    cd C:\Users\rudpa\Documents\hospitalar\hospitalar_v2
    docker-compose up -d
    ```

### Passo 6: Restaurar o Banco de Dados

1.  Copie o arquivo de backup SQL mais recente para a pasta `C:\backups\`.
2.  Execute o comando de restauração via PowerShell.

    ```powershell
    # Certifique-se de que o container hospitalar_db está rodando
docker exec -i hospitalar_db mysql -u root -pSUA_SENHA_ROOT hospitalar_db < C:\backups\NOME_DO_ARQUIVO_DE_BACKUP.sql
    ```

### Passo 7: Instalar o Módulo de IA no Laravel

Execute o script de instalação do módulo de IA que foi clonado no Passo 3.

```powershell
cd C:\Users\rudpa\Documents\projeto-2026-autonomia\laravel-ia-module

# Execute o instalador
.\install_ia_module.ps1
```

Após a execução, siga os **passos manuais** indicados pelo script para registrar o `Provider` e as `rotas`, e para limpar o cache do Laravel.

### Passo 8: Validação Final

1.  **Sistema Hospitalar:** Acesse `http://localhost:8888` e verifique se a aplicação está online.
2.  **API de IA:** Teste o endpoint de health check: `curl http://localhost:8888/api/ia/health`.
3.  **Agentes Locais:** Verifique se o COMET Bridge (`http://localhost:5000/health`) e outros agentes estão respondendo.
4.  **Conexão com Manus:** Informe a nova URL do ngrok ao Manus e teste a comunicação.

Seguindo estes passos, todo o ecossistema pode ser restaurado de forma confiável e automatizada, minimizando o tempo de inatividade e garantindo a integridade do projeto.
