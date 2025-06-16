const fs = require('fs');
const path = require('path');

// Arrays de dados em português
const categorias = [
  'Eletrônicos',
  'Roupas',
  'Casa e Decoração',
  'Esportes',
  'Livros',
  'Brinquedos',
  'Beleza',
  'Alimentos',
  'Jardinagem',
  'Automotivo'
];

const adjetivos = [
  'Premium',
  'Elegante',
  'Moderno',
  'Clássico',
  'Esportivo',
  'Luxuoso',
  'Econômico',
  'Sustentável',
  'Inovador',
  'Tradicional'
];

const nomes = [
  'Smartphone',
  'Notebook',
  'Camiseta',
  'Tênis',
  'Mesa',
  'Cadeira',
  'Bola',
  'Raquete',
  'Romance',
  'Boneca',
  'Perfume',
  'Chocolate',
  'Vaso',
  'Pneu',
  'Fone de Ouvido'
];

// Função para gerar um número aleatório entre min e max
function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Função para gerar um preço aleatório em reais
function getRandomPrice() {
  return (Math.random() * 1000 + 10).toFixed(2);
}

// Função para gerar uma descrição em português
function generateDescription(categoria, nome, adjetivo) {
  const descricoes = [
    `Produto ${adjetivo.toLowerCase()} da categoria ${categoria.toLowerCase()}.`,
    `Excelente ${nome.toLowerCase()} ${adjetivo.toLowerCase()} para sua casa.`,
    `${nome} ${adjetivo} de alta qualidade.`,
    `O melhor ${nome.toLowerCase()} ${adjetivo.toLowerCase()} do mercado.`,
    `${nome} ${adjetivo} com garantia de satisfação.`
  ];
  return descricoes[Math.floor(Math.random() * descricoes.length)];
}

// Gerar 100 produtos
const produtos = Array.from({ length: 100 }, (_, index) => {
  const categoria = categorias[Math.floor(Math.random() * categorias.length)];
  const nome = nomes[Math.floor(Math.random() * nomes.length)];
  const adjetivo = adjetivos[Math.floor(Math.random() * adjetivos.length)];
  
  return {
    id: index + 1,
    name: `${nome} ${adjetivo}`,
    description: generateDescription(categoria, nome, adjetivo),
    price: parseFloat(getRandomPrice()),
    category: categoria,
    stock: getRandomNumber(0, 100),
    rating: (Math.random() * 5).toFixed(1),
    image: `https://picsum.photos/seed/${index + 1}/400/400`
  };
});

// Criar o objeto do banco de dados
const db = {
  products: produtos,
  users: [
    {
      id: 1,
      name: "Usuário Teste",
      email: "teste@exemplo.com"
    }
  ],
  notifications: [
    {
      id: 1,
      title: "Bem-vindo!",
      message: "Bem-vindo ao nosso aplicativo de produtos.",
      read: false
    }
  ]
};

// Salvar no arquivo db.json
const dbPath = path.join(__dirname, '..', 'db.json');
fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));

console.log('Dados gerados com sucesso em db.json!'); 