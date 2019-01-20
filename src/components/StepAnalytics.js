  import React, {Component} from 'react'
  import {View, Text, SafeAreaView, Dimensions, TouchableOpacity, FlatList} from 'react-native'
  import Svg, {LinearGradient as SVG} from "react-native-svg";
  import Stop from "react-native-svg/elements/Stop";
  import Path from "react-native-svg/elements/Path";
  import {Fonts} from "../Constants";
  import {GoogleSignin} from "react-native-google-signin";
  import {NavigationActions, StackActions} from "react-navigation";
  import LinearGradient from "react-native-linear-gradient";
  import firebase, {firestore} from 'react-native-firebase';
  import * as Progress from "react-native-progress";
  
  class StepAnalytics extends Component {
    constructor(props){
      super(props)
      this.state = {
        height: Dimensions.get('window').height,
        width: Dimensions.get('window').width,
        svgHeight: Dimensions.get('window').height / 3,
        stepsPoints: [],
        black: 0,
        blue: 0,
        yellow: 0,
        green: 0,
        red: 0,
        loading: true
      }
      this.blackRef = firebase.firestore().collection("pedometer").doc("black")
      this.yellowRef = firebase.firestore().collection("pedometer").doc("yellow")
      this.redRef = firebase.firestore().collection("pedometer").doc("red")
      this.blueRef = firebase.firestore().collection("pedometer").doc("blue")
      this.greenRef = firebase.firestore().collection("pedometer").doc("green")
    }
    loadingBlack() {
      firebase.firestore().runTransaction(async transaction => {
        const doc = await transaction.get(this.blackRef)
        if (!doc.exists){
          transaction.set(this.blackRef, {Error: "Invalid doc in StepAnalytics.js"})
          alert("An error has occurred, please contact Sebastian Choo")
          return {}
        }
        this.setState({black: doc.data()}, () => {
          // this.setState({loading: false})
        })
        transaction.update(this.blackRef, doc.data())
      })
    }
    loadingYellow(){
      firebase.firestore().runTransaction(async transaction => {
        const doc1 = await transaction.get(this.yellowRef)
        if (!doc1.exists){
          transaction.set(this.yellowRef,{Error: "Invalid doc in StepAnalytics.js"})
          alert("An error has occurred, please contact Sebastian Choo")
          return {}
        }
        this.setState({yellow: doc1.data()}, () => {
          // this.setState({loading: false})
        })
        transaction.update(this.yellowRef, doc1.data())
      })
    }
    loadingBlue(){
      firebase.firestore().runTransaction(async transaction => {
        const doc2 = await transaction.get(this.blueRef)
        if (!doc2.exists){
          transaction.set(this.blueRef, {Error: "Invalid doc in StepAnalytics.js"})
          alert("An error has occurred, please contact Sebastian Choo")
          return {}
        }
        this.setState({blue: doc2.data()}, () => {
          // this.setState({loading: false})
        })
        transaction.update(this.blueRef, doc2.data())
      })
    }
    loadingRed(){
      firebase.firestore().runTransaction( async transaction => {
        const doc3 = await transaction.get(this.redRef)
        if (!doc3.exists){
          transaction.set(this.redRef, {Error: "Invalid doc in StepAnalytics.js"})
          alert("An error has occurred, please contact Sebastian Choo")
          return {}
        }
        this.setState({red: doc3.data()}, () => {
          // this.setState({loading: false})
        })
        transaction.update(this.redRef, doc3.data())
      })
    }
    loadingGreen(){
      firebase.firestore().runTransaction(async transaction => {
        const doc4 =  await transaction.get(this.greenRef)
        if (!doc4.exists){
          transaction.set(this.greenRef, {Error: "Invalid doc in StepAnalytics.js"})
          alert("An error has occurred, please contact Sebastian Choo")
          return {}
        }
        this.setState({green: doc4.data()}, () => {
          // this.setState({loading: false})
        })
        transaction.update(this.greenRef, doc4.data())
      })
    }
    componentDidMount(){
      this.loadingBlack()
      this.loadingGreen()
      this.loadingRed()
      this.loadingYellow()
      this.loadingBlue()
      this.setState({stepsPoints: [{house: "Blue", points: 0}, {house: "Black", points: 0}, {house: "Green", points: 0},
          {house: "Red", points: 0}, {house: "Yellow", points: 0}]})
    }
    
    loading(){
      if (this.state.stepsPoints === []){
        return(
          <View style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Progress.CircleSnail color={['red', 'green', 'blue', 'yellow', 'black']}/>
          </View>
        )
      }
      return(
        <FlatList
          data={this.state.stepsPoints}
          style={{
            flex: 1,
            marginTop: 20
          }}
          renderItem={({item}) => {
            return(
              <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginLeft: 26,
                marginTop: 30,
              }}>
                <View style={{
                  flex: 1,
                }}>
                  <LinearGradient useAngle={true} angleCenter={{x: 0.5, y: 0.5}} angle={45} colors={[item.house.toLowerCase(), 'white']}
                                  style={{
                                    height: 60,
                                    aspectRatio: 1,
                                    borderRadius: 30,
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                  }}>
                  </LinearGradient>
                </View>
                <View style={{
                  flex: 1,
                }}>
                  <Text style={{
                    color: 'black',
                    fontSize: 25,
                    fontFamily: Fonts.REGULAR
                  }}>
                    {item.house}
                  </Text>
                </View>
                <View style={{
                  flex: 1,
                  marginRight: 20,
                }}>
                  <Text style={{
                    color: 'black',
                    fontSize: 28,
                    fontFamily: 'Raleway-Bold',
                  }}>
                    {item.points} Points
                  </Text>
                </View>
              </View>
            )
          }}
        />
      )
    }
    bottomCurveColor() {
      switch (this.props.userDetailsReducer.house) {
        case 'Red':
          return '#af4448';
        case 'Black':
          return '#373737';
        case 'Green':
          return "#519657";
        case 'Yellow':
          return "#fdd835";
        case 'Blue':
          return "#0093c4"
      }
    }
    render() {
      return (
        <View style={{flex: 1}}>
          <Svg style={{
              position: 'absolute',
              height: this.state.height,
              width: this.state.width,
          }}>
            <SVG x1="50%" y1="0%" x2="50%" y2="100%" id="blue">
              <Stop stopColor="#4fc3f7" stopOpacity="1" offset="0%"/>
              <Stop stopColor="#0093c4" stopOpacity="1" offset="100%"/>
            </SVG>
            <SVG x1="50%" y1="0%" x2="50%" y2="100%" id="red">
              <Stop stopColor="#e57373" stopOpacity="1" offset="0%"/>
              <Stop stopColor="#af4448" stopOpacity="1" offset="100%"/>
            </SVG>
            <SVG x1="50%" y1="0%" x2="50%" y2="100%" id="green">
              <Stop stopColor="#81c784" stopOpacity="1" offset="0%"/>
              <Stop stopColor="#519657" stopOpacity="1" offset="100%"/>
            </SVG>
            <SVG x1="50%" y1="0%" x2="50%" y2="100%" id="yellow">
              <Stop stopColor="#fff176" stopOpacity="1" offset="0%"/>
              <Stop stopColor="#fdd835" stopOpacity="1" offset="100%"/>
            </SVG>
            <SVG x1="50%" y1="0%" x2="50%" y2="100%" id="black">
              <Stop stopColor="#616161" stopOpacity="1" offset="0%"/>
              <Stop stopColor="#373737" stopOpacity="1" offset="100%"/>
            </SVG>
              <Path d={`
                M0 0
                L${this.state.width} 0
                L0 ${this.state.svgHeight / 3}
                M${this.state.width} ${this.state.svgHeight / 3}
                L${this.state.width} 0
                L0 ${this.state.svgHeight / 3}
              `} fill={`url(#${this.props.userDetailsReducer.house.toLowerCase()})`}/>
              <Path d={`
                  M-5 ${this.state.svgHeight / 3 + 1}
                  C${this.state.width / 3} ${this.state.svgHeight / 4} ${this.state.width / 2} ${this.state.svgHeight / 2.5} ${this.state.width} ${this.state.svgHeight / 3 + 1}
                  `} fill={'white'}/>
              <Path d={`
                  M${this.state.width + 5} ${this.state.svgHeight / 3 - 1}
                  S${this.state.width / 100 * 80} ${this.state.svgHeight / 2.5} ${this.state.width / 2.2} ${this.state.svgHeight / 3 - 1}
                  `} fill={this.bottomCurveColor()}/>
            </Svg>
            <SafeAreaView style={{
              alignItems: 'center',
              justifyContent: 'center',
              width: '100%',
              height: this.state.svgHeight / 3,
            }}>
              <Text style={{
                color: 'white',
                fontFamily: Fonts.MEDIUM,
                fontSize: 20
              }}>
                Points from Pedometer
              </Text>
            </SafeAreaView>
            <View style={{
              flex: 1,
            }}>
              {this.loading()}
            </View>
              <TouchableOpacity
                style={{
                  marginTop: 10,
                  alignItems: 'center',
                  marginBottom: 20
                }}
                onPress={() => {
                  GoogleSignin.signOut()
                  this.props.resetAll();
                  const resetAction = StackActions.reset({
                    index: 0,
                    actions: [NavigationActions.navigate({routeName: "Splitter"})],
                  });
                  this.props.navigation.dispatch(resetAction);
                }}>
                <Text style={{
                  fontFamily: Fonts.MEDIUM,
                  fontSize: 20
                }}>
                  Sign Out
                </Text>
              </TouchableOpacity>
          </View>
      )
    }
  }
  
  export default StepAnalytics
