import React, { Fragment } from 'react';
import {
  View,
  Button,
  TextInput,
  StyleSheet
} from 'react-native';

import { Auth } from 'aws-amplify';
import styles from './styles';

const initialState = {
  username: '', password: '', email: '', phone_number: '', authenticationCode: '', showConfirmationForm: false
}

class SignUp extends React.Component {
    state = initialState
    onChangeText = (key, val) => {
        this.setState({ [key]: val })
    }
    signUp = async () => {
        const { username, password, email } = this.state
        try {
            const success = await Auth.signUp({ username, password, attributes: { email }});
            console.log('user successfully signed up!: ', success);
;
            this.setState({ showConfirmationForm: true })
        } catch (err) {
            console.log('error signing up: ', err)
        } 
    }
    confirmSignUp = async () => {
        const { username, authenticationCode } = this.state
        try {
            await Auth.confirmSignUp(username, authenticationCode)
            alert('User signed up successfully!')
            const sessionUser = await Auth.currentUserInfo();
            this.props.setUser(sessionUser);
            await AsyncStorage.setItem('user_id', sessionUser.id)
            this.setState({ ...initialState })
            this.props.navigation.navigate('Home');
        } catch (err) {
            alert('error confirming signing up: \n' + err)
        }
    }
    render() {
        return (
        <View style={styles.container}>
            {
            !this.state.showConfirmationForm && (
                <Fragment>
                    <TextInput
                        style={styles.input}
                        placeholder='Username'
                        autoCapitalize="none"
                        placeholderTextColor='white'
                        onChangeText={val => this.onChangeText('username', val)}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder='Password'
                        secureTextEntry={true}
                        autoCapitalize="none"
                        placeholderTextColor='white'
                        onChangeText={val => this.onChangeText('password', val)}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder='Email'
                        autoCapitalize="none"
                        placeholderTextColor='white'
                        onChangeText={val => this.onChangeText('email', val)}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder='Phone Number'
                        autoCapitalize="none"
                        placeholderTextColor='white'
                        onChangeText={val => this.onChangeText('phone_number', val)}
                    />
                    <Button
                        title='Sign Up'
                        onPress={this.signUp}
                    />
                </Fragment>
            )
            }
            {
            this.state.showConfirmationForm && (
                <Fragment>
                    <TextInput
                        style={styles.input}
                        placeholder='Authentication code'
                        autoCapitalize="none"
                        placeholderTextColor='white'
                        onChangeText={val => this.onChangeText('authenticationCode', val)}
                    />
                    <Button
                        title='Confirm Sign Up'
                        onPress={this.confirmSignUp}
                    />
                </Fragment>
            )
            }
        </View>
        )
    }
};

export default SignUp;