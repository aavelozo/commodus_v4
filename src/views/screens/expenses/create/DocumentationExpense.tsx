import React, { useState, useEffect } from 'react'
import { View, StyleSheet, Alert, Dimensions, ScrollView } from 'react-native'
import { RFValue } from "react-native-responsive-fontsize";
import TitleView from '../../../components/TitleView';
import Vehicles from '../../../../database/models/Vehicles';
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
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import AuthController from '../../../../controllers/AuthController';
const { width, height } = Dimensions.get('window')



/******************************************************
** COMPONENTE DA VIEW PRINCIPAL                      **
******************************************************/
function DocumentationExpense(props): JSX.Element {

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
    const [documentName, setDocumentName] = useState( null);
    const [recurrenceList, setRecurrenceList] = useState(['Sem recorrência', 'Mensal', 'Trimensal', 'Semestral', 'Anual', 'Bianual']);
    const [recurrence, setRecurrence] = useState('Sem recorrência');


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
                        setDocumentName(newExpense.othersdatas.documentName||null);
                        setRecurrence(newExpense.othersdatas.recurrence||null);

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
            if (totalValue && date && selectedVehicle) {

                let newExpense = null;
                if (currentExpenseId) {
                    //update
                    newExpense = await firestore().collection('Expenses').doc(currentExpenseId);
                    await newExpense.update({
                        idVehicle: selectedVehicle?.id || idVehicle,
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
                    newExpense = await firestore().collection('Expenses').add({
                        authUserId: auth().currentUser.uid,
                        idUser: AuthController.getLoggedUser().id,
                        idVehicle: selectedVehicle?.id || idVehicle,
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

    /**
     * renderiza os componentes auxiliares da view principal
     */


    //render
    return (
        <View style={style.container}>

            <Header withButtons={true} onPressConclude={saveExpense} onPressCancel={goBack} />
            <View style={style.espacoCentral}>
                <TitleView title=' Despesa Documentação' />

                <ContentContainer >
                    <ScrollView>
                        {/* SELECIONE VEICULO (Caso tenha mais que 1 veiculo) */}
                        <SelectVehicle selectedId={idVehicle} setSelected={setSelectedVehicle} />

                        {/* DATE INPUT */}
                        <DateComponent date={date} setDate={setDate} />

                        {/* QUILOMETRAGEM ATUAL */}
                        <InputKM km={km} setKM={setKM} />

                        {/* DOCUMENT */}
                        <TextInput
                            {...DefaultProps.textInput}
                            style={DefaultStyles.textInput}
                            keyboardType='default'
                            label='Nome do documento'
                            onChangeText={value => setDocumentName(value)}
                            value={documentName}
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
                            {...DefaultProps.selectDropdown}
                            data={recurrenceList}
                            label="Recorrência"
                            onSelect={(selectedItem, index) => {
                                setRecurrence(selectedItem);
                            }}
                            buttonTextAfterSelection={(selectedItem, index) => {
                                return (
                                    recurrence
                                        ? (selectedItem ? selectedItem.toString() : null)
                                        : null
                                );
                            }}
                            rowTextForSelection={(item, index) => {
                                return item.toString();
                            }}
                            defaultButtonText={recurrence ? recurrence.toString() : null}
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