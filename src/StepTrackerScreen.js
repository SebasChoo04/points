import React from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import {NavigationActions, StackActions} from "react-navigation";
import {connect} from 'react-redux'
import {changeEmail, changeLoginStatus, changeName, resetAll} from "./actions";
class StepTrackerScreen extends React.Component {
    render() {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text>Step Tracker Screen in Progress!</Text>
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

const mapStateToProps = (state) => {
    return state
}

const mapDispatchToProps = (dispatch) => ({
    resetAll: () => dispatch(resetAll())
})

export default connect(mapStateToProps,mapDispatchToProps)(StepTrackerScreen)