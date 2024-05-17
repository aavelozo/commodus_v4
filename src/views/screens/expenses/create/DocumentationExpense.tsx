import React, { useState, useRef, useCallback } from 'react'
import { View, StyleSheet, Alert, Dimensions, ScrollView } from 'react-native'
import { RFValue } from "react-native-responsive-fontsize";
import TitleView from '../../../components/TitleView';
import Vehicles from '../../../../database/models/Vehicles';
import Header from '../../../components/Header';
import ContentContainer from '../../../components/ContentContainer';
import Observations from '../../../components/expenses/Observations';
import DateComponent from '../../../components/expenses/DateComponent';
import InputKM from '../../../components/vehicles/InputKM';
import { Text, TextInput } from 'react-native-paper';
import { DefaultProps } from '../../../DefaultProps';
import { DefaultStyles } from '../../../DefaultStyles';
import Utils from '../../../../controllers/Utils';
import SelectDropdown from 'react-native-select-dropdown';
import EditExpenseController from '../../../../controllers/EditExpenseController';
import { useFocusEffect } from '@react-navigation/native';
const { width, height } = Dimensions.get('window')



/******************************************************
** COMPONENTE DA VIEW PRINCIPAL                      **
******************************************************/
function DocumentationExpense(props): JSX.Element {
    const selectVehicleRef = useRef();
    const selectRecurrenceRef = useRef();
    const [loading, setLoading] = useState(false);
    const [loaded, setLoaded] = useState(false);
    const [saving, setSaving] = useState(false);

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
    const [docList, setDocList] = useState(['IPVA', 'Transferência', 'Seguro', 'Hidratação de couro', 'Emplacamento', 'Blindagem']);

    //specific properties
    const [documentName, setDocumentName] = useState(null);
    const [recurrenceList] = useState(['Mensal', 'Trimensal', 'Semestral', 'Anual', 'Bianual']);
    const [recurrence, setRecurrence] = useState('Sem recorrência');
    const selectServiceRef = useRef();


    useFocusEffect(useCallback(() => {
        console.log('INIT OthersExpense.useFocusEffect.useCallBack');
        if (!loading && !loaded) {
            setLoading(true);

            //load expense data
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
                        console.log('loading states...2');
                        let dataExpense = EditExpenseController.currentExpense.data();
                        //date in firestore is object {"nanoseconds": 743000000, "seconds": 1713185626}
                        if (EditExpenseController.currentExpense.data().date) {
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
                        setDocumentName(dataExpense.othersdatas.documentName || null);
                        setRecurrence(dataExpense.othersdatas.recurrence || null);
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
            if (totalValue && date && selectedVehicle) {
                setSaving(true);
                console.log('idVehicle', selectedVehicle.id);
                let vehicle = (await Vehicles.getDBData())?.docs.find(el => el.id == selectedVehicle.id);
                if (currentExpense) {
                    //update                    
                    await currentExpense.ref.update({
                        type: 'DOCUMENT',
                        date: date,
                        actualkm: km,
                        totalValue: totalValue,
                        establishment: establishment,
                        observations: observations,
                        othersdatas: {
                            documentName: documentName,
                            recurrence: recurrence
                        }
                    });
                } else {
                    //create
                    let newExpense = await vehicle.ref.collection('expenses').add({
                        type: 'DOCUMENT',
                        date: date,
                        actualkm: km,
                        totalValue: totalValue,
                        establishment: establishment,
                        observations: observations,
                        othersdatas: {
                            documentName: documentName,
                            recurrence: recurrence
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

    function clearStates() {
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
        setDocumentName(null);
        setRecurrence(null);

        if (selectVehicleRef) {
            selectVehicleRef.current?.reset();
        }

        if (selectRecurrenceRef) {
            selectRecurrenceRef.current?.reset();
        }


    }


    //pressionado Cancelar do Header, volta o velocimetro
    goBack = () => {
        EditExpenseController.currentExpense = null;
        clearStates();
        props.navigation.navigate('ViewExpense');
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
                <TitleView title=' Despesa Documentação' />

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
                                return (<View style={{ ...DefaultStyles.dropdownTextView, ...(isSelected && { backgroundColor: '#D2D9DF' }) }}>
                                    <Text style={DefaultStyles.dropdownText}>{item.vehicleName || item.plate}</Text>
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
                        {/* <TextInput
                            {...DefaultProps.textInput}
                            style={DefaultStyles.textInput}
                            keyboardType='default'
                            label='Nome do documento'
                            onChangeText={value => setDocumentName(value)}
                            value={documentName}
                        /> */}

                        <SelectDropdown
                            dropdownStyle={DefaultStyles.dropdownMenuStyle}
                            search={true}
                            showsVerticalScrollIndicator={true}
                            data={docList}
                            defaultValue={selectedVehicle}
                            renderButton={(selectedItem, isOpened) => {
                                return (
                                    <View>
                                        <TextInput
                                            {...DefaultProps.textInput}
                                            style={DefaultStyles.textInput}
                                            label='Nome do documento'
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
                                setDocumentName(selectedItem);
                            }}
                            ref={selectServiceRef}
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



                        {/* dropdown: usado para selecionar o ano e atualizar o txtinput */}
                        <SelectDropdown
                            dropdownStyle={DefaultStyles.dropdownMenuStyle}
                            search={true}
                            showsVerticalScrollIndicator={true}
                            data={recurrenceList}
                            defaultValue={recurrence}
                            renderButton={(selectedItem, isOpened) => {
                                return (
                                    <View>
                                        <TextInput
                                            {...DefaultProps.textInput}
                                            style={DefaultStyles.textInput}
                                            label='Recorrência'
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
                                setRecurrence(selectedItem);
                            }}
                            ref={selectRecurrenceRef}
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

export default DocumentationExpense;