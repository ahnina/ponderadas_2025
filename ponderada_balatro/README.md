# Balatro Clone

Um jogo inspirado em Balatro desenvolvido com React Native (Expo) e Node.js.

## 🎮 Sobre o Jogo

Balatro Clone é um jogo de cartas roguelike que combina elementos de poker com mecânicas únicas de modificadores. Os jogadores constroem mãos de cartas e usam modificadores especiais (Jokers, Planetas e Cartas de Tarot) para maximizar suas pontuações.

## 🚀 Características

### Frontend (React Native + Expo)
- ✅ Interface mobile moderna e responsiva
- ✅ Navegação com Expo Router
- ✅ Componentes reutilizáveis
- ✅ Design inspirado no jogo original
- ✅ Sistema de cartas interativo
- ✅ Loja de modificadores

### Backend (Node.js + Express)
- ✅ API RESTful completa
- ✅ Geração de dados com Faker.js
- ✅ TypeScript para type safety
- ✅ Estrutura modular e escalável
- ✅ Documentação da API

### Funcionalidades do Jogo
- ✅ Sistema de cartas (52 cartas padrão)
- ✅ Mecânicas de Jokers, Planetas e Tarot
- ✅ Sistema de pontuação dinâmico
- ✅ Loja para compra de modificadores
- ✅ Gerenciamento de estado do jogo
- ✅ Interface de usuário intuitiva

## 📱 Tecnologias Utilizadas

### Frontend
- React Native
- Expo
- Expo Router
- TypeScript
- Faker.js (para dados mockados)

### Backend
- Node.js
- Express.js
- TypeScript
- Faker.js
- CORS

## 🛠️ Instalação e Configuração

### Pré-requisitos
- Node.js (versão 16 ou superior)
- npm ou yarn
- Expo CLI
- Expo Go (para testar no dispositivo)

### 1. Clone o repositório
```bash
git clone <repository-url>
cd ponderada_balatro
```

### 2. Configurar o Backend
```bash
cd backend
npm install
npm run build
npm run dev
```

O backend estará rodando em `http://localhost:3001`

### 3. Configurar o Frontend
```bash
cd frontend
npm install
npx expo start
```

### 4. Testar o Aplicativo
- Instale o Expo Go no seu dispositivo móvel
- Escaneie o QR code que aparece no terminal
- Ou use um emulador Android/iOS

## 🎯 Como Jogar

1. **Iniciar o Jogo**: O jogo começa com 5 cartas na mão e $4
2. **Selecionar Cartas**: Toque nas cartas para selecioná-las
3. **Jogar Mão**: Use o botão "Play Hand" para jogar as cartas selecionadas
4. **Comprar Cartas**: Use "Draw Cards" para comprar mais cartas
5. **Descartar**: Use "Discard" para descartar cartas selecionadas
6. **Loja**: Acesse a loja para comprar modificadores especiais

### Modificadores

#### 🃏 Jokers
- Efeitos especiais que modificam o jogo
- Diferentes raridades (comum, incomum, raro, lendário)
- Custo variável baseado na raridade

#### 🌍 Planetas
- Multiplicadores de pontuação
- Efeitos específicos por naipe
- Ativos durante toda a partida

#### 🔮 Cartas de Tarot
- Efeitos únicos e poderosos
- Transformações de cartas
- Efeitos temporários

## 📚 API Endpoints

### Game
- `GET /api/game/initial` - Estado inicial do jogo
- `GET /api/game/settings` - Configurações do jogo
- `POST /api/game/play-hand` - Jogar uma mão
- `GET /api/game/draw-cards` - Comprar cartas

### Shop
- `GET /api/shop/jokers` - Jokers disponíveis
- `GET /api/shop/planets` - Planetas disponíveis
- `GET /api/shop/tarot` - Cartas de Tarot disponíveis
- `POST /api/shop/purchase` - Comprar modificador

### Health
- `GET /api/health` - Status da API

## 🎨 Estrutura do Projeto

```
ponderada_balatro/
├── frontend/
│   ├── app/                 # Expo Router pages
│   │   ├── components/          # Componentes React Native
│   │   ├── services/           # Serviços de API
│   │   ├── types/              # Definições TypeScript
│   │   └── assets/             # Recursos estáticos
│   ├── backend/
│   │   ├── src/
│   │   │   ├── controllers/    # Controladores da API
│   │   │   ├── models/         # Modelos e tipos
│   │   │   ├── routes/         # Rotas da API
│   │   │   ├── services/       # Lógica de negócio
│   │   │   └── server.ts       # Servidor principal
│   │   └── dist/               # Código compilado
│   └── README.md
```

## 🔧 Scripts Disponíveis

### Backend
```bash
npm run dev      # Desenvolvimento com hot reload
npm run build    # Compilar TypeScript
npm start        # Produção
```

### Frontend
```bash
npx expo start   # Iniciar servidor de desenvolvimento
npx expo start --android  # Android
npx expo start --ios      # iOS
npx expo start --web      # Web
```

## 🎮 Funcionalidades Implementadas

- [x] Sistema de cartas completo
- [x] Interface de usuário moderna
- [x] Sistema de modificadores (Jokers, Planetas, Tarot)
- [x] Loja funcional
- [x] API RESTful completa
- [x] Navegação entre telas
- [x] Gerenciamento de estado
- [x] Design responsivo
- [x] Dados mockados com Faker.js



## Lógica do Jogo

### 1. Pontuação
- Ao jogar cartas, a pontuação é a soma dos valores das cartas selecionadas.
- **Bônus:**
  - +50% se jogar 3 ou mais cartas.
  - +10 pontos por cada sequência (ex: 4,5,6).
- **Modificadores** podem multiplicar ou adicionar pontos às cartas.
- O multiplicador de pontuação final é aplicado ao score total da mão (ex: "Multiplies score by 2x").

### 2. Dinheiro
- O dinheiro é calculado como `Math.floor(score / 10)` ao jogar uma mão.
- Comprar modificadores na loja desconta dinheiro global.
- O dinheiro é sincronizado entre todas as telas via sistema global e backend.

### 3. Modificadores
- **Jokers:** Efeitos variados, geralmente multiplicadores ou bônus.
- **Planets:** Multiplicadores ou efeitos especiais para naipes ou figuras.
- **Tarot:** Efeitos transformadores ou multiplicadores globais.
- **Aplicação:**
  - Transformações (ex: "All face cards become aces") mudam o valor base da carta.
  - Multiplicadores (ex: "Hearts worth double points") multiplicam o valor.
  - Bônus (ex: "Adds +5 to all cards") somam ao valor.
  - **Ordem:** transformações → multiplicadores → bônus.

### 4. Sincronização
- O estado do jogo (mão, deck, modificadores, dinheiro) é mantido no backend.
- O frontend busca e sincroniza o estado via API.
- O dinheiro é sincronizado em tempo real entre telas.

---
## Agradecimentos

- Inspirado no jogo original Balatro
- Desenvolvido como projeto acadêmico
- Utiliza tecnologias modernas de desenvolvimento mobile

## Demonstração

[Demonstração do app](https://drive.google.com/file/d/1R67kBPfcopOU0aosBqpnjWCCdZH8XnXC/view?usp=sharing)

[Explicação do projeto](https://drive.google.com/file/d/1fO93VHQGejUXR9ke7cjjc0XHoMvm-vVV/view?usp=sharing)


*Projeto realizado com o auxílio da Cursor AI*
