require('./models/User');
const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes');
const requireAuth = require('./middlewares/requireAuth');

dotenv.config({ path: './config.env' });

const app = express();

app.use(express.json());
app.use(authRoutes);

const MONGOURI = process.env.MONGOURI;

mongoose.connect(MONGOURI, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  useCreateIndex: true,
});

mongoose.connection.on('connected', () => {
  console.log('Connected to MongoDB instance');
});

mongoose.connection.on('error', () => {
  console.log('Error connecting to MongoDB instance');
});

app.get('/', requireAuth, (req, res) => {
  res.send('Hello');
});

const PORT = process.env.PORT;

app.listen(PORT, () => console.log(`App Listening on PORT ${PORT}`));
