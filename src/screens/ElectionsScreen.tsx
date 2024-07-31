import React, { useEffect, useState } from 'react';
import { View, Image, Text, StyleSheet, FlatList, Dimensions, SafeAreaView, ActivityIndicator, TouchableOpacity } from 'react-native';
import { getDatabase, ref, onValue } from 'firebase/database';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../navigations/StackNavigator';
import { StackNavigationProp } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Voter } from '../types/app';

type ElectionsScreenRouteProp = RouteProp<RootStackParamList, 'Election'>;
type ElectionsScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Election'>;

type Props = {
    route: ElectionsScreenRouteProp;
    navigation: ElectionsScreenNavigationProp;
};

const ElectionsScreen: React.FC<Props> = ({ route, navigation }) => {
    const [elections, setElections] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const email = await AsyncStorage.getItem('userEmail');
                if (!email) {
                    setLoading(false);
                    return;
                }

                const db = getDatabase();
                const votersRef = ref(db, 'voters');
                const electionsRef = ref(db, 'elections');

                onValue(votersRef, (snapshot) => {
                    const votersData = snapshot.val();
                    const voter = (Object.values(votersData) as Voter[]).find((voter) => voter.email === email);
                    const voterElections = voter ? voter.elections : [];

                    onValue(electionsRef, (snapshot) => {
                        const data = snapshot.val();
                        const electionList = Object.keys(data).map(key => ({ id: key, ...data[key] }));
                        const filteredList = electionList.filter(election => voterElections.includes(election.election_id.toString()));
                        setElections(filteredList);
                        setLoading(false);
                    });
                });
            } catch (error) {
                console.error("Error fetching data: ", error);
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const renderElectionItem = ({ item }: { item: any }) => (
        <TouchableOpacity
            style={styles.electionItem}
            onPress={() => navigation.navigate('Home', { election_id: item.election_id })}
        >
            <Text style={styles.electionName}>{item.name}</Text>
            <Text style={styles.electionDescription}>{item.description}</Text>
            <Text style={styles.electionDate}>Date: {item.date}</Text>
            <Text style={styles.electionStatus}>Status: {item.status}</Text>
        </TouchableOpacity>
    );

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#EC8638" />
            </View>
        );
    }

    const handleProfile = async () => {
        const email = await AsyncStorage.getItem('userEmail');
        navigation.navigate('Profile');
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Image source={require('../../assets/logo-text-line-white.png')} style={styles.logo} />
                <TouchableOpacity onPress={handleProfile} style={styles.profileIcon}>
                    <Icon name="user" size={24} color="#fff" />
                </TouchableOpacity>
            </View>
            <Text style={styles.title}>Elections List</Text>
            <FlatList
                data={elections}
                keyExtractor={(item) => item.id}
                renderItem={renderElectionItem}
                contentContainerStyle={styles.listContainer}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
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
    logo: {
        width: 250,
        height: 43,
        resizeMode: 'contain'
    },
    title: {
        fontSize: 24,
        marginBottom: 6,
        marginTop: 20,
        color: '#EC8638',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    listContainer: {
        flexGrow: 1,
        width: '100%',
        paddingHorizontal: 16,
    },
    electionItem: {
        backgroundColor: '#FAECE0',
        padding: 16,
        marginVertical: 8,
        borderRadius: 8,
    },
    electionName: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 8,
        color: '#000',
    },
    electionDescription: {
        fontSize: 14,
        color: '#777',
        marginBottom: 4,
    },
    electionDate: {
        fontSize: 14,
        color: '#777',
        marginBottom: 4,
    },
    electionStatus: {
        fontSize: 14,
        color: '#777',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    profileIcon: {
        padding: 8,
    },
});

export default ElectionsScreen;