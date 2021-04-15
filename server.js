const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const formatMessage = require('./utils/messages');
const userJoin = require('./utils/users');
const session = require('express-session');

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
let currentUserID;
let currentUserFirstName;

app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

const server = http.createServer(app);
const io = socketio(server)

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

// create endpoint for get_users
app.get("/get_users", (req, res) => {
  db.query("SELECT * FROM users", (error, users) => {
    res.end(JSON.stringify(users));
  });
});

// create endpoint for getting meesage from the db
app.get("/get_chats", (req, res) => {
  db.query("SELECT * FROM messages", (error, messages) => {
    res.end(JSON.stringify(messages));
  });
});

// Create sessions
app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));

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
        let user = JSON.parse(JSON.stringify(result[0]));
        currentUserID = user.id;
        currentUserFirstName = user.first_name;
        res.redirect('/user_dashboard.html');
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
  let sessionID = currentUserID;
  let sessionFirstName = currentUserFirstName;
  let user = userJoin(sessionID, sessionFirstName);

  socket.emit('message', formatMessage(botName, 'Welcome to GroupChat!'));

  // Broadcast when a user connects
  socket.broadcast.emit('message', formatMessage(botName, `${user.username} has joined the chat.`));

  // Runs when a client disconnects
  socket.on('disconnect', () => {
    io.emit('message', formatMessage(botName,`${user.username} has left the chat.`));
  });

  // Listen for chatMessage
  socket.on('chatMessage', (msg) => {
    io.emit('message', formatMessage(user.username, msg));

    // Send message to database

    let messageContent = {message: msg, user_id: user.id};
    let sql = "INSERT INTO messages SET ?";
    db.query(sql, messageContent, (err, result) => {
      if(err) throw err;
      console.log(result);
    });
  });
});

const PORT = 3000 || process.env.PORT;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));