require('dotenv').config();
const connectDB = require('./config/database');

// Conectar ao banco de dados
connectDB();

// Exportar modelos
module.exports = {
  Nota: require('./models/Nota')
}; 