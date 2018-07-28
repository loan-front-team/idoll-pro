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
	if (action) {
		switch (action.type) {
			case AUTH_SUCCESS:
				return {
          ...state,
          ...action.payload,
          redirectTo: '/',
          isAuth: true,
				}
			case ERROR_MSG:
        return {
          ...state,
          msg: action.msg
        }
			case LOGOUT:
        return {
          ...initState,
          redirectTo: '/login',
          isAuth: false,
        }
			default:
				return state;
		}
	}
	return state;
}

// 定义action

export function login({user, pwd}) {
	if (!user || !pwd) {
		return errorMsg('必须输入账号密码')
	}
	// 发送异步消息
	return dispatch => {
		services.get(urls.login, { user, pwd }, data => {
			// 数据成功传入后台
			dispatch(authSuccess(data))
		}, err => {
			dispatch(errorMsg(err));
		});
	}
}

export function logout() {
	return (dispatch) => {
    services.get(urls.logout, {}, data => {
      dispatch(logoutSuccess(data))
    }, err => {
      dispatch(errorMsg(err))
    })
  }
}
function authSuccess(obj) {
	return {
    type: AUTH_SUCCESS,
    payload: obj,
  }
}
function errorMsg(msg) {
	return { type: ERROR_MSG, msg: msg }
}
function logoutSuccess(data) {
  return {
    type: LOGOUT
  }
}


