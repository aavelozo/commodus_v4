import { CommonActions } from '@react-navigation/native'
import React, { useState } from 'react'
import { Text, View, StyleSheet, Dimensions, TouchableOpacity, Image, TouchableWithoutFeedback } from 'react-native'
import { TextInput } from 'react-native-paper'
import { useNavigation } from '@react-navigation/native';
import AuthController from '../../../controllers/AuthController';
import { DefaultProps } from '../../DefaultProps';
import { DefaultStyles } from '../../DefaultStyles';
import { RFValue } from 'react-native-responsive-fontsize';



function FormRecoverLogin(props): JSX.Element {
    const [email, setEmail] = useState((props.user || {}).email)
    const [errorMessage, setErrorMessage] = useState('');
    const navigation = useNavigation();


    function recoverPassword(email: string) {
        try {
            let user = AuthController.getUser(email);

            if (user != null && user.length) {
                AuthController.sendRecoverPasswordEmail(email).then(result => {
                    console.log(result);
                }).catch(error => {
                    console.log(error);
                    setErrorMessage(error.message || error);
                });
            } else {
                setErrorMessage("usuário não encontrado");
            }
        } catch (e) {
            console.log(e);
            setErrorMessage(e.message || e);
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
                ><Text style={style.textButton}>Confirmar</Text></TouchableOpacity>

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