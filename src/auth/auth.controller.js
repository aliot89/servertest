const { createResponse } = require("../../variables/createResponse");
const userModel = require("../users/users.models");
// const bcrypt = require("bcrypt")
const jwtVariable = require('jsonwebtoken');
const authMethod = require("./auth.methods");
const randToken = require('rand-token');

// 0     thành công
// 1001  đã tồn tại
// 1002  có lỗi không xác định
// 1003  có lỗi sai dữ liệu
// 1004  lỗi không tìm thấy 



exports.register = async (req, res) => {

	const username = req.body.username;
	const password = req.body.password;
	const user = await userModel.getUser(username);

	if (user !== null || user?.length > 0) res.status(409).send(createResponse(1001, 'Tên tài khoản đã tồn tại.', { username: username }));
	else {
		// const hashPassword = bcrypt.hashSync(req.body.password, 10);
		const newUser = {
			username: username,
			password: password,
			
		};

		const createUser = await userModel.createUser(newUser);

		if (!createUser) {
			return res
				.status(400)
				.send(createResponse(1002, 'Có lỗi trong quá trình tạo tài khoản, vui lòng thử lại.', {
					username: username
				}));
		}
		return res.send(createResponse(0, "Đăng ký thành công!", {
			username: username
		}));
	}
};
// {
//   recordsets: [],
//   recordset: undefined,
//   output: {},
//   rowsAffected: [ 1 ]
// }

exports.login = async (req, res) => {
	const username = req.body.username;
	const password = req.body.password;
	
	const user = await userModel.getUser(username);
 
	if (user === null || (user?.user_name !== username || user?.password !== password)) {
		return res.status(401).send(createResponse(1003, 'Tên đăng nhập hoặc mật khẩu không chính xác!', { username: username, password: password }));
	}
	// const isPasswordValid = bcrypt.compareSync(password, user.password);
	// if (!isPasswordValid) {
	// 	return res.status(401).send('isPasswordValid hoặc mật khẩu không chính xác!');
	// }

	const accessTokenLife = process.env.ACCESS_TOKEN_LIFE;
	const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;

	const dataForAccessToken = {
		username: user.user_name,
	};
	const accessToken = await authMethod.generateToken(
		dataForAccessToken,
		accessTokenSecret,
		accessTokenLife,
	);
	if (!accessToken) {
		return res
			.status(401)
			.send(createResponse(1002, 'Có lỗi trong quá trình tạo tài khoản, hãy thử lại!.', {}));
	}

	let refreshToken = randToken.generate(64); // tạo 1 refresh token ngẫu nhiên 
	if (user.refreshToken == null) { 
		// Nếu user này chưa có refresh token thì lưu refresh token đó vào database
		await userModel.updateRefreshToken(user.user_name, refreshToken);
	} else {
		// Nếu user này đã có refresh token thì lấy refresh token đó từ database
		refreshToken = user.refreshToken;
	}
	
	return res.cookie("token",accessToken).send(createResponse(0, "Đăng nhập thành công!", { 
		msg: 'Đăng nhập thành công.',
		accessToken,
		refreshToken,
		user,
	}));
};



exports.refreshToken = async (req, res) => {
	// Lấy access token từ header
	const accessTokenFromHeader = req.headers.authorization; 
	if (!accessTokenFromHeader) {
		return res.status(400).send(createResponse(1004,'Không tìm thấy access token!',{}));
	}

	// Lấy refresh token từ body
	const refreshTokenFromBody = req.body.refreshToken;
	if (!refreshTokenFromBody) {
		return res.status(400).send(createResponse(1004,'Không tìm thấy refresh token!',{}));
	}

	const accessTokenSecret =
		process.env.ACCESS_TOKEN_SECRET || jwtVariable.accessTokenSecret;
	const accessTokenLife =
		process.env.ACCESS_TOKEN_LIFE || jwtVariable.accessTokenLife;
	 
	// Decode access token đó
	const decoded = await authMethod.decodeToken(
		accessTokenFromHeader,
		accessTokenSecret,
	);
	
	if (!decoded) {
		return res.status(400).send(createResponse(1003,'Access token không hợp lệ.',{}));
	}

	const username = decoded.payload.username; // Lấy username từ payload
	
	const user = await userModel.getUser(username);
	console.log(user);
	if (!user) {
		return res.status(401).send(createResponse(1003,'User không tồn tại.',{}));
	}

	if (refreshTokenFromBody !== user.refresh_token) {
		 
		return res.status(400).send(createResponse(1003,'Refresh token không hợp lệ.',{}));
	}

	// Tạo access token mới
	const dataForAccessToken = {
		username,
	};

	const accessToken = await authMethod.generateToken(
		dataForAccessToken,
		accessTokenSecret,
		accessTokenLife,
	);
	if (!accessToken) {
		return res
			.status(400)
			.send(createResponse(1002,'Tạo access token không thành công, vui lòng thử lại.',{}));
	}
	return res.json({
		accessToken,
	});
};
