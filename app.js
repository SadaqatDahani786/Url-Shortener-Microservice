/*
 ** **
 ** ** ** IMPORTS
 ** **
 */
const express = require("express");
const cors = require("cors");

/*
 ** **
 ** ** ** INITS
 ** **
 */
const app = express();
const PORT = 3000;

/*
 ** **
 ** ** ** MIDDLEWARES
 ** **
 */
app.use(cors({ optionsSuccessStatus: 200 })); // some legacy browsers choke on 204

/*
 ** **
 ** ** ** HTTP SERVER
 ** **
 */
app.listen(PORT, () => {
  console.log(`Servers is running on port:\t[${PORT}]`);
});
