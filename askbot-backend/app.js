import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { getStreamingCompletion } from "./src/modules/openai/index.js";

const app = express();
const port = 2000;
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

app.post("/aiCompletion", async (req, res) => {
  const data = req.body;
  const stream = await getStreamingCompletion({ userPrompt: data?.userPrompt });
  for await (const part of stream) {
    // Uncomment below if you want to check chunk time generation
    // const chunkTime = (Date.now() - starttime) / 1000;
    // process.stdout.write(part.choices[0]?.delta || "");
    // console.log("chunk time:", chunkTime);
    res.write(part.choices[0]?.delta.content || "");
  }
  res.end();
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
