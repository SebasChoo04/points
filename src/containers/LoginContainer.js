import React, {Component} from 'react'
import Login from "../components/Login";
import {connect} from 'react-redux'
import {changeEmail, changeHouse, changeLoginStatus, changeName, resetAll, changeAccess} from "../actions";

const mapStateToProps = (state) => {
  return state
}

const mapDispatchToProps = (dispatch) => ({
  changeEmail: email => dispatch(changeEmail(email)),
  changeName: name => dispatch(changeName(name)),
  changeLoginStatus: loginStatus => dispatch(changeLoginStatus(loginStatus)),
  resetAll: () => dispatch(resetAll()),
  changeHouse: house => dispatch(changeHouse(house)),
  changeAccess: access => dispatch(changeAccess(access))
})

export default connect(mapStateToProps, mapDispatchToProps)(Login)
