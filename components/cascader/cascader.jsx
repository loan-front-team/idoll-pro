import * as React from 'react';
import RcCascader from 'rc-cascader';
import arrayTreeFilter from 'array-tree-filter';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import omit from 'omit.js';
import KeyCode from 'rc-util/lib/KeyCode';
import Input from '../input';
import Icon from '../icon';

import './style/index';

function highlightKeyword(str, keyword, prefixCls) {
  return str.split(keyword)
    .map((node, index) => index === 0 ? node : [
      <span className={`${prefixCls}-menu-item-keyword`} key='seperator'>{keyword}</span>,
      node,
    ]);
}

function defaultFilterOption(inputValue, path = []) {
  return path.some(option => (option.label).indexOf(inputValue) > -1);
}

function defaultRenderFilteredOption(inputValue, path = [], prefixCls) {
  return path.map(({ label }, index) => {
    const node = (label).indexOf(inputValue) > -1
      ? highlightKeyword(label, inputValue, prefixCls) : label;
    return index === 0 ? node : [' / ', node];
  });
}

function defaultSortFilteredOption(a, b, inputValue) {
  function callback(elem) {
    return (elem.label).indexOf(inputValue) > -1;
  }

  return a.findIndex(callback) - b.findIndex(callback);
}

const defaultDisplayRender = (label) => label.join(' / ');

export default class Cascader extends React.Component {
  static PropTypes = {
      defaultValue: PropTypes.array,
      filter: PropTypes.bool,
      matchInputWidth: PropTypes.number,
      className: PropTypes.string,
      value: PropTypes.string,
      popupClassName: PropTypes.string,
      placeholder: PropTypes.string,
      size: PropTypes.string,
      disabled: PropTypes.bool,
      showSearch: PropTypes.bool,
      inputPrefixCls: PropTypes.string,
      popupVisible: PropTypes.bool,
      changeOnSelect: PropTypes.bool,
      loadData: PropTypes.func,
      onChange: PropTypes.func


  }
  static defaultProps = {
    prefixCls: 'idoll-cascader',
    inputPrefixCls: 'idoll-input',
    placeholder: '请选择 select',
    transitionName: 'slide-up',
    popupPlacement: 'bottomLeft',
    options: [],
    disabled: false,
    allowClear: true,
    notFoundContent: '暂无结果',
  };

//   cachedOptions: CascaderOptionType[];

//   private input: Input;

  constructor(props) {
    super(props);
    this.state = {
      value: props.value || props.defaultValue || [],
      inputValue: '',
      inputFocused: false,
      popupVisible: props.popupVisible,
      flattenOptions: props.showSearch && this.flattenTree(props.options, props.changeOnSelect),
    };
  }

  componentWillReceiveProps(nextProps) {
    if ('value' in nextProps) {
      this.setState({ value: nextProps.value || [] });
    }
    if ('popupVisible' in nextProps) {
      this.setState({ popupVisible: nextProps.popupVisible });
    }
    if (nextProps.showSearch && this.props.options !== nextProps.options) {
      this.setState({ flattenOptions: this.flattenTree(nextProps.options, nextProps.changeOnSelect) });
    }
  }

  handleChange = (value, selectedOptions) => {
    this.setState({ inputValue: '' });
    if (selectedOptions[0].__IS_FILTERED_OPTION) {
      const unwrappedValue = value[0];
      const unwrappedSelectedOptions = selectedOptions[0].path;
      this.setValue(unwrappedValue, unwrappedSelectedOptions);
      return;
    }
    this.setValue(value, selectedOptions);
  }

  handlePopupVisibleChange = (popupVisible) => {
    if (!('popupVisible' in this.props)) {
      this.setState({
        popupVisible,
        inputFocused: popupVisible,
        inputValue: popupVisible ? this.state.inputValue : '',
      });
    }

    const onPopupVisibleChange = this.props.onPopupVisibleChange;
    if (onPopupVisibleChange) {
      onPopupVisibleChange(popupVisible);
    }
  }

  handleInputBlur = () => {
    this.setState({
      inputFocused: false,
    });
  }

  handleInputClick = (e) => {
    const { inputFocused, popupVisible } = this.state;
    // Prevent `Trigger` behaviour.
    if (inputFocused || popupVisible) {
      e.stopPropagation();
      e.nativeEvent.stopImmediatePropagation();
    }
  }

  handleKeyDown = (e) => {
    if (e.keyCode === KeyCode.BACKSPACE) {
      e.stopPropagation();
    }
  }

  handleInputChange = (e) => {
    const inputValue = e.target.value;
    this.setState({ inputValue });
  }

  setValue = (value, selectedOptions) => {
    if (!('value' in this.props)) {
      this.setState({ value });
    }
    const onChange = this.props.onChange;
    if (onChange) {
      onChange(value, selectedOptions);
    }
  }

  getLabel() {
    const { options, displayRender = defaultDisplayRender } = this.props;
    const value = this.state.value;
    const unwrappedValue = Array.isArray(value[0]) ? value[0] : value;
    const selectedOptions = arrayTreeFilter(options,
      (o, level) => o.value === unwrappedValue[level],
    );
    const label = selectedOptions.map(o => o.label);
    return displayRender(label, selectedOptions);
  }

