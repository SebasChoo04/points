import React from 'react';
import {Text, View, FlatList} from 'react-native';
import firebase from 'react-native-firebase';
import {connect} from 'react-redux'
import {changeEmail, changeLoginStatus, changeName, resetAll} from "./actions";

class AnnouncementScreen extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      Announcements: [],
    }
    this.firebaseRef = firebase.firestore().collection('announcements').doc(this.props.userDetailsReducer.house.toLowerCase())
  }

  componentDidMount() {
    this.getFirebaseData()
  }

  async getFirebaseData() {
    firebase.firestore().runTransaction(async transaction => {
      const doc = await transaction.get(this.firebaseRef)
      if (!doc.exists) {
        alert('An error has occurred, please contact Sebastian Choo')
        transaction.set(this.firebaseRef, {Error: 'Invalid doc in AnnouncementScreen.js'})
        return {}
      }
      const announcementHouse = doc.data()['announcement']
      var arr = []
      Object.keys(announcementHouse).forEach((x) => {
        var j = {}
        j['key'] = x
        j['data'] = announcementHouse[x]
        arr.push(j)
      })
      this.setState({Announcements: arr}, () => {
        this.setState({loading: false})
      })
      transaction.update(this.firebaseRef, doc.data())
      alert(this.state.Announcements)
    })
  }

  render() {
    return (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>

        </View>
    );
  }
}

const mapStateToProps = (state) => {
  return state
}

const mapDispatchToProps = (dispatch) => ({
  changeEmail: email => dispatch(changeEmail(email)),
  changeName: name => dispatch(changeName(name)),
  changeLoginStatus: loginStatus => dispatch(changeLoginStatus(loginStatus)),
  resetAll: () => dispatch(resetAll())
})


export default connect(mapStateToProps, mapDispatchToProps)(AnnouncementScreen)
