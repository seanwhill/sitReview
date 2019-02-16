
const mongoCollections = require("../config/mongoCollections");
const reviews = mongoCollections.reviews;
const uuid = require("node-uuid");


let exportedMethods = {
    // Returns the given review based on the ID
    async getReviewById(id) {
        const reviewCollection = await reviews();
        const review = await reviewCollection.findOne({ _id: id });

<<<<<<< HEAD
    async getReviewById(id) {
        const reviewCollection = await reviews();
        const review = await reviewCollection.findOne({ _id: id });

        if (!review) throw "review not found";
        return review;
    },
    
=======
        if (!review) throw "review not found";
        return review;
    },
    // Adds a new review to the collection with the given information
>>>>>>> 40fe85ce95d182bdaf7258e09736e20c97b9763e
    async addReview(title, course, description, location, date, startTime, ownerId) {

        const reviewCollection = await reviews();
        const newRev = {
            _id: uuid.v4(),
            title: title,
            course: course,
            description: description,
            location: location,
            date: date,
            startTime: startTime,
            ownerId: ownerId,
        };

        const newInsertInformation = await reviewCollection.insertOne(newRev);
        const newId = newInsertInformation.insertedId;
        return await this.getReviewById(newId);
    },
    // Removes a review from the collection based on the ID
    async removeReviewById(id) {
        const reviewCollection = await reviews();
        const deletionInfo = await reviewCollection.removeOne({ _id: id });
        if (deletionInfo.deletedCount === 0) {
            throw `Could not delete review with id of ${id}`;
        }
    },
    // Changes an existing review based on what the user wants to change
    async updateReview(id, updatedReview) {
        const reviewCollection = await reviews();

        const updatedReviewData = {};
        // Update title
        if (updatedReview.title) {
            updatedReviewData.title= updatedReview.title;
        }
        // Update description
        if (updatedReview.description) {
            updatedReviewData.description = updatedReview.description;
        }
        // Update date
        if (updatedReview.date) {
            updatedReviewData.date = updatedReview.date;
        }
        // Update start time
        if (updatedReview.startTime) {
            updatedReviewData.startTime= updatedReview.startTime;
        }
        // Update course
        if (updatedReview.course) {
            updatedReviewData.course= updatedReview.course;
        }
        // Update location
        if (updatedReview.location) {
            updatedReviewData.location= updatedReview.location;
        }

        let updateCommand = {
            $set: updatedUserData
        };
        const query = {
            _id: id
        };
        await reviewCollection.updateOne(query, updateCommand, { strict: false });

        return await this.getUserById(id);
    },
    // Returns a list of all the reviews for a particular course
    async getReviewsByCourse(course){
        const reviewCollection = await reviews();
        const review_list = await reviewCollection.find({course: course}).toArray();
        return review_list
    },
    // Returns a list of all the reviews posted by a particular owner
    async getReviewsByowner(ownerId){
        const reviewCollection = await reviews();
        const review_list = await reviewCollection.find({ownerId: ownerId}).toArray();
        return review_list
    }
};

module.exports = exportedMethods;