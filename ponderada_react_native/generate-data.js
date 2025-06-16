const { faker } = require('@faker-js/faker');
const fs = require('fs');

// Generate 10,000 products
const products = Array.from({ length: 10000 }, (_, index) => ({
  id: index + 1,
  name: faker.commerce.productName(),
  description: faker.commerce.productDescription(),
  price: parseFloat(faker.commerce.price()),
  image: `https://picsum.photos/seed/${index}/200/300`,
  category: faker.commerce.department()
}));

// Generate some users
const users = [
  {
    id: 1,
    name: "John Doe",
    email: "john@example.com",
    password: "hashed_password_here",
    profileImage: null
  }
];

// Generate some notifications
const notifications = [
  {
    id: 1,
    userId: 1,
    title: "Welcome!",
    message: "Welcome to our app!",
    read: false,
    createdAt: new Date().toISOString()
  }
];

// Create the database object
const db = {
  products,
  users,
  notifications
};

// Write to db.json
fs.writeFileSync('db.json', JSON.stringify(db, null, 2));

console.log('Data generated successfully!'); 