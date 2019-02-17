const bcrypt = require("bcrypt");

const mongoCollections = require("../config/mongoCollections");
const users = mongoCollections.users;
const uuid = require("node-uuid");


let exportedMethods = {
  async getUserByUn(un) {
    const userCollection = await users();
    const user = await userCollection.findOne({ 'profile.username': un });
    if (!user) throw "That didn't work/User not found";
    return user;
  },
  async checkUserExists(un) {
    const userCollection = await users();
    const user = await userCollection.findOne({ 'profile.username': un });
    if (!user) return false;
    return true;
  },
  async validate(un, pw) {

    const user = await this.getUserByUn(un);

    if (user == null) {
      throw ("No user with that username");
    }

    if (await bcrypt.compare(pw, user.hashedPassword) === true) {
      return true;
    } else {
      return false;
    }
  },
  async addSession(un, sid) {
    try {
      let user = await this.getUserByUn(un);
      user.sessionIds.push(sid);
      this.updateUser(user._id, user);
    } catch (e) {
      throw ("No user with that username");
    }
    return true;
  },
  async deleteSession(sid) {
    try {
      let user = await this.getUserBySession(sid);
      let sessions = user.sessionIds;

      let index = sessions.indexOf(sid);
      if (index > -1) {
        sessions.splice(index, 1);
      }
      user.sessionIds = sessions
      this.updateUser(user._id, user);
    } catch (e) {
      throw ("No user with that username");
    }
    return true;
  },
  async getUserBySession(sid) {
    const userCollection = await users();
    const user = await userCollection.findOne({ sessionIds: { $all: [sid] } });
    if (!user) throw "User not found";
    return user;
  },
  async getUserById(id) {
    const userCollection = await users();
    const user = await userCollection.findOne({ _id: id });

    if (!user) throw "User not found";
    return user;
  },
  async addUser(username, name, hashedPassword) {
    if (typeof hashedPassword !== "string") throw "No hashed password provided";
    if (typeof name !== "string") throw "No name provided!";
    if (typeof username !== "string") throw "No username provided!";

    const usersCollection = await users();

    const newUser = {
      _id: uuid.v4(),
      hashedPassword: hashedPassword,
      profile: {
        name: name,
        username: username,
        courses: [],
        createdReviews: [],
        savedReviews: []
      },
      sessionIds: [],
    };

    const newInsertInformation = await usersCollection.insertOne(newUser);
    const newId = newInsertInformation.insertedId;
    return await this.getUserById(newId);
  },
  async removeUserById(id) {
    const userCollection = await users();
    const deletionInfo = await userCollection.removeOne({ _id: id });
    if (deletionInfo.deletedCount === 0) {
      throw `Could not delete post with id of ${id}`;
    }
  },
  async removeUserByUsername(username) {
    const userCollection = await users();
    const deletionInfo = await userCollection.removeOne({ username: username });
    if (deletionInfo.deletedCount === 0) {
      throw `Could not delete post with username of ${username}`;
    }
  },
  async updateUser(id, updatedUser) {
    const userCollection = await users();

    const updatedUserData = {};
    console.log("updated user:");
    console.log(updatedUser);

    if (updatedUser.hashedPassword) {
      updatedUserData._id = id
      updatedUserData.hashedPassword = updatedUser.hashedPassword;
    }

    if (updatedUser.profile) {
      console.log("old user")
      console.log(updatedUser)
      updatedUserData.profile = updatedUser.profile;
    }

    if (updatedUser.sessionIds) {
      updatedUserData.sessionIds = updatedUser.sessionIds;
    }
    console.log("updated user data");
    console.log(updatedUserData);

    let updateCommand = {
      $set: updatedUserData
    };
    const query = {
      _id: id
    };
    await userCollection.updateOne(query, updateCommand, { strict: false });

    return await this.getUserById(id);
  }
};

module.exports = exportedMethods;
