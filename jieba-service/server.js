const express = require('express');
const nodejieba = require("nodejieba");

const app = express();

app.use(express.json());

app.post('/segment', (req, res) => {
  const text = req.body.text;
  const result = nodejieba.cut(text);
  res.json(result);
});

app.listen(3000, () => {
  console.log('Jieba service running on port 3000');
});
