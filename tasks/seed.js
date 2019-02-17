const dbConnection = require("../config/mongoConnection");
const data = require("../data/");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const users = data.users;
const reviews = data.reviews;



const main = async () => {
  const db = await dbConnection();
  db.dropDatabase();

  let un1 = "sean";
  let un2 = "jord";
  let un3 = "russ";
  let un4 = "emer";

  let name1 = "Sean Hill";
  let name2 = "Jordan Tantuico";
  let name3 = "Larry Russ";
  let name4 = "Professor Emeritus";

  let pw = "1234";
  let hash = await bcrypt.hash(pw, saltRounds);

  const sean = await users.addUser(un1, name1, hash);
  console.log("this is sean")  
  console.log(sean);

  await users.updateUser(sean._id,{
    _id: sean._id,
    hashedPassword: sean.hashedPassword,
    profile : {
      name: sean.profile.name,
      username: sean.profile.username,
      courses: ["MA222", "CS115"],
      createdReviews: sean.profile.createdReviews,
      savedReviews: []
    },
    sessionIds: sean.sessionIds
  });

  const jord = await users.addUser(un2, name2, hash);

  const russ = await users.addUser(un3,name3,hash);

  const emer = await users.addUser(un4,name4,hash);

  await reviews.addReview("Quiz 1 Review", "CS115", "Reviewing sample questions for the first quiz, led by Jordan Tantuico", "NB 102", "2019-02-20", "15:00", jord._id);

  await reviews.addReview("Scrabble Score Review", "CS115", "Going over the general approach and some hints for the Scrabble Scores assignment, led by Dr. Borowski", "NB 105", "2019-02-26", "20:00", jord._id);

  await reviews.addReview("Midterm Review", "MA222", "Going over some practice problems for the midterm", "BC 122", "2019-02-21", "21:00", russ._id);

  await reviews.addReview("TA Office Hours", "MA222", "Holding TA office hours to go over grading of midterm exam", "2019-02-25", "15:00", russ._id);

  await reviews.addReview("Recitation Makeup", "PEP112", "Makeup recitation session due to last week's snow storm", "2019-02-21", "11:00", emer._id);

  await reviews.addReview("Exam Review", "PEP112", "Review for the next exam", "2019-02-27", "21:00", emer._id);

  console.log("Database successfully seeded!");
  await db.serverConfig.close();

};

main().catch(console.log);
