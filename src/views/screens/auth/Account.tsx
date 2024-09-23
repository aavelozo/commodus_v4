import React, { useState, useEffect } from 'react'
import { View, StyleSheet, Image, TouchableOpacity, Alert, ToastAndroid, Keyboard } from 'react-native'
import { Text, View, StyleSheet, Image, TouchableOpacity, Alert, ToastAndroid, Keyboard, PermissionsAndroid, Platform } from 'react-native'
import TitleView from '../../components/TitleView'
import { useNavigation } from '@react-navigation/native'
import { RFValue } from 'react-native-responsive-fontsize'
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import Header from '../../components/Header'
import { TextInput } from 'react-native-paper'
import { DefaultStyles } from '../../DefaultStyles'
import { DefaultProps } from '../../DefaultProps'
import Edit from '../../assets/iconSvg/edit.svg'
import storage from '@react-native-firebase/storage';
import firestore from '@react-native-firebase/firestore';
import { getAuth } from '@react-native-firebase/auth';
import auth from '@react-native-firebase/auth';
import AuthController from '../../../controllers/AuthController'
import Trans from '../../../controllers/internatiolization/Trans'
import _ from 'lodash';
import Utils from '../../../controllers/Utils'

/**
 * Account management screen
 * @param props 
 * @returns 
 * @author Bruno
 */
