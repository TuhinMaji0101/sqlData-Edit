const express = require("express");
const mysql = require("mysql2");
const path = require("path");
const methodOverride = require("method-override");
const { faker } = require("@faker-js/faker");

const app = express();
const port = 8088;

// Set view engine and middlewares
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

// SQL Connection
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "9578",
  database: "college",
});

// Utility function to generate a random user
const getRandomUser = () => [
  faker.string.uuid(),
  faker.internet.username(),
];

// Start server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

// Home route: count users
app.get("/", (req, res) => {
  const query = `SELECT COUNT(*) AS count FROM eployee`;
  connection.query(query, (err, result) => {
    if (err) {
      console.error(err);
      return res.send("Error fetching data.");
    }
    const count = result[0].count;
    res.render("home.ejs", { count });
  });
});

// Show all users
app.get("/user", (req, res) => {
  const query = `SELECT * FROM eployee`;
  connection.query(query, (err, users) => {
    if (err) {
      console.error(err);
      return res.send("Error fetching users.");
    }
    res.render("showUser.ejs", { users });
  });
});

// Edit form for user
app.get("/user/:id/edit", (req, res) => {
  const { id } = req.params;
  const query = `SELECT * FROM eployee WHERE id = ?`;
  connection.query(query, [id], (err, results) => {
    if (err) {
      console.error(err);
      return res.send("Error fetching user.");
    }
    res.render("edit.ejs", { result: results[0] });
  });
});

// Update user
app.patch("/user/:id", (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  const query = `UPDATE eployee SET name = ? WHERE id = ?`;
  connection.query(query, [name, id], (err) => {
    if (err) {
      console.error(err);
      return res.send("Error updating user.");
    }
    res.redirect("/user");
  });
});

// Delete user
app.delete("/user/:id/del", (req, res) => {
  const { id } = req.params;
  const query = `DELETE FROM eployee WHERE id = ?`;
  connection.query(query, [id], (err) => {
    if (err) {
      console.error(err);
      return res.send("Error deleting user.");
    }
    res.redirect("/user");
  });
});
