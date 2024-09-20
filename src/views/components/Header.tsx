import React, { useState, useEffect } from 'react'
import { View, Text, Image, Dimensions, StyleSheet, TouchableWithoutFeedback, Modal, TouchableOpacity } from 'react-native'
import { RFValue } from 'react-native-responsive-fontsize'
import { DefaultStyles } from '../DefaultStyles'
import ButtonCancel from './ButtonCancel'
import ButtonConclude from './ButtonConclude'
import Icon from 'react-native-vector-icons/FontAwesome'
import FeatherIcon from 'react-native-vector-icons/Feather'
import Fontisto from 'react-native-vector-icons/Fontisto'
import { CommonActions, useNavigation } from '@react-navigation/native'
import auth from '@react-native-firebase/auth';
import Brands from '../../database/models/Brands'
import Vehicles from '../../database/models/Vehicles'
import firestore from '@react-native-firebase/firestore'
import Trans from '../../controllers/internatiolization/Trans'
import AuthController from '../../controllers/AuthController'
import _ from 'lodash';

function Header(props): JSX.Element {
    const navigation = useNavigation()
    const [visible, setVisible] = useState(false)
    const [user, setUser] = useState(null)
    const showModal = () => setVisible(true)
    const hideModal = () => setVisible(false);
    console.log(visible)

    const styles = props.withButtons ? {
        width: RFValue(RFValue(35)),
        height: RFValue(RFValue(35)),
    } : false

    useEffect(() => {



        const subscriber = firestore()
            .collection('Users')
            .where('authUserId', '==', auth().currentUser?.uid)            
            .onSnapshot(querySnapshot => {
                console.log('User data: ', querySnapshot.docs[0].data());
                setUser(querySnapshot.docs[0].data());
            });
    
        // Stop listening for updates when no longer required
        return () => subscriber();
          
    }, [auth().currentUser?.uid, navigation,visible]);


    const unloggingUser = async () => {
        try {
            await auth().signOut();
            Brands.setDBData(null);
            Vehicles.setDBData(null);
        } catch (e) {
            console.log(e);
        } finally {
            //navigation.navigate('Login');
            navigation.dispatch(
                CommonActions.reset({
                    index: 0,
                    routes: [{name:'Login'}]
                })
            );
        }
    }

    return (
        <View style={style.container}>
            <View style={{ width: '25%', justifyContent: 'center', alignItems: 'flex-start' }}>
                {props.withButtons ?
                    <ButtonCancel onPress={() => props.onPressCancel()} /> :
                    !props.noBars ?
                        <TouchableWithoutFeedback onPress={() => showModal()}>
                            <Icon name="bars" size={30} color={DefaultStyles.colors.tabBar} style={{ marginLeft: RFValue(10) }} />
                        </TouchableWithoutFeedback> : false
                }

            </View>

            <View style={{ width: '50%', justifyContent: 'center', alignItems: 'flex-end', flexDirection: 'row' }}>
                <Image source={require('../assets/logoCommodusEscuro.png')} resizeMode='contain' style={[style.imagem, styles]} />
                {!props.withButtons ?
                    <Text style={style.texto}>COMMODUS</Text> : false}
            </View>

            <View style={{ width: '25%', justifyContent: 'center', alignItems: 'flex-end' }}>
                {props.withButtons
                    ? <ButtonConclude
                        loading={props.saving || props.loading || false}
                        onPress={() => props.onPressConclude()}
                    />
                    : false
                }
            </View>

            <Modal visible={visible} transparent={true}>
                <View style={style.viewModal}>
                    <View style={{ flex: 4, backgroundColor: 'white', height: '100%', borderBottomRightRadius: RFValue(10), borderTopRightRadius: RFValue(10) }}>
                        <View style={{ backgroundColor: '#0E0D13', height: '25%', justifyContent: 'center', alignItems: 'center' }}>
                            {
                                user?.photo ?
                                    <Image
                                        style={{ height: RFValue(100), width: RFValue(100), borderRadius: RFValue(50), borderWidth: 1, borderColor: '#F4F4F4' }}
                                        resizeMode="cover"
                                        source={{ uri: user.photo }}

                                    /> : <Image
                                        style={{ height: RFValue(100), width: RFValue(100) }}
                                        resizeMode="contain"
                                        source={require('../../views/assets/user.png')}
                                    />
                            }
                            <Text adjustsFontSizeToFit style={{ color: '#F4F4F4', fontSize: RFValue(18), marginTop: RFValue(5), fontFamily: 'verdana', }}>{user?.name}</Text>
                            <TouchableOpacity onPress={() => console.log(user)}>
                                <Text adjustsFontSizeToFit style={{ color: '#F4F4F4', fontFamily: 'verdana', }}>{user?.email}</Text>
                            </TouchableOpacity>

                        </View>

                        <View style={{ backgroundColor: '#F4F4F4', height: '75%', borderRadius: RFValue(10), paddingTop: RFValue(10) }}>

                            <View style={style.optionNavigation}>
                                <FeatherIcon name="pie-chart" size={RFValue(30)} color={DefaultStyles.colors.tabBar} />
                                <TouchableWithoutFeedback onPress={() => {
                                    hideModal()
                                    navigation.navigate('Dashboard')
                                }
                                }>
                                    <Text adjustsFontSizeToFit style={style.textDrawer}>{_.capitalize(Trans.t('reports and charts'))}</Text>
                                </TouchableWithoutFeedback>
                            </View>
                            <View style={style.optionNavigation}>
                                <FeatherIcon name="file-text" size={RFValue(30)} color={DefaultStyles.colors.tabBar} />
                                <TouchableWithoutFeedback onPress={() => {
                                    hideModal()
                                    navigation.navigate('ViewExpense')
                                }}>
                                    <Text adjustsFontSizeToFit style={style.textDrawer}>{_.capitalize(Trans.t('expense consult'))}</Text>
                                </TouchableWithoutFeedback>
                            </View>
                            <View style={style.optionNavigation}>
                                <Image source={require('../../views/assets/iconDespesa2.png')} style={{ height: RFValue(30), width: RFValue(30) }} />
                                <TouchableWithoutFeedback onPress={() => {
                                    hideModal()
                                    navigation.navigate('StackIncludeExpense')
                                }}>
                                    <Text adjustsFontSizeToFit style={style.textDrawer}>{_.capitalize(Trans.t('launch new expense'))}</Text>
                                </TouchableWithoutFeedback>
                            </View>
                            <View style={style.optionNavigation}>
                                <Fontisto name="automobile" size={RFValue(30)} color={DefaultStyles.colors.tabBar} />
                                {/* <Image source={require('../../views/assets/car.png')} style={{ height: RFValue(30), width: RFValue(30) }} /> */}
                                <TouchableWithoutFeedback onPress={() => {
                                    hideModal()
                                    navigation.navigate('StackVehicle')
                                }}>
                                    <Text adjustsFontSizeToFit style={style.textDrawer}>{_.capitalize(Trans.t('vehicle edit'))}</Text>
                                </TouchableWithoutFeedback>
                            </View>
                            <View style={style.optionNavigation}>
                                <FeatherIcon name="user" size={RFValue(30)} color={DefaultStyles.colors.tabBar} />
                                <TouchableWithoutFeedback onPress={() => {
                                    hideModal()
                                    navigation.navigate('StackUser')
                                }}>
                                    <Text adjustsFontSizeToFit style={style.textDrawer}>{_.capitalize(Trans.t('change user'))}</Text>
                                </TouchableWithoutFeedback>
                            </View>
                            <View style={[style.optionNavigation, { height: '50%', width: '100%', alignItems: 'flex-end', flexDirection: 'row', paddingBottom: RFValue(15) }]}>

                                <TouchableWithoutFeedback onPress={() => unloggingUser()}>
                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                        <FeatherIcon name="log-out" size={RFValue(30)} color={DefaultStyles.colors.tabBar} />
                                        <Text adjustsFontSizeToFit style={style.textDrawer}>{_.capitalize(Trans.t('logout'))}</Text>
                                    </View>
                                </TouchableWithoutFeedback>


                            </View>
                        </View>

                    </View>
                    <TouchableWithoutFeedback onPress={() => hideModal()}>
                        <View style={{ flex: 2, backgroundColor: 'rgba(0,0,0,0.0)', height: '100%' }} />
                    </TouchableWithoutFeedback>

                </View>

            </Modal>




        </View>
    )
}

const style = StyleSheet.create({
    container: {
        // flex: 1,
        flexDirection: 'row',
        height: Dimensions.get('window').height / 15,
        // alignItems: 'flex-end',
        // justifyContent: 'flex-end',
        backgroundColor: DefaultStyles.colors.fundo
    },
    texto: {
        color: DefaultStyles.colors.tabBar,
        fontSize: RFValue(20),
        fontFamily: 'KronaOne-Regular',
        marginBottom: RFValue(7),
        marginLeft: RFValue(7),
    },
    imagem: {
        width: RFValue(25),
        height: RFValue(25),
        marginBottom: RFValue(6),

    }, buttonConcluir: {
        right: 10,
    },
    buttonCancelar: {
        left: 10,
    },
    textButton: {
        fontSize: 20,
        color: DefaultStyles.colors.tabBar
    },
    viewModal: {
        flex: 1,
        flexDirection: 'row'
    },
    optionNavigation: {
        height: '10%',
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        paddingLeft: RFValue(10)
    },
    textDrawer: {
        marginLeft: RFValue(15),
        fontSize: RFValue(15),
        fontFamily: 'verdana',
        color: DefaultStyles.colors.tabBar
    }
});

export default Header;