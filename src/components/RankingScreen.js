import React from 'react';
import {Text, View, FlatList, Dimensions, SafeAreaView} from 'react-native';
import LinearGradient from 'react-native-linear-gradient'
import Svg, {
  Path,
  LinearGradient as SVG,
  Stop
} from "react-native-svg";
import {Fonts} from "../Constants";
import firebase from 'react-native-firebase';
import * as Progress from "react-native-progress";

class RankingScreen extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      width: Dimensions.get('window').width,
      height: Dimensions.get('window').height,
      svgHeight: Dimensions.get('window').height / 3,
      points: [],
      loading: true
    }
    this.ref = firebase.firestore().collection('HouseInfo').doc('Points')
  }
  componentDidMount() {
    this.loadPoints()
    Dimensions.addEventListener('change', (e) => {
      const {width, height} = e.window;
      const modHeight = height / 3
      this.setState({width, svgHeight: modHeight, height});
    })
  }
  loading() {
    if (this.state.loading){
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
        data={this.state.points}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({item, index}) => (
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginLeft: 26,
            marginTop: 50,
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
                <Text style={{
                  fontFamily: 'Raleway-Medium',
                  color: 'white',
                  fontSize: 30,
                }}>
                  {index+1}
                </Text>
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
        )}
      />
    )
  }
  loadPoints() {
    firebase.firestore().runTransaction(async transaction => {
      const doc = await transaction.get(this.ref)
      if (!doc.exists){
      transaction.set(this.ref, {Error: "Invalid doc in AnnouncementScreen.js"})
      alert("An error has occurred, please contact Sebastian Choo")
      return {}
      }
      let x = doc.data().all
      x.sort(function (a,b) {
        return parseInt(b.points) - (a.points);
      })
      this.setState({points: doc.data().all}, () => {
        this.setState({loading: false})
        })
      transaction.update(this.ref, doc.data())
    })
  }
  bottomCurveColor() {
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
          Rankings
        </Text>
        </SafeAreaView>
        <View style={{
          flex: 1,
        }}>
          {this.loading()}
        </View>
      </View>
    );
  }
}

export default RankingScreen
