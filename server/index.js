const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');
const { authenticateToken, authenticateSocket } = require('./middleware');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());

require('dotenv').config({ path: "./.env" });
console.log("MONGO_URI:", process.env.MONGO_URI);

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.error("MongoDB Error:", err));

//Express server
const PORT = 4000;
const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});


// Create a notification model
const notificationSchema = new mongoose.Schema({
  userId: String,
  message: String,
  timestamp: { type: Date, default: Date.now },
  isRead: { type: Boolean, default: false },
  type: String,
});
const Notification = mongoose.model('Notification', notificationSchema);


const io = new Server(server, {
  cors: {
    origin: "*", // Allow CORS for all origins
    methods: ["GET", "POST"]
  },
});
// authenticate websocket connection
io.use(authenticateSocket);

// handle webSocket connections
io.on('connection', (socket) => {
  console.log('A user connected');  
  const userId = socket.user.userId; 
  socket.join(userId);

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

app.get('/notifications', authenticateToken, async (req, res) => {
  try {    
    const notifications = await Notification.find({ userId: req.user.userId });    
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve notifications' });
  }
});

app.post('/notifications', authenticateToken, async (req, res) => {
  try {
    const { userId, message, type } = req.body;
    // Create a new notification
    const notification = new Notification({ userId, message, type });
    await notification.save();
    
    io.to(userId).emit('notification', notification);

    res.status(201).json(notification);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create notification' });
  }
});


app.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (username === 'Alish' && password === 'password') {   
    const user = { userId: 'user1', username }; 
    const accessToken = jwt.sign(user, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });
    res.json({ accessToken });
  } else if (username === 'Simran' && password === 'password2') {    
    const user = { userId: 'user2', username }; 
    const accessToken = jwt.sign(user, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });
    res.json({ accessToken });
  } else {
    res.status(401).json({ error: 'Invalid credentials' });
  }
});