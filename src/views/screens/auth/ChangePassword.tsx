import React, { useState } from 'react'
import { Text, View, StyleSheet, Image, TouchableOpacity, Alert, ToastAndroid } from 'react-native'
import TitleView from '../../components/TitleView'
import { RFValue } from 'react-native-responsive-fontsize'
import { useNavigation, useFocusEffect } from '@react-navigation/native'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import Header from '../../components/Header'
import { TextInput } from 'react-native-paper'
import { DefaultStyles } from '../../DefaultStyles'
import { DefaultProps } from '../../DefaultProps'

function ChangePassword(props): JSX.Element {
    const navigation = useNavigation()
    const [passwordActual, setPasswordActual] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [newPasswordConfirm, setNewPasswordConfirm] = useState('')
    const [divergent, setDivergent] = useState(false);

    const showToast = (msg) => {
        ToastAndroid.showWithGravity(msg, ToastAndroid.LONG, ToastAndroid.CENTER, 25, 50);
    };

    const editPassword = () => {
        try {
            if (newPassword != newPasswordConfirm) {
                setDivergent(true)
            } else {
                /*let user = realm.objects('Users')
                if (passwordActual == user[0].password) {
                    realm.write(() => {
                        user[0].password = newPassword;
                    });
                    showToast("Senha alterada com sucesso")
                    setPasswordActual("")
                    setNewPassword("")
                    setNewPasswordConfirm("")
                }*/
            }
        } catch (error) {
            console.log(error)
        }

    }

    const goBack = () => {
        navigation.navigate('Account')
    }

    return (
        <View style={style.container}>
            <Header withButtons={true} onPressConclude={editPassword} onPressCancel={goBack} />
            <View style={style.title}>
                <TitleView title='Alteração de senha'></TitleView>
                <View style={style.espacoCentral}>
                    <View style={{ height: '30%', justifyContent: 'center', alignItems: 'center' }}>
                        <Text style={style.description}>Para garantir a segurança da sua conta, o COMMODUS solicita sua senha atual para proceder com a alteração.</Text>
                    </View>
                    <View style={{ height: '50%', marginTop: RFValue(20), alignItems: 'center' }}>
                        <TextInput
                            {...DefaultProps.textInput}
                            style={DefaultStyles.textInput}
                            keyboardType='default'
                            label='Senha atual'
                            onChangeText={text => setPasswordActual(text)}
                            value={passwordActual}
                            secureTextEntry

                        />
                        <TextInput
                            {...DefaultProps.textInput}
                            style={DefaultStyles.textInput}
                            keyboardType='default'
                            label='Nova senha'
                            onChangeText={text => {
                                setDivergent(false)
                                setNewPassword(text)
                            }}
                            value={newPassword}
                            secureTextEntry
                        />
                        {divergent ? <Text style={{ paddingLeft: RFValue(30) }}>*Senhas informadas são divergentes</Text> : false}
                        <TextInput
                            {...DefaultProps.textInput}
                            style={DefaultStyles.textInput}
                            label='Confirme a nova senha'
                            onChangeText={text => {
                                setDivergent(false)
                                setNewPasswordConfirm(text)
                            }}
                            value={newPasswordConfirm}
                            secureTextEntry={true}
                        />
                        {divergent ? <Text style={{ paddingLeft: RFValue(30) }}>*Senhas informadas são divergentes</Text> : false}
                    </View>





                </View>
            </View>

        </View>

    )
}

const style = StyleSheet.create({
    container: {
        backgroundColor: '#202D46',
        flex: 1,
    },
    espacoCentral: {
        backgroundColor: DefaultStyles.colors.fundo,
        flex: 1,
        borderTopLeftRadius: 25,
        width: '100%',
        height: '100%',
        justifyContent: 'flex-start'
        // alignItems: 'center'
    },

    title: {
        flex: 9,
        backgroundColor: DefaultStyles.colors.tabBar,
        alignItems: 'center',
        justifyContent: 'center',

    },
    buttonEditVehicle: {
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        bottom: RFValue(15),
        right: RFValue(15)
    },
    description: {
        marginHorizontal: RFValue(35),
        marginTop: RFValue(5),
        marginBottom: RFValue(5),
        textAlign: 'center',
        fontFamily: 'verdana',
        color: DefaultStyles.colors.tabBar,
        fontSize: RFValue(15)
    },
});

export default ChangePassword;