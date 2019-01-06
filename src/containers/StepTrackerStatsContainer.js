import React, {Component} from 'react'
import {View, Text} from 'react-native'
import StepTrackerScreen from "../components/StepTrackerScreen";
import {changeEmail, changeHouse, changeLoginStatus, changeName, resetAll, changeSteps, changeRec, changeAccess} from "../actions";
import {connect} from 'react-redux'

//TODO - if else with props to determine screen to go to

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
  changeSteps: steps => dispatch(changeSteps(steps)),
  changeRec: date => dispatch(changeRec(date)),
})

export default connect(mapStateToProps, mapDispatchToProps)(StepTrackerStatsContainer)
