import React from 'react';
import { createBottomTabNavigator, createAppContainer, createStackNavigator } from 'react-navigation';

import HouseScreen from "./HouseScreen"
import AnnouncementScreen from "./AnnouncementScreen"
import RankingScreen from "./RankingScreen"
import StepTrackerScreen from "./StepTrackerScreen"
import Login from "./Login";

const TabNavigator = createBottomTabNavigator({
    "Your House": {screen: HouseScreen},
    "Settings": {screen: AnnouncementScreen},
    "Ranking": {screen: RankingScreen},
    "Step Tracker": {screen: StepTrackerScreen}
});

const Main = createStackNavigator({
  Login: {screen: Login},
  Tab: {screen: TabNavigator},
}, {
    headerMode: 'none'
})

export default createAppContainer(Main);
