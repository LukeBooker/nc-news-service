const db = require("../db/connection");
// Set variable to current date and time
const now = new Date();

//HELPER FUNCTION
exports.checkArticleExists = (articleId) => {
  return db
    .query("SELECT * FROM articles WHERE article_id = $1;", [articleId])
    .then(({ rows }) => {
      return rows;
    });
};

//HELPER FUNCTION
exports.checkCommentExists = (commentId) => {
  return db
    .query("SELECT * FROM comments WHERE comment_id = $1;", [commentId])
    .then(({ rows }) => {
      return rows;
    });
};

exports.fetchCommentsByArticleId = (articleId) => {
  return db
    .query(
      "SELECT comment_id, votes, created_at, author, body FROM comments WHERE article_id = $1 ORDER BY created_at DESC;",
      [articleId]
    )
    .then(({ rows }) => {
      return rows;
    });
};

exports.addCommentToArticle = (comment, articleId) => {
  const commentToPost = {
    body: comment.body,
    votes: 0,
    author: comment.username,
    article_id: articleId,
    created_at: new Date(),
  };
  const { body, votes, author, article_id, created_at } = commentToPost;
  return db
    .query(
      "INSERT INTO comments (body, votes, author, article_id, created_at) VALUES ($1, $2, $3, $4, $5) RETURNING *;",
      [body, votes, author, article_id, created_at]
    )
    .then(({ rows }) => {
      return rows[0];
    });
};

exports.removeCommentById = (commentId) => {
  return db.query("DELETE FROM comments WHERE comment_id = $1;", [commentId]);
};
