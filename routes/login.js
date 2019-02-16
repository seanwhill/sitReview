const express = require('express');
const router = express.Router();
const users = require("../data/users");
const uuid = require("uuid/v4");

router.post("/", async (req, res) => {
	const un = req.body.username;
	const pw = req.body.password;
	var letters = /^[0-9a-zA-Z]+$/

	let auth = false;
	let err = "Did not provide a valid username/password.";
	try {
		if(un.match(letters) && pw.match(letters)){
			auth = await users.validate(un, pw);
		}
		else{
			auth = false;
			err = "You must only enter alphanumeric characters"
		}
	} catch (e) {
		err = e;
	}

	if (auth) {
		const sid = uuid();
		res.cookie("AuthCookie", sid);
		try {
			console.log("here")
			await users.addSession(un, sid);
		} catch (e) {
			throw(e);
		}
		if (un == "admin") {
			res.redirect("/admin");
		}
		// Redirect to dashboard page
		else {
			//res.render("root", {title: "Error", error: "logged in"});
			res.redirect("/dashboard");
		}
	} else {
		res.render("root", {title: "Error", error: err});
	}
});

module.exports = router;
