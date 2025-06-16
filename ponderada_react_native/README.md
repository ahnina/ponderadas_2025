# Ponderada React Native

Este é um aplicativo React Native desenvolvido com Expo, utilizando Material Design Kit 3 e JSON Server para o backend.

## Requisitos

- Node.js (versão 14 ou superior)
- npm ou yarn
- Expo CLI
- Um emulador Android/iOS ou dispositivo físico

## Instalação

1. Clone o repositório:
```bash
git clone [URL_DO_REPOSITÓRIO]
cd ponderada_react_native_cursor
```

2. Instale as dependências:
```bash
npm install
# ou
yarn install
```

3. Inicie o servidor JSON (em um terminal separado):
```bash
npm run server
# ou
yarn server
```

4. Inicie o aplicativo:
```bash
npm start
# ou
yarn start
```

## Estrutura do Projeto

- `/app` - Código fonte do aplicativo
  - `/components` - Componentes reutilizáveis
  - `/context` - Contextos do React (Auth, etc)
  - `/screens` - Telas do aplicativo
- `db.json` - Banco de dados JSON Server

## Funcionalidades

- Autenticação de usuários
- Listagem de produtos
- Sistema de notificações
- Perfil do usuário
- Material Design Kit 3

## Tecnologias Utilizadas

- React Native
- Expo
- React Navigation
- React Native Elements (Material Design)
- JSON Server
- AsyncStorage

## Scripts Disponíveis

- `npm start` - Inicia o aplicativo
- `npm run android` - Inicia no Android
- `npm run ios` - Inicia no iOS
- `npm run web` - Inicia na web
- `npm run server` - Inicia o JSON Server 