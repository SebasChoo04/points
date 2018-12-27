import React from 'react';
import {View, Dimensions} from 'react-native';
import {SafeAreaView, Text, TouchableOpacity} from 'react-native'
import {NavigationActions, StackActions} from "react-navigation";
import {connect} from 'react-redux'
import {resetAll} from "./actions";
import {AnimatedCircularProgress} from 'react-native-circular-progress'
import Svg, {
  Path,
  LinearGradient as SVG,
  Stop
} from "react-native-svg";
import {Fonts} from "./Constants";
import firebase from 'react-native-firebase'
import GoogleFit from 'react-native-google-fit'

class StepTrackerScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      width: Dimensions.get('window').width,
      height: Dimensions.get('window').height,
      svgHeight: Dimensions.get('window').height / 3,
      steps: 1000,
    }
    this.firebaseRef = firebase.firestore().collection('pedometer').doc('points')
  }

  updatePoints() {
    firebase.firestore().runTransaction(async transaction => {
      const doc = await transaction.get(this.firebaseRef)
      if (!doc.exists) {
        transaction.set(this.ref, {Error: "Invalid doc in StepTracker.js"})
        alert("An error has occurred, please contact Sebastian Choo")
      }
      transaction.update(this.firebaseRef, {})
    })
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

  color() {
    switch (this.props.userDetailsReducer.house) {
      case 'Black':
        return '#000000';
      case 'Red':
        return '#EE220C';
      case 'Green':
        return '#009801';
      case 'Blue':
        return '#00A2FF';
      case 'Yellow':
        return '#FAE232'
    }
  }

  backgroundColor() {
    switch (this.props.userDetailsReducer.house) {
      case 'Black':
        return '#2A2A2A';
      case 'Red':
        return '#9D3F37';
      case 'Green':
        return '#007001';
      case 'Blue':
        return '#0076BA';
      case 'Yellow':
        return '#B68C3B'
    }
  }

  googleFit() {
    const qinguan = new Date();
    qinguan.setHours(0, 0, 0, 0)
    let options = {
      startDate: qinguan.toISOString(),
      endDate: new Date().toISOString() // required ISO8601Timestamp
    };
    GoogleFit.authorize()
    GoogleFit.onAuthorizeFailure(() => {
      alert('An error occurred')
    })
    GoogleFit.onAuthorize(() => {
      GoogleFit.getDailyStepCountSamples(options, (err, res) => {
        if (err) {
          throw err;
        }
        this.setState({steps: res[1].steps})
      });
    })
  }

  componentDidMount() {
    Dimensions.addEventListener('change', (e) => {
      const {width, height} = e.window;
      const modHeight = height / 3;
      this.setState({width, svgHeight: modHeight, height});
    });
    this.googleFit()
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
              Step Tracker
            </Text>
          </SafeAreaView>
          <View style={{
            flex: 1,
            alignItems: 'center',
          }}>
            <View style={{
              flex: 1,
              marginTop: 80,
              alignItems: 'center'
            }}>
              <AnimatedCircularProgress
                  size={250}
                  width={20}
                  backgroundWidth={10}
                  fill={this.state.steps / 100}
                  tintColor={this.color()}
                  backgroundColor={this.backgroundColor()}
                  arcSweepAngle={240}
                  rotation={240}
                  lineCap="round">
                {() => (
                    <View style={{
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <Text style={{
                        color: 'black',
                        fontSize: 36,
                        fontFamily: 'Raleway-Bold',
                      }}>
                        {this.state.steps} steps
                      </Text>
                    </View>
                )}
              </AnimatedCircularProgress>
              <Text style={{
                fontFamily: Fonts.REGULAR,
                fontSize: 30,
                fontWeight: '400',
                textAlign: 'center'
              }}>
                Congratulations, you have walked {this.state.steps} steps today, you
                are {10000 - this.state.steps} steps away from earning one point.
              </Text>
              <Text style={{
                fontFamily: 'Raleway-Bold',
                fontSize: 20,
                textAlign: 'center',
                marginTop: 30,
              }}>
                Points contributed this month: 100 {"\n"}
                Points gained by House: 10
              </Text>
              <TouchableOpacity
                  style={{
                    marginTop: 25
                  }}
                  onPress={() => {
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
          </View>
        </View>
    );
  }
}

const mapStateToProps = (state) => {
  return state
};

const mapDispatchToProps = (dispatch) => ({
  resetAll: () => dispatch(resetAll())
});

export default connect(mapStateToProps, mapDispatchToProps)(StepTrackerScreen)
