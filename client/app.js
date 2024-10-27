const userinfo = JSON.parse(localStorage.getItem("userinfo")) || 0;
const msgContainer = document.getElementById("messageContainer");
const docFrag = document.createDocumentFragment();
const welcome = document.getElementById("welcome");
const display = document.getElementById("display");
const msg = document.getElementById("msg");
const rev = document.getElementById("reviews");
const chat = document.getElementById("chat");

console.log(userinfo);
if (userinfo === 0) {
  window.location.assign(
    "https://cafe-client.onrender.com/mockSignIn/index.html"
  );
} else {
  loadPage();
}

async function loadPage() {
  const response = await fetch("https://weekfourproject.onrender.com/");
  const data = await response.json();
  console.log(userinfo);
  welcome.textContent = `Hello ${userinfo.username},`;
  display.textContent = `Your display name is ${userinfo.displayname}`;
  data.forEach((data) => {
    console.log(data);
    drawMessage(data);
  });
  msgContainer.appendChild(docFrag);
  docFrag.replaceChildren();
}

function drawMessage(b) {
  const msgDiv = document.createElement("div");
  const headDiv = document.createElement("div");
  const time = document.createElement("p");
  const name = document.createElement("p");
  const message = document.createElement("p");

  msgDiv.classList.add("msgDiv", `${b["id"]}`);

  headDiv.classList.add("headDiv");
  time.classList.add("time", `${b["id"]}`);
  name.classList.add("name", `${b["id"]}`);
  message.classList.add("message", `${b["id"]}`);

  time.textContent = `${b.time.slice(8, 10)}/${b.time.slice(
    5,
    7
  )}/${b.time.slice(0, 4)}  ${b.time.slice(11, 16)}`;
  name.textContent = b.name;
  message.textContent = b.message;
  headDiv.append(name, time);
  msgDiv.append(headDiv, message);
  msgDiv.addEventListener("click", (event) => {
    buttonCheck(b["id"]);
  });
  docFrag.prepend(msgDiv);
}
function loadForm(a) {
  const Form = document.createElement("form");
  const txtArea = document.createElement("textarea");
  const msgP = document.createElement("p");
  const txtP = document.createElement("p");
  const ratP = document.createElement("p");
  const rating = document.createElement("input");
  const btn = document.createElement("button");
  Form.classList.add("messageForm");
  ratP.textContent = "Pick your rating out of 5";
  msgP.textContent = "Write your message in the box below";
  txtArea.maxLength = 144;
  txtArea.name = "message";
  txtP.textContent = "0/144";
  txtP.id = "counter";
  rating.type = "number";
  rating.min = 1;
  rating.max = 5;
  rating.value = 3;
  rating.name = "rating";
  btn.type = "submit";
  btn.textContent = "submit";
  if (a === true) {
    Form.append(ratP, rating, msgP, txtArea, txtP, btn);
  } else {
    Form.append(msgP, txtArea, txtP, btn);
  }
  Form.addEventListener("submit", (event) => {
    event.preventDefault();
    submitHandler(event);
  });
  txtArea.addEventListener("keydown", (event) => {
    const counter = document.getElementById("counter");
    const txtA = document.querySelector("textarea");
    counter.textContent = `${txtA.value.length}/144`;
  });
  docFrag.append(Form);
  msgContainer.appendChild(docFrag);
  docFrag.replaceChildren();
}

async function submitHandler(event) {
  event.preventDefault();
  console.log("form submitted");
  const formData = new FormData(
    document.getElementsByClassName("messageForm")[0]
  );
  const message = Object.fromEntries(formData);
  message.name = `${userinfo.displayname}`; //I should be doing this with the id primary key then doing smarter stuff
  console.log(message);
  const response = await fetch("https://weekfourproject.onrender.com/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(message),
  });
  const reply = await response.json();
}

function buttonCheck(a) {
  console.log("in btncheck");
  const name = document.getElementsByClassName(`name ${a}`)[0];

  const msgDiv = document.getElementsByClassName(a)[0];
  if (
    userinfo.displayname === name.textContent &&
    document.getElementsByClassName("delBtn")[0] === undefined
  ) {
    const delBtn = document.createElement("button");
    delBtn.classList.add("delBtn");
    delBtn.textContent = "delete";
    delBtn.addEventListener("click", () => deleteMsg(a));
    msgDiv.appendChild(delBtn);
    setTimeout(() => delBtn.remove(), 2500);
  }
}

async function deleteMsg(a) {
  const msgDiv = document.getElementsByClassName(`msgDiv ${a}`);
  const id = { id: a };
  await fetch("https://weekfourproject.onrender.com/", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(id),
  });
}

/*chat.addEventListener("click", () => {
  msgContainer.replaceChildren();
  loadForm(false);
  loadPage();
});*/
msg.addEventListener("click", () => {
  msgContainer.replaceChildren();
  loadForm(true);
});
rev.addEventListener("click", () => {
  msgContainer.replaceChildren();
  loadPage();
});
