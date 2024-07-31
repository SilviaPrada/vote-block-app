import React from 'react';
import { Image, View, StyleSheet } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigations/StackNavigator';
import BottomTabNavigator from '../navigations/BottomTabNavigator';

type HomeScreenRouteProp = RouteProp<RootStackParamList, 'Home'>;
type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

type Props = {
    route: HomeScreenRouteProp;
    navigation: HomeScreenNavigationProp;
};

const HomeScreen: React.FC<Props> = ({ route, navigation }) => {
    const electionId = route.params?.election_id;

    return (
        <View style={{ flex: 1 }}>
            <View style={styles.header}>
                <Image source={require('../../assets/logo-text-line-white.png')} style={styles.logo} />
            </View>
            <BottomTabNavigator election_id={electionId} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
        backgroundColor: '#fff',
    },
    logo: {
        width: 250,
        height: 43,
        resizeMode: 'contain'
    },
    title: {
        fontSize: 24,
        marginBottom: 16,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: 28,
        paddingBottom: 10,
        padding: 16,
        backgroundColor: '#EC8638',
    },
    headerText: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    profileIcon: {
        padding: 8,
    },
});

export default HomeScreen;
