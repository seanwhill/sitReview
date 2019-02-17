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
                issue: "There are no reviews for that course.",
                layout: "main"
            }
            res.status(404).render("error", data);
        }
        else {
            // Checks if the user is subscribed to the course or not
            let sid = req.cookies.AuthCookie;
            let loggedUser = await users.getUserBySession(sid);
            let userCourses = loggedUser.profile.courses;
            let subscribed = false;
            // Updates subscribed if user is in course
            if (userCourses.includes(course)) {
                subscribed = true;
            }
            // Gets the name of each review's creator
            for (let i = 0; i < reviewsByCourse.length; i++) {
                let user = await users.getUserById(reviewsByCourse[i].ownerId);
                reviewsByCourse[i].creatorName = user.profile.name;
            }
            // Renders a separate page with the given course
            let data = {
                title: course,
                review: reviewsByCourse,
                subscribed: subscribed,
                layout: "main"
            }
            res.render("reviewsByCourse", data);
        }
    } catch (e) {
        // I don't know if this ever gets accessed
        res.status(404).json({ message: "Course not found" });
    }
  });
// Route for subscribing to courses
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
            issue: "You have already added this course.",
            layout: "main"
        }
        res.status(403).render("error", data);
    }
    // Add course to user's list
    else {
        userCourses.push(course);
        let updatedUser = {profile: user.profile};
        let newUser = await users.updateUser(userId, updatedUser);
        res.render("success", {title: "Course successfully added!", layout: "main"});
    }
});
// Route for unsubscribing from courses
router.post("/:course/unsubscribe", async (req, res) => {
    let course = req.params.course;
    // Gets session id, will be undefined if user is not logged in
    let sid = req.cookies.AuthCookie;
    let user = await users.getUserBySession(sid);
    let userId = user._id;
    let userCourses = user.profile.courses;
    // Unsubscribe from course
    if (userCourses.includes(course)) {
        userCourses.splice(userCourses.indexOf(course), 1);
        let updatedUser = {profile: user.profile};
        let newUser = await users.updateUser(userId, updatedUser);
        res.render("success", {title: "Course successfully removed!", layout: "main"});
    }
    // User has never added that course
    else {
        let data = {
            title: "Error 403",
            issue: "You are not currently subscribed to this course.",
            layout: "main"
        }
        res.status(403).render("error", data);
    }
});

// Oof, this line is important
module.exports = router;