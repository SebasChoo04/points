import React from 'react';
import {View, Dimensions} from 'react-native';
import {SafeAreaView, Text, TouchableOpacity, Platform, NativeAppEventEmitter} from 'react-native'
import {NavigationActions, StackActions} from "react-navigation";
import {AnimatedCircularProgress} from 'react-native-circular-progress'
import Svg, {
  Path,
  LinearGradient as SVG,
  Stop
} from "react-native-svg";
import {Fonts} from "../Constants";
import firebase from 'react-native-firebase'
import GoogleFit from 'react-native-google-fit'
import AppleHealthKit from 'rn-apple-healthkit'
import {GoogleSignin} from "react-native-google-signin";
import moment from 'moment'

class StepTrackerScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      width: Dimensions.get('window').width,
      height: Dimensions.get('window').height,
      svgHeight: Dimensions.get('window').height / 3,
    }
    this.pedoRef = firebase.firestore().collection('pedometer').doc(this.props.userDetailsReducer.email)
    this.pedoHouseRef = firebase.firestore().collection('pedometer').doc(this.props.userDetailsReducer.house.toLowerCase())
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
    const start = new Date();
    start.setHours(0, 0, 0, 0)
    const end = new Date()
    end.setHours(23, 59, 59, 999)
    let options = {
      startDate: start.toISOString(),
      endDate: end.toISOString()
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
        this.updateStepCount(res[0].steps[0].value)
      });
    })
  }

  updateStepCount(steps) {
    this.props.changeSteps(steps)
    this.stepProcessor(steps).then((x) => {
      if (x.error) {
        alert('An error occurred')
        return
      }
      if (x.value > 0) {
        this.updateFirebaseData(x.value, steps)
      }
    })
  }

  stepProcessor(steps) {
    return new Promise((resolve => {
      var x = {error: false, value: 0}
      if (steps < 8000) {
        resolve(x)
        return
      }
      if (!this.props.userDetailsReducer.date) {
        this.props.changeRec(true)
        x['value'] = 1
      }
      resolve(x)
    }))
  }

  updateFirebaseData(points, steps) {
    firebase.firestore().runTransaction(async transaction => {
      const doc = await transaction.get(this.pedoRef)
      if (!doc.exists) {
        var j = []
        j.push({total: steps, updateTime: new Date(), points})
        j.push({date: new Date().toDateString(), data: [{steps, points, time: new Date()}]})
        transaction.set(this.pedoRef, {data: j})
        return
      }
      const x = doc.data().data.slice(0)
      const e = new Date().toDateString()
      var jj = false
      for (var z in x) {
        const res = x[z]
        Object.keys(res).forEach((i) => {
          if (i == 'date') {
            if (res.date == e) {
              jj = true
              const oldSteps = res['data'][res['data'].length - 1].steps
              const updated = steps - oldSteps
              x[0].total += updated
              x[0].points += points
              x[0].updateTime = new Date()
              res.data.push({steps, points, time: new Date()})
              return
            }
          }
        })
      }
      if (!jj) {
        x.push({date: new Date().toDateString(), data: [{steps, points, time: new Date()}]})
      }
      transaction.update(this.pedoRef, {data: x})
    })

    firebase.firestore().runTransaction(async transaction => {
      const doc = await transaction.get(this.pedoHouseRef)
      if (!doc.exists) {
        transaction.set(this.pedoHouseRef, {points, steps, updateTime: new Date()})
        return {points, steps}
      }
      const x = Object.assign({}, doc.data())
      if (moment(x.updateTime).week() != moment().week()) {
        x['points'] = points
        x['steps'] = steps
        x['updateTime'] = new Date()
      } else {
        x['points'] += points
        x['steps'] += steps
        x['updateTime'] = new Date()
      }
      transaction.update(this.pedoHouseRef, x)
    })
  }

  healthKit() {
    let options = {
      permissions: {
        read: ["StepCount"],
        write: ["StepCount"]
      }
    };
    AppleHealthKit.initHealthKit(options, (err, results) => {
      if (err) {
        alert("Error initializing Healthkit: ", err);
        return;
      }
      AppleHealthKit.initStepCountObserver({}, () => {
      });
      this.sub = NativeAppEventEmitter.addListener(
          'change:steps',
          (evt) => {
            this.iosGetStep();
          });
      this.iosGetStep()
    });
  }

  iosGetStep() {
    AppleHealthKit.getStepCount(null, (err, results) => {
      if (err) {
        AppleHealthKit.saveSteps({
          value: 1,
          startDate: new Date().toISOString(),
          endDate: new Date().toISOString()
        }, (err, res) => {
          if (err) {
            alert('An error occurred')
            return
          }
        })
      }
      this.updateStepCount(results.value)
      this.setState({steps: results.value})
    });
  }

  componentDidMount() {
    Dimensions.addEventListener('change', (e) => {
      const {width, height} = e.window;
      const modHeight = height / 3;
      this.setState({width, svgHeight: modHeight, height});
    });
    if (Platform.OS === 'ios') {
      this.healthKit()
    } else {
      this.googleFit()
    }
  }

  message() {
    if (this.props.userDetailsReducer.steps < 10000) {
      return `You are ${10000 - this.props.userDetailsReducer.steps} steps away from earning one point.`
    }
    return `You have accomplished the 10000 daily step count.`
  }

  componentWillUnmount(): void {
    if (Platform.OS === 'ios') {
      this.sub.remove();
      return
    }
    GoogleFit.removeListeners()
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
                  fill={this.props.userDetailsReducer.steps / 100}
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
                        {this.props.userDetailsReducer.steps} steps
                      </Text>
                    </View>
                )}
              </AnimatedCircularProgress>
              <Text style={{
                fontFamily: Fonts.REGULAR,
                fontSize: 30,
                fontWeight: '400',
                textAlign: 'center',
                marginLeft: 16,
                marginRight: 16
              }}>
                {this.message()}
              </Text>
              <Text style={{
                fontFamily: 'Raleway-Bold',
                fontSize: 20,
                textAlign: 'center',
                marginTop: 30,
              }}>
                Points contributed so far: 100 {"\n"}
                Points gained by House: 10
              </Text>
              <TouchableOpacity
                  style={{
                    marginTop: 40
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
          </View>
        </View>
    );
  }
}

export default StepTrackerScreen
