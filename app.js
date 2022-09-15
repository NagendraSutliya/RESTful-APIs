//jshint

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const ejs = require("ejs");

const app = express();

app.set('view engine', "ejs");

app.use(bodyParser.urlencoded({
  extend: true
}));

app.use(express.static("public"));


mongoose.connect("mongodb://localhost:27017/wikiDB", {useNewUrlParser: true});

const articleSchema = {
  title: String,
  content: String
};

const Article = mongoose.model("Article", articleSchema);

app.get("/articles", function(req, res){
  Article.find({}, function(err, foundArticles){
    res.send(foundArticles);
  });
});

app.post("/articles", function(req, res){

  const newArticle = new Article({
    title: req.body.title,
    content: req.body.content
  });

  newArticle.save(function(err){
    if (!err) {
      res.send("Successfully added a new article.");
    }
  });
});


app.listen(8001, function() {
  console.log("Server started on port 8001");
});
