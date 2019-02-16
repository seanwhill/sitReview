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
		let reviews_this = []
		let reviews_next = []

		let courses = user.profile.courses


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
			console.log(temp)
			for (var j = 0; j < temp.length; j++){
				review = temp[j]
				var rev_date = new Date(review.date+'T12:00:00');
				// console.log(review)
				// console.log(rev_date)
				// console.log(firstday)
				// // console.log(lastday)
				// // console.log(rev_date.valueOf() >= firstday.valueOf())
				// // console.log(rev_date.valueOf() <= lastday.valueOf())
				// console.log(firstday_next)
				// console.log(lastday_next)
				// console.log(rev_date >= firstday_next)
				// console.log(rev_date <= lastday_next)


				if (rev_date.valueOf() >= firstday.valueOf() && rev_date.valueOf() <= lastday.valueOf())
					reviews_this.push(review);
				else if(rev_date.valueOf() >= firstday_next.valueOf() && rev_date.valueOf() <= lastday_next.valueOf()){
					reviews_next.push(review)
				}
			}
		}
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

module.exports = router;