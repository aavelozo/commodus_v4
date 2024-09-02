import React, { useState, useEffect } from 'react'
import { Text, View, StyleSheet, Image, TouchableOpacity, Alert, ToastAndroid, Button } from 'react-native'
import TitleView from '../../components/TitleView'
import { useNavigation, useFocusEffect } from '@react-navigation/native'
import { RFValue } from 'react-native-responsive-fontsize'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import Header from '../../components/Header'
import { TextInput } from 'react-native-paper'
import { DefaultStyles } from '../../DefaultStyles'
import { DefaultProps } from '../../DefaultProps'
import Edit from '../../assets/iconSvg/edit.svg'
import { utils } from '@react-native-firebase/app';
import storage from '@react-native-firebase/storage';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import AuthController from '../../../controllers/AuthController'
import Trans from '../../../controllers/internatiolization/Trans'
import _ from 'lodash';


function Account(props): JSX.Element {
    const [saving, setSaving] = useState(false);
    const navigation = useNavigation();
    const [loading, setLoading] = useState(false);
    const [loaded, setLoaded] = useState(false);
    const [foto, setFoto] = useState('')
    const [email, setEmail] = useState('')
    const [name, setName] = useState('')
    const [password, setPassword] = useState('')
    const reference = storage().ref('black-t-shirt-sm.png');
    var user;


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
        const result = await launchImageLibrary(options)
        if (result.assets) {
            setFoto(result.assets[0].uri.toString());
            // showToast("Imagem inserida com sucesso!")
            return
        }
    }

    const showToast = (msg) => {
        ToastAndroid.showWithGravity(msg, ToastAndroid.LONG, ToastAndroid.CENTER, 25, 50);
    };


    const pickImageCamera = async () => {
        const options = {
            mediaType: 'photo',
            saveToPhotos: false,
            cameraType: 'front',
            quality: 1
        }
        const result = await launchCamera(options)
        if (result.assets) {
            setFoto(result.assets[0].uri.toString());
            return
        }
    }

    async function saveUser() {
        try {
            const currentAuthUser = auth().currentUser;
            if (currentAuthUser) {
                setSaving(true);
                console.log('currentAuthUser', currentAuthUser);
                let userData = await firestore().collection('Users').where('authUserId', '==', currentAuthUser.uid).get();
                if (userData && userData.docs && userData.docs.length) {
                    await firestore().collection('Users').doc(userData.docs[0].id).update({
                        name: name || null,
                        photo: foto || null
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
        navigation.navigate('SpeedometerModal')
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
                                handleImageUser()
                            }}>
                            {
                                foto ?
                                    <Image
                                        style={{ height: RFValue(130), width: RFValue(130), borderRadius: RFValue(75), borderWidth: 2, borderColor: DefaultStyles.colors.tabBar }}
                                        resizeMode="cover"
                                        source={{ uri: foto }}
                                    /> :
                                    <Image
                                        style={{ height: 100, width: 100 }}
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
                        <Button
                            title='btn'
                            onPress={async () => {
                                // path to existing file on filesystem
                                const pathToFile = `${utils.FilePath.PICTURES_DIRECTORY}/black-t-shirt-sm.png`;
                                console.log(pathToFile)
                                console.log('pathToFile')
                                // uploads file
                                await reference.putFile(pathToFile);
                                console.log('Button')
                            }}
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