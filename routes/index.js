const landingRoute = require("./landing");
const loginRoute = require("./login");
const profileRoute = require("./profile");
const logoutRoute = require("./logout");
const signupRoute = require("./signup");
const dashboardRoute = require("./dashboard");
const submitReviewRoute = require("./submitReview");
const courseRoute = require("./course");



function constructorMethod(app) {
	app.use("/", landingRoute);
	app.use("/login", loginRoute);
	app.use("/profile", profileRoute);
	app.use("/logout", logoutRoute);
	app.use("/signup", signupRoute);
	app.use("/dashboard", dashboardRoute);
	app.use("/submitReview", submitReviewRoute);
	app.use("/course", courseRoute);

	app.use("*", (req, res) => {
    	res.redirect("/");
  	});
}

module.exports = constructorMethod;