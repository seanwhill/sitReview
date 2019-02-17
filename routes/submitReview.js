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
	
	(user == null ? auth=true : auth=false)
	if (auth == false) {
		let profile = user.profile;

		let data = {
			title: "Submit Review",
			layout: "submit"
		}
		res.render("submitReview", data);
	} else {
		let data = {
			title: "Error 403",
			issue: "You are not logged in.",
			layout: "main"
		}
		res.render("error", data);
	}
});

router.post("/", async (req, res) => {
	let reviewData = req.body;
	// Get the review data
	let title = reviewData.reviewTitle;
	let course = reviewData.course;
	let description = reviewData.description;
	let location = reviewData.location;
	let date = reviewData.date;
	let startTime = reviewData.startTime;
	// Get user who created review
	const sid = req.cookies.AuthCookie;
	let creator = await users.getUserBySession(sid);
	let creatorId = creator._id;
	// Add a new review to the collection
	await reviews.addReview(title, course, description, location, date, startTime, creatorId);
	// Redirect to success page
	res.render("success", {title: "Review successfully submitted!", layout: "main"});
    //res.redirect("/dashboard");
});
module.exports = router;