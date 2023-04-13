const User = require("../models/user.model");
const Post = require("../models/post.model");
const jwt = require("jsonwebtoken");

// POST /api/authenticate
exports.authenticateUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }
    const user = await User.findOne({ email, password });
    if (!user) {
      return res.status(401).json({ message: "Authentication failed" });
    }
    const token = jwt.sign({ id: user._id }, process.env.SECRET);
    return res.json({ token });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

// POST /api/follow/:id
exports.followUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const currentUser = await User.findById(req.user.id);
    if (!currentUser.following.includes(user._id)) {
      currentUser.following.push(user._id);
      await currentUser.save();
      user.followers.push(currentUser._id);
      await user.save();
    }
    return res.status(200).json({ message: "User followed successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

// POST /api/unfollow/:id
exports.unfollowUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const currentUser = await User.findById(req.user.id);
    if (currentUser.following.includes(user._id)) {
      currentUser.following.pull(user._id);
      await currentUser.save();
      user.followers.pull(currentUser._id);
      await user.save();
    }
    return res.status(200).json({ message: "User unfollowed successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

// GET /api/user
exports.getUserProfile = async (req, res) => {
  console.log(req.user);
  try {
    const user = await User.findById(req.user.id)
      .populate("followers", "_id name")
      .populate("following", "_id name");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const userProfile = {
      name: user.name,
      followersCount: user.followers.length,
      followingCount: user.following.length,
    };
    return res.status(200).json(userProfile);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal server error", error: error });
  }
};
