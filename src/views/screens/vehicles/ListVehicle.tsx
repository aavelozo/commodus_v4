import { useNavigation, useFocusEffect } from '@react-navigation/native'
import React, { useState, useCallback, useEffect } from 'react'
import { View, StyleSheet, TouchableWithoutFeedback, Dimensions, FlatList, Image } from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome'
import { DefaultStyles } from '../../DefaultStyles';
import Vehicles from '../../../database/models/Vehicles';
import Header from '../../components/Header';
import CardRegisteredVehicle from '../../components/CardRegisteredVehicle';
import TitleView from '../../components/TitleView';
import { RFValue } from 'react-native-responsive-fontsize';
import _ from "lodash";
import Wash from '../../assets/iconSvg/car-wash.svg'
import { ActivityIndicator, Text } from 'react-native-paper'
import { setCurrentVehicle } from './EditVehicle'
import EditExpenseController from '../../../controllers/EditExpenseController'
import Trans from '../../../controllers/internatiolization/Trans';
const { height } = Dimensions.get('window');
import firestore from '@react-native-firebase/firestore'

/**
 * list of vehicles
 * @param props 
 * @returns 
 * @author Bruno
 */
function ListVehicle(props: React.PropsWithChildren): JSX.Element {
    const navigation = useNavigation();
    const [loading, setLoading] = useState(false);
    const [loaded, setLoaded] = useState(false);
    const [vehiclesDisabled, setVehiclesDisabled] = useState(true);
    const [vehicles, setVehicles] = useState([]);
    const [vehiclesNotEnabled, setVehiclesNotEnabled] = useState([]);
    const [msgVehicleDisabled, setMsgVehicleDisabled] = useState('');

    useEffect(() => {
        if (vehiclesDisabled) {
            setMsgVehicleDisabled('Visualizar veículos desativados')
        } else {
            setMsgVehicleDisabled('Esconder veículos desativados')
            setLoading(true);
            (async () => {
                try {
                    console.log('loading vehicles...');
                    const newVehiclesCollection = await Vehicles.getDBData();
                    newVehicles = newVehiclesCollection.docs;
                    const disabledCars = newVehiclesCollection.docs.filter(cars => cars._data.enabled == false)
                    console.log(disabledCars)
                    console.log('disabledCars')
                    setVehiclesNotEnabled(disabledCars)
                    console.log('loading vehicles... ok size', newVehicles.length);
                } catch (e) {
                    console.log(e);
                } finally {
                    setLoaded(true);
                    setLoading(false);
                }
            })();

        }
    }, [vehiclesDisabled])

    //carregamento dos dados do banco
    useFocusEffect(useCallback(() => {
        EditExpenseController.currentExpense = null;
        if (!loading && !loaded) {
            setLoading(true);
            (async () => {
                try {
                    const newVehiclesCollection = await Vehicles.getDBData();
                    newVehicles = newVehiclesCollection.docs;
                    const enabledCars = newVehiclesCollection.docs.filter(cars => cars._data.enabled == true)
                    setVehicles(enabledCars)
                } catch (e) {
                    console.log(e);
                } finally {
                    setLoaded(true);
                    setLoading(false);
                }
            })();
        }
    }, []));
    // função com o componente do card de vehicle cadastrados. Usado no Flatlist
    function getCars({ item, index, separators }) {
        return <CardRegisteredVehicle screen='ViewVehicle' vehicle={item} />
    }

    return (
        <>
            <Header />
            <View style={style.title}>
                <TitleView title={_.capitalize(Trans.t('vehicles'))} />
                <View style={style.espacoCentral}>
                    <View style={{ flex: 1, alignItems: 'center', paddingTop: RFValue(30) }}>
                        {/* Lista com os veículos cadastrados */}
                        {loading
                            ? <View
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    flex: 1
                                }} >
                                <ActivityIndicator size={'large'} />
                            </View>
                            : vehicles?.length > 0 ?
                                <>
                                    <FlatList
                                        // keyExtractor={ => car.id.toString()}
                                        data={vehicles}
                                        renderItem={getCars}
                                        showsVerticalScrollIndicator={false}
                                        ListFooterComponent={
                                            <View style={{ alignSelf: 'center' }}>
                                                <TouchableWithoutFeedback onPress={() => {
                                                    setVehiclesDisabled(!vehiclesDisabled)
                                                }}>
                                                    <Text style={{ textAlign: 'center' }}>{msgVehicleDisabled}</Text>
                                                </TouchableWithoutFeedback>
                                                {!vehiclesDisabled && (
                                                    <View style={{ flex: 1, marginTop: RFValue(15) }}>
                                                        <FlatList
                                                            data={vehiclesNotEnabled}
                                                            renderItem={getCars}
                                                            showsVerticalScrollIndicator={false}
                                                        />
                                                    </View>
                                                )}
                                            </View>
                                        }
                                    />

                                </>

                                :
                                <View style={{ justifyContent: 'center', width: '90%' }}>
                                    <View style={{ flexDirection: 'row', height: '50%', width: '100%', alignItems: 'flex-end' }}>
                                        <Wash width={RFValue(70)} height={RFValue(70)} fill={DefaultStyles.colors.tabBar} />
                                        <View style={{ flexDirection: 'column' }}>
                                            <Text style={style.info}>{Trans.t('info_first_vehicle_register')}</Text>
                                        </View>


                                    </View>
                                    <Image
                                        style={{ height: RFValue(200), width: RFValue(220), alignSelf: 'flex-end' }}
                                        resizeMode="contain"
                                        source={require('../../assets/arrow.png')}
                                    />
                                </View>

                        }
                    </View>

                    {/* BOTÃO ACRESCENTAR NOVO VEICULO */}
                    <View style={style.buttonNewCar} >
                        <TouchableWithoutFeedback
                            onPress={() => {
                                setCurrentVehicle(null);
                                navigation.navigate('EditVehicle');
                            }}>
                            <Icon name='plus' size={RFValue(35)} color={DefaultStyles.colors.botao} />
                        </TouchableWithoutFeedback>
                    </View>
                </View>
            </View>
        </>
    )
}

const style = StyleSheet.create({
    espacoCentral: {
        backgroundColor: DefaultStyles.colors.fundo,
        flex: 1,
        borderTopLeftRadius: RFValue(25),
        width: '100%',
    },
    buttonNewCar: {
        height: height > 700 ? RFValue(height * 0.082) : RFValue(height * 0.099),
        width: height > 700 ? RFValue(height * 0.082) : RFValue(height * 0.099),
        backgroundColor: DefaultStyles.colors.tabBar,
        borderRadius: height > 700 ? RFValue(height * 0.082 / 2) : RFValue(height * 0.099 / 2),
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
    },
    info: {
        fontFamily: 'verdana',
        fontSize: RFValue(18),
        color: '#000',
        marginLeft: RFValue(15),
        maxWidth: '78%',
        textAlign: 'left'
    }
});

export default ListVehicle;


