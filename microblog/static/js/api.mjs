function send(method, url, data, callback) {
  const xhr = new XMLHttpRequest();
  xhr.onload = function () {
    if (xhr.status !== 200)
      return callback("(" + xhr.status + ")" + xhr.responseText, null);
    return callback(null, JSON.parse(xhr.responseText));
  };
  xhr.open(method, url, true);
  if (!data) xhr.send();
  else {
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(JSON.stringify(data));
  }
}

export function addMessage(author, content, callback) {
  send("POST", "/api/messages/", { author: author, content: content }, function (err, res) {
    if (err) return callback(err);
    return callback(null);
  });
}

export function deleteMessage(messageId, callback) {
  send("DELETE", "/api/messages/" + messageId + "/", null, function (err, res) {
    if (err) return callback(err);
    return callback(null);
  });
}

export function upvoteMessage(messageId, callback) {
  send("PATCH", "/api/messages/" + messageId + "/upvote", null, function (err, res) {
    if (err) return callback(err);
    return callback(null, res);
  });
}

export function downvoteMessage(messageId, callback) {
  send("PATCH", "/api/messages/" + messageId + "/downvote", null, function (err, res) {
    if (err) return callback(err);
    return callback(null, res);
  });
}

export function getMessages(callback) {
  send("GET", "/api/messages/", null, callback);
}
