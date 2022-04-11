# :newspaper: Northcoders News API :newspaper:

Link to deployed site - [Luke Booker's NC News](https://resplendent-croissant-393b15.netlify.app/)

## :speech_balloon: Project Summary

The intention of this project was to build a RESTful API for the purpose of accessing application data programmatically. The goal here was to mimic the building of a real world backend service (such as reddit) which should provide this information to the front end architecture.

The database uses PSQL, and interacts with it using node-postgres.

## :computer: Start instructions for new developer

### How to clone

Using terminal:
`cd` into the correct directory for this repository
`git clone https://github.com/LukeBooker/nc-news-service.git` to clone this repository
`cd nc-news-service` in the newly cloned directory, open with your chosen code editor.

### Install dependencies

Using the IDE terminal:
`npm install` to install the following packages

**Dependencies to install:**

- dotenv
- express
- pg
- pg-format

**Developer dependencies required for testing to install:**

- jest
- jest-extended
- jest-sorted
- supertest
- husky

**Note: required minimum versions of `Node.js` and `Postgres` needed to run the project**

- Node: v17.0
- Postgres: v14

### Create .env files

As `.env.\*` is added to the .gitignore, when cloning this repo you need to create two .env files for the project: `.env.test` and `.env.development`. Into each, add `PGDATABASE=<database_name_here>`, with the correct database name for that environment (see `/db/setup.sql` for the database names).

### Seed local database

To create the databases, run `npm run setup-dbs` in the terminal

Once complete, seed the development database using `npm run seed`

Once this setup is complete, we can run the server locally with `npm start`
npm start

Request can be made locally using an API client, such as Insomnia

### Run tests

Use `npm run test` to start the test suite. Each endpoint is tested using supertest

Tests should seed the test database first and then run on this test database. The test database is seeded before each test to ensure independent testing (tests will not fail because of changes made in other tests).

`jest-sorted` can be installed and utilized when testing for sorted data

## :left_right_arrow: Endpoints

The project currently has the following endpoints:

- `GET /api` - responds with a JSON representation of all the available endpoints of the API
- `GET /api/topics` - responds with an array of topic objects, each of which should have the properties: slug, description
- `GET /api/articles/:article_id` - responds with an article object by id containing the correct article properties
- `PATCH /api/articles/:article_id` - request body accepts an object in the form { inc_votes: newVote }, responds with article containing incremented/decremented votes
- `GET /api/users` - responds with an array of objects, each object with the sole property 'username'
- `GET /api/articles` - responds with an array of article objects, each object with the correct properties
- `GET /api/articles/:article_id/comments` - responds with an array of comments, each containing the correct properties
- `POST /api/articles/:article_id/comments` - responds with comment newly added to the article by id
- `DELETE /api/comments/:comment_id` - responds with comment newly added to the article by id

## :eight_spoked_asterisk: Hosting

This API project is hosted on Heroku.

**Link to hosted version: https://northcoders-news-project.herokuapp.com/api**
