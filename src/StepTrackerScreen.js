import React from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import {NavigationActions, StackActions} from "react-navigation";

class StepTrackerScreen extends React.Component {
    render() {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text>Settings!</Text>
                <TouchableOpacity onPress={() => {
                    this.props.resetAll()
                    const resetAction = StackActions.reset({
                        index: 0,
                        actions: [NavigationActions.navigate({routeName: 'Splitter'})],
                    });
                    this.props.navigation.dispatch(resetAction);
                }}>
                    <Text>
                        sign out
                    </Text>
                </TouchableOpacity>
            </View>
        );
    }
}



export default StepTrackerScreen