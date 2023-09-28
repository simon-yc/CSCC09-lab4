let database = [];

let id = 0;

let Message = function (author, content) {
  this.id = id++;
  this.author = author;
  this.content = content;
  this.upvote = 0;
  this.downvote = 0;
};

/*  
******* Data types *******
Message:
  Attributes:
    - (string) messageId 
    - (string) author
    - (string) content
    - (number) upvote
    - (number) downvote 
*/

export function addMessage(author, content) {
  let message = new Message(author, content);
  database.unshift(message);
}

export function deleteMessage(messageId) {
  let index = database.findIndex(function (message) {
    return message.id === messageId;
  });
  if (index === -1) return null;
  database.splice(index, 1);
}

export function upvoteMessage(messageId) {
  let message = database.find(function (message) {
    return message.id === messageId;
  });
  message.upvote += 1;
}

export function downvoteMessage(messageId) {
  let message = database.find(function (message) {
    return message.id === messageId;
  });
  message.downvote += 1;
}

export function getMessages() {
  return database;
}
