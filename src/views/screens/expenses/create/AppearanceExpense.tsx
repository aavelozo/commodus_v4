import React, { useState, useRef, useCallback } from 'react'
import { Text, View, StyleSheet, TouchableWithoutFeedback, Alert, Dimensions, ScrollView } from 'react-native'
import { Checkbox, TextInput } from 'react-native-paper';
import { RFValue } from 'react-native-responsive-fontsize';
import Header from '../../../components/Header';
import TitleView from '../../../components/TitleView';
import ContentContainer from '../../../components/ContentContainer';
import Vehicles from '../../../../database/models/Vehicles';
import DateComponent from '../../../components/expenses/DateComponent';
import InputKM from '../../../components/vehicles/InputKM';
import { DefaultProps } from '../../../DefaultProps';
import { DefaultStyles } from '../../../DefaultStyles';
import Utils from '../../../../controllers/Utils';
import Observations from '../../../components/expenses/Observations';
import Establishment from '../../../components/expenses/Establishment';
import SelectDropdown from 'react-native-select-dropdown';
import EditExpenseController from '../../../../controllers/EditExpenseController';
import { useFocusEffect } from '@react-navigation/native';
const { width, height } = Dimensions.get('window')




/******************************************************
** COMPONENTE PRINCIPAL                             **
******************************************************/
function AppearanceExpense(props): JSX.Element {
    const selectVehicleRef = useRef();
    const selectServiceRef = useRef();
    const [loading,setLoading] = useState(false);    
    const [loaded,setLoaded] = useState(false); 
    const [saving,setSaving] = useState(false);

    //default properties
    const [currentExpense,setCurrentExpense] = useState(null);    
    const [vehicles, setVehicles] = useState([]);   
    const [selectedVehicle, setSelectedVehicle] = useState(null);
    const [date, setDate] = useState(null);
    const [km, setKM] = useState(null);
    const [establishment, setEstablishment] = useState(null);
    const [isEnabledEstablishment, setIsEnabledEstablishment] = useState(false);
    const [observations, setObservations] = useState(null);
    const [isEnabledObservations, setIsEnabledObservations] = useState(false);
    const [totalValue, setTotalValue] = useState(0);

    //specific properties
    const [regularWashing, setRegularWashing] = useState(false);
    const [completeWashing, setCompleteWashing] = useState(false);
    const [serviceList, setServiceList] = useState(['Vitrificação de pintura', 'Polimento de faróis', 'Cristalização de pintura', 'Hidratação de couro', 'Limpeza de teto', 'Limpeza de carpete','Limpeza dos bancos','Limpeza das áreas plásticas','Revitalização de pintura','Pintura','Martelinho de ouro','Recuperação de sinistro']);
    const [service, setService] = useState('Outros Serviços');

    useFocusEffect(useCallback(() => {
        console.log('INIT AppearanceExpense.useFocusEffect.useCallBack');
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
                        setEstablishment(dataExpense.establishment||'');
                        setIsEnabledEstablishment(dataExpense.establishment?true:false);
                        setObservations(dataExpense.observations||'');
                        setIsEnabledObservations(dataExpense.observations?true:false);
                        setTotalValue(dataExpense.totalValue||0);

                        //specific properties
                        setRegularWashing(dataExpense.othersdatas.regularWashing ? true : false);
                        setCompleteWashing(dataExpense.othersdatas.completeWashing ? true : false);
                        setService(dataExpense.othersdatas.service||null);
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
            if (totalValue && date && selectedVehicle && regularWashing || completeWashing  ) {
                setSaving(true);
                console.log('idVehicle',selectedVehicle.id);
                let vehicle = (await Vehicles.getDBData())?.docs.find(el=>el.id == selectedVehicle.id);
                if (currentExpense) {
                    //update                    
                    await currentExpense.ref.update({
                        type: 'APPEARANCE',
                        date: date,
                        actualkm: km,
                        totalValue: totalValue,
                        establishment: establishment,
                        observations: observations,
                        othersdatas: {
                            regularWashing: regularWashing ? 'Lavagem normal' : false,
                            completeWashing: completeWashing ? 'Lavagem completa' : false,
                            othersServices: service
                        }
                    });                    
                } else {
                    //create
                    let newExpense = await vehicle.ref.collection('expenses').add({
                        type: 'APPEARANCE',
                        date: date,
                        actualkm: km,
                        totalValue: totalValue,
                        establishment: establishment,
                        observations: observations,
                        othersdatas: {
                            regularWashing: regularWashing ? 'Lavagem normal' : false,
                            completeWashing: completeWashing ? 'Lavagem completa' : false,
                            othersServices: service
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
        console.log('clearing states...');
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
        setRegularWashing(false);
        setCompleteWashing(false);
        setService(null);

        if (selectVehicleRef) {
            selectVehicleRef.current?.reset();
        }
        if (selectServiceRef) {
            selectServiceRef.current?.reset();
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
                <TitleView title='Despesa aparência' />

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
                                setSelectedVehicle(selectedItem);
                                setKM(selectedItem.km)
                            }}
                            ref={selectVehicleRef}
                        />

                        {/* DATE INPUT */}
                        <DateComponent date={date} setDate={setDate} />

                        {/* QUILOMETRAGEM ATUAL */}
                        <InputKM km={km} setKM={setKM} />

                        <View style={style.viewCheckBox}>
                            <Checkbox
                                status={regularWashing ? 'checked' : 'unchecked'}
                                onPress={() => {
                                    setRegularWashing(!regularWashing);
                                }}
                            />
                            <TouchableWithoutFeedback onPress={() => setRegularWashing(!regularWashing)}>
                                <Text style={[style.textCheckBox, { fontSize: DefaultStyles.dimensions.defaultLabelFontSize }]}>Lavagem Normal</Text>
                            </TouchableWithoutFeedback>

                        </View>

                        <View style={style.viewCheckBox}>
                            <Checkbox
                                status={completeWashing ? 'checked' : 'unchecked'}
                                onPress={() => {
                                    setCompleteWashing(!completeWashing);
                                }}
                            />
                            <TouchableWithoutFeedback onPress={() => setCompleteWashing(!completeWashing)}>
                                <Text style={[style.textCheckBox, { fontSize: DefaultStyles.dimensions.defaultLabelFontSize }]}>Lavagem Completa</Text>
                            </TouchableWithoutFeedback>

                        </View>


                        
                        {/* dropdown: usado para selecionar o ano e atualizar o txtinput */}

                        <SelectDropdown
                            dropdownStyle={DefaultStyles.dropdownMenuStyle}
                            search={true}
                            showsVerticalScrollIndicator={true}                            
                            data={serviceList}
                            defaultValue={selectedVehicle}
                            renderButton={(selectedItem, isOpened) => {
                                return (
                                    <View>
                                        <TextInput
                                            {...DefaultProps.textInput}
                                            style={DefaultStyles.textInput}
                                            label='Serviço'
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
                                setService(selectedItem);
                            }}
                            ref={selectServiceRef}
                        />
                       
                        {/* PREÇO TOTAL */}
                        <TextInput
                            {...DefaultProps.textInput}
                            style={DefaultStyles.textInput}
                            keyboardType='numeric'
                            label='Preço Total'
                            onChangeText={value => setTotalValue(Utils.toNumber(value))}
                            value={totalValue.toString()}
                        />

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
}

const style = StyleSheet.create({
    container: {
        backgroundColor: '#202D46',
        flex: 1,
        overflow: "scroll"
    },
    espacoCentral: {
        backgroundColor: 'black',
        flex: 9,
        justifyContent: 'center',
        alignItems: 'center'
    },
    lancamento: {
        backgroundColor: DefaultStyles.colors.fundo,
        flex: 1,
        alignItems: 'center',
        borderTopLeftRadius: RFValue(25),
        padding: RFValue(10),
        width: '100%',
    },
    input: {
        width: "100%",
        backgroundColor: DefaultStyles.colors.fundoInput,
        height: height * 0.071,
        marginBottom: RFValue(15),
        borderRadius: RFValue(5),
        color: DefaultStyles.colors.tabBar,
        fontSize: RFValue(20),
        alignSelf: 'center',
        justifyContent: 'center',

    },
    viewCheckBox: {
        // borderWidth: 1,
        width: '65%',

        flexDirection: 'row',
        justifyContent: 'flex-start',
        marginLeft: width * 0.03,
        alignItems: 'center',
        alignSelf: 'flex-start'
    },
    textCheckBox: {
        fontSize: RFValue(25),
        color: DefaultStyles.colors.tabBar

    },
    inputFiltro: {
        width: width * 0.85,
        height: height * 0.071,
        backgroundColor: DefaultStyles.colors.fundoInput,
        color: DefaultStyles.colors.tabBar,
        borderRadius: RFValue(5),
        fontSize: RFValue(20),
        alignSelf: 'flex-end'
    },
    viewSwitch: {
        width: '100%',
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        marginBottom: 10
    }
});

export default AppearanceExpense;