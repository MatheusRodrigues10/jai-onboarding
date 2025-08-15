const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    // Mongoose 6+ não precisa mais dessas opções
    const conn = await mongoose.connect(process.env.MONGO_URI);

    console.log(`MongoDB conectado: ${conn.connection.host}`);
  } catch (error) {
    console.error("Erro na conexão com MongoDB:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
