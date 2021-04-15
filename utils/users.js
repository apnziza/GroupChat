const users = [];

// Join user to chat
function userJoin(id, username){
  const user = {id, username};

  users.push(user);

  return user;
}

module.exports = userJoin;