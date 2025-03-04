const mongoose = require('mongoose');
const User = require('./models/User'); // Adjust path if needed
require('dotenv').config();

// Connect to MongoDB
mongoose.connect('mongodb+srv://chintan19:chintan1910@chintan.k5i9s.mongodb.net/', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

// Sample users
const users = [
  { name: "Alice", company: "TechCorp", role: "Developer", status: "Active", isVerified: true },
  { name: "Bob", company: "Innovate Ltd", role: "Manager", status: "Inactive", isVerified: false },
  { name: "Charlie", company: "Startup Inc", role: "Designer", status: "Active", isVerified: true },
  { name: "David", company: "CodeLab", role: "Engineer", status: "Active", isVerified: false },
  { name: "Eve", company: "AI Solutions", role: "Data Scientist", status: "Pending", isVerified: true },
  { name: "Frank", company: "WebPros", role: "DevOps", status: "Active", isVerified: false }
];

// Insert data
User.insertMany(users)
  .then(() => {
    console.log("Users added successfully");
    mongoose.connection.close(); // Close connection after inserting
  })
  .catch(err => console.error(err));
