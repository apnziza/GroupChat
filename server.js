const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const mysql = require('mysql');
const formatMessage = require('./utils/messages');

// Create DB connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'password',
  database: 'group_chat'
});

// Connect
db.connect((err) => {
  if(err){
    throw err;
  }
  console.log('MySql Connected...');
});

const app = express();
const server = http.createServer(app);
const io = socketio(server);

// Create DB
app.get('/createdb', (req, res) => {
  let sql = 'CREATE DATABASE group_chat';
  db.query(sql, (err, result) => {
    if(err) throw err;
    console.log(result);
    res.send('database created...');
  });
});

// Create table
app.get('/createuserstable', (req, res) => {
  let sql = 'CREATE TABLE posts(id int AUTO_INCREMENT, first_name VARCHAR(255), last_name VARCHAR(255), email VARCHAR(255), admin BOOLEAN NOT NULL DEFAULT 0, avatar_url VARCHAR(255), PRIMARY KEY(id))';

  db.query(sql, (err, result) => {
    if(err) throw err;
    console.log(result);
    res.send('Users table created...')
  });
});


// Set static folder
app.use(express.static(path.join(__dirname, 'public')));

const botName = 'Admin';

// Run when a client connects
io.on('connection', socket => {
  // Welcome current user
  socket.emit('message', formatMessage(botName, 'Welcome to GroupChat!'));

  // Broadcast when a user connects
  socket.broadcast.emit('message', formatMessage(botName,'A user has joined the chat'));

  // Runs when a client disconnects
  socket.on('disconnect', () => {
    io.emit('message', formatMessage(botName,'A user has left the chat'));
  });

  // Listen for chatMessage
  socket.on('chatMessage', (msg) => {
    io.emit('message', formatMessage('USER', msg));
  });
});

const PORT = 3000 || process.env.PORT;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));