import React, {Component} from 'react'
import {View, Text, SafeAreaView, Dimensions, FlatList, TouchableOpacity} from 'react-native'
import {connect} from 'react-redux'
import Svg from "react-native-svg";
import Path from "react-native-svg/elements/Path";
import LinearGradient from "react-native-linear-gradient";
import {changeEmail, changeHouse, changeLoginStatus, changeName, resetAll} from "./actions";
import firebase from 'react-native-firebase'
import {NavigationActions, StackActions} from "react-navigation";

class ChooseHouse extends Component {
  constructor(props) {
    super(props)
    this.state = {
      width: Dimensions.get('window').width,
      height: Dimensions.get('window').height,
    }
  }

  componentDidMount() {
    Dimensions.addEventListener('change', (e) => {
      const {width, height} = e.window;
      this.setState({width, height});
    })
  }

  setHouse(house) {
    const ref = firebase.firestore().collection('users').doc(this.props.userDetailsReducer.email)
    firebase.firestore().runTransaction(async transaction => {
      const doc = await transaction.get(ref)
      transaction.update(ref, {house: house})
      this.props.changeLoginStatus(true)
      this.props.changeHouse(house)
      const resetAction = StackActions.reset({
        index: 0,
        actions: [NavigationActions.navigate({routeName: 'Tab'})],
      });
      this.props.navigation.dispatch(resetAction);
      return {house: house}
    })
  }

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
              fontSize: 30,
              color: 'white',
              fontFamily: 'Avenir Next',
              textAlign: 'center'
            }}>
              What House Are You From?
            </Text>
          </SafeAreaView>
          <View style={{
            flex: 0.3
          }}>
          </View>
          <View style={{
            flex: 2.7,
          }}>
            <FlatList data={
              [
                {
                  key: 'Black',
                  color: ['black', 'white']
                },
                {
                  key: 'Blue',
                  color: ['blue', 'white']
                },
                {
                  key: 'Green',
                  color: ['green', 'white']
                },
                {
                  key: 'Red',
                  color: ['red', 'white']
                },
                {
                  key: 'Yellow',
                  color: ['yellow', 'white']
                },
              ]
            } style={{
              flex: 1,
              marginTop: 32
            }} renderItem={({item}) => {
              return (
                  <TouchableOpacity style={{
                    width: this.state.width - 32,
                    height: 75,
                    marginLeft: 16,
                    alignItems: 'center',
                    flexDirection: 'row',
                  }} onPress={() => {
                    this.setHouse(item.key)
                  }}>
                    <View style={{
                      flex: 1,
                      alignItems: 'flex-end',
                      justifyContent: 'center',
                      marginRight: 40
                    }}>
                      <LinearGradient useAngle={true} angleCenter={{x: 0.5, y: 0.5}} angle={45} colors={item.color}
                                      style={{
                                        height: 60,
                                        aspectRatio: 1,
                                        borderRadius: 30
                                      }}>
                      </LinearGradient>
                    </View>
                    <View style={{
                      flex: 1.5,
                      alignItems: 'flex-start',
                      justifyContent: 'center',
                      marginLeft: 8
                    }}>
                      <Text style={{
                        fontFamily: 'Avenir Next',
                        fontSize: 30,
                      }}>
                        {item.key}
                      </Text>
                    </View>
                  </TouchableOpacity>
              )
            }}/>
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
  resetAll: () => dispatch(resetAll()),
  changeHouse: house => dispatch(changeHouse(house))
})

export default connect(mapStateToProps, mapDispatchToProps)(ChooseHouse)
