const express = require("express");

const postController = require("../controller/postController");
const { loginRequired } = require("../utils/checkUser");

const router = express.Router();

router.get("/all", postController.getAllPosts);
router.get("", loginRequired, postController.getPosts);
router.post("", loginRequired, postController.postUp);
router.post("/like/:postId", loginRequired, postController.postLike);
router.patch("/:postId", loginRequired, postController.postPatch);
router.delete("/:postId", loginRequired, postController.postDel);

module.exports = router;
