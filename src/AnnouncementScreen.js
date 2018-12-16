import React from 'react';
import {Text, View, FlatList, Dimensions, SafeAreaView} from 'react-native';
import firebase from 'react-native-firebase';
import {connect} from 'react-redux'
import {changeEmail, changeLoginStatus, changeName, resetAll} from "./actions";
import Svg, {
  Path,
  LinearGradient,
  Stop
} from "react-native-svg";
import {Fonts} from "./Constants";
import {TabView, TabBar, SceneMap} from 'react-native-tab-view';

class AnnouncementScreen extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      width: Dimensions.get('window').width,
      svgHeight: Dimensions.get('window').height / 3,
      height: Dimensions.get('window').height,
      Announcements: [],
      loading: true
    }
    this.firebaseRef = firebase.firestore().collection('announcements').doc(this.props.userDetailsReducer.house.toLowerCase())
  }

  componentDidMount() {
    this.getFirebaseData()
    Dimensions.addEventListener('change', (e) => {
      const {width, height} = e.window;
      const modHeight = height / 3
      this.setState({width, svgHeight: modHeight, height});
    })
  }

  async getFirebaseData() {
    firebase.firestore().runTransaction(async transaction => {
      const doc = await transaction.get(this.firebaseRef)
      if (!doc.exists) {
        alert('An error has occurred, please contact Sebastian Choo')
        transaction.set(this.firebaseRef, {Error: 'Invalid doc in AnnouncementScreen.js'})
        return {Error: 'Invalid doc in AnnouncementScreen.js'}
      }
      const y = doc.data().announcement.slice(0)
      this.setState({Announcements: y}, () => {
        this.setState({loading: false})
      })
      transaction.update(this.firebaseRef, doc.data())
    })
  }

  // bottomCurveColor() {
  //   switch (this.props.userDetailsReducer.house) {
  //     case 'Red':
  //       return '#af4448'
  //     case 'Black':
  //       return '#373737'
  //     case 'Green':
  //       return "#519657"
  //     case 'Yellow':
  //       return "#fdd835"
  //     case 'Blue':
  //       return "#0093c4"
  //   }
  // }

  render() {
    return (
      <View style={{
        backgroundColor: 'white',
        flex: 1
      }}>
        <Svg style={{
          position: 'absolute',
          height: this.state.height,
          width: this.state.width
        }}>
          <LinearGradient x1="50%" y1="0%" x2="50%" y2="100%" id="blue">
            <Stop stopColor="#4fc3f7" stopOpacity="1" offset="0%"/>
            <Stop stopColor="#0093c4" stopOpacity="1" offset="100%"/>
          </LinearGradient>
          <LinearGradient x1="50%" y1="0%" x2="50%" y2="100%" id="red">
            <Stop stopColor="#e57373" stopOpacity="1" offset="0%"/>
            <Stop stopColor="#af4448" stopOpacity="1" offset="100%"/>
          </LinearGradient>
          <LinearGradient x1="50%" y1="0%" x2="50%" y2="100%" id="green">
            <Stop stopColor="#81c784" stopOpacity="1" offset="0%"/>
            <Stop stopColor="#519657" stopOpacity="1" offset="100%"/>
          </LinearGradient>
          <LinearGradient x1="50%" y1="0%" x2="50%" y2="100%" id="yellow">
            <Stop stopColor="#fff176" stopOpacity="1" offset="0%"/>
            <Stop stopColor="#fdd835" stopOpacity="1" offset="100%"/>
          </LinearGradient>
          <LinearGradient x1="50%" y1="0%" x2="50%" y2="100%" id="black">
            <Stop stopColor="#616161" stopOpacity="1" offset="0%"/>
            <Stop stopColor="#373737" stopOpacity="1" offset="100%"/>
          </LinearGradient>
          <Path d={`
              M0 0
              L${this.state.width} 0
              L0 ${this.state.svgHeight / 3}
              M${this.state.width} ${this.state.svgHeight / 3}
              L${this.state.width} 0
              L0 ${this.state.svgHeight / 3}
            `} fill={`url(#${this.props.userDetailsReducer.house.toLowerCase()})`}/>
          {/*<Path d={`*/}
          {/*M-5 ${this.state.svgHeight / 3 + 1}*/}
          {/*C${this.state.width / 3} ${this.state.svgHeight / 4} ${this.state.width / 2} ${this.state.svgHeight / 2.5} ${this.state.width} ${this.state.svgHeight / 3 + 1}*/}
          {/*`} fill={'white'}/>*/}
          {/*<Path d={`*/}
          {/*M${this.state.width + 5} ${this.state.svgHeight / 3 - 1}*/}
          {/*S${this.state.width / 100 * 80} ${this.state.svgHeight / 2.5} ${this.state.width / 2.2} ${this.state.svgHeight / 3 - 1}*/}
          {/*`} fill={this.bottomCurveColor()}/>*/}

        </Svg>
        <SafeAreaView style={{
          height: this.state.svgHeight / 3,
          width: '100%',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <Text style={{
            fontFamily: Fonts.MEDIUM,
            fontSize: 20,
            color: 'white'
          }}>
            Announcements
          </Text>
        </SafeAreaView>
        <View style={{
          flex: 12,
        }}>
          <TabBar
            initialLayout={{
              width: this.state.width
            }}
            navigationState={{
              index: 0,
              routes: [{
                key: 'House',
                title: 'House',
              },
                {
                  key: 'All',
                  title: 'All',
                }],
            }}
            renderScene={SceneMap({
              'House': () => {
                return (
                  <View style={{
                    flex: 1,
                  }}/>
                )
              },
              'All': () => {
                return (
                  <View style={{
                    flex: 1,
                  }}/>
                )
              }
            })}
          />
        </View>
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
