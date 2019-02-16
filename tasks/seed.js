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
  const jord = await users.addUser(un2, name2, hash);

  const rev1 = await reviews.addReview("Test Review", "Cs 115", "Prepare for the upcoming exam", "NB 102", "2019-19-2", "3:00pm", sean.profile.id)
  await db.serverConfig.close();

};

main().catch(console.log);
