import React from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'


import Alert from 'components/alert';
import Checkbox from 'components/checkbox';

import Login from 'component/login';

import Image from 'assets/images/logo.png';
import { login } from 'reduxes/user.redux'
import styles from './index.less';


const { UserName, Password, Submit } = Login;
class LoginPage extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			notice: '',
			autoLogin: true,
      username: '',
      password: '',
		}
	}
	errorMsg = (message) => {
		// console.log('message', message);
		this.setState({
			notice: message
		})
	}
	onSubmit = (err, values) => {
		if (err) {
      this.errorMsg(err)
    }
    // 将信息存入redux
    this.props.login({
      user: values.username,
      pwd: values.password,
    })
	}
	changeAutoLogin = (e) => {
    this.setState({
      autoLogin: e.target.checked,
    });
	}
	handleChange(key, value) {
    this.setState({
      // 一定要加中括号，不然就变成字符串了
      [key]: value,
    });
	}
	render() {
return this.props.user.redirectTo && this.props.user.redirectTo !== this.props.match.path
? <Redirect to={
  this.props.user.redirectTo
}
/> : (
  <div className={styles.loginpage}>
    <div className={styles.header}>
      <img src={Image} alt='' />
      {/* <span>{data.common.systemName}</span> */}
    </div>
    <Login
      onSubmit={this.onSubmit}
      className='content'
			>
      {
				this.state.notice &&
				<Alert style={{ marginBottom: 24 }} message={this.state.notice} type='error' showIcon closable />
			}
      <UserName name='username' onChange={value => this.handleChange('username', value)} />
      <Password name='password' onChange={value => this.handleChange('password', value)} />
      <div>
        <Checkbox checked={this.state.autoLogin} onChange={this.changeAutoLogin}>自动登录</Checkbox>
        <a style={{ float: 'right' }} href=''>忘记密码</a>
      </div>
      <Submit className='loginButton'>登录</Submit>
    </Login>
  </div>
		);
	}
};
function mapStateToProps(state) {
	return {
    user: state.user
	}
}
function mapStateToDispatch(dispatch) {
	return {
		login: bindActionCreators(login, dispatch)
	}
}
export default connect(mapStateToProps, mapStateToDispatch)(LoginPage);
