import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';

export default function Grid(props) {
    const {prefixCls = 'idoll-card', bodyStyle, ...others} = props;
    const gridClassName = classNames(`${prefixCls}-grid`, classNames);
    return (
      <div {...others} className={gridClassName} style={bodyStyle} />
    )
};

Grid.Protypes = {
    classNames: PropTypes.string,
    prefixCls: PropTypes.string,
}

