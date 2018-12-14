import React from 'react';
import {createBottomTabNavigator, createAppContainer, createStackNavigator} from 'react-navigation';

import HouseScreen from "./HouseScreen"
import AnnouncementScreen from "./AnnouncementScreen"
import RankingScreen from "./RankingScreen"
import StepTrackerScreen from "./StepTrackerScreen"
import Login from "./Login";
import ChooseHouse from "./ChooseHouse";
import Splitter from "./Splitter";

const TabNavigator = createBottomTabNavigator({
  "Your House": {screen: HouseScreen},
  "Settings": {screen: AnnouncementScreen},
  "Ranking": {screen: RankingScreen},
  "Step Tracker": {screen: StepTrackerScreen}
});

const Main = createStackNavigator({
  Splitter: {screen: Splitter},
  Login: {screen: Login},
  Tab: {screen: TabNavigator},
  ChooseHouse: {screen: ChooseHouse}
}, {
  headerMode: 'none'
})

export default createAppContainer(Main);
