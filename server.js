const express = require('express');
const app = express();
require('dotenv').config();

app.use(express.json());

const customersRoute = require('./routes/customers');
const petsRoute = require('./routes/pets');
const productsRoute = require('./routes/products');

app.use('/api/customers', customersRoute);
app.use('/api/pets', petsRoute);
app.use('/api/products', productsRoute);

app.get('/', (req, res) => {
  res.send('Happy Paws Petshop API is running 🐾');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});