import React, { useState, useCallback } from 'react'
import { View, Switch, TouchableWithoutFeedback, Text } from 'react-native'
import DateComponent from '../../../components/expenses/DateComponent';
import { HelperText, TextInput } from 'react-native-paper';
import { DefaultProps } from '../../../DefaultProps';
import { DefaultStyles } from '../../../DefaultStyles';
import { useFocusEffect } from '@react-navigation/native';
import EditExpenseController from '../../../../controllers/EditExpenseController';
import _ from 'lodash';
import { BaseExpense } from './BaseExpense';
import { TotalValue } from '../../../components/expenses/TotalValue';
import Trans from '../../../../controllers/internatiolization/Trans';
import Utils from '../../../../controllers/Utils';
import { requestNotificationPermission } from '../../../components/Notification';

/**
 * Create/edit Tire expense
 * @param props 
 * @returns 
 * @author Bruno
 */
function TireExpense(props): JSX.Element {
    const [loading, setLoading] = useState(false);
    const [loaded, setLoaded] = useState(false);
    const [saving, setSaving] = useState(false);
    const [missingData, setMissingData] = useState(false);

    //default properties
    const [currentExpense, setCurrentExpense] = useState(null);
    const [totalValue, setTotalValue] = useState('');

    //specific properties
    const [tireService, setTireService] = useState(null);
    const [isReminderAlignmentEnabled, setIsReminderAlignmentEnabled] = useState(false);
    const [isReminderBalancingEnabled, setIsReminderBalancingEnabled] = useState(false);
    const [dateReminderAlignment, setDateReminderAlignment] = useState(null);
    const [dateReminderBalancing, setDateReminderBalancing] = useState(null);


    useFocusEffect(useCallback(() => {
        console.log('INIT TireExpense.useFocusEffect.useCallBack');
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
                        setTotalValue(Utils.toNumericText(dataExpense.totalValue || ''));

                        //specific properties
                        setTireService(dataExpense.othersdatas.typeService || null);
                        console.log(new Date(dataExpense.othersdatas.dateReminderAlignment.seconds * 1000 + dataExpense.othersdatas.dateReminderAlignment.nanoseconds / 1000000))
                        console.log(dataExpense.othersDatas.dateReminderAlignment.seconds, dataExpense.othersDatas.dateReminderAlignment.nanoseconds)
                        setDateReminderAlignment(new Date(dataExpense.othersDatas.dateReminderAlignment.seconds * 1000 + dataExpense.othersDatas.dateReminderAlignment.nanoseconds / 1000000) || null)
                        setDateReminderBalancing(new Date(dataExpense.othersdatas.dateReminderBalancing.seconds * 1000 + dataExpense.othersdatas.dateReminderBalancing.nanoseconds / 1000000) || null)
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
            typeService: tireService,
            dateReminderAlignment: dateReminderAlignment,
            dateReminderBalancing: dateReminderBalancing
        }
    }

    function clearStates() {
        setCurrentExpense(null);
        setTotalValue('');

        //specific properties
        setTireService(null);
        setDateReminderAlignment(null)
        setDateReminderBalancing(null)
    }

    return (
        <BaseExpense
            title='tire expense'
            type='TIRE'
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
                label={_.capitalize(Trans.t('service description'))}
                onChangeText={value => setTireService(value)}
                value={tireService}
            />
            <HelperText
                style={DefaultStyles.defaultHelperText}
                type="error"
                visible={false}
            >
                {_.capitalize(Trans.t('enter a value'))}
            </HelperText>

            <TotalValue totalValue={totalValue} setTotalValue={setTotalValue} missingData={missingData} />

            <View style={{ width: '100%', alignItems: 'flex-start', flexDirection: 'row', marginBottom: 10 }}>
                <Switch
                    trackColor={{ false: "#767577", true: "rgba(0,124,118,0.6)" }}
                    thumbColor={isReminderAlignmentEnabled ? "#007C76" : DefaultStyles.colors.fundoInput}
                    ios_backgroundColor="#3e3e3e"
                    onValueChange={enabled => {
                        if (enabled == true) requestNotificationPermission()
                        setIsReminderAlignmentEnabled(enabled)
                    }}
                    value={isReminderAlignmentEnabled}
                />
                <TouchableWithoutFeedback
                    onPress={() => {
                        if (!isReminderAlignmentEnabled) requestNotificationPermission()
                        setIsReminderAlignmentEnabled(!isReminderAlignmentEnabled)
                    }}
                >
                    <Text style={{ fontSize: DefaultStyles.dimensions.defaultLabelFontSize, color: DefaultStyles.colors.tabBar }}>
                        {_.capitalize(Trans.t('next alignment reminder'))}
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
                    onValueChange={enabled => {
                        if (enabled == true) requestNotificationPermission()
                        setIsReminderBalancingEnabled(enabled)
                    }}
                    value={isReminderBalancingEnabled}
                />
                <TouchableWithoutFeedback
                    onPress={() => {
                        if (!isReminderBalancingEnabled) requestNotificationPermission()
                        setIsReminderBalancingEnabled(!isReminderBalancingEnabled)
                    }}
                >
                    <Text style={{ fontSize: DefaultStyles.dimensions.defaultLabelFontSize, color: DefaultStyles.colors.tabBar }}>
                        {_.capitalize(Trans.t('next balancing reminder'))}
                    </Text>
                </TouchableWithoutFeedback>
            </View>

            {
                isReminderBalancingEnabled ? <DateComponent date={dateReminderBalancing} setDate={setDateReminderBalancing} /> : false
            }

        </BaseExpense>
    );
};

export default TireExpense;