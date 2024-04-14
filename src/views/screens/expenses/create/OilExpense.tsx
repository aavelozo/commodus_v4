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
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import AuthController from '../../../../controllers/AuthController';
const { width, height } = Dimensions.get('window')




/******************************************************
** COMPONENTE PRINCIPAL                             **
******************************************************/
function OilExpense(props): JSX.Element {

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

    //specific properties
    const [codOil, setCodOil] = useState(null);
    const [isReminderEnabled, setIsReminderEnabled] = useState(false);
    const [reminderMonths, setReminderMonths] = useState(null);
    const [reminderKM, setReminderKM] = useState(null);
    const [isFiltersEnabled, setIsFiltersEnabled] = useState(false);
    const [isOilFilterChecked, setIsOilFilterChecked] = useState(false);
    const [oilFilterPrice, setOilFilterPrice] = useState(null);
    const [isFuelFilterChecked, setIsFuelFilterChecked] = useState(false);
    const [fuelFilterPrice, setFuelFilterPrice] = useState(null);
    const [isAirFilterChecked, setIsAirFilterChecked] = useState(false);
    const [airFilterPrice, setAirFilterPrice] = useState(null);
    const [isOilBrandEnabled, setIsOilBrandEnabled] = useState(false);
    const [oilBrand, setOilBrand] = useState(null);


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
                        setCodOil(newExpense.othersdatas.codOil || null);
                        setIsReminderEnabled((newExpense?.othersdatas?.reminderMonths || newExpense?.othersdatas?.reminderKM) ? true : false);
                        setReminderMonths(newExpense.othersdatas.reminderMonths || null);
                        setReminderKM(newExpense.othersdatas.reminderKM || null);
                        setIsFiltersEnabled((newExpense?.othersdatas?.oilFilterPrice || newExpense?.othersdatas?.fuelFilterPrice || newExpense?.othersdatas?.airFilterPrice) ? true : false);
                        setIsOilFilterChecked((newExpense?.othersdatas?.oilFilterPrice) ? true : false);
                        setOilFilterPrice(newExpense.othersdatas.oilFilterPrice || null);
                        setIsFuelFilterChecked((newExpense?.othersdatas?.fuelFilterPrice) ? true : false);
                        setFuelFilterPrice(newExpense.othersdatas.fuelFilterPrice || null);
                        setIsAirFilterChecked((newExpense?.othersdatas?.airFilterPrice) ? true : false);
                        setAirFilterPrice(newExpense.othersdatas.airFilterPrice || null);
                        setIsOilBrandEnabled((newExpense?.othersdatas?.oilBrand) ? true : false);
                        setOilBrand(newExpense.othersdatas.oilBrand || null);

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
            if (totalValue && date && selectedVehicle && codOil) {

                let newExpense = null;
                if (currentExpenseId) {
                    //update
                    newExpense = await firestore().collection('Expenses').doc(currentExpenseId);
                    await newExpense.update({
                        idVehicle: selectedVehicle?.id || idVehicle,
                        type: 'OIL',
                        date: date,
                        actualkm: km,
                        totalValue: totalValue,
                        establishment: establishment,
                        observations: observations,
                        othersdatas: {
                            codOil: codOil,
                            reminderMonths: reminderMonths,
                            reminderKM: reminderKM,
                            oilFilterPrice: oilFilterPrice,
                            fuelFilterPrice: fuelFilterPrice,
                            airFilterPrice: airFilterPrice,
                            oilBrand: oilBrand
                        }
                    });
                    await firestore().collection('Vehicles').doc(selectedVehicle?.id).update({
                        oilChange: reminderKM
                    }).catch(err => console.log(err))

                } else {
                    //create
                    newExpense = await firestore().collection('Expenses').add({
                        authUserId: auth().currentUser.uid,
                        idUser: AuthController.getLoggedUser().id,
                        idVehicle: selectedVehicle?.id || idVehicle,
                        type: 'OIL',
                        date: date,
                        actualkm: km,
                        totalValue: totalValue,
                        establishment: establishment,
                        observations: observations,
                        othersdatas: {
                            codOil: codOil,
                            reminderMonths: reminderMonths,
                            reminderKM: reminderKM,
                            oilFilterPrice: oilFilterPrice,
                            fuelFilterPrice: fuelFilterPrice,
                            airFilterPrice: airFilterPrice,
                            oilBrand: oilBrand
                        }
                    });

                    await firestore().collection('Vehicles').doc(selectedVehicle?.id).update({
                        oilChange: Number(reminderKM)
                    }).catch(err => console.log(err))
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
                <TitleView title='Despesa Óleo' />

                <ContentContainer >
                    <ScrollView>
                        {/* SELECIONE VEICULO (Caso tenha mais que 1 veiculo) */}
                        <SelectVehicle selectedId={idVehicle} setSelected={setSelectedVehicle} />

                        {/* DATE INPUT */}
                        <DateComponent date={date} setDate={setDate} />

                        {/* QUILOMETRAGEM ATUAL */}
                        <InputKM km={km} setKM={setKM} />

                        {/* CÓDIGO DO ÓLEO */}
                        <TextInput
                            {...DefaultProps.textInput}
                            style={DefaultStyles.textInput}
                            keyboardType='default'
                            label='Código do óleo'
                            onChangeText={value => setCodOil(value)}
                            value={codOil}
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

                        {/*LEMBRETE*/}
                        <View style={style.viewSwitch}>
                            <Switch
                                trackColor={{ false: "#767577", true: "rgba(0,124,118,0.6)" }}
                                thumbColor={isReminderEnabled ? "#007C76" : DefaultStyles.colors.fundoInput}
                                ios_backgroundColor="#3e3e3e"
                                onValueChange={enabled => setIsReminderEnabled(enabled)}
                                value={isReminderEnabled}
                            />
                            <TouchableWithoutFeedback onPress={() => setIsReminderEnabled(!isReminderEnabled)}>
                                <Text style={{ fontSize: DefaultStyles.dimensions.defaultLabelFontSize, color: DefaultStyles.colors.tabBar }}>
                                    Lembrete próxima troca
                                </Text>
                            </TouchableWithoutFeedback>

                        </View>
                        {isReminderEnabled ? <>
                            <TextInput
                                {...DefaultProps.textInput}
                                style={DefaultStyles.textInput}
                                label='Validade do óleo (Meses)'
                                value={reminderMonths ? reminderMonths.toString() : null}
                                onChangeText={lembreteMeses => setReminderMonths(lembreteMeses)}
                            />
                            <TextInput
                                {...DefaultProps.textInput}
                                style={DefaultStyles.textInput}
                                label='Próxima troca (KM)'
                                value={reminderKM ? reminderKM.toString() : null}
                                onChangeText={lembreteKm => setReminderKM(lembreteKm)}
                            />
                        </> : false}

                        {/*FILTRO*/}
                        <View style={style.viewSwitch}>
                            <Switch
                                trackColor={{ false: "#767577", true: "rgba(0,124,118,0.6)" }}
                                thumbColor={isFiltersEnabled ? "#007C76" : DefaultStyles.colors.fundoInput}
                                ios_backgroundColor="#3e3e3e"
                                onValueChange={enabled => setIsFiltersEnabled(enabled)}
                                value={isFiltersEnabled}
                            />
                            <TouchableWithoutFeedback onPress={() => setIsFiltersEnabled(!isFiltersEnabled)}>
                                <Text style={{ fontSize: DefaultStyles.dimensions.defaultLabelFontSize, color: DefaultStyles.colors.tabBar }}>
                                    Troquei o filtro
                                </Text>
                            </TouchableWithoutFeedback>
                        </View>
                        {isFiltersEnabled ?
                            <View style={style.viewCheckBox}>
                                <Checkbox
                                    status={isOilFilterChecked ? 'checked' : 'unchecked'}
                                    onPress={() => {
                                        setIsOilFilterChecked(!isOilFilterChecked);
                                    }}
                                />
                                <TouchableWithoutFeedback onPress={() => setIsOilFilterChecked(!isOilFilterChecked)}>
                                    <Text style={[style.textCheckBox, { fontSize: DefaultStyles.dimensions.defaultLabelFontSize }]}>Filtro de óleo</Text>
                                </TouchableWithoutFeedback>

                            </View> : false}

                        {isOilFilterChecked && isFiltersEnabled ?
                            <TextInput
                                {...DefaultProps.textInput}
                                style={DefaultStyles.textInput}
                                label='Preço do filtro de óleo'
                                value={oilFilterPrice ? oilFilterPrice.toString() : null}
                                keyboardType='numeric'
                                onChangeText={filtroOleo => setOilFilterPrice(Utils.toNumber(filtroOleo))}
                            /> : false}

                        {isFiltersEnabled ?
                            <View style={style.viewCheckBox}>
                                <Checkbox
                                    status={isFuelFilterChecked ? 'checked' : 'unchecked'}
                                    onPress={() => {
                                        setIsFuelFilterChecked(!isFuelFilterChecked);
                                    }}
                                />
                                <TouchableWithoutFeedback onPress={() => setIsFuelFilterChecked(!isFuelFilterChecked)}>
                                    <Text style={[style.textCheckBox, { fontSize: DefaultStyles.dimensions.defaultLabelFontSize }]}>Filtro de combustível</Text>
                                </TouchableWithoutFeedback>
                            </View> : false}

                        {isFuelFilterChecked && isFiltersEnabled ?
                            <TextInput
                                {...DefaultProps.textInput}
                                style={DefaultStyles.textInput}
                                label='Preço do filtro de combustível'
                                value={fuelFilterPrice ? fuelFilterPrice.toString() : null}
                                keyboardType='numeric'
                                onChangeText={filtroCombustivel => setFuelFilterPrice(Utils.toNumber(filtroCombustivel))}
                            /> : false}

                        {isFiltersEnabled ?
                            <View style={style.viewCheckBox}>
                                <Checkbox
                                    status={isAirFilterChecked ? 'checked' : 'unchecked'}
                                    onPress={() => {
                                        setIsAirFilterChecked(!isAirFilterChecked);
                                    }}
                                />
                                <TouchableWithoutFeedback onPress={() => setIsAirFilterChecked(!isAirFilterChecked)}>
                                    <Text style={[style.textCheckBox, { fontSize: DefaultStyles.dimensions.defaultLabelFontSize }]}>Filtro de ar</Text>
                                </TouchableWithoutFeedback>
                            </View> : false}

                        {isAirFilterChecked && isFiltersEnabled ?
                            <TextInput
                                {...DefaultProps.textInput}
                                style={DefaultStyles.textInput}
                                label='Preço do filtro de ar'
                                value={airFilterPrice ? airFilterPrice.toString() : null}
                                keyboardType='numeric'
                                onChangeText={filtroAr => setAirFilterPrice(Utils.toNumber(filtroAr))}
                            /> : false}



                        <Establishment
                            isEnabled={isEnabledEstablishment}
                            establishment={establishment}
                            setIsEnabled={setIsEnabledEstablishment}
                            setEstablishment={setEstablishment}
                        />

                        <View style={{ width: '100%', alignItems: 'flex-start', flexDirection: 'row', marginBottom: 10 }}>
                            <Switch
                                trackColor={{ false: "#767577", true: "rgba(0,124,118,0.6)" }}
                                thumbColor={isOilBrandEnabled ? "#007C76" : DefaultStyles.colors.fundoInput}
                                ios_backgroundColor="#3e3e3e"
                                onValueChange={enabled => setIsOilBrandEnabled(enabled)}
                                value={isOilBrandEnabled}
                            />
                            <TouchableWithoutFeedback onPress={() => setIsOilBrandEnabled(!isOilBrandEnabled)}>
                                <Text style={{ fontSize: DefaultStyles.dimensions.defaultLabelFontSize, color: DefaultStyles.colors.tabBar }}>
                                    Marca
                                </Text>
                            </TouchableWithoutFeedback>
                        </View>

                        {
                            isOilBrandEnabled ? <TextInput
                                {...DefaultProps.textInput}
                                style={DefaultStyles.textInput}
                                label='Marca do óleo'
                                onChangeText={marcaOleo => setOilBrand(marcaOleo)}
                                value={oilBrand}
                            /> : false
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

export default OilExpense;