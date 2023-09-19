const express = require("express");
const userRouter = express.Router();
const userController = require("./users.controller");
const { isAuth } = require("../auth/auth.middleware");
userRouter.get("/profile", isAuth, userController.profile);
module.exports = userRouter;
