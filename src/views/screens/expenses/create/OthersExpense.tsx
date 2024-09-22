import React, { useState, useCallback } from 'react'
import { View, Switch, TouchableWithoutFeedback, Text } from 'react-native'
import DateComponent from '../../../components/expenses/DateComponent';
import { HelperText, TextInput } from 'react-native-paper';
import { DefaultProps } from '../../../DefaultProps';
import { DefaultStyles } from '../../../DefaultStyles';
import { useFocusEffect } from '@react-navigation/native';
import EditExpenseController from '../../../../controllers/EditExpenseController';
import { BaseExpense } from './BaseExpense';
import { TotalValue } from '../../../components/expenses/TotalValue';
import Trans from '../../../../controllers/internatiolization/Trans';
import _ from 'lodash';
import Utils from '../../../../controllers/Utils';

/**
 * Create/edit Others expense
 * @param props 
 * @returns 
 * @author Bruno
 */
function OthersExpense(props): JSX.Element {
    const [loading,setLoading] = useState(false);    
    const [loaded,setLoaded] = useState(false); 
    const [saving,setSaving] = useState(false);
    const [missingData, setMissingData] = useState(false);

    //default properties
    const [currentExpense, setCurrentExpense] = useState(null);
    const [totalValue, setTotalValue] = useState('');

    //specific properties
    const [dateReminder, setDateReminder] = useState('')
    const [isReminder, setIsReminder] = useState(false)
    const [description, setDescription] = useState('')


    useFocusEffect(useCallback(() => {
        console.log('INIT OthersExpense.useFocusEffect.useCallBack');
        if (!loaded) {
            if (!loading) setLoading(true);

            //load expense data
            (async () => {
                try {
                    console.log('loading expense...');
                    console.log('EditExpenseController.currentExpense',EditExpenseController.currentExpense);
                    if (EditExpenseController.currentExpense) { 
                        console.log('loading states...');             
                        //default properties    
                        setCurrentExpense(EditExpenseController.currentExpense);  
                        let dataExpense = EditExpenseController.currentExpense.data();
                        setTotalValue(Utils.toNumericText(dataExpense.totalValue||''));

                        //specific properties
                        setDescription(dataExpense.othersdatas.description || null);
                        setDateReminder(dataExpense.othersdatas.dateReminder || null);
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
        if (!totalValue || !description) {
            result = true;
        } 
        setMissingData(result);
        return result;
    }

    function getOthersDatas() {
        return {
            description: description,
            dateReminder: dateReminder
        }
    }

    function clearStates(){
        setCurrentExpense(null);                
        setTotalValue('');

        //specific properties
        setDescription(null);
        setDateReminder(null);
    }
    
    return (
        <BaseExpense
            title='other expense'
            type='OTHER'
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
                label={`* ${_.capitalize(Trans.t('expense description'))}`}
                onChangeText={value => setDescription(value)}
                value={description}
                maxLength={20}
            />
            <HelperText
                style={DefaultStyles.defaultHelperText}            
                type="error"
                visible={missingData && !description}
            >
                {_.capitalize(Trans.t('enter a description'))}
            </HelperText>

            <TotalValue totalValue={totalValue} setTotalValue={setTotalValue} missingData={missingData}/>

            <View style={{ width: '100%', alignItems: 'flex-start', flexDirection: 'row', marginBottom: 10 }}>
                <Switch
                    trackColor={{ false: "#767577", true: "rgba(0,124,118,0.6)" }}
                    thumbColor={isReminder ? "#007C76" : DefaultStyles.colors.fundoInput}
                    ios_backgroundColor="#3e3e3e"
                    onValueChange={enabled => setIsReminder(enabled)}
                    value={isReminder}
                />
                <TouchableWithoutFeedback
                    onPress={() => setIsReminder(!isReminder)}
                >
                    <Text style={{ fontSize: DefaultStyles.dimensions.defaultLabelFontSize, color: DefaultStyles.colors.tabBar }}>
                        {_.capitalize(Trans.t('service review reminder'))}
                    </Text>
                </TouchableWithoutFeedback>
            </View>

            {
                isReminder ? <DateComponent date={dateReminder} setDate={setDateReminder} /> : false
            }

        </BaseExpense>
    );
};


export default OthersExpense;