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
import Trans from '../../../../controllers/internatiolization/Trans';
const { width, height } = Dimensions.get('window');
import _ from 'lodash';
import { BaseExpense } from './BaseExpense';



/******************************************************
** COMPONENTE DA VIEW PRINCIPAL                      **
******************************************************/
function TyreExpense(props): JSX.Element {
    const selectVehicleRef = useRef();
    const [loading, setLoading] = useState(false);
    const [loaded, setLoaded] = useState(false);
    const [saving, setSaving] = useState(false);
    const [missingData, setMissingData] = useState(false);

    //default properties
    const [currentExpense, setCurrentExpense] = useState(null);
    const [totalValue, setTotalValue] = useState(0);

    //specific properties
    const [tyreService, setTyreService] = useState(null);
    const [isReminderAlignmentEnabled, setIsReminderAlignmentEnabled] = useState(false);
    const [isReminderBalancingEnabled, setIsReminderBalancingEnabled] = useState(false);
    const [dateReminderAlignment, setDateReminderAlignment] = useState(null);
    const [dateReminderBalancing, setDateReminderBalancing] = useState(null);


    useFocusEffect(useCallback(() => {
        console.log('INIT TyreExpense.useFocusEffect.useCallBack');
        if (!loaded) {
            if (!loading) setLoading(true);

            //load expense data
            (async () => {
                try {
                    console.log('loading expense...');
                    console.log('EditExpenseController.currentExpense', EditExpenseController.currentExpense);
                    if (EditExpenseController.currentExpense) {
                        console.log('loading states...');
                        //default properties    
                        setCurrentExpense(EditExpenseController.currentExpense);
                        let dataExpense = EditExpenseController.currentExpense.data();
                        setTotalValue(dataExpense.totalValue || 0);

                        //specific properties
                        setTyreService(dataExpense.othersdatas.typeService || null);
                        console.log(new Date(dataExpense.othersdatas.dateReminderAlignment.seconds * 1000 + dataExpense.othersdatas.dateReminderAlignment.nanoseconds / 1000000))
                        console.log(dataExpense.othersDatas.dateReminderAlignment.seconds, dataExpense.othersDatas.dateReminderAlignment.nanoseconds)
                        setDateReminderAlignment(new Date(dataExpense.othersDatas.dateReminderAlignment.seconds * 1000 + dataExpense.othersDatas.dateReminderAlignment.nanoseconds / 1000000) || null)
                        setDateReminderBalancing(new Date(dataExpense.othersdatas.dateReminderBalancing.seconds * 1000 + dataExpense.othersdatas.dateReminderBalancing.nanoseconds / 1000000)|| null)
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


    function isMissingData() {
        let result = false;
        if (!totalValue) {
            result = true;
        } 
        setMissingData(result);
        return result;
    }

    function getOthersDatas() {
        return {
            typeService: tyreService,
            dateReminderAlignment: dateReminderAlignment,
            dateReminderBalancing: dateReminderBalancing
        }
    }

    function clearStates() {
        setCurrentExpense(null);
        setTotalValue(0);

        //specific properties
        setTyreService(null);
        setDateReminderAlignment(null)
        setDateReminderBalancing(null)
    }

    return (
        <BaseExpense
            title='tyre expense'
            type='TYRE'
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
                error={missingData && !totalValue}
                keyboardType='numeric'
                label='* Valor Total'
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

        </BaseExpense>
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