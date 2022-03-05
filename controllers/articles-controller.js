const {
  fetchArticleById,
  modifyArticleVotes,
  fetchArticles,
} = require("../models/articles-model");
const { checkTopicExists } = require("../models/topics-model");

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
  const newVotes = req.body.inc_votes;
  modifyArticleVotes(articleId, newVotes)
    .then((article) => {
      if (!article) {
        return Promise.reject({
          status: 404,
          msg: `No article found for article_id: ${articleId}`,
        });
      }
      res.status(200).send({ updatedArticle: article });
    })
    .catch(next);
};

exports.getArticles = (req, res, next) => {
  const sortBy = req.query.sort_by || "created_at";
  const orderBy = req.query.order || "DESC";
  const topic = req.query.topic;

  Promise.all([fetchArticles(sortBy, orderBy, topic), checkTopicExists(topic)])

    .then((result) => {
      const articles = result[0];
      const topicCheck = result[1];
      if (topic && topicCheck.length === 0) {
        return Promise.reject({
          status: 404,
          msg: "Topic not found",
        });
      }
      res.status(200).send({ articles });
    })
    .catch(next);
};
