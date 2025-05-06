const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const MONGO_URI = process.env.MONGO_URI;

    await mongoose.connect(MONGO_URI);

    console.log('✅ Conexión a MongoDB exitosa');
  } catch (err) {
    console.error('❌ Error al conectar con MongoDB:', err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
