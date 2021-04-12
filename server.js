const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const formatMessage = require('./utils/messages');
const { response } = require('express');

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

app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

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
  let sql = 'CREATE TABLE users(id int AUTO_INCREMENT, first_name VARCHAR(255), last_name VARCHAR(255), email VARCHAR(255), password VARCHAR(255), admin BOOLEAN NOT NULL DEFAULT 0, avatar_url VARCHAR(255), PRIMARY KEY(id))';

  db.query(sql, (err, result) => {
    if(err) throw err;
    console.log(result);
    res.send('Users table created...')
  });
});

// Create users
app.post('/sign_up', (req, res) => {
  let firstName = req.body.firstName;
  let lastName = req.body.lastName;
  let email = req.body.email;
  let password = req.body.password;
  let confirmPassword = req.body.confirmPassword;
  let user = {first_name: firstName, last_name: lastName, email: email, password: password};
  let sql = 'INSERT INTO users SET ?';
  let query = db.query(sql, user, (err, result) => {
    if(err) throw err;
    console.log(result);
    res.send(`${firstName} added to the database...`);
  });
});

// User log in
app.post('/login', (req, res) => {
  let email = req.body.email;
  let password = req.body.password;
  let sql = 'SELECT * FROM users WHERE email = ? AND password = ?';
  if (email && password){
    db.query(sql, [email, password], (err, result) => {
      if (result.length > 0){
        req.session.loggedin = true;
        req.session.email = email;
        res.redirect('/user_dashboard');
      } else {
        res.send('Incorrect Username and/or Password!');
      }
      res.end();
    });
  } else {
    res.send('Please enter Username and Password!');
    res.end();
  }
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