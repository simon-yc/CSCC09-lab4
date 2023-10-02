import {
  getMessages,
  addMessage,
  deleteMessage,
  upvoteMessage,
  downvoteMessage,
} from "./api.mjs";

function onError(err) {
  console.error("[error]", err);
  const error_box = document.querySelector("#error-box");
  error_box.innerHTML = err;
  error_box.style.visibility = "visible";
}

function updateVotes(message) {
  document.querySelector("#msg" + message._id + " .upvote-icon").innerHTML =
    message.upvote;
  document.querySelector("#msg" + message._id + " .downvote-icon").innerHTML =
    message.downvote;
}

function updateMessages() {
  document.querySelector("#messages").innerHTML = "";
  getMessages(function (err, messages) {
    if (err) return onError(err);

    messages.forEach(function (message) {
      const elmt = document.createElement("div");
      elmt.className = "row message align-items-center";
      elmt.id = "msg" + message._id;
      elmt.innerHTML = `
        <div class="col-1 message-user">
          <img
            class="message-picture"
            src="media/user.png"
            alt="${message.author}"
          />
          <div class="message-username">${message.author}</div>
        </div>
        <div class="col-auto message-content">
          ${message.content}
        </div>
        <div class="col-1 upvote-icon icon">${message.upvote}</div>
        <div class="col-1 downvote-icon icon">${message.downvote}</div>
        <div class="col-1 delete-icon icon"></div>
      `;
      elmt.querySelector(".delete-icon").addEventListener("click", function () {
        deleteMessage(message._id, function (err) {
          if (err) return onError(err);
          updateMessages();
        });
      });
      elmt.querySelector(".upvote-icon").addEventListener("click", function () {
        upvoteMessage(message._id, function (err, updatedMessage) {
          if (err) return onError(err);
          updateVotes(updatedMessage); 
        });
      });
      elmt.querySelector(".downvote-icon").addEventListener("click", function () {
        downvoteMessage(message._id, function (err, updatedMessage) {
          if (err) return onError(err);
          updateVotes(updatedMessage); 
        });
      });
      
      document.querySelector("#messages").prepend(elmt);
    });
  });
}

document
  .querySelector("#create-message-form")
  .addEventListener("submit", function (e) {
    e.preventDefault();
    const author = document.getElementById("post-username").value;
    const content = document.getElementById("post-content").value;
    document.getElementById("create-message-form").reset();
    addMessage(author, content, function (err) {
      if (err) return onError(err);
      updateMessages();
    });
  });


(function refresh() {
  updateMessages();
  setTimeout(refresh, 10000);
})();
