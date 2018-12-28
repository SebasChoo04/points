import React from 'react';
import {createBottomTabNavigator, createAppContainer, createStackNavigator} from 'react-navigation';
import Icon from 'react-native-vector-icons/MaterialIcons'
import Icon2 from 'react-native-vector-icons/FontAwesome'
import Splitter from "./Splitter";
import HouseContainer from "./containers/HouseContainer";
import AnnouncementContainer from "./containers/AnnouncementContainer";
import RankingContainer from "./containers/RankingContainer";
import StepTrackerContainer from "./containers/StepTrackerContainer";
import ChooseHouseContainer from "./containers/ChooseHouseContainer";
import LoginContainer from "./containers/LoginContainer";

const TabNavigator = createBottomTabNavigator({
  "House": {screen: HouseContainer},
  "Announcements": {screen: AnnouncementContainer},
  "Rankings": {screen: RankingContainer},
  "Steps": {screen: StepTrackerContainer}
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
  ChooseHouse: {screen: ChooseHouseContainer},
  Login: {screen: LoginContainer},
  Tab: {screen: TabNavigator},
}, {
  headerMode: 'none'
});

export default createAppContainer(Main);
