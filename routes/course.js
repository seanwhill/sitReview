const express = require('express');
const router = express.Router();
const reviews = require("../data/reviews");
const users = require("../data/users");

// Route for displaying all reviews by course, assumes user is logged in
router.get("/:course", async (req, res) => {
    try {
        let course = req.params.course;
        // Gets all reviews by course
        const reviewsByCourse = await reviews.getReviewsByCourse(course);
        // Prints an error if reviews is empty
        if (!reviewsByCourse.length) {
            let data = {
                title: "Error 404",
                issue: "There are no reviews for that course."
            }
            res.status(404).render("error", data);
        }
        else {
            // Gets the name of each review's creator
            for (let i = 0; i < reviewsByCourse.length; i++) {
                let user = await users.getUserById(reviewsByCourse[i].ownerId);
                reviewsByCourse[i].creatorName = user.profile.name;
            }
            // Renders a separate page with the given course
            let data = {
                title: course,
                review: reviewsByCourse
            }
            res.render("reviewsByCourse", data);
        }
    } catch (e) {
        res.status(404).json({ message: "Course not found" });
    }
  });

router.post("/:course", async (req, res) => {
    let course = req.params.course;
    // Gets session id, will be undefined if user is not logged in
    let sid = req.cookies.AuthCookie;
    let user = await users.getUserBySession(sid);
    let userId = user._id;
    let userCourses = user.profile.courses;
    // User has already subscribed to that course
    if (userCourses.includes(course)) {
        let data = {
            title: "Error 403",
            issue: "You have already added this course."
        }
        res.status(403).render("error", data);
    }
    // Add course to user's list
    else {
        userCourses.push(course);
        let updatedUser = {profile: user.profile};
        let newUser = await users.updateUser(userId, updatedUser);
        res.render("success", {title: "Course successfully added!"});
    }
});

// Oof, this line is important
module.exports = router;