function Account(props): JSX.Element {
    const [saving, setSaving] = useState(false);
    const navigation = useNavigation();
    const [loading, setLoading] = useState(false);
    const [loaded, setLoaded] = useState(false);
    const [foto, setFoto] = useState('')
    const [email, setEmail] = useState('')
    const [name, setName] = useState('')
    const [password, setPassword] = useState('')
    const [imageSize, setImageSize] = useState(RFValue(130))


    useEffect(() => {
        if (!loading && !loaded) {
            setLoading(true);

            //load user data
            (async () => {
                try {
                    console.log('loading user...');

                    const currentAuthUser = auth().currentUser;
                    if (currentAuthUser) {
                        console.log('currentAuthUser', currentAuthUser);
                        let userData = AuthController.getLoggedUser();//await firestore().collection('Users').where('authUserId','==',currentAuthUser.uid).get();
                        console.log(userData.data())
                        if (userData) {
                            setEmail(userData.data().email)
                            setPassword(userData.data().password)
                            setName(userData.data().name)
                            setFoto(userData.data().photo)
                        }
                    }

                    console.log('loading user... ok');
                } catch (e) {
                    console.log(e);
                } finally {
                    setLoaded(true);
                    setLoading(false);
                }
            })();

        }
    }, [navigation]);

    useEffect(() => {
        const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => setImageSize(RFValue(80)));
        const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => setImageSize(RFValue(130)));
        return () => {
            keyboardDidHideListener.remove()
            keyboardDidShowListener.remove()
        }
    }, [])

    const requestCameraPermission = async () => {
        if (Platform.OS === 'android') {
            try {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.CAMERA,
                    {
                        title: `${Trans.t('Permission to use the camera')}`,
                        message:`${Trans.t('This app needs to access the camera to take photos.')}`,
                        buttonNeutral: `${Trans.t('Ask later')}`,
                        buttonNegative: `${_.capitalize(Trans.t('cancel'))}`,
                        buttonPositive: "OK"
                    }
                );
                if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                    handleImageUser()
                } else {
                    Alert.alert(`${Trans.t('Permission denied')}`, `${Trans.t('You have not granted access to the camera.')}`);
                }
            } catch (err) {
                console.warn(err);
            }
        } else {
            handleImageUser()
        }
    };

    // mostra alert para selecionar camera ou galeria
    const handleImageUser = () => {
        Alert.alert(_.capitalize(Trans.t('image')), `${_.capitalize(Trans.t('select the location where your photo is'))}:`, [
            {
                text: _.capitalize(Trans.t('galery')),
                onPress: () => pickImageGalery(),
                style: 'default'
            },
            {
                text: _.capitalize(Trans.t('camera')),
                onPress: () => pickImageCamera(),
                style: 'default'
            }
        ])
    }

    const pickImageGalery = async () => {
        const options = {
            mediaType: 'photo'
        }
        try {
            const result = await launchImageLibrary(options)
            if (result.assets) {
                setFoto(result.assets[0].uri.toString());
                showToast(`${Trans.t('Image added. Need to conclude')}.`)
                return
            }
        } catch (error) {
            console.log(error)
        }
    }

    const uploadPhoto = async () => {
        const authUserId = await getAuth().currentUser.uid
        const filenameFull = `images/${authUserId}/${authUserId}`
        if (Utils.hasValue(foto) && foto != 'null') {
            //Alert.alert(foto);
            const uri = foto.replace('file://', '')
            const task = storage().ref(filenameFull).putFile(uri)
            return new Promise((resolve, reject) => {
                task.on(
                    'state_changed',
                    null,
                    (error) => reject(error),
                    async () => {
                        const downloadURL = await task.snapshot.ref.getDownloadURL();
                        resolve(downloadURL);
                    }
                );
            });
        } else {
            return null;
        }
    }

    const showToast = (msg) => {
        ToastAndroid.showWithGravity(msg, ToastAndroid.LONG, ToastAndroid.CENTER, 25, 50);
    };


    const pickImageCamera = async () => {
        console.log('click')
        const options = {
            mediaType: 'photo',
            saveToPhotos: false,
            cameraType: 'front',
            quality: 1
        }
        const result = await launchCamera(options)
        if (result.assets) {
            setFoto(result.assets[0].uri.toString());
            showToast(`${Trans.t('Image added. Need to conclude')}.`)
            return
        }
    }

    async function saveUser() {
        try {
            const currentAuthUser = auth().currentUser;
            if (currentAuthUser) {
                setSaving(true);
                console.log('currentAuthUser', currentAuthUser);
                const fullPath = await uploadPhoto()
                let userData = await firestore().collection('Users').where('authUserId', '==', currentAuthUser.uid).get();
                if (userData && userData.docs && userData.docs.length) {
                    await firestore().collection('Users').doc(userData.docs[0].id).update({
                        name: name || null,
                        photo: fullPath || null
                    });
                    showToast(`${_.capitalize(Trans.t('successfull updated data'))}.`);
                }
            }
        } catch (e) {
            console.log(e);
        } finally {
            setSaving(false);
        }
    }


    const goBack = () => {
        navigation.goBack();
    }


    return (
        <View style={style.container}>
            <Header
                withButtons={true}
                onPressConclude={saveUser}
                onPressCancel={goBack}
                saving={saving}
            />
            <View style={style.title}>
                <TitleView title={_.capitalize(Trans.t('user'))}></TitleView>
                <View style={style.espacoCentral}>
                    <View style={{ height: '30%', justifyContent: 'flex-end', marginTop: RFValue(10), alignItems: 'center', }}>
                        <TouchableOpacity
                            onPress={() => {
                                requestCameraPermission()
                            }}>
                            {
                                foto ?
                                    <Image
                                        style={{ height: imageSize, width: imageSize, borderRadius: imageSize / 2, borderWidth: 2, borderColor: DefaultStyles.colors.tabBar }}
                                        resizeMode="cover"
                                        source={{ uri: foto }}
                                    /> :
                                    <Image
                                        style={{ height: imageSize * 0.8, width: imageSize * 0.8 }}
                                        resizeMode="contain"
                                        source={require('../../assets/user.png')}
                                    />
                            }

                        </TouchableOpacity>
                    </View>
                    <View style={{ height: '50%', marginTop: RFValue(20), alignItems: 'center' }}>
                        <TextInput
                            {...DefaultProps.textInput}
                            style={DefaultStyles.textInput}
                            keyboardType='default'
                            label={_.capitalize(Trans.t('name'))}
                            onChangeText={name => setName(name)}
                            value={name}
                        />
                        <TextInput
                            {...DefaultProps.textInput}
                            style={DefaultStyles.textInput}
                            keyboardType='default'
                            label={_.capitalize(Trans.t('e-mail'))}
                            onChangeText={email => setEmail(email)}
                            value={email}
                            disabled
                        />

                        <TextInput
                            {...DefaultProps.textInput}
                            style={DefaultStyles.textInput}
                            label={_.capitalize(Trans.t('password'))}
                            onChangeText={password => setPassword(password)}
                            value={password}
                            secureTextEntry={true}
                            disabled
                        />

                    </View>




                    <View style={style.buttonEditVehicle}>
                        {/* Ao clicar, edita o veículo com os dados já preenchidos nos seus respectivos campos. */}
                        <TouchableOpacity
                            onPress={() => navigation.navigate('ChangePassword')}
                        >
                            {/* <EvilIcons name='edit' size={RFValue(35)} color={defaultStyle.colors.botao} /> */}
                            <Edit width={RFValue(50)} height={RFValue(50)} />
                        </TouchableOpacity>
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
    buttonExitVehicle: {
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        bottom: RFValue(15),
        left: RFValue(15)
    },
});

export default Account;