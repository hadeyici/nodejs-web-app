const express = require("express");
const exphbs = require("express-handlebars");
const mongoose = require("mongoose");

const app = express();

//Connect to Mongoose
mongoose
  .connect("mongodb://localhost/project", {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  })
  .then(() => console.log("MongoDB connected."))
  .catch((err) => console.log(err));

// Load Article Model
require("./models/Article");
const Article = mongoose.model('articles');

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
