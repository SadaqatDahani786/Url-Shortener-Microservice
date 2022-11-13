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
app.use(express.static("public"));

/*
 ** **
 ** ** ** ROUTES
 ** **
 */
/*
 ** ======================================
 ** Route Index
 ** ======================================
 */
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/index.html");
});

/*
 ** **
 ** ** ** HTTP SERVER
 ** **
 */
app.listen(PORT, () => {
  console.log(`Servers is running on port:\t[${PORT}]`);
});
