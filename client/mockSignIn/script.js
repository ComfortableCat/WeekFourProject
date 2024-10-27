const create = document.getElementById("create");
const signin = document.getElementById("signin");
const createError = document.getElementById("createError");
const signError = document.getElementById("signError");

async function handleCreate(event) {
  event.preventDefault();
  console.log("form submitted");
  const formData = new FormData(create);
  const message = Object.fromEntries(formData);
  console.log("form data", message);
  debugger;
  if (message.username !== "" && message.displayname !== "") {
    const response = await fetch("http://localhost:8080/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(message),
    });
    const reply = await response.json();
    console.log(reply);
    if (reply === "exists") {
      createError.textContent = "*username already exists";
    } else if (reply === "created") {
      localStorage.setItem("userinfo", JSON.stringify(message));
      window.location.assign("http://127.0.0.1:5173/");
    }
  } else {
    createError.textContent = "You need a username and display name";
  }
  console.log("leaving");
  create.reset();
}

async function handleSignIn(event) {
  event.preventDefault();
  const formData = new FormData(signin);
  const message = Object.fromEntries(formData);
  console.log(message, message.usersignin);
  if (message.usersignin !== "") {
    const result = await fetch(
      `http://localhost:8080/users?name=${message.usersignin}`
    );
    const userinfo = await result.json();
    console.log(result);
    if (userinfo.length === 0) {
      signin.reset();
    } else {
      localStorage.setItem("userinfo", JSON.stringify(userinfo[0]));
      window.location.assign("http://127.0.0.1:5173/");
    }
    signError.textContent = "User does not exist";
  } else {
    signError.textContent = "You must type a Username";
  }
}

create.addEventListener("submit", handleCreate);
signin.addEventListener("submit", (event) => handleSignIn(event));
