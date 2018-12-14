import {userDetailsReducer} from './UserReducer'
import {combineReducers} from 'redux'
import {redux} from "../Constants";
import storage from 'redux-persist/lib/storage'

const appReducer = combineReducers({
  userDetailsReducer,
})

const rootReducer = (state, action) => {
  if (action.type === redux.RESET_ALL) {
    Object.keys(state).forEach(key => {
      storage.removeItem(`persist:${key}`);
    });
    state = undefined;
  }

  return appReducer(state, action)
}

export default rootReducer
