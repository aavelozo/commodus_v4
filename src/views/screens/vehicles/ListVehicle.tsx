import { useNavigation, useFocusEffect } from '@react-navigation/native'
import React, { useEffect, useState, useCallback } from 'react'
import { View, StyleSheet, TouchableOpacity, Dimensions, FlatList, Text } from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome'
import Empty from '../../assets/iconSvg/empty.svg'
import { DefaultStyles } from '../../DefaultStyles';
import Vehicles from '../../../database/models/Vehicles';
import Header from '../../components/Header';
import CardRegisteredVehicle from '../../components/CardRegisteredVehicle';
import TitleView from '../../components/TitleView';
import EditVehicleController from '../../../controllers/EditVehicleController';
import { RFValue } from 'react-native-responsive-fontsize';
import firestore from '@react-native-firebase/firestore';
import AuthController from '../../../controllers/AuthController'
import Models from '../../../database/models/Models';
import _ from "lodash";
import { Loading } from '../Loading'
import { ActivityIndicator } from 'react-native-paper'
import { setCurrentVehicle } from './EditVehicle'
const { height } = Dimensions.get('window');

function ListVehicle(props: React.PropsWithChildren): JSX.Element {
    const navigation = useNavigation();
    const [loading, setLoading] = useState(false);
    const [loaded, setLoaded] = useState(false);
    const [vehicles, setVehicles] = useState([]);

    //carregamento dos dados do banco
    useFocusEffect(useCallback(() => {
        if (!loading && !loaded) {
            setLoading(true);
            (async () => {
                try {
                    console.log('loading vehicles...');                    
                    const newVehiclesCollection = await AuthController.getLoggedUser().ref.collection('vehicles').get();
                    newVehicles = newVehiclesCollection.docs;
                    setVehicles(newVehicles);
                    console.log('loading vehicles... ok size',newVehicles.length); 
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
                <TitleView title='Veículos' />
                <View style={style.espacoCentral}>
                    <View style={{ flex: 1, alignItems: 'center', paddingTop: RFValue(30) }}>
                        {/* Lista com os veículos cadastrados */}
                        {loading 
                            ? <View 
                                style={{ 
                                    width:'100%', 
                                    height:'100%',                
                                    alignItems: 'center', 
                                    justifyContent: 'center',
                                    flex: 1
                                }} >
                                <ActivityIndicator size={'large'}/>
                            </View>
                            : vehicles?.length > 0 ?
                                <FlatList
                                    // keyExtractor={ => car.id.toString()}
                                    data={vehicles}
                                    renderItem={getCars}
                                    showsVerticalScrollIndicator={false}
                                />
                                : <View style={{ height: '100%', justifyContent: 'center', alignItems: 'center', width: '100%', paddingHorizontal: RFValue(30) }}>
                                    {/* <Empty width={RFValue(150)} height={RFValue(150)} fill={DefaultStyles.colors.tabBar} /> */}
                                    <Text style={style.info}>Não há veículo cadastrado. </Text>
                                    <Text style={style.info}>Clique em adicionar e cadastre seu primeiro veículo.</Text>
                                </View>
                        }
                    </View>

                    {/* BOTÃO ACRESCENTAR NOVO VEICULO */}
                    <View style={style.buttonNewCar} >
                        <TouchableOpacity
                            onPress={() => {
                                setCurrentVehicle(null);
                                navigation.navigate('EditVehicle');
                            }}>
                            <Icon name='plus' size={RFValue(35)} color={DefaultStyles.colors.botao} />
                        </TouchableOpacity>
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
        fontSize: RFValue(16),
        textAlign: 'center',
        color: '#000'
    }
});

export default ListVehicle;


