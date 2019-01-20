import React, {Component} from 'react'
import {View, Text, Dimensions, SafeAreaView, FlatList, TouchableOpacity, YellowBox} from 'react-native'
import Svg, {
  Path,
  LinearGradient,
  Stop
} from "react-native-svg";
import Image from 'react-native-image-progress';
import ProgressBar from 'react-native-progress/Bar';
import firebase from 'react-native-firebase'
import * as Progress from "react-native-progress";
import {Fonts} from "../Constants";

YellowBox.ignoreWarnings(['source.uri'])

class HouseScreen extends Component {
  constructor(props) {
    super(props)
    this.state = {
      width: Dimensions.get('window').width,
      height: Dimensions.get('window').height,
      color: 'white',
      imageLink: "",
      listData: [],
      loading: true
    }
    this.firebaseRef = firebase.firestore().collection('HouseInfo').doc('w6czpnPEWY4cwKzzCUkb')
  }

  componentDidMount() {
    this.getFirebaseData()
    this.houseData()
    Dimensions.addEventListener('change', (e) => {
      const {width, height} = e.window;
      this.setState({width, height});
    })
  }

  loading() {
    if (this.state.loading) {
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
        <FlatList
            data={this.state.listData}
            style={{
              flex: 1,
              marginTop: 50}}
            renderItem={({item}) => {
          return (
              <View style={{
                marginBottom: 16,
                alignItems: 'center'
              }}>
                <Text style={{
                  fontSize: 20,
                  fontFamily: 'Raleway-Bold'
                }}>
                  {item.key}
                </Text>
                <Text style={{
                  fontSize: 25,
                  fontFamily: Fonts.REGULAR
                }}>
                  {item.data}
                </Text>
              </View>
          )
        }}/>
    )
  }

  async getFirebaseData() {
    firebase.firestore().runTransaction(async transaction => {
      const doc = await transaction.get(this.firebaseRef)
      if (!doc.exists) {
        alert('An error has occurred, please contact Sebastian Choo')
        transaction.set(this.firebaseRef, {Error: 'Invalid doc in HouseScreen.js'})
        return {}
      }
      const houseInfo = doc.data()[this.props.userDetailsReducer.house.toLowerCase()]
      var arr = []
      Object.keys(houseInfo).forEach((x) => {
        var j = {}
        var result = x.replace(/([A-Z])/g, " $1");
        var finalResult = result.charAt(0).toUpperCase() + result.slice(1);
        j['key'] = finalResult
        j['data'] = houseInfo[x]
        arr.push(j)
        arr.sort((a,b) => a['key'].localeCompare(b['key']))
      })
      this.setState({listData: arr}, () => {
        this.setState({loading: false})
      })
      transaction.update(this.firebaseRef, doc.data())
    })
  }

  houseData() {
    switch (this.props.userDetailsReducer.house) {
      case 'Red':
        this.setState({color: 'red'});
        this.setState({imageLink: 'https://firebasestorage.googleapis.com/v0/b/sst-house-point.appspot.com/o/red.png?alt=media&token=3a2098b4-c535-469e-b4ad-2213693c7e07'});
        break
      case 'Black':
        this.setState({color: 'black'});
        this.setState({imageLink: 'https://firebasestorage.googleapis.com/v0/b/sst-house-point.appspot.com/o/black.png?alt=media&token=0a0c181b-f779-4969-ab93-7a91eb897f5b'});
        break
      case 'Green':
        this.setState({color: 'green'});
        this.setState({imageLink: 'https://firebasestorage.googleapis.com/v0/b/sst-house-point.appspot.com/o/green.png?alt=media&token=d8db5dab-12ec-4312-82f9-97d27e91a4db'});
        break
      case 'Yellow':
        this.setState({color: 'yellow'});
        this.setState({imageLink: 'https://firebasestorage.googleapis.com/v0/b/sst-house-point.appspot.com/o/yellow.png?alt=media&token=501b708d-8d29-4dd2-a66a-58fa6da77efb'});
        break
      case 'Blue':
        this.setState({color: 'blue'});
        this.setState({imageLink: 'https://firebasestorage.googleapis.com/v0/b/sst-house-point.appspot.com/o/blue.png?alt=media&token=1ce4e87f-de93-4871-92d4-2264f06fff9f'})
        break
    }
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
              L0 ${this.state.height / 3}
              M${this.state.width} ${this.state.height / 3}
              L${this.state.width} 0
              L0 ${this.state.height / 3}
            `} fill={`url(#${this.state.color})`}/>
            <Path d={`
              M0 ${this.state.height / 3}
              C${this.state.width / 3} ${this.state.height / 4} ${this.state.width / 2} ${this.state.height / 2.5} ${this.state.width} ${this.state.height / 3}
            `} fill={'white'}/>
            <Path d={`
              M${this.state.width} ${this.state.height / 3}
              S${this.state.width / 100 * 80} ${this.state.height / 2.6} ${this.state.width / 2.05} ${this.state.height / 3}
            `} fill={this.bottomCurveColor()}/>
          </Svg>
          <SafeAreaView style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'flex-start',
          }}>
            <Image
                indicator={ProgressBar}
                style={{
                  width: '100%',
                  height: '60%',
                  marginTop: 8
                }}
                resizeMode={'contain'}
                source={{
                  uri: this.state.imageLink,
                }}
            />
            <Text style={{
              fontFamily: 'Raleway-Bold',
              fontSize: 30,
              color: 'white',
              marginTop: 8
            }}>
              {this.props.userDetailsReducer.house} House
            </Text>
          </SafeAreaView>
          <View style={{
            flex: 2
          }}>
            {this.loading()}
          </View>
        </View>
    )
  }
}

export default HouseScreen
