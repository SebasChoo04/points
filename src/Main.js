import React from 'react';
import {createBottomTabNavigator, createAppContainer, createStackNavigator} from 'react-navigation';
import Icon from 'react-native-vector-icons/MaterialIcons'
import HouseScreen from "./HouseScreen"
import AnnouncementScreen from "./AnnouncementScreen"
import RankingScreen from "./RankingScreen"
import StepTrackerScreen from "./StepTrackerScreen"
import Login from "./Login";
import ChooseHouse from "./ChooseHouse";
import Splitter from "./Splitter";
import {Text, View} from 'react-native'

const TabNavigator = createBottomTabNavigator({
  "Your House": {screen: HouseScreen},
  "Announcements": {screen: AnnouncementScreen},
  "Ranking": {screen: RankingScreen},
  "Step Tracker": {screen: StepTrackerScreen}
}, {
  defaultNavigationOptions: ({navigation}) => ({
    tabBarIcon: () => {
      const {routeName} = navigation.state
      if (routeName === "Announcements") {
        return (
            <Icon name={"home"} size={25}/>
        )
      } else {
        return (
            <Icon name={'account-circle'} size={25}/>
        )
      }
    }
  })
})

const Main = createStackNavigator({
  Splitter: {screen: Splitter},
  Login: {screen: Login},
  Tab: {screen: TabNavigator},
  ChooseHouse: {screen: ChooseHouse}
}, {
  headerMode: 'none'
});

export default createAppContainer(Main);
