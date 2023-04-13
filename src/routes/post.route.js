const express = require("express");
const router = express.Router();
const postController = require("../controllers/post.controller");
const authenticate = require("./authenticate");

// POST /api/posts
router.post("/api/posts", authenticate, postController.createPost);

// GET /api/posts/:id
router.get("/api/posts/:id", authenticate, postController.getPost);

// GET /api/all_posts
router.get("/api/all_posts", authenticate, postController.getAllPosts);

// DELETE /api/posts/:id
router.delete("/api/posts/:id", authenticate, postController.deletePost);

// POST /api/like/:id
router.post("/api/like/:id", authenticate, postController.likePost);

// POST /api/unlike/:id
router.post("/api/unlike/:id", authenticate, postController.unlikePost);

// POST /api/comment/:id
router.post("/api/comment/:id", authenticate, postController.addComment);

module.exports = router;
