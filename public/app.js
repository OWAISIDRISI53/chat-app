// const socket = io();
const socket = io("https://chat-app-owais-idrisi.herokuapp.com/");

let music = new Audio("chat_music.mp3");

// creating reference of username, textarea, messagearea
let name;
let textarea = document.querySelector("#textarea");
let messageArea = document.querySelector(".message__area");

// function to store username is name variable
// without enter username the prompt box is not hide
do {
  name = prompt("Enter your name: ");
} while (!name);

// listening event to textarea and
//if user "ENTER" key then send event called "sendMessage"
textarea.addEventListener("keyup", (e) => {
  if (e.key === "Enter") {
    sendMessage(e.target.value);
  }
});

// this is for mobile device because
// mobile does not support keyup event

let btn = document.querySelector(".btn");

btn.addEventListener("click", () => {
  sendMessage(textarea.value);
});
function sendMessage(message) {
  let msg = {
    user: name,
    message: message.trim(),
    music: music,
  };

  // append to dom
  if (msg.message !== "") {
    appendMessage(msg, "outgoing");
  }
  textarea.value = "";
  scrollToBottom();

  // sending msg to server
  socket.emit("message", msg);

  // sync with db

  syncWithDb(msg);
}

// function that append message to dom
function appendMessage(msg, type) {
  let mainDiv = document.createElement("div");
  let className = type;
  mainDiv.classList.add(className, "message", "trans");

  let markup = `
        <h4 class="username">${msg.user}</h4>
        <p>${msg.message}</p>`;

  mainDiv.innerHTML = markup;
  messageArea.appendChild(mainDiv);
}

function scrollToBottom() {
  messageArea.scrollTop = messageArea.scrollHeight;
}
// Recieveing msg

socket.on("message", (msg) => {
  appendMessage(msg, "incoming");
  music.play();
});

// alert when new user join the chat
let alertDiv = document.querySelector("#alert");

socket.emit("newUserJoin", name);

// receiving username and show alert

socket.on("newUserBroad", (usrename) => {
  alertDiv.innerHTML = `${usrename} is Joined`;
  music.play();
  alertDiv.classList.replace("d-none", "d-block");
  music.play();
  setTimeout(() => {
    alertDiv.classList.replace("d-block", "d-none");
  }, 1000);
});

// alert when user left the chat

let leaveAlert = document.querySelector(".leaveAlert");

socket.on("userLeftBroad", (usrename) => {
  alertDiv.innerHTML = `${usrename} is Left`;
  alert(`${username} is left`);
  leaveAlert.classList.replace("d-none", "d-block");

  setTimeout(() => {
    leaveAlert.classList.replace("d-block", "d-none");
  }, 1000);
});
// online users

let online_user = document.querySelector(".online_users span");
socket.on("onlineUsers", (users) => {
  online_user.innerHTML = `${users}`;
});

function syncWithDb(msg) {
  const headers = {
    "Content-Type": "application/json",
  };

  fetch("/msg", { method: "Post", body: JSON.stringify(msg), headers })
    .then((resp) => resp.json())
    .then((result) => console.log(result));
}

function fetchChat() {
  fetch("/msg")
    .then((resp) => resp.json())
    .then((result) => {
      result.forEach((element) => {
        console.log(element);
        // element.user = element.;
        appendMessage(element, "incoming");
      });
    });
}

window.onload = fetchChat;
