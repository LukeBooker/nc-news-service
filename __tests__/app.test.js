const request = require("supertest");
const app = require("../app");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data");
const db = require("../db/connection");

afterAll(() => db.end());

beforeEach(() => seed(data));

describe("app", () => {
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
          expect(article).toEqual({
            article_id: 2,
            title: "Sony Vaio; or, The Laptop",
            topic: "mitch",
            author: "icellusedkars",
            body: expect.any(String),
            created_at: expect.any(String),
            votes: 0,
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
          expect(msg).toBe("No article found for user_id: 22222222");
        });
    });
  });
  describe("PATCH /api/articles/:article_id", () => {
    test("Status: 200, responds with incremented article votes", () => {
      return request(app)
        .patch("/api/articles/1")
        .send({ inc_votes: 12 })
        .expect(200)
        .then(({ body }) => {
          expect(body.updatedArticle).toEqual({
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
        .then(({ body }) => {
          expect(body.updatedArticle).toEqual({
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
          expect(msg).toBe("No article found for user_id: 123456789");
        });
    });
  });
});
