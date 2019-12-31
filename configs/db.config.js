const mongoose = require('mongoose');

const PASSWORD = process.env.MB_PASSWORD;
const MONGODB_URI = `mongodb+srv://moigarcia:${PASSWORD}@porra-litris-3akgn.gcp.mongodb.net/test?retryWrites=true&w=majority`;

mongoose.connect(MONGODB_URI, { useCreateIndex: true, useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.info(`Connected to the database: ${MONGODB_URI}`)
  })
  .catch(error => {
    console.error('Database connection error:', error);
  });