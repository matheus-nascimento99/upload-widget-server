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
- [Prisma ORM](https://www.prisma.io/)
- [CSV Export](https://www.npmjs.com/package/fast-csv)
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

### 3. Gere as tabelas com Prisma

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

## 📁 Estrutura básica

```
upload-widget-server/
├── src/
│   ├── routes/            # Rotas da API (upload, listagem, exportação)
│   ├── database/          # Configurações do Prisma
│   ├── utils/             # Funções auxiliares (ex: cursor, exportação)
│   └── server.ts          # Inicialização do servidor Fastify
├── prisma/
│   ├── schema.prisma      # Definição do modelo do banco
├── .env                   # Variáveis de ambiente
├── package.json
└── README.md
```

---

## 🧪 Testes

Os testes cobrem os principais fluxos de upload e listagem. Eles utilizam a biblioteca **Vitest** para execução e assertions.

---

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](./LICENSE) para mais detalhes.

---

## 🤝 Contribuindo

Contribuições são bem-vindas! Fique à vontade para abrir issues ou pull requests.
