import React, {Component} from 'react'
import {View, Text} from 'react-native'
import StepTrackerScreen from "../components/StepTrackerScreen";
import {changeEmail, changeHouse, changeLoginStatus, changeName, resetAll, changeSteps, changeRec, changeAccess} from "../actions";
import {connect} from 'react-redux'
import {access} from "../Constants";
import StepAnalytics from "../components/StepAnalytics";

//TODO - if else with props to determine screen to go to

class StepTrackerStatsContainer extends Component {
  checkAccessLevel(){
    if (this.props.userDetailsReducer.access === access.student) {
      return <StepTrackerScreen {...this.props}/>
    } else {
      return <StepAnalytics {...this.props}/>
    }
  }
  render() {
    return (
      this.checkAccessLevel()
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
