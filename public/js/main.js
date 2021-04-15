const chatForm = document.getElementById('chat-form');
const chatMessages = document.getElementById("chat-messages-card");
const userList = document.getElementById("users");

const socket = io();

// Get chat users
socket.on('onlineUsers', ({users}) => {
  outputUsers(users);
});

// Message from server
socket.on('message', message => {
  console.log(message);
  outputMessage(message);

  // Scroll down
  chatMessages.scrollTop = chatMessages.scrollHeight;
});

// Message submit
chatForm.addEventListener('submit', (e) => {
  e.preventDefault();

  // Get message text
  const msg = e.target.elements.msg.value;  

  // Emit a message to the server
  socket.emit('chatMessage', msg);

  // Clear input
  e.target.elements.msg.value = '';
  e.target.elements.msg.focus();
});

// Output message to DOM

function outputMessage(message){
  const li = document.createElement('li');
  li.classList = "list-group-item";
  li.innerHTML = `<div class="d-flex align-items-center justify-content-between"><i class="far fa-user-circle m-1"></i><span>${message.text}</span><span class="">${message.time}</span></div>`;
  document.getElementById("chat-messages").appendChild(li);
}

function outputUsers(users){
  userList.innerHTML = `
    ${users.map(user => `<li class="list-group-item d-flex align-items-center"><i class="far fa-user-circle m-1"></i><span>${user.username}</span></li>`).join()}
  `;                                                                                   
}