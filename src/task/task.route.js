const express = require("express");
const taskRouter = express.Router("./task.route");
const taskController = require("./task.controller");
const { isAuth } = require("../auth/auth.middleware");
taskRouter.post("/callMechanic", isAuth, taskController.callMechanic);
taskRouter.post("/mechanicAccept", isAuth, taskController.mechanicAccept);
taskRouter.post("/userCfmfinish", isAuth, taskController.userCfmfinish);
taskRouter.post("/machineCfmfinish", isAuth, taskController.machineCfmfinish);
module.exports = taskRouter;
