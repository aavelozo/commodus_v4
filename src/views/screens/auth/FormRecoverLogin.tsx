import { CommonActions } from '@react-navigation/native'
import React, { useState } from 'react'
import { Text, View, StyleSheet, Dimensions, TouchableOpacity, Image, TouchableWithoutFeedback, Alert } from 'react-native'
import { ActivityIndicator, HelperText, TextInput } from 'react-native-paper'
import { useNavigation } from '@react-navigation/native';
import AuthController from '../../../controllers/AuthController';
import { DefaultProps } from '../../DefaultProps';
import { DefaultStyles } from '../../DefaultStyles';
import { RFValue } from 'react-native-responsive-fontsize';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import Utils from '../../../controllers/Utils';
import Trans from '../../../controllers/internatiolization/Trans';
import _ from 'lodash';
import { BaseAuth } from './BaseAuth';

/**
 * Password recover screen
 * @param props 
 * @returns 
 * @author Alencar
 */
function FormRecoverLogin(props): JSX.Element {
    const [loading,setLoading] = useState(false);
    const [email, setEmail] = useState((props.user || {}).email)
    const [errorMessage, setErrorMessage] = useState('');
    const navigation = useNavigation();


    async function recoverPassword(email: string) {
        try {
            if (email != null && email.length) {
                setLoading(true);

                //check if user exists
                let userDoc = await firestore().collection('Users').where('email','==',email.trim().toLowerCase()).get();            
                if (userDoc && userDoc.size > 0) {

                    //firebase function to send user recover link                
                    let result = await auth().sendPasswordResetEmail(email);                
                    console.log(result);
                    if (result) {
                        console.log(result);
                        setErrorMessage(result);
                    } else {
                        setErrorMessage('');
                        Alert.alert('',Trans.t('msg_password_recover_check_email'));
                    }
                } else {
                    setErrorMessage(Trans.t('not registered e-mail'));
                }
            } else {
                setErrorMessage(Trans.t('empty e-mail'));
            }
        } catch (e) {
            console.log(e);
            setErrorMessage(e.message || e);
        } finally {
            setLoading(false);
        }
    }

    return (
        <BaseAuth
            onConfirm={()=>recoverPassword(email)}
            textConfirm={_.capitalize(Trans.t('confirm'))}
            afterConfirmButton={<TouchableOpacity 
                    onPress={() => navigation.navigate('UserRegistration')}>
                    <>
                        <Text style={{ marginTop: 50, color: DefaultStyles.colors.tabBar }}>{Trans.t('ask_dont_registered')}</Text>
                        <Text style={{ textAlign: 'center', color: DefaultStyles.colors.tabBar }}>{_.capitalize(Trans.t('register now'))}</Text>
                    </>
                </TouchableOpacity>
            }
        >
            <Text style={style.title}>{_.capitalize(Trans.t('account recover'))}</Text>
            <Text style={style.description}>{Trans.t('info_require_email')}</Text>
            <View style={style.viewInput}>


                <TextInput
                    {...DefaultProps.textInput}
                    style={DefaultStyles.textInput}
                    keyboardType='email-address'
                    label={_.capitalize(Trans.t('e-mail'))}
                    onChangeText={text => setEmail(text)}
                    value={email}
                    disabled={loading}
                />
                <HelperText
                    style={[DefaultStyles.defaultHelperText,{marginLeft:10}]}            
                    type="error"
                    visible={errorMessage ? true : false}
                >
                    {errorMessage}
                </HelperText>
            </View>
        </BaseAuth>

    )
}

const style = StyleSheet.create({    
    title: {
        fontSize: RFValue(24),
        marginTop: RFValue(-10),
        fontWeight: 'bold'
    },
    description: {
        marginLeft: RFValue(50),
        marginRight: RFValue(50),
        marginTop: RFValue(5),
        marginBottom: RFValue(5),
        textAlign: 'center',
        fontFamily: 'verdana',
        color: DefaultStyles.colors.tabBar
    },
    viewInput: {
        flex: 4,
        width: '100%',
        alignItems: 'center'
    }
});

export default FormRecoverLogin;