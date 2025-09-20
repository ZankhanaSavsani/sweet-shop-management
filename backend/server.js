const mongoose = require('mongoose');
const app = require('./app');

const PORT = process.env.PORT || 5000;
const DB = process.env.DATABASE 
  ? process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD || '')
  : 'mongodb://localhost:27017/sweetshop';

mongoose.connect(DB).then(() => {
  console.log('DB connection successful');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});