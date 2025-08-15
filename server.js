require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const cors = require("cors"); // <- importa cors
const companyRoutes = require("./routes/companyRoutes");
const authRoutes = require("./routes/authRoutes");

const app = express();

// Middleware CORS para liberar qualquer origem
app.use(
  cors({
    origin: "*", // permite qualquer origem
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: "*", // headers permitidos
    credentials: true, // se precisar enviar cookies
  })
);

// Responde automaticamente a requisições OPTIONS (preflight)
app.options("*", cors());

// Middleware para ler JSON e urlencoded com limite aumentado
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// Middleware de log para debug (opcional)
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Rotas da API
app.use("/api/auth", authRoutes);
app.use("/api/companies", companyRoutes);

// Rota de teste
app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    message: "JAI API funcionando!",
    timestamp: new Date().toISOString(),
  });
});

// Servir frontend do React
const clientPath = path.join(__dirname, "client", "dist");
app.use(express.static(clientPath));

// Para qualquer rota que não seja da API, devolve o index.html
app.get("*", (req, res) => {
  res.sendFile(path.join(clientPath, "index.html"));
});

// Middleware de tratamento de erros global
app.use((err, req, res, next) => {
  console.error("Erro global:", err.stack);
  res.status(500).json({
    error: "Algo deu errado!",
    ...(process.env.NODE_ENV === "development" && { details: err.message }),
  });
});

// Conectar ao MongoDB e iniciar servidor
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB conectado com sucesso!");

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`Servidor rodando na porta ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Erro ao conectar MongoDB:", err);
    process.exit(1);
  });
