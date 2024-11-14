require("dotenv").config();
const express = require('express');
const app = express();
const PORT = 6000;
const {Route} = require("../router/route");

app.set('trust proxy', true);

Route(app);

app.listen(PORT, () => {
  console.log(`App running on ${PORT}`);
});
