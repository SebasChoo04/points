import React from 'react';
import { createBottomTabNavigator, createAppContainer } from 'react-navigation';

import HouseScreen from "./HouseScreen"
import AnnouncementScreen from "./AnnouncementScreen"
import RankingScreen from "./RankingScreen"
import StepTrackerScreen from "./StepTrackerScreen"

const TabNavigator = createBottomTabNavigator({
    "Your House": {screen: HouseScreen},
    "Settings": {screen: AnnouncementScreen},
    "Ranking": {screen: RankingScreen},
    "Step Tracker": {screen: StepTrackerScreen}
});

export default createAppContainer(TabNavigator);