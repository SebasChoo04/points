import React from 'react';
import {createBottomTabNavigator, createAppContainer, createStackNavigator} from 'react-navigation';
import Icon from 'react-native-vector-icons/MaterialIcons'
import Icon2 from 'react-native-vector-icons/FontAwesome'
import HouseScreen from "./HouseScreen"
import AnnouncementScreen from "./AnnouncementScreen"
import RankingScreen from "./RankingScreen"
import StepTrackerScreen from "./StepTrackerScreen"
import Login from "./Login";
import ChooseHouse from "./ChooseHouse";
import Splitter from "./Splitter";

const TabNavigator = createBottomTabNavigator({
  "House": {screen: HouseScreen},
  "Announcements": {screen: AnnouncementScreen},
  "Rankings": {screen: RankingScreen},
  "Steps": {screen: StepTrackerScreen}
}, {
  defaultNavigationOptions: ({navigation}) => ({
    tabBarIcon: () => {
      const {routeName} = navigation.state
      switch (routeName) {
        case 'House':
          return(
            <Icon name={"home"} size={25}/>
          );
        case 'Announcements':
          return(
            <Icon name={"announcement"} size={25}/>
          );
        case "Rankings":
          return(
            <Icon2 name={"trophy"} size={25}/>
          );
        case "Steps":
          return(
            <Icon name={"directions-walk"} size={25}/>
          )
      }
    }
  }),
})

const Main = createStackNavigator({
  Splitter: {screen: Splitter},
  ChooseHouse: {screen: ChooseHouse},
  Login: {screen: Login},
  Tab: {screen: TabNavigator},
}, {
  headerMode: 'none'
});

export default createAppContainer(Main);
