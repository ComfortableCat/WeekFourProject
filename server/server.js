import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import pg from "pg";

const port = process.env.PORT || 4000;
const app = express();
dotenv.config();
app.use(cors());
app.use(express.json());

const db = new pg.Pool({
  connectionString: process.env.DB_CONN_STRING,
});

app.get("/", async (request, response) => {
  const result = await db.query("SELECT * FROM messages");
  const message = result.rows;
  response.json(message);
});

app.post("/", async (req, res) => {
  const { name, message, rating } = req.body;
  console.log(name);
  console.log(message);
  const display = await db.query(
    "SELECT displayname FROM users WHERE username = $1",
    [name]
  );
  const disNam = display.rows;
  console.log(disNam[0].displayname);
  db.query("INSERT INTO messages (name, message, rating) VALUES ($1,$2,$3)", [
    disNam[0].displayname,
    message,
    rating,
  ]);
});

app.delete("/", async (req, res) => {
  const msgId = req.body.id;
  db.query("DELETE FROM messages WHERE id = $1", [msgId]);
  console.log(msgId);
});

app.get("/users", async (req, res) => {
  const name = req.query.name;
  const result = await db.query(
    "SELECT username,displayname FROM users WHERE username = $1",
    [name]
  );
  const check = result.rows;
  console.log(check);
  res.json(result.rows);
});

app.post("/users", async (req, res) => {
  //console.log("req.body", req.body);
  const { username, displayname } = req.body;
  const result = await db.query(
    "SELECT username FROM users WHERE username= $1",
    [username]
  );
  const messages = result.rows;
  //console.log("messages", messages);
  if (messages.length === 0) {
    db.query("INSERT INTO users (username, displayname) VALUES ($1,$2)", [
      username,
      displayname,
    ]);
    res.json("created");
  } else if (messages.length === 1) {
    res.json("exists");
  } else {
    res.json(console.error());
  }
});

app.listen(port, () => console.log(`listening on port ${port}`));
