import React, {Component} from 'react'
import {View, Text, Dimensions, SafeAreaView, Image} from 'react-native'
import Svg, {Path, LinearGradient, Stop} from "react-native-svg";
import {GoogleSignin, GoogleSigninButton, statusCodes} from "react-native-google-signin";
import * as Progress from 'react-native-progress';
import firebase from 'react-native-firebase'
import {StackActions, NavigationActions} from 'react-navigation'
import {Fonts, access} from "../Constants";

class Login extends Component {
  constructor(props) {
    super(props)
    this.state = {
      width: Dimensions.get('window').width,
      height: Dimensions.get('window').height,
      signInLoading: false
    }
    this.flagRef = firebase.firestore().collection('users').doc('flag')
  }

  componentDidMount() {
    Dimensions.addEventListener('change', (e) => {
      const {width, height} = e.window;
      this.setState({width, height});
    })
  }

  initSignIn() {
    GoogleSignin.configure({
      webClientId: '803179619735-e3uv6mn7barc2837b50bajll3rvimscv.apps.googleusercontent.com',
      offlineAccess: true,
      forceConsentPrompt: true,
      iosClientId: '803179619735-nqdt8hukfn5u4091mks7chgmva18k020.apps.googleusercontent.com',
    });
    GoogleSignin.signOut()
    this.signIn()
  }

  showError(error) {
    alert(error)
  }

  getHouse() {
    //TODO - route to different tabs for teacher
    const ref = firebase.firestore().collection('users').doc(this.props.userDetailsReducer.email)
    firebase.firestore().runTransaction(async transaction => {
      const doc = await transaction.get(ref)
      if (!doc.exists) {
        transaction.set(ref, {house: 'uninitialized'})
        this.props.navigation.navigate('ChooseHouse')
        return {house: 'uninitialized'}
      }
      transaction.update(ref, {house: doc.data().house})
      if (doc.data().house === 'uninitialized') {
        this.props.navigation.navigate('ChooseHouse')
      } else {
        this.props.changeLoginStatus(true)
        this.props.changeHouse(doc.data().house)
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

  getAccess() {
    firebase.firestore().runTransaction(async transaction => {
      const doc = await transaction.get(this.flagRef)
      if (!doc.exists) {
        transaction.set(this.flagRef, {house: [], superAdmin: []})
        return
      }
      doc.data().house.forEach((x) => {
        if (x == this.props.userDetailsReducer.email) {
          this.props.changeAccess(access.house)
          return
        }
      })
      doc.data().superAdmin.forEach((x) => {
        if (x == this.props.userDetailsReducer.email) {
          this.props.changeAccess(access.superAdmin)
          return
        }
      })
    })
  }

  async signIn() {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      this.props.changeName(userInfo.user.name)
      this.props.changeEmail(userInfo.user.email)
      this.getAccess()
      this.getHouse()
    } catch (error) {
      this.setState({signInLoading: false})
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        this.showError("User cancelled signin")
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        this.showError('Play services not available')
      } else {
        this.showError('An error occurred')
        console.log(error)
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
            <LinearGradient x1="50%" y1="0%" x2="50%" y2="100%" id="purple">
              <Stop stopColor="#ba68c8" stopOpacity="1" offset="0%"/>
              <Stop stopColor="#883997" stopOpacity="1" offset="100%"/>
            </LinearGradient>
            <Path d={`
              M0 0
              L${this.state.width} 0
              L0 ${this.state.height / 3}
              M${this.state.width} ${this.state.height / 3}
              L${this.state.width} 0
              L0 ${this.state.height / 3}
            `} fill={`url(#purple)`}/>
            <Path d={`
              M0 ${this.state.height / 3}
              C${this.state.width / 3} ${this.state.height / 4} ${this.state.width / 2} ${this.state.height / 2.5} ${this.state.width} ${this.state.height / 3}
            `} fill={'white'}/>
            <Path d={`
              M${this.state.width} ${this.state.height / 3}
              S${this.state.width / 100 * 80} ${this.state.height / 2.6} ${this.state.width / 2.05} ${this.state.height / 3}
            `} fill={'#883997'}/>
          </Svg>
          <SafeAreaView style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <Text style={{
              fontSize: 50,
              color: 'white',
              fontFamily: 'Raleway-Bold',
              textAlign: 'center',
              margin: 16,
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
                fontFamily: Fonts.MEDIUM,
                margin: 16,
                textAlign: 'center'
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

export default Login
