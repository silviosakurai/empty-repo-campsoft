# Mania de APP

Bem-vindo ao repositório do projeto Toca Livros, um monorepo gerenciado pelo TurboRepo que hospeda as APIs `public` e `manager`. Este projeto foi configurado para facilitar o desenvolvimento, build e colaboração em múltiplas APIs sob uma única base de código.

## Pré-requisitos

Este projeto requer a versão específica do Node.js:

- Node.js `20.11.1`

Além disso, utilizamos o `pnpm` como nosso gerenciador de pacotes.

## Configuração do Ambiente

Para configurar seu ambiente de desenvolvimento, siga estes passos:

1. **Instale o Node.js**

   Certifique-se de ter a versão `20.11.1` do Node.js. Você pode usar ferramentas como `nvm` (Node Version Manager) para gerenciar múltiplas versões do Node.js na sua máquina.

2. **Instale o pnpm**

   Se você ainda não tem o `pnpm` instalado, você pode instalar globalmente via npm com o comando:

   ```sh
   npm install -g pnpm
   ```

3. **Clone o Repositório**

Faça o clone deste repositório para sua máquina local usando:

```sh
git clone https://github.com/tocalivros/node-maniadeapp-backend
```

4. **Instale as Dependências**

```sh
pnpm install
```

## Scripts Disponíveis

Este monorepo vem com vários scripts configurados para facilitar o desenvolvimento e a construção de APIs. Aqui estão os comandos disponíveis:

1. **Desenvolvimento Geral**

Para iniciar todos os projetos em modo de desenvolvimento:

```sh
pnpm run dev
```

2. **Build Geral**

Para construir todos os projetos:

```sh
pnpm run build
```

3. **Desenvolvimento e Build Específicos**

Para desenvolvimento e build de projetos específicos (`manager` ou `public`):

3.1. **Iniciar o projeto manager em modo de desenvolvimento:**

```sh
pnpm run dev:manager
```

3.2. **Construir o projeto manager:**

```sh
pnpm run build:manager
```

3.3. **Iniciar o projeto public em modo de desenvolvimento:**

```sh
pnpm run dev:public
```

3.4. **Construir o projeto public:**

```sh
pnpm run build:public
```
