import React, {Component} from 'react'
import {View, Text} from 'react-native'
import AddPostScreen from "../components/AddPostScreen";
import {changeEmail, changeHouse, changeLoginStatus, changeName, changeRec, changeSteps, resetAll} from "../actions";
import {connect} from 'react-redux'

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

export default connect(mapStateToProps, mapDispatchToProps)(AddPostScreen)
