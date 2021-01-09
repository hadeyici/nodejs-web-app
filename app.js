const express = require("express");
const exphbs = require("express-handlebars");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

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
const Article = mongoose.model("articles");

//Handlebars Middleware
app.engine(
  "handlebars",
  exphbs({
    defaultLayout: "main",
    runtimeOptions: {
      allowProtoPropertiesByDefault: true,
      allowProtoMethodsByDefault: true,
    },
  })
);
app.set("view engine", "handlebars");

//Body parser Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//Index Route
app.get("/", (req, res) => {
  res.render("index");
});

//About Route
app.get("/about", (req, res) => {
  res.render("about");
});

//Article Route
app.get("/articles", (req, res) => {
  Article.find({})
    .sort({ date: "desc" })
    .then((articles) => {
      res.render("articles/index", {
        articles: articles,
      });
    });
});

//Add article Form
app.get("/articles/add", (req, res) => {
  res.render("articles/add");
});

//Article Route
app.post("/articles", (req, res) => {
  let errors = [];

  if (!req.body.title) {
    errors.push({ text: "title is required" });
  }
  if (!req.body.details) {
    errors.push({ text: "detail is required" });
  }

  if (errors.length > 0) {
    res.render("/articles/add", {
      errors: errors,
      title: req.body.title,
      details: req.body.details,
    });
  } else {
    const newUser = {
      title: req.body.title,
      details: req.body.details,
    };
    new Article(newUser).save().then((article) => {
      res.redirect("/articles");
    });
  }
});

//Contact Route
app.get("/contact", (req, res) => {
  res.render("contact");
});

const port = 5000;

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
