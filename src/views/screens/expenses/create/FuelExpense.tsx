import React, { useRef, useState, useEffect, useCallback } from 'react'
import { View, StyleSheet, Alert, Dimensions, ScrollView } from 'react-native'
import { RFValue } from "react-native-responsive-fontsize";
import TitleView from '../../../components/TitleView';
import Header from '../../../components/Header';
import ContentContainer from '../../../components/ContentContainer';
import { DefaultStyles } from '../../../DefaultStyles';
import { Text, TextInput } from 'react-native-paper';
import SelectDropdown from 'react-native-select-dropdown';
import { DefaultProps } from '../../../DefaultProps';
import SelectVehicle from '../../../components/vehicles/SelectVehicle';
import Vehicles from '../../../../database/models/Vehicles';
import DateComponent from '../../../components/expenses/DateComponent';
import InputKM from '../../../components/vehicles/InputKM';
import Establishment from '../../../components/expenses/Establishment';
import Observations from '../../../components/expenses/Observations';
import Utils from '../../../../controllers/Utils';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import AuthController from '../../../../controllers/AuthController';
import EditExpenseController from '../../../../controllers/EditExpenseController';
const { width, height } = Dimensions.get('window')




/******************************************************
** COMPONENTE DA VIEW PRINCIPAL                      **
******************************************************/
function FuelExpense(props): JSX.Element {
    //default properties
    const [loading,setLoading] = useState(false);
    const [loaded,setLoaded] = useState(false);          
    const [currentExpense,setCurrentExpense] = useState(EditExpenseController.currentExpense);    
    const [idVehicle,setIdVehicle] = useState(null);
    const [selectedVehicle, setSelectedVehicle] = useState(null);
    const [date, setDate] = useState(null);
    const [km, setKM] = useState('');
    const [establishment, setEstablishment] = useState('');
    const [isEnabledEstablishment, setIsEnabledEstablishment] = useState(false);
    const [observations, setObservations] = useState('');
    const [isEnabledObservations, setIsEnabledObservations] = useState(false);
    const [totalValue, setTotalValue] = useState(0);

    //specific properties
    const listaCombustiveis = ['Álcool', 'Gasolina', 'Diesel']
    const [selectedFuel, setSelectedFuel] = useState(null);
    const [unValue, setUnValue] = useState(0);
    const [liters, setLiters] = useState(0);
    //const navagation = useNavigation();

    useFocusEffect(useCallback(() => {
        if (!loading && !loaded && !currentExpense) {
            setLoading(true);

            //load expense data
            (async () => {
                try {
                    console.log('loading expense...');
                                        
                    if (EditExpenseController.currentExpense) {              
                        //default properties
                        setIdVehicle(EditExpenseController.currentExpense.parent.parent.id||null);
                        setDate(EditExpenseController.currentExpense.data().date||null);
                        setKM(EditExpenseController.currentExpense.data().actualkm||null);
                        setEstablishment(EditExpenseController.currentExpense.data().establishment||null);
                        setIsEnabledEstablishment(EditExpenseController.currentExpense.data().establishment?true:false);
                        setObservations(EditExpenseController.currentExpense.data().observations||null);
                        setIsEnabledObservations(EditExpenseController.currentExpense.data().observations?true:false);
                        setTotalValue(EditExpenseController.currentExpense.data().totalValue||null);

                        //specific properties
                        setUnValue(EditExpenseController.currentExpense.data().othersdatas.unValue||null);
                        setLiters(EditExpenseController.currentExpense.data().othersdatas.liters||null);
                        setSelectedFuel(EditExpenseController.currentExpense.data().othersdatas.fuel||null);
                    } else {
                        setDate(new Date());
                    }

                    console.log('loading expense... ok');
                } catch (e) {
                    console.log(e);                    
                } finally {
                    setLoaded(true);
                    setLoading(false);                
                }
            })();
        }          
    }, []));

 
    async function saveExpense() {
        try {
            if (totalValue && date && selectedVehicle && selectedFuel) {                
                let vehicle = await AuthController.getLoggedUser().ref.collection('vehicles').doc(idVehicle).get();
                if (currentExpense) {
                    //update                    
                    await currentExpense.update({
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
                    let newExpense = await vehicle.ref.collection('expenses').add({
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
                            dropdownStyle={DefaultStyles.dropdownMenuStyle}
                            search={true}
                            showsVerticalScrollIndicator={true}                            
                            data={listaCombustiveis}
                            defaultValue={selectedFuel}
                            renderButton={(selectedItem, isOpened) => {
                                return (
                                    <View>
                                        <TextInput
                                            {...DefaultProps.textInput}
                                            style={DefaultStyles.textInput}
                                            label='Combustível'
                                            value={selectedItem}
                                            pointerEvents="none"
                                            readOnly
                                        />
                                    </View>
                                );
                            }}
                            renderItem={(item, index, isSelected) => {
                                return (<View style={{...DefaultStyles.dropdownTextView, ...(isSelected && {backgroundColor: '#D2D9DF'})}}>
                                        <Text style={DefaultStyles.dropdownText}>{item}</Text>
                                </View>);
                            }}
                            onSelect={(selectedItem, index) => {
                                setSelectedFuel(selectedItem);
                            }}
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

export {FuelExpense};