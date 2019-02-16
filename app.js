const express = require("express");
const bodyParser = require("body-parser");
const configRoutes = require("./routes");
const exphbs = require("express-handlebars");
const cookieParser = require("cookie-parser");

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: true
}));


app.use(express.static(__dirname + '/public'));

app.use(cookieParser());
app.engine("handlebars", exphbs({ defaultLayout: "default" }));
app.set("view engine", "handlebars");
configRoutes(app);

app.listen(3000, () => {
  console.log("Your server is now listening on port 3000!");
  console.log("Navigate to http://localhost:3000 to access it.");

  if (process && process.send) process.send({done: true}); // ADD THIS LINE
});
