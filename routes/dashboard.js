const express = require('express');
const router = express.Router();
const users = require("../data/users");
const reviews = require("../data/reviews");

router.get("/", async (req, res) => {
	const sid = req.cookies.AuthCookie;
	let user = null;

	try {
		user = await users.getUserBySession(sid);
		console.log(user)
	} catch (e) {
		//throw (e);
	}
	

	(user == null ? auth=false : auth=true)
	if (auth) {
		let review_list = []
		let courses = user.profile.courses
		for (var i = 0; i < courses.length; i++){
			review_list.push(await reviews.getReviewsByCourse(courses[i]));
		}

		console.log(review_list)
		let data = {
			title: "Dashboard",
			courses: courses,
			reviews: review_list,	
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