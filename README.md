# Projeto Adote Fácil

## Introdução

O "Adote Fácil" é um sistema voltado para facilitar a adoção de animais. A API provê serviços para gerenciamento de usuários, autenticação, cadastro de animais e gerenciamento de chats entre os usuários. O backend é construído com Node.js e Express, utilizando middlewares para autenticação e tratamento de upload de imagens. O frontend é desenvolvido com Next.js e React, proporcionando uma interface dinâmica e responsiva.

## Tecnologias

- Node.js
- Express
- Multer (upload de arquivos)
- Axios (requisições HTTP no frontend)
- JWT (validação de tokens)
- Zod (validação dos dados no frontend)
- React (Next.js no frontend)
- Prisma (ORM no backend)
- PostgreSQL (banco de dados)

## Documentação de rotas da API

### Rotas de Usuários

- **POST `/users`**
  Cria um novo usuário.
  _Exemplo de uso:_ Envio de dados com nome, email e senha para cadastro.

- **PATCH `/users`**
  Atualiza informações do usuário autenticado.
  _Exemplo de uso:_ Atualização de dados do perfil.

### Rotas de Autenticação

- **POST `/login`**
  Autentica um usuário utilizando email e senha. Retorna um token JWT e os dados do usuário em caso de sucesso.

### Rotas de Chats

- **POST `/users/chats/messages`**
  Envia uma nova mensagem em um chat.
  _Exemplo de uso:_ Permite que o usuário envie uma mensagem para um chat existente.

- **POST `/users/chats`**
  Cria um novo chat entre usuários.
  _Exemplo de uso:_ Inicia uma conversa entre dois ou mais usuários.

- **GET `/users/chats`**
  Lista todos os chats do usuário autenticado.

- **GET `/users/chats/:chatId`**
  Recupera os detalhes de um chat específico pelo seu ID.

### Rotas de Animais

- **POST `/animals`**
  Cria um novo anúncio de animal para adoção.
  _Exemplo de uso:_ Envio de dados do animal e imagens (até 5 arquivos) utilizando o multer.

- **PATCH `/animals/:id`**
  Atualiza o status de um animal.
  _Exemplo de uso:_ Permite alterar informações como disponibilidade para adoção.

- **GET `/animals/available`**
  Lista os animais disponíveis para adoção.
  _Exemplo de uso:_ Permite filtragem por gênero, tipo e nome.

- **GET `/animals/user`**
  Recupera os animais associados ao usuário autenticado.

## Tutorial de implantação

Certifique-se de ter o Docker e o Docker Compose instalados na sua máquina. Antes de iniciar o sistema, crie os arquivos .env nos diretórios /backend e /frontend baseando-se nos respectivos arquivos .env.example de cada um destes dois diretórios. Perceba que o conteúdo deles é diferente um do outro.

O arquivo .env.example do backend já contém as variáveis usadas pelo Docker Compose para criar os containers do banco e do backend com os valores corretos, então basta replicá-los. Caso queira, é possível alterá-las também.

As portas de execução do backend e frontend estão hardcoded no arquivo `docker-compose.yml`. O backend executa na porta 8080 e o frontend na porta 3000. É possível alterar estes valores, só tomando cuidado para refletir as alterações nas variáveis de ambiente das APIs.

Para subir os containers, entre na pasta /backend e execute o comando:
```shell
docker compose up
```

Em seguida, basta acessar a url http://localhost:3000 para ter acesso à plataforma (caso tenha trocado a porta de execução do frontend, altere o 3000 para a porta no qual o frontend está executando).

## Testes de Aceitação com Selenium

Este projeto contém **8 cenários de teste** distribuídos em **5 histórias de usuário**, desenvolvidos com **Selenium WebDriver** e **Mocha**, executados no **Chrome em modo headless**.

Todos os testes estão organizados na pasta `tests/` na raiz do projeto.

### Estrutura

```
tests/
├── helpers.mjs
├── us01_criar_conta.test.mjs
├── us02_cadastrar_animal.test.mjs
├── us03_procurar_pet.test.mjs
└── us04_navegacao_logout.test.mjs
```

- `helpers.mjs`: Funções auxiliares para criar o driver, realizar login, cadastro e gerar e-mails únicos para teste.
- `us01_criar_conta`: Testa o cadastro de usuário (sucesso e tentativa com e-mail duplicado).
- `us02_cadastrar_animal`: Testa o cadastro de animal com foto e seleção de tipo/gênero, além de validação de campos obrigatórios.
- `us03_procurar_pet`: Testa a busca com filtros (tipo, gênero) e o cenário de filtro sem resultados.
- `us04_navegacao_logout`: Testa a navegação pelo menu lateral e o logout do sistema.

### Como Funciona

Os testes simulam interações reais do usuário no navegador, como preenchimento de formulários, upload de imagens, cliques em menus e navegação entre páginas.
Cada cenário valida comportamentos esperados, como:

- Redirecionamentos de URL
- Exibição de mensagens de erro ou sucesso
- Validação de campos obrigatórios
- Funcionamento dos filtros de busca
- Navegação pelo menu lateral e logout

### Como Executar

1. Certifique-se de que a aplicação está rodando:
   - Frontend: `http://localhost:3000`
   - Backend: `http://localhost:8080`

2. No diretório raiz do projeto, execute:

```bash
npm test
```
