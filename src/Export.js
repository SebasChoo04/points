import React, {Component} from 'react'
import {View, Text} from 'react-native'
import Main from './Main'
import {PersistGate} from "redux-persist/integration/react";
import {Provider} from "react-redux";
import {persistor, store} from './store/index';

class Export extends Component {
  render() {
    return (
        <Provider store={store}>
          <PersistGate loading={<View/>} persistor={persistor}>
            <Main/>
          </PersistGate>
        </Provider>
    )
  }
}

export default Export
