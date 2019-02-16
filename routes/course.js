const express = require('express');
const router = express.Router();
const reviews = require("../data/reviews");
const users = require("../data/users");

// Route for displaying all reviews by course
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

// Oof, this line is important
module.exports = router;