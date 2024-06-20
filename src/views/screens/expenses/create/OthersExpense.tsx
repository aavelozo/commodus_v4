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
import { useFocusEffect } from '@react-navigation/native';
import EditExpenseController from '../../../../controllers/EditExpenseController';
import { BaseExpense } from './BaseExpense';
const { width, height } = Dimensions.get('window')

/******************************************************
** COMPONENTE DA VIEW PRINCIPAL                      **
******************************************************/
function OthersExpense(props): JSX.Element {
    const selectVehicleRef = useRef();
    const [loading,setLoading] = useState(false);    
    const [loaded,setLoaded] = useState(false); 
    const [saving,setSaving] = useState(false);
    const [missingData, setMissingData] = useState(false);

    //default properties
    const [currentExpense, setCurrentExpense] = useState(null);
    const [totalValue, setTotalValue] = useState(0);

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
                        setTotalValue(dataExpense.totalValue||0);

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
        setTotalValue(0);

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
                error={missingData && !description}
                keyboardType='default'
                label='* Descrição da despesa'
                onChangeText={value => setDescription(value)}
                value={description}
                maxLength={20}
            />

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
                    thumbColor={isReminder ? "#007C76" : DefaultStyles.colors.fundoInput}
                    ios_backgroundColor="#3e3e3e"
                    onValueChange={enabled => setIsReminder(enabled)}
                    value={isReminder}
                />
                <TouchableWithoutFeedback
                    onPress={() => setIsReminder(!isReminder)}
                >
                    <Text style={{ fontSize: DefaultStyles.dimensions.defaultLabelFontSize, color: DefaultStyles.colors.tabBar }}>
                        Lembrete revisão do serviço
                    </Text>
                </TouchableWithoutFeedback>
            </View>

            {
                isReminder ? <DateComponent date={dateReminder} setDate={setDateReminder} /> : false
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

});

export default OthersExpense;