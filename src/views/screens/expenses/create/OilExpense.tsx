import React, { useState, useCallback, useRef } from 'react'
import { Text, View, StyleSheet, TouchableWithoutFeedback, Dimensions, Switch } from 'react-native'
import { Checkbox, HelperText, TextInput } from 'react-native-paper';
import { RFValue } from 'react-native-responsive-fontsize';
import { DefaultProps } from '../../../DefaultProps';
import { DefaultStyles } from '../../../DefaultStyles';
import Utils from '../../../../controllers/Utils';
import { useFocusEffect } from '@react-navigation/native';
import EditExpenseController from '../../../../controllers/EditExpenseController';
import { BaseExpense } from './BaseExpense';
import { TotalValue } from '../../../components/expenses/TotalValue';
import Trans from '../../../../controllers/internatiolization/Trans';
import _ from 'lodash';
const { width, height } = Dimensions.get('window')




/******************************************************
** COMPONENTE PRINCIPAL                             **
******************************************************/
function OilExpense(props): JSX.Element {
    const [loading, setLoading] = useState(false);
    const [loaded, setLoaded] = useState(false);
    const [saving, setSaving] = useState(false);
    const [missingData, setMissingData] = useState(false);

    //default properties
    const [currentExpense, setCurrentExpense] = useState(null);
    const [totalValue, setTotalValue] = useState('');

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
            (async () => {
                try {
                    console.log('loading expense...');
                    console.log('EditExpenseController.currentExpense', EditExpenseController.currentExpense);
                    if (EditExpenseController.currentExpense) {
                        console.log('loading states...');
                        //default properties    
                        setCurrentExpense(EditExpenseController.currentExpense);
                        let dataExpense = EditExpenseController.currentExpense.data();
                        //date in firestore is object {"nanoseconds": 743000000, "seconds": 1713185626}
                        setTotalValue(Utils.toNumericText(dataExpense.totalValue || ''));

                        //specific properties
                        setCodOil(dataExpense.othersdatas.codOil || null);
                        setIsReminderEnabled((dataExpense?.othersdatas?.reminderMonths || dataExpense?.othersdatas?.reminderKM) ? true : false);
                        setReminderMonths(dataExpense.othersdatas.reminderMonths || null);
                        setReminderKM(dataExpense.othersdatas.reminderKM || null);
                        setIsFiltersEnabled((dataExpense?.othersdatas?.oilFilterPrice || dataExpense?.othersdatas?.fuelFilterPrice || dataExpense?.othersdatas?.airFilterPrice) ? true : false);
                        setIsOilFilterChecked((dataExpense?.othersdatas?.oilFilterPrice) ? true : false);
                        setOilFilterPrice(Utils.toNumericText(dataExpense.othersdatas.oilFilterPrice || ''));
                        setIsFuelFilterChecked((dataExpense?.othersdatas?.fuelFilterPrice) ? true : false);
                        setFuelFilterPrice(Utils.toNumericText(dataExpense.othersdatas.fuelFilterPrice || ''));
                        setIsAirFilterChecked((dataExpense?.othersdatas?.airFilterPrice) ? true : false);
                        setAirFilterPrice(Utils.toNumericText(dataExpense.othersdatas.airFilterPrice || ''));
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
            reminderKM: Utils.hasValue(reminderKM) ? Utils.toNumber(reminderKM) : null,
            oilFilterPrice: Utils.hasValue(oilFilterPrice) ? Utils.toNumber(oilFilterPrice) : null,
            fuelFilterPrice: Utils.hasValue(fuelFilterPrice) ? Utils.toNumber(fuelFilterPrice) : null,
            airFilterPrice: Utils.hasValue(airFilterPrice) ? Utils.toNumber(airFilterPrice) : null,
            oilBrand: oilBrand
        }
    }

    function getVehicleReminders() {
        let result = null;
        if (Utils.hasValue(reminderMonths)) {
            result = {
                nextOilChange:{
                    reminderMonths: reminderMonths
                }
            }
        } 
        if (Utils.hasValue(reminderKM)) {
            result = result || {
                nextOilChange:{}
            }
            result.nextOilChange.reminderKM = Utils.toNumber(reminderKM);
        }
        return result;
    }

    function clearStates() {
        setCurrentExpense(null);
        setTotalValue('');

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
            getVehicleReminders={getVehicleReminders}
            totalValue={totalValue}
        >

            {/* CÓDIGO DO ÓLEO */}
            <TextInput
                {...DefaultProps.textInput}
                style={DefaultStyles.textInput}
                keyboardType='default'
                label={`* ${_.capitalize(Trans.t('oil code'))}`}
                onChangeText={value => setCodOil(_.toUpper(value))}
                value={codOil}
                maxLength={10}
            />
            <HelperText
                style={DefaultStyles.defaultHelperText}
                type="error"
                visible={missingData && !codOil}
            >
                {_.capitalize(Trans.t('enter a oil code'))}
            </HelperText>

            <TotalValue totalValue={totalValue} setTotalValue={setTotalValue} missingData={missingData} />

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
                        {_.capitalize(Trans.t('next exchange reminder'))}
                    </Text>
                </TouchableWithoutFeedback>

            </View>
            {isReminderEnabled ? <>
                <TextInput
                    {...DefaultProps.textInput}
                    style={DefaultStyles.textInput}
                    label={_.capitalize(Trans.t('oil validity (months)'))}
                    value={reminderMonths ? reminderMonths.toString() : null}
                    onChangeText={lembreteMeses => setReminderMonths(Utils.toNumber(Utils.toNumericText(lembreteMeses)))}
                    keyboardType='decimal-pad'
                    maxLength={3}
                />
                <TextInput
                    {...DefaultProps.textInput}
                    style={DefaultStyles.textInput}
                    label={Trans.t('Next exchange (KM)')}
                    value={reminderKM ? reminderKM.toString() : null}
                    onChangeText={lembreteKm => setReminderKM(Utils.toNumber(Utils.toNumericText(lembreteKm)))}
                    keyboardType='decimal-pad'
                    maxLength={7}
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
                        {_.capitalize(Trans.t('i changed the filter'))}
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
                        <Text style={[style.textCheckBox, { fontSize: DefaultStyles.dimensions.defaultLabelFontSize }]}>
                            {_.capitalize(Trans.t('oil filter'))}
                        </Text>
                    </TouchableWithoutFeedback>

                </View> : false}

            {isOilFilterChecked && isFiltersEnabled ?
                <TextInput
                    {...DefaultProps.textInput}
                    style={DefaultStyles.textInput}
                    label={_.capitalize(Trans.t('oil filter price'))}
                    value={oilFilterPrice ? oilFilterPrice.toString() : null}
                    keyboardType='numeric'
                    onChangeText={filtroOleo => setOilFilterPrice(Utils.toNumber(Utils.toNumericText(filtroOleo)))}
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
                        <Text style={[style.textCheckBox, { fontSize: DefaultStyles.dimensions.defaultLabelFontSize }]}>
                            {_.capitalize(Trans.t('fuel filter'))}
                        </Text>
                    </TouchableWithoutFeedback>
                </View> : false}

            {isFuelFilterChecked && isFiltersEnabled ?
                <TextInput
                    {...DefaultProps.textInput}
                    style={DefaultStyles.textInput}
                    label={_.capitalize(Trans.t('fuel filter price'))}
                    value={fuelFilterPrice ? fuelFilterPrice.toString() : null}
                    keyboardType='numeric'
                    onChangeText={filtroCombustivel => setFuelFilterPrice(Utils.toNumber(Utils.toNumericText(filtroCombustivel)))}
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
                        <Text style={[style.textCheckBox, { fontSize: DefaultStyles.dimensions.defaultLabelFontSize }]}>
                            {_.capitalize(Trans.t('air filter'))}
                        </Text>
                    </TouchableWithoutFeedback>
                </View> : false}

            {isAirFilterChecked && isFiltersEnabled ?
                <TextInput
                    {...DefaultProps.textInput}
                    style={DefaultStyles.textInput}
                    label={_.capitalize(Trans.t('air filter price'))}
                    value={airFilterPrice ? airFilterPrice.toString() : null}
                    keyboardType='numeric'
                    onChangeText={filtroAr => setAirFilterPrice(Utils.toNumber(Utils.toNumericText(filtroAr)))}
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
                        {_.capitalize(Trans.t('brand'))}
                    </Text>
                </TouchableWithoutFeedback>
            </View>

            {
                isOilBrandEnabled ? <TextInput
                    {...DefaultProps.textInput}
                    style={DefaultStyles.textInput}
                    label={_.capitalize(Trans.t('oil brand'))}
                    onChangeText={marcaOleo => setOilBrand(marcaOleo)}
                    value={oilBrand}
                    maxLength={25}
                /> : false
            }


        </BaseExpense>
    );
}

const style = StyleSheet.create({
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
    viewSwitch: {
        width: '100%',
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        marginBottom: 10
    }
});

export default OilExpense;