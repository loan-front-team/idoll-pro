import React from 'react';
import { Redirect, Switch } from 'react-router-dom';
import DocumentTitle from 'react-document-title';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'



import Layout from 'components/layout';

import SiderMenu from 'component/sider-menu';
import GlobalHeader from 'component/global-header';

import { logout } from 'reduxes/user.redux'
import data from '../../data';
import logo from 'assets/images/logo.png';
import { getMenuData } from './getMenuData';
import { getRedirect } from 'utils/getRedirect';

import styles from './index.less';

const Sider = Layout.Sider;
const Content = Layout.Content;
const Header = Layout.Header;


// 根据菜单取得重定向地址
const menus = getMenuData();
// console.log('menus', menus);
menus.forEach(getRedirect);

class BasicLayout extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      collapsed: false,
    }
  }
  getPageTitle() {
    const { routerData, location } = this.props;
    const { pathname } = location;
    let title = data.common.systemName;
    if (routerData[pathname] && routerData[pathname].name) {
      title = `${routerData[pathname].name}`;
    }
    return title;
  }
  handleQuit = () => {
    this.props.logout()
  }
  onCollapse = (collapsed) => {
    this.setState({
      collapsed
    });
  }
	render() {
    const {
      currentUser,
      location,
      systemName
    } = this.props;
    const layout = (
      <Layout>
        <Sider
          collapsed={this.state.collapsed}
          span={{fold: '1', unfold: '10'}}
        >
          <SiderMenu
            logo={logo}
            location={location}
            menuData={getMenuData()}
            collapsed={this.state.collapsed}
            onCollapse={this.onCollapse}
            toggle
           />
        </Sider>
        <Layout>
          <Header className={styles.header} >
            <GlobalHeader
              currentUser={currentUser}
              systemName={systemName}
              routerPath={this.getPageTitle()}
              onQuit={this.handleQuit}
              collapsed={this.state.collapsed}
            />
          </Header>
          <Content className={styles.content}>
            <Switch>
              {this.props.children}
            </Switch>
          </Content>
        </Layout>
      </Layout>
      )

    return (
      <DocumentTitle title={this.getPageTitle()}>
        {
          this.props.redirectTo && this.props.redirectTo !== this.props.match.path
          ? <Redirect to={
            this.props.redirectTo
          }
          /> : layout }
      </DocumentTitle>
      )
	}
}
function mapStateToProps(state) {
  return {
    redirectTo: state.user.redirectTo
  }
}

function mapStateToDispatch(dispatch) {
  return {
    logout: bindActionCreators(logout, dispatch)
  }
}
export default connect(mapStateToProps, mapStateToDispatch)(BasicLayout);

