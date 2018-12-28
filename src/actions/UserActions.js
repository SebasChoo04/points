import {redux} from "../Constants";

export function changeEmail(email) {
  return {
    type: redux.USER_EMAIL,
    email
  }
}

export function changeName(name) {
  return {
    type: redux.USER_NAME,
    name
  }
}

export function changeLoginStatus(loginStatus) {
  return {
    type: redux.USER_LOGIN_STATUS,
    loginStatus
  }
}

export function resetAll() {
  return {
    type: redux.RESET_ALL
  }
}

export function changeHouse(house) {
  return {
    type: redux.USER_HOUSE,
    house
  }
}

export function changeAllEggCount(count) {
  return {
    type: redux.ALL_EGG,
    count
  }
}

export function changeSteps(steps) {
  return {
    type: redux.USER_STEPS,
    steps
  }
}
