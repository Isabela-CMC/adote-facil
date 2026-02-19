# Especificação de Requisitos - Adote Fácil

## 1. Histórias de Usuário (User Stories)

### [US01] Criar conta no sistema
**Como** uma pessoa que quer adotar ou doar um bicho,  
**quero** conseguir me cadastrar na plataforma  
**para** conseguir mandar mensagens e cadastrar pets.

* **Cenário de sucesso:** Eu preencho o formulário de cadastro com meus dados básicos e o sistema cria minha conta, me mandando direto para o login.
* **Cenário de erro:** Tentar usar um e-mail que já foi cadastrado antes. O sistema deve barrar e avisar que o e-mail já existe.

### [US02] Cadastrar novo animal
**Como** usuário logado,  
**quero** postar um anúncio de um animal com foto e informações  
**para** que outras pessoas vejam que ele está para adoção.

* **Cenário de sucesso:** Preencho o nome, tipo e gênero do pet, subo as fotos e clico em salvar. O animal aparece na lista de "Meus animais".
* **Cenário de erro:** Esquecer de preencher algum campo obrigatório ou não colocar foto. O sistema não deve deixar salvar enquanto faltar informação.

### [US03] Procurar um pet para adotar
**Como** alguém querendo um bicho de estimação,  
**quero** usar os filtros de busca  
**para** achar mais rápido o tipo de animal que eu quero (ex: só cachorros).

* **Cenário de sucesso:** Seleciono o filtro de "Gênero" ou "Tipo" e a página atualiza mostrando só os que batem com o que escolhi.
* **Cenário de erro:** Se eu filtrar por algo que não tem no banco (tipo um gato fêmea e não tiver nenhum), o site avisa que não encontrou nada.

### [US04] Trocar mensagens (Chat)
**Como** interessado em adotar,  
**quero** abrir uma conversa com o dono do animal  
**para** combinar como buscar o pet.

* **Cenário de sucesso:** Clico no botão de interesse no anúncio, mando um "Oi" e o chat abre na minha tela de "Minhas conversas".
* **Cenário de erro:** Tentar enviar uma mensagem sem escrever nada. O sistema não deve processar o envio de texto vazio.

### [US05] Navegação pelo Menu Lateral e Logout  

**Como** usuário logado,  
**quero** navegar pelas opções do menu lateral e realizar logout,  
**para** acessar as funcionalidades da plataforma e encerrar minha sessão quando desejar.

- **Cenário de sucesso (navegação):**  
  Após fazer login, clico em cada item do menu lateral (“Animais disponíveis para adoção”, “Disponibilizar animal para adoção”, “Meus animais disponíveis para adoção”, “Minhas conversas”, “Editar dados pessoais”) e sou redirecionado corretamente para a URL correspondente.

- **Cenário de sucesso (logout):**  
  Após estar logado, clico em “Sair” e sou redirecionado para a página de login (`/login`).
