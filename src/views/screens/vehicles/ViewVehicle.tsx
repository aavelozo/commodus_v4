import { useNavigation } from '@react-navigation/native'
import React, { useEffect, useState } from 'react'
import { Text, View, StyleSheet, TouchableOpacity, Dimensions, Image } from 'react-native'
import EvilIcons from 'react-native-vector-icons/Feather'
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
import EditVehicleController from '../../../controllers/EditVehicleController'
import Vehicles from '../../../database/models/Vehicles';
import firestore from '@react-native-firebase/firestore';
import { Svg, Path, SvgUri } from 'react-native-svg';
import Brands from '../../../database/models/Brands'
import Models from '../../../database/models/Models'

const { width, height } = Dimensions.get('window')

function ViewVehicle(props: React.PropsWithChildren): JSX.Element {
    const navigation = useNavigation();
    const [loading,setLoading] = useState(false);
    const [loaded,setLoaded] = useState(false);
    const [idVehicle,setIdVehicle] = useState(null);
    const [vehicle,setVehicle] = useState(null);
    const [brand,setBrand] = useState(null);
    const [model,setModel] = useState(null);

    useEffect(()=>{
        if (!loading && !loaded) {
            setLoading(true);
            (async () => {
                try {
                    //load vehicle
                    let newIdvehicle : string | null = ((props?.route || {}).params || {}).idVehicle || props?.idVehicle || null; 
                    console.log('idVehicle',newIdvehicle);
                    setIdVehicle(newIdvehicle);
                    let newVehicle = ((props?.route || {}).params || {}).vehicle || props?.vehicle || null; 
                    if (newIdvehicle) {
                        if (!newVehicle) {
                            newVehicle = await firestore().collection('Vehicles').doc(newIdvehicle).get();    
                            newVehicle = {
                                id:newVehicle.id,
                                ...newVehicle.data()
                            };                                                    
                        }                                                 
                    }
                    setVehicle(newVehicle);
                    if (newVehicle) {
                        if (newVehicle.idBrand) {
                            let newBrand : any = Brands.data?.find(el=>el.id == newVehicle.idBrand);
                            console.log('newBrand 1 ',newBrand);
                            if (!newBrand) {
                                newBrand = await firestore().collection('Brands').doc(newVehicle.idBrand).get();
                                console.log('newBrand 2 ',newBrand);
                                setBrand(newBrand.data());
                            } else {
                                setBrand(newBrand);
                            }
                            
                        }

                        if (newVehicle.idModel) {
                            let newModel : any = Models.data?.find(el=>el.id == newVehicle.idModel);
                            console.log("newModel0",newModel);
                            if (!newModel) {
                                newModel = await firestore().collection('Models').doc(newVehicle.idModel).get();
                                console.log("newModel1",newModel);
                                setModel(newModel.data());
                            } else {
                                setModel(newModel);
                            }                                
                        }
                    }                    

                } catch (e) {
                    console.log(e);                    
                } finally {
                    setLoaded(true);
                    setLoading(false);                
                }
            })();
        }
    },[navigation]);

    return (
        <View style={style.container}>
            <Header />
            <View style={style.title}>
                <TitleView title={'Dados do veículo'} />

                <View style={style.espacoCentral}>
                    {
                        // Caso tenha a foto, renderiza a foto. Se não, ícone.
                        vehicle?.photo ?
                            <Image
                                style={{ width: width, height: height * 0.27, alignSelf: 'center', borderTopLeftRadius: RFValue(25) }}
                                resizeMethod='auto'
                                source={{ uri: vehicle?.photo }}
                            /> :
                            <Fontisto name='car' size={RFValue(80)} color={DefaultStyles.colors.tabBar} style={{ marginTop: RFValue(20) }} />

                    }
                    <View style={style.info}>
                        {/* Motor */}
                        <Text style={[style.text, { alignSelf: 'center', fontSize: RFValue(24), marginBottom: RFValue(20) }]}>{`${brand?.name} ${model?.name}`}</Text>
                        <View style={style.viewEachInfo}>
                            <View style={style.viewIcon}>
                                <Engine width={RFValue(30)} height={RFValue(30)} fill={DefaultStyles.colors.tabBar} />
                            </View>
                            <Text style={[style.text, style.textBold]}>Motor: </Text>
                            <Text style={style.text}>{Vehicles.ENGINES_TYPES[vehicle?.idEngineType || 0]}</Text>
                        </View>
                        {/* Km */}
                        <View style={style.viewEachInfo}>
                            <View style={style.viewIcon}>
                                <Velo width={RFValue(30)} height={RFValue(30)} fill={DefaultStyles.colors.tabBar} />

                            </View>
                            <Text style={[style.text, style.textBold]}>Quilometragem: </Text>
                            <Text style={style.text}>{vehicle?.km}</Text>
                        </View>
                        {/* Ano */}
                        <View style={style.viewEachInfo}>
                            <View style={style.viewIcon}>
                                <FontAwesome name='calendar' size={RFValue(22)} color={DefaultStyles.colors.tabBar} />
                            </View>
                            <Text style={[style.text, style.textBold]}>Ano: </Text>
                            <Text style={style.text}>{vehicle?.year}</Text>
                        </View>
                        {/* Combustivel */}
                        <View style={style.viewEachInfo}>
                            <View style={style.viewIcon}>
                                <Fuel width={RFValue(30)} height={RFValue(22)} fill={DefaultStyles.colors.tabBar} />
                            </View>
                            <Text style={[style.text, style.textBold]}>Combustível: </Text>
                            <Text adjustsFontSizeToFit numberOfLines={1} style={style.text}>{vehicle?.preferedFuel}</Text>
                        </View>
                        {/* Cor */}
                        {vehicle?.color ?
                            <View style={style.viewEachInfo}>
                                <View style={style.viewIcon}>
                                    <Palete width={RFValue(30)} height={RFValue(22)} fill={DefaultStyles.colors.tabBar} />
                                </View>
                                <Text style={[style.text, style.textBold]}>Cor: </Text>
                                <Text numberOfLines={1} adjustsFontSizeToFit style={style.text}>{vehicle?.color}</Text>
                            </View> : false
                        }

                        {/* Placa */}
                        <View style={style.viewEachInfo}>
                            <View style={style.viewIcon}>
                                <Plate width={RFValue(30)} height={RFValue(35)} fill={DefaultStyles.colors.tabBar} />
                            </View>
                            <Text style={[style.text, style.textBold]}>Placa: </Text>
                            <Text style={style.text}>{vehicle?.plate}</Text>
                        </View>

                    </View>
                    <View style={style.buttonEditVehicle}>
                        {/* Ao clicar, edita o veículo com os dados já preenchidos nos seus respectivos campos. */}
                        <TouchableOpacity
                            onPress={() => {
                                navigation.navigate('EditVehicle', { idVehicle: idVehicle });
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

export default ViewVehicle;


