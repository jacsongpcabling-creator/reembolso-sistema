# 🚗 Sistema de Reembolso de Quilometragem

Sistema web para controle de reembolso de quilometragem e NFs, com cálculo automático (km × valor por km), edição de endereços de origem/destino e exportação em **Excel** e **PDF**.

Desenvolvido para a **Gp Cabling And Security Solutions**.

---

## ✨ Funcionalidades

- 📎 **Cadastro de NFs** — adicione cada nota com número, estabelecimento, endereço de destino, data, km rodado, valor e observações
- ✏️ **Endereços editáveis** — altere o endereço de origem e de destino quando necessário
- 🚗 **Cálculo automático** — o valor do reembolso é calculado por fórmula (km × valor por km)
- 💾 **Persistência em banco de dados** — os dados ficam no servidor (SQLite), acessíveis de qualquer dispositivo
- 📊 **Exportar Excel** — gera arquivo `.xlsx` com cabeçalho, dados e totais
- 📄 **Exportar PDF** — gera relatório `.pdf` formatado com tabela e totais

---

## 📁 Estrutura do Projeto
```
reembolso-sistema/
├── server.js          # Backend (Node.js + Express + SQLite)
├── package.json       # Dependências e scripts
├── .gitignore         # Arquivos ignorados pelo Git
├── README.md          # Este arquivo
└── public/
    └── index.html     # Frontend (interface do sistema)
```

---

## 🛠️ Requisitos

- [Node.js](https://nodejs.org) versão 16 ou superior
- Conta no [GitHub](https://github.com)
- Conta no [Render](https://render.com) (gratuita)

---

## 💻 Rodando Localmente

### 1. Clone ou crie o projeto
```bash
# Crie a pasta do projeto
mkdir reembolso-sistema
cd reembolso-sistema
```

### 2. Inicialize o projeto e instale as dependências
```bash
npm init -y
npm install express sqlite3
```

### 3. Adicione os arquivos

Coloque o `server.js` na raiz e o `index.html` dentro da pasta `public/`.

### 4. Crie o arquivo `.gitignore`
```gitignore
node_modules/
reembolso.db
```

### 5. Rode o servidor
```bash
node server.js
```

Acesse **http://localhost:3000** no navegador.

---

## 🚀 Deploy no Render

### Passo 1 — Suba o código para o GitHub

1. Crie um repositório no GitHub (ex: `reembolso-sistema`)
2. Envie os arquivos do projeto:
```bash
git init
git add .
git commit -m "Sistema de reembolso de quilometragem"
git branch -M main
git remote add origin https://github.com/SEU_USUARIO/reembolso-sistema.git
git push -u origin main
```

### Passo 2 — Crie o Web Service no Render

1. Acesse [render.com](https://render.com) e faça login
2. Clique em **"New +"** → **"Web Service"**
3. Conecte sua conta do GitHub e selecione o repositório `reembolso-sistema`

### Passo 3 — Configure o serviço

| Campo | Valor |
|---|---|
| **Name** | `reembolso-sistema` |
| **Environment** | `Node` |
| **Region** | `São Paulo (South America)` |
| **Branch** | `main` |
| **Build Command** | `npm install` |
| **Start Command** | `node server.js` |
| **Instance Type** | `Free` |

### Passo 4 — Faça o deploy

1. Clique em **"Create Web Service"**
2. O Render instala as dependências e sobe o site automaticamente
3. Em ~2 minutos você recebe um link público, ex: `https://reembolso-sistema.onrender.com`

---

## ⚠️ Importante: Persistência de Dados no Render

O plano **Free** do Render usa **disco temporário** — os arquivos do servidor (incluindo o banco SQLite `reembolso.db`) são **apagados a cada deploy ou reinício**. Isso significa que os dados podem ser perdidos.

### Opções para dados persistentes

| Opção | Custo | Descrição |
|---|---|---|
| **Plano Starter** | US$ 7/mês | Adiciona um **Persistent Disk** de 1 GB — os dados sobrevivem a reinícios |
| **Supabase (PostgreSQL)** | Gratuito | Banco externo na nuvem, dados persistentes sem custo |
| **MongoDB Atlas** | Gratuito | Banco NoSQL na nuvem, dados persistentes sem custo |

> 💡 **Recomendação:** para manter o plano gratuito com dados persistentes, use **Supabase (PostgreSQL)**. Basta adaptar o `server.js` para conectar ao banco externo.

---

## 🔧 Configuração Adicional

### Alterar a porta do servidor

Por padrão, o servidor usa a porta `3000`. Para usar outra porta, defina a variável de ambiente:
```bash
PORT=8080 node server.js
```

No Render, a porta é definida automaticamente pela variável `PORT`.

### Variáveis de ambiente

| Variável | Descrição | Padrão |
|---|---|---|
| `PORT` | Porta do servidor | `3000` |

---

## 📋 Como Usar o Sistema

1. **Configure** o valor por km e o endereço de origem no topo da página
2. **Adicione cada NF** preenchendo os campos (número, estabelecimento, destino, data, km, valor, observações)
3. **Edite** os endereços de origem/destino quando necessário
4. O **valor do reembolso** é calculado automaticamente (km × valor por km)
5. Ao finalizar, clique em **"Exportar Excel"** ou **"Exportar PDF"**

---

## 🛠️ Solução de Problemas

### O site não carrega no Render

- Verifique se o **Build Command** está como `npm install`
- Verifique se o **Start Command** está como `node server.js`
- Confira os logs do serviço em **Render → seu serviço → Logs**

### Erro de dependência `sqlite3`

O pacote `sqlite3` precisa ser compilado no ambiente do Render. Se houver erro, use o pacote `better-sqlite3`:
```bash
npm install better-sqlite3
```

E ajuste o `server.js` para usar `better-sqlite3` no lugar de `sqlite3`.

### Dados sumiram após um deploy

Isso é esperado no plano **Free** (disco temporário). Use uma das opções de persistência descritas acima.

---

## 📄 Licença

Uso interno — **Gp Cabling And Security Solutions**.
