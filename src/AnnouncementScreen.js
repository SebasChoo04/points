import React from 'react';
import {
  Text,
  View,
  FlatList,
  Dimensions,
  SafeAreaView,
  TouchableOpacity,
  Animated,
  RefreshControl,
  Alert,
  Image
} from 'react-native';
import firebase from 'react-native-firebase';
import {connect} from 'react-redux'
import {changeEmail, changeLoginStatus, changeName, resetAll, changeAllEggCount} from "./actions";
import Svg, {
  Path,
  LinearGradient,
  Stop
} from "react-native-svg";
import {Fonts} from "./Constants";
import {TabView, SceneMap} from 'react-native-tab-view';
import * as Progress from "react-native-progress";
import Markdown from 'react-native-simple-markdown'

class AnnouncementScreen extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      width: Dimensions.get('window').width,
      svgHeight: Dimensions.get('window').height / 3,
      height: Dimensions.get('window').height,
      Announcements: [],
      AnnouncementsAll: [],
      houseLoading: true,
      allLoading: true,
      navigationBar: {
        index: 0,
        routes: [{
          key: 'House',
          title: 'House',
        },
          {
            key: 'All',
            title: 'All',
          }],
      },
      houseRefreshing: false,
      allRefreshing: false,
    }
    this.firebaseRef = firebase.firestore().collection('announcements').doc(this.props.userDetailsReducer.house.toLowerCase())
    this.firebaseRefAll = firebase.firestore().collection('announcements').doc('everyone')
  }

  componentDidMount() {
    this.getFirebaseData()
    this.getFirebaseDataAll()
    Dimensions.addEventListener('change', (e) => {
      const {width, height} = e.window;
      const modHeight = height / 3
      this.setState({width, svgHeight: modHeight, height});
    })
  }

  getFirebaseData() {
    firebase.firestore().runTransaction(async transaction => {
      const doc = await transaction.get(this.firebaseRef)
      if (!doc.exists) {
        alert('An error has occurred, please contact Sebastian Choo')
        transaction.set(this.firebaseRef, {Error: 'Invalid doc in AnnouncementScreen.js'})
        return {Error: 'Invalid doc in AnnouncementScreen.js'}
      }
      const y = doc.data().announcement.slice(0)
      this.setState({Announcements: y}, () => {
        this.setState({houseLoading: false})
      })
      transaction.update(this.firebaseRef, doc.data())
    })
  }

