require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const companyRoutes = require('./routes/companyRoutes');
const cors = require('cors');

const app = express();

app.use(cors());
// Conectar ao banco
connectDB();

// Middleware para ler JSON no body
app.use(express.json());

// Rotas
app.use('/api/companies', companyRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
