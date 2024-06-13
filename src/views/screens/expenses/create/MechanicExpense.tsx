import React, { useState, useCallback, useRef } from 'react'
import { View, StyleSheet, Alert, Dimensions, ScrollView, TouchableWithoutFeedback, Switch, Text } from 'react-native'
import { RFValue } from "react-native-responsive-fontsize";
import TitleView from '../../../components/TitleView';
import Header from '../../../components/Header';
import ContentContainer from '../../../components/ContentContainer';
import Observations from '../../../components/expenses/Observations';
import SelectVehicle from '../../../components/vehicles/SelectVehicle';
import DateComponent from '../../../components/expenses/DateComponent';
import InputKM from '../../../components/vehicles/InputKM';
import { TextInput } from 'react-native-paper';
import { DefaultProps } from '../../../DefaultProps';
import { DefaultStyles } from '../../../DefaultStyles';
import Utils from '../../../../controllers/Utils';
import SelectDropdown from 'react-native-select-dropdown';
import Establishment from '../../../components/expenses/Establishment';
import AuthController from '../../../../controllers/AuthController';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import EditExpenseController from '../../../../controllers/EditExpenseController';
import Vehicles from '../../../../database/models/Vehicles';

const { width, height } = Dimensions.get('window')


/******************************************************
** COMPONENTE DA VIEW PRINCIPAL                      **
******************************************************/
function MechanicsExpense(props): JSX.Element {
    const selectVehicleRef = useRef();
    const selectServiceRef = useRef();
    const [loading, setLoading] = useState(false);
    const [loaded, setLoaded] = useState(false);
    const [saving, setSaving] = useState(false);
    const [missingData, setMissingData] = useState(false);

    //default properties
    const [currentExpense, setCurrentExpense] = useState(null);
    const [vehicles, setVehicles] = useState([]);
    const [selectedVehicle, setSelectedVehicle] = useState(null);
    const [date, setDate] = useState(new Date());
    const [km, setKM] = useState(null);
    const [establishment, setEstablishment] = useState(null);
    const [isEnabledEstablishment, setIsEnabledEstablishment] = useState(false);
    const [observations, setObservations] = useState(null);
    const [isEnabledObservations, setIsEnabledObservations] = useState(false);
    const [totalValue, setTotalValue] = useState(0);

    //specific properties
    const [serviceList, setServiceList] = useState(['Manutenção de freios', 'Alinhamento e balanceamento', 'Troca de correias e tensores', 'Troca de velas', 'Diagnóstico', 'Reparo de suspensão', 'Troca de bateria', 'Troca de sistema de escape', 'Serviço de ar condicionado']);
    const [service, setService] = useState('Serviço realizado');
    const [isEnabled, setIsEnabled] = useState(false);
    const [dateReminder, setDateReminder] = useState(null);


    useFocusEffect(useCallback(() => {
        console.log('INIT MechanicExpense.useFocusEffect.useCallBack', props.navigation);
        if (!loading || !loaded) {
            setLoading(true);
            (async () => {
                try {
                    console.log('loading expense...');
                    let newVehicles = await Vehicles.getSingleData();
                    setVehicles(newVehicles);
                    console.log('EditExpenseController.currentExpense', EditExpenseController.currentExpense);
                    if (EditExpenseController.currentExpense) {
                        console.log('loading states...');

                        //default properties    
                        setCurrentExpense(EditExpenseController.currentExpense);
                        let vehicleId = EditExpenseController.currentExpense.ref.parent.parent.id;
                        setSelectedVehicle(newVehicles.find(el => el.id == vehicleId));
                        //date in firestore is object {"nanoseconds": 743000000, "seconds": 1713185626}
                        let dataExpense = EditExpenseController.currentExpense.data();
                        if (dataExpense.date) {
                            setDate(new Date(dataExpense.date.seconds * 1000 + dataExpense.date.nanoseconds / 1000000));
                        } else {
                            setDate(new Date());
                        }
                        setKM(dataExpense.actualkm || '');
                        setEstablishment(dataExpense.establishment || '');
                        setIsEnabledEstablishment(dataExpense.establishment ? true : false);
                        setObservations(dataExpense.observations || '');
                        setIsEnabledObservations(dataExpense.observations ? true : false);
                        setTotalValue(dataExpense.totalValue || 0);

                        //specific properties             
                        setService(dataExpense.othersdatas.service || null);
                        if (dataExpense.othersdatas.dateReminder) {
                            setDateReminder(new Date(dataExpense.othersdatas.dateReminder.seconds * 1000 + dataExpense.othersdatas.dateReminder.nanoseconds / 1000000));
                        } else {
                            setDateReminder(null);
                        }
                        setIsEnabled(dataExpense.othersdatas.dateReminder ? true : false);
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
    }, []));


    function clearStates() {
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
        setService(null);
        setDateReminder(null);
        setIsEnabled(false);

        if (selectVehicleRef) {
            selectVehicleRef.current?.reset();
        }
        if (selectServiceRef) {
            selectServiceRef.current?.reset();
        }
    }

    async function saveExpense() {
        try {
            if (totalValue && date && selectedVehicle) {
                setSaving(true);
                console.log('idVehicle', selectedVehicle.id);
                let vehicle = (await Vehicles.getDBData())?.docs.find(el => el.id == selectedVehicle.id);
                if (currentExpense) {
                    //update                    
                    await currentExpense.ref.update({
                        type: 'MECHANIC',
                        date: date,
                        actualkm: km,
                        totalValue: totalValue,
                        establishment: establishment,
                        observations: observations,
                        othersdatas: {
                            service: service,
                            dateReminder: isEnabled ? dateReminder : false
                        }
                    });
                } else {
                    //create
                    let newExpense = await vehicle.ref.collection('expenses').add({
                        type: 'MECHANIC',
                        date: date,
                        actualkm: km,
                        totalValue: totalValue,
                        establishment: establishment,
                        observations: observations,
                        othersdatas: {
                            service: service,
                            dateReminder: isEnabled ? dateReminder : false
                        }
                    });
                }
                goBack();
                Utils.toast("success", "Dados Salvos com Sucesso");
            } else {
                setMissingData(true);
                Utils.toast("error","faltam dados");
            }
        } catch (e) {
            Utils.showError(e);
        } finally {
            setSaving(false);
        }
    }


    //pressionado Cancelar do Header, volta o velocimetro
    goBack = () => {
        EditExpenseController.currentExpense = null;
        clearStates();
        //props.navigation.navigate('ViewExpense')
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
                <TitleView title=' Despesa Mecânica' />

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
                                            error={missingData && !selectedVehicle}
                                            label='* Veículo'
                                            value={selectedItem ? selectedItem.vehicleName || selectedItem.plate : ''}
                                            pointerEvents="none"
                                            readOnly
                                        />
                                    </View>
                                );
                            }}
                            renderItem={(item, index, isSelected) => {
                                return (<View style={{ ...DefaultStyles.dropdownTextView, ...(isSelected && { backgroundColor: '#D2D9DF' }) }}>
                                    <Text style={DefaultStyles.dropdownText}>{item.vehicleName || item.plate}</Text>
                                </View>);
                            }}
                            onSelect={(selectedItem, index) => {
                                setSelectedVehicle(selectedItem);
                                setKM(selectedItem.km)
                            }}
                            ref={selectVehicleRef}
                        />

                        {/* DATE INPUT */}
                        <DateComponent date={date} setDate={setDate} error={missingData && !date}  />

                        {/* QUILOMETRAGEM ATUAL */}
                        <InputKM km={km} setKM={setKM} />

                        {/* dropdown: usado para selecionar o serviço e atualizar o txtinput */}
                        <SelectDropdown
                            dropdownStyle={DefaultStyles.dropdownMenuStyle}
                            search={true}
                            showsVerticalScrollIndicator={true}
                            data={serviceList}
                            defaultValue={service}
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
                                return (<View style={{ ...DefaultStyles.dropdownTextView, ...(isSelected && { backgroundColor: '#D2D9DF' }) }}>
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
                            error={missingData && !totalValue}
                            keyboardType='numeric'
                            label='* Preço Total'
                            onChangeText={value => setTotalValue(Utils.toNumber(value))}
                            value={totalValue.toString()}
                        />

                        <Establishment
                            isEnabled={isEnabledEstablishment}
                            establishment={establishment}
                            setIsEnabled={setIsEnabledEstablishment}
                            setEstablishment={setEstablishment}
                        />

                        <View style={{ width: '100%', alignItems: 'flex-start', flexDirection: 'row', marginBottom: 10 }}>
                            <Switch
                                trackColor={{ false: "#767577", true: "rgba(0,124,118,0.6)" }}
                                thumbColor={isEnabled ? "#007C76" : DefaultStyles.colors.fundoInput}
                                ios_backgroundColor="#3e3e3e"
                                onValueChange={enabled => setIsEnabled(enabled)}
                                value={isEnabled}
                            />
                            <TouchableWithoutFeedback
                                onPress={() => setIsEnabled(!isEnabled)}
                            >
                                <Text style={{ fontSize: DefaultStyles.dimensions.defaultLabelFontSize, color: DefaultStyles.colors.tabBar }}>
                                    Lembrete revisão do serviço
                                </Text>
                            </TouchableWithoutFeedback>
                        </View>

                        {
                            isEnabled ? <DateComponent date={dateReminder} setDate={setDateReminder} /> : false
                        }



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

export default MechanicsExpense;