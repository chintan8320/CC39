require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const userRoutes = require('./routes/userRoutes');

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use('/api/users', userRoutes);

// Database Connection
mongoose.connect('mongodb+srv://chintan19:chintan1910@chintan.k5i9s.mongodb.net/', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

// Start Server
const PORT = 3333;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
