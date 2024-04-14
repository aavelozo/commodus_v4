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


                    let models = [];
                    const newModelsCollection = await firestore().collection('Models').get();
                    if (newModelsCollection && newModelsCollection.size > 0) {
                        newModelsCollection.forEach(documentSnapshot => {                                
                            models.push({
                                id: documentSnapshot.id,
                                ...documentSnapshot.data()
                            });
                        });    
                    }
                    
                    models = _.keyBy(models, 'id');
                    console.log('antes');
                    const newVehiclesCollection = await firestore().collection('Vehicles').where('idUser', '==', AuthController.getLoggedUser().id).get();
                    console.log('depois');
                    console.log('loading vehicles... ok');
                    let newVehicles = [];
                    newVehiclesCollection.forEach(el => {
                        newVehicles.push({
                            id: el.id,
                            ...el.data(),
                            vehicleName: `${models[el.data().idModel].name}-${el.data().plate}`
                        });
                    });
                    setVehicles(newVehicles);
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
    return <>
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
                            EditVehicleController.editingVehicle = null; //limpa o veiculo em edicao, se existir;
                            navigation.navigate('EditVehicle');
                        }}>
                        <Icon name='plus' size={RFValue(35)} color={DefaultStyles.colors.botao} />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    </>;
    return (
        <>
            <Header />
            <View style={style.title}>
                <TitleView title='Veículos' />
                <View style={style.espacoCentral}>
                    <View style={{ flex: 1, alignItems: 'center', paddingTop: RFValue(30) }}>
                        {/* Lista com os veículos cadastrados */}
                        {loading 
                            ? <Loading />
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
                                EditVehicleController.editingVehicle = null; //limpa o veiculo em edicao, se existir;
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


