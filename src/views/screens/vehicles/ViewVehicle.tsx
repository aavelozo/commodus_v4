import { useFocusEffect, useNavigation } from '@react-navigation/native'
import React, { useCallback, useEffect, useState } from 'react'
import { Text, View, StyleSheet, TouchableOpacity, Dimensions, Image } from 'react-native'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import Fontisto from 'react-native-vector-icons/Fontisto'
import Velo from '../../assets/iconSvg/velo.svg'
import Engine from '../../assets/iconSvg/engine.svg'
import Fuel from '../../assets/iconSvg/fuel.svg'
import Palete from '../../assets/iconSvg/palete.svg'
import Edit from '../../assets/iconSvg/edit.svg'
import Plate from '../../assets/iconSvg/plate.svg'
import { RFValue } from "react-native-responsive-fontsize";
import TitleView from '../../components/TitleView';
import { DefaultStyles } from '../../DefaultStyles'
import Header from '../../components/Header'
import Vehicles from '../../../database/models/Vehicles';
import { setCurrentVehicle } from './EditVehicle'
import Trans from '../../../controllers/internatiolization/Trans'
import _ from 'lodash'
import Utils from '../../../controllers/Utils'


const { width, height } = Dimensions.get('window');

let currentViewVehicle;
function setCurrentViewVehicle(newCurrentViewVehicle) {
    currentViewVehicle = newCurrentViewVehicle;
}

function ViewVehicle(props): JSX.Element {
    const navigation = useNavigation();
    const [vehicle, setVehicle] = useState(null);

    useFocusEffect(useCallback(() => {
        setVehicle(currentViewVehicle);
        console.log(currentViewVehicle.data().idEngineType)
    }, [props.navigation]));

    return (
        <View style={style.container}>
            <Header />
            <View style={style.title}>
                <TitleView title={_.capitalize(Trans.t('vehicle data'))} />

                <View style={style.espacoCentral}>
                    {
                        // Caso tenha a foto, renderiza a foto. Se não, ícone.
                        vehicle?.data().photo ?
                            <Image
                                style={{ width: width, height: height * 0.27, alignSelf: 'center', borderTopLeftRadius: RFValue(25) }}
                                resizeMethod='auto'
                                source={{ uri: vehicle?.data().photo }}
                            /> :
                            <Fontisto name='car' size={RFValue(80)} color={DefaultStyles.colors.tabBar} style={{ marginTop: RFValue(20) }} />

                    }
                    <View style={style.info}>
                        {/* Motor */}
                        <Text style={[style.text, { alignSelf: 'center', fontSize: RFValue(24), marginBottom: RFValue(20) }]}>{`${vehicle?.data().model.parent.parent.id} ${vehicle?.data().model?.id}`}</Text>
                        <View style={style.viewEachInfo}>
                            <View style={style.viewIcon}>
                                <Engine width={RFValue(30)} height={RFValue(30)} fill={DefaultStyles.colors.tabBar} />
                            </View>
                            <Text style={[style.text, style.textBold]}>Motor: </Text>
                            <Text style={style.text}>{_.capitalize(Trans.t(Vehicles.ENGINES_TYPES[vehicle?.data().idEngineType || 0]))}</Text>
                        </View>
                        {/* Km */}
                        <View style={style.viewEachInfo}>
                            <View style={style.viewIcon}>
                                <Velo width={RFValue(30)} height={RFValue(30)} fill={DefaultStyles.colors.tabBar} />

                            </View>
                            <Text style={[style.text, style.textBold]}>{_.capitalize(Trans.t('mileage'))}: </Text>
                            <Text style={style.text}>{Utils.hasValue(vehicle?.data()?.km) ? Utils.toNumber(vehicle?.data()?.km).toLocaleString({maximumFractionDigits:2}) : ''}</Text>
                        </View>
                        {/* Ano */}
                        <View style={style.viewEachInfo}>
                            <View style={style.viewIcon}>
                                <FontAwesome name='calendar' size={RFValue(22)} color={DefaultStyles.colors.tabBar} />
                            </View>
                            <Text style={[style.text, style.textBold]}>{_.capitalize(Trans.t('year'))}: </Text>
                            <Text style={style.text}>{vehicle?.data().year}</Text>
                        </View>
                        {/* Combustivel */}
                        {vehicle?.data().preferedFuel ?
                            <View style={style.viewEachInfo}>
                                <View style={style.viewIcon}>
                                    <Fuel width={RFValue(30)} height={RFValue(22)} fill={DefaultStyles.colors.tabBar} />
                                </View>
                                <Text style={[style.text, style.textBold]}>{_.capitalize(Trans.t('fuel'))}: </Text>
                                <Text adjustsFontSizeToFit numberOfLines={1} style={style.text}>{_.capitalize(Trans.t(vehicle?.data().preferedFuel))}</Text>
                            </View> : false
                        }

                        {/* Cor */}
                        {vehicle?.data().color ?
                            <View style={style.viewEachInfo}>
                                <View style={style.viewIcon}>
                                    <Palete width={RFValue(30)} height={RFValue(22)} fill={DefaultStyles.colors.tabBar} />
                                </View>
                                <Text style={[style.text, style.textBold]}>{_.capitalize(Trans.t('color'))}: </Text>
                                <Text numberOfLines={1} adjustsFontSizeToFit style={style.text}>{vehicle?.data().color}</Text>
                            </View> : false
                        }

                        {/* Placa */}
                        <View style={style.viewEachInfo}>
                            <View style={style.viewIcon}>
                                <Plate width={RFValue(30)} height={RFValue(35)} fill={DefaultStyles.colors.tabBar} />
                            </View>
                            <Text style={[style.text, style.textBold]}>{_.capitalize(Trans.t('plate'))}: </Text>
                            <Text style={style.text}>{vehicle?.data().plate}</Text>
                        </View>

                    </View>
                    <View style={style.buttonEditVehicle}>
                        {/* Ao clicar, edita o veículo com os dados já preenchidos nos seus respectivos campos. */}
                        <TouchableOpacity
                            onPress={() => {
                                setCurrentVehicle(vehicle);
                                navigation.navigate('EditVehicle');
                            }}
                        >
                            <Edit width={RFValue(50)} height={RFValue(50)} />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </View >
    )
}

const style = StyleSheet.create({
    container: {
        backgroundColor: DefaultStyles.colors.fundo,
        flex: 1,
    },
    espacoCentral: {
        backgroundColor: DefaultStyles.colors.fundo,
        flex: 1,
        alignItems: 'center',
        borderTopLeftRadius: RFValue(25),
        width: '100%',
    },
    info: {
        marginTop: RFValue(10),
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        borderRadius: RFValue(10),
        width: '95%',
        paddingLeft: RFValue(20),
        paddingVertical: RFValue(10),
        backgroundColor: DefaultStyles.colors.fundo,
        marginBottom: RFValue(15)
    },
    buttonEditVehicle: {
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        bottom: RFValue(15),
        right: RFValue(15)
    },
    title: {
        flex: 9,
        backgroundColor: DefaultStyles.colors.tabBar,
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'verdana'
    },
    text: {
        color: DefaultStyles.colors.tabBar,
        fontSize: RFValue(17),
        marginBottom: RFValue(5),
        fontFamily: 'verdana'
    },
    textBold: {
        fontFamily: 'verdanab',
        marginLeft: RFValue(10),
    },
    viewIcon: {
        width: width * 0.11,
        alignItems: 'center',
    },
    viewEachInfo: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        width: '100%',
        marginTop: RFValue(5)
    }
});

export { ViewVehicle, setCurrentViewVehicle };


