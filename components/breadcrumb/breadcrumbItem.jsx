import React from 'react';
import PropTypes from 'prop-types';

export default class BreadcrumbItem extends React.Component {
  static __IDOLL_BREADCRUMB_ITEM = true;

  static defaultProps = {
    prefixCls: 'idoll-breadcrumb',
    separator: '/'
  };

  static proprTypes = {
    prefixCls: PropTypes.string,
    separator: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.element
    ]),
    href: PropTypes.string
  };

  render() {
    const { prefixCls, separator, children, ...restProps } = this.props;
    let link;
    if ('href' in this.props) {
      link = <a className={`${prefixCls}-link`} {...restProps}>{children}</a>
    } else {
      link = <span className={`${prefixCls}-link`} {...restProps}>{children}</span>
    }
    if (children) {
      return (
        <span>
          {link}
          <span className={`${prefixCls}-separator`}>{separator}</span>
        </span>
      )
    }
    return null;
  }
}
