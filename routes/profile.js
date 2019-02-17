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
		
	}
	
	(user == null ? auth=true : auth=false)
	if (auth == false) {
		let profile = user.profile;
		let savedReviewIds = profile.savedReviews;
		let userReviews = [];
		// Find the reviews for each one the user has RSVP'd for
		for (let i = 0; i < savedReviewIds.length; i++) {
			let currentReview = await reviews.getReviewById(savedReviewIds[i]);
			// Get the name of the creator as well
			let reviewCreator = await users.getUserById(currentReview.ownerId);
			currentReview.creatorName = reviewCreator.profile.name;
			userReviews.push(currentReview);
		}

		let data = {
			title: "Profile",
			review: userReviews,
			layout: "main"
		}
		res.render("profile", data);
	} else {
		let data = {
			title: "Error 403",
			issue: "You are not logged in.",
			layout: "main"
		}
		res.render("error", data);
	}
});

module.exports = router;