  clearSelection = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!this.state.inputValue) {
      this.setValue([]);
      this.handlePopupVisibleChange(false);
    } else {
      this.setState({ inputValue: '' });
    }
  }

  flattenTree(options, changeOnSelect, ancestor = []) {
    let flattenOptions = [];
    options.forEach((option) => {
      const path = ancestor.concat(option);
      if (changeOnSelect || !option.children || !option.children.length) {
        flattenOptions.push(path);
      }
      if (option.children) {
        flattenOptions = flattenOptions.concat(this.flattenTree(option.children, changeOnSelect, path));
      }
    });
    return flattenOptions;
  }

  generateFilteredOptions(prefixCls) {
    const { showSearch, notFoundContent } = this.props;
    const {
      filter = defaultFilterOption,
      render = defaultRenderFilteredOption,
      sort = defaultSortFilteredOption,
    } = showSearch;
    const { flattenOptions, inputValue } = this.state;
    const filtered = flattenOptions.filter((path) => filter(this.state.inputValue, path))
      .sort((a, b) => sort(a, b, inputValue));

    if (filtered.length > 0) {
      return filtered.map((path) => {
        return {
          __IS_FILTERED_OPTION: true,
          path,
          label: render(inputValue, path, prefixCls),
          value: path.map((o) => o.value),
          disabled: path.some((o) => o.disabled),
        }
      });
    }
    return [{ label: notFoundContent, value: 'ANT_CASCADER_NOT_FOUND', disabled: true }];
  }

  focus() {
    this.input.focus();
  }

  blur() {
    this.input.blur();
  }

  saveInput = (node) => {
    this.input = node;
  }

  render() {
    const { props, state } = this;
    const {
      prefixCls, inputPrefixCls, children, placeholder, size, disabled,
      className, style, allowClear, showSearch = false, ...otherProps
    } = props;
    const value = state.value;

    const sizeCls = classNames({
      [`${inputPrefixCls}-lg`]: size === 'large',
      [`${inputPrefixCls}-sm`]: size === 'small',
    });
    const clearIcon = (allowClear && !disabled && value.length > 0) || state.inputValue ? (
      <Icon
        type='right'
        className={`${prefixCls}-picker-clear`}
        onClick={this.clearSelection}
      />
    ) : null;
    const arrowCls = classNames({
      [`${prefixCls}-picker-arrow`]: true,
      [`${prefixCls}-picker-arrow-expand`]: state.popupVisible,
    });
    const pickerCls = classNames(
      className, `${prefixCls}-picker`, {
      [`${prefixCls}-picker-with-value`]: state.inputValue,
      [`${prefixCls}-picker-disabled`]: disabled,
      [`${prefixCls}-picker-${size}`]: !!size,
    });

    const inputProps = omit(otherProps, [
      'onChange',
      'options',
      'popupPlacement',
      'transitionName',
      'displayRender',
      'onPopupVisibleChange',
      'changeOnSelect',
      'expandTrigger',
      'popupVisible',
      'getPopupContainer',
      'loadData',
      'popupClassName',
      'filterOption',
      'renderFilteredOption',
      'sortFilteredOption',
      'notFoundContent',
    ]);

    let options = props.options;
    if (state.inputValue) {
      options = this.generateFilteredOptions(prefixCls);
    }
    // Dropdown menu should keep previous status until it is fully closed.
    if (!state.popupVisible) {
      options = this.cachedOptions;
    } else {
      this.cachedOptions = options;
    }

    const dropdownMenuColumnStyle = {};
    const isNotFound = (options || []).length === 1 && options[0].value === 'ANT_CASCADER_NOT_FOUND';
    if (isNotFound) {
      dropdownMenuColumnStyle.height = 'auto'; // Height of one row.
    }
    // The default value of `matchInputWidth` is `true`
    const resultListMatchInputWidth = (showSearch).matchInputWidth !== false;
    if (resultListMatchInputWidth && state.inputValue && this.input) {
      dropdownMenuColumnStyle.width = this.input.input.offsetWidth;
    }

    const input = children || (
      <span
        style={style}
        className={pickerCls}
      >
        <span className={`${prefixCls}-picker-label`}>
          {this.getLabel()}
        </span>
        <Input
          {...inputProps}
          ref={this.saveInput}
          prefixCls={inputPrefixCls}
          placeholder={value && value.length > 0 ? undefined : placeholder}
          className={`${prefixCls}-input ${sizeCls}`}
          value={state.inputValue}
          disabled={disabled}
          readOnly={!showSearch}
          autoComplete='off'
          onClick={showSearch ? this.handleInputClick : undefined}
          onBlur={showSearch ? this.handleInputBlur : undefined}
          onKeyDown={this.handleKeyDown}
          onChange={showSearch ? this.handleInputChange : undefined}
        />
        {clearIcon}
        <Icon type='down' className={arrowCls} />
      </span>
    );

    return (
      <RcCascader
        {...props}
        options={options}
        value={value}
        popupVisible={state.popupVisible}
        onPopupVisibleChange={this.handlePopupVisibleChange}
        onChange={this.handleChange}
        dropdownMenuColumnStyle={dropdownMenuColumnStyle}
      >
        {input}
      </RcCascader>
    );
  }
}
