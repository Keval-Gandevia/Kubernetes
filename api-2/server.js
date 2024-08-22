const express = require("express");
const fs = require("fs");
const csvParser = require("csv-parser");
const path = require("path");

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 6001;
const FILE_LOCATION = "/keval_PV_dir";

app.listen(PORT, () => {
  console.log("Second node server running on PORT:", PORT);
});


// api to validate csv file content and calculate sum of given product
app.post("/calculateSum", (request, response) => {

  // Extract the file and product from request body.
  const { file, product } = request.body;

  var extractedContent = [];

  // read and validate the file
  fs.createReadStream(path.join(FILE_LOCATION, file))
    .pipe(csvParser({ separator: ",", strict: true }))
    .on("data", (data) => {
      extractedContent.push(data);
    })
    .on("error", () => {
      return response
        .status(400)
        .json({ file: file, error: "Input file not in CSV format." });
    })
    .on("end", () => {
      if (extractedContent.length === 0) {
        return response
          .status(400)
          .json({ file: file, error: "Input file not in CSV format." });
      }
      const sum = calculateSum(extractedContent, product);
      return response.status(200).json({ file: file, sum: sum });
    });
});

// function to calculate sum of given product
const calculateSum = (extractedContent, product) => {
  var sum = 0;
  // Iterate through array and find the sum
  extractedContent.forEach((element) => {
    if (element.product === product) {
      sum += parseInt(element.amount);
    }
  });
  return sum;
};
