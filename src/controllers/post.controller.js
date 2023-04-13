// POST /api/posts
exports.createPost = async (req, res) => {
  try {
    const post = new Post({
      title: req.body.title,
      description: req.body.description,
      user_id: req.user.id,
    });
    await post.save();
    return res.status(200).json({
      postId: post._id,
      title: post.title,
      description: post.description,
      createdAt: post.createdAt,
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

// GET /api/posts/:id
exports.getPost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    const postProfile = {
      _id: post._id,
      title: post.title,
      description: post.description,
      user_id: post.user_id,
      likes: post.likes,
      likesCount: post.likes.length,
      comments: post.comments,
      commentsCount: post.comments.length,
      createdAt: post.createdAt,
    };
    return res.status(200).json(postProfile);
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

// GET /api/all_posts
exports.getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find({ user_id: req.user.id }).sort({
      createdAt: -1,
    });
    const result = posts.map((post) => {
      return {
        post_id: post._id,
        title: post.title,
        description: post.description,
        createdAt: post.createdAt,
        comments: post.comments,
        likes: post.likes.length,
      };
    });
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

// DELETE /api/posts/:id
exports.deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    if (post.user.toString() !== req.user.id) {
      return res
        .status(401)
        .json({ message: "You are not authorized to delete this post" });
    }
    await post.remove();
    return res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

// POST /api/like/:id
exports.likePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    if (post.likes.includes(req.user.id)) {
      return res.status(400).json({ message: "Post already liked" });
    }
    post.likes.push(req.user.id);
    await post.save();
    return res.status(200).json({ message: "Post liked successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

// POST /api/unlike/:id
exports.unlikePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    if (!post.likes.includes(req.user.id)) {
      return res.status(400).json({ message: "Post not yet liked" });
    }
    post.likes.pull(req.user.id);
    await post.save();
    return res.status(200).json({ message: "Post unliked successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

// POST /api/comment/:id
exports.addComment = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    const comment = {
      text: req.body.text,
      user: req.user.id,
    };
    post.comments.push(comment);
    await post.save();
    const newCommentId = post.comments[post.comments.length - 1]._id;
    return res.status(200).json({ commentId: newCommentId });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};
