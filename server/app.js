// import Cors from "cors";
const express = require("express");
const Cors = require("cors");
const axios = require("axios");

const app = express();

// add json middleware for parsing json body in requests
app.use(express.json());

app.use(Cors({ origin: "*" }));

app.get("/", (req, res) => {
  console.log(req.body);
  return res.status(200).send({
    data: `server says : get request on time : ${new Date().getTime()}`,
  });
});

app.post("/", async (req, res) => {
  try {
    console.log(req.body);
    const ans = await axios.post(
      "http://localhost:11434/api/generate",
      req.body,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    console.log(ans.data);

    return res.status(200).send({ answer: ans.data.response });
  } catch (error) {
    return res.status(400).send({ error: "something went wrong buddy" });
  }
});

// listen on the desired port
app.listen(11433, () => {
  console.log("server is running on http://localhost:11433");
});
