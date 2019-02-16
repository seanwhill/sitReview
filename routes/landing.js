const express = require('express');
const router = express.Router();
const users = require("../data/users")

router.get('/', async (req, res) => {
    let auth = false;
    try {
        auth = await users.getUserBySession(req.cookies.AuthCookie) != null;
    } catch (e) {
    	auth = false;
    }

    if (auth) { // user is authenticated
    	res.redirect("/profile");
    } else {
    	res.render("root", {title: "Pickt"});
    }
});

module.exports = router;
