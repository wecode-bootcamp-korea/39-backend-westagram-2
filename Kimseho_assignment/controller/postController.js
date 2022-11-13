const postService = require("../service/postService");

const getAllPosts = async (req, res) => {
  try {
    const result = await postService.getAllPosts();
    return res.status(201).json({
      message: result,
    });
  } catch (err) {
    console.log(err);
    return res.status(err.statusCode || 500).json({ message: err.message });
  }
};

const getPosts = async (req, res) => {
  try {
    const user = req.user;
    const result = await postService.getPostByUserId(user);

    return res.status(201).json({
      data: result,
    });
  } catch (err) {
    console.log(err);
    return res.status(err.statusCode || 500).json({ message: err.message });
  }
};

const postUp = async (req, res) => {
  try {
    const user = req.user;

    const { posting_title, posting_content, posting_imgUrl } = req.body;

    await postService.postUp(
      user.id,
      posting_title,
      posting_content,
      posting_imgUrl
    );

    return res.status(201).json({ message: "postCreated!" });
  } catch (err) {
    console.log(err);
    return res.status(err.statusCode || 500).json({ message: err.message });
  }
};

const postPatch = async (req, res) => {
  try {
    const postId = +req.params.postId;

    const { posting_title, posting_content, posting_imgUrl } = req.body;

    await postService.postUp(
      posting_title,
      posting_content,
      posting_imgUrl,
      postId
    );

    return res.status(201).json({ message: "postUpdated!" });
  } catch (err) {
    console.log(err);
    return res.status(err.statusCode || 500).json({ message: err.message });
  }
};

const postDel = async (req, res) => {
  try {
    const postId = +req.params.postId;

    await postService.postDel(postId);

    return res.status(204).json({ message: "postDeleted" });
  } catch (err) {
    console.log(err);
    return res.status(err.statusCode || 500).json({ message: err.message });
  }
};

const postLike = async (req, res) => {
  try {
    const user = req.user;
    const postId = +req.params.postId;

    await postService.postLike(user.id, postId);

    return res.status(201).json({ message: "likeCreatedOrDeleted" });
  } catch (err) {
    console.log(err);
    return res.status(err.statusCode || 500).json({ message: err.message });
  }
};

module.exports = {
  getAllPosts,
  getPosts,
  postUp,
  postPatch,
  postDel,
  postLike,
};
