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


/////////////Requests Targetting All Articles.//////////////////////////
app.route("/articles")

.get(function(req, res){
  Article.find({}, function(err, foundArticles){
    if (!err) {
      res.send(foundArticles);
    } else {
      res.send(err);
    }
  });
})

.post(function(req, res){

  const newArticle = new Article({
    title: req.body.title,
    content: req.body.content
  });

  newArticle.save(function(err){
    if (!err) {
      res.send("Successfully added a new article.");
    }
  });
})

.delete(function(req, res){
  Article.deleteMany(function(err){
    if (!err){
      res.send("Successfully deleted all articles.");
    } else {
      res.send(err);
    }
  });
});


/////////////Requests Targetting A Specific Article.//////////////////////////

app.route("/articles/:articleTitle")

.get(function(req, res){
  Article.findOne({title: req.params.articleTitle}, function(err, foundArticle){
    if (foundArticle) {
      res.send(foundArticle)
    } else {
      res.send("No articles matching that title was found.");
    }
  });
})

.put(function(req, res){
  Article.updateOne(
    {title: req.params.articleTitle},
    {title: req.body.title, content: req.body.content},
    {overwrite: true},
    function(err){
      if (!err) {
        res.send("Successfully updated article.");
      } else {
        res.send("There is error in updating article.");
      }
    }
  );
});

app.listen(8001, function() {
  console.log("Server started on port 8001");
});
