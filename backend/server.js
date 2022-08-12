const express = require('express');
const Gun = require('gun');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(Gun.serve);

app.get('/', (_, res) => {
  res.status(200).send('MESSAGE: DPay Gun is Live');
});

const server = app.listen(port, () => {
  console.log(`DPay listening at http://localhost:${port}`);
});

Gun({ web: server });
