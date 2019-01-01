import React, {Component} from 'react'
import {View, Text, Dimensions, TouchableOpacity, SafeAreaView} from 'react-native'
import Svg, {
  Path,
  LinearGradient,
  Stop
} from "react-native-svg";
import firebase from "react-native-firebase";
import Icon from 'react-native-vector-icons/MaterialIcons'
import {Fonts} from "../Constants";

class AddPostScreen extends Component {
  constructor(props) {
    super(props)
    this.state = {
      width: Dimensions.get('window').width,
      svgHeight: Dimensions.get('window').height / 3,
      height: Dimensions.get('window').height,
    }
  }

  componentDidMount() {
    alert(this.props.navigation.getParam('index'))
    Dimensions.addEventListener('change', (e) => {
      const {width, height} = e.window;
      const modHeight = height / 3
      this.setState({width, svgHeight: modHeight, height});
    })
  }

  render() {
    return (
        <View>
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
            flexDirection: 'row'
          }}>
            <View style={{
              flex: 1,
              alignItems: 'flex-start',
              justifyContent: 'center',
            }}>
              <TouchableOpacity style={{
                marginLeft: 16
              }} onPress={() => {
                this.props.navigation.goBack()
              }}>
                <Icon name={'clear'} color={'white'} size={25}/>
              </TouchableOpacity>
            </View>
            <View style={{
              flex: 2,
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Text style={{
                fontFamily: Fonts.MEDIUM,
                fontSize: 20,
                color: 'white'
              }}>
                New Post
              </Text>
            </View>
            <View style={{
              flex: 1,
              alignItems: 'flex-end',
              justifyContent: 'center'
            }}>
              <TouchableOpacity style={{
                marginRight: 16
              }} onPress={() => {
                this.props.navigation.goBack()
              }}>
                <Icon name={'send'} color={'white'} size={25}/>
              </TouchableOpacity>
            </View>
          </SafeAreaView>
        </View>
    )
  }
}

export default AddPostScreen
