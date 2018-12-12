import React, {Component} from 'react'
import {View, Text} from 'react-native'
import firebase from 'react-native-firebase'

class App extends Component {
  componentDidMount() {
    const ref = firebase.firestore().collection('users').doc('sebasfucked')
    firebase.firestore().runTransaction(async (transaction) => {
      const doc = await transaction.get(ref)
      if (!doc.exists) {
        transaction.set(ref, {sebasgay: 1000000000000000})
        return {sebasgay: 0}
      }
    })
  }
  render() {
    return (
        <View>
        </View>
    )
  }
}

export default App
