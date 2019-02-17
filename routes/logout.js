const express = require('express');
const router = express.Router();
const users = require("../data/users");

router.get("/", async (req, res) => {
	const sid = req.cookies.AuthCookie;
	res.cookie("AuthCookie", "", {expires: new Date()});
	res.clearCookie("AuthCookie");
	await users.deleteSession(sid);
	res.render("logout", {title: "Logged out", layout: "main"});
});

module.exports = router;