getFirebaseDataAll() {
    firebase.firestore().runTransaction(async transaction => {
      const doc = await transaction.get(this.firebaseRefAll)
      if (!doc.exists) {
        alert('An error has occurred, please contact Sebastian Choo')
        transaction.set(this.firebaseRefAll, {Error: 'Invalid doc in AnnouncementScreen.js'})
        return {Error: 'Invalid doc in AnnouncementScreen.js'}
      }
      const y = doc.data().announcement.slice(0)
      this.setState({AnnouncementsAll: y}, () => {
        this.setState({allLoading: false})
      })
      transaction.update(this.firebaseRefAll, doc.data())
    })
  }

  tabBarColor() {
    switch (this.props.userDetailsReducer.house) {
      case 'Red':
        return '#af4448'
      case 'Black':
        return '#373737'
      case 'Green':
        return "#519657"
      case 'Yellow':
        return "#fdd835"
      case 'Blue':
        return "#0093c4"
    }
  }

  houseAnnouncements() {
    if (this.state.houseLoading) {
      return (
        <View style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <Progress.CircleSnail color={['red', 'green', 'blue', 'yellow', 'black']}/>
        </View>
      )
    }
    return (
      <View style={{
        flex: 1
      }}>
        <FlatList data={this.state.Announcements} keyExtractor={(item, index) => index.toString()}
                  style={{
                    flex: 1,
                  }}
                  refreshControl={
                    <RefreshControl
                      refreshing={this.state.houseRefreshing}
                      onRefresh={this.getFirebaseData()}
                    />
                  }
                  renderItem={({item}) => {
                    String.prototype.replaceAll = function (str1, str2, ignore) {
                      return this.replace(new RegExp(str1.replace(/([\/\,\!\\\^\$\{\}\[\]\(\)\.\*\+\?\|\<\>\-\&])/g, "\\$&"), (ignore ? "gi" : "g")), (typeof (str2) == "string") ? str2.replace(/\$/g, "$$$$") : str2);
                    }
                    const x = item.content.replaceAll("<br/>", `\n`)
                    return (
                      <View style={{
                        backgroundColor: this.tabBarColor(),
                        width: this.state.width - 32,
                        alignSelf: 'center',
                        padding: 16,
                        marginTop: 16,
                        borderRadius: 5
                      }}>
                        <Text style={{
                          color: 'white',
                          fontFamily: Fonts.MEDIUM,
                          fontSize: 20
                        }}>
                          {item.title}
                        </Text>
                        <Markdown styles={{
                          text: {
                            color: 'white',
                            fontFamily: Fonts.REGULAR
                          },
                          heading1: {
                            color: 'white',
                            fontFamily: Fonts.MEDIUM,
                            fontSize: 25,
                            fontWeight: '600'
                          },
                          strong: {
                            fontWeight: 'bold',
                            fontFamily: Fonts.REGULAR,
                          },
                          heading2: {
                            color: 'white',
                            fontFamily: Fonts.MEDIUM,
                            fontSize: 20,
                            fontWeight: '600'
                          }
                        }}>
                          {x}
                        </Markdown>
                      </View>
                    )
                  }}/>
      </View>
    )
  }

  allAnnouncements() {
    if (this.state.allLoading) {
      return (
        <View style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <Progress.CircleSnail color={['red', 'green', 'blue', 'yellow', 'black']}/>
        </View>
      )
    }
    return (
      <View style={{
        flex: 1
      }}>
        <FlatList data={this.state.AnnouncementsAll} keyExtractor={(item, index) => index.toString()}
                  style={{
                    flex: 1,
                  }}
                  refreshControl={
                    <RefreshControl
                      refreshing={this.state.allRefreshing}
                      onRefresh={this.getFirebaseDataAll()}
                    />
                  }
                  renderItem={({item}) => {
                    String.prototype.replaceAll = function (str1, str2, ignore) {
                      return this.replace(new RegExp(str1.replace(/([\/\,\!\\\^\$\{\}\[\]\(\)\.\*\+\?\|\<\>\-\&])/g, "\\$&"), (ignore ? "gi" : "g")), (typeof (str2) == "string") ? str2.replace(/\$/g, "$$$$") : str2);
                    }
                    const x = item.content.replaceAll("<br/>", `\n`)
                    return (
                      <View style={{
                        backgroundColor: this.tabBarColor(),
                        width: this.state.width - 32,
                        alignSelf: 'center',
                        padding: 16,
                        marginTop: 16,
                        borderRadius: 5
                      }}>
                        <Text style={{
                          color: 'white',
                          fontFamily: Fonts.MEDIUM,
                          fontSize: 20
                        }}>
                          {item.title}
                        </Text>
                        <Markdown styles={{
                          text: {
                            color: 'white',
                            fontFamily: Fonts.REGULAR
                          },
                          heading1: {
                            color: 'white',
                            fontFamily: Fonts.MEDIUM,
                            fontSize: 25,
                            fontWeight: '600'
                          },
                          strong: {
                            fontWeight: 'bold',
                            fontFamily: Fonts.REGULAR,
                          },
                          heading2: {
                            color: 'white',
                            fontFamily: Fonts.MEDIUM,
                            fontSize: 20,
                            fontWeight: '600'
                          },
                        }}>
                          {x}
                        </Markdown>
                      </View>
                    )
                  }}/>
      </View>
    )
  }

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
          <TabView
            style={{
              width: this.state.width,
              height: this.state.height
            }}
            initialLayout={{
              width: this.state.width,
              height: this.state.height
            }}
            navigationState={this.state.navigationBar}
            onIndexChange={(index) => {
              var clone = Object.assign({}, this.state.navigationBar)
              clone.index = index
              this.setState({navigationBar: clone})
            }}
            renderScene={SceneMap({
                House: () => {
                  return (
                    <View style={{
                      flex: 1
                    }}>
                      {this.houseAnnouncements()}
                    </View>
                  )
                },
                All: () => {
                  return (
                    <View style={{
                      flex: 1
                    }}>
                      {this.allAnnouncements()}
                    </View>
                  )
                }
              }
            )}
            renderTabBar={(props) => {
              const inputRange = props.navigationState.routes.map((x, i) => i);
              return (
                <View style={{
                  flexDirection: 'row',
                  backgroundColor: this.tabBarColor(),
                  height: 50
                }}>
                  {props.navigationState.routes.map((route, i) => {
                    const color = props.position.interpolate({
                      inputRange,
                      outputRange: inputRange.map(
                        inputIndex => (inputIndex === i ? 'white' : '#A9A9A9')
                      ),
                    });
                    return (
                      <TouchableOpacity
                        onPress={() => {
                          if (i == 1) {
                            if (this.props.userDetailsReducer.count == 50) {
                              Alert.alert(
                                'All Announcements!',
                                `Congratulations!\nYou have discovered the one and only announcement that doesn't exist...oh...`,
                                [
                                  {
                                    text: 'Ok', onPress: () => {
                                      const ref = firebase.firestore().collection('eggs').doc('all')
                                      firebase.firestore().runTransaction(async transaction => {
                                        const doc = await transaction.get(ref)
                                        if (!doc.exists) {
                                          transaction.set(ref, {people: [this.props.userDetailsReducer.email]})
                                          return {people: [this.props.userDetailsReducer.email]}
                                        }
                                        var x = doc.data().people.slice(0)
                                        x.push(this.props.userDetailsReducer.email)
                                        transaction.update(ref, {people: x})
                                        return
                                      })
                                    }
                                  },
                                ],
                                {cancelable: false}
                              )
                            }
                            this.props.changeAllEggCount(this.props.userDetailsReducer.count += 1)
                          }
                          var clone = Object.assign({}, this.state.navigationBar)
                          clone.index = i
                          this.setState({navigationBar: clone})
                        }}
                        style={{
                          flex: 1,
                          alignItems: 'center',
                          justifyContent: 'center'
                        }} key={i}>
                        <Animated.Text style={{
                          color,
                          fontFamily: Fonts.MEDIUM,
                          fontWeight: '500',
                          fontSize: 17
                        }}>
                          {route.title}
                        </Animated.Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              );
            }}
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
  resetAll: () => dispatch(resetAll()),
  changeAllEggCount: (count) => dispatch(changeAllEggCount(count))
})


export default connect(mapStateToProps, mapDispatchToProps)(AnnouncementScreen)
