import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import React from 'react'
import ListScreen from "./list";
import DetailScreen from "./details/DetailScreen.tsx";
import {View, Text} from 'react-native'

const Stack = createStackNavigator()

function DetailsScreen() {
    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Text>Details Screen</Text>
        </View>
    );
}

export default function Container() {
    return (
        <NavigationContainer style={{flex: 1}}>
            <Stack.Navigator initialRouteName="List">
                <Stack.Screen name="List" component={ListScreen}/>
                <Stack.Screen name="Detail" component={DetailScreen}/>
            </Stack.Navigator>
        </NavigationContainer>
    )
}