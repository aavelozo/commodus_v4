import React, { useState, useEffect } from 'react'
import { Text, View, StyleSheet, TouchableWithoutFeedback, Alert, Dimensions, Switch, ScrollView } from 'react-native'
import { Checkbox, TextInput } from 'react-native-paper';
import { RFValue } from 'react-native-responsive-fontsize';
import Header from '../../../components/Header';
import TitleView from '../../../components/TitleView';
import ContentContainer from '../../../components/ContentContainer';
import SelectVehicle from '../../../components/vehicles/SelectVehicle';
import Vehicles from '../../../../database/models/Vehicles';
import DateComponent from '../../../components/expenses/DateComponent';
import InputKM from '../../../components/vehicles/InputKM';
import { DefaultProps } from '../../../DefaultProps';
import { DefaultStyles } from '../../../DefaultStyles';
import Utils from '../../../../controllers/Utils';
import Observations from '../../../components/expenses/Observations';
import Establishment from '../../../components/expenses/Establishment';
import SelectDropdown from 'react-native-select-dropdown';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import AuthController from '../../../../controllers/AuthController';
const { width, height } = Dimensions.get('window')




/******************************************************
** COMPONENTE PRINCIPAL                             **
******************************************************/
function AppearanceExpense(props): JSX.Element {

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
    const [regularWashing, setRegularWashing] = useState(false);
    const [completeWashing, setCompleteWashing] = useState(false);
    const [serviceList, setServiceList] = useState(['1', '2', '3', '4', '5', '6']);
    const [service, setService] = useState('Outros Serviços');



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
                        setRegularWashing(newExpense.othersdatas.regularWashing ? true : false);
                        setCompleteWashing(newExpense.othersdatas.completeWashing ? true : false);
                        setService(newExpense.othersdatas.service||null);

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
            if (totalValue && date && selectedVehicle && regularWashing || completeWashing  ) {

                let newExpense = null;
                if (currentExpenseId) {
                    //update
                    newExpense = await firestore().collection('Expenses').doc(currentExpenseId);
                    await newExpense.update({
                        idVehicle: selectedVehicle?.id || idVehicle,
                        type: 'APPEARENCE',
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
                    newExpense = await firestore().collection('Expenses').add({
                        authUserId: auth().currentUser.uid,
                        idUser: AuthController.getLoggedUser().id,
                        idVehicle: selectedVehicle?.id || idVehicle,
                        type: 'APPEARENCE',
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
                <TitleView title='Despesa aparência' />

                <ContentContainer >
                    <ScrollView>
                        {/* SELECIONE VEICULO (Caso tenha mais que 1 veiculo) */}
                        <SelectVehicle selectedId={idVehicle} setSelected={setSelectedVehicle} />

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
                            {...DefaultProps.selectDropdown}
                            data={serviceList}
                            label="Serviço"
                            onSelect={(selectedItem, index) => {
                                setService(selectedItem);
                            }}
                            buttonTextAfterSelection={(selectedItem, index) => {
                                return (
                                    service
                                        ? (selectedItem ? selectedItem.toString() : null)
                                        : null
                                );
                            }}
                            rowTextForSelection={(item, index) => {
                                return item.toString();
                            }}
                            defaultButtonText={service ? service.toString() : null}
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