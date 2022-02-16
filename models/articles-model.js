const db = require("../db/connection");

exports.fetchArticleById = (articleId) => {
  return db
    .query(
      "SELECT articles.*, COUNT(comments.comment_id) AS comment_count FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id WHERE articles.article_id = $1 GROUP BY articles.article_id;",
      [articleId]
    )
    .then(({ rows }) => {
      const article = rows[0];
      if (!article) {
        return Promise.reject({
          status: 404,
          msg: `No article found for user_id: ${articleId}`,
        });
      }
      return article;
    });
};

exports.modifyArticleVotes = (articleId, newVotes) => {
  return db
    .query(
      "UPDATE articles SET votes = $1 WHERE article_id = $2 RETURNING *;",
      [newVotes, articleId]
    )
    .then(({ rows }) => rows[0]);
};

exports.fetchArticles = () => {
  return db
    .query(
      `SELECT author, title, article_id, topic, created_at, votes FROM articles ORDER BY created_at DESC;`
    )
    .then((result) => result.rows);
};
