import React, { useEffect, useState } from 'react';
import { Image, View, Text, StyleSheet, TouchableOpacity, BackHandler } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigations/StackNavigator';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '@env';

type ProfileScreenRouteProp = RouteProp<RootStackParamList, 'Profile'>;
type ProfileScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Profile'>;

type Props = {
    route: ProfileScreenRouteProp;
    navigation: ProfileScreenNavigationProp;
};

const ProfileScreen: React.FC<Props> = ({ route, navigation }) => {
    const [voterData, setVoterData] = useState<any>(null);
    const userId = route.params?.userId;

    useEffect(() => {
        const fetchVoterData = async () => {
            try {
                const response = await fetch(`${API_URL}/voters/${userId}`);
                const data = await response.json();
                setVoterData(data);
            } catch (error) {
                console.error('Error fetching voter data:', error);
            }
        };

        if (userId) {
            fetchVoterData();
        }
    }, [userId]);

    useEffect(() => {
        const backAction = () => {
            if (navigation.canGoBack()) {
                navigation.goBack();
            } else {
                navigation.navigate('Home' as never);
            }
            return true;
        };

        const backHandler = BackHandler.addEventListener(
            "hardwareBackPress",
            backAction
        );

        return () => backHandler.remove();
    }, [navigation]);

    const handleLogout = async () => {
        await AsyncStorage.removeItem('token');
        await AsyncStorage.removeItem('userId');
        navigation.navigate('Login');
    };

    if (!voterData) {
        return (
            <View style={styles.container}>
                <Text style={styles.title}>Loading...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Image source={require('../../assets/logo.png')} style={styles.logo} />
            <Text style={styles.title}>Profile</Text>
            <View style={styles.dataContainer}>
                <Text style={styles.dataTitle}>ID</Text>
                <Text style={styles.dataText}>{parseInt(voterData.id.hex, 16)}</Text>
            </View>
            <View style={styles.dataContainer}>
                <Text style={styles.dataTitle}>Name</Text>
                <Text style={styles.dataText}>{voterData.name}</Text>
            </View>
            <View style={styles.dataContainer}>
                <Text style={styles.dataTitle}>Email</Text>
                <Text style={styles.dataText}>{voterData.email}</Text>
            </View>
            <View style={styles.dataContainer}>
                <Text style={styles.dataTitle}>Has Voted</Text>
                <Text style={styles.dataText}>{voterData.hasVoted ? 'Yes' : 'No'}</Text>
            </View>
            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                <Text style={styles.buttonText}>Logout</Text>
            </TouchableOpacity>
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
        width: 100,
        height: 100,
        alignSelf: 'center',
        marginBottom: 25,
    },
    title: {
        fontSize: 24,
        marginBottom: 70,
        color: '#EC8638',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    dataContainer: {
        width: '100%',
        marginBottom: 12,
        paddingHorizontal: 16,
    },
    dataTitle: {
        fontSize: 18,
        color: '#EC8638',
        fontWeight: 'bold',
    },
    dataText: {
        fontSize: 16,
        color: '#333',
        marginBottom: 4,
    },
    logoutButton: {
        backgroundColor: '#EC8638',
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 80,
        width: '70%',
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default ProfileScreen;
