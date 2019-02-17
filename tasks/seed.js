const dbConnection = require("../config/mongoConnection");
const data = require("../data/");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const users = data.users;
const reviews = require("../data/reviews");



const main = async () => {
  const db = await dbConnection();

  let un1 = "salt";
  let un2 = "jord";

  let name1 = "salt";
  let name2 = "jord";


  let pw = "1224";
  let hash = await bcrypt.hash(pw, saltRounds);

  const sean = await users.addUser(un1, name1, hash)
  users.updateUser(sean._id,{
    profile : {
      name: sean.profile.name,
      username: sean.profile.username,
      courses: ["MA222", "CS115"],
      createdReviews: sean.profile.createdReviews,
      savedReviews: []
    }
  })

  const jord = await users.addUser(un2, name2, hash);

  const rev1 = await reviews.addReview("Test Review", "CS115", "Prepare for the upcoming exam", "NB 102", "2019-02-16", "15:00", sean._id)

  const rev2 = await reviews.addReview("Test Review", "CS115", "Prepare for the upcoming exam", "NB 102", "2019-02-19", "15:00", sean._id)

  const rev3 = await reviews.addReview("Test Review", "MA222", "Prepare for the upcoming exam", "NB 102", "2019-02-19", "19:00", sean._id)

  await db.serverConfig.close();

};

main().catch(console.log);
