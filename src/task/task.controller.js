const taskModel = require("./task.models");
const userModel = require("../users/users.models");
const { createResponse } = require("../../variables/createResponse");
var admin = require("firebase-admin");
var FCM = require("fcm-node");
var serverkey =
  "AAAAHlvA-68:APA91bHkIlBmlzMSVsftMqw6f_4TwgkTwOVNS8HYCNoyJCm4rrvb9YvIaDYGZd2-m1OCsQe3WAqz88NHBdDUzDsdgtFUhRM0IzZtqzg7xjBlW24QhtU9bomg_qYMJXcOi5IDI-4eeSTe";
var fcm = new FCM(serverkey);
function sendMessing(user, content) {
  let token =
    "cl9s1OQToNjgBKkqRYDru8:APA91bGVXsanPfVR7LiUSSaEHhRiCUnzt78N79sTSJkioAiPP5KWLUlk51kSoRFZAmbQhg5oSJKNponVdQNbz8d0zUhIIzvPorl9cmYtx6u2Cigg_AnuUJqP7oMB3u1t_LJOeoXq9fND";
  let token1 =
    "dWWAl64Pu_bl9nwDSGnT08:APA91bFkFotBhda2NeCbCgj632of--vBqfCzB_AkYRk67A7yxK9AaInVyddEM1nao5554HKgvl4YE9XPA13nh4SGSURbar-XevK78Q9dp_Bar7YEHNzcCMVmUPLrLqJREma6sq8m-Mgp";
  let token2 =
    "fal1mgoxws089huakmby4b:APA91bGuR1Zk3TrSFWSQvu_fV2GTpeJ2kt19SdDTrcvAF9aBv2NVI4LNovxeg-BJkZOXo2mTqsKZ4r8Lih8TRpJveXkaKHS4oYZRrCF7gxGC38nReDjd8Jy6UcVrkzKjqxtbmkaUVmAV";
  let token3 =
    "eJfUydJyKus3N8Ulv_2-Md:APA91bG1Lf_8VFU4w28r1QH9LHpYrDBgn7A5BJc3b9IVoIs5DmkNnF4kSidiyW7Sc6zIzvdIF4xGlHwH-JXhyqB8K5ilbw1ctOmEeWiHBzjF0Bou8D6tRi0CMs7znJjvxP-OxjVKeNdn";
  let url = "https://test-83t2fumra-aliot89.vercel.app";
  let URL2 = "https://reactjs-jx9nxtfev-aliot89.vercel.app/";
  var message = {
    to: token2,
    // collapse_key: "XXX",
    // data: {
    //   my_key: "my value",
    //   contents: "abcv/",
    // },
    notification: {
      title: "Thông báo",
      body: user + " " + content,
      click_action: url,
      vibrate_timings: ["0.0s", "0.2s", "0.1s", "o.2s"],
      tag: "vibration-sample",
      image: "/firebase-logo.png",
      sound: "/testnotification.wav",
    },
  };

  fcm.send(message, function (err, response) {
    if (err) {
      console.log(message);
      console.log("Something has gone wrong !");
    } else {
      console.log("Successfully sent with resposne :", response);
    }
  });
}
exports.callMechanic = async (req, res) => {
  const id_machine = req.body.id_machine;
  const id_user_request = req.body.id_user_request;
  const remark = req.body.remark;
  const getask0 = {
    id_machine: id_machine,
    id_user_request: id_user_request,
    remark: remark,
  };
  const task = await taskModel.getTask(getask0);
  const lean_req = await userModel.getUser(id_user_request);
  console.log("tesst", task);
  if (task != null)
    res
      .status(409)
      .send(
        createResponse(409, "Task đã tồn tại.", { id_machine: id_machine })
      );
  else {
    const newTask = {
      id_machine: id_machine,
      id_user_request: id_user_request,
      remark: remark,
    };
    console.log("task", newTask);
    const createTask = await taskModel.createTask(newTask);
    console.log(createTask);
    if (!createTask) {
      return res
        .status(400)
        .send("Có lỗi trong quá trình tạo task, vui lòng thử lại.");
    }
    const checkMechanic = await taskModel.getMechanic(lean_req.lean);
    // console.log("â", checkMechanic);
    const idMechanic = await taskModel.checkMechanic(
      checkMechanic[0].user_name
    );
    var fullUrl = req.protocol + "://" + req.get("host");
    console.log("id", fullUrl);
    if (idMechanic.numberMechanic == 0) {
      const lean_req = await userModel.getUser(checkMechanic[0].user_name);
      let content = "Gửi yêu cầu sửa máy! bấm vào để xem chi tiết!";
      sendMessing(lean_req.user_name, content);
      return res.send(
        createResponse(0, "Gửi yêu cầu thành công!.", {
          id: lean_req.id,
          user_name: lean_req.user_name,
        })
      );
    }
  }
};
exports.mechanicAccept = async (req, res) => {
  const usermechanic = req.body.id_user_mechanic;
  const cfm_status = req.body.cfm_status;
  const idmachine = req.body.id_machine;

  const updateTask = {
    usermechanic: usermechanic,
    cfm_status: cfm_status,
    idmachine: idmachine,
  };
  if (req.body.cfm_status == 2) {
    const asignTask = await taskModel.assignTask(updateTask);
    console.log(asignTask);

    if (asignTask.rowsAffected > 0) {
      let content =
        "Đã chấp nhận yêu cầu! Vui lòng chờ, thợ sửa đang trên đường đến!";
      sendMessing(usermechanic, content);
      return res.send(createResponse(0, "Gửi yêu cầu thành công!."));
    }
  } else {
    const asignTask = await taskModel.assignTask(updateTask);
    if (asignTask.rowsAffected > 0) {
      let content = "Đã từ chối yêu cầu! Vui lòng thử lại sau một vài phút!";
      sendMessing(usermechanic, content);
      return res.send(createResponse(0, "Gửi yêu cầu thành công!."));
    }
  }
};

exports.userCfmfinish = async (req, res) => {
  const usermechanic = req.body.id_user_mechanic;
  const cfm_status = req.body.cfm_status;
  const idmachine = req.body.id_machine;
  const updateTask = {
    usermechanic: usermechanic,
    cfm_status: cfm_status,
    idmachine: idmachine,
  };
  if (req.body.cfm_status == 3) {
    const asignTask = await taskModel.cfmFinishTask(updateTask);
    console.log(asignTask);

    if (asignTask.rowsAffected > 0) {
      return res.send(createResponse(0, "Gửi yêu cầu thành công!."));
    }
  }
};
exports.machineCfmfinish = async (req, res) => {
  const usermechanic = req.body.id_user_mechanic;
  const cfm_status = req.body.cfm_status;
  const idmachine = req.body.id_machine;
  const updateTask = {
    usermechanic: usermechanic,
    cfm_status: cfm_status,
    idmachine: idmachine,
  };
  if (req.body.cfm_status == 4) {
    const asignTask = await taskModel.cfmFinishTask(updateTask);
    console.log(asignTask);

    if (asignTask.rowsAffected > 0) {
      return res.send(createResponse(0, "Gửi yêu cầu thành công!."));
    }
  }
};
