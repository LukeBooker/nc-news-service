const express = require("express");
const app = express();
const {
  handlePsqlErrors,
  handleCustomErrors,
  handle500Errors,
} = require("./errors");
const { getTopics } = require("./controllers/topics-controller");
const {
  getArticleById,
  updateArticleVotes,
} = require("./controllers/articles-controller");
const { getUsers } = require("./controllers/users-controller");

app.use(express.json());

app.get("/api/topics", getTopics);

app.get("/api/articles/:article_id", getArticleById);

app.patch("/api/articles/:article_id", updateArticleVotes);

app.get("/api/users", getUsers);

app.all("/*", (req, res, next) => {
  res.status(404).send({ msg: "Not Found" });
});

app.use(handlePsqlErrors);
app.use(handleCustomErrors);
app.use(handle500Errors);

module.exports = app;
