
const mongoCollections = require("../config/mongoCollections");
const reviews = mongoCollections.reviews;
const uuid = require("node-uuid");


let exportedMethods = {

    async getReviewById(id) {
        const reviewCollection = await reviews();
        const review = await reviewCollection.findOne({ _id: id });

        if (!review) throw "review not found";
        return review;
    },
    
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
    async removeReviewById(id) {
        const reviewCollection = await reviews();
        const deletionInfo = await reviewCollection.removeOne({ _id: id });
        if (deletionInfo.deletedCount === 0) {
            throw `Could not delete review with id of ${id}`;
        }
    },
    async updateReview(id, updatedReview) {
        const reviewCollection = await reviews();

        const updatedReviewData = {};

        if (updatedReview.title) {
            updatedReviewData.title= updatedReview.title;
        }

        if (updatedReview.time) {
            updatedReviewData.time= updatedReview.time;
        }

        if (updatedReview.course) {
            updatedReviewData.course= updatedReview.course;
        }

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
    async getReviewsByCourse(course){
        const reviewCollection = await reviews();
        const review_list = await reviewCollection.find({course: course}).toArray();
        return review_list
    },
    async getReviewsByowner(ownerId){
        const reviewCollection = await reviews();
        const review_list = await reviewCollection.find({ownerId: ownerId}).toArray();
        return review_list
    }
};

module.exports = exportedMethods;