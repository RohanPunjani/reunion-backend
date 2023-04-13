const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");
const authenticate = require("./authenticate");

// POST /api/authenticate
router.post("/api/authenticate", userController.authenticateUser);

// POST /api/follow/:id
router.post("/api/follow/:id", authenticate, userController.followUser);

// POST /api/unfollow/:id
router.post("/api/unfollow/:id", authenticate, userController.unfollowUser);

// GET /api/user
router.get("/api/user", authenticate, userController.getUserProfile);

module.exports = router;
