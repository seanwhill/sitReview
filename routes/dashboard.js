const express = require('express');
const router = express.Router();
const users = require("../data/users");
const reviews = require("../data/reviews");



router.get("/", async (req, res) => {
	const sid = req.cookies.AuthCookie;
	let user = null;

	try {
		user = await users.getUserBySession(sid);
	} catch (e) {
		//throw (e);
	}
	

	(user == null ? auth=false : auth=true)
	if (auth) {
		let review_list = []
		let courses = user.profile.courses


		var curr = new Date; // get current date
		console.log(curr)
		var first = curr.getDate() - curr.getDay(); // First day is the day of the month - the day of the week
		var last = first + 6; // last day is the first day + 6

		console.log(first)
		console.log(last)

		var firstday = new Date(curr.setDate(first)).toUTCString();
		var lastday = new Date(curr.setDate(last)).toUTCString();
		var firstday_next = new Date(curr.setDate(last + 1)).toUTCString();
		var lastday_next = new Date(curr.setDate(last + 7)).toUTCString();
		
		console.log(firstday)
		console.log(lastday)
		console.log("next week")
		console.log(firstday_next)
		console.log(lastday_next)
		
		for (var i = 0; i < courses.length; i++){
			review_list.push(await reviews.getReviewsByCourse(courses[i]));
		}
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