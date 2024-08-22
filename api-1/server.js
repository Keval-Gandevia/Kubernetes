const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 6000;
const FILE_LOCATION = "/keval_PV_dir"

app.listen(PORT, () => {
  console.log("First node server running on PORT:", PORT);
});


// api to store file in persistent volume
app.post("/store-file", (request, response) => {
  // Extract the file attribute from request body
  let { file, data } = request.body;

  // Check if file name is provided or not
  if (
    file === undefined ||
    data === undefined ||
    file === "" ||
    file === null
  ) {
    return response
      .status(400)
      .json({ file: null, error: "Invalid JSON input." });
  }

  // remove unnecessary white spaces
  data = data.replace(/\s*,\s*/g, ",").replace(/\s*\n/g, "\n");

  // prepare the file path
  const filePath = path.join(FILE_LOCATION, file);

  // write content to the file
  fs.writeFile(filePath, data, (err) => {
    if (err) {
      return response.status(500).json({
        file: file,
        error: "Error while storing the file to the storage.",
      });
    }

    // success response
    response.status(200).json({
      file: file,
      message: "Success.",
    });
  });
});

// api to calculate the sum of given product
app.post("/calculate", async (request, response) => {
  // Extract the file attribute from request body
  const { file, product } = request.body;

  // Check if file name is provided or not
  if (
    file === undefined ||
    product === undefined ||
    file === "" ||
    file === null
  ) {
    return response
      .status(400)
      .json({ file: null, error: "Invalid JSON input." });
  }

  // Check if file exists or not
  if (!fs.existsSync(path.join(FILE_LOCATION, file))) {
    // file doesn't exist
    return response.status(400).json({ file: file, error: "File not found." });
  } else {
    // file exists then pass parameters to second container
    const res = await fetch("http://container-2-service:6001/calculateSum", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(request.body),
    }).then((response) => {
      return response.json();
    });

    return response.status(200).json(res);
  }
});
