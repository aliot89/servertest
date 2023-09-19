const sql = require('mssql');
  require('dotenv').config(); 
const config = {
  user: process.env.DB_USER, // better stored in an app setting such as process.env.DB_USER
  password: process.env.DB_PASS, // better stored in an app setting such as process.env.DB_PASSWORD
  server: process.env.DB_SERVER, // better stored in an app setting such as process.env.DB_SERVER
  port: Number(process.env.PORTSQL), // optional, defaults to 1433, better stored in an app setting such as process.env.DB_PORT
  database: process.env.DB_DATABASE, // better stored in an app setting such as process.env.DB_NAME
  authentication: {
    type: "default",
  },
  options: {
    encrypt: true,
    trustServerCertificate: true,
  },
};


exports.Execute = async (query) => {
  try {
    const connect = await sql.connect(config);
    console.log('Kết nối thành công đến cơ sở dữ liệu MSSQL.');

    // Thực hiện các thao tác với cơ sở dữ liệu ở đây
    const result = await connect.request().query(query);
  
    sql.close();
    return result;
  } catch (error) {
    console.error('Lỗi khi kết nối đến cơ sở dữ liệu MSSQL:', error);
  }
}
// {
//   recordsets: [],
//   recordset: undefined,
//   output: {},
//   rowsAffected: [ 1 ]
// }

