const express = require("express");
const exphbs = require("express-handlebars");

const app = express();

//Handlebars Middleware
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

//Index Route
app.get("/", (req, res) => {
  res.render("index");
});

//About Route
app.get("/about", (req, res) => {
  res.render("about");
});

//Article Route
app.get("/article", (req, res) => {
  res.render("article");
});

//Contact Route
app.get("/contact", (req, res) => {
  res.render("contact");
});

const port = 5000;

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
