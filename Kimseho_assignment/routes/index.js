const express = require("express");

const userRouter = require("./userRouter");
const postRouter = require("./postRouter");

const router = express.Router();

router.use("/users", userRouter);
router.use("/posts", postRouter);

module.exports = router;
