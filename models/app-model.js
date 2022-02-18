const { readFile } = require("fs/promises");

exports.fetchApiDescription = () => {
  return readFile("./endpoints.json").then((fileContents) => {
    const apiDescription = JSON.parse(fileContents);
    return apiDescription;
  });
};
