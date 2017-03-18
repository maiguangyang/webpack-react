import './index.scss'

import React, { Component } from 'react'
import ReactDOM             from 'react-dom'
import Template             from './index.html';




class TestApp extends Component {
  render() {
    console.log(Template);

    let Template = 'test';
    return (
      <div> { Template } </div>
    )
  }
}

ReactDOM.render(
  <TestApp />,
  document.getElementById('app')
)