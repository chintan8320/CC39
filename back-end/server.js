require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const userRoutes = require('./routes/userRoutes');

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

const locations = [
  { lat: 37.7749, lng: -122.4194 },
  { lat: 40.7128, lng: -74.0060 },
  { lat: 34.0522, lng: -118.2437 },
  { lat: 51.5074, lng: -0.1278 },
  { lat: 48.8566, lng: 2.3522 }
];

let index = 0;

// Routes
app.use('/api/users', userRoutes);
app.get("/live-location", (req, res) => {
  const location = locations[index % locations.length];
  index++;
  res.json(location);
});

// Database Connection
mongoose.connect('mongodb+srv://chintan19:chintan1910@chintan.k5i9s.mongodb.net/', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

// Start Server
const PORT = 3333;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
