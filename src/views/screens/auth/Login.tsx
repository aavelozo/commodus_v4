import { CommonActions, useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { StyleSheet, Dimensions, TouchableWithoutFeedback, Text, TouchableOpacity } from "react-native";
import { HelperText, TextInput } from "react-native-paper";
import { DefaultStyles } from '../../DefaultStyles';
import { DefaultProps } from '../../DefaultProps';
import AuthController from '../../../controllers/AuthController';
import { RFValue } from 'react-native-responsive-fontsize';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import Vehicles from '../../../database/models/Vehicles';
import Trans from '../../../controllers/internatiolization/Trans';
import _ from 'lodash';
import Utils from '../../../controllers/Utils';
import { BaseAuth } from './BaseAuth';

function Login(props: Object): JSX.Element {
    const [missingData,setMissingData] = useState(false);
    const [login, setLogin] = useState((props.user || {}).email)    
    const [senha, setSenha] = useState('');
    const [loading,setLoading] = useState(false);
    const [logged, setLogged] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const navigation = useNavigation();

    return (
        <BaseAuth
            afterConfirmButton={<TouchableOpacity 
                    onPress={() => navigation.navigate('UserRegistration')}>
                    <>
                        <Text style={{ marginTop: 50, color: DefaultStyles.colors.tabBar }}>{Trans.t('ask_dont_registered')}</Text>
                        <Text style={{ textAlign: 'center', color: DefaultStyles.colors.tabBar }}>{_.capitalize(Trans.t('register now'))}</Text>
                    </>
                </TouchableOpacity>
            }
            onConfirm={async () => {                                                
                if (Utils.hasValue(login) && Utils.hasValue(senha)) {
                    setLoading(true);
                    setMissingData(false);
                    auth().signInWithEmailAndPassword(login, senha).then((loginResult) => {
                        console.log('user logged!',loginResult);
                        let nextRouteName = 'StackVehicle';
                        (async () => {
                            try {
                                let loggedUser = await firestore().collection('Users').where('authUserId','==',loginResult.user.uid).get();
                                console.log('getting user of collection... ok');
                                if (loggedUser && loggedUser.docs && loggedUser.docs.length > 0) {
                                    console.log('loggedUser',loggedUser);
                                    AuthController.setLoggedUser(loggedUser.docs[0]);
                                    console.log('loggedUser setted');
                                    if ((await Vehicles.getDBData())?.size > 0) {
                                        nextRouteName = 'ViewExpense';
                                    }
                                }   
                            } catch (e) {
                                console.log(e);
                            } finally {
                                setLoading(false);
                                navigation.dispatch(
                                    CommonActions.reset({
                                        index: 0,
                                        routes: [{ name: 'Tab', params: { route: nextRouteName } }]

                                    })
                                );
                            }
                        })();
                    }).catch(err => {
                        console.log(err);
                        setLoading(false);
                        setLogged(false);
                        if (err.code === 'auth/invalid-credential') {
                            setErrorMessage(Trans.t('msg_email_or_password_invalids'));
                        } else {
                            setErrorMessage(err?.message || err);
                        }

                    })
                } else {
                    setMissingData(true);
                }
            }}
            loading={loading}
        >
            <TextInput
                {...DefaultProps.textInput}
                style={DefaultStyles.textInput}
                label={_.capitalize(Trans.t('e-mail'))}
                mode='outlined'
                keyboardType='email-address'
                defaultValue=''
                onChangeText={text => {
                    setLogin(text)
                    setErrorMessage('')
                    setLogged(false)
                }}
                value={login}
                disabled={loading}
            />
            <HelperText
                style={[DefaultStyles.defaultHelperText,{marginLeft:10}]}            
                type="error"
                visible={(missingData && !login) || (!logged && errorMessage != '')}
            >
                {(missingData && !login)? _.capitalize(Trans.t('msg_enter_email')) : errorMessage}
            </HelperText>                 
            <TextInput
                {...DefaultProps.textInput}
                style={DefaultStyles.textInput}
                label={_.capitalize(Trans.t('password'))}
                mode='outlined'
                onChangeText={text => {
                    setLogged(false)
                    setErrorMessage('')
                    setSenha(text)
                }}
                value={senha}
                secureTextEntry={true}
                autoComplete='email'
                disabled={loading}
            />
            <HelperText
                style={[DefaultStyles.defaultHelperText,{marginLeft:10}]}
                type="error"
                visible={(missingData && !senha)}
            >
                {_.capitalize(Trans.t('msg_enter_password'))}
            </HelperText>

            <TouchableWithoutFeedback
                onPress={() => navigation.navigate('RecoverLogin')}
            >
                <Text
                    style={{ marginBottom: RFValue(80), color: DefaultStyles.colors.tabBar, alignSelf: 'center' }}
                >
                    {Trans.t('ask_forgot_password')}                        
                </Text>
            </TouchableWithoutFeedback>
        </BaseAuth>
    )
}

const style = StyleSheet.create({
    container: {
        backgroundColor: DefaultStyles.colors.fundo,
        flex: 1,
        // borderTopLeftRadius: 30,
        alignItems: 'center',
        justifyContent: 'center',
    },
    button: {
        alignItems: "center",
        justifyContent: 'center',
        backgroundColor: DefaultStyles.colors.botao,
        width: '65%',
        height: Dimensions.get('window').height / 14,
        borderRadius: RFValue(16),
        borderBottomWidth: 1,
        borderBottomColor: DefaultStyles.colors.tabBar,
    },
    textButton: {
        color: DefaultStyles.colors.tabBar,
        //fontWeight: 'bold',
        fontSize: RFValue(18),

    },
    imagem: {
        justifyContent: 'center',
        flex: 2.5,
        width: '100%',
        alignItems: 'center',
    },

    viewInput: {
        flex: 4,
        width: '100%',
        //justifyContent: 'center',
        alignItems: 'center'

        // borderWidth: 1,
        // borderColor: 'blue'
    }
})

export { Login }