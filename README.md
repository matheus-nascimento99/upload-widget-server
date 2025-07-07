# Upload Widget Server

Servidor backend desenvolvido em **Fastify** para gerenciar uploads de arquivos. A aplicação permite:

- Adicionar novos uploads
- Listar uploads com suporte a paginação via cursores (alta performance)
- Exportar uploads para arquivos CSV

O banco de dados utilizado é **PostgreSQL**.

## 📦 Funcionalidades

- 📁 Upload de arquivos
- 📄 Listagem de uploads com paginação baseada em cursores
- 📤 Exportação de dados em formato CSV
- ✅ Testes automatizados

## 🚀 Tecnologias

- [Fastify](https://fastify.dev/)
- [PostgreSQL](https://www.postgresql.org/)
- [Drizzle ORM](https://www.prisma.io/)
- [CSV Stringify](https://www.npmjs.com/package/csv-stringify)
- [Vitest](https://vitest.dev/) para testes

---

## ⚙️ Como rodar o projeto

### 1. Clone o repositório

```bash
git clone https://github.com/matheus-nascimento99/upload-widget-server.git
cd upload-widget-server
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Gere as tabelas com Drizzle

```bash
npm run db:generate
```

### 4. Rode as migrations

```bash
npm run db:migrate
```

> Certifique-se de configurar corretamente o banco de dados PostgreSQL no arquivo `.env`.

### 5. Inicie o servidor em modo desenvolvimento

```bash
npm run dev
```

O servidor será iniciado por padrão na porta `3333`.

### 6. Executar os testes

```bash
npm run test
```

---

## 🧪 Testes

Os testes cobrem os principais fluxos de upload, listagem e exportação para CSV. Eles utilizam a biblioteca **Vitest** para execução e assertions.
