require('dotenv').config();
const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const path = require("path");
const { faker } = require('@faker-js/faker');
const { v4: uuidv4 } = require('uuid');
var methodOverride = require('method-override');
const mysql = require('mysql2');

app.use(methodOverride('_method'));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));
app.use(express.static(path.join(__dirname, "/public")));
app.use(express.urlencoded({ extended: true }));

// ✅ MYSQL CONNECTION USING ENV VARIABLES
const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT || 3306 // optional, if port is different
});
// ✅ FAKE DATA GENERATOR
let getUser = () => {
  return [
    faker.string.uuid(),
    faker.internet.username(),
    faker.internet.email(),
    faker.internet.password(),
    faker.hacker.phrase(),
  ];
};

// ✅ HOME ROUTE
app.get("/", (req, res) => {
  let q = `SELECT COUNT(*) AS total_users FROM user`;
  try {
    connection.query(q, (e, result) => {
      if (e) throw e;
      let count = result[0].total_users;
      res.render("home.ejs", { count });
    });
  } catch (e) {
    console.log(e.message);
    res.send("Error fetching user count.");
  }
});

// ✅ ALL USERS
app.get("/users", (req, res) => {
  let q = `SELECT * FROM user`;
  try {
    connection.query(q, (e, result) => {
      if (e) throw e;
      res.render("showallusers.ejs", { userdata: result });
    });
  } catch (e) {
    console.log(e.message);
    res.send("Error fetching users.");
  }
});

// ✅ EDIT USER FORM
app.get("/users/:id/edit", (req, res) => {
  let { id } = req.params;
  let q = `SELECT * FROM user WHERE id = ?`;
  connection.query(q, [id], (e, result) => {
    if (e) return res.send("Error in DB");
    let userdata = result[0];
    res.render("edit.ejs", { userdata });
  });
});

// ✅ PATCH USER
app.patch("/users/:id", (req, res) => {
  let { id } = req.params;
  let { password: formpassword, username: newusername, content: newcontent } = req.body;

  let q = `SELECT * FROM user WHERE id = ?`;
  connection.query(q, [id], (e, result) => {
    if (e) return res.send("Error in DB");
    let userdata = result[0];

    if (formpassword !== userdata.password) {
      return res.render("wrongpassword.ejs", { userdata });
    }

    let q2 = `UPDATE user SET username=?, content=? WHERE id=?`;
    connection.query(q2, [newusername, newcontent, id], (e, result) => {
      if (e) return res.send("Error updating user");
      res.render("successedit.ejs", { userdata });
    });
  });
});

// ✅ NEW USER FORM
app.get("/users/new", (req, res) => {
  res.render("adduser.ejs");
});

// ✅ ADD NEW USER
app.post("/users", (req, res) => {
  let id = uuidv4();
  let { username, email, password, content } = req.body;

  let checkquery = `SELECT * FROM user WHERE username=? OR email=?`;
  connection.query(checkquery, [username, email], (e, result) => {
    if (e) return res.send("Error in DB");
    if (result.length > 0) {
      return res.render("userexist.ejs");
    }

    let q = `INSERT INTO user(id, username, email, password, content) VALUES (?, ?, ?, ?, ?)`;
    connection.query(q, [id, username, email, password, content], (e, result) => {
      if (e) return res.send("Error adding user");
      res.render("successeadd.ejs");
    });
  });
});

// ✅ DELETE CONFIRM PAGE
app.get("/users/:id/delete", (req, res) => {
  let { id } = req.params;
  let q = `SELECT * FROM user WHERE id = ?`;
  connection.query(q, [id], (e, result) => {
    if (e) return res.send("Error fetching user");
    res.render("delete.ejs", { userdata: result[0] });
  });
});

// ✅ DELETE USER
app.delete("/users/:id", (req, res) => {
  let { id } = req.params;
  let { password: userpassword } = req.body;

  let q = `SELECT * FROM user WHERE id = ?`;
  connection.query(q, [id], (e, result) => {
    if (e) return res.send("Error in DB");
    if (result.length === 0) return res.send("User not found");

    let userdata = result[0];
    if (userpassword !== userdata.password) {
      return res.render("wrongpassworddelete.ejs");
    }

    let q2 = `DELETE FROM user WHERE id = ?`;
    connection.query(q2, [id], (e, result) => {
      if (e) return res.send("Error deleting user");
      res.render("successdelete.ejs", { userdata });
    });
  });
});

// ✅ SERVER LISTEN
app.listen(port, () => {
  console.log(`the app is listening in the port ${port}`);
});
