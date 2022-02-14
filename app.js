const express = require("express");
const app = express();
const {
  getTopics,
  getArticleById,
} = require("./controllers/topics-controller");

// app.use(express.json());

app.get("/api/topics", getTopics);

app.get("/api/articles/:article_id", getArticleById);

app.use((err, req, res, next) => {
  if (err.status && err.msg) {
    res.status(err.status).send({ msg: err.msg });
  }
  if (err.code === "22P02") {
    res.status(400).send({ msg: "Bad Request" });
  } else next(err);
});

app.all("/*", (req, res, next) => {
  res.status(404).send({ msg: "Not Found" });
});

module.exports = app;
