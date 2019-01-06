import React, {Component} from 'react'
import {View, Text, Dimensions, TouchableOpacity, SafeAreaView, ScrollView} from 'react-native'
import Svg, {
  Path,
  LinearGradient,
  Stop
} from "react-native-svg";
import firebase from "react-native-firebase";
import Icon from 'react-native-vector-icons/MaterialIcons'
import {Fonts} from "../Constants";
import {TextField} from 'react-native-material-textfield'
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view'
import Modal from 'react-native-modal'
import Markdown from "react-native-simple-markdown";

class AddPostScreen extends Component {
  constructor(props) {
    super(props)
    this.state = {
      width: Dimensions.get('window').width,
      svgHeight: Dimensions.get('window').height / 3,
      height: Dimensions.get('window').height,
      title: "",
      content: "",
      previewVisible: false,
      contentError: "",
      titleError: ""
    }
    this.houseRef = firebase.firestore().collection('announcements').doc(this.props.userDetailsReducer.house.toLowerCase())
    this.allRef = firebase.firestore().collection('announcements').doc('everyone')
  }

  async pushFirebase() {
    if (this.props.navigation.getParam('index') == 0) {
      firebase.firestore().runTransaction(async transaction => {
        const doc = await transaction.get(this.houseRef)
        if (!doc.exists) {
          transaction.set(this.houseRef, {announcement: [{content: this.state.content, title: this.state.title}]})
          return
        }
        const x = doc.data().announcement.slice(0)
        x.push({content: this.state.content, title: this.state.title})
        transaction.update(this.houseRef, {announcement: x})
        this.setState({previewVisible: false}, () => {
          this.props.navigation.goBack()
        })
        return
      })
    } else if (this.props.navigation.getParam('index') == 1) {
      firebase.firestore().runTransaction(async transaction => {
        const doc = await transaction.get(this.allRef)
        if (!doc.exists) {
          transaction.set(this.allRef, {announcement: [{content: this.state.content, title: this.state.title}]})
          this.setState({previewVisible: false}, () => {
            this.props.navigation.goBack()
          })
          return
        }
        const x = doc.data().announcement.slice(0)
        x.push({content: this.state.content, title: this.state.title})
        transaction.update(this.allRef, {announcement: x})
        this.setState({previewVisible: false}, () => {
          this.props.navigation.goBack()
        })
        return
      })
    } else {
      alert('An error occurred')
    }
  }

  componentDidMount() {
    Dimensions.addEventListener('change', (e) => {
      const {width, height} = e.window;
      const modHeight = height / 3
      this.setState({width, svgHeight: modHeight, height});
    })
  }

  processedContent() {
    String.prototype.replaceAll = function (str1, str2, ignore) {
      return this.replace(new RegExp(str1.replace(/([\/\,\!\\\^\$\{\}\[\]\(\)\.\*\+\?\|\<\>\-\&])/g, "\\$&"), (ignore ? "gi" : "g")), (typeof (str2) == "string") ? str2.replace(/\$/g, "$$$$") : str2);
    }
    const x = this.state.content.replaceAll("<br/>", `\n`)
    return x
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
                var x = false
                if (this.state.title.length < 1) {
                  x = true
                  this.setState({titleError: 'Title cannot be empty'})
                }
                if (this.state.content.length < 1) {
                  x = true
                  this.setState({contentError: 'Content cannot be empty'})
                }
                if (!x) {
                  this.setState({previewVisible: true})
                }
              }}>
                <Icon name={'send'} color={'white'} size={25}/>
              </TouchableOpacity>
            </View>
          </SafeAreaView>
          <View style={{
            flex: 1,
            margin: 8
          }}>
            <KeyboardAwareScrollView>
              <TextField error={this.state.titleError} label={'Title'} onChangeText={(text) => {
                this.setState({titleError: ""})
                this.setState({title: text})
              }}/>
              <TextField error={this.state.contentError} label={'Content'} multiline={true} onChangeText={(text) => {
                this.setState({contentError: ""})
                const x = text.replace(/\r?\n/g, "<br/>");
                this.setState({content: x})
              }}/>
            </KeyboardAwareScrollView>
          </View>
          <Modal isVisible={this.state.previewVisible} style={{
            flex: 1,
          }} onBackdropPress={() => {
            this.setState({previewVisible: !this.state.previewVisible})
          }}>
            <View style={{
              width: '100%',
              backgroundColor: 'white',
              borderRadius: 10,
              padding: 16
            }}>
              <Text style={{
                fontFamily: Fonts.MEDIUM,
                fontWeight: '500',
                fontSize: 20,
              }}>
                {this.state.title}
              </Text>
              <Markdown styles={{
                text: {
                  color: 'black',
                  fontFamily: Fonts.REGULAR
                },
                heading1: {
                  color: 'black',
                  fontFamily: Fonts.MEDIUM,
                  fontSize: 25,
                  fontWeight: '600'
                },
                strong: {
                  fontWeight: 'bold',
                  fontFamily: Fonts.REGULAR,
                },
                heading2: {
                  color: 'black',
                  fontFamily: Fonts.MEDIUM,
                  fontSize: 20,
                  fontWeight: '600'
                }
              }}>
                {this.processedContent()}
              </Markdown>
            </View>
            <TouchableOpacity style={{
              margin: 8,
              alignSelf: 'center'
            }} onPress={() => {
              this.pushFirebase()
            }}>
              <Icon name={'done'} color={'white'} size={30}/>
            </TouchableOpacity>
          </Modal>
        </View>
    )
  }
}

export default AddPostScreen
