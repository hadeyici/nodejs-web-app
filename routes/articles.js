const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();

// Load Article Model
require("../models/Article");
const Article = mongoose.model("articles");

//Article Route
router.get("/", (req, res) => {
    Article.find({})
      .sort({ date: "desc" })
      .then((articles) => {
        res.render("articles/index", {
          articles: articles,
        });
      });
  });
  
  //Add article Form
  router.get("/add", (req, res) => {
    res.render("articles/add");
  });
  
  //Edit article Form
  router.get("/edit/:id", (req, res) => {
    Article.findOne({
      _id: req.params.id,
    }).then((article) => {
      res.render("articles/edit", {
        article: article,
      });
    });
  });
  
  //Article Route
  router.post("/", (req, res) => {
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
      const newArticle = {
        title: req.body.title,
        details: req.body.details,
      };
      new Article(newArticle).save().then((article) => {
        req.flash("success_msg", "Article added");
        res.redirect("/articles");
      });
    }
  });
  
  // Edit Form process
  router.put("/:id", (req, res) => {
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
  router.delete("/:id", (req, res) => {
    Article.remove({ _id: req.params.id }).then(() => {
      req.flash("success_msg", "Article removed");
      res.redirect("/articles");
    });
  });
  
module.exports = router;