
import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import Menu from '../../components/Menu'

class App extends Component {
  render() {
    const { todos, actions, children } = this.props
    return (
      <div>
        <Menu />
      </div>
    )
  }
}

export default connect(
  null,
  null
)(App)
