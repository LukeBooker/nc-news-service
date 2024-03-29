const {
  fetchCommentsByArticleId,
  checkArticleExists,
  addCommentToArticle,
  removeCommentById,
  checkCommentExists,
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
      if (comments.length === 0) {
        return res.status(200).send({
          msg: "No comments for this article yet",
        });
      }
      res.status(200).send({ comments });
    })
    .catch(next);
};

exports.postCommentToArticle = (req, res, next) => {
  const articleId = req.params.article_id;
  checkArticleExists(articleId)
    .then((result) => {
      if (result.length === 0) {
        return Promise.reject({
          status: 404,
          msg: `No article found for article_id: ${articleId}`,
        });
      }
      return addCommentToArticle(req.body, articleId);
    })
    .then((addedComment) => {
      res.status(201).send({ comment: addedComment });
    })
    .catch(next);
};

exports.deleteCommentById = (req, res, next) => {
  const commentId = req.params.comment_id;
  checkCommentExists(commentId)
    .then((comment) => {
      if (comment.length === 0) {
        return Promise.reject({
          status: 404,
          msg: `No comment found for comment_id: ${commentId}`,
        });
      }
      return;
    })
    .then(() => {
      return removeCommentById(commentId);
    })
    .then(() => {
      res.sendStatus(204);
    })
    .catch(next);
};
