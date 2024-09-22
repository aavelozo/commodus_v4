
import React, { useState } from 'react'
import { Text, View, StyleSheet, Dimensions, TouchableOpacity, Alert, ScrollView, TouchableWithoutFeedback } from 'react-native'
import { Checkbox } from 'react-native-paper'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { CommonActions } from '@react-navigation/native'
import { DefaultStyles } from '../../DefaultStyles'
import Dados from '../../../controllers/Dados'
import { ActivityIndicator, HelperText, TextInput } from 'react-native-paper'
import { DefaultProps } from '../../DefaultProps'
import { RFValue } from 'react-native-responsive-fontsize'
import Utils from '../../../controllers/Utils'
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import _ from 'lodash'
import Trans from '../../../controllers/internatiolization/Trans'
import { getAuth, fetchSignInMethodsForEmail } from 'firebase/auth';

const schema = yup.object({
    fullName: yup.string().required(_.capitalize(Trans.t('msg_enter_full_name'))),
    email: yup.string().email(_.capitalize(Trans.t('invalid e-mail'))).required(_.capitalize(Trans.t('msg_enter_email'))),
    password: yup.string().min(6, `6 ${Trans.t('digits')}`).required(_.capitalize(Trans.t('msg_enter_password'))),
    confirmPassword: yup.string().min(6, `6 ${Trans.t('digits')}`).required(_.capitalize(Trans.t('msg_enter_password'))),
})


