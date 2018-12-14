import React, {Component} from 'react'
import {View, Text, SafeAreaView, Dimensions, FlatList, TouchableOpacity} from 'react-native'
import {connect} from 'react-redux'
import Svg from "react-native-svg";
import Path from "react-native-svg/elements/Path";
import LinearGradient from "react-native-linear-gradient";

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
              House
            </Text>
          </SafeAreaView>
          <View style={{
            flex: 0.3
          }}>
          </View>
          <View style={{
            flex: 2.7,
          }}>
            <Text style={{
              alignSelf: 'center',
              fontFamily: 'Avenir Next',
              fontSize: 20,
              fontWeight: '500',
              marginTop: 16
            }}>
              Choose your house
            </Text>
            <FlatList data={
              [
                {
                  key: 'blue',
                  color: ['blue', 'white']
                },
                {
                  key: 'yellow',
                  color: ['yellow', 'white']
                },
                {
                  key: 'green',
                  color: ['green', 'white']
                },
                {
                  key: 'black',
                  color: ['black', 'white']
                },
                {
                  key: 'red',
                  color: ['red', 'white']
                },
              ]
            } style={{
              flex: 1,
              marginTop: 32
            }} renderItem={({item}) => {
              return (
                  <TouchableOpacity style={{
                    width: this.state.width - 32,
                    height: 50,
                    marginLeft: 16,
                    alignItems: 'center',
                    flexDirection: 'row',
                  }}>
                    <View style={{
                      flex: 1,
                      alignItems: 'flex-end',
                      justifyContent: 'center',
                      marginRight: 8
                    }}>
                      <LinearGradient useAngle={true} angleCenter={{x: 0.5, y: 0.5}} angle={45} colors={item.color}
                                      style={{
                                        height: 46,
                                        aspectRatio: 1,
                                        borderRadius: 23
                                      }}>
                      </LinearGradient>
                    </View>
                    <View style={{
                      flex: 1,
                      alignItems: 'flex-start',
                      justifyContent: 'center',
                      marginLeft: 8
                    }}>
                      <Text style={{
                        fontFamily: 'Avenir Next',
                        fontSize: 20,
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

export default connect(mapStateToProps)(ChooseHouse)
