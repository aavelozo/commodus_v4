import { CommonActions } from '@react-navigation/native'
import React, { useState } from 'react'
import { Text, View, StyleSheet, Dimensions, TouchableOpacity, Image, TouchableWithoutFeedback, Alert } from 'react-native'
import { ActivityIndicator, TextInput } from 'react-native-paper'
import { useNavigation } from '@react-navigation/native';
import AuthController from '../../../controllers/AuthController';
import { DefaultProps } from '../../DefaultProps';
import { DefaultStyles } from '../../DefaultStyles';
import { RFValue } from 'react-native-responsive-fontsize';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import Utils from '../../../controllers/Utils';


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
                        Alert.alert("Verifique o email recebido para poder aterar sua senha, depois tente logar novamente com a nova senha");
                    }
                } else {
                    setErrorMessage("email não cadastrado");
                }
            } else {
                setErrorMessage("email em branco");
            }
        } catch (e) {
            console.log(e);
            setErrorMessage(e.message || e);
        } finally {
            setLoading(false);
        }
    }

    return (
        <View style={style.container}>
            <View style={style.imagem}>
                <Image style={{ height: RFValue(120), width: RFValue(120) }} resizeMode='contain' source={require('../../assets/logoCommodusEscuro.png')} />
            </View>
            <Text style={style.title}>Recuperação de conta</Text>
            <Text style={style.description}>Para ajudar a manter sua conta segura, o COMMODUS precisa saber qual email foi utilizado, para podermos lhe enviar a recuperação de senha.</Text>
            <View style={style.viewInput}>


                <TextInput
                    {...DefaultProps.textInput}
                    style={DefaultStyles.textInput}
                    keyboardType='email-address'
                    label='E-mail'
                    onChangeText={text => setEmail(text)}
                    value={email}
                    disabled={loading}
                />


                <View style={[style.viewErro, { marginBottom: RFValue(25) }]} >
                    {
                        errorMessage ? <Text style={style.textoErro}>{errorMessage}</Text> : false
                    }
                </View>


                <TouchableOpacity
                    activeOpacity={0.9}
                    onPress={() => recoverPassword(email)}
                    style={style.button}
                    disabled={loading}
                >
                    {loading
                        ? <ActivityIndicator />
                        : <Text style={style.textButton}>
                            Confirmar
                        </Text>
                    }
                </TouchableOpacity>

                <TouchableOpacity onPress={() => navigation.navigate('UserRegistration')}>
                    <>
                        <Text style={{ marginTop: RFValue(50), color: DefaultStyles.colors.tabBar }}>Ainda não tem cadastro ?</Text>
                        <Text style={{ textAlign: 'center', color: DefaultStyles.colors.tabBar }}>Registre-se</Text>
                    </>

                </TouchableOpacity>

            </View>


        </View>

    )
}

const style = StyleSheet.create({
    container: {
        backgroundColor: DefaultStyles.colors.fundo,
        flex: 9,
        borderTopLeftRadius: RFValue(30),
        alignItems: 'center',
        justifyContent: 'center',
    },
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
    button: {
        alignItems: "center",
        justifyContent: 'center',
        backgroundColor: DefaultStyles.colors.botao,
        width: '65%',
        height: Dimensions.get('window').height / 14,
        borderRadius: 16,
        borderBottomWidth: 1,
        borderBottomColor: DefaultStyles.colors.tabBar,
    },
    textButton: {
        color: DefaultStyles.colors.tabBar,
        fontWeight: 'bold',
        fontSize: RFValue(20),

    },
    textoErro: {
        color: '#cb0000',


    },
    viewErro: {
        // paddingHorizontal: Dimensions.get('window').width * 0.10, 
        alignSelf: 'flex-start',
        height: RFValue(18),
        marginLeft: RFValue(50),
    },
    imagem: {
        justifyContent: 'center',
        height: Dimensions.get('window').height / 4,
        flex: 2,
        width: '100%',
        alignItems: 'center'
        // borderWidth: 1,
        // borderColor: 'red'
    },
    viewInput: {
        flex: 3,
        width: '100%',
        alignItems: 'center'

        // borderWidth: 1,
        // borderColor: 'blue'
    }
});

export default FormRecoverLogin;