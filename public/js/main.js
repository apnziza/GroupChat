const chatForm = document.getElementById('chat-form');

const socket = io();

socket.on('message', message =>{
  const li = document.createElement('li');
  li.classList = "list-group-item d-flex align-items-center";
  li.innerHTML = `<i class="far fa-user-circle m-1"></i><span>${message}</span>`;
  document.getElementById("chat-messages").appendChild(li);
});

chatForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const msg = e.target.elements.msg.value;

  socket.emit('chatMessage', msg);

  e.target.elements.msg.value = '';
});

