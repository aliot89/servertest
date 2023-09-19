const db = require("../../connection");
exports.getUser= async(username )=>{ 
	try {
		const rs = await db.Execute(`SELECT * FROM DT_user_manager WHERE user_name = '${username}'`);
	 
		return rs.recordset[0] || null;
	} catch (error) {
		return null;
	} 
}
// {
//   recordsets: [],
//   recordset: undefined,
//   output: {},
//   rowsAffected: [ 1 ]
// }

exports.createUser=  async({username,password})=>{
    try { 
		return await db.Execute(`INSERT INTO DT_user_manager (user_name,password,create_at) VALUES('${username}','${password}' ,GETDATE())`);
	} catch (error) {
		return null;
	} 
}

exports.updateRefreshToken = async (username, refreshToken) => {
	try {  
		const rs =  await db.Execute(`UPDATE DT_user_manager SET refresh_token='${refreshToken}' WHERE user_name = '${username}'`);
		console.log(username);
		return rs;
	} catch (error) {
		return null;
	} 
};
