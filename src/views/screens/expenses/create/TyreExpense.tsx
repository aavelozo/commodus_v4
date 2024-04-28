import React, { useState, useRef, useCallback } from 'react'
import { View, StyleSheet, Alert, Dimensions, ScrollView, Switch, TouchableWithoutFeedback, Text } from 'react-native'
import { RFValue } from "react-native-responsive-fontsize";
import TitleView from '../../../components/TitleView';
import Vehicles from '../../../../database/models/Vehicles';
import Header from '../../../components/Header';
import ContentContainer from '../../../components/ContentContainer';
import Observations from '../../../components/expenses/Observations';
import DateComponent from '../../../components/expenses/DateComponent';
import InputKM from '../../../components/vehicles/InputKM';
import { TextInput } from 'react-native-paper';
import { DefaultProps } from '../../../DefaultProps';
import { DefaultStyles } from '../../../DefaultStyles';
import Utils from '../../../../controllers/Utils';
import SelectDropdown from 'react-native-select-dropdown';
import Establishment from '../../../components/expenses/Establishment';
import { useFocusEffect } from '@react-navigation/native';
import EditExpenseController from '../../../../controllers/EditExpenseController';
const { width, height } = Dimensions.get('window')



/******************************************************
** COMPONENTE DA VIEW PRINCIPAL                      **
******************************************************/
function TyreExpense(props): JSX.Element {
    const selectVehicleRef = useRef();
    const [loading,setLoading] = useState(false);    
    const [loaded,setLoaded] = useState(false); 
    const [saving,setSaving] = useState(false);

    //default properties
    const [currentExpense, setCurrentExpense] = useState(null);
    const [vehicles, setVehicles] = useState([]);   
    const [selectedVehicle, setSelectedVehicle] = useState(null);
    const [date, setDate] = useState(null);
    const [km, setKM] = useState(null);
    const [establishment, setEstablishment] = useState(null);
    const [isEnabledEstablishment, setIsEnabledEstablishment] = useState(false);
    const [observations, setObservations] = useState(null);
    const [isEnabledObservations, setIsEnabledObservations] = useState(false);
    const [totalValue, setTotalValue] = useState(0);
    const [isReminderAlignmentEnabled, setIsReminderAlignmentEnabled] = useState(false);
    const [isReminderBalancingEnabled, setIsReminderBalancingEnabled] = useState(false);
    const [dateReminderAlignment, setDateReminderAlignment] = useState(null);
    const [dateReminderBalancing, setDateReminderBalancing] = useState(null);

    //specific properties
    const [tyreService, setTyreService] = useState(null);

    useFocusEffect(useCallback(() => {
        console.log('INIT TyreExpense.useFocusEffect.useCallBack');
        if (!loading && !loaded ) {
            setLoading(true);

            //load expense data
            (async () => {
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
                        setTyreService(dataExpense.othersdatas.typeService || null);
                        setDateReminderAlignment(dataExpense.othersDatas.dateReminderAlignment || null)
                        setDateReminderBalancing(dataExpense.othersDatas.dateReminderBalancing || null)
                    } else {
                       clearStates();
                    }                    
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
            if (totalValue && date && selectedVehicle) {
                setSaving(true);
                console.log('idVehicle',selectedVehicle.id);
                let vehicle = (await Vehicles.getDBData())?.docs.find(el=>el.id == selectedVehicle.id);
                if (currentExpense) {
                    //update                    
                    await currentExpense.ref.update({
                        type: 'TYRE',
                        date: date,
                        actualkm: km,
                        totalValue: totalValue,
                        establishment: establishment,
                        observations: observations,
                        othersdatas: {
                            typeService: tyreService,
                            dateReminderAlignment: dateReminderAlignment,
                            dateReminderBalancing: dateReminderBalancing
                        }
                    });                    
                } else {
                    //create
                    let newExpense = await vehicle.ref.collection('expenses').add({
                        type: 'TYRE',
                        date: date,
                        actualkm: km,
                        totalValue: totalValue,
                        establishment: establishment,
                        observations: observations,
                        othersdatas: {
                            typeService: tyreService,
                            dateReminderAlignment: dateReminderAlignment,
                            dateReminderBalancing: dateReminderBalancing
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
        setTyreService(null);
        setDateReminderAlignment(null)
        setDateReminderBalancing(null)

        if (selectVehicleRef) {
            selectVehicleRef.current?.reset();
        }
    }
    

    //pressionado Cancelar do Header, volta o velocimetro
    goBack = () => {
        EditExpenseController.currentExpense = null;
        clearStates();
        props.navigation.goBack();
    };

    /**
     * renderiza os componentes auxiliares da view principal
     */


    //render
    return (
        <View style={style.container}>
            <Header 
                withButtons={true} 
                onPressConclude={saveExpense} 
                onPressCancel={goBack} 
                saving={saving}
            />
            <View style={style.espacoCentral}>
                <TitleView title=' Despesa Borracharia' />

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

                        {/* DOCUMENT */}
                        <TextInput
                            {...DefaultProps.textInput}
                            style={DefaultStyles.textInput}
                            keyboardType='default'
                            label='Descrição do serviço'
                            onChangeText={value => setTyreService(value)}
                            value={tyreService}
                        />

                        {/* PREÇO TOTAL */}
                        <TextInput
                            {...DefaultProps.textInput}
                            style={DefaultStyles.textInput}
                            keyboardType='numeric'
                            label='Valor Total'
                            onChangeText={value => setTotalValue(Utils.toNumber(value))}
                            value={totalValue.toString()}
                        />

                        <View style={{ width: '100%', alignItems: 'flex-start', flexDirection: 'row', marginBottom: 10 }}>
                            <Switch
                                trackColor={{ false: "#767577", true: "rgba(0,124,118,0.6)" }}
                                thumbColor={isReminderAlignmentEnabled ? "#007C76" : DefaultStyles.colors.fundoInput}
                                ios_backgroundColor="#3e3e3e"
                                onValueChange={enabled => setIsReminderAlignmentEnabled(enabled)}
                                value={isReminderAlignmentEnabled}
                            />
                            <TouchableWithoutFeedback
                                onPress={() => setIsReminderAlignmentEnabled(!isReminderAlignmentEnabled)}
                            >
                                <Text style={{ fontSize: DefaultStyles.dimensions.defaultLabelFontSize, color: DefaultStyles.colors.tabBar }}>
                                    Lembrete próximo alinhamento
                                </Text>
                            </TouchableWithoutFeedback>
                        </View>

                        {
                            isReminderAlignmentEnabled ? <DateComponent date={dateReminderAlignment} setDate={setDateReminderAlignment} /> : false
                        }

                        <View style={{ width: '100%', alignItems: 'flex-start', flexDirection: 'row', marginBottom: 10 }}>
                            <Switch
                                trackColor={{ false: "#767577", true: "rgba(0,124,118,0.6)" }}
                                thumbColor={isReminderBalancingEnabled ? "#007C76" : DefaultStyles.colors.fundoInput}
                                ios_backgroundColor="#3e3e3e"
                                onValueChange={enabled => setIsReminderBalancingEnabled(enabled)}
                                value={isReminderBalancingEnabled}
                            />
                            <TouchableWithoutFeedback
                                onPress={() => setIsReminderBalancingEnabled(!isReminderBalancingEnabled)}
                            >
                                <Text style={{ fontSize: DefaultStyles.dimensions.defaultLabelFontSize, color: DefaultStyles.colors.tabBar }}>
                                    Lembrete próximo balanceamento
                                </Text>
                            </TouchableWithoutFeedback>
                        </View>

                        {
                            isReminderBalancingEnabled ? <DateComponent date={dateReminderBalancing} setDate={setDateReminderBalancing} /> : false
                        }

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
    viewSwitch: {
        width: '100%',
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        marginBottom: RFValue(10)
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

});

export default TyreExpense;