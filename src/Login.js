import React, {Component} from 'react'
import {View, Text, Dimensions, SafeAreaView, Image} from 'react-native'
import Svg, {
  Path,
  Rect
} from "react-native-svg";
import {GoogleSignin, GoogleSigninButton, statusCodes} from "react-native-google-signin";
import {GoogleApiAvailabilityType} from "react-native-firebase";
import {connect} from 'react-redux'
import {changeEmail, changeName, changeLoginStatus, resetAll} from "./actions";
import * as Progress from 'react-native-progress';
import firebase from 'react-native-firebase'

class Login extends Component {
  constructor(props) {
    super(props)
    this.state = {
      width: Dimensions.get('window').width,
      height: Dimensions.get('window').height,
      signInLoading: false
    }
  }

  componentDidMount() {
    Dimensions.addEventListener('change', (e) => {
      const {width, height} = e.window;
      this.setState({width, height});
    })
  }

  initSignIn() {
    GoogleSignin.configure({
      webClientId: '803179619735-si8u44e8a3uairu80o7gih1sgh9jub83.apps.googleusercontent.com',
      offlineAccess: true,
      forceConsentPrompt: true,
      iosClientId: '803179619735-nqdt8hukfn5u4091mks7chgmva18k020.apps.googleusercontent.com',
    });
    this.signIn()
  }

  showError(error) {
    alert(error)
  }

  getHouse() {
    const ref = firebase.firestore().collection('users').doc(this.props.userDetailsReducer.email)
    firebase.firestore().runTransaction(async transaction => {
      const doc = await transaction.get(ref)
      if (!doc.exists) {
        transaction.set(ref, {house: 'uninitialized'})
        alert('user is not in db')
        return {house: 'uninitialized'}
      }
      transaction.update(ref, {house: doc.data().house})
      if (doc.data().house == 'uninitialized') {
        this.props.navigation.navigate('ChooseHouse')
      } else {
        const resetAction = StackActions.reset({
          index: 0,
          actions: [NavigationActions.navigate({routeName: 'Tab'})],
        });
        this.props.navigation.dispatch(resetAction);
      }
      return
    })
  }

  renderLoginButton() {
    if (this.state.signInLoading) {
      return (
          <Progress.CircleSnail color={['red', 'green', 'blue', 'yellow', 'black']} style={{
            marginTop: 32
          }}/>
      )
    }
    return (
        <GoogleSigninButton style={{
          height: 48,
          width: this.state.width - 32,
          marginTop: 32
        }} color={GoogleSigninButton.Color.Dark} onPress={() => {
          this.setState({signInLoading: true})
          this.initSignIn()
        }}/>
    )
  }

  async signIn() {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      this.props.changeName(userInfo.user.name)
      this.props.changeEmail(userInfo.user.email)
      this.props.changeLoginStatus(true)
      this.getHouse()
    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        this.showError("User cancelled signin")
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        this.showError('Play services not available')
      } else {
        this.showError('An error occurred')
      }
    }
  };

  render() {
    return (
        <View style={{
          flex: 1
        }}>
          <Svg style={{
            position: 'absolute',
            height: this.state.height,
            width: this.state.width
          }}>
            <Path d={`
              M0 0
              L${this.state.width} 0
              L0 ${this.state.height / 3}
              M${this.state.width} ${this.state.height / 3}
              L${this.state.width} 0
              L0 ${this.state.height / 3}
            `} fill={'#5F2998'}/>
            <Path d={`
              M0 ${this.state.height / 3}
              C${this.state.width / 3} ${this.state.height / 4} ${this.state.width / 2} ${this.state.height / 2.5} ${this.state.width} ${this.state.height / 3}
            `} fill={'white'}/>
            <Path d={`
              M${this.state.width} ${this.state.height / 3}
              S${this.state.width / 100 * 80} ${this.state.height / 2.6} ${this.state.width / 2.05} ${this.state.height / 3}
            `} fill={'#5F2998'}/>
          </Svg>
          <SafeAreaView style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <Text style={{
              fontWeight: '600',
              fontSize: 50,
              color: 'white',
              fontFamily: 'Avenir Next',
              textAlign: 'center'
            }}>
              Welcome to Points
            </Text>
          </SafeAreaView>
          <View style={{
            flex: 2.5,
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <View style={{
              flex: 1,
              justifyContent: 'flex-end',
            }}>
              <Text style={{
                fontSize: 20,
                fontFamily: 'Avenir Next',
                margin: 16
              }}>
                To start your journey, please sign in with your SST Google Account
              </Text>
            </View>
            <View style={{
              flex: 1,
              justifyContent: 'flex-start',
            }}>
              {this.renderLoginButton()}
            </View>
          </View>
        </View>
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
  resetAll: () => dispatch(resetAll())
})

export default connect(mapStateToProps, mapDispatchToProps)(Login)
