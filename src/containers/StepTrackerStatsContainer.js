import React, {Component} from 'react'
import {View, Text} from 'react-native'
import StepTrackerScreen from "../components/StepTrackerScreen";
import {changeEmail, changeHouse, changeLoginStatus, changeName, resetAll, changeSteps} from "../actions";
import {connect} from 'react-redux'

class StepTrackerStatsContainer extends Component {
  render() {
    return (
        <StepTrackerScreen {...this.props}/>
    )
  }
}

const mapStateToProps = (state) => {
  return state
}

const mapDispatchToProps = (dispatch) => ({
  changeEmail: email => dispatch(changeEmail(email)),
  changeName: name => dispatch(changeName(name)),
  changeLoginStatus: loginStatus => dispatch(changeLoginStatus(loginStatus)),
  resetAll: () => dispatch(resetAll()),
  changeHouse: house => dispatch(changeHouse(house)),
  changeSteps: steps => dispatch(changeSteps(steps))
})

export default connect(mapStateToProps, mapDispatchToProps)(StepTrackerStatsContainer)
