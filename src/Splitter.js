import React, {Component} from 'react'
import {connect} from 'react-redux'
import {StackActions, NavigationActions} from 'react-navigation'

class Splitter extends Component {
  componentDidMount() {
    if (this.props.userDetailsReducer.loginStatus) {
      const resetAction = StackActions.reset({
        index: 0,
        actions: [NavigationActions.navigate({routeName: 'Tab'})],
      });
      this.props.navigation.dispatch(resetAction);
      return
    }
    const resetAction = StackActions.reset({
      index: 0,
      actions: [NavigationActions.navigate({routeName: 'Login'})],
    });
    this.props.navigation.dispatch(resetAction);
  }
  render() {
    return null
  }
}

const mapStateToProps = (state) => {
  return state
}

export default connect(mapStateToProps)(Splitter)
