// import { getRedirectPath } from '../util.jsx';
import { services, urls } from 'api/index'

// 定义常量

const AUTH_SUCCESS = 'AUTH_SUCCESS';
const LOGOUT = 'LOGOUT';
const ERROR_MSG = 'ERROR_MSG';

// 用户的初始状态
const initState = {
	redirectTo: '', // 页面跳转
	isAuth: false, // 是否有被授权访问权限，取决于是否登录成功
	msg: '', // 当前是否有报错信息
	userName: '', // 用户名
	pwd: '', // 密码
};

// reducer
export default function user(state = initState, action) {
	console.log(`action.type: ${action.type}`);
	if (action) {
		switch (action.type) {
			case AUTH_SUCCESS:
				return {
					userName: action.payload
				}
			// case ERROR_MSG:

			// case LOGOUT:

			// default:
			// 	return state;
		}
	}
	return state;
}

// 定义action

export function login({user, pwd}) {
	console.log('====================================');
	console.log('login');
	console.log('====================================');
	if (!user || !pwd) {
		return errorMsg('必须输入账号密码')
	}
	// 发送异步消息
	return dispatch => {
		console.log(`logindispatch: ${dispatch}`); // @TODO SHANCHU
		services.get(urls.login, { user, pwd }, data => {
			// 数据成功传入后台
			dispatch(authSuccess(data))
		}, err => {
			dispatch(errorMsg(err));
		});
	}
}


export function logoutSubmit() {
	return { type: LOGOUT }
}
function authSuccess(obj) {
	// 过滤掉pwd，只传入其他的data
	const { pwd, ...data } = obj;
	// console.log(data)
	return { type: AUTH_SUCCESS, payload: data }
}
function errorMsg(msg) {
	return { type: ERROR_MSG, msg: msg }
}


