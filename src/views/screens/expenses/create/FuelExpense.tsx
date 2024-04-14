import React, { useRef, useState, useEffect } from 'react'
import { View, StyleSheet, Alert, Dimensions, ScrollView } from 'react-native'
import { RFValue } from "react-native-responsive-fontsize";
import TitleView from '../../../components/TitleView';
import Header from '../../../components/Header';
import ContentContainer from '../../../components/ContentContainer';
import { DefaultStyles } from '../../../DefaultStyles';
import { TextInput } from 'react-native-paper';
import SelectDropdown from 'react-native-select-dropdown';
import { DefaultProps } from '../../../DefaultProps';
import SelectVehicle from '../../../components/vehicles/SelectVehicle';
import Vehicles from '../../../../database/models/Vehicles';
import DateComponent from '../../../components/expenses/DateComponent';
import InputKM from '../../../components/vehicles/InputKM';
import Establishment from '../../../components/expenses/Establishment';
import Observations from '../../../components/expenses/Observations';
import Utils from '../../../../controllers/Utils';
import { useNavigation } from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import AuthController from '../../../../controllers/AuthController';
const { width, height } = Dimensions.get('window')


/******************************************************
** COMPONENTE DA VIEW PRINCIPAL                      **
******************************************************/
function FuelExpense(props): JSX.Element {
    //default properties
    const currentExpenseId = (props?.route?.params || props?.params || {})?.expenseId || null;    
    const [loading,setLoading] = useState(false);
    const [loaded,setLoaded] = useState(false);          
    const [currentExpense,setCurrentExpense] = useState(null);    
    const [idVehicle,setIdVehicle] = useState(null);
    const [selectedVehicle, setSelectedVehicle] = useState(null);
    const [date, setDate] = useState(null);
    const [km, setKM] = useState(null);
    const [establishment, setEstablishment] = useState(null);
    const [isEnabledEstablishment, setIsEnabledEstablishment] = useState(false);
    const [observations, setObservations] = useState(null);
    const [isEnabledObservations, setIsEnabledObservations] = useState(false);
    const [totalValue, setTotalValue] = useState(0);

    //specific properties
    const listaCombustiveis = ['Álcool', 'Gasolina', 'Diesel']
    const [selectedFuel, setSelectedFuel] = useState(null);
    const [unValue, setUnValue] = useState(0);
    const [liters, setLiters] = useState(0);
    //const navagation = useNavigation();

    useEffect(() => {
        if (currentExpenseId) {
            if (!loading && !loaded && !currentExpense) {
                setLoading(true);

                //load expense data
                (async () => {
                    try {
                        console.log('loading expense...');
                        let newExpense = await firestore().collection('Expenses').doc(currentExpenseId).get();
                        if (newExpense && newExpense.id) {
                            newExpense = {
                                id:newExpense.id,
                                ...newExpense.data()
                            }
                            if (newExpense?.date) {
                                newExpense.date = new Date(newExpense.date.seconds * 1000 + newExpense.date.nanoseconds / 1000000);
                            }
                        } else {
                            newExpense = null;
                        }                        
                                               

                        //default properties
                        setCurrentExpense(newExpense);
                        setIdVehicle(newExpense.idVehicle||null);
                        setDate(newExpense.date||null);
                        setKM(newExpense.actualkm||null);
                        setEstablishment(newExpense.establishment||null);
                        setIsEnabledEstablishment(newExpense.establishment?true:false);
                        setObservations(newExpense.observations||null);
                        setIsEnabledObservations(newExpense.observations?true:false);
                        setTotalValue(newExpense.totalValue||null);

                        //specific properties
                        setUnValue(newExpense.othersdatas.unValue||null);
                        setLiters(newExpense.othersdatas.liters||null);
                        setSelectedFuel(newExpense.othersdatas.fuel||null);

                        console.log('loading expense... ok');
                    } catch (e) {
                        console.log(e);                    
                    } finally {
                        setLoaded(true);
                        setLoading(false);                
                    }
                })();

            }
        } else {
            setDate(new Date());
        }        
    }, [currentExpenseId]);

 
    async function saveExpense() {
        try {
            if (totalValue && date && selectedVehicle && selectedFuel) {

                let newExpense = null;
                if (currentExpenseId) {
                    //update
                    newExpense = await firestore().collection('Expenses').doc(currentExpenseId);
                    await newExpense.update({
                        idVehicle: selectedVehicle?.id || idVehicle,
                        type: 'FUEL',
                        date: date,
                        actualkm: km,
                        totalValue: totalValue,
                        establishment: establishment,
                        observations: observations,
                        othersdatas: {
                            fuel: selectedFuel,
                            unValue: unValue,
                            liters: liters
                        }
                    });                    
                } else {
                    //create
                    newExpense = await firestore().collection('Expenses').add({
                        authUserId: auth().currentUser.uid,
                        idUser: AuthController.getLoggedUser().id,
                        idVehicle: selectedVehicle?.id || idVehicle,
                        type: 'FUEL',
                        date: date,
                        actualkm: km,
                        totalValue: totalValue,
                        establishment: establishment,
                        observations: observations,
                        othersdatas: {
                            fuel: selectedFuel,
                            unValue: unValue,
                            liters: liters
                        }
                    });                    
                }
                newExpense = await newExpense.get();
                console.log(newExpense);                
                Alert.alert("Salvo", "Dados Salvos com Sucesso", [{ "text": "OK", onPress: () => goBack(), style: "ok" }]);
            } else {
                Alert.alert("Faltam dados essenciais");
            }
        } catch (e) {
            Utils.showError(e);
        }
    }

    //pressionado Cancelar do Header, volta o velocimetro
    goBack = () => {
        props.navigation.goBack(null);
    };


    return (
        <View style={style.container}>
            <Header withButtons={true} onPressConclude={saveExpense} onPressCancel={goBack} />
            <View style={style.espacoCentral}>
                <TitleView title=' Despesa Combustível' />

                <ContentContainer >
                    <ScrollView>
                        {/* SELECIONE VEICULO (Caso tenha mais que 1 veiculo) */}
                        <SelectVehicle selectedId={idVehicle} setSelected={setSelectedVehicle} />

                        {/* DATE INPUT */}
                        <DateComponent date={date} setDate={setDate} />

                        {/* QUILOMETRAGEM ATUAL */}
                        <InputKM km={km} setKM={setKM} />

                        {/* FUEL */}                        
                        {/* dropdown: usado para selecionar o ano e atualizar o txtinput */}
                        <SelectDropdown
                            {...DefaultProps.selectDropdown}
                            data={listaCombustiveis}
                            label="Combustível"
                            onSelect={(selectedItem, index) => {
                                setSelectedFuel(selectedItem);
                            }}
                            buttonTextAfterSelection={(selectedItem, index) => {
                                return (
                                    selectedFuel
                                        ? (selectedItem ? selectedItem.toString() : null)
                                        : null
                                );
                            }}
                            rowTextForSelection={(item, index) => {
                                return item.toString();
                            }}
                            defaultButtonText={selectedFuel ? selectedFuel.toString() : ' '}
                        />

                        {/* PREÇO/L, LITRO, VALOR */}
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: width * 0.9, marginTop: RFValue(-10) }}>
                            <TextInput
                                {...DefaultProps.textInput}
                                style={[DefaultStyles.textInput, { width: width * 0.27, marginTop: RFValue(12)  }]}
                                keyboardType='numeric'
                                label='Preço/L'
                                placeholder='R$'
                                placeholderTextColor='#666'
                                //color={DefaultStyles.colors.tabBar}
                                onChangeText={valorunitario => {
                                    if (valorunitario.includes(',')) return
                                    if (valorunitario.includes('-')) return
                                    if (valorunitario.includes(' ')) return
                                    if (valorunitario.includes('/')) return
                                    if (valorunitario.includes('+')) return
                                    if (valorunitario.includes('(')) return
                                    if (valorunitario.includes(')')) return
                                    if (valorunitario.includes('-')) return
                                    if (valorunitario.includes(';')) return
                                    if (valorunitario.includes('#')) return
                                    if (valorunitario.includes('*')) return
                                    setUnValue(Utils.toNumber(valorunitario));
                                    setTotalValue(Utils.toNumber(liters) * Utils.toNumber(valorunitario));
                                }}
                                value={(unValue || 0).toString()}
                                maxLength={6}
                                search={false}
                            />
                            <TextInput
                                {...DefaultProps.textInput}
                                style={[DefaultStyles.textInput, { marginLeft: RFValue(15), width: width * 0.27 , marginTop: RFValue(12) }]}
                                keyboardType='numeric'
                                label='Litros'
                                onChangeText={litros => {
                                    if (litros.includes(',')) return
                                    if (litros.includes('-')) return
                                    if (litros.includes(' ')) return
                                    if (litros.includes('/')) return
                                    if (litros.includes('+')) return
                                    if (litros.includes('(')) return
                                    if (litros.includes(')')) return
                                    if (litros.includes('-')) return
                                    if (litros.includes(';')) return
                                    if (litros.includes('#')) return
                                    if (litros.includes('*')) return

                                    setLiters(Utils.toNumber(litros));
                                    setTotalValue(Utils.toNumber(litros) * Utils.toNumber(unValue));
                                }}
                                value={(liters || 0).toString()}
                                maxLength={3}
                                search={false}
                            />

                            <TextInput
                                {...DefaultProps.textInput}
                                style={[DefaultStyles.textInput, { marginLeft: RFValue(15), width: width * 0.27, marginTop: RFValue(12) }]}
                                keyboardType='numeric'
                                label='Valor'
                                placeholder='R$'

                                placeholderTextColor='#666'
                                onChangeText={totalValue => setTotalValue(totalValue)}
                                maxLength={7}
                                value={(totalValue || 0).toString()}
                                search={false}
                            />

                        </View>
                        <Establishment
                            isEnabled={isEnabledEstablishment}
                            establishment={establishment}
                            setIsEnabled={setIsEnabledEstablishment}
                            setEstablishment={setEstablishment}
                        />

                        <Observations
                            isEnabled={isEnabledObservations}
                            observations={observations}
                            setIsEnabled={setIsEnabledObservations}
                            setObservations={setObservations}
                        />
                    </ScrollView>
                </ContentContainer>
            </View >
        </View>
    );
};

const style = StyleSheet.create({
    container: {
        backgroundColor: '#202D46',
        flex: 1,
    },
    espacoCentral: {
        backgroundColor: 'black',
        flex: 9,
        justifyContent: 'center',
        alignItems: 'center'
    },
    input: {
        width: "100%",
        backgroundColor: DefaultStyles.colors.fundoInput,
        height: height / 14,
        marginBottom: RFValue(15),
        borderRadius: RFValue(5),
        color: DefaultStyles.colors.tabBar,
        fontSize: RFValue(20),
        alignSelf: 'center',
        justifyContent: 'center',

    },
    viewExpense: {
        flex: 1,
        width: width * 0.9,
        alignItems: 'center',
    },

});

export default FuelExpense;