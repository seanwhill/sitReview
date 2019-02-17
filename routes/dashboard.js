const express = require('express');
const router = express.Router();
const users = require("../data/users");
const reviews = require("../data/reviews");

// Determines whether the user has reserved a spot in the review
function isReserved(user, reviewId) {
	if (user.profile.savedReviews.includes(reviewId)) {
		return true;
	}
	return false;
}

router.get("/", async (req, res) => {
	// Authentication
	const sid = req.cookies.AuthCookie;
	let user = null;

	try {
		user = await users.getUserBySession(sid);
	} catch (e) {
		
	}
	
	(user == null ? auth=false : auth=true)
	if (auth) {
		let reviews_this = [];
		let reviews_next = [];

		let courses = user.profile.courses;

		var curr = new Date; // get current date
		var first = curr.getDate() - curr.getDay(); // First day is the day of the month - the day of the week
		var last = first + 6; // last day is the first day + 6

		var firstday = new Date(curr.setDate(first));
		var lastday = new Date(curr.setDate(last));
		var firstday_next = new Date(curr.setDate(last + 1));
		var lastday_next = new Date(curr.setDate(last + 7));

		var review;
		var review_date;
		var curr = new Date; // get current date
		for (var i = 0; i < courses.length; i++){
			var temp = await reviews.getReviewsByCourse(courses[i])
			for (var j = 0; j < temp.length; j++){
				review = temp[j]
				let reviewCreator = await users.getUserById(review.ownerId);
				review.owner = reviewCreator.profile.name;
				var rev_date = new Date(review.date+'T12:00:00');

				if (rev_date.valueOf() >= firstday.valueOf() && rev_date.valueOf() <= lastday.valueOf()) {
					// Updates reserved field with true or false
					review.reserved = isReserved(user,review._id);
					reviews_this.push(review);
				}
				else if(rev_date.valueOf() >= firstday_next.valueOf() && rev_date.valueOf() <= lastday_next.valueOf()){
					// Updates reserved field with true or false
					review.reserved = isReserved(user,review._id);
					reviews_next.push(review);
				}
				
			}
		}
		// Loads dashboard
		let data = {
			title: "Dashboard",
			courses: courses,
			reviews_this: reviews_this,
			reviews_next: reviews_next,	
			layout: 'main'
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
// Route for RSVP'ing to reviews
router.post("/:id", async (req, res) => {
	let reviewId = req.params.id;
    // Gets session id, will be undefined if user is not logged in
    let sid = req.cookies.AuthCookie;
    let user = await users.getUserBySession(sid);
    let userId = user._id;
    let savedReviews = user.profile.savedReviews;
    // User has already RSVP'd to this review
    if (savedReviews.includes(reviewId)) {
        let data = {
            title: "Error 403",
            issue: "You have already RSVP'd for this review."
        }
        res.status(403).render("error", data);
    }
    // Add review to user's save list
    else {
        savedReviews.push(reviewId);
        let updatedUser = {profile: user.profile};
		let newUser = await users.updateUser(userId, updatedUser);
        res.render("success", {title: "Successfully RSVP'd for review!"});
    }
});
// Opposite of rsvp
router.post("/:id/cancel", async (req, res) => {
	let reviewId = req.params.id;
    // Gets session id, will be undefined if user is not logged in
    let sid = req.cookies.AuthCookie;
    let user = await users.getUserBySession(sid);
    let userId = user._id;
    let savedReviews = user.profile.savedReviews;
    // User has already RSVP'd to this review
    if (savedReviews.includes(reviewId)) {
		savedReviews.splice(savedReviews.indexOf(reviewId), 1);
        let updatedUser = {profile: user.profile};
		let newUser = await users.updateUser(userId, updatedUser);
		res.render("success", {title: "Successfully cancelled reservation!"});
    }
    // Error page, has not rsvp'd yet
    else {
		let data = {
            title: "Error 403",
            issue: "You have not RSVP'd for this review yet. Can you even get here?"
        }
        res.status(403).render("error", data);
    }
});
module.exports = router;