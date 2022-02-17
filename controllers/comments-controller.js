const {
  fetchCommentsByArticleId,
  checkArticleExists,
} = require("../models/comments-model");

exports.getCommentsByArticleId = (req, res, next) => {
  const articleId = req.params.article_id;

  Promise.all([
    fetchCommentsByArticleId(articleId),
    checkArticleExists(articleId),
  ])

    .then((result) => {
      const comments = result[0];
      const article = result[1];
      if (article.length === 0) {
        return Promise.reject({
          status: 404,
          msg: `No article found for article_id: ${articleId}`,
        });
      }
      res.status(200).send({ comments });
    })
    .catch(next);
};
