const express = require('express');
const router = express.Router();
const users = require("../data/users");

router.get("/", async (req, res) => {
	const sid = req.cookies.AuthCookie;
	let user = null;
	try {
		user = await users.getUserBySession(sid);
	} catch (e) {
		//throw (e);
	}
	
	(user == null ? auth=true : auth=false)
	if (auth == false) {
		let profile = user.profile;

		let data = {
			title: "Dashboard",
			
		}
		res.render("dashboard", data);
	} else {
		let data = {
			title: "Error 403",
			issue: "You are not logged in."
		}
		res.render("error", data);
	}
});

module.exports = router;