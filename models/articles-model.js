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
          msg: `No article found for article_id: ${articleId}`,
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

exports.fetchArticles = (sortBy, orderBy, topic) => {
  upperCaseOrderBy = orderBy.toUpperCase();
  let queryStr = `SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, 
      COUNT(comments.comment_id) AS comment_count FROM articles 
      LEFT JOIN comments ON articles.article_id = comments.article_id`;
  const queryValues = [];

  // TOPIC CHECK
  if (topic) {
    queryStr += ` WHERE topic = $1`;
    queryValues.push(topic);
  }
  queryStr += ` GROUP BY articles.article_id`;

  //GREEN LIST SORT BY
  if (
    !["author", "title", "article_id", "topic", "created_at", "votes"].includes(
      sortBy
    )
  ) {
    return Promise.reject({ status: 400, msg: "Invalid sort query" });
  }
  queryStr += ` ORDER BY ${sortBy}`;

  //GREEN LIST BY ASC / DESC
  if (!["ASC", "DESC"].includes(upperCaseOrderBy)) {
    return Promise.reject({ status: 400, msg: "Invalid order query" });
  }
  queryStr += ` ${upperCaseOrderBy};`;

  return db.query(queryStr, queryValues).then(({ rows }) => {
    return rows;
  });
};
