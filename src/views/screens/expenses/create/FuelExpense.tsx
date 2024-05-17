import React, { useRef, useState, useCallback } from 'react'
import { View, StyleSheet, Alert, Dimensions, ScrollView } from 'react-native'
import { RFValue } from "react-native-responsive-fontsize";
import TitleView from '../../../components/TitleView';
import Header from '../../../components/Header';
import ContentContainer from '../../../components/ContentContainer';
import { DefaultStyles } from '../../../DefaultStyles';
import { Text, TextInput } from 'react-native-paper';
import SelectDropdown from 'react-native-select-dropdown';
import { DefaultProps } from '../../../DefaultProps';
import DateComponent from '../../../components/expenses/DateComponent';
import InputKM from '../../../components/vehicles/InputKM';
import Establishment from '../../../components/expenses/Establishment';
import Observations from '../../../components/expenses/Observations';
import Utils from '../../../../controllers/Utils';
import { useFocusEffect } from '@react-navigation/native';
import EditExpenseController from '../../../../controllers/EditExpenseController';
import Vehicles from '../../../../database/models/Vehicles';
const { width, height } = Dimensions.get('window')




/******************************************************
** COMPONENTE DA VIEW PRINCIPAL                      **
******************************************************/
function FuelExpense(props): JSX.Element {
    const selectVehicleRef = useRef();
    const selectFuelRef = useRef();
    const [loading,setLoading] = useState(false);    
    const [loaded,setLoaded] = useState(false);   
    const [saving,setSaving] = useState(false); 

    //default properties
    const [currentExpense,setCurrentExpense] = useState(null); 
    const [vehicles, setVehicles] = useState([]);   
    const [selectedVehicle, setSelectedVehicle] = useState(null);
    const [date, setDate] = useState(new Date());
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

    useFocusEffect(useCallback(() => {
        console.log('INIT FuelExpense.useFocusEffect.useCallBack');
        if (!loading && !loaded) {
            setLoading(true);
            (async()=>{
                try {
                    console.log('loading expense...');
                    let newVehicles = await Vehicles.getSingleData();
                    setVehicles(newVehicles);                                        
                    console.log('EditExpenseController.currentExpense',EditExpenseController.currentExpense);
                    if (EditExpenseController.currentExpense) { 
                        console.log('loading states...');             
                        //default properties    
                        setCurrentExpense(EditExpenseController.currentExpense);  
                        let vehicleId = EditExpenseController.currentExpense.ref.parent.parent.id;
                        setSelectedVehicle(newVehicles.find(el=>el.id == vehicleId));
                        console.log('loading states...2');
                        let dataExpense = EditExpenseController.currentExpense.data();
                        //date in firestore is object {"nanoseconds": 743000000, "seconds": 1713185626}
                        if (EditExpenseController.currentExpense.data().date) {
                            setDate(new Date(dataExpense.date.seconds * 1000 + dataExpense.date.nanoseconds / 1000000));
                        } else {
                            setDate(new Date());
                        }                        
                        setKM(dataExpense.actualkm||'');
                        console.log('loading states...2.1');
                        setEstablishment(dataExpense.establishment||'');
                        setIsEnabledEstablishment(dataExpense.establishment?true:false);
                        setObservations(dataExpense.observations||'');
                        console.log('loading states...2.2');
                        setIsEnabledObservations(dataExpense.observations?true:false);
                        setTotalValue(dataExpense.totalValue||0);

                        //specific properties
                        setUnValue(dataExpense.othersdatas.unValue||0);
                        console.log('loading states...2.3');
                        setLiters(dataExpense.othersdatas.liters||0);
                        setSelectedFuel(dataExpense.othersdatas.fuel||null);
                        console.log('loading states...3');
                    } else {
                       clearStates();
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
    }, [props.navigation]));

 
    async function saveExpense() {
        try {
            if (totalValue && date && selectedVehicle && selectedFuel) {      
                setSaving(true);     
                console.log('idVehicle',selectedVehicle.id);
                let vehicle = (await Vehicles.getDBData())?.docs.find(el=>el.id == selectedVehicle.id);
                if (currentExpense) {
                    //update                    
                    await currentExpense.ref.update({
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
        } finally {
            setSaving(false);
        }
    }

    function clearStates(){
        console.log('clearing states ...');
        setCurrentExpense(null);                
        setSelectedVehicle(null);
        setDate(new Date());
        setKM('');
        setEstablishment('');
        setIsEnabledEstablishment(false);
        setObservations('');
        setIsEnabledObservations(false);
        setTotalValue(0);

        //specific properties
        setUnValue(0);
        setLiters(0);
        setSelectedFuel(null);

        if (selectVehicleRef) {
            selectVehicleRef.current?.reset();
        }
        if (selectFuelRef) {
            selectFuelRef.current?.reset();
        }
    }

    //pressionado Cancelar do Header, volta o velocimetro
    goBack = () => {
        EditExpenseController.currentExpense = null;
        clearStates();
        props.navigation.navigate('ViewExpense');
    };


    return (
        <View style={style.container}>
            <Header 
                withButtons={true} 
                onPressConclude={saveExpense} 
                onPressCancel={goBack} 
                saving={saving}
            />
            <View style={style.espacoCentral}>
                <TitleView title=' Despesa Combustível' />

                <ContentContainer >
                    <ScrollView>
                        {/* SELECIONE VEICULO (Caso tenha mais que 1 veiculo) */}                        
                        <SelectDropdown
                            dropdownStyle={DefaultStyles.dropdownMenuStyle}
                            search={true}
                            showsVerticalScrollIndicator={true}                            
                            data={vehicles}
                            defaultValue={selectedVehicle}
                            renderButton={(selectedItem, isOpened) => {
                                return (
                                    <View>
                                        <TextInput
                                            {...DefaultProps.textInput}
                                            style={DefaultStyles.textInput}
                                            label='Veículo'
                                            value={selectedItem ? selectedItem.vehicleName || selectedItem.plate : ''}
                                            pointerEvents="none"
                                            readOnly
                                        />
                                    </View>
                                );
                            }}
                            renderItem={(item, index, isSelected) => {
                                return (<View style={{...DefaultStyles.dropdownTextView, ...(isSelected && {backgroundColor: '#D2D9DF'})}}>
                                        <Text style={DefaultStyles.dropdownText}>{item.vehicleName || item.plate }</Text>
                                </View>);
                            }}
                            onSelect={(selectedItem, index) => {
                                setKM(selectedItem.km)
                                setSelectedVehicle(selectedItem);
                            }}
                            ref={selectVehicleRef}
                        />

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
                            ref={selectFuelRef}
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