function FormUser(props: React.PropsWithChildren): JSX.Element {
    const [saving, setSaving] = useState(false);
    const [accept, setAccept] = useState(false);
    const { control, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(schema)
    })


    /**
     * submited on user registration
     * @param data 
     * @returns 
     * @updates 
     *      - 2024-03-19 - implemented server user register request
     */
    async function onSubmit(data: any) {
        try {

            if (data.password !== data.confirmPassword) {
                Alert.alert(_.capitalize(Trans.t('error')), Trans.t('msg_passords_not_match'))
                return;
            }
            if (!accept) {
                Alert.alert(_.capitalize(Trans.t('error')), Trans.t('confirm_terms'))
                return;
            }

            setSaving(true);
            Dados.user = data;


            //firebase user registration
            auth().createUserWithEmailAndPassword(data.email.trim().toLowerCase(), data.password).then((responseUserData) => {
                console.log(responseUserData);
                console.log('User account created & signed in!');
                //save user register on user collections (<> auth.user)
                const user = firestore().collection('Users').add({
                    name: data.fullName,
                    email: data.email.trim().toLowerCase(),
                    authUserId: responseUserData.user.uid
                }).then(succ => {
                    console.log(succ);
                }).catch(err => {
                    console.log(err);
                });
                setSaving(false);
                props.navigation.dispatch(
                    CommonActions.reset({
                        index: 0,
                        routes: [{ name: 'Login', params: data }]
                    })
                );
            }).catch(error => {
                setSaving(false);
                if (error.code === 'auth/email-already-in-use') {
                    Alert.alert('', Trans.t('msg_email_already_registered'));
                }
                if (error.code === 'auth/invalid-email') {
                    Alert.alert('', Trans.t('invalid email'));
                }
            });
        } catch (e) {
            setSaving(false);
            console.log(e);
            Utils.showError(e);
        }
    }

    return (

        <View style={style.container}>
            <ScrollView>
                <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1, paddingTop: '20%' }}>
                    <Controller
                        control={control}
                        render={({ field: { onChange, onBlur, value } }) => (
                            <>
                                <TextInput
                                    {...DefaultProps.textInput}
                                    style={DefaultStyles.textInput}
                                    disabled={saving}
                                    label={_.capitalize(Trans.t('full name'))}
                                    autoComplete='name'
                                    onBlur={onBlur}
                                    onChangeText={onChange}
                                    value={value}
                                />
                                <HelperText
                                    style={DefaultStyles.defaultHelperText}
                                    type="error"
                                    visible={errors.fullName ? true : false}
                                >
                                    {errors.fullName?.message}
                                </HelperText>
                            </>

                        )}
                        name="fullName"
                    />
                    <Controller
                        control={control}
                        render={({ field: { onChange, onBlur, value } }) => (
                            <>
                                <TextInput
                                    {...DefaultProps.textInput}
                                    style={DefaultStyles.textInput}
                                    keyboardType='email-address'
                                    label={_.capitalize(Trans.t('e-mail'))}
                                    secureTextEntry={false}
                                    autoComplete='email'
                                    onBlur={onBlur}
                                    onChangeText={onChange}
                                    value={value}
                                    disabled={saving}
                                />
                                <HelperText
                                    style={DefaultStyles.defaultHelperText}
                                    type="error"
                                    visible={errors.email ? true : false}
                                >
                                    {errors.email?.message}
                                </HelperText>
                            </>
                        )}
                        name="email"
                    />
                    <Controller
                        control={control}
                        render={({ field: { onChange, onBlur, value } }) => (
                            <>
                                <TextInput
                                    {...DefaultProps.textInput}
                                    style={DefaultStyles.textInput}
                                    label={_.capitalize(Trans.t('password'))}
                                    secureTextEntry={true}
                                    onBlur={onBlur}
                                    onChangeText={onChange}
                                    value={value}
                                    disabled={saving}
                                />
                                <HelperText
                                    style={DefaultStyles.defaultHelperText}
                                    type="error"
                                    visible={errors.password ? true : false}
                                >
                                    {errors.password?.message}
                                </HelperText>
                            </>
                        )}
                        name="password"
                    />
                    <Controller
                        control={control}
                        render={({ field: { onChange, onBlur, value } }) => (
                            <>
                                <TextInput
                                    {...DefaultProps.textInput}
                                    style={DefaultStyles.textInput}
                                    label={_.capitalize(Trans.t('password confirm'))}
                                    secureTextEntry={true}
                                    onBlur={onBlur}
                                    onChangeText={onChange}
                                    value={value}
                                    disabled={saving}
                                />
                                <HelperText
                                    style={DefaultStyles.defaultHelperText}
                                    type="error"
                                    visible={errors.confirmPassword ? true : false}
                                >
                                    {_.capitalize(Trans.t('password not match'))}
                                </HelperText>
                            </>
                        )}
                        name="confirmPassword"
                    />

                    <View style={style.viewCheckBox}>
                        <View>
                            <Checkbox
                                status={accept ? 'checked' : 'unchecked'}
                                onPress={() => setAccept(!accept)}
                            />
                        </View>
                        <View>
                            <View style={{ flexDirection: 'row' }}>
                                <Text style={style.textCheckBox}>{_.capitalize(Trans.t('i agree with the'))}</Text>
                                <TouchableOpacity onPress={() => props.navigation.navigate('Terms')}>
                                    <Text style={style.link}> {_.capitalize(Trans.t('terms of use'))} </Text>
                                </TouchableOpacity>
                                <Text style={style.textCheckBox}>{Trans.t('and')}</Text>
                                <TouchableOpacity onPress={() => props.navigation.navigate('Privacy')}>
                                    <Text style={style.link}> {_.capitalize(Trans.t('privacy policy'))}</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                    <TouchableOpacity
                        activeOpacity={0.9}
                        onPress={handleSubmit(onSubmit)}
                        style={style.button}
                        disabled={saving}
                    >
                        <Text style={style.textButton}>
                            {saving
                                ? <ActivityIndicator />
                                : _.capitalize(Trans.t('confirm'))
                            }
                        </Text>
                    </TouchableOpacity>
                </View>
            </ScrollView >
        </View >
    )
}

const style = StyleSheet.create({
    container: {
        backgroundColor: DefaultStyles.colors.fundo,
        flex: 1,
        borderTopLeftRadius: 30,
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
    },
    button: {
        alignItems: "center",
        justifyContent: 'center',
        backgroundColor: DefaultStyles.colors.botao,
        width: '64%',
        height: Dimensions.get('window').height / 14,
        borderRadius: RFValue(16),
        borderBottomWidth: 1,
        borderBottomColor: DefaultStyles.colors.tabBar,
        marginTop: RFValue(35)
    },
    textButton: {
        color: DefaultStyles.colors.tabBar,
        fontWeight: 'bold',
        fontSize: 20,
    },
    viewBottom: {
        flex: 3,
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        width: '100%',
        paddingTop: RFValue(5)
    },
    textCheckBox: {
        fontSize: RFValue(12),
        color: DefaultStyles.colors.tabBar,
    },
    link: {
        color: 'blue',
        fontSize: RFValue(12)
    },
    viewCheckBox: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        marginLeft: RFValue(-15),
        alignItems: 'center',
    },
});

export default FormUser;