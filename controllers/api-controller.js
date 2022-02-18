const { fetchApiDescription } = require("../models/app-model");

exports.getApiDescription = (req, res, next) => {
  fetchApiDescription()
    .then((description) => {
      res.status(200).send({ description });
    })
    .catch(next);
};
