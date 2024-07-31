import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from '../screens/LoginScreen';
import HomeScreen from '../screens/HomeScreen';
import ProfileScreen from '../screens/ProfileScreen';
import ElectionsScreen from '../screens/ElectionsScreen';

export type RootStackParamList = {
    Login: undefined;
    Home: { election_id: string};
    Profile: undefined;
    Election: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

const StackNavigator = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Login">
                <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
                <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
                <Stack.Screen name="Profile" component={ProfileScreen} options={{ headerShown: false }} />
                <Stack.Screen name="Election" component={ElectionsScreen} options={{ headerShown: false }} />
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default StackNavigator;
