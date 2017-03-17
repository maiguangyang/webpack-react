import React, { Component } from 'react'
import ReactDOM             from 'react-dom'


class TestApp extends Component {
  render() {
    return (
      <div>AdminApp</div>
    )
  }
}

ReactDOM.render(
  <TestApp />,
  document.getElementById('app')
)