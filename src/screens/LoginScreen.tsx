import React, { useState } from 'react';
import { View, Text, TextInput, Alert, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigations/StackNavigator';
import { firebase } from '../../firebaseConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';

type LoginScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Login'>;

type Props = {
    navigation: LoginScreenNavigationProp;
};

const LoginScreen: React.FC<Props> = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async () => {
        try {
            await firebase.auth().signInWithEmailAndPassword(email, password);
            await AsyncStorage.setItem('userEmail', email); // Store email in AsyncStorage
            navigation.navigate('Election');
        } catch (error) {
            if (error instanceof Error) {
                Alert.alert('Login Error', error.message);
            } else {
                Alert.alert('Login Error', 'An unknown error occurred');
            }
        }
    };

    return (
        <View style={styles.container}>
            <Image source={require('../../assets/logo.png')} style={styles.logo} />
            <Text style={styles.title}>Login untuk mengakses</Text>
            <TextInput
                style={styles.input}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
            />
            <TextInput
                style={styles.input}
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />
            <TouchableOpacity style={styles.button} onPress={handleLogin}>
                <Text style={styles.buttonText}>Login</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 35,
        backgroundColor: '#fff',
    },
    logo: {
        width: 100,
        height: 100,
        alignSelf: 'center',
        marginBottom: 25,
    },
    title: {
        color: "#EC8638",
        fontSize: 24,
        marginBottom: 30,
        textAlign: 'center',
        fontWeight: 'bold',
    },
    input: {
        height: 40,
        borderColor: '#EC8638',
        borderWidth: 1,
        marginBottom: 12,
        paddingHorizontal: 8,
        borderRadius: 10,
    },
    button: {
        backgroundColor: '#EC8638',
        paddingVertical: 12,
        borderRadius: 20,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
    },
});

export default LoginScreen;
