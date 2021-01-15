const express = require("express");
const exphbs = require("express-handlebars");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const methodOverride = require("method-override");
const flash = require("connect-flash");
const session = require("express-session");

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

//Method override Middleware
app.use(methodOverride("_method"));

// Express session Middleware
app.use(
  session({
    secret: "secret",
    resave: true,
    saveUninitialized: true,
  })
);

app.use(flash());

// Global variables
app.use(function (req, res, next) {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.error = req.flash("error");
  next();
});

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

//Edit article Form
app.get("/articles/edit/:id", (req, res) => {
  Article.findOne({
    _id: req.params.id,
  }).then((article) => {
    res.render("articles/edit", {
      article: article,
    });
  });
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
      req.flash("success_msg", "Article added");
      res.redirect("/articles");
    });
  }
});

// Edit Form process
app.put("/articles/:id", (req, res) => {
  Article.findOne({
    _id: req.params.id,
  }).then((article) => {
    article.title = req.body.title;
    article.details = req.body.details;

    article.save().then((article) => {
      req.flash("success_msg", "Article updated");
      res.redirect("/articles");
    });
  });
});

// Delete article
app.delete("/articles/:id", (req, res) => {
  Article.remove({ _id: req.params.id }).then(() => {
    req.flash("success_msg", "Article removed");
    res.redirect("/articles");
  });
});

//Contact Route
app.get("/contact", (req, res) => {
  res.render("contact");
});

const port = 5000;

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
