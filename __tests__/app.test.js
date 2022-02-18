const request = require("supertest");
const app = require("../app");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data");
const db = require("../db/connection");

afterAll(() => db.end());

beforeEach(() => seed(data));

describe("app", () => {
  describe("GET /api", () => {
    test("Status: 200, responds with a json representation of all the available endpoints of the api", () => {
      return request(app)
        .get("/api")
        .expect(200)
        .then(({ body: { description } }) => {
          expect(Object.keys(description)[0]).toBe("GET /api");
        });
    });
  });
  describe("GET /api/topics", () => {
    test("Status: 200, responds with an array of topic objects, each of which should have the properties: slug, description", () => {
      return request(app)
        .get("/api/topics")
        .expect(200)
        .then(({ body: { topics } }) => {
          expect(topics).toHaveLength(3);
          topics.forEach((topic) => {
            expect(topic).toEqual(
              expect.objectContaining({
                description: expect.any(String),
                slug: expect.any(String),
              })
            );
          });
        });
    });
    test("Status: 404, path not found", () => {
      return request(app)
        .get("/api/not_topics")
        .expect(404)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("Not Found");
        });
    });
  });
  describe("GET /api/articles/:article_id", () => {
    test("Responds with an article object containing the correct properties", () => {
      return request(app)
        .get("/api/articles/2")
        .expect(200)
        .then(({ body: { article } }) => {
          expect(article).toEqual(
            expect.objectContaining({
              author: "icellusedkars",
              title: "Sony Vaio; or, The Laptop",
              article_id: 2,
              topic: "mitch",
              created_at: expect.any(String),
              votes: 0,
            })
          );
        });
    });
    test("Feature Request: Responds with correct comment count", () => {
      return request(app)
        .get("/api/articles/1")
        .expect(200)
        .then(({ body: { article } }) => {
          expect(article).toEqual({
            article_id: 1,
            title: "Living in the shadow of a great man",
            topic: "mitch",
            author: "butter_bridge",
            body: "I find this existence challenging",
            created_at: expect.any(String),
            votes: 100,
            comment_count: "11",
          });
        });
    });
    test("Status: 400, bad request", () => {
      return request(app)
        .get("/api/articles/invalid_path")
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("Bad Request");
        });
    });
    test("Status: 404, path not found", () => {
      return request(app)
        .get("/api/articles/22222222")
        .expect(404)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("No article found for article_id: 22222222");
        });
    });
  });
  describe("PATCH /api/articles/:article_id", () => {
    test("Status: 200, responds with incremented article votes", () => {
      return request(app)
        .patch("/api/articles/1")
        .send({ inc_votes: 12 })
        .expect(200)
        .then(({ body: { updatedArticle } }) => {
          expect(updatedArticle).toEqual({
            article_id: 1,
            title: "Living in the shadow of a great man",
            topic: "mitch",
            author: "butter_bridge",
            body: expect.any(String),
            created_at: expect.any(String),
            votes: 112,
          });
        });
    });
    test("Status: 200, responds with decremented article votes", () => {
      return request(app)
        .patch("/api/articles/1")
        .send({ inc_votes: -22 })
        .expect(200)
        .then(({ body: { updatedArticle } }) => {
          expect(updatedArticle).toEqual({
            article_id: 1,
            title: "Living in the shadow of a great man",
            topic: "mitch",
            author: "butter_bridge",
            body: expect.any(String),
            created_at: expect.any(String),
            votes: 78,
          });
        });
    });
    test("Status: 400, bad request - malformed body / missing required fields", () => {
      return request(app)
        .patch("/api/articles/1")
        .send({})
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("Bad Request");
        });
    });
    test("Status: 400, bad request - invalid `inc_votes`", () => {
      return request(app)
        .patch("/api/articles/1")
        .send({ inc_votes: "cat" })
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("Bad Request");
        });
    });
    test("Status: 404, path not found", () => {
      return request(app)
        .patch("/api/articles/123456789")
        .send({ inc_votes: 22 })
        .expect(404)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("No article found for article_id: 123456789");
        });
    });
  });
  describe("GET /api/users", () => {
    test("Status: 200, responds with an array of objects, each object with the sole property `username`", () => {
      return request(app)
        .get("/api/users")
        .expect(200)
        .then(({ body: { users } }) => {
          expect(users).toHaveLength(4);
          expect(users[0].username).toEqual("butter_bridge");
          users.forEach((user) => {
            expect(user).toEqual(
              expect.not.objectContaining({
                name: expect.any(String),
                avatar_url: expect.any(String),
              })
            );
          });
        });
    });
  });
  describe("GET /api/articles", () => {
    test("Status: 200, responds with an array of article objects, each object with the correct properties", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then(({ body: { articles } }) => {
          expect(articles).toHaveLength(12);
          articles.forEach((article) => {
            expect(article).toEqual(
              expect.objectContaining({
                author: expect.any(String),
                title: expect.any(String),
                article_id: expect.any(Number),
                topic: expect.any(String),
                created_at: expect.any(String),
                votes: expect.any(Number),
              })
            );
          });
        });
    });
    test("Status: 200, responds with an array of article objects sorted by date created in descending order", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then(({ body: { articles } }) => {
          expect(articles).toBeSortedBy("created_at", {
            descending: true,
          });
          expect(articles[11]).toEqual(
            expect.objectContaining({
              author: "icellusedkars",
              title: "Z",
              article_id: 7,
              topic: "mitch",
              created_at: expect.any(String),
              votes: 0,
            })
          );
        });
    });
    test("Feature Request: responds with an comment count on each article object", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then(({ body: { articles } }) => {
          articles.forEach((article) => {
            expect(article).toEqual(
              expect.objectContaining({
                comment_count: expect.any(String),
              })
            );
          });
          expect(articles[0]).toEqual({
            author: "icellusedkars",
            title: "Eight pug gifs that remind me of mitch",
            article_id: 3,
            topic: "mitch",
            created_at: expect.any(String),
            votes: 0,
            comment_count: "2",
          });
        });
    });
    test("Feature Request #16: client can sort query the articles by any valid column (defaults to descending)", () => {
      return request(app)
        .get("/api/articles?sort_by=author")
        .expect(200)
        .then(({ body: { articles } }) => {
          expect(articles).toBeSortedBy("author", {
            descending: true,
          });
        });
    });
    test("Feature Request #16: sort query defaults to date - descending", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then(({ body: { articles } }) => {
          expect(articles).toBeSortedBy("created_at", {
            descending: true,
          });
        });
    });
    test("Feature Request #16: order can be set to asc or desc for ascending or descending (defaults to descending)", () => {
      return request(app)
        .get("/api/articles?sort_by=title&order=asc")
        .expect(200)
        .then(({ body: { articles } }) => {
          expect(articles).toBeSortedBy("title", {
            descending: false,
          });
        });
    });
    test("Feature Request #16: topic query filters the articles by the topic value specified in the query", () => {
      return request(app)
        .get("/api/articles?sort_by=author&order=asc&topic=mitch")
        .expect(200)
        .then(({ body: { articles } }) => {
          expect(articles).toHaveLength(11);
          expect(articles).toBeSortedBy("author", {
            descending: false,
          });
          articles.forEach((article) => {
            expect(article).toEqual(
              expect.objectContaining({
                topic: "mitch",
              })
            );
          });
        });
    });
    test("Feature Request #16: Status: 400, the sort request is invalid", () => {
      return request(app)
        .get("/api/articles?sort_by=cat")
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("Invalid sort query");
        });
    });
    test("Feature Request #16: Status: 400, the order request is invalid", () => {
      return request(app)
        .get("/api/articles?sort_by=title&order=cat")
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("Invalid order query");
        });
    });
  });
  describe("GET /api/articles/:article_id/comments", () => {
    test("Status: 200, responds with an array of comments, each containing the correct properties`", () => {
      return request(app)
        .get("/api/articles/1/comments")
        .expect(200)
        .then(({ body: { comments } }) => {
          expect(comments).toHaveLength(11);
          comments.forEach((comment) => {
            expect(comment).toEqual(
              expect.objectContaining({
                comment_id: expect.any(Number),
                votes: expect.any(Number),
                created_at: expect.any(String),
                author: expect.any(String),
                body: expect.any(String),
              })
            );
          });
          expect(comments[0]).toEqual(
            expect.not.objectContaining({ article_id: expect.any(Number) })
          );
        });
    });
    test("Status: 200, the article exists but no comments associated with it. Responds with empty array", () => {
      return request(app)
        .get("/api/articles/4/comments")
        .expect(200)
        .then(({ body: { comments } }) => {
          expect(comments).toHaveLength(0);
          expect(comments).toEqual([]);
        });
    });
    test("Status: 404, the article does not exist", () => {
      return request(app)
        .get("/api/articles/123456789/comments")
        .expect(404)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("No article found for article_id: 123456789");
        });
    });
  });
  describe("POST /api/articles/:article_id/comments", () => {
    test("Status: 201, responds with comment newly added to the database", () => {
      const newComment = {
        username: "rogersop",
        body: "This is a test comment.",
      };
      return request(app)
        .post("/api/articles/2/comments")
        .send(newComment)
        .expect(201)
        .then(({ body: { comment } }) => {
          expect(comment).toEqual(
            expect.objectContaining({
              comment_id: 19,
              body: "This is a test comment.",
              article_id: 2,
              author: "rogersop",
              votes: 0,
              created_at: expect.any(String),
            })
          );
        });
    });
    test("Status: 400, bad request - malformed body / missing required fields", () => {
      const newComment = {};
      return request(app)
        .post("/api/articles/2/comments")
        .send(newComment)
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("Missing required fields");
        });
    });
    test("Status: 400, bad request - failing schema validation", () => {
      const newComment = {
        username: 1234,
        body: true,
      };
      return request(app)
        .post("/api/articles/2/comments")
        .send(newComment)
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("Failing schema validation");
        });
    });
    test("Status: 404, the article does not exist", () => {
      const newComment = {
        username: "rogersop",
        body: "This is a test comment.",
      };
      return request(app)
        .post("/api/articles/123456789/comments")
        .send(newComment)
        .expect(404)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("No article found for article_id: 123456789");
        });
    });
  });
  describe("DELETE /api/comments/:comment_id", () => {
    test("Status: 204, deletes comment and responds with an empty response body", () => {
      return request(app)
        .delete("/api/comments/2")
        .expect(204)
        .then(() => {
          return request(app)
            .get("/api/articles/1/comments")
            .expect(200)
            .then(({ body: { comments } }) => {
              expect(comments).toHaveLength(10);
            });
        });
    });
    test("Status: 404, the comment does not exist", () => {
      return request(app)
        .delete("/api/comments/123456789")
        .expect(404)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("No comment found for comment_id: 123456789");
        });
    });
    test("Status: 400, invalid comment id", () => {
      return request(app)
        .delete("/api/comments/cat")
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("Bad Request");
        });
    });
  });
});
