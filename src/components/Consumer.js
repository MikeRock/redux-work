import React, { Component } from 'react'
import { connect } from 'react-redux'
class Consumer extends Component {
  constructor() {
    super()
  }
  render() {
    return <div>{this.props.prop}</div>
  }
}
const mapStateToProps = (state) => ({
  prop: state.prop
})
export default connect(mapStateToProps)(Consumer)