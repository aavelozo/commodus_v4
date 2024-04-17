import React, { useState } from 'react'
import { Text, View, StyleSheet, Alert, ToastAndroid } from 'react-native'
import TitleView from '../../components/TitleView'
import { RFValue } from 'react-native-responsive-fontsize'
import { useNavigation } from '@react-navigation/native'
import Header from '../../components/Header'
import { TextInput } from 'react-native-paper'
import { DefaultStyles } from '../../DefaultStyles'
import { DefaultProps } from '../../DefaultProps'
import Utils from '../../../controllers/Utils'
import auth from '@react-native-firebase/auth';

function ChangePassword(props): JSX.Element {
    const [saving,setSaving] = useState(false);
    const navigation = useNavigation()
    const [passwordActual, setPasswordActual] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [newPasswordConfirm, setNewPasswordConfirm] = useState('')
    const [divergent, setDivergent] = useState(false);

    const showToast = (msg) => {
        ToastAndroid.showWithGravity(msg, ToastAndroid.LONG, ToastAndroid.CENTER, 25, 50);
    };

    const editPassword = async () => {
        try {
            if (newPassword != newPasswordConfirm) {
                setDivergent(true)
            } else {
                setSaving(true);
                auth().signInWithEmailAndPassword(auth().currentUser.email, passwordActual).then((loginResult) => {
                    console.log(loginResult);
                    auth().currentUser?.updatePassword(newPassword).then(async updateResult=>{
                        console.log(updateResult);
                        await auth().currentUser?.reload();
                        setSaving(false);
                        Alert.alert("Senha alterada com sucesso");
                    }).catch(updateError=>{
                        setSaving(false);
                        Utils.showError(updateError);
                    });
                }).catch(loginResultError=>{
                    setSaving(false);
                    console.log(loginResultError);
                    Utils.showError("Senha atual não confere");
                })                
            }
        } catch (error) {
            setSaving(false);
            Utils.showError(error);
        } 
    }

    const goBack = () => {
        navigation.navigate('Account')
    }

    return (
        <View style={style.container}>
            <Header 
                withButtons={true} 
                onPressConclude={editPassword} 
                onPressCancel={goBack} 
                saving={saving}
            />
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
                            disabled={saving}

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
                            disabled={saving}
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
                            disabled={saving}
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