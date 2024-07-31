import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/FontAwesome';
import HomeTabScreen from '../screens/HomeTabScreen';
import VoteTabScreen from '../screens/VoteTabScreen';

const Tab = createBottomTabNavigator();

type BottomTabNavigatorProps = {
    election_id: string;
};

const BottomTabNavigator: React.FC<BottomTabNavigatorProps> = ({ election_id }) => {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ color, size }) => {
                    let iconName: string;

                    if (route.name === 'HomeTab') {
                        iconName = 'home';
                    } else if (route.name === 'VoteTab') {
                        iconName = 'thumbs-up';
                    } else {
                        iconName = 'question'; // Default icon if route name doesn't match
                    }

                    return <Icon name={iconName} color={color} size={size} />;
                },
                tabBarActiveTintColor: '#EC8638',
                tabBarInactiveTintColor: 'gray',
            })}
        >
            <Tab.Screen
                name="HomeTab"
                options={{ headerShown: false, tabBarLabel: 'Home' }}
            >
                {props => <HomeTabScreen {...props} election_id={election_id} />}
            </Tab.Screen>
            <Tab.Screen
                name="VoteTab"
                options={{ headerShown: false, tabBarLabel: 'Vote' }}
            >
                {props => <VoteTabScreen {...props} election_id={election_id} />}
            </Tab.Screen>
        </Tab.Navigator>
    );
};

export default BottomTabNavigator;
