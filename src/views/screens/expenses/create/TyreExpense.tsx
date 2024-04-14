import React, { useState, useEffect } from 'react'
import { View, StyleSheet, Alert, Dimensions, ScrollView, Switch, TouchableWithoutFeedback, Text } from 'react-native'
import { RFValue } from "react-native-responsive-fontsize";
import TitleView from '../../../components/TitleView';
import Vehicles from '../../../../database/models/Vehicles';
import Header from '../../../components/Header';
import ContentContainer from '../../../components/ContentContainer';
import Observations from '../../../components/expenses/Observations';
import SelectVehicle from '../../../components/vehicles/SelectVehicle';
import DateComponent from '../../../components/expenses/DateComponent';
import InputKM from '../../../components/vehicles/InputKM';
import { TextInput, Checkbox } from 'react-native-paper';
import { DefaultProps } from '../../../DefaultProps';
import { DefaultStyles } from '../../../DefaultStyles';
import Utils from '../../../../controllers/Utils';
import SelectDropdown from 'react-native-select-dropdown';
import AuthController from '../../../../controllers/AuthController';
import firestore from '@react-native-firebase/firestore';
import Establishment from '../../../components/expenses/Establishment';
import auth from '@react-native-firebase/auth';
const { width, height } = Dimensions.get('window')



/******************************************************
** COMPONENTE DA VIEW PRINCIPAL                      **
******************************************************/
function TyreExpense(props): JSX.Element {

    //default properties
    const currentExpenseId = (props?.route?.params || props?.params || {})?.expenseId || null;
    const [loading, setLoading] = useState(false);
    const [loaded, setLoaded] = useState(false);
    const [currentExpense, setCurrentExpense] = useState(null);
    const [idVehicle, setIdVehicle] = useState(null);
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
                                id: newExpense.id,
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
                        setIdVehicle(newExpense.idVehicle || null);
                        setDate(newExpense.date || null);
                        setKM(newExpense.actualkm || null);
                        setEstablishment(newExpense.establishment || null);
                        setIsEnabledEstablishment(newExpense.establishment ? true : false);
                        setObservations(newExpense.observations || null);
                        setIsEnabledObservations(newExpense.observations ? true : false);
                        setTotalValue(newExpense.totalValue || null);


                        //specific properties
                        setTyreService(newExpense.othersdatas.typeService || null);
                        setDateReminderAlignment(newExpense.othersDatas.dateReminderAlignment || null)
                        setDateReminderBalancing(newExpense.othersDatas.dateReminderBalancing || null)

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
                    newExpense = await firestore().collection('Expenses').add({
                        authUserId: auth().currentUser.uid,
                        idUser: AuthController.getLoggedUser().id,
                        idVehicle: selectedVehicle?.id || idVehicle,
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
                <TitleView title=' Despesa Borracharia' />

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