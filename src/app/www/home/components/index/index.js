import React, { Component } from 'react'
import ReactDOM             from 'react-dom'

import Template             from './index.jade';
import styles               from './index.scss'




class TestApp extends Component {
  render() {
    return Template(styles);
  }
}

ReactDOM.render(
  <TestApp />,
  document.getElementById('app')
)