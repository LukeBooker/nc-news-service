const {
  fetchArticleById,
  modifyArticleVotes,
} = require("../models/articles-model");

exports.getArticleById = (req, res, next) => {
  const articleId = req.params.article_id;
  fetchArticleById(articleId)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch(next);
};

exports.updateArticleVotes = (req, res, next) => {
  const articleId = req.params.article_id;
  const votesNum = req.body.inc_votes;
  fetchArticleById(articleId)
    .then((article) => {
      const currentVotes = article.votes;
      return currentVotes + votesNum;
    })
    .then((newVotes) => {
      return modifyArticleVotes(articleId, newVotes);
    })
    .then((article) => {
      res.status(200).send({ updatedArticle: article });
    })
    .catch(next);
};
