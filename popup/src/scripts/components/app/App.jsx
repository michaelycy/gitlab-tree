import React, { Component } from 'react';
import { connect } from 'react-redux';

import Options from '../options';

import './styles.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.optionList = [
      {
        name: '兼容模式',
        keyName: 'compatibility-mode',
        type: 'CheckBox',
        defaultVal: true,
      },
      {
        name: '自动模式',
        keyName: 'auto-theme',
        type: 'CheckBox',
        defaultVal: false,
      },
    ];
  }

  render() {
    const { options, dispatch } = this.props;
    return (
      <div className="gitlab-tree-popup">
        <div className="gitlab-tree-options-heading">Gitlab Tree Options</div>
        <Options
          options={options}
          optionList={this.optionList}
          changeOptions={newOptions => {
            dispatch({
              type: 'OPTIONS_CHANGED',
              payload: newOptions,
            });
          }}
        />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  options: state.options,
});

export default connect(mapStateToProps)(App);
