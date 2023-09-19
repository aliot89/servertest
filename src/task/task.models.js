const db = require("../../connection");

exports.getTask = async ({ id_machine, id_user_request }) => {
  console.log(
    `SELECT * FROM DT_task_detail WHERE id_machine  = '${id_machine}' and id_user_request ='${id_user_request}' `
  );
  try {
    const rs = await db.Execute(
      `SELECT * FROM DT_task_detail WHERE id_machine  = '${id_machine}' and id_user_request ='${id_user_request}' `
    );

    return rs.recordset[0] || null;
  } catch (error) {
    return null;
  }
};
exports.createTask = async ({ id_machine, id_user_request, remark }) => {
  try {
    console.log("haha", id_machine);

    return await db.Execute(
      `INSERT INTO DT_task_detail (id_machine ,id_user_request,date_user_request,status,reamark) VALUES ('${id_machine}','${id_user_request}',GETDATE(),1,'${remark}')`
    );
  } catch (error) {
    return null;
  }
};
exports.getMechanic = async (lean_req) => {
  try {
    const rs = await db.Execute(
      `SELECT * FROM DT_user_manager WHERE permission = 2 AND lean ='${lean_req}'`
    );
    return rs.recordset;
  } catch (error) {
    return null;
  }
};
exports.checkMechanic = async (id_user_machine) => {
  try {
    const rs = await db.Execute(
      `SELECT count(*) numberMechanic FROM DT_task_detail WHERE id_user_mechanic = '${id_user_machine}'`
    );
    return rs.recordset[0];
  } catch (error) {
    return null;
  }
};
exports.assignTask = async ({ usermechanic, cfm_status, idmachine }) => {
  try {
    if (cfm_status == 2) {
      return await db.Execute(
        `UPDATE DT_task_detail SET id_user_mechanic = '${usermechanic}' ,date_cfm_mechanic = GETDATE(), status = ${cfm_status} WHERE  id_machine = '${idmachine}' `
      );
    } else if (cfm_status == 6) {
      return await db.Execute(
        `UPDATE DT_task_detail SET status = ${cfm_status} WHERE  id_machine = '${idmachine}' `
      );
    }
  } catch (error) {
    return null;
  }
};
exports.cfmFinishTask = async ({ usermechanic, cfm_status, idmachine }) => {
  try {
    if (cfm_status == 3) {
      return await db.Execute(
        `UPDATE DT_task_detail SET date_user_cfm = GETDATE(), status = ${cfm_status} WHERE  id_machine = '${idmachine}' `
      );
    } else if (cfm_status == 4) {
      return await db.Execute(
        `UPDATE DT_task_detail SET date_mechanic_cfm_finished = GETDATE(), status = ${cfm_status} WHERE  id_machine = '${idmachine}' `
      );
    }
  } catch (error) {
    return null;
  }
};
