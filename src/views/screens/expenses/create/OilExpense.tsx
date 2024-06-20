import React, { useState, useCallback, useRef } from 'react'
import { Text, View, StyleSheet, TouchableWithoutFeedback, Alert, Dimensions, Switch, ScrollView } from 'react-native'
import { Checkbox, TextInput } from 'react-native-paper';
import { RFValue } from 'react-native-responsive-fontsize';
import Header from '../../../components/Header';
import TitleView from '../../../components/TitleView';
import ContentContainer from '../../../components/ContentContainer';
import SelectVehicle from '../../../components/vehicles/SelectVehicle';
import DateComponent from '../../../components/expenses/DateComponent';
import InputKM from '../../../components/vehicles/InputKM';
import { DefaultProps } from '../../../DefaultProps';
import { DefaultStyles } from '../../../DefaultStyles';
import Utils from '../../../../controllers/Utils';
import Observations from '../../../components/expenses/Observations';
import Establishment from '../../../components/expenses/Establishment';
import AuthController from '../../../../controllers/AuthController';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import EditExpenseController from '../../../../controllers/EditExpenseController';
import SelectDropdown from 'react-native-select-dropdown';
import Vehicles from '../../../../database/models/Vehicles';
import { BaseExpense } from './BaseExpense';
const { width, height } = Dimensions.get('window')




/******************************************************
** COMPONENTE PRINCIPAL                             **
******************************************************/
function OilExpense(props): JSX.Element {
    const selectVehicleRef = useRef();
    const [loading,setLoading] = useState(false);    
    const [loaded,setLoaded] = useState(false);  
    const [saving,setSaving] = useState(false); 
    const [missingData, setMissingData] = useState(false);

    //default properties
    const [currentExpense, setCurrentExpense] = useState(null);
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


    useFocusEffect(useCallback(() => {
        console.log('INIT OilExpense.useFocusEffect.useCallBack');
        if (!loaded) {
            if (!loading) setLoading(true);
            (async()=>{
                try {
                    console.log('loading expense...');
                    console.log('EditExpenseController.currentExpense',EditExpenseController.currentExpense);
                    if (EditExpenseController.currentExpense) { 
                        console.log('loading states...');             
                        //default properties    
                        setCurrentExpense(EditExpenseController.currentExpense);  
                        let dataExpense = EditExpenseController.currentExpense.data();
                        //date in firestore is object {"nanoseconds": 743000000, "seconds": 1713185626}
                        setTotalValue(dataExpense.totalValue||0);
                    
                        //specific properties
                        setCodOil(dataExpense.othersdatas.codOil || null);
                        setIsReminderEnabled((dataExpense?.othersdatas?.reminderMonths || dataExpense?.othersdatas?.reminderKM) ? true : false);
                        setReminderMonths(dataExpense.othersdatas.reminderMonths || null);
                        setReminderKM(dataExpense.othersdatas.reminderKM || null);
                        setIsFiltersEnabled((dataExpense?.othersdatas?.oilFilterPrice || dataExpense?.othersdatas?.fuelFilterPrice || dataExpense?.othersdatas?.airFilterPrice) ? true : false);
                        setIsOilFilterChecked((dataExpense?.othersdatas?.oilFilterPrice) ? true : false);
                        setOilFilterPrice(dataExpense.othersdatas.oilFilterPrice || null);
                        setIsFuelFilterChecked((dataExpense?.othersdatas?.fuelFilterPrice) ? true : false);
                        setFuelFilterPrice(dataExpense.othersdatas.fuelFilterPrice || null);
                        setIsAirFilterChecked((dataExpense?.othersdatas?.airFilterPrice) ? true : false);
                        setAirFilterPrice(dataExpense.othersdatas.airFilterPrice || null);
                        setIsOilBrandEnabled((dataExpense?.othersdatas?.oilBrand) ? true : false);
                        setOilBrand(dataExpense.othersdatas.oilBrand || null);
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


    function isMissingData() {
        let result = false;
        if (!totalValue || !codOil) {
            result = true;
        } 
        setMissingData(result);
        return result;
    }

    function getOthersDatas() {
        return {
            codOil: codOil,
            reminderMonths: reminderMonths,
            reminderKM: reminderKM,
            oilFilterPrice: oilFilterPrice,
            fuelFilterPrice: fuelFilterPrice,
            airFilterPrice: airFilterPrice,
            oilBrand: oilBrand
        }
    }

    function clearStates(){
        setCurrentExpense(null);                
        setTotalValue(0);

        //specific properties
        setCodOil('');
        setIsReminderEnabled(false);
        setReminderMonths('');
        setReminderKM('');
        setIsFiltersEnabled(false);
        setIsOilFilterChecked(false);
        setOilFilterPrice('');
        setIsFuelFilterChecked(false);
        setFuelFilterPrice('');
        setIsAirFilterChecked(false);
        setAirFilterPrice('');
        setIsOilBrandEnabled(false);
        setOilBrand('');
    }
  

    return (
        <BaseExpense
            title='oil expense'
            type='OIL'
            loading={loading}
            setLoading={setLoading}
            loaded={loaded}
            setLoaded={setLoaded}
            saving={saving}
            setSaving={setSaving}
            currentExpense={currentExpense}
            setCurrentExpense={setCurrentExpense}
            clearStates={clearStates}
            isMissingData={isMissingData}
            getOthersDatas={getOthersDatas}
            totalValue={totalValue}
        >
        
            {/* CÓDIGO DO ÓLEO */}
            <TextInput
                {...DefaultProps.textInput}
                style={DefaultStyles.textInput}
                error={missingData && !codOil}
                keyboardType='default'
                label='* Código do óleo'
                onChangeText={value => setCodOil(value)}
                value={codOil}
            />

            {/* PREÇO TOTAL */}
            <TextInput
                {...DefaultProps.textInput}
                style={DefaultStyles.textInput}
                error={missingData && !totalValue}
                keyboardType='numeric'
                label='* Valor Total'
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

            
        </BaseExpense>
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